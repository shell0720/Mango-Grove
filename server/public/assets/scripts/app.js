var newMessage = {};
var messageType = "all";
var dateOptions = {     // Date formatting options
    year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
};



$(document).ready(function(){

    //load all modals to the DOM
    //$("#loadComposeModal").load('/assets/views/modals/guest_post_modal.html');
    $("#loadCommentModal").load('/assets/views/modals/guest_comment_modal.html');
    $("#loadWelcomeModal").load('/assets/views/modals/welcome.html');
    $("#loadFeedbackModal").load('/assets/views/modals/feedback_modal.html');
    console.log("message type: ", messageType);

    var messageType = "all";
    $('.seeMore').data("newType", messageType);

    showMessages(messageType);//show all messages on page load
    console.log("message type: ", messageType);
    $('.compose').on('click',composeMessage);//When Compose Buttons are clicked for guests

    $('.filter-messages').on('click',function(){//Event Handler that will Filter global messages
      messageType = $(this).data('type');
      //pass the data type to load more button
      $('.seeMore').data("newType", messageType);
      console.log(messageType);

      showMessages(messageType);
    });
    // Like Abilities
    $('.social-feed-box').on('click', '.messageLike', likeMessage);
    // Flag Abilities
    $('.social-feed-box').on('click', '.messageFlag', flagMessage);


    //load more feed
    $(".social-feed-box").on('click', '.seeMore', showMoreFeed);

    $('.social-feed-box').on('click', '.commentFlag', flagComment);
    //Feedback modal listener
    $('.compose-feedback').on('click', composeFeedback);

    $('.load-welcome').on('click', loadWelcomeModal);


    $('#createGuestPost').on('click', createPost);//when submit button is pressed in the guest_comment_modal


    var maxLength = 150;
    $('#guestTextarea').keyup(function() {
      var length = $(this).val().length;
      var length = maxLength-length;
      $('.chars').text(length);
    });
});

function loadWelcomeModal(){
  $('#welcomeModal').modal('show');
}

function composeFeedback(){
  $('#feedbackModal').modal('show');
}

function composeMessage(){//function that is called to open up the Compose Modal Message which sets the type of the message
    $('#guestCommentModal').modal('show');
}

function showMessages(messageType){//Shows specific Messages -- Mango Momment, Affirmations, Shout Outs or All of them
  var type = messageType;
  var amount = 20; //Limits how many messages are displayed on the dom at any given time
  var time = new Date(Date.now());


  if(type == "all"){
    $('.text-navy').html(' All Messages');
  }
  else if(type == "af"){
    $('.text-navy').html('<img src="/assets/views/images/noun_75102_cc.png" height="20" width="20" /> Encouragements');
  }
  else if(type == "so"){
    $('.text-navy').html('<img src="/assets/views/images/noun_24896_cc_mod.png" height="20" width="20" /> Shout-Outs');
  }
  else if(type == "mm"){
    $('.text-navy').html('<img src="/assets/views/images/mango_small.png" height="20"  />Moments');
  }
  $.ajax({
    type: 'GET',
    url: '/message/global/'+type+'/'+amount+'/'+time,
    success: loadGlobalFeed //loads messages on the success of the ajax call
  });
}

function showMoreFeed(){
  var amount = 20;
  var type = $('.seeMore').data("newType");
  var time = $('.seeMore').data('time');
  console.log(time);
  $(this).remove();

    if(type == "all"){
      $('.text-navy').html(' All Messages');
    }
    else if(type == "af"){
      $('.text-navy').html('<img src="/assets/views/images/noun_75102_cc.png" height="20" width="20" /> Encouragements');
    }
    else if(type == "so"){
      $('.text-navy').html('<img src="/assets/views/images/noun_24896_cc_mod.png" height="20" width="20" /> Shout-Outs');
    }
    else if(type == "mm"){
      $('.text-navy').html('<img src="/assets/views/images/mango_small.png" height="20"  />Moments');
    }
    $.ajax({
      type: 'GET',
      url: '/message/global/'+type+'/'+amount+'/'+time,
      success: loadMoreGlobalFeed //loads messages on the success of the ajax call
    });

}

