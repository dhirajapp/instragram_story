const User = require('./../models/user_model');              //importing the user model
const bcrypt = require('bcrypt')            //importing bcrypt package for hasing the password 
const jwt = require('jsonwebtoken');            //importing jwt for token generation


exports.signup = (req, res, next) => {              //sign up controller 
User.find({email: req.body.email}).exec().          //finding the user email
then(user => {                                      //if user exits with same email then displays that 'User with same Mail Address exists'
if(user.length >=1){
res.json({
    message: 'User with same Mail Address exists'
})
}
else{
bcrypt.hash(req.body.password, 10, (err,hash) => {        //if user doesnot exists then the password gets hashed 
    if(err)
    {
        res.json({
            error: err
        })
    }
    else
    {
        const user = new User({               //creating new user 
            name: req.body.name,
            email: req.body.email,
            password: hash,
            mobile: req.body.mobile,
            dob: req.body.dob
        });
        user.save()                        //saving and displaying the user 
        .then(result => {
            res.json(result)
        })
        .catch(err => {
            res.json({
                error: err
            });
        });
    }
});
} 
});
}


exports.login = (req, res, next) => {                       //login controller 
User.find({email: req.body.email}).exec()        //finding user with email given
.then(user => {
    if(user.length < 1){                    //here user is an array , if the lenght of array is less than 1 then auth failed
        return res.json({
            message:"Auth Failed"
        });
    }
    bcrypt.compare(req.body.password , user[0].password , (err , result) => {     //comapring the password given with the hashed password 
        if(err){
            return res.json({
                message:"Auth Failed"
            })
        }
        if(result){
            const token = jwt.sign({email: user[0].email}, process.env.JWT_KEY , {expiresIn : "1h"}); //checking the email and password and logging in the user 
            return res.json({
                user: user[0],           //user 
                token: token             //token
            })
        }
        res.json({
            message:"Auth Failed"
        })
    })
})
.catch(err => {
    res.json({
        error: err
    });
});
}

exports.follow = async (req,res) =>{               //follow controller 
    try {
        const user = req.profile;              //setting the user which we get from middleware
        const to_follow = req.body.name;        //taking the name of user whom we have to follow
        const user_to_follow = await User.findOne({name:to_follow}); //finding the user 
        const arr = user.following;  //array of following users
        var i = 0;
        var flag = 0;
        while(i<arr.length)
        {
            if(arr[i]==String(user_to_follow._id))          //if the user is already there in the following array the already following is diplayed 
            {
                res.send("Already Following " + to_follow)
                flag++;
                break;
            }
            i++;
        }
        if(flag==0)
        {
            if(!user_to_follow)            //if user is not found then no user found is displayed 
            {
                res.send("No User Found");
            }
            user_to_follow.followers.push(user._id);   //adding the follower into the follwers array
            user.following.push(user_to_follow._id);   //also addind the user whom we are following into following array
            user.save();            //saving in database
            user_to_follow.save();
            res.send(`Following ${req.body.name}`)
        }
    } catch (error) {
        res.send(error.message);
    }
}