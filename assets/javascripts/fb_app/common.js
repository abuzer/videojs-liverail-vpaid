if (window.location.protocol == "https:")
    var SITE_URL = "https:" + SERVER_URL.substr(0,(SERVER_URL.length-3));
else
    var SITE_URL = "http:" + SERVER_URL.substr(0,(SERVER_URL.length-3));

// Template setting for Underscore
_.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g,
    evaluate: /\<\@([\s\S]+?)\@\>/g,
    escape: /\<\@\-(.+?)\@\>/g
  };

function  checkDeleteStatus()
{
    DataCall("",SERVER + VIDEOS + VIDEO_ID + "/" + IS_DELETED, "GET", true,
        function(data)
        {
            //success-video not deleted
            if (!(data.data.is_deleted))
            {
                DELETED = false;
            }
            else
            {
                DELETED = true;     
                alert("It appears that this video has been taken-off by the producer. Sorry for the inconvenience");  
                setInterfaceForDeletedVideos();
            }
        },
        function(data)
        {
            //error---video deleted
            DELETED = true;     
            alert("It appears that this video has been taken-off by the producer. Sorry for the inconvenience");
            setInterfaceForDeletedVideos();
        }, false);
}
function checkUnpublished()
{
        DataCall("",SERVER + VIDEOS + VIDEO_ID + "/" + IS_UNPUBLISHED, "GET", true,
        function(data)
        {
            //success-video not deleted
            if (data.data.can_purchase)
                DELETED = false;
            else
            {
                DELETED = true;
                alert("It appears that this video has been taken-off by the producer. Sorry for the inconvenience");
            }
        },
        function(data)
        {
            //error---video deleted
            /*DELETED = true;
            alert("It appears that this video has been taken-off by the producer. Sorry for the inconvenience");*/
        });
}
function fbpay()
{
    if(!$('#iAgree').is(":checked")){
        $('#error-text').html("You must agree to the terms and conditions first.")
        return;
    }
    $('#error-text').html("");
    if( LC_USER.id == 0 ){
        reLogin();
        return;
    }

    var allow = true;

    checkDeleteStatus();

    if(DELETED)
       return;
  
  if (($('#toc').is(":visible"))) 
  {
    if (document.getElementById("iAgree").checked)
    {
        allow = true;        
    }
    else
    {
        allow = false;
        $('#warning-Text').html('<span color="#FF0000">You must agree to the terms and conditions first</span>');
    }
  }
  if (allow && (!(DELETED)) )
  {
          var hash = function(s){
          var n;
          if (typeof(s) == 'number' && s === parseInt(s, 10)){
            s = Array(s + 1).join('x');
          }
          return s.replace(/x/g, function(){
            var n = Math.round(Math.random() * 61) + 48;
            n = n > 57 ? (n + 7 > 90 ? n + 13 : n + 7) : n;
            return String.fromCharCode(n);
          });
          }

        var requestID = hash(64);
        var PAY_SERVER = SERVER.substr(0,(SERVER.length-3));

      ga('send', 'event', 'PaidVideo', 'Payment Select - Facebook', VIDEO_ID + ':' + $("#video-title-in").html());

    try{
        FB.ui({
              method: 'pay',
              user_currency: "USD",
              action: 'purchaseitem',
              product: PAY_SERVER+'/videos/'+VIDEO_ID+'/price'
              },
              function(response) {
                    if(response.status=="completed")
                    {
                        paymentSuccessfullyDone(response, "Facebook");
                    }
                    else{
                        stripeFail();
                    }
            }
          );
    }catch(ex)
    {
        console.log(ex);
    }
    }
}

paymentSuccessfullyDone = function(response, payment_source){
    console.log(response);

    if (($('#toc').is(":visible")))
    {
        $('#toc').html('');
        $('#toc').html('<div class="pop-full" style="display:block;height: 100%;"><div style="display: block; text-align: center; top: 46%;position: absolute;left: 47.5%;"><img src="/fb_app/images/ajax-loader.gif"></div></div>');
    }
    if(($('#paymentDiv').is(":visible")))
    {
        $('#paymentDiv').html('');
        $('#paymentDiv').html('<div style="display:block;height:100%" id="paymentScreen" class="pop-full"><div style="display: block; text-align: center; "><img src="/fb_app/images/ajax-loader.gif"></div></div>');
    }
    playReq = false;
    if(payment_source == "Facebook")
        setTimeout(sendFbPayCall,2000,response);
    else{ //PayPal Case
        activityId          = $('#activityId').val();
        postId              = $('#postId').val();
        social_sharing = $('#social_sharing').val();
        stripeSuccess();
    }
}

