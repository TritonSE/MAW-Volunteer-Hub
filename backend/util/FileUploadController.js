// Code adapted from youtube - @ Sam Meech-Ward
// @youtube https://www.youtube.com/watch?v=NZElg91l_ms
// @github https://github.com/Sam-Meech-Ward/image-upload-s3
// @author Mohak Vaswani

const fs = require("fs");
const util = require("util");
const File = require("../models/File_model");

const unlinkFile = util.promisify(fs.unlink);

const { uploadFile, getFileStream, DeleteFile } = require("./S3Util");

const Upload_File = async (req, res) => {
  try {
    const file = req.file;
    const user = req.user;
    const result = await uploadFile(file);
    await unlinkFile(file.path);
    await File.create({
      name: req.body.name,
      userID: user._id,
      Category_ID: "test",
      File_ID: result.key,
    });
    console.log("File uploaded successfully");
    res.json({ data: "success!" });
    /*
    res.redirect("/file/?secret_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYxZmEyMDQwMWMxOThlOTY3Y2IwYWU5ZSIsImVtYWlsIjoibW9oYWt2MTVAZ21haWwuY29tIn0sImlhdCI6MTY0MzgyNzAwM30.a6oz0g3miTQMUpSSU-2MMkpBVi2-lZFhsz_pfQg4X_U"); */
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Error, cannot upload file" });
  }
};

const Delete_File = async (req, res) => {
  try {
    const key = req.params.key;
    File.findOne({ name: key })
      .then(async (file) => {
        await DeleteFile(file.File_ID);
        await File.deleteOne({ name: key });
        res.send("File successfully deleted");
      })
      .catch((e) => {
        console.log(e);
        res.status(500).json({ error: "Error, file does not exist" });
      });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Error, cannot delete file" });
  }
};

const Update_file_name = async (req, res) => {
  try {
    const key = req.params.key;
    const updated_key = req.body.updated_key;
    console.log(key, updated_key);
    File.findOne({ name: key })
      .then(async (file) => {
        Object.assign(file, { name: updated_key });
        file.save();
      })
      .catch(() => {
        res.status(500).json({ error: "Error, file does not exist" });
      });
    res.send("File name successfully updated");
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Error, cannot updated file name" });
  }
};

const Update_file = async (req, res) => {
  try {
    const key = req.params.key;
    const updated_file = req.file;
    File.findOne({ name: key })
      .then(async (file) => {
        await DeleteFile(key);
        const result = await uploadFile(updated_file);
        console.log(result);
        await unlinkFile(updated_file.path);
        await File.create({
          name: req.body.updated_file_name,
          userID: req.user._id,
          Category_ID: req.body.Category_ID,
          File_ID: result.key,
        });
        await File.deleteOne({ name: key });
        console.log("New File uploaded successfully");
        res.json({ data: "success!" });
      })
      .catch((e) => {
        console.log(e);
        res.status(500).json({ error: "Error, Old file does not exist, please uplode new" });
      });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Error, cannot updated file" });
  }
};

const Display_File = async (req, res) => {
  try {
    const key = req.params.key;
    File.findOne({ name: key })
      .then(async (file) => {
        const readStream = getFileStream(file.File_ID);
        readStream.pipe(res);
      })
      .catch(() => {
        res.status(500).json({ error: "Error, file does not exist" });
      });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Error, cannot display file" });
  }
};

const delete_category_file = async (req, res) => {
  try {
    const category_id = req.params.category_id;
    await File.find({ Category_ID: category_id })
      .then(async (files) => {
        files.forEach(async (file) => {
          await DeleteFile(file.File_ID);
          await File.deleteOne({ name: file.name });
        });
        res.send("Category File successfully deleted");
      })
      .catch((e) => console.log(e));
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: " Error, cannot delete category files" });
  }
};

module.exports = {
  Upload_File,
  Delete_File,
  Display_File,
  Update_file_name,
  Update_file,
  delete_category_file,
};