function loadGlobalFeed(response){//Loads Messages to GlobalFeed
  $('.social-feed-box').empty();  //empty out the div container on the DOM that stores the messages to refresh the page
  for(var i = 0; i <response.length; i++){  //append info to comment-container by looping through the array
    var message = response[i];//store response into comment for readability
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
    // Displays ammount of likes if there are any
    var likeAmmount;
    if(message.like){
      likeAmmount = message.like + " ";
    }else{
      likeAmmount = "";
    }

    // Formats date/time
    var newDate = new Date(message.date_created);
    message.date_created = newDate.toLocaleTimeString("en-us", dateOptions);

    // Appends to DOM
    $('.social-feed-box').append('<div class="animated fadeInRight underline"></div>');//creates each individual comment
    var $el = $('.social-feed-box').children().last();
    $el.append('<div class="post-icon"><img src="/assets/views/images/'+ iconType +'.png" height="30" width="30" /></div>');
    $el.append('<div class="social-avatar"><a href="" class="pull-left"><img alt="image" src="/vendors/Static_Seed_Project/img/a1.jpg"></a><div class="media-body"><a href="#">'+message.name+'</a><small class="text-muted">'+message.date_created+'</small></div></div>');
    $el.append('<div class="social-body"><p>'+message.content+'</p><div class="btn-group"><button class="btn btn-white btn-xs messageLike" data-id="' + message._id + '"><span>'+ likeAmmount +'</span><i class="fa fa-thumbs-up"></i> Like this!</button><button class="btn btn-white btn-xs" id="messageComment" data-toggle="modal" data-target="#guestMessageCommentModal" data-id="'+message._id+'"><i class="fa fa-comments"></i> Comment</button></div><button class="btn btn-white btn-xs flag-button small-type messageFlag" data-id="' + message._id + '"><i class="fa fa-flag"></i> Report inappropriate post</button></div>');
    $el.append('<div id="'+message._id+'"></div>');
    getCommentsByMessage(message._id);
    //var messageTime = message.date_created;
    $('.seeMore').data("time", newDate);
  }
    $('.social-feed-box').append('<button class="animated fadeInRight col-md-12 seeMore filter-messages btn-white" autofocus="true" >See More</button>');
}

function loadMoreGlobalFeed(response){//Loads Messages to GlobalFeed
  for(var i = 0; i < response.length; i++){  //append info to comment-container by looping through the array
    var message = response[i];//store response into comment for readability
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


    // Displays ammount of likes if there are any
    var likeAmmount;
    if(message.like){
      likeAmmount = message.like + " ";
    }else{
      likeAmmount = "";
    }

    // Formats date/time
    var newDate = new Date(message.date_created);
    message.date_created = newDate.toLocaleTimeString("en-us", dateOptions);

    // Appends to DOM
    $('.social-feed-box').append('<div class="animated fadeInRight underline"></div>');//creates each individual comment
    var $el = $('.social-feed-box').children().last();
    $el.append('<div class="post-icon"><img src="/assets/views/images/'+ iconType +'.png" height="30" width="30" /></div>');
    $el.append('<div class="social-avatar"><a href="" class="pull-left"><img alt="image" src="/vendors/Static_Seed_Project/img/a1.jpg"></a><div class="media-body"><a href="#">'+message.name+'</a><small class="text-muted">'+message.date_created+'</small></div></div>');
    $el.append('<div class="social-body"><p>'+message.content+'</p><div class="btn-group"><button class="btn btn-white btn-xs messageLike" data-id="' + message._id + '"><span>'+ likeAmmount +'</span><i class="fa fa-thumbs-up"></i> Like this!</button><button class="btn btn-white btn-xs" id="messageComment" data-toggle="modal" data-target="#guestMessageCommentModal" data-id="'+message._id+'"><i class="fa fa-comments"></i> Comment</button></div><button class="btn btn-white btn-xs flag-button small-type messageFlag" data-id="' + message._id + '"><i class="fa fa-flag"></i> Report inappropriate post</button></div>');
    $el.append('<div id="'+message._id+'"></div>');
    getCommentsByMessage(message._id);
    //var messageTime = message.date_created;
    $('.seeMore').data('time',newDate);
  }
    $('.social-feed-box').append('<button class="animated fadeInRight col-md-12 seeMore filter-messages btn-white" autofocus="true" >See More</button>');
}

function getCommentsByMessage(messageID) {
    var messageID = messageID;
    $.ajax({
        type: 'GET',
        url: '/message/comment/'+ messageID,
        success: showComments
    });

}

