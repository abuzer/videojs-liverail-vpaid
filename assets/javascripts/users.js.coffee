# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/

$.validate_email_from = () ->
  if(IsEmail($("#email_1").prop("value"))==true)
    $('.error-dv').hide()
    $("#email_1").removeClass('error-field')
    $("#email_2").removeClass('error-field')
    if($("#email_1").prop("value")==$("#email_2").prop("value"))
      return true
    else
      $('.error-dv').show()
      $('.error-dv').html("Email address did not match!")
      $("#email_2").addClass('error-field')
  else
    $('.error-dv').show()
    $("#email_1").addClass('error-field')
    $('.error-dv').html("Email address is not valid!")
  return false


IsEmail = (email) ->
  regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
  return regex.test(email)