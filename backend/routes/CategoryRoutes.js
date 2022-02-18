const express = require("express");
const Archiver = require("archiver");

const File = require("../models/FileModel");
const Category = require("../models/CategoryModel");
const validate = require("../util/ParamValidator");
const { deleteFileAWS, getFileStream } = require("../util/S3Util");

const router = express.Router();

router.get("/all/:parent", validate([], ["parent"]), (req, res) => {
  Category.find({ parent: req.params.parent })
    .then((files) => res.json(files))
    .catch(() => res.status(500).json({ error: true }));
});

router.get("/one/:id", validate([], ["id"]), (req, res) => {
  Category.findById(req.params.id)
    .then((category) => res.json(category))
    .catch(() => res.status(500).json({ error: true }));
});

router.delete("/delete/:id", validate([], ["id"]), (req, res) => {
  Category.findById(req.params.id)
    .then((category) => {
      Promise.all(
        category.Files.map((file) => [
          deleteFileAWS(file.S3_ID),
          File.deleteOne({ name: file.name }),
        ]).flat()
      );
    })
    .then(() => Category.findByIdAndDelete(req.params.id))
    .then(() => res.json({ success: true }))
    .catch(() => res.status(500).json({ error: true }));
});

router.post("/create", validate(["name", "parent"]), (req, res) => {
  Category.create({
    name: req.body.name,
    parent: req.body.parent,
    User_ID: req.user._id,
    Files: [],
  })
    .then(() => res.json({ success: true }))
    .catch(() => res.status(500).json({ error: true }));
});

router.patch("/edit/:id", validate(["updated_name"], ["id"]), (req, res) => {
  Category.findById(req.params.id)
    .then((category) => {
      Object.assign(category, { name: req.body.updated_name });
      return category.save();
    })
    .then(() => res.json({ success: true }))
    .catch(() => res.status(500).json({ error: true }));
});

router.get("/download/:id", validate([], ["id"]), (req, res) => {
  Category.findById(req.params.id)
    .then((category) => {
      res.set("Content-Type", "application/zip");

      const archive = Archiver("zip");
      archive.pipe(res);
      category.Files.forEach((file) =>
        archive.append(getFileStream(file.S3_ID), { name: file.name })
      );
      archive.finalize();
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ error: true });
    });
});

module.exports = router;
