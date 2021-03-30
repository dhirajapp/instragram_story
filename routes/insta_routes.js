const express = require('express');  //express 
const router = express.Router();
const insta = require('./../controllers/insta_controllers'); //importing the insta_controllers
const multer = require('multer'); //importing the multer
const auth = require('./../MiddleWare/Auth'); //importing the Auth middleware
const storage = multer.diskStorage({         //multer storage
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname); 
    }
});

const upload = multer({storage : storage});

router.post('/upload' , auth ,upload.single('story'), insta.upload);     //upload route
 
router.delete('/delete' , auth , insta.deletestory);    //delete route

router.get('/getall' , auth , insta.getall);  //getall route
 
router.get('/view' , auth ,insta.view);  //view route

module.exports = router;