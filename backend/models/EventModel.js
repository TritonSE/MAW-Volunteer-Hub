const mongoose = require("mongoose");

const GuestSchema = new mongoose.Schema({
  with: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  name: String,
  relation: String,
});

const ResponseSchema = new mongoose.Schema({
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  response: String,
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
  volunteers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
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
  completed: {
    type: Boolean,
    default: false,
  },
});

EventSchema.pre("save", function save(next) {
  if (this.from && this.isModified("from")) {
    this.from = new Date(this.from);

    if (this.from === "Invalid Date") {
      next(new Error("Invalid event start date."));
    }
  }
  if (this.to && this.isModified("to")) {
    this.to = new Date(this.to);

    if (this.to === "Invalid Date") {
      next(new Error("Invalid event end date."));
    }
  }
  if (this.number_needed && this.isModified("number_needed")) {
    this.number_needed = Number.parseInt(this.number_needed, 10);

    if (Number.isNaN(this.number_needed)) {
      next(new Error("Invalid event volunteer count."));
    }
  }

  next();
});

module.exports = mongoose.model("event", EventSchema);
