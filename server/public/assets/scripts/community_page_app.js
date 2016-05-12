var communityList = ["Carlson School of Management","Macalester"];
var community = 'Global';
var messageType = "all";
var newMessage = {};
var dateOptions = {     // Date formatting options
    year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
};

$(document).ready(function(){
  //$("#loadCommunityModal").load('/assets/views/modals/user_post_modal.html');
  $("#loadCommunityCommentModal").load('/assets/views/modals/user_comment_modal.html');
  $("#loadFeedbackModal").load('/assets/views/modals/feedback_modal.html');
  $("#loadWelcomeModal").load('/assets/views/modals/welcome.html');

  showGlobal(messageType);

  $('.current-community').html(' ' + community);
  $('.message-type').html(' All Messages');

  for(var i = 0; i < communityList.length; i++){
    $('.nav-second-level').append('<li><a href="#messageTop" class="community-filter" data-location="'+communityList[i]+'">'+communityList[i]+'</a></li>');
    $('.community-list').append('<label><input type="checkbox" name="location" value="'+communityList[i]+'"> '+communityList[i]+'</label><span class="right-space">&nbsp;</span> ');
  }


  $('.see-more-community').data("newType", messageType);
  $('.see-more-community').data('community', community);

  $('.community-filter').on('click',function(){
      community = $(this).data('location');
      $('.see-more-community').data('community', community);
      console.log("Community defined here is: ", community);
      $('.current-community').html(' ' + community);
      showMessages(community, messageType);
  });

  $('.community-global').on('click', function(){
      showGlobal(messageType);
      $('.current-community').html(' Global');
  });

  $('.filter-messages').on('click',function(){//Event Handler that will Filter global messages
      console.log("This is what Community equals in the filter-messages: ", community);
      messageType = $(this).data('type');
      $('.see-more-community').data("newType", messageType);
      if(community == "global"){
        showGlobal(messageType);
      }
      else{
        showMessages(community, messageType);
      }


  });

  $('#createCommunityPost').on('click',function(){
    console.log("Message Type when being clicked: ", messageType);
    createCommunityPost(messageType);
  });

  console.log("Message Type on page load: ", messageType);
  //CODE FOR CHARACTER REMAINING IN TEXTAREA

  $('.social-feed-box').on('click', '.messageLike', likeMessage);


  // Flag Message
  $('.social-feed-box').on('click', '.messageFlag', flagMessage);
  //Feedback filter
  $('.compose-feedback').on('click', composeFeedback);
  //Load Get Started
  $('.load-welcome').on('click', loadWelcomeModal);

  // $('#createCommunityPost').on('click',createCommunityPost);
  // for(var i = 0; i < communityList.length; i++){
  //   $('.community-list').append('<label><input type="checkbox" name="location" value="'+communityList[i]+'"> '+communityList[i]+'</label> ');
  // }
  //CHARACTER COUNT
  var maxLength = 150;
  $('#communityTextarea').keyup(function() {
    var length = $(this).val().length;
    var length = maxLength-length;
    $('.chars').text(length);
  });


  $(".social-feed-box").on('click', '.see-more-community', showMoreCommunityFeed);
});

function loadWelcomeModal(){
  $('#welcomeModal').modal('show');
}

function composeFeedback(){
  $('#feedbackModal').modal('show');
}

// function getMessageID() {
//     console.log("HERE: ", $(this).data("id"));
//     var messageID = $(this).data("id");
//     //set the message id for the post button
//     $("#createUserComment").data("id", messageID);
//     console.log("this message id will be", messageID);
// }

// function composeMessage(type){//function that is called to open up the Compose Modal Message which sets the type of the message
//     $('.modal-body').data('messageType',type);
//     console.log("Message Type inside the compose Message function: ",type);
//     $('#userMessageModal').modal('show');
// }

function showGlobal(messageType){//Shows specific Messages -- Mango Momment, Affirmations, Shout Outs or All of them
  var type = messageType;
  var amount = 20;//Limits how many messages are displayed on the dom at any given time
  var time = new Date(Date.now());

  if(type == "all"){
    $('.message-type').html(' All Messages');
  }
  else if(type == "af"){
    $('.message-type').html('<img src="/assets/views/images/noun_75102_cc.png" height="20" width="20" /> Encouragements');
  }
  else if(type == "so"){
    $('.message-type').html('<img src="/assets/views/images/noun_24896_cc_mod.png" height="20" width="20" /> Shout-Outs');
  }
  else if(type == "mm"){
    $('.message-type').html('<img src="/assets/views/images/mango_small.png" height="20"  />Moments');
  }
  $.ajax({
    type: 'GET',
    url: '/message/global/'+type+'/'+amount+'/'+time,
    success: loadCommunityFeed //loads messages on the success of the ajax call
  });
}