var paymentCompeltedFunction = paymentSuccessfullyDone;

function sendFbPayCall(response)
{
    var PAY_SERVER = SERVER.substr(0,(SERVER.length-3));

    request_params = "status"+response.status+"&signed_req="+response.signed_request+"&qty="+response.quantity+"&paymentid="+response.payment_id+"&videoid="+VIDEO_ID;
    request_params += "&page_id="+ (getParameterByName('page_id') || getParameterByName('from_page_id')) +"&page_name=" + (getParameterByName('page_name') || getParameterByName('publisher'));

    DataCall(request_params, PAY_SERVER + "fb_local_currency_payment.json/", "POST", true,
    function(data){                            //Success Case

        activityId = data.data.activity_id;
        postId = data.data.post_id;
        social_sharing = data.data.is_social_on;
        stripeSuccess();
    },
    function (data){
        //Failed case
        stripeFail();
    });
}
function dispFscr(){
    $('#fscr').show();

    if(DEBUG)
        console.log("Show FS");
}
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}
function hideLcTip(){
    $('#lcTip').hide();

    if(DEBUG)
        console.log("HIDE LC TIP");
}

function dispLcTip(){
    $('#lcTip').show();
    if(DEBUG)
        console.log("show LC TIP");
}
function dispVolTip(){
    $('#volText').html('Unmute');
    $('#volTip').show();

    if(DEBUG)
        console.log("SHOW VOL TIP");
}
function dispVolMute(){
    $('#volText').html('Mute');
    $('#volTip').show();
    if(DEBUG)
        console.log("SHOW MUTE TIP");
}
function limitText(limitField, limitCount, limitNum) {
    if ($('#' + limitField).val().length > limitNum) {
        $('#' + limitField).val($('#' + limitField).val().substring(0, limitNum));
    } else {
        $('#' + limitCount).html(limitNum - $('#' + limitField).val().length + " characters.");
    }
}
function vToggle(state) {
    if (state == 1) {
        $('#vmute').hide();
        $('#vmax').show();
    } else {
        $('#vmute').show();
        $('#vmax').hide();
    }
}
function hideVolTip(){
    $('#volTip').hide();
    if(DEBUG)
        console.log("HIDE VOL TIP");
}
function TimeStamp(old_datetime) {

    try {

        var stamp;

        var month = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

        var dateTime = old_datetime.split("T");
        var _date = dateTime[0];
        var _time = dateTime[1].substr(0, dateTime[1].length - 1);

        var date_s = _date.split("-");
        var time_s = _time.split(":");

        var valid_date = new Date();
        valid_date.setYear(date_s[0]);
        valid_date.setMonth(date_s[1] - 1);
        valid_date.setDate(date_s[2]);
        valid_date.setHours(time_s[0]);
        valid_date.setMinutes(time_s[1]);
        valid_date.setSeconds(time_s[2]);

        var date = valid_date;

        var offset = parseInt(date.getTimezoneOffset());
        var sec_diff = (((new Date()).getTime() + (offset * 60 * 1000) - date.getTime()) / 1000);
        var day_diff = Math.floor(sec_diff / 86400);

        if (sec_diff < 600 && day_diff == 0)
            stamp = "Just Now";
        else if (sec_diff < 3600 && day_diff == 0)
            stamp = Math.floor(sec_diff / 60)+" minutes ago";
        else if (sec_diff < 7200 && day_diff == 0)
            stamp = "1 hour ago";
        else if (sec_diff < 86400 && day_diff == 0)
            stamp = Math.floor(sec_diff / 3600) + " hours ago";
        else if (day_diff == 1)
            stamp = "Yesterday";
        else if (day_diff < 7)
            stamp = day_diff + " days ago";
        else if (day_diff < 31)
        {
            var weekCount = Math.ceil(day_diff / 7);
            if(weekCount > 1)
                stamp = weekCount + " weeks ago";
            else
                stamp = weekCount + " week ago";
        }
        else
            stamp = month[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();

        var data = {
            user_stamp: stamp,
            utc: valid_date,
            stamp: dateFormat(valid_date, "dddd, dS mmmm yyyy, h:MM TT")
        };

        return data;

    } catch (err) {
        if(DEBUG)
            console.log("Invalid DateTime Format. << DateTime");

        return {
            user_stamp: '',
            utc: '',
            stamp: ''
        };

    }
}
function hideHdSd() {
    $('#hdSpanBar').hide();
}
function CommentStructure(comment, posted) {
    var comment_body = _.template(document.getElementById('comments-row').innerHTML, {comment: comment, posted: posted});
    /*var comment_body = '';

    var stamp = TimeStamp(comment.created_at);
    var username = comment.user.first_name + ' ' + comment.user.last_name;

    comment_body = comment_body + '<div class="media view-comments">';
    comment_body = comment_body + '<div class=""><a href="/' + comment.user.uid + '" class="pull-left"><img class="media-object hold-pic" width="50" alt="' + username + '" height="50" src="https://graph.facebook.com/' + comment.user.uid + '/picture"></a></div>';
    comment_body = comment_body + '<div class="comment-listing">';
    comment_body = comment_body + '<div class="comment-info clearfix">';
    comment_body = comment_body + '<div class="user-title">' + username + '</div>';
    if (posted == false)
        comment_body = comment_body + '<div class="comment-time" title="' + stamp.stamp + '">Just Now</div>';
    else
        comment_body = comment_body + '<div class="comment-time" title="' + stamp.stamp + '">' + stamp.user_stamp + '</div>';
    comment_body = comment_body + '</div>';
    comment_body = comment_body + '<div class="comment-content">';
    comment_body = comment_body + '<p>' + comment.comment + '</p>';
    comment_body = comment_body + '</div></div></div>';*/

    return comment_body;

}
function gcd(a, b) {
    return (b == 0) ? a : gcd(b, a % b);
}

function VideoStuff() {
    VideoInformation(function () {
        RealTimeActivities();
    });
}

function UserAccess() {

    DataCall("device=FBApp", SERVER + LIBRARY + VIDEO_ID + "/" + VIDEO_ACCESS, "GET", true,

    function (data) {
        var downloads_left = data.data.my_library_video_detail.downloads_left;
        var streams_left = data.data.my_library_video_detail.streams_left;
        var downloads_total = data.data.my_library_video_detail.total_downloads;
        var streams_total = data.data.my_library_video_detail.total_streams;
    },

    function (data) {});

}

function BuildLikeLink(like) {

    var body = '<a href="#">' + like.first_name + ' ' + like.last_name + '</a>';
    return body;

}

function VideoExtendedLikeLink(count) {
    var body = '<a id="ex-likes" rel="tooltip" data-original-title="">and ' + count + ' others</a>';
    return body;
}

function VideoLikes() {

    DataCall("id=1&device=FBApp", SERVER + VIDEOS + VIDEO_ID + "/" + VIDEO_LIKES, "GET", true,

    function (data) {

        var likes = data.data.likes;
        var total = likes.length;
        var loop_to = 8;
        var max_show = 3;
        var yourself = false;
        var others = new Array();

        if (total < (loop_to + 1))
            loop_to = total;

        var like_users = '';

        var o_count = 0;

        for (i = 0; i < total; i++) {
            if (i <= loop_to)
                like_users = like_users + likes[i].first_name + " " + likes[i].last_name + "<br>";

            if (likes[i].user_id == LC_USER.id)
                yourself = true;
            else {
                others[o_count] = i;
                o_count++;
            }
        }

        if (max_show > others.length)
            max_show = others.length;

        var people = '';

        for (i = 0; i < max_show; i++) {
            people = people + BuildLikeLink(likes[others[i]]);
            if (i == (max_show - 2) && max_show < others.length)
                people = people + " and ";
            else if (i != (max_show - 1))
                people = people + ", ";
        }

        if (yourself && total > 2)
            people = "You, " + people;
        else if (yourself && total == 2)
            people = "You and " + people;
        else if (yourself && total == 1)
            people = "You";
        else if (total == 1)
            people = BuildLikeLink(likes[0]);


        if (max_show < others.length) {

            people = people + VideoExtendedLikeLink(others.length - max_show);
            $('#likes').html(people);

            if (total > loop_to)
                like_users = like_users + "and " + (total - loop_to) + " other viewers";

            like_users = '<div align="left">' + like_users + '</div>';
            $('#ex-likes').attr('data-original-title', like_users);
            $('#ex-likes').tooltip({
                animation: false,
                html: true,
                trigger: 'hover',
                placement: 'top'
            });
        } else {
            $('#likes').html(people);
        }
        if (total > 0)
            $("#video-like-count").show();
        else
            $("#video-like-count").hide();
    },

    function (data) {});
}

function getMonth(month) {
    if (month.charAt(0) == '1') {
        if (month.charAt(1) == '0')
            return 'Oct';
        else if (month.charAt(1) == '1')
            return 'Nov';
        else if (month.charAt(1) == '2')
            return 'Dec';
    } else if (month.charAt(0) == '0') {
        if (month.charAt(1) == '1')
            return 'Jan';
        else if (month.charAt(1) == '2')
            return 'Feb';
        else if (month.charAt(1) == '3')
            return 'Mar';
        else if (month.charAt(1) == '4')
            return 'Apr';
        else if (month.charAt(1) == '5')
            return 'May';
        else if (month.charAt(1) == '6')
            return 'Jun';
        else if (month.charAt(1) == '7')
            return 'Jul';
        else if (month.charAt(1) == '8')
            return 'Aug';
        else if (month.charAt(1) == '9')
            return 'Sep';
    } else
        return 'Invalid';
}


function RealTimeActivities() {
    GetComments();
}

function GetComments() {
    return;
    /*
    DataCall("id=1&device=FBApp", SERVER + VIDEOS + VIDEO_ID + "/" + VIDEO_INFORMATION, "GET", true,

    function (data) {

        VIDEO = data.data.video;

        if (VIDEO.media_creation_date != null) {
            var stamp = TimeStamp(VIDEO.media_creation_date);
            $('#video-stamp').html(stamp.user_stamp);
        }

        if (VIDEO.view_count == 0)
            VIDEO.view_count = 1;
        $('#video-views').html(VIDEO.view_count);

        if (VIDEO.comments_count > 0) {

            var comments = VIDEO.recent_comments;
            var total = comments.length;
            var comment_data = '';

            for (i = 0; i < total; i++) {
                comment = comments[i];
                comment_data = comment_data + CommentStructure(comment, true);
            }

        }

        $('#comments').html(comment_data);
    },

    function (data) {});
*/

}

function iPhoneAddComment(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode
    var comment_text = $('#comment_text').val();
    var isApple = (navigator.userAgent.indexOf('iPad') != -1 || navigator.userAgent.indexOf('iPhone') != -1);

    if ((isApple && comment_text != '' && (/\S/.test(comment_text)) )) {

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

        $('#comments').prepend(CommentStructure(comment, false));
        $('#comment_text').val('');

        DataCall("comment[title]=" + comment.title + "&comment[comment]=" + encodeURIComponent(comment.comment), SERVER + VIDEOS + VIDEO_ID + "/" + COMMENT, "POST", true,

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

function AddComment(evt) {
    console.log("adding comment")

    var charCode = (evt.which) ? evt.which : evt.keyCode;
    var comment_text = $('#comment_text').val();

    if ((charCode == 13 && comment_text != '' && (/\S/.test(comment_text)) )) {
        if( LC_USER.id == 0 ) {
            c_expiry = 1/24/58;
            setCookie("comment_text", comment_text, c_expiry);
            reLogin();
        } else {

            var posted_at = dateFormat(new Date(), "yyyy-mm-dd'T'HH:MM:ss");
            var comment = {
                user: {
                    first_name: LC_USER.first_name,
                    last_name: LC_USER.last_name,
                    uid: LC_USER.uid,
                    profile_name: LC_USER.profile_name,
                    profile_picture_url : LC_USER.profile_picture_url,
                    profile_pic : LC_USER.profile_picture_url
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

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
$(document).ready(function(){

  $('#account_name_div').click(function(){
    $('#account-menu').toggle();
  });

});

$(document).click(function (e) {
  if (!$(e.target).closest('.name-header').length)
    $('#account-menu').hide();
});


$(document).ready(function(){
  $('#account-menu').hide();
  $( "#h-account" ).live( "click", function() {
    $('#account-menu').toggle();
  });
});

function LikeVideo() {
    if( LC_USER.id == 0 ) {
        c_expiry = 1/24/58;
        setCookie("like_video", 'like', c_expiry);
        reLogin();
        return;
    }


    if(DELETED) 
        return;

    if( LC_USER.id )
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
                    VideoLikes();
                    $("#video-like").html('Like Video');
                    var count = $('#likes-count').html();
                    var newCount = (parseInt(count, 10)) - 1;
                    $('#likes-count').html(newCount);
                }
                else{
                    $("#video-like").attr('class', 'unlike');
                    VideoLikes();
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
        reLogin();
    }
}
function PaymentStatus(status) {


    if (status == "cancel") {
        $("#payment-form").hide();
        $('#video-price-in').show();
        $("#video-category").show();

    } else if (status == "success") {

        var count = $('#views-count-in').html();
        var newCount = (parseInt(count, 10)) + 1;
        $('#views-count-in').html(newCount);
        playReq = false;
        count = $('#sold-count').html();
        var newCount = (parseInt(count, 10)) + 1;
        $('#sold-count').html(newCount);

        $('#video-information-in').hide();
        $("#payment-form").hide();
        $('#player-buy-button').hide();
        $('#video-price-in').hide();
        $("#video-category").show();
        $('#video-price-in').hide();
        StreamMedia(false, function () {});
    }
}

function hideFscr(){
    $('#fscr').hide();

    if(DEBUG)
        console.log("HIDE FS");
}
function hidePlay()
{
    $('#playLayer').hide();
}

function dispHdSd() {

        if (($('#hdSpanBar').is(":visible")))
        {
                hideHdSd();
        }
        else
            $('#hdSpanBar').show();
}

function hdswitch() {

        if (currentRES == 'SD') {
            var videoToPlay = {
                0: {
                    src: HD,
                    type: 'video/mp4'
                }
            };
            var elapsedTime = projekktor('#vdo-player').getPosition();
            projekktor('#vdo-player').setItem(videoToPlay, 0, true);
            currentRES = 'HD';
            projekktor('#vdo-player').setPlay();
            projekktor('#vdo-player').setPlayhead("+" + elapsedTime);
            $('#hdplug').html('-HD');
            $('#sdplug').html('SD');
            hideHdSd();
        } else {
            //Do nothing
        }
}

function sdswitch() {
        if (currentRES == 'HD') {
            var videoToPlay = {
                0: {
                    src: SD,
                    type: 'video/mp4'
                }
            };
            var elapsedTime = projekktor('#vdo-player').getPosition();
            projekktor('#vdo-player').setItem(videoToPlay, 0, true);
            currentRES = 'SD';
            projekktor('#vdo-player').setPlay();
            projekktor('#vdo-player').setPlayhead("+" + elapsedTime);
            $('#sdplug').html('-SD');
            $('#hdplug').html('HD');
            hideHdSd();
        }
        else {
            //Do nothing
    }
}

function linkify(text, target) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    if( target == 'blank')
        return text.replace(exp,"<a href='$1' target=\"_blank\">$1</a>");
    else
        return text.replace(exp,"<a href='$1'>$1</a>");
}


$('#toggle-desc').live('click', function(){
    $('.desc-container').slideToggle('slow', function(){
        if( $('.desc-container').is(':visible') ){
           $('#toggle-desc').css("background-position","0px 0px");
        }else{
           $('#toggle-desc').css("background-position","0px -17px");
        }
    });
});
$('#description_anchor').live('click', function(){
    $('div.desc-container').show('slow');
    if (projekktor('#vdo-player').getState('PLAYING'))
        projekktor('#vdo-player').setPause();
    if ((window.fullScreen) || (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
        exitfs();
    }
    scrollTo(400);
});

function scrollTo(y){
    FB.Canvas.getPageInfo(function(pageInfo){
            $({y: pageInfo.scrollTop}).animate(
                {y: y},
                {duration: 1000, step: function(offset){
                    FB.Canvas.scrollTo(0, offset);
                }
            });
    });
}

function setInterfaceForDeletedVideos()
{
    $('#paymentDiv').attr('style',"background:transparent");
    $('#player-loading').hide();
    $('#toc').html('');
    $('#paymentDiv').html('');
    $('#toc').hide();
    $('#lcs').remove();
    $('#comPanel').remove();
    $('#comments').remove();
    $('#paymentDiv').show();
    $('#paymentDiv').html('<div class="pop-full" style="display:block;height: 100%;background:black;"><h2 class="alignment">It appears that this video has been taken-off by the producer. Sorry for the inconvenience.</h2></div>');
}

$(document).ready(function(){
    if( typeof PAYPAL != 'undefined' )
        try{
            window.dg = new PAYPAL.apps.DGFlow({trigger: 'paypal_submit',expType: 'instant'});
        }catch(ex){}
})
