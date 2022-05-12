const mongoose = require("mongoose");

const GuestSchema = new mongoose.Schema({
  name: String,
  relation: String,
});

const AttendeeSchema = new mongoose.Schema({
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  guests: {
    type: [GuestSchema],
    default: [],
  },
  response: {
    type: String,
    default: "",
  },
});

const RepeatedEventSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  attendees: {
    type: [AttendeeSchema],
    default: [],
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const EventSchema = new mongoose.Schema({
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
  calendars: {
    type: [String],
    required: true,
    validate: [
      {
        validator: (arr) => arr.length > 0,
        msg: "Event must be part of at least one calendar.",
      },
      /*
       * If events' calendars should be checked individually for validity,
       *   it can be done like this:

      {
        validator: (arr) => arr.every((cal) => ...)
      }
      */
    ],
  },
  number_needed: {
    type: Number,
    required: true,
    validate: [
      (num) => !Number.isNaN(Number.parseInt(num, 10)),
      "Event must have a valid number of volunteers needed.",
    ],
  },
  location: {
    type: String,
    required: true,
  },

  /**
   * EVENT REPETITION
   */
  repeat: {
    type: Number,
    default: 0,
    validate: [
      (num) => !Number.isNaN(Number.parseInt(num, 10)) && num >= 0 && num <= 6,
      "Event's repetition value must be in range 0 to 6",
    ],
  },
  repetitions: {
    type: [RepeatedEventSchema],
    default: [],
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
  question: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("event", EventSchema);
