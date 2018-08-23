const express = require("express");
const router  = express.Router({mergeParams: true});
const Hotel = require("../models/hotel");
const Comment = require("../models/comment");
const middleware = require("../middleware");
const { isLoggedIn, checkUserComment,} = middleware;

// NEW
router.get("/new", isLoggedIn, function(req, res){
    console.log(req.params.id);
    Hotel.findById(req.params.id, function(err, hotel){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {hotel: hotel});
        }
    });
});

// CREATE
router.post("/", isLoggedIn, function(req, res){

   Hotel.findById(req.params.id, function(err, hotel){
       if(err){
           console.log(err);
           res.redirect("/hotels");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {

               comment.author.id = req.user._id;
               comment.author.username = req.user.username;

               comment.save();
               hotel.comments.push(comment);
               hotel.save();
               console.log(comment);
               req.flash('success', 'Created a comment!');
               res.redirect('/hotels/' + hotel._id);
           }
        });
       }
   });
});

// EDIT
router.get("/:commentId/edit", isLoggedIn, checkUserComment, function(req, res){
  res.render("comments/edit", {hotel_id: req.params.id, comment: req.comment});
});

// PUT
router.put("/:commentId", function(req, res){
   Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, comment){
       if(err){
          console.log(err);
           res.render("edit");
       } else {
           res.redirect("/hotels/" + req.params.id);
       }
   }); 
});

// REMOVE
router.delete("/:commentId", isLoggedIn, checkUserComment, function(req, res){
  // find hotel, remove comment from comments array, delete comment in db
  Hotel.findByIdAndUpdate(req.params.id, {
    $pull: {
      comments: req.comment.id
    }
  }, function(err) {
    if(err){ 
        console.log(err)
        req.flash('error', err.message);
        res.redirect('/');
    } else {
        req.comment.remove(function(err) {
          if(err) {
            req.flash('error', err.message);
            return res.redirect('/');
          }
          req.flash('error', 'Comment deleted!');
          res.redirect("/hotels/" + req.params.id);
        });
    }
  });
});

module.exports = router;