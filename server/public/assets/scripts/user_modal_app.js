var newMessage = {};
var communityList = ["Carlson School of Management","Macalester"];
var community = communityList[0];
var messageType = "all";
var globalView = "";
var dateOptions = {     // Date formatting options
    year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
};

$(document).ready(function(){
    $('#createCommunityPost').on('click',createCommunityPost);
    for(var i = 0; i < communityList.length; i++){
      $('.community-list').append('<label><input type="checkbox" name="location" value="'+communityList[i]+'"> '+communityList[i]+'</label> ');
    }
    //CHARACTER COUNT
    var maxLength = 150;
    $('#communityTextarea').keyup(function() {
      var length = $(this).val().length;
      var length = maxLength-length;
      $('.chars').text(length);
    });
});

function createCommunityPost(){
  messageType = $('.modal-content').data('messageType');

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
      newMessage[element.name] = element.value;
    }
    else{
      newMessage[element.name] = element.value;
    }
  });
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
  var message = response;
  console.log("HERE");
  // Formats date/time
  var newDate = new Date(message.date_created);
  message.date_created = newDate.toLocaleTimeString("en-us", dateOptions);

  if((newMessage.global == true) && (globalView == "global")){
    $('.social-feed-box').prepend('<div class="media animated fadeInRight"></div>');//creates each individual comment
    var $el = $('.social-feed-box').children().first();

    $el.append('<div class="social-avatar"><a href="" class="pull-left"><img alt="image" src="/vendors/Static_Seed_Project/img/a1.jpg"></a><div class="media-body"><a href="#">'+message.name+'</a><small class="text-muted">'+message.date_created+'</small></div></div>');
    $el.append('<div class="social-body"><p>'+message.content+'</p><div class="btn-group"><button class="btn btn-white btn-xs"><i class="fa fa-thumbs-up"></i> Like this!</button><button class="btn btn-white btn-xs"><i class="fa fa-comments"></i> Comment</button><button class="btn btn-white btn-xs"><i class="fa fa-share"></i> Share</button></div></div><div id="'+message._id+'"></div>');
  }

  else if(message.location && (messageType == newMessage.type)){
        $('.social-feed-box').prepend('<div class="media animated fadeInRight"></div>');//creates each individual comment
        var $el = $('.social-feed-box').children().first();

        $el.append('<div class="social-avatar"><a href="" class="pull-left"><img alt="image" src="/vendors/Static_Seed_Project/img/a1.jpg"></a><div class="media-body"><a href="#">'+message.name+'</a><small class="text-muted">'+message.date_created+'</small></div></div>');
        $el.append('<div class="social-body"><p>'+message.content+'</p><div class="btn-group"><button class="btn btn-white btn-xs"><i class="fa fa-thumbs-up"></i> Like this!</button><button class="btn btn-white btn-xs"><i class="fa fa-comments"></i> Comment</button><button class="btn btn-white btn-xs"><i class="fa fa-share"></i> Share</button></div></div><div id="'+message._id+'"></div>');
  }
}
