var communityList = ["Carlson School","Macalester School"];
var community = communityList[0];
var dateOptions = {     // Date formatting options
    year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
};

  var newMessage = {};//New Message object to be sent down to the database
  var newUser = {}; //Used to strip email address from blocking form
$(document).ready(function(){
  $("#loadComposeModal").load('/assets/views/modals/user_comment_modal.html');

  console.log("Jquery is working!");
  getBlockedUsers();
  getFlaggedMessages();
  getFlaggedComments();
  viewFeedback();
  $('.flagged-messages-container').on('click','.delete-message', deleteMessage);
  $('.flagged-comments-container').on('click','.delete-comment', deleteComment);
  $('.flagged-messages-container').on('click','.unflag-message', unflagMessage);
  $('.flagged-comments-container').on('click','.unflag-comment', unflagComment);

  $('#block-user-form').on('submit', submitBlockedUser)
  $('.blocked-users-container').on('click', '.remove-blocked-user', unblockUser);
  //  BRADY'S CODE
  var messageType = "all";
  showMessages(messageType);//show all messages on page load

  $('.compose').on('click', composeMessage);//When Compose Buttons are clicked for guests

  $('.filter-messages').on('click',function(){//Event Handler that will Filter global messages
    messageType = $(this).data('type');
    showMessages(messageType);
  });
  $('.comment-container').on('click','.delete-message', deleteMessage);
  $('#createGuestPost').on('click', createPost);//when submit button is pressed in the guest_comment_modals
  //WILL NEED #createUserPost event handler

});

//
// EVAN'S CODE
//
function submitBlockedUser(event){
  event.preventDefault();
  var userArray = $('#block-user-form').serializeArray();  //grab the information from the compose message moda
  $.each(userArray, function(index, element){//grab information off the form and stores it into the newMessage variable
    newUser[element.name] = element.value;
  });
  $('#userName').val('');

  $.ajax({
    type: 'POST',
    url: '/admin/blockUser',
    data: newUser, //Pass newMessage to the Database
    success: getBlockedUsers //call addNewMessageToFeed function to display new post right away
  });
}

function appendBlockedUsers(data){
  console.log("Appending Blocked Users: ", data);
  $('.blocked-users-container').empty();
  for (var i = 0; i < data.length; i++) {
    var user = data[i];
    $('.blocked-users-container').append('<h4><button type="button" class="close remove-blocked-user" data-userName="'+user+'" aria-label="Close"><span aria-hidden="true">×</span></button>'+user+'</h4>');
  }
}

