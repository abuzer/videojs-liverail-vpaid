function DataCall (Data, Url, Type, Secure, SuccessCallBack, ErrorCallBack){

    if (Secure == true) {

        var secureData = SecureKey();

        if (Type == "GET" )
        {
            Data = secureData.key + "&user_id=" + LC_USER.id + "&device=FBApp"+"&" + Data;
        } else {
            Data = secureData.key + "&user_id=" + LC_USER.id + "&" + Data;
        }
    }

    var req = $.ajax({
        type: Type,
        url: Url,
        dataType: "json",
        data: Data,
        success: function (data){
            SuccessCallBack (data);
        },
        error: function (data){
            ErrorCallBack (data);
        }
    });
}


function likeVideo() {

    if( LC_USER.id == 0 ) {
        c_expiry = 1/24/58;
        setCookie("like_video", 'like', c_expiry);
        fbLogin();
        return;
    }
    else if( LC_USER.id )
    {
        var liked = "like";
        var SERVICE;

        var value = $("#video-like").attr('class');
        var oldValue = value;

        if (value == "like") {
            liked = "unlike";
            SERVICE = SERVER + VIDEOS + VIDEO_ID + "/" + LIKE;
        } else {
            liked = "like";
            SERVICE = SERVER + VIDEOS + VIDEO_ID + "/" + UNLIKE;
        }
        
        $("#video-like").attr('class', value);

        DataCall("device=FBApp", SERVICE, "POST", true,

            function (data) {
                if(value == "unlike"){
                    $("#video-like").attr('class', 'like');

                    $("#video-like").html('Like Video');
                    var count = $('#likes-count').html();
                    var newCount = (parseInt(count, 10)) - 1;
                    $('#likes-count').html(newCount);
                }
                else{
                    $("#video-like").attr('class', 'unlike');

                    $("#video-like").html('Unlike Video');
                    var count = $('#likes-count').html();
                    var newCount = (parseInt(count, 10)) + 1;
                    $('#likes-count').html(newCount);
                }
            },

            function (data) {
                $("#video-like").attr('class', oldValue);
                if (liked == "unlike")
                {
                    alert("It appears that this video has been taken-off by the producer. Sorry for the inconvenience");
                }
            });
        return false;
    } else {
        fbLogin();
    }
}

function addComment(evt) {
    console.log("adding comment")

    var charCode = (evt.which) ? evt.which : evt.keyCode;
    var comment_text = $('#comment_text').val();

    if ((charCode == 13 && comment_text != '' && (/\S/.test(comment_text)) )) {
        if( LC_USER.id == 0 ) {
            c_expiry = 1/24/58;
            setCookie("comment_text", comment_text, c_expiry);
            fbLogin();
        } else {

            var posted_at = dateFormat(new Date(), "yyyy-mm-dd'T'HH:MM:ss");
            var comment = {
                user: {
                    first_name: LC_USER.first_name,
                    last_name: LC_USER.last_name,
                    uid: LC_USER.uid
                },
                id: "1",
                comment: comment_text,
                title: null,
                created_at: posted_at
            }
        }

        $('#comments').prepend(CommentStructure(comment, false));
        $('#comment_text').val('');

        DataCall("device=FBApp&comment[title]=" + comment.title + "&comment[comment]=" + encodeURIComponent(comment.comment), SERVER + VIDEOS + VIDEO_ID + "/" + COMMENT, "POST", true,

            function (data) {
                var count = $('#comments-count').html();
                var newCount = (parseInt(count, 10)) + 1;
                $('#comments-count').html(newCount);
                $('#comment_text').val('');
                $('#comment-error').hide( 'slow', 'linear');
                $('#comment-chars').html('500 characters.');
            },

            function (data) {
                $('#comment-error').show( 'slow', 'linear');
            });
    }
}

