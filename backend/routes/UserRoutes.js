const fs = require("fs").promises;
const express = require("express");
const multer = require("multer");
const sharp = require("sharp");

const router = express.Router();

const config = require("../config");
const UserModel = require("../models/UserModel");
const { validate, errorHandler, idParamValidator, adminValidator } = require("../util/RouteUtils");
const { uploadFileStream, deleteFileAWS, getFileStream } = require("../util/S3Util");

const upload = multer({
  dest: "server_uploads/",
  fileFilter: (req, file, cb) => cb(null, file.mimetype.indexOf("image") > -1),
  limits: { fileSize: config.amazons3.max_file_size, files: 1 },
});

// returns all users
router.get("/users", (req, res) =>
  UserModel.find()
    .then((users) => res.json({ users }))
    .catch(errorHandler(res))
);

router.get("/info/:id?", idParamValidator(true), (req, res) =>
  UserModel.findById(req.params.id ?? req.user._id)
    .then((user) =>
      res.json({
        user: user.toJSON(),
        sameUser: user._id.toString() === req.user._id.toString(),
      })
    )
    .catch(errorHandler(res))
);

router.put("/verify/:id", idParamValidator(), adminValidator, (req, res) =>
  UserModel.findByIdAndUpdate(req.params.id, { verified: true })
    .then(() => res.status(200).json({ success: true }))
    .catch(errorHandler(res))
);

router.put("/promote/:id", idParamValidator(), adminValidator, (req, res) =>
  UserModel.findByIdAndUpdate(req.params.id, { admin: true })
    .then(() => res.status(200).json({ success: true }))
    .catch(errorHandler(res))
);

router.delete("/delete/:id", idParamValidator(), adminValidator, (req, res) =>
  UserModel.deleteOne({ _id: req.params.id })
    .then(() => res.json({ success: true }))
    .catch(errorHandler(res))
);

router.put("/updatepass", validate(["old_pass", "new_pass"], []), (req, res) =>
  UserModel.findById(req.user._id)
    .then((user) => Promise.all([user, user.isValidPassword(req.body.old_pass)]))
    .then(([user, valid]) => {
      if (!valid) {
        return Promise.all(["Incorrect current password."]);
      }
      Object.assign(user, {
        password: req.body.new_pass,
      });
      return Promise.all([false, user.save()]);
    })
    .then(([error]) => {
      if (!error) res.json({ success: true });
      else res.status(403).json({ error });
    })
    .catch(errorHandler(res))
);

router.put("/edit/:id", idParamValidator(), (req, res) =>
  UserModel.findById(req.user._id)
    .then((user) => {
      if (req.params.id !== req.user._id && user.admin) return UserModel.findById(req.params.id);
      if (req.params.id === req.user._id) return user;
      throw new Error("Access denied.");
    })
    .then((user) => {
      Object.assign(
        user,
        req.body.name && { name: req.body.name },
        req.body.email && { email: req.body.email }
      );
      return user.save();
    })
    .catch(errorHandler(res))
);

/**
 * PROFILE PICTURES
 */
router.get("/pfp/:id/:time", (req, res) => {
  UserModel.findById(req.params.id)
    .then((user) => {
      res.set("Content-Type", "image/png");
      res.set("Cache-Control", "max-age=31536000");
      if (!user.profilePicture) res.redirect("/img/no_profile_pic.svg");
      else getFileStream(user.profilePicture).pipe(res);
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

      return Promise.all([
        user.toJSON(),
        user.save(),
        old ? deleteFileAWS(old) : null,
        fs.unlink(req.file.path),
      ]);
    })
    .then(([user]) => res.json({ success: true, user }))
    .catch(errorHandler(res));
});

module.exports = router;
