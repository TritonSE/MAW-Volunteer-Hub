const mongoose = require("mongoose");

module.exports = mongoose.model(
  "CategorySchema",
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },

      parent: {
        type: String,
        required: true,
      },

      User_ID: {
        type: String,
        required: true,
      },

      Files: {
        type: Array,
        required: true,
      },
    },
    { timestamps: true }
  )
);
