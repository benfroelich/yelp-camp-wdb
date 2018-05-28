var Campground      = require("../models/campground");
var Comment         = require("../models/comment");

module.exports.isLoggedIn = function (request, response, next) {
    if(request.isAuthenticated() === true)
        return next();
    request.flash("danger", "Please log in first");
    response.redirect("/login");
};

module.exports.checkCampgroundOwner = function (request, response, next) {
    var id = request.params.id;
    Campground.findById(id, function(error, campground) {
        if(error || !campground) {
            request.flash("danger", "ruh roh!");
            console.log(error);
        }
        else {
            if(module.exports.isAuthor(campground, request.user))
            {
                // allows use of the campground in subsequent routes so it
                // doesn't need to be pulled from db again
                response.locals.campground = campground;
                return next();
            }
            else {
                request.flash("danger", "You aren't authorized to edit this campground");
            }
        }
        return response.redirect("back");
    });
};

module.exports.checkCommentOwner = function (request, response, next) {
    var commentId = request.params.commentId;
    Comment.findById(commentId, function(error, comment) {
        if(error || !comment) 
        {
            request.flash("danger", "ruh roh!");
            console.log(error);
        }
        else
        {
            if(request.user && module.exports.isAuthor(comment, request.user))
            {
                // allows use of comment in subsequent routes so it doesn't 
                // need to be pulled from the db again
                response.locals.comment = comment;
                return next();
            }
            else {
                request.flash("danger", "you aren't authorized to edit this comment");
            }
        }
        return response.redirect("back");
    });
};

// returns wherether campground was submitted by user
module.exports.isAuthor = function (item, user) {
    if(user)
        return item.author.id.equals(user._id); 
    return false;
};