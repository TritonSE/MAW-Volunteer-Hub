const mongoose = require("mongoose");

module.exports = mongoose.model(
  "WishWedSchema",
  new mongoose.Schema(
    {
      message: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  )
);
