const path = require("path");  //requiring the path package 
const uuid = require("uuid").v4();  // requiring the uuid package 
const fs = require('fs')  // requiring the filesystem package
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;  //importing the ffmpeg
const ffmpeg = require('fluent-ffmpeg'); //importing the fluent-ffmpeg
ffmpeg.setFfmpegPath(ffmpegPath);  //setting the path
const Story = require("./../models/instagram_model");   //importing the Story model

exports.upload  = async (req,res) =>{     //upload controller which will get invoke when the specific route gets executed
    const name = uuid;                        
    const user = req.profile;
    if(req.file.mimetype=="video/mp4")        //checking the file type is video or mp4
    {
        ffmpeg(req.file.path)
        .setStartTime(req.body.start)              //setting the start time of the story 
        .setDuration(30)                          //duration of the story 
        .output(`${req.file.destination}/converted/${name + req.file.originalname}`)   //giving the path for output ot be stored
        .on('end', function(err) {            //fucntion which executes on ending the above function
            if(!err)
            {
                const path = req.file.path
                fs.unlink(path, (err) => {             //deleting the original video from the upload folder 
                    if (err) {
                        console.error(err)
                        return
                    }    
                })
                const db_name = name + req.file.originalname;
                const vid_story = new Story({
                    title:db_name                           //title name 
                });
                user.stories.push(vid_story._id);          //pushing the story into the particular user story
                user.save();                               //saving the user 
                vid_story.save();                           //saving the story
                res.json({"message":"successfully uploaded"}); 
            }                 
        })
        .on('error', function(err){                       
            res.send(err.message)                       //error message 
        }).run();
    }
    else if(req.file.mimetype=="image/jpeg"){                  //same ass video story but this is for image type story  
        const pic_story = new Story({
            title:req.file.originalname                       
        })
        user.stories.push(pic_story._id);
        user.save();
        pic_story.save();
        res.json({"message":"Uploaded","Image":req.file});
    }
}


exports.deletestory = async(req,res)=>{                                //deletestory controller 
    const name = req.body.file.split(".");                              //spliting the name 
    const user = req.profile;                                        //setting the profile into user variable
    const type = name[name.length - 1];                              //getting the story type from name arra ywhich we splited 
    if(type == "video" || type=="mp4")                               //if type is video or mp4 
    { 
        const path1 = "/converted/" + req.body.file;                   //setting the path 
        fs.unlink(path.join("uploads/" + path1), (err) => {            //unlinking the file i.e deleting the file or story 
            if (err) {
                console.error(err.message)
                return
            }
        })
        const tofind = await Story.findOne({title:req.body.file});                  //fiding the file 
        const index = user.stories.indexOf(tofind._id);                             //pushing that file into array of stories `
        const arr = user.stories;
        arr.splice(index,1);                                                        //splicing the element i.e removing it
        user.stories = arr;
        user.save();
        const deleted = Story.deleteOne({title:req.body.file})                      //deleting the story
        .exec()
        .then((res)=>console.log(res))
        .catch((err)=>console.log(err.message));
        res.json({"message":"Deleted Successfully"});
    }
    else{
        const path1 =  "/images/" + req.body.file;
        fs.unlink(path.join("uploads/" + path1), (err) => {
            if (err) {
                console.error(err.message)
                return
            }
        })
        const tofind = await Story.findOne({title:req.body.file});
        const index = user.stories.indexOf(tofind._id);
        const arr = user.stories;
        arr.splice(index,1);
        user.stories = arr;
        user.save();
        const deleted = Story.deleteOne({title:req.body.file})
        .exec()
        .then((res)=>console.log(res))
        .catch((err)=>console.log(err.message));
        res.json({"message":"Deleted Successfully"});
    }
}


exports.getall = async(req,res)=>{                                        //function for getting all the stories 
    try {
        const all_stories = await Story.find({}).sort({createdAt:-1});
        res.json({stories:all_stories});
    } catch (error) {
        res.send(err.message);
    }
}


exports.view = async(req,res)=>{                                           //controller for viewing particular person story
    try {
        const viewed = await Story.findOne({_id:req.body.story_id});
        const user = req.profile;
        const arr = viewed.viewedby;
        console.log(viewed);
        var i = 0;
        console.log(arr);
        while(i<arr.length)
        {
            if(arr[i] == String(user._id))
            {
                res.send("Already Viewed");
                break;
            }
            i++;
        }
        viewed.viewedby.push(user._id);
        const len = viewed.viewedby;
        viewed.count = len.length;
        viewed.save();
        res.json({"story":viewed})
    } catch (error) {
        res.send(error.message);
    }
}