function showMessages(community, messageType){//Shows specific Messages -- Mango Momment, Affirmations, Shout Outs or All of them
  var location = community;
  var type = messageType;
  var amount = 20;//Limits how many messages are displayed on the dom at any given time
  var time = new Date(Date.now());
  //TRACEY
  if(type == "all"){
    $('.message-type').html(' All Messages');
  }
  else if(type == "af"){
    $('.message-type').html(' Encouragements <img src="/assets/views/images/noun_75102_cc.png" height="20" width="20" />');
  }
  else if(type == "so"){
    $('.message-type').html(' Shout-Outs <img src="/assets/views/images/noun_24896_cc_mod.png" height="20" width="20" />');
  }
  else if(type == "mm"){
    $('.message-type').html(' Moments <img src="/assets/views/images/mango_small.png" height="20"  />');
  }
  console.log("Location: ", location);
  console.log("Type: ", type);
  $.ajax({
    type: 'GET',
    url: '/message/'+location+'/'+type+'/'+amount+'/'+time,
    success: loadCommunityFeed //loads messages on the success of the ajax call
  });
}

function loadCommunityFeed(response){//Loads Messages to GlobalFeed
  console.log("made it here");
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
    $el.append('<div class="social-body"><p>'+message.content+'</p><div class="btn-group"><button class="btn btn-white btn-xs messageLike" data-id="' + message._id + '"><span>'+ likeAmmount +'</span><i class="fa fa-thumbs-up"></i> Like this!</button><button class="btn btn-white btn-xs" id="communityMessageComment" data-toggle="modal" data-target="#userMessageCommentModal" data-id="'+message._id+'"><i class="fa fa-comments"></i> Comment</button></div><button class="btn btn-white btn-xs flag-button small-type messageFlag" data-id="' + message._id + '"><i class="fa fa-flag"></i> Report inappropriate post</button></div>');
    $el.append('<div id="'+message._id+'"></div>');
    getCommentsByMessage(message._id);
    $('.see-more-community').data("time", newDate);
  }
  $('.social-feed-box').append('<button class="animated fadeInRight col-md-12 see-more-community filter-messages btn-white" autofocus="true" >See More</button>');
}

function createCommunityPost(type){
  messageType = type;

  console.log("Message Type from the data method: ", messageType);
  var checked = $("input[type=checkbox]:checked").length;
  if(!checked) {
    $('#errorMessage').text("You must check at least one checkbox.");
    return false;
  }

  event.preventDefault();
  var messageArray = $('#communityPostMessageForm').serializeArray();  //grab the information from the compose message moda
  newMessage.location = [];
  newMessage.global = false;//Set global to false unless user checks
  $.each(messageArray, function(index, element){//grab information off the form and stores it into the newMessage variable
    if(element.name == "location"){
      newMessage.location.push(element.value);//push multiple locations to location key
      // newMessage[element.name] = element.value;
    }
    else{
      newMessage[element.name] = element.value;
    }
  });
  console.log("new message being posted down :", newMessage);
  $('#communityTextarea').val('');
  $('#communityEmail').val('');
  $('#username').val('');
  $.ajax({
    type: 'POST',
    url: '/message',
    data: newMessage, //Pass newMessage to the Database
    success:  addNewMessageToFeed
  });
}

