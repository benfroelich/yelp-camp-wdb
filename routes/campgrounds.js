var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
require("express-sanitizer");

// index
router.get("/", function(request, response) {
    Campground.find(function(error, campgrounds) {
        if(error || !campgrounds) {
            console.log(error);
            request.flash("danger", error ? error.message : "requested campground does not exist");
            response.redirect("back");
        }
        else {
            response.render("campgrounds/index", {campgrounds: campgrounds});
        }
    });
});

// create
router.post("/", middleware.isLoggedIn, function(request, response) {
    // get data from form
    var campground = request.body.campground;
    var user = request.user;
    // add author information to campground from the authentication info
    campground.author = {id: user._id, username: user.username};
    // add to campgrounds database
    Campground.create(campground, function (err, campground) {
        if(err) {
            console.log("failure saving " + campground.name + " to database");
            console.log(err);   
            // redirect back to listing GET camp-list route
            response.redirect("/");
        }  
        else {
            console.log("added to db:");
            console.log(campground);
            response.redirect(campground._id);
        }
    });
});

// new
router.get("/new", middleware.isLoggedIn, function(request, response) {
    response.render("campgrounds/new");
});

// show
router.get("/:id", function(request, response) {
    var id = request.params.id;
    Campground.findById(id).populate("comments").exec(function(error, campground) {
        if(error || !campground) {
            console.log(error);
            request.flash("danger", error ? error.message : "requested campground does not exist");
            response.redirect("/");
        }
        else {
            response.render("campgrounds/show", 
            {
                campground: campground, 
                isAuthor: middleware.isAuthor(campground, request.user)
            }); 
        }
    });
});

// edit
router.get("/:id/edit", middleware.checkCampgroundOwner, function(request, response) {
    response.render("campgrounds/edit"); 
});

// update
router.put("/:id", middleware.checkCampgroundOwner, function(request, response) {
    var id = request.params.id;
    var campground = request.body.campground;
    // sanitize properties
    campground.name = request.sanitize(campground.name);
    campground.description = request.sanitize(campground.description);
    campground.campgroundUrl = request.sanitize(campground.campgroundUrl);
    // update the campground in mongo
    Campground.findByIdAndUpdate(id, campground, function(err) {
        if(err) response.redirect("/");
        response.redirect("./" + id);
    });
});

// delete
router.delete("/:id", middleware.checkCampgroundOwner, function(request, response) {
    response.locals.campground.remove(function(err) {
       if(err) console.log(err);
       response.redirect("/");
    });
});

module.exports = router;