const express = require("express");
const multer = require("multer");
const fs = require("fs").promises;

let ft = import("file-type").then((module) => {
  ft = module;
});

const { uploadFile, getFileStream, deleteFileAWS, getContentType } = require("../util/S3Util");
const Category = require("../models/CategoryModel");
const File = require("../models/FileModel");
const validate = require("../util/ParamValidator");

const router = express.Router();
const upload = multer({ dest: "server_uploads/" });

router.post("/upload", upload.single("file"), validate(["name", "category"]), (req, res) => {
  uploadFile(req.file)
    .then((result) =>
      Promise.all([
        Category.findById(req.body.category),
        File.create({
          name: req.body.name,
          userID: req.user._id,
          Category_ID: req.body.category,
          S3_ID: result.key,
        }),
        fs.unlink(req.file.path),
      ])
    )
    .then(([category, file]) => {
      category.Files.push(file);
      return category.save();
    })
    .then(() => res.json({ success: true }))
    .catch(() => res.status(500).json({ error: true }));
});

router.get("/display/:id", validate([], ["id"]), (req, res) => {
  File.findById(req.params.id)
    .then((file) => {
      const stream = getFileStream(file.S3_ID);
      stream.pipe(res);
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ error: true });
    });
});

router.delete("/delete/:id", validate([], ["id"]), (req, res) => {
  File.findById(req.params.id)
    .then((file) =>
      Promise.all([
        Category.findById(file.Category_ID),
        deleteFileAWS(file.S3_ID),
        File.deleteOne({ _id: req.params.id }),
      ])
    )
    .then(([cat]) => {
      const arr = cat.Files.slice();
      arr.splice(
        arr.findIndex((a) => a._id.equals(req.params.id)),
        1
      );
      cat.Files = arr;
      return cat.save();
    })
    .then(() => res.json({ success: true }))
    .catch((e) => {
      console.log(e);
      res.status(500).json({ error: true });
    });
});

router.patch(
  "/update/:id",
  upload.single("file"),
  validate(["updated_file_name"], ["id"]),
  (req, res) => {
    File.findById(req.params.id)
      .then((file) => {
        const arr = [file];
        if (req.file) {
          arr.push(uploadFile(req.file), deleteFileAWS(file.S3_ID));
        }
        return Promise.all(arr);
      })
      .then(([file, result]) => {
        Object.assign(file, {
          S3_ID: result ? result.key : file.S3_ID,
          name: req.body.updated_file_name ?? file.name,
        });
        return Promise.all([file, Category.findById(file.Category_ID), file.save()]);
      })
      .then(([file, category]) => {
        const arr = category.Files.slice();
        arr[category.Files.findIndex((f) => f._id.equals(file._id))] = file;
        category.Files = arr;
        return category.save();
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
