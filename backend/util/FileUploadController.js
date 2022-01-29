// Code adapted from youtube - @ Sam Meech-Ward
// @youtube https://www.youtube.com/watch?v=NZElg91l_ms
// @github https://github.com/Sam-Meech-Ward/image-upload-s3
// @author Mohak Vaswani

const fs = require("fs");
const util = require("util");

const unlinkFile = util.promisify(fs.unlink);

const { uploadFile, getFileStream, DeleteFile } = require("./S3Util");

const Upload_File = async (req, res) => {
  try {
    const file = req.file;
    const result = await uploadFile(file);
    await unlinkFile(file.path);
    console.log(result);
    res.redirect("/file");
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Error, cannot upload file" });
  }
};

const Delete_File = async (req, res) => {
  try {
    const key = req.params.key;
    await DeleteFile(key);
    res.send("File successfully deleted");
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Error, cannot delete file" });
  }
};

const Display_File = (req, res) => {
  try {
    const key = req.params.key;
    // We need to check and make sure that there is a valid file with
    // this key before trying to access it, amazon seems to crash when
    // we try to getFileSteam(key) for a key that doens't exist
    if (key === "cse134.png") {
      const readStream = getFileStream(key);
      readStream.pipe(res);
    } else {
      res.status(400).json({ error: "Error, cannot display file" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Error, cannot display file" });
  }
};

module.exports = {
  Upload_File,
  Delete_File,
  Display_File,
};
