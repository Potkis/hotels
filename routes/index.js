var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Root route
router.get("/", function(req, res){
    res.render("landing");
});

// Register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

// Handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});

    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "You succesfully signed up, it is a pleasure to meet you " + req.body.username);
           res.redirect("/hotels"); 
        });
    });
});

// Show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

// Handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/hotels",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: 'Welcome to Hotels!'
    }), function(req, res){
});

// Logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Goodbye, hope to see you soon!");
   res.redirect("/hotels");
});


module.exports = router;