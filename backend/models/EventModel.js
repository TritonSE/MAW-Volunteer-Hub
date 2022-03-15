const mongoose = require("mongoose");

module.exports = mongoose.model(
  "event",
  new mongoose.Schema({
    from: {
      type: Date,
      required: true,
    },
    to: {
      type: Date,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    /* TODO */
  })
);
