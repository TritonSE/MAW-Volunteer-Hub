const fs = require("fs").promises;
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const sharp = require("sharp");

const router = express.Router();

const UserModel = require("../models/UserModel");
const { uploadFileStream, deleteFileAWS, getFileStream } = require("../util/S3Util");
const { errorHandler } = require("../util/RouteUtils");
const config = require("../config");

const upload = multer({
  dest: "server_uploads/",
  fileFilter: (req, file, cb) => cb(null, file.mimetype.indexOf("image") > -1),
  limits: { fileSize: config.amazons3.max_file_size, files: 1 },
});

function validateIdParam(req, res) {
  if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).send("Invalid user id passed into user route");
    return true;
  }
  return false;
}
// if current user is not an admin, then sends a 401 unauthorized
function checkCurrentUserIsAdmin(req, res, next) {
  const currentUserId = req.user._id;
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
router.get("/info/:id?", (req, res, next) => {
  // check if there is an id param and that it is a valid id
  if (req.params.id && validateIdParam(req, res)) {
    return;
  }

  UserModel.findById(
    req.params.id ?? req.user._id,
    { name: 1, _id: 0, email: 1, profilePicture: 1, roles: 1, joinDate: 1, createdAt: 1 },
    (err, user) => {
      if (err) {
        next(err);
      }

      if (!user) {
        // checks if a user was found with id
        res.status(404).send("No user found with provided id");
      } else {
        const currentUserId = req.user._id;
        const sameUser = currentUserId === (req.params.id ?? req.user._id);
        res.status(200).json({ user, sameUser });
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
  const userId = req.user._id;
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
router.get("/pfp", (req, res) => {
  res.redirect(`/user/pfp/${req.user._id}`);
});

router.get("/pfp/:id/:time?", (req, res) => {
  UserModel.findById(req.params.id)
    .then((user) => {
      if (!req.params.time)
        res.redirect(`/user/pfp/${req.params.id}/${user.profilePictureModified.getTime()}`);
      else {
        res.set("Content-Type", "image/png");
        res.set("Cache-Control", "max-age=604800");
        if (!user.profilePicture) res.redirect("/img/no_profile_pic.svg");
        else getFileStream(user.profilePicture).pipe(res);
      }
    })
    .catch(errorHandler(res));
});

router.post("/pfp/upload", upload.single("pfp"), (req, res) => {
  const crop = JSON.parse(req.body.crop);

  let compressor = sharp(req.file.path);
  if (crop.width && crop.height && crop.left && crop.top) {
    compressor = compressor.extract(crop);
  }
  compressor = compressor.resize(400, 400).png({
    compressionLevel: 9,
    adaptiveFiltering: true,
    force: true,
  });

  Promise.all([
    UserModel.findById(req.user._id),
    uploadFileStream(
      compressor,
      `pfp/${req.file.filename}-${Date.now()}-${Math.round(Math.random() * 1e9)}`
    ),
  ])
    .then(([user, result]) => {
      const old = user.profilePicture;

      Object.assign(user, {
        profilePicture: result.key,
        profilePictureModified: new Date(),
      });

      return Promise.all([user.save(), old ? deleteFileAWS(old) : null, fs.unlink(req.file.path)]);
    })
    .then(() => res.json({ success: true }))
    .catch(errorHandler(res));
});

module.exports = router;
