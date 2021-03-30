const mongoose = require('mongoose');           //importing the mongoose
const validator = require('validator');           //importing the validator
const Story = require('./instagram_model');
const ObjectId = require('mongoose').Types.ObjectId; //setting the objectId

const userschema = mongoose.Schema({       //user schema
    name:{         
        type: String,
        required: true,
        trim:true
    },
    email:{
        type: String,
        required: true,
        trim:true,
        unique:true,
        validate : value => {            //valitating the email
            if(!validator.isEmail(value))
            {
                throw new Error({error: 'Invalid Email Address'});
            }
        }
    },
    password:{
        type: String,
        required: true,
        minLength:8,
        trim:true
    },
    mobile:{
        type: Number,
        required: true
    },
    dob:{
        type: String,
        required: true,
        trim:true
    },
    followers: [{ type: ObjectId, ref: "User" }],
    following: [{ type: ObjectId, ref: "User" }],
    stories:[{ type: ObjectId, ref: "Story"}]
})

const User = mongoose.model('User',userschema);
module.exports = User;