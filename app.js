// built on the express framework MEN (mongo + express + node.js)
var express = require("express"),
    app = express();
// use embedded javascript for templating and generating pages
require("ejs");
var bodyParser = require('body-parser');
// use method-override to adhere to the REST pattern
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
// use mongoose to interact with the mongo database for this app
var mongoose = require("mongoose");
// add a default database in case the DATABASE_URL environment
// variable isn't set
var dbUrl = process.env.DATABASE_URL || "mongodb:localhost//yelp-camp";
// seperate the production and development databases to 
// avoid messing with app users' data. And don't expose
// any URLs from source code, for security
mongoose.connect(dbUrl);
// use to provide error data
// passport libraries
var passport                = require("passport"),
    passportLocalStrategy   = require("passport-local");
                              require("passport-local-mongoose");
// allows the use of flash messages in templates
var flash = require("connect-flash");
// routes
var routesDir = __dirname + "/routes/";
var commentRoutes       = require(routesDir + "comments"),
    campgroundRoutes    = require(routesDir + "campgrounds"),
    indexRoutes         = require(routesDir + "index");
    
// models for campground, comment, and user
var modelsDir = __dirname + "/models/";
var User = require(modelsDir + "user.js");

// seed the database, only for debugging
//require("./utilities/seedDatabase.js")();

// tell the express framework that we will use EJS templates
app.set("view engine", "ejs");
// tell the express framework that the css is in the public directory
app.use(express.static(__dirname + "/public"));
// use body parser to parse route query parameters
app.use(bodyParser.urlencoded({ extended: true }));
// sanitize user content
app.use(expressSanitizer());
// use to adhere to rest routes using forms
app.use(methodOverride("_method"));
// Passport configuration
app.use(require("express-session")({
   secret: "i-love-pakittie",
   resave: false,
   saveUninitialized: false
}));
// hook in flash before passport configuration to avoid bugs
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(request, response, next) {
    // the nav bar in every page will use the user object for login status
    response.locals.user = request.user;
    // enable the nav bar in the header template by default
    response.locals.navBar = true;
    response.locals.myCss = false;
    // add any new message keys to this array.
    response.locals.messageKeys = ["success", "info", "warning", "danger"];
    response.locals.flash = {};
    response.locals.messageKeys.forEach(function(key) {
        response.locals.flash[key] = request.flash(key);
    });
    next();
});
app.use(methodOverride("_method"));
// use routes
app.use("/", indexRoutes);
app.use("/campgrounds/", campgroundRoutes);
app.use("/campgrounds/:id/comments/", commentRoutes);

passport.use(new passportLocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(process.env.PORT, process.env.IP, function () {
    console.log("server is up n' runnin' for yelp-camp");
});

