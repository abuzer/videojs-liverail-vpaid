function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();
    if($(elem).offset() != null){
        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }
}

function updateProgressBarPostion(){
    if (isScrolledIntoView($("#video_progressbar_neighbour"))) {
        $("#video_progress_bars").removeClass("video-progress-bar-scroll")
        $("#video_progress_bars").addClass("video-progress-bar")
    }
    else {
        $("#video_progress_bars").removeClass("video-progress-bar")
        $("#video_progress_bars").addClass("video-progress-bar-scroll")
    }

    if (isScrolledIntoView($("#video_progress_bars")) == false || isScrolledIntoView($("#new_preview_uploader_progress")) == false) {
        $("#video_progress_bars").removeClass("video-progress-bar")
        $("#video_progress_bars").addClass("video-progress-bar-scroll")
    }
}

$(function () {
    // remove facebook redirect hash.
    if (window.location.hash == '#_=_') {
        window.location.hash = '';
    }

    // bind contacts import

    var $scrollingDiv = $("#new_video_uploader_progress");
    $(window).scroll(function () {
        updateProgressBarPostion();
    });

    // refresh_interval = terval(refresh_video_list, 30000)q

    function refresh_video_list() {
        changed = new Array()
        $(".videos").each(function (i, el) {
            if ($(el).children(".status").attr("value") == "false") {
                changed.push($(el).attr("id"))
            }
        });
        if (changed.length > 0) {
            $('#video_list_container').load('/videos/video_list' + window.location.search, function () {
                for (i = 0; i < changed.length; i++) {
                    if ($("#" + changed[i]).children(".status").attr("value") == "true") {
                        $("#" + changed[i]).fadeOut(500)
                        setInterval(function () {
                            }, 400)
                        $("#" + changed[i]).fadeIn(300)
                    }
                }
            });
        }
    }


    showProgressBarForInProgressVideos = function(){

      $.each( $(".videos.in_process"), function(index, value){

        video_id = $(value).prop("id");

        video_type = $(value).data().video_type;

        zencoder_job_ids = $(value).data().job_ids;

        getJobProgress(zencoder_job_ids, video_type, video_id);

      });

    }

    getJobProgress = function(zencoder_job_ids, video_type, video_id){
      if(video_type == "merchandised_video" ) {

        if(parseInt(zencoder_job_ids) == 0){
          getJobIds(video_id);
          return;
        }
        var call_to_zencoder = $.getJSON("https://app.zencoder.com/api/v2/jobs/"+zencoder_job_ids+"/progress.json?api_key=d6c73b8eedebcb6191b630b6d20442cd")
        call_to_zencoder.success(function(xhr){
          updateProgressBar(video_id, xhr.state, xhr.progress);
        });


      }else{

        if(parseInt(zencoder_job_ids.split(",")[0]) == 0){
          getJobIds(video_id);
          return;
        }

        if(zencoder_job_ids.split(",").length == 2){ //user has uploaded custom preview file

          $.getJSON("https://app.zencoder.com/api/v2/jobs/"+zencoder_job_ids.split(",")[0]+"/progress.json?api_key=d6c73b8eedebcb6191b630b6d20442cd").success(function(xhr){

            first_job_progress = xhr.state == "finished" ? "100" : xhr.progress;
            first_job_status = xhr.state;

            if(parseInt(zencoder_job_ids.split(",")[1]) == 0){
              getJobIds(video_id);
              updateProgressBar(video_id, "processing", parseInt(first_job_progress)/2);

            }else{

              $.getJSON("https://app.zencoder.com/api/v2/jobs/"+zencoder_job_ids.split(",")[1]+"/progress.json?api_key=d6c73b8eedebcb6191b630b6d20442cd").success(function(xhr){
                second_job_progress = xhr.state == "finished" ? "100" : xhr.progress;
                second_job_status = xhr.state;
                job_progress = (parseInt(first_job_progress) + parseInt(second_job_progress))/2;
                job_status   = first_job_status == second_job_status ? first_job_status : "progress";
                updateProgressBar(video_id, job_status, job_progress);

              })

            }
          });

        }else{ //auto preview case
          $.getJSON("https://app.zencoder.com/api/v2/jobs/"+zencoder_job_ids.split(",")[0]+"/progress.json?api_key=d6c73b8eedebcb6191b630b6d20442cd").success(function(xhr){

            progress = xhr.progress;
            status   = xhr.state;

            progress /= 2;

            updateProgressBar(video_id, job_status, "processing");

            if(xhr.state == "completed"){
              getJobIds(video_id);
            }
          });
        }
      }
    }

    getJobIds = function(video_id){
      $.getJSON("/videos/" + video_id + "/get_additioanl_info").success(function(xhr){
        $("#" + video_id).data().job_ids = xhr.video_job_id + "," + xhr.preview_job_id;
      })
    }

    setThumbnail = function(video_id){
      $.getJSON("/videos/" + video_id + "/get_additioanl_info").success(function(xhr){
        $("#thumbnail_image_" + video_id).prop("src", xhr.thumbnail);
        if(xhr.thumbnail != "/assets/loading.gif")
          $("#thumbnail_image_" + video_id).css("height", "");
      })
    }

    FreeVideosController = Paloma.controller('Videos');

    FreeVideosController.prototype.index= function(){

    refreshThumbnail = function(){
      clear_image_fetching_interval_id = true;

      $.each( $(".videos"), function(index, value){
        video_id = $(value).prop("id");
        image_name = $($("#" + video_id + " .image img").prop("src").split("/")).last()[0];

        if (image_name == "loading.gif"){
          setThumbnail(video_id);
          clear_image_fetching_interval_id = false;
        }
      });

      if(clear_image_fetching_interval_id)
        clearInterval(image_fetching_interval_id);
    }

    var image_fetching_interval_id = setInterval(function(){refreshThumbnail()}, 5000);

    }

    updateProgressBar = function(video_id, state, percentage){
      percentage = percentage + "%";
      if(state == "finished"){
        $("#" + video_id).removeClass("in_process");
        setTimeout(function(){
          $.ajax("/videos/" + video_id + "/video_processing_completed").success(function(response){
            $("#" + video_id).html(response);

          }).error(function(){
            setTimeout(updateProgressBar(video_id, state, percentage), 3000);
          })
        }, 5000);
      }
      else
        $('#progress_bar_' + video_id + ' div').css("width", percentage);
    }

    setInterval(function(){
      showProgressBarForInProgressVideos()
    }, 3000);

    $('#ul_ownership li input').click(function (e) {
        event = e || window.event;
        if ($(this).children("input").is(":checked") == false)
            $(this).children("input").prop("checked", true);

        if (event.stopPropagation)
            event.stopPropagation();
        else
            event.cancelBubble = true
    });

    $('#ul_facebook_pages li input').click(function (e) {
        event = e || window.event;
        if ($(this).children("input").is(":checked") == false)
            $(this).children("input").prop("checked", true);

        if (event.stopPropagation)
            event.stopPropagation();
        else
            event.cancelBubble = true
    });

    $('#ul_user_timeline li input').click(function (e) {
        event = e || window.event;
        if ($(this).children("input").is(":checked") == false) {
            $(this).children("input").prop("checked", true);
        }
        if (event.stopPropagation) {
            event.stopPropagation();
        }
        else {
            event.cancelBubble = true
        }
    });

    bind_video_title_and_description();
    $("#new_theater_name").change(function () {
        check_theater_duplicate_name(true);
    });

});