function showFlaggedMessages(data){
  $('.flagged-messages-container').empty();  //empty out the div container on the DOM that stores the messages to refresh the page
  // $('.flagged-messages-container').addClass('social-feed-box');
  if(data.length > 0){
    for(var i = 0; i <data.length; i++){  //append info to comment-container by looping through the array
      var message = data[i];//store response into comment for readability

      var iconType;             // Sets icon type to be displayed on dom
      switch (message.type) {
        case "so":
          iconType = "noun_24896_cc_mod"
          break;
        case "mm":
          iconType = "mango"
          break;
        case "af":
          iconType = "noun_75102_cc"
          break;
      }

      // Formats date/time
      var newDate = new Date(message.date_created);
      message.date_created = newDate.toLocaleTimeString("en-us", dateOptions);

      $('.flagged-messages-container').append('<div class="animated fadeInRight"></div>');//creates each individual comment
      var $el = $('.flagged-messages-container').children().last();

      $el.append('<div class="post-icon"><img src="/assets/views/images/'+ iconType +'.png" height="30" width="30" /></div>');
      $el.append('<div class="social-avatar"><a href="" class="pull-left"><img alt="image" src="/vendors/Static_Seed_Project/img/a1.jpg"></a><div class="media-body"><a href="#">'+message.name+'</a><small class="text-muted">'+message.date_created+'</small></div></div>');
      $el.append('<div class="social-body"><p>'+message.content+'</p><div class="btn-group"><button class="btn btn-white btn-xs unflag-message" data-messageid="'+message._id+'">Remove '+message.flag+' Flag(s)</button><button class="btn btn-white btn-xs delete-message" data-messageid="'+message._id+'">Delete Post</button></div></div>');

    }
  }else{
    //Appends Message saying "No flagged content"
    $('.flagged-messages-container').append('<div class="media animated fadeInRight"><div class="media-body"><h4 class="media-heading">No Messages are flagged currently.</h4></div></div>');
  }
}
function showFlaggedComments(data){
  $('.flagged-comments-container').empty();  //empty out the div container on the DOM that stores the messages to refresh the page
  $('.flagged-comments-container').addClass('social-feed-box');

  if(data.length >0){
    for(var i = 0; i <data.length; i++){  //append info to comment-container by looping through the array

      var comment = data[i];//store response into comment for readability


      // Formats date/time
      var newDate = new Date(comment.date_created);
      comment.date_created = newDate.toLocaleTimeString("en-us", dateOptions);

      $('.flagged-comments-container').append('<div class="animated fadeInRight"></div>');//creates each individual comment
      var $el = $('.flagged-comments-container').children().last();

      $el.append('<div class="social-avatar"><a href="" class="pull-left"><img alt="image" src="/vendors/Static_Seed_Project/img/a1.jpg"></a><div class="media-body"><a href="#">'+comment.name+'</a><small class="text-muted">'+comment.date_created+'</small></div></div>');
      $el.append('<div class="social-body"><p>'+comment.content+'</p><div class="btn-group"><button class="btn btn-white btn-xs unflag-comment" data-commentid="'+comment._id+'">Remove '+comment.flag+' Flag(s)</button><button class="btn btn-white btn-xs delete-comment" data-commentid="'+comment._id+'">Delete Post</button></div></div>');
    }
  }else{
    //Appends Message saying "No flagged content"
    $('.flagged-comments-container').append('<div class="media animated fadeInRight"><div class="media-body"><h4 class="media-heading">No Comments are flagged currently.</h4></div></div>');
  }
}



//AJAX CALLS
function getBlockedUsers(){
  console.log("Calling to getBlockedUsers");
  $.ajax({
    type: 'GET',
    url: '/admin/blockedUsers',
    success: appendBlockedUsers
  });
}
function blockUser(userName){
  var body = {userName: userName};
  $.ajax({
    type: 'POST',
    url: '/admin/blockUser',
    data: body,
    success: function(data){
      console.log("Blocked user: ", data);
    }
  });
}
function unblockUser(){
  var userName = $(this).data('username');
  var body = {userName: userName};
  $.ajax({
    type: 'PUT',
    url: '/admin/unblockUser',
    data: body,
    success: getBlockedUsers
  });
}
function getFlaggedMessages(){
  $.ajax({
    type: 'GET',
    url: '/admin/flaggedMessages',
    success: showFlaggedMessages
  });
}
function getFlaggedComments(){
  $.ajax({
    type: 'GET',
    url: '/admin/flaggedComments',
    success: showFlaggedComments
  });
}
function viewFeedback(){
  $.ajax({
    type: 'GET',
    url: '/admin/allFeedback',
    success: function(data){
      console.log("Got all feedback: ", data);
    }
  });
}

function unflagMessage(){
  console.log($(this));
  var messageID = $(this).data('messageid');
  $.ajax({
    type: 'PUT',
    url: '/admin/unflag/'+ messageID,
    success: getFlaggedMessages
  });
}
function unflagComment(){
  var commentID = $(this).data('commentid');
  $.ajax({
    type: 'PUT',
    url: '/admin/unflag/comment/'+ commentID,
    success: getFlaggedComments
  });
}

function deleteMessage(){
  var messageID = $(this).data('messageid');
  $.ajax({
    type: 'DELETE',
    url: '/message/'+ messageID,
    success: function(data){
      getFlaggedMessages();
      showMessages(data.type);
    }
  });
}
function deleteComment(){
  var commentID = $(this).data('commentid');
  $.ajax({
    type: 'DELETE',
    url: '/message/comment/'+ commentID,
    success: function(data){
      getFlaggedComments();
      showMessages(data.type);
    }
  });
}

