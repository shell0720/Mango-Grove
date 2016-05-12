$(document).ready(function(){
  dismissCheckbox();
});


function dismissCheckbox(){//dismiss Checkbox fucntion for Welcome modal
  var my_cookie = $.cookie($('.dismiss').attr('name'));
  if (my_cookie && my_cookie == "true") {
      $(this).prop('checked', my_cookie);
      console.log('checked checkbox');
  }
  else{
      $('#welcomeModal').modal('show');
      console.log('uncheck checkbox');
  }

  $(".dismiss").change(function() {
      $.cookie($(this).attr("name"), $(this).prop('checked'), {
          path: '/',
          expires: 1
      });
  });
}
