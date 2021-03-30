const express = require('express'); //express
const app = express();
const userroutes = require('./routes/user_routes'); //importing the user routes
const instaroutes = require('./routes/insta_routes');//importing the instaroutes routes
require("./DataBase/database"); //database

app.use(express.json()); //middleware for json
app.use(express.static(__dirname + '/uploads')); //making the folder static

app.use('/user',userroutes); //user routes
app.use('/insta',instaroutes);//insta routes
module.exports = app;