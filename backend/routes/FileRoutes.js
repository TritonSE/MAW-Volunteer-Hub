const express = require("express");
const multer = require("multer");
const fs = require("fs");

const { uploadFile, getFileStream, deleteFileAWS } = require("../util/S3Util");
const Category = require("../models/CategoryModel");
const File = require("../models/FileModel");
const validate = require("../util/ParamValidator");

const router = express.Router();
const upload = multer({ dest: "server_uploads/" });

router.post("/upload", upload.single("file"), validate(["name", "category"]), (req, res) => {
  uploadFile(req.file)
    .then((result) => {
      fs.unlinkSync(req.file.path);
      return File.create({
        name: req.body.name,
        userID: req.user._id,
        Category_ID: req.body.category,
        S3_ID: result.key,
      });
    })
    .then((sent) => Promise.all([Category.findById(sent.Category_ID), sent]))
    .then(([category, sent]) => {
      category.Files.push(sent);
      category.save();
    })
    .then(() => res.json({ success: true }))
    .catch(() => res.status(500).json({ error: true }));
});

router.get("/display/:id", validate([], ["id"]), (req, res) => {
  File.findById(req.params.id)
    .then((file) => getFileStream(file.S3_ID).pipe(res))
    .catch(() => res.status(500).json({ error: true }));
});

router.delete("/delete/:id", validate([], ["id"]), (req, res) => {
  File.findById(req.params.id)
    .then((file) => deleteFileAWS(file.S3_ID))
    .then(() => File.deleteOne({ _id: req.params.id }))
    .then(() => res.json({ success: true }))
    .catch(() => res.status(500).json({ error: true }));
});

router.patch(
  "/update/:id",
  upload.single("file"),
  validate(["updated_file_name"], ["id"]),
  (req, res) => {
    File.findById(req.params.id)
      .then((file) => [deleteFileAWS(file.S3_ID), file])
      .then(([_resp, file]) => [uploadFile(req.file), file])
      .then(([result, file]) => {
        const options = {};
        if (req.file) options.S3_ID = result.key;
        if (req.body.updated_file_name) options.name = req.body.updated_file_name;
        Object.assign(file, options);
        file.save();
      })
      .then(() => res.json({ success: true }))
      .catch(() => res.status(500).json({ error: true }));
  }
);

router.get("/search/:name", validate([], ["name"]), (req, res) => {
  File.find({ name: req.params.name })
    .then((file) => res.json(file))
    .catch(() => res.status(500).json({ error: true }));
});

module.exports = router;
