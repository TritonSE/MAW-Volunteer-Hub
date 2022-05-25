const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");

const ManualEventSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
    required: true,
    minlength: 1,
  },
  hours: {
    type: Number,
    required: true,
    validate: [
      (num) => !Number.isNaN(Number.parseInt(num, 10)) && num >= 0,
      "Event must have a valid duration.",
    ],
  },
});

const UserSchema = new mongoose.Schema(
  {
    // to make sure the user is a part of make-a-wish
    name: {
      type: String,
      // required: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    profilePictureModified: {
      type: Date,
      default: new Date(0),
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,24})+$/,
    },
    // Integer value. 0 = regular user, 1 = secondary admin, 2 = primary admin, >= 3 is regular user
    admin: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
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
    /**
     * EVENTS
     */
    manualEvents: {
      type: [ManualEventSchema],
      default: [],
    },
  },
  { timestamps: true }
);

UserSchema.virtual("verified").get(function () {
  return this.roles.length > 0;
});

UserSchema.pre("save", async function save(next) {
  if (this.password && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.methods.isValidPassword = async function isValidPassword(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.set("toJSON", {
  transform(doc, obj) {
    const ret = { ...obj };
    delete ret.password;
    return ret;
  },
});

UserSchema.plugin(uniqueValidator);

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
