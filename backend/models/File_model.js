const mongoose = require("mongoose");
const config = require("../config");

// mongoose.connect(config.db.uri);

const File_Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    userID: {
      type: String,
      required: true,
    },

    Category_ID: {
      type: String,
      required: true,
    },

    S3_ID: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const FileSchema = mongoose.model("FileSchema", File_Schema);
module.exports = FileSchema;
