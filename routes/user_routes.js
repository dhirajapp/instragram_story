const express = require('express'); //express
const router = express.Router();
const usercontroller = require('./../controllers/user_controllers'); //importing the user_controllers
const auth = require('./../MiddleWare/Auth'); //importing the middleware

router.post('/signup', usercontroller.signup); //signup route

router.post('/login', usercontroller.login); //login route

router.post('/follow', auth ,usercontroller.follow); //follow route

router.get('/auth', auth ,(req, res) => {
    res.json({
        message: 'Auth success'
    });
});

module.exports = router;