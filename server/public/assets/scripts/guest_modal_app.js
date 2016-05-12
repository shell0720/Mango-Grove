var newMessage = {};
var messageType = "";
var dateOptions = {     // Date formatting options
    year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
};

$(document).ready(function(){
  $('#createGuestPost').on('click', createPost);//when submit button is pressed in the guest_comment_modal

  var maxLength = 150;
  $('#guestTextarea').keyup(function() {
    var length = $(this).val().length;
    var length = maxLength-length;
    $('.chars').text(length);
  });
});

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

    $('.social-feed-box').prepend('<div class="media animated fadeInRight underline"></div>');//creates each individual comment
    var $el = $('.social-feed-box').children().first();
    $el.append('<div class="post-icon"><img src="/assets/views/images/'+ iconType +'.png" height="30" width="30" /></div>');
    $el.append('<div class="social-avatar"><a href="" class="pull-left"><img alt="image" src="/vendors/Static_Seed_Project/img/a1.jpg"></a><div class="media-body"><a href="#">'+message.name+'</a><small class="text-muted">'+message.date_created+'</small></div></div>');
    $el.append('<div class="social-body"><p>'+message.content+'</p><div class="btn-group"><button class="btn btn-white btn-xs messageLike" data-id="' + message._id + '"><span>'+ likeAmmount +'</span><i class="fa fa-thumbs-up"></i> Like this!</button><button class="btn btn-white btn-xs" id="messageComment" data-toggle="modal" data-target="#guestMessageCommentModal" data-id="'+message._id+'"><i class="fa fa-comments"></i> Comment</button></div><button class="btn btn-white btn-xs flag-button small-type"><i class="fa fa-flag"></i> Report inappropriate post</button></div>');
    $el.append('<div id="'+message._id+'"></div>');

}
