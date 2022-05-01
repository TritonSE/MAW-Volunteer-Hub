const mongoose = require("mongoose");

module.exports = mongoose.model(
  "WishWedSchema",
  new mongoose.Schema(
    {
      Message: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  )
);
