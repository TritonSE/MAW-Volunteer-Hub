const express = require("express");

const router = express.Router();
const multer = require("multer");

const upload = multer({ dest: "server_uploads/" });
// const req = require("express/lib/request");
const {
  UploadFile,
  Delete,
  DisplayFile,
  UpdateFile,
  DeleteCatFile,
  SearchFile,
} = require("../util/FileUploadController");

router.get("/", (req, res) => {
  res.render("index");
});

router.post("/Upload", upload.single("file"), UploadFile);

router.get("/Display/:ID", DisplayFile);

router.delete("/Delete/:ID", Delete);

router.patch("/Update/:ID", upload.single("file"), UpdateFile);

router.delete("/Deletecat/:category_id", DeleteCatFile);

router.get("/Search/:name", SearchFile);

module.exports = router;
