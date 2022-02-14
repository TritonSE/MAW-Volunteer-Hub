const mongoose = require("mongoose");
const config = require("../config");

const Category_schema = new mongoose.Schema(
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
);

const CategorySchema = mongoose.model("CategorySchema", Category_schema);
module.exports = CategorySchema;