function showComments(response) {
  console.log(response);
  // Shows comments if available
  if(response.length){
    var messageID = response[0].messageID;
    $('#'+messageID).empty();
    $('#'+messageID).addClass('social-footer');

    for (var i = 0; i < response.length; i++) {
        var comment = response[i]; //store response into comment for readability

        // Displays ammount of likes if there are any
        var likeAmmount;
        if(comment.like){
          likeAmmount = comment.like + " ";
        }else{
          likeAmmount = "";
        }

        // Formats date/time
        var newDate = new Date(comment.date_created);
        comment.date_created = newDate.toLocaleTimeString("en-us", dateOptions);

        $('#' + comment.messageID).append('<div class="social-comment indent underline-comment"></div>'); //creates each individual comment
        var $el = $('#' + comment.messageID).children().last();
        $el.append(' <a href="" class="pull-left"> <img alt="image" src="/vendors/Static_Seed_Project/img/a1.jpg"></a>');
        $el.append(' <div class="media-body"><a href="#">' + comment.name + '</a> ' + comment.content + '<br/><small class="text-muted"> ' + comment.date_created + '</small><br/><a class="small commentLike" data-id="'+comment._id+'"><span>'+likeAmmount+'</span><i class="fa fa-thumbs-up"></i> Like this!</a><span class="flag-link"><a class="small commentFlag" data-id="'+comment._id+'"><i class="fa fa-flag"></i> Report this</a></span></div>');
    }
  }
}

function createPost(event){//Create Post Function
    console.log("Global Feed Comment");
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
    $('.chars').text("150");
    $.ajax({
      type: 'POST',
      url: '/message',
      data: newMessage, //Pass newMessage to the Database
      success: addNewMessageToFeed, //call addNewMessageToFeed function to display new post right away
      error: function (xhr, ajaxOptions, thrownError){
        switch (xhr.status) {
          case 403:
           console.log("This email address is blocked");
           break;
         }
      }
    });
}

function addNewMessageToFeed(response){//Append New Message to the Top of the Feed
  var message = response;
  // console.log("Made it Here to the addnew MEssage Feed");
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

    // Displays ammount of likes if there are any
    var likeAmmount;
    if(message.like){
      likeAmmount = message.like + " ";
    }else{
      likeAmmount = "";
    }
    // Formats date/time
    var newDate = new Date(message.date_created);
    message.date_created = newDate.toLocaleTimeString("en-us", dateOptions);
    if(messageType == 'all' || messageType == newMessage.type){
      $('.social-feed-box').prepend('<div class="media animated fadeInRight underline"></div>');//creates each individual comment
      var $el = $('.social-feed-box').children().first();
      $el.append('<div class="post-icon"><img src="/assets/views/images/'+ iconType +'.png" height="30" width="30" /></div>');
      $el.append('<div class="social-avatar"><a href="" class="pull-left"><img alt="image" src="/vendors/Static_Seed_Project/img/a1.jpg"></a><div class="media-body"><a href="#">'+message.name+'</a><small class="text-muted">'+message.date_created+'</small></div></div>');
      $el.append('<div class="social-body"><p>'+message.content+'</p><div class="btn-group"><button class="btn btn-white btn-xs messageLike" data-id="' + message._id + '"><span>'+ likeAmmount +'</span><i class="fa fa-thumbs-up"></i> Like this!</button><button class="btn btn-white btn-xs" id="messageComment" data-toggle="modal" data-target="#guestMessageCommentModal" data-id="'+message._id+'"><i class="fa fa-comments"></i> Comment</button></div><button class="btn btn-white btn-xs flag-button small-type"><i class="fa fa-flag"></i> Report inappropriate post</button></div>');
      $el.append('<div id="'+message._id+'"></div>');
    }
}


// COMMENT FUNCTIONS




// get messageid by clicking the comment button
// function getMessageID() {
//     console.log("IM NEEDED");
//     var messageID = $(this).data("id");
//     //set the message id for the post button
//     $("#createGuestComment").data("id", messageID);
//
// }

