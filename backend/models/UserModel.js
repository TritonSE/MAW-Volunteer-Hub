const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    // to make sure the user is a part of make-a-wish
    name: {
      type: String,
      // required: true,
    },
    profilePicture: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
    },
    joinDate: {
      type: Date,
      // required: true
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function save(next) {
  // const user = this;
  const hash = await bcrypt.hash(this.password, 10);

  this.password = hash;
  next();
});

UserSchema.methods.isValidPassword = async function isValidPassword(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.plugin(uniqueValidator);

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
