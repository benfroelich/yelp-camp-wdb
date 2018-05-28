require("mongoose");
var Campground = require("../models/campground");
var Comment   = require("../models/comment");
var User = require("../models/user");

var campgrounds = [
    {
        name: "Cloud's Rest", 
        imageUrl: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author: "clark"
    },
    {
        name: "Desert Mesa", 
        imageUrl: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author: "benny"
    },
    {
        name: "Canyon Floor", 
        imageUrl: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author: "rosie"
    }
];

var defaultPassword = "pw";
var numComments = 12;

function seedDB(){
    // remove all users from db
    User.remove({}, function(err) {
        if(err) console.log(err);
        else {
            console.log("successfully removed users!");
            // remove all campgrounds from db
            Campground.remove({}, function(err){
                if(err){
                    console.log(err);
                }
                console.log("removed campgrounds!");
                // remove all comments from db
                Comment.remove({}, function(err) {
                    if(err){
                        console.log(err);
                    }
                    console.log("removed comments!");
                     //add seed campgrounds
                    campgrounds.forEach(function(seed){
                        var author = new User({username: seed.author});
                        // TODO handle dup authors
                        // make new users and add to seeds, overwritting the string username
                        User.register(author, defaultPassword, function (error, user) {
                            if(error) console.log(error);
                            else {
                                console.log("added user " + user.username);
                                seed.author = {id: author._id, username: author.username};
                                Campground.create(seed, function(err, campground){
                                    if(err){
                                        console.log(err);
                                    } else {
                                        console.log("added a campground");
                                        //create a comment
                                        Comment.create(
                                        {
                                            message: "This place is great, but I wish there was internet",
                                            author: seed.author
                                        }, function(err, comment){
                                            if(err){
                                                console.log(err);
                                            } else {
                                                for(var i = 0; i < numComments; i++)
                                                    campground.comments.push(comment);
                                                campground.save();
                                                console.log("Created new comment");
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
                });
            }); 
        }
    });
}
 
module.exports = seedDB;