launch_sponage = function(source){
    if($('#' + source + "_contacts_ckb").is(":checked")){
        cloudsponge.launch(source);
        if(source != "yahoo" && source != "gmail"){
            $('#fbBox').center();
            $('#fbBox').show();
        }
    }
    else{
        $("#" + source + "_selected_contacts").html("");
        $("#" + source + "_selected_contacts").val("");
        $("#" + source + "_selected_contacts_count").html("0");
        $("#" + source + "_selected_contacts_count").parent("span").hide();
        $("#" + source + "_contacts_sync_link").hide();

    }
}

manageImportedContacts = function (contacts, source, owner) {
    $("#" + source + "_selected_contacts_count").parent("span").show();
    if ($(contacts).length > 1)
        $("#" + source + "_selected_contacts_count").html($(contacts).length + " Contacts have");
    else
        $("#" + source + "_selected_contacts_count").html($(contacts).length + " Contact has");

    var emails = [];
    for (var i = 0; i < contacts.length; i++) {
        contact = contacts[i];
        name = contact.fullName();
        email = contact.selectedEmail();
        entry = name + "<" + email + ">";
        if (emails.indexOf(entry) < 0) {
            emails.push(entry);
        }
    }
    $("#" + source + "_contacts_ckb").prop("checked", true);
    $("#" + source + "_selected_contacts").html(emails.join(", "));
    $("#" + source + "_selected_contacts").val(emails.join(", "));
    $("#" + source + "_contacts_edit_link").show();
    $("#" + source + "_edit_link_sperator").hide();
}