// End of Unique admin functionality







//
//  START OF REGULAR USER FUNCTIONALITY
//

function composeMessage(){//function that is called to open up the Compose Modal Message which sets the type of the message
  var composeType = $(this).data('type');
  $('#userCommentModal').modal('show');
}

function showMessages(messageType){//Shows specific Messages -- Mango Momment, Affirmations, Shout Outs or All of them
  var type = messageType;
  var amount = 20;//Limits how many messages are displayed on the dom at any given time
  var time = new Date(Date.now());
  console.log("Made It here to the conditional Statements: ", type);

  if(type == "all"){
    $('.message-type').html('<i class="fa fa-sun-o"></i> All Messages');
  }
  else if(type == "af"){
    $('.message-type').html('<i class="fa fa-sun-o"></i> Encouragements');
  }
  else if(type == "so"){
    $('.message-type').html('<i class="fa fa-sun-o"></i> Shout-Outs');
  }
  else if(type == "mm"){
    $('.message-type').html('<i class="fa fa-sun-o"></i> Mango Moments');
  }
  $.ajax({
    type: 'GET',
    url: '/message/global/'+type+'/'+amount+'/'+time,
    success: loadGlobalFeed //loads messages on the success of the ajax call
  });
}


function createPost(event){//Create Post Function
    event.preventDefault();
    var messageArray = $('#postMessageForm').serializeArray();  //grab the information from the compose message moda

    $.each(messageArray, function(index, element){//grab information off the form and stores it into the newMessage variable
      newMessage[element.name] = element.value;
    });
    newMessage.global = true;
    //reset input field values
    $('#guestTextarea').val('');
    $('#guestEmail').val('');
    $('#username').val('');
    $.ajax({
      type: 'POST',
      url: '/message',
      data: newMessage, //Pass newMessage to the Database
      success: addNewMessageToFeed //call addNewMessageToFeed function to display new post right away
    });
}

function addNewMessageToFeed(response){//Append New Message to the Top of the Feed
  $('.comment-container').prepend('<div class="media animated fadeInRight"></div>');
  var $el = $('.comment-container').children().first();

  $el.append('<a class="forum-avatar" href="#"><img src="/vendors/Static_Seed_Project/img/a3.jpg" class="img-circle" alt="image"><div class="author-info"><strong>Posts:</strong> 543<br/><strong>Date of Post:</strong>'+response.date_created+'<br/></div></a>');
  $el.append('<div class="media-body"><h4 class="media-heading">Hampden-Sydney College in Virginia</h4>'+response.content+'<br/><br/>- '+response.name+'</div>');
  $el.append('<div class="media-body react-options"><button class="react-button fa fa-thumbs-o-up" title="Like"></button><button class="react-button fa fa-comment-o" title="Comment"></button><button class="react-button delete-message" data-messageid="'+response._id+'">Delete Post</button></div>');
}


function loadGlobalFeed(response){//Loads Messages to GlobalFeed

  $('.comment-container').empty();  //empty out the div container on the DOM that stores the messages to refresh the page

  for(var i = 0; i <response.length; i++){  //append info to comment-container by looping through the array

    var comment = response[i];//store response into comment for readability
    $('.comment-container').append('<div class="media animated fadeInRight"></div>');//creates each individual comment
    var $el = $('.comment-container').children().last();

    $el.append('<a class="forum-avatar" href="#"><img src="/vendors/Static_Seed_Project/img/a3.jpg" class="img-circle" alt="image"><div class="author-info"><strong>Posts:</strong> 543<br/><strong>Date of Post:</strong>'+comment.date_created+'<br/></div></a>');
    $el.append('<div class="media-body"><h4 class="media-heading">Hampden-Sydney College in Virginia</h4>'+comment.content+'<br/><br/>- '+comment.name+'</div>');
      $el.append('<div class="media-body react-options"><button class="react-button fa fa-thumbs-o-up" title="Like"></button><button class="react-button fa fa-comment-o" title="Comment"></button><button class="react-button delete-message" data-messageid="'+comment._id+'">Delete Post</button></div>');
  }
}
