const fs = require("fs").promises;
const express = require("express");
const multer = require("multer");
const sharp = require("sharp");

const router = express.Router();

const config = require("../config");
const UserModel = require("../models/UserModel");
const {
  validate,
  errorHandler,
  idParamValidator,
  adminValidator,
  primaryAdminValidator,
} = require("../util/RouteUtils");
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

router.put("/verify/:id", idParamValidator(), primaryAdminValidator, (req, res) =>
  UserModel.findByIdAndUpdate(req.params.id, { verified: true })
    .then(() => res.status(200).json({ success: true }))
    .catch(errorHandler(res))
);

router.put("/promote/:id", idParamValidator(), primaryAdminValidator, (req, res) =>
  UserModel.findByIdAndUpdate(req.params.id, { admin: true })
    .then(() => res.status(200).json({ success: true }))
    .catch(errorHandler(res))
);

router.delete("/delete/:id", idParamValidator(), primaryAdminValidator, (req, res) =>
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

  let compressor = sharp(req.file.path).rotate();
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

/**
 * ROLES
 */
// Take a list of roles, roles, of what the final role state should be
router.patch(
  "/set-roles/:id",
  idParamValidator(),
  validate(["roles"], []),
  adminValidator,
  (req, res) => {
    const roles = JSON.parse(req.body.roles);
    const keyroles = [
      "Wish Granter",
      "Volunteer",
      "Mentor",
      "Airport Greeter",
      "Office",
      "Special Events",
      "Translator",
      "Speaker's Bureau",
      "Las Estrellas",
      "Primary Admin",
      "Secondary Admin",
    ];
    // validate roles based on keyroles
    if (!roles.every((element) => keyroles.includes(element))) {
      res.status(400).json({ error: "Invalid roles input." });
      return;
    }

    UserModel.findById(req.params.id)
      .then((user) => {
        const is_primary = user.admin === 2;
        const will_be_primary = roles.includes("Primary Admin");
        if (is_primary && !will_be_primary) {
          // throw an error if they are trying to remove primary admin from an account that isn't their own
          if (user._id.toString() !== req.user._id.toString()) {
            throw new URIError("Unable to remove primary admin status from another user.");
          }
          // only allow yourself to remove admin if there is at least one other primary admin
          return Promise.all([user, UserModel.find({ admin: 2 })]);
        }
        if (!is_primary && will_be_primary && req.user.admin < 2) {
          throw new URIError("Insufficient permissions to make user a primary admin.");
        }
        return Promise.all([user, null]);
      })
      .then(([user, primary_admins]) => {
        if (primary_admins && primary_admins.length <= 1) {
          throw new URIError("Unable to remove primary admin status from final primary admin.");
        }

        // Reset user admin state based on highest level of admin found in role array
        user.admin = 0;

        if (roles.includes("Secondary Admin")) {
          user.admin = 1;
          roles.splice(roles.indexOf("Secondary Admin"), 1);
        }

        // Primary Admin state validated as middleware and p.a. removal handled by first if
        if (roles.includes("Primary Admin")) {
          user.admin = 2;
          roles.splice(roles.indexOf("Primary Admin"), 1);
        }

        user.roles = roles;
        return user.save();
      })
      .then(() => res.json({ success: true }))
      .catch((err) => {
        // Use specific error type to give the user an error message
        //   for bad input data (rather than just "Internal server error.")
        if (err instanceof URIError) {
          res.status(403).json({ error: err.message });
        } else {
          errorHandler(res);
        }
      });
  }
);

router.get("/role/:role", (req, res) =>
  UserModel.find({ roles: req.params.role })
    .then((users) => res.json(users))
    .catch(errorHandler(res))
);

router.post("/newmanual/:id", (req, res) => {
  if (req.user._id.toString() !== req.params.id && req.user.admin !== 2) {
    res.status(403).json({ error: "Access denied. " });
    return;
  }

  UserModel.findById(req.params.id)
    .then((user) => {
      const date = new Date(req.body.date);
      const title = req.body.title;
      const hours = Number.parseInt(req.body.hours, 10);

      if (date === "Invalid Date") {
        throw new Error("Invalid event date.");
      }
      if (title.trim() === "") {
        throw new Error("Invalid event title.");
      }
      if (Number.isNaN(hours) || hours < 0) {
        throw new Error("Invalid event duration.");
      }

      user.manualEvents.push({
        date,
        title,
        hours,
      });
      return user.save();
    })
    .then(() => res.json({ success: true }))
    .catch(errorHandler);
});

router.delete("/delmanual/:id/:event_id", (req, res) => {
  if (req.user._id.toString() !== req.params.id && req.user.admin !== 2) {
    res.status(403).json({ error: "Access denied. " });
    return;
  }

  UserModel.findById(req.params.id)
    .then((user) => {
      const index = user.manualEvents.findIndex(
        ({ _id }) => _id.toString() === req.params.event_id
      );
      user.manualEvents.splice(index, 1);
      return user.save();
    })
    .then(() => res.json({ success: true }))
    .catch(errorHandler);
});

router.patch("/editmanual/:id/:event_id", (req, res) => {
  if (req.user._id.toString() !== req.params.id && req.user.admin !== 2) {
    res.status(403).json({ error: "Access denied. " });
    return;
  }

  UserModel.findById(req.params.id)
    .then((user) => {
      const index = user.manualEvents.findIndex(
        ({ _id }) => _id.toString() === req.params.event_id
      );
      const man_event = user.manualEvents[index];
      Object.entries(req.body).forEach(([key, value]) => {
        man_event[key] = value;
      });
      return user.save();
    })
    .then(() => res.json({ success: true }))
    .catch(errorHandler);
});

module.exports = router;
