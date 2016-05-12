var express = require('express');
var router = express.Router();
var path = require('path');

var Message = require('../models/messages.js');
var Comment = require('../models/comment.js');
var BlockedUsers = require('../models/blockedUsers.js');


// Creates new BlockedUsers list if none exists
BlockedUsers.find({},function(err,data){
  if(err){
    console.log(err);
  } else{
    if (!data.length){
      var newList = new BlockedUsers({});
      newList.save(function(err){
        if(err){
          console.log(err);
        }
      });
    }
  }
});

// GETS

router.get('/blockedUsers', function(req, res){
  BlockedUsers.find({}, function(err,data){
    if(err){
      console.log(err);
      res.send();
    } else{
      var userList = data[0].list;
      console.log("Here are all the blocked users: ", userList);
      res.send(userList);
    }
  });
});
router.get('/flaggedMessages', function(req, res){
  Message.find({flag: {$gt: 0}}, function(err,data){
    if(err){
      console.log(err);
      res.send();
    } else{
      res.send(data);
    }
  });
});
router.get('/flaggedComments', function(req, res){
  Comment.find({flag: {$gt: 0}}, function(err,data){
    if(err){
      console.log(err);
      res.send();
    } else{
      res.send(data);
    }
  });
});
router.get('/allFeedback',function(req, res){
  console.log("Get all feedback route currently unavailable");
  res.send("Get all feedback route currently unavailable");
});

// POSTS

router.post('/blockUser', function(req, res){
  var userName = req.body.userName;

  BlockedUsers.update({}, {$addToSet: {list: userName}}, function(err, data){
    if(err){
      console.log(err);
      res.send();
    } else{
      console.log(data);
      res.send(data);
    }
  });
});


// PUTS

router.put('/unblockUser', function(req,res){
  var userName = req.body.userName;
  BlockedUsers.update({}, {$pull: {list: userName}}, function(err, data){
    if(err){
      console.log(err);
      res.status(500);
    } else{
      console.log("Successfully removed user from blocked list!");
      res.status(200).send();
    }
  });
});

// unflags

// Edits comment by id
router.put('/unflag/comment/:commentID', function(req,res){
  var commentID = req.params.commentID;

  Comment.update({_id: commentID},
              {flag: 0},
             function(err, data){
               if(err){
                 console.log(err);
                 res.send("Failed to unflag your comment");
               } else{
                 res.send(data);
               }
  });
});

// Edits Message by id
router.put('/unflag/:messageID', function(req,res){
  var messageID = req.params.messageID;

  Message.update({_id: messageID},
              {flag: 0},
             function(err, data){
               if(err){
                 console.log(err);
                 res.send("Failed to unflag your message");
               } else{
                 res.send(data);
               }
  });
});






//
// USE MESSAGE ROUTER TO DELETE MESSAGES AND COMMENTS
//


// Send back admin home page if requested
router.get("/", function(req,res){
  var file = req.params[0] || "/assets/views/admin/admin.html";
  res.sendFile(path.join(__dirname,"../public/", file));
});

module.exports = router;