function logWatchActivity( logView, logFBActivity, time ) {
    var params = 'device=FBApp&'
    params += 'log_preview=' + logView + '&log_fb_activity=' + logFBActivity + '&time_watched=' + time
    URL = SERVER_WITHOUT_API_VERSION + PUBLIC_VIDEOS + VIDEO_ID + UPDATE_STREAM;
    DataCall(params, URL, "POST", true,
        function (data) {
            console.log( data );
            console.log("Registered Success");
            activityId = data.data.activity_id;
            postId = data.data.post_id;
            social_sharing = data.data.is_social_on;

            if (DEBUG)
                console.log("activity_id: " + activityId + " postid:" + postId);

            showPrevText();
        },
        function (data) {
            console.log("Unregistered preview");
        });
}

function limitText(limitField, limitCount, limitNum) {
    if ($('#' + limitField).val().length > limitNum) {
        $('#' + limitField).val($('#' + limitField).val().substring(0, limitNum));
    } else {
        $('#' + limitCount).html(limitNum - $('#' + limitField).val().length + " characters.");
    }
}

function SecureKey() {

    var timestamp = new Date();
    var int_timestamp = timestamp.getTime();
    var auth = int_timestamp + DEVICE_AUTH;
    try {
        var hash = CryptoJS.MD5(auth);
    } catch(ex) {
        console.log( ex.Message );
    }

    return {
        hash : hash,
        timestamp: 	int_timestamp,
        auth: auth,
        key: "time=" + int_timestamp + "&security_token=" + hash
    };
}



function removePreviewAct()
{
    deletePreview();
    //$('#prev-text-for-user').html('Removed from your timeline &nbsp;<a href="#" onclick="addPreviewAct();">CLICK TO ADD</a>');
    $('#prev-text-for-user').html('Watch activity removed from Facebook and LittleCast &nbsp;<a href="#" onclick="addPreviewAct();">X</a>');    
}

function deletePreview() {
    if (social_sharing) {
        DataCall("post_id=" + postId, SERVER + "feeds/" + activityId.toString() + "/delete.json", "GET", true,
            function () {
                if (DEBUG)
                    console.log("success!!");
            },
            function () {
                if (DEBUG)
                    console.log("failed");
            });
    }
}

function subscribe(   ) {
     // SUBSCRIBE_CLICLED_FROM assigning in start.js
    if(LC_USER.id != 0){
        $('#mcn_subscription_user_id').val( LC_USER.id);
        $('#subscription-loading').show();
        $('.fb-notification-error').hide();
        $('#subscription-loading-welcome').hide();
        DataCall($('#subscription-form').serialize(), $('#subscription-form').attr('action') , "POST", true,
            function (data) {
                SUBSCRIPTION_ID = data.data.subscription_id;
                console.log("success!!");
                $('.fp-subscribe').fadeOut();
                $('.endscreen').fadeTo('slow', 0);
                $('.endscreen').css('z-index', -1)
                IS_SUBSCRIBED = true;
                $('.unsub-link').show();
                $('#subscription-loading').hide();
                $('.endscreen').removeClass('subscribe-show');
                $('.videocontent').addClass('subscribed');
                $('.vjs-control-content-subscribe-btn').hide();
                console.log( ' play the video  ');
                //subscribeSuccessCallBack();

                showThankYou();
                //videojs("player").play();
            },
            function () {
                console.log("failed");
            });

    } else {
        console.log( "not logged int LC_USER is null");
        c_expiry = 1/24/58;
        setCookie("subscribed", true, c_expiry);
        setCookie("doNotPlayPreRoll", true, c_expiry);
        fbLogin();
    }
}

unsub_publisher = function(){
    // id is subscriptiin id;
    $('#unsubscribe_btn').attr("disabled", 'disabled' );
    $('#subscription-loading-welcome').show();
    var params = 'subscription_id='+SUBSCRIPTION_ID;
    var URL = SERVER_WITHOUT_API_VERSION + PUBLIC_VIDEOS + "unsubscribe_publisher" ;
    DataCall(params, URL, "POST", true,
        function (data) {
            console.log( data );
            IS_SUBSCRIBED = false;
            $('#subscription-loading').hide();
            $('#subscription-loading-welcome').hide();
            hideThankYou();
            $('.unsub-link').hide();
            $('.vjs-control-content-subscribe-btn').show();
            console.log( 'data' );
            $('#unsubscribe_btn').removeAttr('disabled');
        },
        function (data) {
            $('#subscription-loading-welcome').hide();
            console.log("Error");
        });
}