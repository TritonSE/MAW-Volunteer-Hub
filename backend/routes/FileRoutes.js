const express = require("express");

const router = express.Router();
const multer = require("multer");

const upload = multer({ dest: "server_uploads/" });
// const req = require("express/lib/request");
const {
  Upload_File,
  Delete_File,
  Display_File,
  Update_file,
  Update_file_name,
  delete_category_file,
  search_file,
} = require("../util/FileUploadController");

router.get("/", (req, res) => {
  res.render("index");
});

router.post("/upload", upload.single("file"), Upload_File);

router.get("/display/:key", Display_File);

router.delete("/delete/:s3id", Delete_File);

router.patch("/update/:s3id", Update_file_name);

router.post("/update_file/:s3id", upload.single("file"), Update_file);

router.delete("/delete_category/:category_id", delete_category_file);

router.get("/search/:name", search_file);

module.exports = router;
