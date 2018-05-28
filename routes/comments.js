var express = require("express");
// mergeParams so that the :id parameter is passed to these routes from the app
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// new
router.get("/new", middleware.isLoggedIn, function(request, response) {
    // get the campground in id
    Campground.findById(request.params.id, function(error, campground) {
        if(error) {
            console.log(error);
            response.redirect("/campgrounds");
        }
        else {
           response.render("comments/new", {campground: campground});
        }
    });
});

// create
router.post("/", middleware.isLoggedIn, function(request, response) {
    var id = request.params.id; // campground ID
    // access the new comment passed from the comment form
    var comment = request.body.comment;
    // add the user information to the comment
    var user = request.user;
    comment.author = {id: user._id, username: user.username};
    console.log("full comment is: ");
    console.log(comment);
    Comment.create(comment, function(error, comment) {
        if(error) {
            console.log(error);
            response.redirect("/campgrounds");
        }
        else {
            // get the campground to which we will attach this comment
            Campground.findById(id, function(error, campground) {
                if(error) {
                    console.log(error);
                    request.flash("danger", error.message);
                    response.redirect("/campgrounds");
                }
                else {
                    // add username and ID to comment
                    console.log("new comment username will be: " + request.user.username);
                    
                    // add the new comment to the campground
                    campground.comments.push(comment); 
                    campground.save();
                    response.redirect("/campgrounds/" + id);
                }
            });
        }
    });
});

// no 'show' route for comments - they are indexed on the campground's show page

// edit
router.get("/:commentId/edit", middleware.checkCommentOwner, function(request, response) {
    response.locals.campgroundId = request.params.id;
    response.render("comments/edit"); 
});

// update
router.put("/:commentId", middleware.checkCommentOwner, function(request, response) {
    var comment = request.body.comment;
    comment.message = request.sanitize(comment.message);
    Comment.findByIdAndUpdate(request.params.commentId, comment, function(error, originalComment) {
        if(error || !originalComment) 
        {
            console.log(error);
            request.flash("danger", error ? error.message : "requested comment does not exist");
            response.redirect("/");
        }
        else
        {
            // back to the campground
            response.redirect("/campgrounds/" + request.params.id);
        }
    });
});

router.delete("/:commentId", middleware.checkCommentOwner, function(request, response) {
    response.locals.comment.remove(function(error) {
        if(error) 
        {
            console.log(error);
            request.flash("danger", error.message);
        }
        response.redirect("back");
    });
});

module.exports = router;