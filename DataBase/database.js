const mongoose = require('mongoose');      //importing the mongoose
const url = 'mongodb://127.0.0.1:27017/Instagram'  //url for the database

mongoose.connect(         //mongoose connect method
    url
, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
}).then(()=>{console.log("connected To MongoDB")})
.catch(err => console.log(err));