load_theater_contact_info = function (theater_id) {
    var request_url = "/theaters/" + theater_id + "/get_theater_contacts_info"

    $.ajax({
        url: request_url,
        beforeSend: function () {
            $('#contacts_import_buttons_area').fadeTo('slow', 0.2);
        }
    }).done(function (data) {
        $('#contacts_import_buttons_area').fadeTo('slow', 1);
        if (data.success) {
            result = data.data.result
            for (i = 0; i < default_contact_importers.length; i++) {
                if (result.theater_contacts[default_contact_importers[i]]) {
                    $("#" + default_contact_importers[i] + "_contacts_ckb").prop("disabled", true);
                    $("#" + default_contact_importers[i] + "_contacts_ckb").prop("checked", true);

                    $("#" + default_contact_importers[i] + "_selected_contacts_count").parent("span").show();
                    contacts_count = result.theater_contacts[default_contact_importers[i]]
                    if (contacts_count > 1)
                        $("#" + default_contact_importers[i] + "_selected_contacts_count").html(contacts_count + " Contacts have");
                    else
                        $("#" + default_contact_importers[i] + "_selected_contacts_count").html(contacts_count + " Contact has");

                    $("#" + default_contact_importers[i] + "_contacts_edit_link").show();
                    $("#" + default_contact_importers[i] + "_contacts_sync_link").show();
                    $("#" + default_contact_importers[i] + "_edit_link_sperator").show();
                }
                else {
                    $("#" + default_contact_importers[i] + "_contacts_ckb").prop("checked", false);
                    $("#" + default_contact_importers[i] + "_contacts_ckb").prop("disabled", false);
                    $("#" + default_contact_importers[i] + "_contacts_edit_link").hide();
                    $("#" + default_contact_importers[i] + "_selected_contacts_count").parent("span").hide();
                    $("#" + default_contact_importers[i] + "_selected_contacts_count").html(0);
                    $("#" + default_contact_importers[i] + "_contacts_sync_link").hide();
                    $("#" + default_contact_importers[i] + "_edit_link_sperator").hide();
                    $("#" + default_contact_importers[i] + "_selected_contacts").val();
                }
            }
            $("#invitees_custom_message").val(result.theater_message);
        }
    });
}

