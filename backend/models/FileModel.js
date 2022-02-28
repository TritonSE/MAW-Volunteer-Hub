const mongoose = require("mongoose");

module.exports = mongoose.model(
  "FileSchema",
  new mongoose.Schema(
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
  )
);
