const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

// Anonther way to add an email section-- to make sure the email is a real email and belongs to the user
// doesn't completely work and may be unnecessarily complicated so I commented it out
// in case we want to use this in the future
/* const Email = new Schema({	
    address: {
        type: String,  
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'], 
        index: true},
    validated: {type: Boolean, default: false}
    

}); */

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