function check_theater_duplicate_name(asynchronous) {
    if ($("#new_theater_name").is(":visible") == false)
        return

    if (typeof(asynchronous) == 'undefined') {
        asynchronous = false;
    }

    $.ajax({
        type: 'POST',
        url: "/theaters/check_duplicate_theater.json",
        data: {
            theater_name: $("#new_theater_name").val()
            },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
        },
        success: function (data) {
            if (data.success == true) {
                $('#new_theater_name').removeClass('error-field');
                $("#theater_name_error").html("");
                $("#theater_name_error").hide();

                if ($('.error-field').size() == 0) {
                    $('.error-dv').hide();
                }
            }
        },
        error: function (data) {
            // Note: console.log creates issues in IE
            //console.log(data.responseText);
            var parsed_json = $.parseJSON(data.responseText);
            // Note: console.log creates issues in IE
            // console.log(parsed_json.success);
            if (parsed_json.success == false) {
                $('#new_theater_name').addClass('error-field');
                $("#theater_name_error").html(parsed_json.message);
                $("#theater_name_error").show();
                $('.error-dv').html("Please enter the correct values in highlighted fields ")
                $('.error-dv').show();
            }
        },
        async: asynchronous
    });
}


function verify_file_on_s3(uploaded_video_file_name, asynchronous) {
    var is_file_exists = false;

    if (typeof(asynchronous) == 'undefined') {
        asynchronous = false;
    }

    $.ajax({
        type: 'POST',
        url: "/videos/verify_s3_file.json",
        data: {
            file_name: uploaded_video_file_name
            },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
        },
        success: function (data) {
            if (data.success == true)
              is_file_exists = true;
        },
        error: function (data) {
            // Note: console.log creates issues in IE
            console.log(data.responseText);
            console.log("Request has failed ::: We need to send request again"  + uploaded_video_file_name);
            if(data.responseText)
            {
              var parsed_json = $.parseJSON(data.responseText);
              console.log(parsed_json.success);
            }
            // Note: console.log creates issues in IE
        },
        async: asynchronous
    });

    return is_file_exists;
}

function verify_video_upload(xhr,percent,status,bar)
{
  var file_name = $('#video_uploader_web_video').val().replace(/^.*[\\\/]/, '');
  $('#video_s3_key').val($('#video_uploader_key').val());
  $('#video_s3_key').val($('#video_s3_key').val().replace("${filename}", file_name));

  video_being_uploaded = false;

  if(verify_file_on_s3($('#video_uploader_key').val()))
  {
    $('#video_uploader_web_video').removeClass('error-field');
    video_upload_failed = false;
    video_upload_completed = true;
    $.uploadFinished(xhr,percent,status,bar);
  }
  else
  {
    $('#video_uploader_web_video').addClass('error-field');
    video_upload_failed = true;
    percent.html("<center><b>Error uploading video your connection timed out</b> - <a href='javascript:;' onclick='show_error_on_video_fail();'>Restart upload</a></center>");
    status.html(xhr.responseText);
    percentVal = '100%';
    bar.width(percentVal);
    reset_error_message();
  }
}

//  verify_video_upload(xhr,percent,status,bar)
function verify_video_preview_upload(xhr,percent,status,bar)
{
    var file_name = $('#preview_uploader_web_video').val().replace(/^.*[\\\/]/, '');
    $('#video_preview_key').val($('#preview_uploader_key').val());
    $('#video_preview_key').val($('#video_preview_key').val().replace("${filename}", file_name));
    preview_being_uploaded = false;

    if(verify_file_on_s3($('#preview_uploader_key').val()))
    {
      preview_upload_completed = true
      video_preview_upload_failed = false;
      $('#preview_uploader_web_video').removeClass('error-field');
      $.previewUploadFinished(xhr, percent, status, bar);
    }
    else
    {
      $('#preview_uploader_web_video').addClass('error-field');
      video_preview_upload_failed = true;
      percent.html("<center><b>Error uploading video preview your connection timed out</b> - <a href='javascript:;' onclick='show_error_on_video_preview_fail();'>Restart upload</a></center>");
      status.html(xhr.responseText);
      percentVal = '100%';
      bar.width(percentVal);
      reset_error_message();
    }
}
//reset information message and clear z-index that we show when video upload is in progress and user click the 'Publish' button.
function reset_error_message()
{
  $("#submit_button").css("background","");
  $("#back_button").css("background","");
  $("#upload_continue_message").hide();
  $("#main_forms_holder").css("z-index", 0);
  $("#tab_5").css("z-index", 0);
}


