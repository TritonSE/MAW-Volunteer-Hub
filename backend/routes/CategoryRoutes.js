const express = require("express");
const CategorySchema = require("../models/Category_model");

const router = express.Router();
const { DeleteCategory } = require("../util/FileUploadController");

router.get("/all/:Parent", async (req, res) => {
  const Parent = req.params.Parent;
  await CategorySchema.find({ parent: Parent }).then((files) => {
    files.forEach((element) => {
      res.send(element);
    });
  });
});

router.get("/Category/one/:id", (req, res) => {
  const catID = req.params.id;
  CategorySchema.findById(catID).then(async (category) => {
    res.send(category);
  });
});

router.delete("/delete/:category_ID", DeleteCategory, (req, res) => {
  CategorySchema.findByIdAndDeletes(req.params.category_ID);
});

router.post("/create", (req, res) => {
  const user = req.user;
  CategorySchema.create({
    name: req.body.categoryname,
    parent: req.body.parent,
    User_ID: user._id,
    Files: [],
  });
});
