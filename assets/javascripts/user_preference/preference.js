function readImage(file) {

    var reader = new FileReader();
    var image  = new Image();
    var validate = false;
    reader.readAsDataURL(file);
     reader.onload = function(_file) {
        image.src    = _file.target.result;              // url.createObjectURL(file);
        image.onload = function() {
            if( this.width <=60 && this.height <=30  )
                validate= true;
            else
                validate= false;
            callbackreadImage(validate );
        };
        image.onerror= function() {
            console.log('Invalid file type: '+ file.type);
        };
    };

}
function callbackreadImage(validate){
    if( validate )
        $('#branding_logo_form').submit();
    else
        alert('Image size must be 60x30 or less');
}
$(function(){
 $('#branding_logo_form #file').change(function() {
        valid_video_file_extensions = ["jpg", "jpeg", "png"]
        file_extension = $("#branding_logo_form #file" ).val().split(".").pop().toLowerCase();
        if(valid_video_file_extensions.indexOf(file_extension) == -1 || file_extension.length == 0){
            return false;
        }
        if(typeof(banner_ladda) != "undefined"){
            $('#merchandise_video_banner_image_button').show();
            $('#user_preference_branding_logo').val("");
            $('#banner_image_status_message').hide();
            $("#branding_logo_form #key").val(original_banner_key_name);
        }
    readImage( this.files[0]);
        
    });

    $('.delete-banner-img a').click(function(){
        if(typeof(banner_ladda) != "undefined"){
            banner_ladda.stop();
            banner_xhr.abort();
            $("#branding_logo_form #key").val(original_banner_key_name);
        }
        $('#banner_img').remove();
        $('#merchandise_video_banner_image_button').show();
        $('#user_preference_branding_logo').val("");
        $('#banner_image_status_message').hide();
        $('#banner_image_status_message').html("");
        $('#banner-text, #banner-text span').css("color", "black");
        $('.helping_text').show();
        $('.delete-banner-img').hide();
        $('#branding_logo_form').stop();
        $('#branding_logo_form #file').val("");

        $('#branding_logo_form #file').css("width", 142);
    })

    $('#branding_logo_form').ajaxForm({
        beforeSerialize: function($form, options) {
            original_banner_key_name = $("#branding_logo_form #key").val();
            file_extension = $("#branding_logo_form #file").val().toLowerCase().split(".").pop()
            key_with_extension = $("#branding_logo_form #key").val() + "." + file_extension;
            $("#branding_logo_form #key").val(key_with_extension);
        },
        beforeSend: function(xhr){
            banner_xhr = xhr;
            banner_ladda  = Ladda.create($('#merchandise_video_banner_image_button')[0]);
            banner_ladda.start();
            $('.delete-banner-img').show();
            $('#banner_img').remove();

        },
        uploadProgress: function(event, position, total, percentComplete){
            banner_ladda.setProgress(percentComplete/100);
        },
        success:function(responseText, statusText, xhr, $form){
            banner_ladda.stop();
            $('#merchandise_video_banner_image_button, .helping_text').hide();
            $('#user_preference_branding_logo').val($(responseText).find("Key").text());
            $('#banner_image_status_message').show();
            $('#banner_image_status_message').html($('#branding_logo_form #file').val().replace(/^.*[\\\/]/, ''));
            $('#banner-text, #banner-text span').css("color", "white");
            $('#branding_logo_form #file').val("");
            $('#branding_logo_form #file').css("width", $('#banner_image_status_message').width());
            //auto_submit_form();
        },
        complete:function (xhr){},
        error:function(xhr){
            banner_ladda.stop();
            $('.delete-banner-img').hide();
            $('html, body').animate({scrollTop:0}, 'slow');
            $('.error-dv').html("Banner Image upload failed, please try again.");
            $('.error-dv').show().delay(3000).fadeOut("slow");
        }
    });
});

$(document).ready(function() {
    $(".tabs-menu a").click(function(event) {
        event.preventDefault();
        $(this).parent().addClass("active");
        $(this).parent().siblings().removeClass("active");
        var tab = $(this).attr("href");
        $(".tab-content").not(tab).css("display", "none");
        $(tab).fadeIn();
    });
    var tabID = window.location.hash;
    tabID = (tabID == "" ? '#preference' : tabID);
    setTabActive( tabID );
});
function setTabActive( tabID ){
        $(tabID+'-tab').parent().addClass("active");
        $(tabID+'-tab').parent().siblings().removeClass("active");
        $(".tab-content").not(tabID).css("display", "none");
        $(tabID).fadeIn();
}
$(document).ready(function() {
    $(function() {
        $('.checkall').on('click', function() {
            $(this).closest('separate-fields').find(':checkbox').prop('checked', this.checked);
        });
    });
});
  $(function(){
    $('.ladda-label').click(function(){
      $('#file').click();
    });
  });
function validateForm() {
  if($('.default_player_radio_button').is(':checked')) {
    return true
  } else if( $('.banner_radio').is(':checked') && $('#user_preference_branding_logo').val() == '' ) {
    $('.preference-error').show();
    $('#branding').show();
    $('.logo-container a').focus();
    return false;
  } else {
    return true;
  }

}