function show_error_on_video_preview_fail()
{
    if(tab_position != 1)
    {
      hide_selective_tab(tab_position);
      tab_position = 1;
      show_selective_tab(1);
    }
}

function show_error_on_video_fail()
{
    if(tab_position != 0)
    {
      hide_selective_tab(tab_position);
      tab_position = 0;
      show_selective_tab(0);
    }
}

// hide selective tab of video publishing flow
function hide_selective_tab(tab_no)
{
   switch (tab_no) {
     case 0:
       $('#tab_5').hide();
       $('#new_video_uploader').hide();
       break;
     case 1:
       $('#new_video_thumbnail_uploader').hide();
       $('#tab_3').hide();
       $('#new_preview_uploader').hide();
       break;
     case 2:
       $('#tab_4').hide();
       $('#new_video_uploader').hide();
       break;
     case 3:
       $('#new_video_thumbnail_uploader').hide();
       $('#tab_2').hide();
       $('#new_preview_uploader').hide();
   }
}

// show selective tab of video publishing flow
function show_selective_tab(tab_no)
{
   switch (tab_no){
     case 0:
       $('#tab_5').show();
       $('#new_video_uploader').show();
       $('#back_button').hide();
       $('#next_button').show();
       break;
     case 1:
       $('#tab_3').show();
       $('#back_button').show();
       $('#next_button').show();
       if($('#radio_preview_upload').is(":checked"))
          $('#new_preview_uploader').show();
       break;
     case 2:
       $('#tab_4').show();
       $('#back_button').show();
       $('#next_button').show();
       break;
     case 3:
       $('#tab_2').show();
       $('#back_button').show();
       $('#next_button').hide();
       $('#submit_button').show();
   }
}

function validate_tags() {
    var values = 0;
    var is_validation_failed = false;

    if ($('#video_tags').val().trim() == "") {
        $('#singleFieldTags, #video_tags').addClass('error-field');
        is_validation_failed = true
    }
    else {
        tag_list = $('#video_tags').val();
        values = tag_list.split(",")

        if (count_words(values) < 3) {
            //$("#video_tags").parent().append("Please add more tag as minimum tags are 3")
            $("#tag_error").html("Please add minimum 3 tags for your video.")
            $('#tag_error').addClass('msg-edit-error-dv-display');
            $('#singleFieldTags, #video_tags').addClass('error-field');
            is_validation_failed = true;
        }
        if (count_words(values) > 10) {
            $("#tag_error").html("Maximum tags for video can be 10")
            $('#tag_error').addClass('msg-edit-error-dv-display');
            $('#singleFieldTags, #video_tags').addClass('error-field');
            is_validation_failed = true;
        }

        if (is_validation_failed == false) {
            $('#singleFieldTags, #video_tags').removeClass('error-field');
            $("#tag_error").hide();
            $('#tag_error').removeClass('msg-edit-error-dv-display');

        }
    }

    if (is_validation_failed == true)
        return 1;
    else
        return 0;
}

function count_words(words_list) {
    var no_of_words = 0;
    for (i = 0; i < words_list.length; i++) {
        if (words_list[i].length > 0) no_of_words++;
    }
    return no_of_words;
}

function adjust_thumbnail_show_hide() {
    window.event.cancelBubble = true
}

function bind_video_title_and_description() {
    $('#video_title,#video_description,#new_theater_name,#video_sharing_message').keyup(function () {
        key_up_and_down_handler($(this));
    });

    $('#video_title,#video_description,#new_theater_name,#video_sharing_message').keydown(function () {
        key_up_and_down_handler($(this));
    });
}


