const mongoose = require('mongoose');        //importing the mongoose
const User = require('./user_model');  //importing the user model

const instagramSchema = mongoose.Schema({      //schema for Instagram stories
    title:{
        type:String,
        required:true
    },
    count:{
        type:Number
    },
    viewedby:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
});

const Instagram = mongoose.model('Instagram',instagramSchema);
module.exports = Instagram;