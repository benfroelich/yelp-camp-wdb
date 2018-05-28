var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
});

// integrate pasport local
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);