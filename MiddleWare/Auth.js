const User = require('./../models/user_model'); //importing the user model`
const jwt = require('jsonwebtoken');   //importing the jwt
require('dotenv').config();    

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];  //taking the token from the postman
        const decoded = jwt.verify(token , process.env.JWT_KEY); //verifying the token with key 
        res.userData = decoded;      //sending the user data
        const user = await User.findOne({email:decoded.email});
        req.profile = user;
        next();
    } catch (error) {
        res.json({
            error: error.message
        });
    }
}