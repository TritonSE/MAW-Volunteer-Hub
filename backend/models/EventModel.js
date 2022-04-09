const mongoose = require("mongoose");

const GuestSchema = new mongoose.Schema({
  with: mongoose.Types.ObjectId,
  name: String,
  relation: String,
});

const ResponseSchema = new mongoose.Schema({
  volunteer: mongoose.Types.ObjectId,
  response: String,
});

module.exports = mongoose.model(
  "event",
  new mongoose.Schema({
    /**
     * REQUIRED ARGS
     */
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

    /**
     * OPTIONAL ARGS
     */
    over18: {
      type: Boolean,
      default: false,
    },
    under18: {
      type: Boolean,
      default: false,
    },
    volunteers: {
      type: [mongoose.Types.ObjectId],
      default: [],
    },
    guests: {
      type: [GuestSchema],
      default: [],
    },
    question: {
      type: String,
      default: "",
    },
    responses: {
      type: [ResponseSchema],
      default: [],
    },
  })
);
