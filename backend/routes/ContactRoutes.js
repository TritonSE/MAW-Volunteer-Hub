const fs = require("fs").promises;
const express = require("express");
const multer = require("multer");
const sharp = require("sharp");

const router = express.Router();
const config = require("../config");

const Contact = require("../models/ContactModel");
const {
  validate,
  idParamValidator,
  adminValidator,
  errorHandler,
  primaryAdminValidator,
} = require("../util/RouteUtils");

const { uploadFileStream, deleteFileAWS, getFileStream } = require("../util/S3Util");

const upload = multer({
  dest: "server_uploads/",
  fileFilter: (req, file, cb) => cb(null, file.mimetype.indexOf("image") > -1),
  limits: { fileSize: config.amazons3.max_file_size, files: 1 },
});

router.post(
  "/add",
  upload.single("pfp"),
  // validate(["name", "phone", "position", "organization", "email", "pfp", "crop"]),
  (req, res) => {
    // console.log(req.pfp);

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
      Contact.create({
        name: req.body.name,
        position: req.body.position,
        organization: req.body.organization,
        email: req.body.email,
        phone: req.body.phone,
      }),
      uploadFileStream(
        compressor,
        `pfp/${req.file.filename}-${Date.now()}-${Math.round(Math.random() * 1e9)}`
      ),
    ])
      .then(([contact, result]) => {
        const old = contact.profilePicture;

        Object.assign(contact, {
          profilePicture: result.key,
          profilePictureModified: new Date(),
        });

        return Promise.all([
          contact.toJSON(),
          contact.save(),
          old ? deleteFileAWS(old) : null,
          fs.unlink(req.file.path),
        ]);
      })
      .then(([contact]) => res.json({ success: true, contact }))
      .catch(errorHandler(res));
  }
);

router.get("/all", (req, res) => {
  Contact.find()
    .then((users) => res.json({ users }))
    .catch(errorHandler(res));
});

router.delete("/delete/:id", idParamValidator(), (req, res) => {
  Contact.findOne({ _id: req.params.id })
    .then((contact) => {
      const old = contact.profilePicture;

      return Promise.all([
        Contact.deleteOne({ _id: req.params.id }),
        old ? deleteFileAWS(old) : null,
      ]);
    })
    .then(() => res.json({ success: true }))
    .catch(errorHandler(res));
});

router.patch("/edit/:id", idParamValidator(), (req, res) => {
  Contact.findById(req.params.id)
    .then((contact) => {
      Object.assign(contact, {
        name: req.body.updated_name ? req.body.updated_name : contact.name,
        position: req.body.updated_position ? req.body.updated_position : contact.position,
        organization: req.body.updated_org ? req.body.updated_org : contact.organization,
        email: req.body.updated_email ? req.body.updated_email : contact.email,
        phone: req.body.updated_phone ? req.body.updated_phone : contact.phone,
      });
      contact.save();
    })
    .then(() => res.json({ success: true }))
    .catch(errorHandler(res));
});

/**
 * PROFILE PICTURES
 */
router.get("/pfp/:id/:time", (req, res) => {
  Contact.findById(req.params.id)
    .then((user) => {
      res.set("Content-Type", "image/png");
      res.set("Cache-Control", "max-age=31536000");
      if (!user.profilePicture) res.redirect("/img/contact_icon.svg");
      else getFileStream(user.profilePicture).pipe(res);
    })
    .catch(errorHandler(res));
});

// router.post("/pfp/upload", upload.single("pfp"), (req, res) => {
//   Promise.all([
//     Contact.findById(req.contact._id),
//     uploadFileStream(
//       compressor,
//       `pfp/${req.file.filename}-${Date.now()}-${Math.round(Math.random() * 1e9)}`
//     ),
//   ])
//     .then(([contact, result]) => {
//       const old = contact.profilePicture;

//       Object.assign(contact, {
//         profilePicture: result.key,
//         profilePictureModified: new Date(),
//       });

//       return Promise.all([
//         contact.toJSON(),
//         contact.save(),
//         old ? deleteFileAWS(old) : null,
//         fs.unlink(req.file.path),
//       ]);
//     })
//     .then(([contact]) => res.json({ success: true, contact }))
//     .catch(errorHandler(res));
// });

module.exports = router;
