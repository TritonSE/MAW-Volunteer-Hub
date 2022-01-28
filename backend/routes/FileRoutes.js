const express = require("express");

const router = express.Router();
const multer = require("multer");

const upload = multer({ dest: "server_uploads/" });
const { Upload_File, Delete_File, Display_File } = require("../util/FileUploadController");

router.get("/", (req, res) => {
  res.render("index");
});

router.post("/upload", upload.single("file"), Upload_File);

router.get("/display/:key", Display_File);

router.delete("/delete/:key", Delete_File);

module.exports = router;
