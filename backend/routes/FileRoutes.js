const express = require("express");
const mime = require("mime-types");

let ft = import("file-type").then((module) => {
  ft = module;
});

const { upload, getObject, deleteFileAWS } = require("../util/S3Util");
const Category = require("../models/CategoryModel");
const File = require("../models/FileModel");
const { validate, errorHandler, adminValidator } = require("../util/RouteUtils");

const router = express.Router();

router.post("/upload", upload.single("file"), validate(["name", "category"]), (req, res) => {
  Promise.all([
    Category.findById(req.body.category),
    File.create({
      name: req.body.name,
      userID: req.user._id,
      Category_ID: req.body.category,
      S3_ID: req.file.key,
    }),
  ])
    .then(([category, file]) => {
      category.Files.push(file);
      return category.save();
    })
    .then(() => res.json({ success: true }))
    .catch(errorHandler(res));
});

router.get("/display/:id", validate([], ["id"]), (req, res) => {
  File.findById(req.params.id)
    .then((file) => {
      const obj = getObject(file.S3_ID);
      obj.on("httpHeaders", (_code, headers) => {
        res.set("Content-Length", headers["content-length"]);
      });
      return Promise.all([file, ft.fileTypeFromStream(obj.createReadStream())]);
    })
    .then(([file, type]) => {
      if (type && type.mime) res.set("Content-Type", type.mime);
      else res.set("Content-Type", mime.lookup(file.name));
      getObject(file.S3_ID).createReadStream().pipe(res);
    })
    .catch(errorHandler(res));
});

router.delete("/delete/:id", adminValidator, validate([], ["id"]), (req, res) => {
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
    .catch(errorHandler(res));
});

router.patch(
  "/update/:id",
  adminValidator,
  upload.single("file"),
  validate(["updated_file_name"], ["id"]),
  (req, res) => {
    File.findById(req.params.id)
      .then((file) => {
        const old = file.S3_ID;

        Object.assign(file, {
          S3_ID: req.file ? req.file.key : old,
          name: req.body.updated_file_name ?? file.name,
        });

        return Promise.all([
          file,
          Category.findById(file.Category_ID),
          file.save(),
          req.file ? deleteFileAWS(old) : null,
        ]);
      })
      .then(([file, category]) => {
        const arr = category.Files.slice();
        arr[category.Files.findIndex((f) => f._id.equals(file._id))] = file;
        category.Files = arr;
        return category.save();
      })
      .then(() => res.json({ success: true }))
      .catch(errorHandler(res));
  }
);

router.get("/search/:name", validate([], ["name"]), (req, res) => {
  File.find({ name: req.params.name })
    .then((file) => res.json(file))
    .catch(errorHandler(res));
});

router.get("/all", (_req, res) => {
  File.find()
    .then((file) => res.json(file))
    .catch(errorHandler(res));
});

module.exports = router;
