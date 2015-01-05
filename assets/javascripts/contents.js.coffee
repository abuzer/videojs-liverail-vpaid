# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/

timer = undefined
timeout = 1000
restore = ""
price_change = false
price_keyup = false
getPriceRange = ->
  request = $.ajax(
    url: "/publish_video/pricing_range"
    type: "GET"
    data: custom_duration: $("#custom_duration").val()
    dataType: "json"
  )
  request.done (rsp) ->
    updatePricing rsp

  request.fail (jqXHR, textStatus) ->
    $("#price_status").text "Error occured, please enter video run-time again."
    $("#price_status").addClass "error-dv"
    $("#price_loading_image").hide()

updatePricing = (rsp) ->
  updatePriceSelection rsp.data.min_price
  $("#price_loading_image").hide()
  $("#video_video_identifier_id").prop "disabled", false
  $("#price_status").text ""
  $("#price_status").removeClass "error-dv"
  $(".v-properties").show()
  $(".v-charges").show()
  setPricingInfo rsp.data.duration, rsp.data.output_formats, rsp.data.payment_percent, rsp.data.payment_fee, rsp.data.streams, rsp.data.downloads

resetPriceSelection = ->
  $("#video_video_identifier_id").html restore
  $("#video_video_identifier_id option").first().prop "selected", true
  $("#video_video_identifier_id").prop "disabled", true
  $("#price_status").text "Please wait while we select price ranges..."
  $("#price_status").removeClass "error-dv"
  $("#price_loading_image").show()
  $("#video_video_identifier_id option").each ->
    $(this).show()

  $(".v-properties").hide()
  $(".v-charges").hide()
  $(".drop-down").prop "disabled", false

setPricingInfo = (duration, output_formats, payment_percent, payment_fee, streams, downloads) ->
  hour = Math.floor(duration / (60 * 60) % 60)
  hour = (if hour < 10 then "0" + hour else hour)
  min = Math.floor(duration / 60 % 60)
  min = (if min < 10 then "0" + min else min)
  sec = Math.floor(duration % 60)
  sec = (if sec < 10 then "0" + sec else sec)
  $("#duration_span").html hour + " : " + min + " : " + sec
  $("#format_span").html output_formats
  $("#streams_span").html streams
  $("#downloads_span").html downloads

updatePriceSelection = (min_price) ->
  price_counter = 1
  $("#video_video_identifier_id option").remove()
  $("#video_video_identifier_id").append new Option("Select Price")
  for item of min_price
    for key of min_price[item]
      $("#video_video_identifier_id").append new Option(min_price[item][key], key)

get_price = ->
  $("#shares_calculation_status").hide()
  clearTimeout timer  unless typeof timer is `undefined`
  timer = setTimeout(->
    if $("#custom_duration").val() <= 0 or isNaN($("#custom_duration").val()) or $("#custom_duration").val() is ""
      $("#custom_duration").addClass "error-field"
      $("#tab_4 .selectBox").addClass "error-field"
    else if parseFloat($("#custom_duration").val()) > 300
      $("#custom_duration").addClass "error-field"
      $("#video_runtime_error").html "Video run-time cannot be more than 300 minutes i.e. 5 hours"
    else
      $("#custom_duration").removeClass "error-field"  if $("#custom_duration").attr("class") is "error-field"
      $("#video_runtime_error").html ""
      resetPriceSelection()
      getPriceRange()
  , timeout)

$(document).ready ->
  $(".demo-pricing").show()
  $("#video_video_identifier_id").change ->
    if $("#custom_duration").val() and $(this).val() isnt "" and $(this).val() isnt "Select Price"
      $(".calculation_status").removeAttr "hidden"
      $("#price_note").hide()
      $("#shares_calculation_status").hide()
      csrfToken = $("meta[name='csrf-token']").attr("content")
      request = $.ajax(
        type: "POST"
        headers:
          "X-CSRF-Token": csrfToken

        url: "/publish_video/calculate_pricing.js"
        data:
          price: $("#video_video_identifier_id  option:selected").text().replace("$", "")
          duration: $("#custom_duration").val()
          height: $("#video_height").val()
      )
      request.fail (jqXHR, textStatus) ->
        $(".calculation_status").attr "hidden", "hidden"
        $("#shares_calculation_status").show()
    #else
    #  $(".drop-down").prop "disabled", true

  restore = $("#video_video_identifier_id").html()
  $("#custom_duration").keyup ->
    if price_change == false
      get_price()
      price_keyup = true
    price_change = false
  $("#custom_duration").change ->
    if price_keyup == false
      get_price()
      price_change = true
    price_keyup = false