function addNewMessageToFeed(response){//Append New Message to the Top of the Feed
  console.log("Response for addNewMessageToFeed", response);
  var message = response;
  var likeAmmount;
  if(message.like){
    likeAmmount = message.like + " ";
  }else{
    likeAmmount = "";
  }
//store response into comment for readability
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

  console.log("HERE");
  // Formats date/time
  var newDate = new Date(message.date_created);
  message.date_created = newDate.toLocaleTimeString("en-us", dateOptions);
  console.log("Message community: ", community);
  console.log("newMessage object global status: ", newMessage.global);
  console.log("Message TYpe is: ", messageType);
  console.log("Message Type is: ", newMessage.type);

  if((newMessage.global == 'true') && (community == "Global") && (messageType == 'all' || messageType == newMessage.type)){
    $('.social-feed-box').prepend('<div class="animated fadeInRight underline"></div>');//creates each individual comment
    var $el = $('.social-feed-box').children().first();
    $el.append('<div class="post-icon"><img src="/assets/views/images/'+ iconType +'.png" height="30" width="30" /></div>');
    $el.append('<div class="social-avatar"><a href="" class="pull-left"><img alt="image" src="/vendors/Static_Seed_Project/img/a1.jpg"></a><div class="media-body"><a href="#">'+message.name+'</a><small class="text-muted">'+message.date_created+'</small></div></div>');
    $el.append('<div class="social-body"><p>'+message.content+'</p><div class="btn-group"><button class="btn btn-white btn-xs messageLike" data-id="' + message._id + '"><span>'+ likeAmmount +'</span><i class="fa fa-thumbs-up"></i> Like this!</button><button class="btn btn-white btn-xs" id="communityMessageComment" data-toggle="modal" data-target="#userMessageCommentModal" data-id="'+message._id+'"><i class="fa fa-comments"></i> Comment</button></div><button class="btn btn-white btn-xs flag-button small-type messageFlag" data-id="' + message._id + '"><i class="fa fa-flag"></i> Report inappropriate post</button></div>');
    $el.append('<div id="'+message._id+'"></div>');
  }

  else if((message.location.indexOf(community) > -1) && (messageType == 'all' || messageType == newMessage.type)){
    $('.social-feed-box').prepend('<div class="animated fadeInRight underline"></div>');//creates each individual comment
    var $el = $('.social-feed-box').children().first();
    $el.append('<div class="post-icon"><img src="/assets/views/images/'+ iconType +'.png" height="30" width="30" /></div>');
    $el.append('<div class="social-avatar"><a href="" class="pull-left"><img alt="image" src="/vendors/Static_Seed_Project/img/a1.jpg"></a><div class="media-body"><a href="#">'+message.name+'</a><small class="text-muted">'+message.date_created+'</small></div></div>');
    $el.append('<div class="social-body"><p>'+message.content+'</p><div class="btn-group"><button class="btn btn-white btn-xs messageLike" data-id="' + message._id + '"><span>'+ likeAmmount +'</span><i class="fa fa-thumbs-up"></i> Like this!</button><button class="btn btn-white btn-xs" id="communityMessageComment" data-toggle="modal" data-target="#userMessageCommentModal" data-id="'+message._id+'"><i class="fa fa-comments"></i> Comment</button></div><button class="btn btn-white btn-xs flag-button small-type messageFlag" data-id="' + message._id + '"><i class="fa fa-flag"></i> Report inappropriate post</button></div>');
    $el.append('<div id="'+message._id+'"></div>');
  }
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

// Get message id and make ajax call to increment flag amount in db and on DOM
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

// Get message id and make ajax call to increment flag amount in db and on DOM
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


// Get message id and make ajax call to increment like amount in db and on DOM
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

function showMoreCommunityFeed(type){
  var location = $('.see-more-community').data('community');
  var amount = 20;
  var type = $('.see-more-community').data("newType");
  var time = $('.see-more-community').data('time');
  console.log(time);
  $(this).remove();

    if(type == "all"){
      $('.message-type').html(' All Messages');
    }
    else if(type == "af"){
      $('.message-type').html(' Encouragements <img src="/assets/views/images/noun_75102_cc.png" height="20" width="20" /> ');
    }
    else if(type == "so"){
      $('.message-type').html(' Shout-Outs <img src="/assets/views/images/noun_24896_cc_mod.png" height="20" width="20" /> ');
    }
    else if(type == "mm"){
      $('.message-type').html(' Moments <img src="/assets/views/images/mango_small.png" height="20"  />');
    }
    $.ajax({
      type: 'GET',
      url: '/message/'+location+'/'+type+'/'+amount+'/'+time,
      success: loadMoreCommunityFeed //loads messages on the success of the ajax call
    });

}


function loadMoreCommunityFeed(response){//Loads Messages to GlobalFeed
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
    $('.see-more-community').data('time',newDate);
  }
    $('.social-feed-box').append('<button class="animated fadeInRight col-md-12 see-more-community btn-white" autofocus="true" >See More</button>');
}
