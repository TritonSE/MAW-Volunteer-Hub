const mongoose = require("mongoose");

module.exports = mongoose.model(
  "ContactSchema",
  new mongoose.Schema({
    name: {
      type: String,
      requried: true,
    },
    position: {
      type: String,
      required: true,
    },
    organization: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,24})+$/,
    },
    phone: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    profilePictureModified: {
      type: Date,
      default: new Date(0),
    },
  })
);