function key_up_and_down_handler(element) {
    character_count_limit = parseInt(element.attr('data_size'));

    remaining_character_element = '';

    if (element.attr("id") == "video_title")
        remaining_character_element = $("#video_title_char_count");

    if (element.attr("id") == "video_description")
        remaining_character_element = $("#video_description_char_count");

    if (element.attr("id") == "new_theater_name")
        remaining_character_element = $("#theater_name_char_count");

    if (element.attr("id") == "new_theater_name")
        remaining_character_element = $("#theater_name_char_count_for_blank");

    if (element.attr("id") == "video_sharing_message")
        remaining_character_element = $("#video_sharing_message_char_count");

    textCounter(document.getElementById(element.attr("id")), remaining_character_element, character_count_limit);
}

/*
 <!-- Dynamic Version by: Nannette Thacker -->
 <!-- http://www.shiningstar.net -->
 <!-- Original by :  Ronnie T. Moore -->
 <!-- Web Site:  The JavaScript Source -->
 <!-- Use one function for multiple text areas on a page -->
 <!-- Limit the number of characters per textarea -->
 <!-- Begin
 */
function textCounter(field, cntfield, maxlimit) {
    if (field.value.length > maxlimit) // if too long...trim it!
        field.value = field.value.substring(0, maxlimit);
    // otherwise, update 'characters left' counter
    else
        cntfield.html(maxlimit - field.value.length);
}
function tooltip() {
    $('.demo-tip-darkgray').each(function () {
        $(this).attr('title', '').poshytip({
            content: $(this).data('tip'),
            className: 'tip-darkgray',
            bgImageFrameSize: 11,
            offsetX: -25 });
    });
}

function destroy_tooltip()
{
    $('.demo-tip-darkgray').each(function () {
        $(this).attr('title', '').poshytip('destroy');
    });
}

function change_player_embed_code(item_id, selectbox_obj, has_videos, vid) {
    txt_area = $('#' + item_id);
    html = txt_area.val();
    if( typeof( vid) != 'undefined'){
        selectbox_obj = '#select_'+vid;
    }
    product_area_width = 0;
    product_area_height = 0;
    related_videos_height = 0;
    if( typeof(has_videos) == undefined )
        has_videos = false;

    product_area_to_different_video_height = {"240":120, "720": 180, "480": 165, "360": 270}

    selected_width = $(selectbox_obj).find(':selected').data('width');
    selected_height = $(selectbox_obj).find(':selected').data('height');
    if( has_videos )
        product_area_height = 200;
    vid_id  = item_id.replace("item_","");

    $("#span_" + vid_id).show();


    checkbox_object = $("#show_products_" + vid_id);

    if (checkbox_object.is(":visible") && checkbox_object.prop("checked") == true)
    {
      product_area_height = product_area_to_different_video_height[selected_height.toString()];
      product_area_width = 0;
    }

    iframe_h = html.replace(/height='+\d+px/g, "height='" + (selected_height + product_area_height + related_videos_height) + "px");
    ifram = iframe_h.replace(/width='+\d+px/g, "width='" + (selected_width + product_area_width) + "px");
    var page_id = $('#select_page_'+vid).find(':selected').data('page_id');
    var page_name = $('#select_page_'+vid).find(':selected').data('page_name');
    var from_page = '';
    ifram_html = ifram.replace(/dimensions=\d*x\d*/g, "dimensions=" + selected_width + 'x' +( selected_height+related_videos_height) );
    if( page_id && page_name ) {
     ifram_html = ifram.replace(/from_page_id=\w*/g, "from_page_id=" + page_id  );
    }
    txt_area.val(ifram_html);


    change_products_parameter(vid_id, checkbox_object);
}

function change_products_parameter(vid_id, checkbox_obj)
{
  txt_area = $('#item_' + vid_id);
  if($(checkbox_obj).is(":visible") && $(checkbox_obj).prop("checked") == true)
    txt_area.val(txt_area.val().replace(/show_products=\w*/g, "show_products=true"));
  else
    txt_area.val(txt_area.val().replace(/show_products=\w*/g, "show_products=false"));
}

function show_products_on_change(vid_id)
{
  change_player_embed_code("item_" + vid_id, $("#select_" + vid_id));
}
