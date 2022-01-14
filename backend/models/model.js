const mongoose = require("mongoose")
mongoose.connect('mongodb://127.0.0.1:27017/test');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');

 const { Schema } = mongoose;

 const Email = new Schema({	
    address: {
        type: String,  
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'], 
        index: true},
    validated: {type: Boolean, default: false}
    // to make sure the email is a real email and belongs to the user 

});

 const UserSchema = new Schema({
     verified: {
         type: Boolean,
         required: true,
         default: false
     },
     profile: {
         firstName: String,
         lastName : String,
         Picture: Mixed,
         active: {type: Boolean, default: true}
     },
     email: {
        type: Email,
        required: true,
    },
     admin :{
         type: Boolean,
         required : true
     },
     active: {
        type: Boolean,
        required: true
    },
     password: {
        type: String,
        required: true
    },
    roles: {
        type: [],
        required: true
    }
 });

 UserSchema.pre(
    'save',
    async function(next) {
      const user = this;
      const hash = await bcrypt.hash(this.password, 10);
  
      this.password = hash;
      next();
    }
  );

  UserSchema.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
  
    return compare;
  }

 const User = mongoose.model("User", UserSchema);
module.exports = {User}

