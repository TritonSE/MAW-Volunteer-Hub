const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model(
  "ContactPointSchema",
  new mongoose.Schema({
    wishStep: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    contacts: {
      type: [ContactSchema],
      required: true,
    },
  })
);
