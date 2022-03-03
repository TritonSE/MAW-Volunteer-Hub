const fs = require("fs").promises;
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const im = require("imagemagick");
const util = require("util");

const router = express.Router();

const UserModel = require("../models/UserModel");
const { uploadFile, deleteFileAWS, getFileStream } = require("../util/S3Util");
const { idOfCurrentUser } = require("../util/userUtil");
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
  checkCurrentUserIsAdmin(req, res, () => {
    UserModel.find()
      .then((users) => res.status(200).json({ users }))
      .catch((e) => res.status(400).send("An error occurred fetching users"));
  });
});

// Get user by id - Will return an object with only the user profile information
// if no id provided, returns information for current user
router.get("/info/:id?", (req, res, next) => {
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
        const sameUser = currentUserId === req.params.id;
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
router.get("/pfp/:id?", (req, res) => {
  UserModel.findById(req.params.id ?? req.user._id)
    .then((user) => {
      res.set("Content-Type", "image/png");
      if (!user.profilePicture) {
        res.redirect("/img/no_profile_pic.svg");
      } else {
        const stream = getFileStream(user.profilePicture);
        stream.pipe(res);
      }
    })
    .catch(errorHandler(res));
});

router.post("/pfp/upload", upload.single("pfp"), (req, res) => {
  const crop = JSON.parse(req.body.crop);

  util
    .promisify(im.convert)([
      req.file.path,
      "-crop",
      `${crop.width}x${crop.height}+${crop.x}+${crop.y}`,
      "-resize",
      "400x400^",
      "-quality",
      "85",
      `${req.file.path}.png`,
    ])
    .then(() =>
      Promise.all([
        UserModel.findById(req.user._id),
        uploadFile({
          path: `${req.file.path}.png`,
          filename: `pfp/${req.file.filename}-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
        }),
      ])
    )
    .then(([user, result]) => {
      const old = user.profilePicture;

      Object.assign(user, {
        profilePicture: result.key,
      });

      return Promise.all([
        user.save(),
        old ? deleteFileAWS(old) : null,
        fs.unlink(req.file.path),
        fs.unlink(`${req.file.path}.png`),
      ]);
    })
    .then(() => res.json({ success: true }))
    .catch(errorHandler(res));
});

module.exports = router;
