// use mongoose to interact with the mongo database that stores campsites
var mongoose = require("mongoose");

// set up the database schema
var commentSchema = new mongoose.Schema({
    message: String,
    author: {
        // store the comment's author ID from database and also the username
        // so we don't need to look up the username when printed
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    date: {type: Date, default: Date.now()}
});

// expose the schema
module.exports = mongoose.model("Comment", commentSchema);