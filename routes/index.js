var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var middleware = require("../middleware");

// landing page
router.get("/", function(request, response) {
    response.locals.navBar = false;
    response.locals.myCss = "landing";
    response.render("landing");    
});

// authentication 
router.get("/register", function(request, response) {
    response.render("register");
});

router.post("/register", function(request, response) {
    var newUser = new User({username: request.body.username});
    console.log("attempting to register a new user:");
    console.log(newUser);
    User.register(newUser, request.body.password, function (error, user) {
        if(error) {
            request.flash("danger", error.message);
            console.log(error);
            response.redirect("/register");
            return;
        }
        else {
            console.log("successfully added new user: ");
            console.log(user);
            passport.authenticate("local")(request, response, function() {
                request.flash("success", "welcome to yelpcamp, " + user.username);
                response.redirect("/campgrounds");
            });
        }
    });
});

router.get("/login", function(request, response) {
   response.render("login"); 
});
router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: 'welcome back' 
    })
);

router.get("/logout", function(request, response) {
   request.logout();
   request.flash("success", "logged out successfully")
   response.redirect("/");
});

router.get("/test-auth", middleware.isLoggedIn, function(request, response) {
    response.send("you're in!");
});

module.exports = router;