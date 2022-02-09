// Code adapted from youtube - @ Sam Meech-Ward
// @youtube https://www.youtube.com/watch?v=NZElg91l_ms
// @github https://github.com/Sam-Meech-Ward/image-upload-s3
// @author Mohak Vaswani

const fs = require("fs");
const util = require("util");
const File = require("../models/File_model");

const unlinkFile = util.promisify(fs.unlink);

const { uploadFile, getFileStream, DeleteFile } = require("./S3Util");

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

const Delete = async (req, res) => {
  try {
    const ID = req.params.ID;
    File.findById(ID)
      .then(async (file) => {
        await DeleteFile(file.S3_ID);
        await File.deleteOne({ S3_ID: ID });
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

const UpdateFile = async (req, res) => {
  try {
    const ID = req.params.ID;
    const updated_file = req.file;
    File.findById(ID)
      .then(async (fileobj) => {
        if (req.file && req.body.updated_file_name) {
          try {
            await DeleteFile(fileobj.S3_ID);
            const result = await uploadFile(updated_file);
            Object.assign(fileobj, { S3_ID: result.key, name: req.body.updated_file_name });
            fileobj.save();
          } catch (e) {
            console.log(e);
            res.status(400).json({ error: "Cannot update file details" });
          }
        } else if (req.file) {
          try {
            await DeleteFile(fileobj.S3_ID);
            const result = await uploadFile(updated_file);
            Object.assign(fileobj, { S3_ID: result.key }); // so that UpdatedAt changes
            fileobj.save();
          } catch (e) {
            console.log(e);
            res.status(400).json({ error: "Cannot update file" });
          }
        } else if (req.body.updated_file_name) {
          try {
            Object.assign(fileobj, { name: req.body.updated_file_name });
            fileobj.save();
          } catch (e) {
            console.log(e);
            res.status(400).json({ error: "Cannot update file name" });
          }
        } else {
          res.status(400).json({ error: "please enter an input" });
        }
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

const DeleteCatFile = async (req, res) => {
  try {
    const category_id = req.params.category_id;
    await File.find({ Category_ID: category_id })
      .then(async (files) => {
        files.forEach(async (file) => {
          await DeleteFile(file.S3_ID);
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

const SearchFile = async (req, res) => {
  try {
    const Name = req.params.name;
    await File.find({ name: Name }).then(async (file) => {
      res.json(file);
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: " Error" });
  }
};
module.exports = {
  UploadFile,
  Delete,
  DisplayFile,
  UpdateFile,
  DeleteCatFile,
  SearchFile,
};
