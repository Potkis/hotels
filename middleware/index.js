var Comment = require('../models/comment');
var Hotel = require('../models/hotel');
module.exports = {
  isLoggedIn: function(req, res, next){
      if(req.isAuthenticated()){
          return next();
      }
      req.flash('error', 'Please sign in first');
      res.redirect('/login');
  },
  checkUserHotel: function(req, res, next){
    Hotel.findById(req.params.id, function(err, foundHotel){
      if(err || !foundHotel){
          console.log(err);
          req.flash('error', 'Sorry, but that hotel does not exist!');
          res.redirect('/hotels');
      } else if(foundHotel.author.id.equals(req.user._id)){
          req.hotel = foundHotel;
          next();
      } else {
          req.flash('error', 'You do not have the permission to do that!');
          res.redirect('/hotels/' + req.params.id);
      }
    });
  },
  checkUserComment: function(req, res, next){
    Comment.findById(req.params.commentId, function(err, foundComment){
       if(err || !foundComment){
           console.log(err);
           req.flash('error', 'That comment does not exist');
           res.redirect('/hotels');
       } else if(foundComment.author.id.equals(req.user._id)){
            req.comment = foundComment;
            next();
       } else {
           req.flash('error', 'You do not have the permission to do that!');
           res.redirect('/hotels/' + req.params.id);
       }
    });
  },
};