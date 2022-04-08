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
    calendar: {
      type: String,
      required: true,
    },
    number_needed: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    volunteers: {
      type: [mongoose.Types.ObjectId],
      default: [],
    },
    guests: {
      type: [String],
      default: [],
    },
    question: {
      type: String,
      default: "",
    },
    responses: {
      type: [String],
      default: [],
    },
    /* TODO */
  })
);
