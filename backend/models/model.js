const mongoose = require("mongoose")

mongoose.connect('mongodb://127.0.0.1:27017/test');
//const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');

 const { Schema } = mongoose;

 //Anonther way to add an email section-- to make sure the email is a real email and belongs to the user 
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

 const UserSchema = new Schema({
     verified: {
         type: Boolean,
         required: true,
         default: false
     },
     verified: {
        type: Boolean,
        required: true
    },
    // to make sure the user is a part of make-a-wish 
     firstName :{
       type: String,
       required : true
    },
     lastName :{
       type: String,
       required : true
    },
    profilePicture :{
       type: File,
       required : false
    },
     /*email: {
        type: Email,
        required: true,
    },*/
     email: {
        type: String,
        required: true,
    },
     admin :{
         type: Boolean,
         required : true
     },
     active: {
        type: Boolean,
        required: true,
        default: false
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


module.exports = {User}

