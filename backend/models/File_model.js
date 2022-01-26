const { ObjectId } = require("mongodb");
const mongoose = require("mongoose")
mongoose.connect('mongodb+srv://Mohak:trial123@cluster0.1divz.mongodb.net/Cluster0?retryWrites=true&w=majority');

const File_Schema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },

    userID : {
        type: Number,
        required: true
    },

    Time_creation : {
        type: Date,
        required: true
    },

    Time_modified : {
        type: Date,
        required: true
    },

    Category_ID : {
        type: ObjectId,
        required: true
    },

    File_Binary : {
        type: String,
        required: true
    }

})