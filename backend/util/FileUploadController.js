// Code adapted from youtube - @ Sam Meech-Ward
// @youtube https://www.youtube.com/watch?v=NZElg91l_ms
// @github https://github.com/Sam-Meech-Ward/image-upload-s3
// @author Mohak Vaswani

const { promise } = require("bcrypt/promises");
const fs = require("fs");
const util = require("util");
const File = require("../models/File_model");

const unlinkFile = util.promisify(fs.unlink);

const { uploadFile, getFileStream, deleteFileAWS } = require("./S3Util");

const UploadFile = async (req, res) => {
  try {
    const file = req.file;
    const user = req.user;
    const result = await uploadFile(file);
    await unlinkFile(file.path);
    await File.create({
      name: req.body.name,
      userID: user._id,
      Category_ID: "test",
      S3_ID: result.key,
    });
    console.log("File uploaded successfully");
    res.json({ data: "success!" });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Error, cannot upload file" });
  }
};

const DeleteFile = async (req, res) => {
  const ID = req.params.ID;
  File.findById(ID)
    .then(async (file) => {
      try {
        await deleteFileAWS(file.S3_ID);
      } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Internal Error. Could not upload file to AWS" });
      }
      await File.deleteOne({ _id: ID });
      res.send("File successfully deleted");
    })
    .catch((e) => {
      console.log(e);
      res.status(400).json({ error: "Error, file with provided id does not exist" });
    });
};

const DisplayFile = async (req, res) => {
  try {
    const ID = req.params.ID;
    File.findById(ID)
      .then(async (file) => {
        const readStream = getFileStream(file.S3_ID);
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

const DeleteCategory = async (req, res) => {
  try {
    const category_id = req.params.category_id;
    await File.find({ Category_ID: category_id }).then(async (files) => {
      Promise.all(
        files.map(async (file) => {
          await deleteFileAWS(file.S3_ID);
          await File.deleteOne({ name: file.name });
        })
      ).catch(() => res.status(500).json({ error: "Failed to delete files" }));
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: " Error, cannot delete category files" });
  }
};

const UpdateFile = async (req, res) => {
  try {
    const ID = req.params.ID;
    const updated_file = req.file;
    File.findById(ID).then(async (fileobj) => {
      const options = {};
      if (req.file) {
        try {
          await deleteFileAWS(fileobj.S3_ID);
          const result = await uploadFile(updated_file);
          options.S3_ID = result.key;
        } catch {
          res.status(400).json({ error: "Could not upload new file" });
        }
      }
      if (req.body.updated_file_name) {
        options.name = req.body.updated_file_name;
      }
      Object.assign(fileobj, options);
      fileobj.save().catch(() => res.status(500).json({ error: "Could not update file" }));
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Error, cannot updated file" });
  }
};

const SearchFile = async (req, res) => {
  try {
    const Name = req.params.name;
    File.find({ name: Name }).then(async (file) => {
      res.json(file);
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: " Error" });
  }
};
module.exports = {
  UploadFile,
  DeleteFile,
  DisplayFile,
  UpdateFile,
  DeleteCategory,
  SearchFile,
};
