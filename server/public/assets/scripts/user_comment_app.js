var newComment = {};
var dateOptions = {     // Date formatting options
    year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
};

$(document).ready(function(){

  // Comment Abilities
  $('#createUserComment').on('click', createComment);
  // Gets messageID for modal to post to
  $('.social-feed-box').on('click', '#communityMessageComment', getMessageID);
  var maxLength = 150;
  $('#userCommentTextarea').keyup(function() {
    var length = $(this).val().length;
    var length = maxLength-length;
    $('.chars').text(length);
  });

  $('.social-feed-box').on('click', '.commentLike', likeComment);

});


function getMessageID() {
    console.log("HERE: ", $(this).data("id"));
    var messageID = $(this).data("id");
    //set the message id for the post button
    $("#createUserComment").data("id", messageID);
    console.log("this message id will be", messageID);
}

//posting comment to database
function createComment(event) {
    //set the messageID key for the comment object
    console.log("Comment being created");
    newComment.messageID = $("#createUserComment").data("id");
    event.preventDefault();
    //grab the information from the compose comment modal NEED THE ID FROM THE FORM
    var commentArray = $('#userPostCommentForm').serializeArray();
    //grab information off the form and stores it into the newComment variable
    $.each(commentArray, function(index, element) {
        newComment[element.name] = element.value;
        console.log("New Comment: ", newComment);
    });
    //reset input field values
    $('#userCommentTextarea').val('');
    $('#userCommentEmail').val('');
    $('#userComment').val('');
    $('.chars').text("150");
    // Send to server to be saved,
    $.ajax({
        type: 'POST',
        url: '/message/comment/'+ newComment.messageID,
        data: newComment,
        success: function(data){
          getCommentsByMessage(newComment.messageID);
        }
    });
}

function getCommentsByMessage(messageID) {
    var messageID = messageID;
    $.ajax({
        type: 'GET',
        url: '/message/comment/'+ messageID,
        success: showComments
    });

}

//loop through the array and append INFO
//append info to comment-container
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
        $el.append(' <div class="media-body"><a href="#">' + comment.name + '</a> ' + comment.content + '<br/><small class="text-muted">' + comment.date_created + '</small><br/><a class="small commentLike" data-id="'+comment._id+'"><span>'+likeAmmount+'</span><i class="fa fa-thumbs-up"></i> Like this!</a><span class="flag-link"><a class="small commentFlag" data-id="'+comment._id+'"><i class="fa fa-flag"></i> Report this</a></span></div>');
    }
  }
}

function likeComment() {
    var commentID = $(this).data('id');
    if ($(this).data('alreadyPressed') == undefined) {
        $(this).data('alreadyPressed', true);

        $.ajax({
            type: "PUT",
            url: '/message/comment/like/' + commentID,
            success: function(data) {
                var oldValue = $('[data-id="' + commentID + '"]').children().first().text() || 0;
                var newValue = parseInt(oldValue) + 1;
                $('[data-id="' + commentID + '"]').children().first().text(newValue + " ");
            }
        });
    }
}
