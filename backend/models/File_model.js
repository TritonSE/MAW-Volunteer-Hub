const { ObjectId, Timestamp } = require("mongodb");
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://Mohak:yXcov2Wtwx7ikj1n@cluster0.1divz.mongodb.net/Cluster0?retryWrites=true&w=majority"
);

const File_Schema = new mongoose.Schema({
  name: {
    // req.body
    type: String,
    required: true,
  },

  userID: {
    // JWT token
    type: String, // ObjectId
    required: true,
  },

  /* Time_creation : { //read and alter from what patrick sent
        type: Date,
        required: true
    }, */

  Category_ID: {
    // from req.body
    type: String,
    required: true,
  },

  File_ID: {
    // represents amazon s3 key
    type: String,
    required: true,
    Timestamp: true,
  },
});

const FileSchema = mongoose.model("FileSchema", File_Schema);
module.exports = FileSchema;
