const http = require('http'); //http
const app = require('./app'); //require app
require('dotenv').config();

const port = process.env.PORT || 3000; //setting port to 3000
 
const server = http.createServer(app); //creating the server

server.listen(port , console.log(`server started on port ${port}`)); //listening to server