//posting comment to database
// function createComment(event) {
//     //set the messageID key for the comment object
//     console.log("Global create comment being fired");
//     newComment.messageID = $("#createGuestComment").data("id");
//     event.preventDefault();
//     //grab the information from the compose comment modal NEED THE ID FROM THE FORM
//     var commentArray = $('#postCommentForm').serializeArray();
//     //grab information off the form and stores it into the newComment variable
//     $.each(commentArray, function(index, element) {
//         newComment[element.name] = element.value;
//         console.log("New Comment: ", newComment);
//     });
//     // Send to server to be saved,
//     $.ajax({
//         type: 'POST',
//         url: '/message/comment/'+ newComment.messageID,
//         data: newComment,
//         success: function(data){
//           getCommentsByMessage(newComment.messageID);
//         },
//         error: function (xhr, ajaxOptions, thrownError){
//           switch (xhr.status) {
//             case 403:
//              console.log("This email address is blocked");
//              break;
//            }
//         }
//     });
//     //reset input field values
//     $('#guestTextarea').val('');
//     $('#guestEmail').val('');
//     $('#username').val('');
//
// }
//
function getCommentsByMessage(messageID) {
    var messageID = messageID;
    $.ajax({
        type: 'GET',
        url: '/message/comment/'+ messageID,
        success: showComments
    });

}
//
// //loop through the array and append INFO
// //append info to comment-container
function showComments(response) {
  // Shows comments if available
  if(response.length){
    var messageID = response[0].messageID;
    $('#'+messageID).empty();
    $('#'+messageID).addClass('social-footer');

    for (var i = 0; i < response.length; i++) {
        var comment = response[i]; //store response into comment for readability

        // Displays ammount of likes if there are any
        var likeAmmount;
        if(comment.like){
          likeAmmount = comment.like + " ";
        }else{
          likeAmmount = "";
        }

        // Formats date/time
        var newDate = new Date(comment.date_created);
        comment.date_created = newDate.toLocaleTimeString("en-us", dateOptions);

        $('#' + comment.messageID).append('<div class="social-comment indent"></div>'); //creates each individual comment
        var $el = $('#' + comment.messageID).children().last();
        $el.append(' <a href="" class="pull-left"> <img alt="image" src="/vendors/Static_Seed_Project/img/a1.jpg"></a>');
        $el.append(' <div class="media-body"><a href="#">' + comment.name + '</a> ' + comment.content + '<br/><small class="text-muted"> -' + comment.date_created + '</small><br/><a class="small commentLike" data-id="'+comment._id+'"><span>'+likeAmmount+'</span><i class="fa fa-thumbs-up"></i> Like this!</a><span class="flag-link"><a class="small commentFlag" data-id="'+comment._id+'"><i class="fa fa-flag"></i> Report this</a></span></div>');
    }
  }
}
//
// // Get message id and make ajax call to increment flag amount in db and on DOM
function flagComment() {
    var commentID = $(this).data('id');
    if ($(this).data('alreadyPressed') == undefined) {
        $(this).data('alreadyPressed', true);
        $(this).addClass('btn-warning');
        // Toggle class here in order to only like once
        console.log("About to flag comment: ", commentID);
        $.ajax({
            type: "PUT",
            url: '/message/comment/flag/' + commentID,
            success: function(data) {
                console.log("Successfully flagged comment: ", commentID);
            }
        });
    }
}



// // Get message id and make ajax call to increment flag amount in db and on DOM
function flagMessage() {
    var messageID = $(this).data('id');
    if ($(this).data('alreadyPressed') == undefined) {
        $(this).data('alreadyPressed', true);
        $(this).removeClass('btn-white');
        $(this).addClass('btn-warning');
        // Toggle class here in order to only like once
        console.log("About to flag message: ", messageID);
        $.ajax({
            type: "PUT",
            url: '/message/flag/' + messageID,
            success: function(data) {
                console.log("Successfully flagged message: ", messageID);
            }
        });
    }
}
//
//
// // Get message id and make ajax call to increment like amount in db and on DOM
function likeMessage() {
    var messageID = $(this).data('id');
    if ($(this).data('alreadyPressed') == undefined) {
        $(this).data('alreadyPressed', true);
        $(this).removeClass('btn-white');
        $(this).addClass('btn-success');

        $.ajax({
            type: "PUT",
            url: '/message/like/' + messageID,
            success: function(data) {
                var oldValue = $('[data-id="' + messageID + '"]').children().first().text() || 0;
                var newValue = parseInt(oldValue) + 1;
                $('[data-id="' + messageID + '"]').children().first().text(newValue + " ");
            }
        });
    }
}
