// use mongoose to interact with the mongo database that stores campsites
var mongoose = require("mongoose");

// set up the database schema
var campsiteSchema = new mongoose.Schema({
    name: String,
    imageUrl: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

// expose the schema
module.exports = mongoose.model("Campsite", campsiteSchema);