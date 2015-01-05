# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/

jQuery ->
  $('#month-selector select').change ->
    $(this).prop("disabled", true)
    window.location.href = window.location.pathname+ "?month=" + $(this).children(':selected').val()


$.printRevenue = () ->
  $('#new-header').hide()
  $('.left-panel').hide()
  margin = $('article').css("margin-left")
  $('article').css("margin-left","100px")
  $('footer').hide()
  $('#month-selector').hide()
  $('#print-button').hide()

  javascript:print()

  $('#print-button').show()
  $('#month-selector').show()
  $('footer').show()
  $('article').css("margin-left",margin)
  $('.left-panel').show()
  $('#new-header').show()