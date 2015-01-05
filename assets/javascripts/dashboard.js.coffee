# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/

jQuery ->
  $('#month-selector select').change ->
    $(this).prop("disabled", true)
    window.location.href = window.location.pathname+ "?month=" + $(this).children(':selected').val()

  $('#fan_page_filter').change ->
    $( ".load-subscribers-list" ).append('<div align="center" style="position:absolute;font-size:20px;background:rgb(0,0,0,0.7);background:rgba(0,0,0,0.4); width:100%; padding-bottom:100%; color:#fff">Loading</div>');
    $( ".load-subscribers-list" ).load( 'subscribers_analytics?fan_page_id='+$('#fan_page_filter').val());
    


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