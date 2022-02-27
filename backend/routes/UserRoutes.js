const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");

const router = express.Router();
const upload = multer({ dest: "server_uploads/" });

const UserModel = require("../models/UserModel");
const { uploadFile, deleteFileAWS, getFileStream } = require("../util/S3Util");
const { idOfCurrentUser } = require("../util/userUtil");
const { errorHandler } = require("../util/RouteUtils");

function validateIdParam(req, res) {
  if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).send("Invalid user id passed into user route");
    return true;
  }
  return false;
}
// if current user is not an admin, then sends a 401 unauthorized
function checkCurrentUserIsAdmin(req, res, next) {
  const currentUserId = idOfCurrentUser(req);
  UserModel.findById(currentUserId, { admin: 1 }, (err, user) => {
    if (err) {
      next(err);
      return;
    }

    if (!user) {
      res.status(500).send("JWT expired");
    } else if (!user.admin) {
      res.status(401).send("Current user is not an admin");
    } else {
      next();
    }
  });
}

router.get("/users", (req, res, next) => {
  if (req.query.admin) {
    try {
      UserModel.find({ admin: req.query.admin }).then((users) => res.status(200).json({ users })); // return users found
    } catch (e) {
      next(e);
    }
  } else {
    // prevent route from hanging if no query param passed in
    res.status(400).send("No query param passed in to users route");
  }
});

// Get user by id - Will return an object with only the user profile information
router.get("/info/:id", (req, res, next) => {
  // check if there is an id param and that it is a valid id
  if (validateIdParam(req, res)) {
    return;
  }

  UserModel.findById(
    req.params.id,
    { name: 1, _id: 0, email: 1, profilePicture: 1, roles: 1, joinDate: 1 },
    (err, user) => {
      if (err) {
        next(err);
      }

      if (!user) {
        // checks if a user was found with id
        res.status(404).send("No user found with provided id");
      } else {
        res.status(200).json(user);
      }
    }
  );
});

// finds user by id then verifies user
router.put("/verify/:id", (req, res, next) => {
  if (validateIdParam(req, res)) {
    return;
  }

  checkCurrentUserIsAdmin(req, res, () => {
    UserModel.findByIdAndUpdate(req.params.id, { verified: true })
      .then(() => res.status(200).send())
      .catch((err) => {
        next(err);
      });
  });
});

// finds user by id then updates user to admin (can only be done byan admin)
router.put("/promoteadmin/:id", async (req, res, next) => {
  if (validateIdParam(req, res)) {
    return;
  }

  checkCurrentUserIsAdmin(req, res, () => {
    UserModel.findByIdAndUpdate(req.params.id, { admin: true })
      .then(() => res.status(200).send())
      .catch((err) => {
        next(err);
      });
  });
});

// edits user information
// can only be done by an admin or a logged-in user if they are the same as the user who's info is being editted)
router.put("/edit/:id", async (req, res, next) => {
  if (validateIdParam(req, res)) {
    return;
  }
  const userId = idOfCurrentUser(req);
  // we only want the user to be able to update these pieces of their profile
  const sanitizedBody = {};
  if (req.body.name) sanitizedBody.name = req.body.name;
  if (req.body.email) sanitizedBody.email = req.body.email;
  if (req.body.profilePicture) sanitizedBody.profilePicture = req.body.profilePicture;

  // function that updates user info based on sanitized body
  const updateInfo = () => {
    try {
      UserModel.findByIdAndUpdate({ _id: req.params.id }, { $set: sanitizedBody }, { new: true })
        .then((user) => {
          if (user) {
            res.status(200).json(user);
          } else {
            res.status(400).send();
          }
        })
        .catch((err) => {
          if (err.keyPattern.email === 1) {
            res.status(400).json("This email is already taken");
          }
        });
    } catch (err) {
      next(err);
    }
  };

  // if user is current user, or if current user is an admin
  if (userId === req.params.id) {
    updateInfo();
  } else {
    checkCurrentUserIsAdmin(req, res, updateInfo);
  }
});

/**
 * PROFILE PICTURES
 */
router.get("/pfp/:id?", (req, res) => {
  UserModel.findById(req.params.id ?? req.user._id)
    .then((user) => {
      res.set("Content-Type", "image/png");
      if (!user.profilePicture) {
        res.write(user.defaultProfilePicture, "binary");
        res.end(null, "binary");
      } else {
        const stream = getFileStream(user.profilePicture);
        stream.pipe(res);
      }
    })
    .catch(errorHandler(res));
});

router.post("/pfp/upload", upload.single("pfp"), (req, res) => {
  // TODO: Validate file, transform it, convert it, etc.
  //   Also -- this is a bit weird, but it works and
  //   doesn't have any race conditions.
  Promise.all([uploadFile(req.file, "pfp/"), UserModel.findById(req.user._id)])
    .then(([result, user]) =>
      Promise.all([result, user, user.profilePicture ? deleteFileAWS(user.profilePicture) : null])
    )
    .then(([result, user]) =>
      // TODO: Why doesn't .save() work?  Same as signup, investigate
      UserModel.updateOne(
        { email: user.email },
        {
          $set: {
            profilePicture: result.key,
          },
        }
      )
    )
    .then(() => res.json({ success: true }))
    .catch(errorHandler(res));
});

module.exports = router;
