var HD = '';
var SD = '';
var currentRES = '';
var TOS = false;
var emailPrev = false;
var aboutDisp = false;
var DEBUG = false;
var mac_safari_count;
var previewFlag = false;
var activityId = 0;
var postId = "";
var social_sharing = false;
var thumbLinkPath = '';
var DELETED = false;
var prevCallSent = true;
var intervalID = 0;
var videoLengthLegal = false;
var thumbWidth = 0;
var PLAYER_HEIGHT = 420;
var PLAYER_WIDTH = 746;
var VIDEO_OWNER = '';
var from_page_id = 0;
var view_count = 0;
var from_page_name = 0;
var auto_track_email = false;
VIEW_CALL_SENT = false;
SECOND_PREVIEW_CALL_SENT = false;
STREAM_CALL_SENT = false;
var playing_status = false;
BUFFERED = false;
IS_PREVIEW  = false;
playEventLog = false;
var playReq = false;
var share_type = false;

// abuzer
window.onresize = function (event) {
    if ($('#thumbContainer').is(":visible")) {
        var wt = $('#vdo-player_media').width();
        if ($('#thumbPic').width() > wt) {
            thumbWidth = $('#thumbPic').width();
            $('#thumbPic').attr('width', '100%')
        }

        if (thumbWidth != 0 && thumbWidth < wt) {
            var attr = $('#thumbPic').attr('width');
            if (typeof attr != 'undefined' && attr != false) {
                $('#thumbPic').removeAttr('width');
            }
        }
    }
}

function btnPreview() {
    projekktor('#vdo-player').setPlay();
    $('#previewBtn').hide();
    $('#aboutBtn').hide();
}

function playFromThumb() {
    if ($('#thumbContainer').is(":visible")) {
        $('#thumbContainer').hide();
        projekktor('#vdo-player').setPlay();
    }
}
function loadThumb() {
    return '';
}
function addEventListeners() {

    /*document.addEventListener("fullscreenchange", function () {

        if ($('#fscreenCtrl').hasClass('exresize')) {

            $('#fscrTip').html('View Full Screen');
            $('#fscreenCtrl').removeClass('exresize');
            $('#fscreenCtrl').addClass('resize');

            if ($('#thumbContainer').is(":visible")) {
                $('#thumbContainer').hide();
                setTimeout(function () {
                    $('#thumbContainer').show();
                }, 100);
            }

        } else {

            $('#fscrTip').html('Exit Full Screen');
            $('#fscreenCtrl').removeClass('resize');
            $('#fscreenCtrl').addClass('exresize');
        }
    }, false);

    document.addEventListener("mozfullscreenchange", function () {
        if ($('#fscreenCtrl').hasClass('exresize')) {
            $('#fscrTip').html('View Full Screen');
            $('#fscreenCtrl').removeClass('exresize');
            $('#fscreenCtrl').addClass('resize');
            if ($('#thumbContainer').is(":visible")) {
                $('#thumbContainer').hide();
                setTimeout(function () {
                    $('#thumbContainer').show();
                }, 100);
            }
        } else {
            $('#fscrTip').html('Exit Full Screen');
            $('#fscreenCtrl').removeClass('resize');
            $('#fscreenCtrl').addClass('exresize');
        }
    }, false);
    //HERE IE
    document.addEventListener("msfullscreenchange", function () {
        if (DEBUG)
            console.log("IE FULL SCREEN");

        if ($('#fscreenCtrl').hasClass('exresize')) {
            $('#fscrTip').html('View Full Screen');
            $('#fscreenCtrl').removeClass('exresize');
            $('#fscreenCtrl').addClass('resize');
            if ($('#thumbContainer').is(":visible")) {
                $('#thumbContainer').hide();
                setTimeout(function () {
                    $('#thumbContainer').show();
                }, 100);
            }
        } else {
            $('#fscrTip').html('Exit Full Screen');
            $('#fscreenCtrl').removeClass('resize');
            $('#fscreenCtrl').addClass('exresize');
        }
    }, false);

    document.addEventListener("webkitfullscreenchange", function () {
        if (navigator.appVersion.indexOf("Mac") != -1 && navigator.userAgent.toLowerCase().indexOf("safari") != -1) {
            if (mac_safari_count > 2) {
                if ((window.fullScreen) || (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
                    var disp_height = PLAYER_HEIGHT;
                    var disp_width = PLAYER_WIDTH;
                    $('#vdo-player_media').attr('style', 'overflow: hidden; height:' + disp_height + 'px; width:' + disp_width + 'px; top: 0px; left: 0px; padding: 0px; margin: 0px; display: block;');
                    $("#video-player").attr("style", "height:" + disp_height + "px;width:" + disp_width + "px;");
                    $('#vdo-player').attr('style', 'max-width:' + disp_width + 'px; height: ' + disp_height + 'px;');
                    $('#fscrTip').html('View Full Screen');
                    $('#fscreenCtrl').removeClass('exresize');
                    $('#fscreenCtrl').addClass('resize');
                    mac_safari_count = 0;
                    //NEW CHANGE
                    document.webkitExitFullscreen();
                }
                else {
                    mac_safari_count = mac_safari_count + 1;
                    $('#fscrTip').html('Exit Full Screen');
                    $('#fscreenCtrl').removeClass('resize');
                    $('#fscreenCtrl').addClass('exresize');
                }
                return;
            }
            return;
        }
        else {
            if ($('#fscreenCtrl').hasClass('exresize')) {
                var disp_height = PLAYER_HEIGHT;
                var disp_width = PLAYER_WIDTH;

                $('#vdo-player_media_html').attr('style', 'width:' + disp_width + 'px; height:auto !important;');
                $('#vdo-player_media').attr('style', 'height:' + disp_height + ' !important;');

                $('#vdo-player').attr('style', 'max-width:' + disp_width + 'px; height: ' + disp_height + 'px !important;');
                $("#video-player").attr("style", "height:" + disp_height + "px;width:" + disp_width + "px;");
                $('#fscrTip').html('View Full Screen');
                $('#fscreenCtrl').removeClass('exresize');
                $('#fscreenCtrl').addClass('resize');
                if ($('#thumbContainer').is(":visible")) {
                    $('#thumbContainer').hide();
                    setTimeout(function () {
                        $('#thumbContainer').show();
                    }, 100);
                }
                return;
            }

            var cr_height = screen.height;
            $('#vdo-player').attr('style', 'max-width: 100%; height:' + cr_height + 'px !important;width:' + screen.width + 'px !important;');
            $('#fscrTip').html('Exit Full Screen');
            $('#fscreenCtrl').removeClass('resize');
            $('#fscreenCtrl').addClass('exresize');
        }
    }, false);*/
}

function watchFunction() {
    share_type = getParameterByName("share_type") == "fb_share"
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
        var ieversion = new Number(RegExp.$1)
        if (ieversion <= 8) {
            alert("This website is best viewed on Internet Explorer version 9 or above. Please upgrade to a latest version or try using latest Chrome/Firefox");
        }
        else {
            $('#toc').html('');
            VIDEO_ID = getParameterByName('watch');

            if (window.location.protocol == "https:")
                SERVER = "https:" + SERVER;
            else
                SERVER = "http:" + SERVER;


            if (getParameterByName('toc') == '1' || getParameterByName('toc') == 1) {
                TOS = true;
            } else {
                $('#toc').hide();
            }


            var checkEmailLink = getParameterByName('showpreview');
            if (checkEmailLink == '1' || checkEmailLink == 1) {
                emailPrev = true;
            }


            addEventListeners();

            BROWSER = Browser();
            //EDIT
            //if (BROWSER.iP == false)
            $('#vdo-player').html('');
            VideoStuff();


            vToggle(2);

            $('#video-information-in').hide();
            // comment-error
            $('#comment-error').hide();
        }
    }
    else {
        $('#toc').html('');
        VIDEO_ID = getParameterByName('watch');

        if (window.location.protocol == "https:")
            SERVER = "https:" + SERVER;
        else
            SERVER = "http:" + SERVER;

        if (getParameterByName('toc') == '1' || getParameterByName('toc') == 1) {
            TOS = true;
        } else {
            $('#toc').hide();
        }


        var checkEmailLink = getParameterByName('showpreview');
        if (checkEmailLink == '1' || checkEmailLink == 1) {
            emailPrev = true;
        }


        addEventListeners();

        BROWSER = Browser();

        $('#vdo-player').html('');

        VideoStuff();

        vToggle(2);

        $('#video-information-in').hide();
        $('#comment-error').hide();
    }

}

function exitfs() {

   /* if ($.browser.webkit) {

        var disp_height = PLAYER_HEIGHT;
        var disp_width = PLAYER_WIDTH;

        $('#vdo-player').attr('style', 'max-width:' + disp_width + 'px; height: ' + disp_height + 'px;');
        if (navigator.appVersion.indexOf("Mac") != -1 && navigator.userAgent.toLowerCase().indexOf("safari") != -1) {
            $('#fscrTip').html('View Full Screen');
            $('#fscreenCtrl').removeClass('exresize');
            $('#fscreenCtrl').addClass('resize');
            mac_safari_count = 0;
        }

        document.webkitCancelFullScreen();
    }
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    }
    if (DEBUG)
        console.log("\nEXIT FS CALLED\n");*/

}

function fscreen() {
/*    if ((window.fullScreen) || (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
        exitfs();
    } else {
        FB.Canvas.setAutoGrow(false);

        $('#fscrTip').html('Exit Full Screen');

        if ($.browser.webkit) {
            var disp_height = screen.height;

            if (navigator.appVersion.indexOf("Mac") != -1 && navigator.userAgent.toLowerCase().indexOf("safari") != -1) {
                goFullscreen('vdo-player_media');
                $('#fscrTip').html('View Full Screen');
                $('#fscreenCtrl').removeClass('exresize');
                $('#fscreenCtrl').addClass('resize');
                return;
            }
            $("#video-player").attr("style", "height:" + screen.height + "px;width:" + screen.width + "px;");
            $('#vdo-player').attr('style', 'max-width:' + screen.width + 'px !important; height:' + screen.height + 'px; width:' + screen.width + 'px !important;');
            $('#vdo-player_media_html').attr('style', 'position: absolute;');
            $('#vdo-player_media').attr('style', 'max-width: 100%; height:' + screen.height + 'px; width:' + screen.width + ' px !important;');
            goFullscreen('video-player');
        } else {
            goFullscreen('vdo-player');
        }
    }
*/
}


function btnAbout() {
//     if (($('#about-video-in').is(":visible"))) {
//         //$("#about-video-in").attr('style', "display:none");
//         //$("#about-video-in").fadeOut(200)
//         $('#video-information-in').fadeOut(200);

//     } else {

//     }
    if (($('#video-information-in').is(":visible"))) {
        //$("#about-video-in").hide()
        $('#video-information-in').fadeOut(300, function(){
            $("#about-video-in").attr('style', "display:none")
        });

    }else{

        $('#video-information-in').fadeIn(200);
        $("#about-video-in").attr('style', "display:block")

        $('#player-buy-button a').removeAttr('disabled');
        $('#paymentDiv').fadeOut(200);
        $('.email-premission-container').fadeOut();
        if (($('#toc').is(":visible"))) {
            $('#toc').hide();
            $('#toc').html('');
        }
    }
}

function startTOC() {


    if($('#player-buy-button').find("a").html() == "Cancel"){
        $('#player-buy-button').find("a").html("Buy Now");
        $('.control-wraper').children().not(".right-section").removeClass("player-bar-overlay");
    }
    else{
        $('#player-buy-button').find("a").html("Cancel");
        $('.control-wraper').children().not(".right-section").addClass("player-bar-overlay")
    }

    if (projekktor('#vdo-player').getState('PLAYING'))
        projekktor('#vdo-player').setPause();

    if ((window.fullScreen) || (window.innerWidth == screen.width && window.innerHeight == screen.height))
        exitfs();

    if (emailPrev) {
        if (!(($('#toc').is(":visible")))) {
            $('#video-information-in').show();
            $("#about-video-in").attr('style', "display:none");
            $('#paymentDiv').html('');
            $('#paymentDiv').hide();
            $('#toc').show();
            loadToc();
        } else {
            $('#toc').hide();
            $('#toc').html('');
            $('#video-information-in').show();
        }
    }
    else {
        if (($('#toc').is(":visible"))) {
            $('#toc').hide();
            $('#toc').html('');
            $('#video-information-in').hide();
        }
        else {
            $('#video-information-in').show();
            $("#about-video-in").attr('style', "display:none");
            $('#paymentDiv').html('');
            $('#paymentDiv').hide();
            $('#toc').show();
            loadToc();
        }
    }
}

function loadToc() {
    $('#toc').html('<div style="display:block;overflow: hidden;" class="buy-now-container"><div style="padding-left: 20%; padding-top: 5%;; padding-bottom: 5%;"><h4>What exactly am I buying?</h4><ul><li style="font-size:14px;">Ability to stream and download unlimited while video is available.</li><li style="font-size:14px;">Stream video on Facebook - download on LIttleCast App (iOS and Android)</li></ul><p style="font-size: 10px;"><input type="checkbox" id="iAgree">'  +
            ' <label for="iAgree" style="font-size: 10px;"> I have read and agree to LittleCast ' +
            '<a href="/terms-of-use/" target="_blank"  style="color:white; text-decoration:underline;">Terms of Use</a> & </label>'+
            '<a href="/payment-addendum/" target="_blank" style="color:white;text-decoration:underline;">Payment Addendum.</a>&nbsp;All Sales are final.</p>'+
            '<p id="error-text" style="padding: 0px 0px 0px 15px;font-size: 10px;width: 300px;margin: 0px;color:#c10707;height: 20px;"></p><p class="butonP">'+
            '<a href="#" onclick="fbpay();"><img src="../fb_app/images/pay-with-facebook.png"></a>' +
            '<a href="#" onclick="paypal_payment();"><img src="/assets/pay-with-paypal.png"></a>' +
            '</p></div>' +
            '<div class="button1" style="text-align: center; bottom: 0; right: 0; z-index: 99999; position: absolute;width:74px;"><a onclick="startTOC();" href="javascript:;" style="color:white;width:54px;">Cancel</a></div>' +
            '</div>');

    if (!(($('#toc').is(":visible")))) {
        $('#toc').show();
    }
}

showPaymentOptions = function () {
    $('#paymentDiv').attr('style', "display:block;height:100%;");
    $('#paymentDiv').html('<div class="pop-full" id="paymentScreen" style="display:block;height:100%">' +
        '<div>' +
        '<a href="#" onclick="fbpay();"><img src="../fb_app/images/pay-with-facebook.png"></a>' +
        '<a href="#" onclick="paypal_payment();"><img src="/assets/pay-with-paypal.png"></a>' +
        '<br/>' +
        '<a href="#" style="color: red; margin: 0px;" onclick="endPayScreen();">Cancel</a>' +
        '</div>' +
        '</div>');
}

paypal_payment = function () {
    if(!$('#iAgree').is(":checked")){
        $('#error-text').html("You must agree to the terms and conditions first.")
        return;
    }
    $('#error-text').html("");

    if (LC_USER.id == 0) {
        reLogin();
        return;
    }

    $('#paypal_submit').click();
}

function hideWatchFullVideo() {
    $('#player-buy-button a').removeAttr('disabled');
    $('#paymentDiv').fadeOut(200);
    $('.pop-full').fadeOut();
    $('.email-premission-container').fadeOut();
}
function watchFullVideo() {


    if (projekktor('#vdo-player').getState('PLAYING'))

        projekktor('#vdo-player').setPause();

    if ((window.fullScreen) || (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
        exitfs();
    }
    $('#video-information-in').hide();
    $('#thumbContainer').hide();
    loadEmailPremissionDiv();
    $('#player-buy-button a').attr('disabled', true);

}
function allow_email_premission() {
    if (LC_USER.id == 0) {
        reLogin("watchFullVideo");
        return;
    }

    var email_track_url = SITE_URL + FREE_VIDEOS + VIDEO_ID + TRACK_EMAIL;
    ga('send', 'event', 'FanConnect', 'Select Share Method', VIDEO_ID + ':' + $("#video-title-in").html());
    $('#paymentDiv').html('<div class="pop-full" style="display:block;height: 100%;"><div style="display: block; text-align: center; top: 46%;position: absolute;left: 47.5%;"><img src="/fb_app/images/ajax-loader.gif"></div></div>');
    if (LC_USER.email) {
        DataCall("uid=" + FB_USER.id, email_track_url, "POST", true, emailTrackSuccess, function () {
        });
    } else {
        var cb = function (response) {
            if (response.status === 'connected') {
                FB.api('/me', function (response) {
                    DataCall("uid=" + FB_USER.id + '&email=' + response.email, email_track_url, "POST", true, emailTrackSuccess, function () {
                    });
                });
            } else {
                loadNoEmailPremissionDiv();
            }
        };
        FB.login(cb, { scope: 'email' });
    }
}

function loadEmailPremissionDiv() {
    ga('send', 'event', 'FanConnect', 'Watch Full Video', VIDEO_ID + ':' + $("#video-title-in").html());
    if (from_page_name) {
        var user_info = from_page_name;
    } else {
        var user_info = VIDEO.user.first_name + ' ' + VIDEO.user.last_name;
    }
    $('.ppstart').removeClass('active');
    $('.ppstart').addClass('inactive');

    if($('#full_video_gateway').val() == "SOCIAL_SHARE")
        $('#paymentDiv').html('<div class="pop-full email-premission-container" id="watch-full-overlay" style="display:block;height:100%"><h2 class="want-to-connet"> '+user_info+' wants you to spread the word</h2><h2 class="share-email-with">Share this preview using LittleCast to access full video</h2><a href="#" onclick="make_fb_post();"> <img src="/assets/btn-facebook.png" /></a></div>');
    else
        $('#paymentDiv').html('<div class="pop-full email-premission-container" id="watch-full-overlay" style="display:block;height:100%"><h2 class="want-to-connet"> '+user_info+' wants to connect with you</h2><h2 class="share-email-with">Share your information with '+user_info+' to </h2><a href="#" class="watch-full-video-button " onclick="allow_email_premission();"> Access Full Video </a></div>');

    $('#paymentDiv').fadeIn();
}

make_fb_post = function(){
    if (LC_USER.id == 0) {
        c_expiry = 1/24/58;
        setCookie("social_share", 'facebook', c_expiry);
        reLogin();
        return;
    }

    if( !auto_track_email && !share_type )
        ga('send', 'event', 'FanConnect', 'Select Share Method', VIDEO_ID + ':' + $("#video-title-in").html());

    FB.ui(
      {
            method: 'share_open_graph',
            action_type: 'og.likes',
            action_properties: JSON.stringify({
                object:$('#video_facebook_tags_url').val()
            })
      },
      function(response) {
        console.log( response )
        if (response && !response.error_code) {
            var social_share_url = SERVER + FREE_VIDEOS + VIDEO_ID + SOCIAL_SHARED ;
            DataCall ("uid="+ FB_USER.id + "&post_id=" + response.post_id,  social_share_url  , "POST", true, emailTrackSuccess, function(){ });

        } else {

        }
      }
    );
}


function loadNoEmailPremissionDiv()
{
    $('#paymentDiv').attr('style',"display:block;height:100%;");
    $('#paymentDiv').html('<div class="pop-full" id="watch-full-overlay" style="display:block;height:100%"><div class="no-email-premission"><span class="no-email-premission-msg">You have not allowed the access to your email.</span><br><a href="#" style="color: red; margin: 0px;" onclick="endPayScreen();">Cancel</a></div></div>');
}

function LoadHTMLPlayer(poster, video, title, buy, type) {
    var player = '';
    var container_width = $('.container .row-fluid').width();
    var disp_height = (container_width * 56.6 / 100 ) + 35;
    var disp_height = '100%';
    var disp_width = '100%';
    PLAYER_HEIGHT = disp_height;
    PLAYER_WIDTH = disp_width
    if (DEBUG)
        console.log("HEIGHT:" + disp_height);

    $("#video-player").attr("style", "height:" + disp_height + "px;width:" + disp_width + "px;");
    var ua = navigator.userAgent.toLowerCase();
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
        var ieversion = new Number(RegExp.$1)
        if (ieversion >= 9) {
            player = player + '<video id="vdo-player" class="projekktor" poster="' + poster + '" title="' + title + '" width="' + disp_width + '" height="' + disp_height + '" controls allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true">';
        }
    }
    else {
        player = player + '<video id="vdo-player" class="projekktor" poster="' + poster + '" title="' + title + '" width="' + disp_width + '" height="' + disp_height + '" controls allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true">';
    }


    if (!(ua.indexOf("msie") > -1))
        player = player + '<source src="' + video + '" type="video/mp4" /></video>';
    else
        player = player + '<source src="' + video + '" type="video/mp4" codecs="avc1.42E01E,mp4a.40.2"/></video>';
    $('#player-loading').hide();
    //$('#html-player').html(player);

    if (ua.indexOf("firefox") > -1) {
        var controlsTemplate = '<div class="play-bar-wrap"><div class="play-bar-wraper"><div %{scrubber}><div %{loaded}></div><div %{playhead}></div><div %{scrubberdrag}></div></div></div></div><div class="control-wraper clearfix"><ul class="play fl"><li><a href="#" onclick="return false;"><div id="playButton" onclick="playBtn();" %{play}></div><div id="pauseButton" onclick="pauseBtn();" %{pause}></div></a></li><li id="vBar"><span class="ppmute" id="vmute" onclick="vToggle(1);" onmouseover="dispVolMute();" onmouseout="hideVolTip();"></span><span onclick="vToggle(2);" style="display:none" id="vmax" class="ppvmax" onmouseover="dispVolTip();" onmouseout="hideVolTip();"></span><span style="display:none" id="volTip"><ul><li><a id="volText" href="#">Mute</a></li></ul></span></li></ul><div class="left-section clearfix"><ul class="link icos fl"><li><span class="btnabout" id="aboutBtn" onclick="btnAbout();">About</span></li></ul></div><div class="right-section clearfix"><ul class="link icos fl"><li><div %{timeleft}>%{hr_elp}<span class="hr_colon">:</span>%{min_elp}:%{sec_elp} <span class="grey">/ %{hr_dur}<span class="hr_colon">:</span>%{min_dur}:%{sec_dur}</span></div></li><li><div %{fsexit}></div><div %{fsenter}></div></li><li id="fscrWrapper"><span style="display:none" id="fscr" onmouseover="dispFscr();" onmouseout="hideFscr();"><ul><li><a href="#" id="fscrTip" >View Full Screen</a></li></ul></span></li><li id="hdWrapper"><a href="#" ><span id="hdsdswitch" class="hdsd" onmouseover="dispHdSd();" onmouseout="hideHdSd();"></span></a><span style="display:none" id="hdSpanBar" onmouseover="dispHdSd();" onmouseout="hideHdSd();"><ul><li><a href="#" id="hdplug" onclick="hdswitch();">HD</a></li><li><a id="sdplug" href="#" onclick="sdswitch();">SD</a></li></ul></span></li></ul><div class="player-logo"><span class="logo"><span style="display:none" id="lcTip" onmouseover="dispLcTip();" onmouseout="hideLcTip();"><ul><li><a href="#">Watch on LittleCast</a></li></ul></span></div>';
    }
    else {
        var controlsTemplate = '<div class="play-bar-wrap"><div class="play-bar-wraper"><div %{scrubber}><div %{loaded}></div><div %{playhead}></div><div %{scrubberdrag}></div></div></div></div><div class="control-wraper clearfix"><ul class="play fl"><li><a href="#" onclick="return false;"><div %{play}></div><div %{pause}></div></a></li><li id="vBar"><span class="ppmute" id="vmute" onclick="vToggle(1);" onmouseover="dispVolMute();" onmouseout="hideVolTip();"></span><span onclick="vToggle(2);" style="display:none" id="vmax" class="ppvmax" onmouseover="dispVolTip();" onmouseout="hideVolTip();"></span><span style="display:none" id="volTip"><ul><li><a id="volText" href="#">Mute</a></li></ul></span></li></ul><div class="left-section clearfix"><ul class="link icos fl"><li><span class="btnabout" id="aboutBtn" onclick="btnAbout();">About</span></li></ul></div><div class="right-section clearfix"><ul class="link icos fl"><li><div %{timeleft}>%{hr_elp}<span class="hr_colon">:</span>%{min_elp}:%{sec_elp} <span class="grey">/ %{hr_dur}<span class="hr_colon">:</span>%{min_dur}:%{sec_dur}</span></div></li><li><div %{fsexit}></div><div %{fsenter}></div></li><li id="fscrWrapper"><span style="display:none" id="fscr" onmouseover="dispFscr();" onmouseout="hideFscr();"><ul><li><a href="#" id="fscrTip" >View Full Screen</a></li></ul></span></li><li id="hdWrapper"><a href="#" ><span id="hdsdswitch" class="hdsd" onmouseover="dispHdSd();" onmouseout="hideHdSd();"></span></a><span style="display:none" id="hdSpanBar" onmouseover="dispHdSd();" onmouseout="hideHdSd();"><ul><li><a href="#" id="hdplug" onclick="hdswitch();">HD</a></li><li><a id="sdplug" href="#" onclick="sdswitch();">SD</a></li></ul></span></li></ul><div class="player-logo"><span class="logo"></span><span style="display:none" id="lcTip" onmouseover="dispLcTip();" onmouseout="hideLcTip();"><ul><li><a href="#">Watch on LittleCast</a></li></ul></span></div>';
    }

    // if (buy == true) {
    //         controlsTemplate = controlsTemplate + '<div class="button" id="player-buy-button"><a href="#" onclick="watchFullVideo()">Watch Full Video</a></div>';
    // }
    if (type == 'buy-now') {
        if (/Android|ipad|iPhone/i.test(navigator.userAgent)) {
            controlsTemplate = controlsTemplate + '<div class="button" id="player-buy-button" style="width:74px;"><a href="https://apps.facebook.com/little-cast/?watch='+VIDEO_ID+'&free_video=1" >Buy Now</a></div>';
        }else{
            controlsTemplate = controlsTemplate + '<div class="button" id="player-buy-button" style="width:74px;"><a href="#" onclick="startTOC();">Buy Now</a></div>';
        }

    } else {
        controlsTemplate = controlsTemplate + '<div class="button" id="player-buy-button"><a href="#" onclick="watchFullVideo();">Watch Full Video</a></div>';
    }

    controlsTemplate = controlsTemplate + '</div></div>';

    var PAY_SERVER = SERVER.substr(0, (SERVER.length - 3));

    if (ua.indexOf("firefox") > -1) {
        projekktor('#vdo-player', {
            playerFlashMP4: PAY_SERVER + "/assets/StrobeMediaPlayback.swf",
            playerFlashMP3: PAY_SERVER + "/assets/StrobeMediaPlayback.swf",
            enableFullscreen: true,
            enableKeyboard: true,
            debug: false,
            imageScaling: 'fixed',
            videoScaling: 'aspectratio',
            poster: poster,
            width: disp_width,
            height: disp_height,
            playlist: [
                {

                0: {src:video , type: "video/mp4"},

                }
            ],
            plugin_controlbar: {
                controlsDisableFade: false,
                showOnStart: true,
                showOnIdle: true,
                controlsTemplate: controlsTemplate
            }

          }, function(){
            if( !auto_track_email && IS_PREVIEW && !(/Android|ipad|iPhone/i.test(navigator.userAgent)) ){
                    hideRuntime();
                    FCprojekktorReadyCallBack(IS_PREVIEW)
                }
            }
        );
    }else {

        projekktor('#vdo-player', {
            playerFlashMP4: PAY_SERVER + "/assets/StrobeMediaPlayback.swf",
            playerFlashMP3: PAY_SERVER + "/assets/StrobeMediaPlayback.swf",
            enableFullscreen: true,
            enableKeyboard: true,
            debug: false,
            imageScaling: 'fixed',
            videoScaling: 'aspectratio',
            poster: poster,
            width: disp_width,
            height: disp_height,
            playlist: [
                {

                0: {src:video , type: "video/mp4"},

                }
            ],
            plugin_controlbar: {
                controlsDisableFade: false,
                showOnStart: true,
                showOnIdle: true,
                controlsTemplate: controlsTemplate
            }

          }, function(){
            if( !auto_track_email && IS_PREVIEW && !(/Android|ipad|iPhone/i.test(navigator.userAgent)) ){
                hideRuntime();
                FCprojekktorReadyCallBack(IS_PREVIEW)
                }
            }
        );
    }//end else
} // end function

function playBtn() {
    $('.pop-full').fadeOut();
    $('#paymentDiv').fadeOut();
    projekktor('#vdo-player').setPlay();
    $('#playButton').removeClass('active');
    $('#playButton').addClass('inactive');
    $('#pauseButton').removeClass('inactive');
    $('#pauseButton').addClass('active');

    if ($('#thumbContainer').is(":visible")) {
        $('#thumbContainer').hide();
    }
    if ($('.thumbContainer').is(":visible")) {
        $('.thumbContainer').hide();
    }
    if( BROWSER.browser == 'FF' ){
        $('.ppstart').removeClass('active')
        $('.ppstart').addClass('inactive')
    }
    $('#previewBtn').hide();
    $('#aboutBtn').hide();
}
function pauseBtn() {
    projekktor('#vdo-player').setPause();
    $('#playButton').removeClass('inactive');
    $('#playButton').addClass('active');
    $('#pauseButton').removeClass('active');
    $('#pauseButton').addClass('inactive');

    if ($('#thumbContainer').is(":visible")) {
        $('#thumbContainer').hide();
    }
}

function getWidthFromDimension(dimension) {
    var dim = dimension.split("x");
    return dim[0];
}

function VideoInformation(SuccessCallBack) {
    DataCall("id=1&device=FBApp", SITE_URL + FREE_VIDEOS + VIDEO_ID + "/" + VIDEO_INFORMATION, "GET", LC_USER.id == 0 ? false : true,

        function (data) {
            try {
                from_page_id = getParameterByName('from_page_id');
                if (from_page_id) {
                    data.data.video.facebook_sharings.forEach(function (page) {
                        if (page.fb_posted_object_id == from_page_id) {
                            from_page_name = page.fb_sharing_details.page_name;
                        }
                    });
                }
                auto_track_email = getParameterByName('track_email');
                if (auto_track_email == 1 || auto_track_email == '1')
                    auto_track_email = true;
                else
                    auto_track_email = false;

                var dmy = data.data.video.media_creation_date.substr(0, 10);
                var y = dmy.substr(0, 4);
                var m = dmy.substr(5, 2);
                var d = dmy.substr(8, 2);
                var month = getMonth(m);
                data.data.video.media_creation_date_formated = month + " " + d + ", " + y;
                /* Undersocre tempaltes*/
                data.data.video.comments_count = data.data.video.recent_comments.length;

                var template = _.template(document.getElementById('type-0').innerHTML);
                $(document.getElementById('video-owner-info')).html(template(data));
                var template = _.template(document.getElementById('likes-template').innerHTML);
                $(document.getElementById('load-likes')).html(template(data));
                var template = _.template(document.getElementById('comments-template').innerHTML);
                $(document.getElementById('load-comments')).html(template(data));
                if( typeof data.data.video.products != 'undefined' && data.data.video.products.length ){
                    var template = _.template(document.getElementById('products-template').innerHTML);
                    $(document.getElementById('products-container')).html(template(data));
                }

                if ( !(data.data.video.email_tracked || data.data.video.is_social_shared || data.data.video.is_owner) ){
                    $('#products-container').hide();
                }
                /*
                 LIT-3070
                 Hiding top navigation Who We are , How it works
                 managing toggle of description area
                 */
                if (data.data.video.is_purchased || data.data.video.is_owner) {
                    /*$('.hide-nav-links').hide();*/
                    $('.desc-container').hide();
                    $('#toggle-desc').css('background-position', '0px -17px');
                } else {
                    $('#toggle-desc').addClass('desc-show');
                    $('#toggle-desc').css('background-position', '0px 0px');
                }
                $('#toggle-desc').show();

                $('.share').socialLikes();

                if (typeof gapi != 'undefined' && typeof gapi.plus != 'undefined')
                    gapi.plus.go('.g-plus');

                setTimeout(function () {
                    !function (d, s, id) {
                        var js, fjs = d.getElementsByTagName(s)[0];
                        if (!d.getElementById(id)) {
                            js = d.createElement(s);
                            js.id = id;
                            js.src = "https://platform.twitter.com/widgets.js";
                            fjs.parentNode.insertBefore(js, fjs);
                        }
                    }(document, "script", "twitter-wjs");
                }, 1500);

                VIDEO = data.data.video;
                VIDEO_OWNER = VIDEO.user;
                PUBLISHER = data.data.video.user;

                $('#video-main-title').html(VIDEO.title);
                //$("#video-title").html(VIDEO.title);
                $("#video-title-in").html(VIDEO.title);
                //$('#video-caption').html(VIDEO.description);

                if (VIDEO.description.length > 750) {
                    $('#video-caption-in').html(VIDEO.description.substring(0, 750) + "..." + "<a id='description_anchor' href='javascript:;' onclick=\"#description\" >More</a>");
                }
                else {
                    $('#video-caption-in').html(VIDEO.description)
                }
                var dmy = VIDEO.media_creation_date.substr(0, 10);
                var y = dmy.substr(0, 4);
                var m = dmy.substr(5, 2);
                var d = dmy.substr(8, 2);
                var month = getMonth(m);
                //$('#creation-date').html(month + " " + d + ", " + y);
                //$('#creation-date').attr('title', 'Creation Date' + month + " " + d + ", " + y);
                //$('#publisher-photo').html('<img alt="" src="https://graph.facebook.com/' + PUBLISHER.uid + '/picture" width="50" height="50">');
                var pubName = getParameterByName('page_name');
                if (from_page_id && from_page_name != undefined) {
                    pubName = from_page_name;
                }
                if (pubName == "") {
                    $('#publisher-name').html("<a href='https://www.facebook.com/" + PUBLISHER.uid + "' target='_blank'>" + PUBLISHER.first_name + " " + PUBLISHER.last_name + "</a>");
                    $("#publisher-name-in").html("<a style='color:#FFFFFF;' href='https://www.facebook.com/" + PUBLISHER.uid + "' target='_blank'>" + PUBLISHER.first_name + " " + PUBLISHER.last_name + "</a>");
                }
                else {
                    var pageLink = from_page_id;

                    $('#publisher-name').html("<a href='https://www.facebook.com/" + pageLink + "' target='_blank'>" + pubName + "</a>");
                    $("#publisher-name-in").html("<a style='color:#FFFFFF;' href='https://www.facebook.com/" + pageLink + "' target='_blank'>" + pubName + "</a>");
                }
                $("#video-category").html(VIDEO.category_name);
                /*
                 $('#sold-count').html(VIDEO.total_sold);
                 */
                $('#comments-count').html(VIDEO.comments_count);
                $('#likes-count').html(VIDEO.likes_count);
                $("#video-category").show();
                if (VIDEO.previews_count < 1) {
                    $('#views-count-in').html('<br/>');
                    $('#views-count-in').removeClass();
                    $('#views-count-in').attr("class", "clear");
                } else
                    $('#views-count-in').html(VIDEO.previews_count);

                $('#sold-count-in').removeClass();
                $('#sold-count-in').attr("class", "no-solds");
                if (VIDEO.price)
                    $('#video-price-in').html('$' + VIDEO.price);
                try {
                    var preview = '';
                    if (VIDEO.processed_preview_information) {
                        var len = VIDEO.processed_preview_information.length;
                        for (i = 0; i < len; i++)
                            if (VIDEO.processed_preview_information[i].format == "mpeg4")
                                preview = VIDEO.processed_preview_information[i].signed_processed_keys;
                    }

                } catch (ex) {
                    console.log(ex);
                }

                comment_text = getCookie("comment_text");
                if (comment_text != "") {
                    deleteCookie("comment_text")
                    evt = new Event("keydown");
                    evt.keyCode = 13;
                    $('#comment_text').val(comment_text);
                    AddComment(evt);
                }

            like_video = getCookie("like_video");
            if(like_video == "like"){
                deleteCookie("like_video");
                $('#video-like').click();
            }

                if (DEBUG)
                    console.log(preview);
                var thumbCtr = 0;
                var foundIndex = 0;

                var thumb_width = 0;
                var max_width_thumb_index = 0;
                while (thumbCtr < VIDEO.thumbnails.length) {

                    if (VIDEO.thumbnails[thumbCtr].signed_processed_keys.indexOf("TIMELINE_PLAYER_1280x720") != -1) {
                        foundIndex = thumbCtr;
                        break;
                    }
                    else
                        thumbCtr++;
                }
                if (foundIndex == 0) {
                    thumbLinkPath = VIDEO.thumbnails[max_width_thumb_index].signed_processed_keys;
                } else {
                    thumbLinkPath = VIDEO.thumbnails[foundIndex].signed_processed_keys;
                }

                if (data.data.video.is_purchased || data.data.video.is_owner) {
                    IS_PREVIEW = false;
                    LoadHTMLPlayer(thumbLinkPath, preview, VIDEO.title, false);
                    playFreeEmailFullVideo(data, false);
                } else if ( (data.data.video.email_tracked || data.data.video.is_social_shared) && !data.data.video.price) {
                    IS_PREVIEW = false;
                    LoadHTMLPlayer(thumbLinkPath, preview, VIDEO.title, false);
                    playFreeEmailFullVideo(data, false);

                } else {
                    if (data.data.video.price && (data.data.video.email_tracked || data.data.video.is_social_shared) ) {
                        IS_PREVIEW = false;
                        LoadHTMLPlayer(thumbLinkPath, preview, VIDEO.title, true, 'buy-now');
                        playBoughtEmailFullVideo(data, false);
                    } else {
                        IS_PREVIEW = true;
                        LoadHTMLPlayer(thumbLinkPath, preview, VIDEO.title, true, auto_track_email ) ;
                        projekktor('#vdo-player').addListener('state', displayInfo);
                        projekktor('#vdo-player').addListener('time', logFanConnectPreview);
                        if (auto_track_email) {
                            allow_email_premission();
                        }
                        if( getParameterByName('cta') == 1 || getParameterByName('cta') == "1" )
                            watchFullVideo();
                    }
                    $('#notifyExpiry').hide();
                    $('#notifyExpiry').html('');

                    // if (!emailPrev  && !data.data.video.email_tracked && auto_track_email != 1 ){
                    //     loadPaymentDiv();
                    // }else
                    //     $('#paymentDiv').hide();


                    if (TOS) {
                        $('#toc').show();
                        $('#paymentDiv').html('');
                        $('#paymentDiv').hide();
                    }
                    $('#video-information-in').show();
                    $("#about-video-in").attr('style', "display:none");
                    $("#video-category").show();
                    $('#hdsdswitch').hide();
                    $('#fscreenCtrl').hide();
                    $('#hdWrapper').hide();
                    $('#fscrWrapper').hide();

                    $('#vBar').hide();
                    //12 APRIL FIX LIT 997
                    if (!TOS) {
                        $('#video-information-in').hide();
                        $("#about-video-in").attr('style', "display:none");
                    }
                    $('#player-buy-button').show();
                    try{
                        Failure();
                    }catch(ex){
                        console.log( ex )
                    }

                }

                social_share = getCookie("social_share");
                if(social_share == "facebook" || getParameterByName("share_type") == "fb_share" ){
                    deleteCookie("social_share");
                    if( !data.data.video.is_owner && !data.data.video.email_tracked && !data.data.video.is_social_shared){
                      setTimeout(function(){make_fb_post();}, 2000);
                    }
                }

                SuccessCallBack();
            } catch (ex) {
                if (DEBUG)
                    console.log("Exception: " + ex.message);
            }
            try {
                if (VIDEO.media_creation_date != null) {
                    var stamp = TimeStamp(VIDEO.media_creation_date);
                    $('#video-stamp').html($('#video-stamp-in').html(stamp.user_stamp));
                    var dmy = VIDEO.media_creation_date.substr(0, 10);
                    var y = dmy.substr(0, 4);
                    var m = dmy.substr(5, 2);
                    var d = dmy.substr(8, 2);
                    var month = getMonth(m);
                    $('#video-stamp').attr('title', 'Published Date: ' + month + " " + d + ", " + y);
                }

            } catch (err) {
                if (DEBUG)
                    console.log("Invalid DateTime Format. << Media Creation Date.");
            }
            try{
                $('#video-views').html(VIDEO.view_count);
            }catch(ex){
                console.log( ex );
            }

            if ( !data.data.video.is_owner && !data.data.video.is_social_shared && !data.data.video.email_tracked ) {
                    $('#previewBtn').show();
                    $('#aboutBtn').show();
            }

        },

        function (data) {
            var json = jQuery.parseJSON(data.responseText);

            if (json.data.video.is_deleted) {
                $('#player-loading').hide();
                $('#toc').html('');
                $('#paymentDiv').html('');
                $('#toc').hide();
                $('#lcs').remove();
                $('#comPanel').remove();
                $('#comments').remove();
                $('#paymentDiv').show();
                $('#paymentDiv').html('<div class="pop-full" style="display:block;height: 400px;background:black;"><h2 class="alignment">It appears that this video has been taken-off by the producer. Sorry for the inconvenience.</h2></div>');
            }
            else
                alert("Failed to load video. Refresh or try again later.");
        });
}

function stripeSuccess() {
    console.log("HERE!!");
    $('#spinner-img').removeClass('loader');
    var count = $('#sold-count-in').html();
    var newCount = (parseInt(count, 10)) + 1;
    $('#sold-count-in').html(newCount);
    count = $('#sold-count').html();
    var newCount = (parseInt(count, 10)) + 1;
    $('#sold-count').html(newCount);
    $('#video-information-in').hide();
    //$("#payment-form").hide();
    $("#toc").hide();
    $('#player-buy-button').hide();
    $('#video-price-in').hide();
    $("#video-category").show();
    $('#video-price-in').hide();
    $('#previewBtn').hide();
    $('#aboutBtn').hide();
    //SHOW SUCCESS MESSAGE HERE
    $('#paymentDiv').attr('style', "display:block;height:100%;");
    $('#paymentDiv').show();
    $('#paymentDiv').html('');
    showPaySuccess();
}
function playBoughtVid() {
    window.setTimeout(StreamMedia, 100, true, function () {
        $('#paymentDiv').html('');
        $('#paymentDiv').hide();
    });
}
function StreamMedia(AutoPlay, Failure) {

    DataCall("", SITE_URL + FREE_VIDEOS + VIDEO_ID + "/" + TRACK_EMAIL, "POST", true,

        function (data) {
            playBoughtEmailFullVideo(data, true);
        },

        function (data) {
            console.log("StreamMedia failed ");
            console.log(data);
        });
    //UserAccess ();
}
function showPaySuccess() {

    $('#thumbCtrPlay').hide();
    $('#thumbCtrPlay').remove();

    if (social_sharing && postId) {
        $('.share-video').hide();
        $('#prev-text-for-user').show('slow');
        $('#prev-text-for-user').html('Purchase activity shared on Facebook and LittleCast - &nbsp;<a onclick="removePurchase();"  href="javascript:void(0)" href="#">Remove</a>');
        $('#paymentDiv').html('<div id="notifyExpiry" onclick="playBoughtVid();" style="cursor:pointer"><p class="buy-screen-text"></p><div class="pop-full1" style="display:block; cursor:pointer"><div class="top-space" style="cursor:pointer"><h2 class="tic" style="cursor:pointer">Thank you for your purchase!</h2></div></div><div class="purchase" style="cursor:pointer"><div class="watchOn" style="cursor:pointer"><h4 style="cursor:pointer"> Watch on the <br>Facebook LittleCast App</h4><img alt="" src="/fb_app/images/img-zoom.png" style="cursor:pointer"></div><h6 style="cursor:pointer">OR</h6><div class="mobilApps" style="cursor:pointer"><h4 style="cursor:pointer"> Watch on the <br> LittleCast Mobile Apps</h4><img alt="" src="/fb_app/images/app-store.png" style="cursor:pointer"></div><div class="btn-click" style="cursor:pointer"><a href="#"><img alt="" src="/fb_app/images/btn-click.png" style="cursor:pointer"></a> </div></div></div>');
    }
    else
        $('#paymentDiv').html('<div id="notifyExpiry" onclick="playBoughtVid();" style="cursor:pointer"><p class="buy-screen-text"></p><div class="pop-full1" style="display:block; cursor:pointer"><div class="top-space" style="cursor:pointer"><h2 class="tic" style="cursor:pointer">Thank you for your purchase!</h2></div></div><div class="purchase" style="cursor:pointer"><div class="watchOn" style="cursor:pointer"><h4 style="cursor:pointer"> Watch on the <br>Facebook LittleCast App</h4><img alt="" src="/fb_app/images/img-zoom.png" style="cursor:pointer"></div><h6 style="cursor:pointer">OR</h6><div class="mobilApps" style="cursor:pointer"><h4 style="cursor:pointer"> Watch on the <br> LittleCast Mobile Apps</h4><img alt="" src="/fb_app/images/app-store.png" style="cursor:pointer"></div><div class="btn-click" style="cursor:pointer"><a href="#"><img alt="" src="/fb_app/images/btn-click.png" style="cursor:pointer"></a> </div></div></div>');
    //$('#paymentDiv').html('<div id="notifyExpiry"><p class="buy-screen-text"></p><div class="pop-full1" style="display:block;"><div class="top-space"><h2 class="tic">Thank you for your purchase!</h2></div></div><div class="purchase"><div class="watchOn"><h4> Watch on the <br>Facebook LittleCast App</h4><img alt="" src="/fb_app/images/img-zoom.png"></div><h6>OR</h6><div class="mobilApps"><h4> Watch on the <br> Facebook LittleCast App</h4><img alt="" src="/fb_app/images/app-store.png"></div><div class="btn-click"><a href="#"><img alt="" src="/fb_app/images/btn-click.png"></a> </div></div></div>');

    FB.Canvas.setAutoGrow(100);
    $("body").css("overflow", "hidden");
    //$('#dispPlayBtn').show();
}


function emailTrackSuccess(data) {
    $('#player-buy-button').hide();
    $('#video-price-in').hide();
    $('#video-price-in').hide();
    $('#previewBtn').hide();
    $('#aboutBtn').hide();
    //SHOW SUCCESS MESSAGE HERE
    $('#paymentDiv').html('');
    $('#paymentDiv').hide();
    $('#notifyExpiry').html('');
    $('#notifyExpiry').remove();
    prevCallSent = false;
    previewFlag = false;
    videoLengthLegal = false;
    VIEW_CALL_SENT = false;
    $('#prev-text-for-user').fadeOut();
    var autoplay = true;
    $('#products-container').fadeIn();
    if (VIDEO.price) {
        playFreeEmailFullVideo(data, autoplay);
    } else {
        playBoughtEmailFullVideo(data, autoplay);
    }
}
function removePurchase() {
    deletePreview();
    $('#prev-text-for-user').hide();
    $('#prev-text-for-user').remove();
}

function showPrevText() {
    if (social_sharing && postId) {
        $('.share-video').hide();
        $('#prev-text-for-user').show('slow');
    }
}

var displayInfo = function (state) {
    console.log( state )
    switch (state) {

        case 'STARTING':
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf("firefox") > -1) {
                $('#playButton').removeClass('active');
                $('#playButton').addClass('inactive');
                $('#pauseButton').removeClass('inactive');
                $('#pauseButton').addClass('active');
                $('#video-information-in').hide();
                $('#previewBtn').hide();
                $('#aboutBtn').hide();
                $('#vBar').show();
                if( !(/Android|ipad|iPhone/i.test(navigator.userAgent)) ){
                    $('#fscrWrapper').show();
                    $('#fscreenCtrl').show();
                }
            }
            if ( !( getParameterByName('cta') == 1 || getParameterByName('cta') == "1" ) )
                hideWatchFullVideo();
            if( BROWSER.browser == 'FF'){
                $('.pppause').removeClass('active')
                $('.pppause').addClass('inactive')
                $('.ppplay').removeClass('inactive')
                $('.ppplay').addClass('active')
                ga('send', 'event', 'FanConnect', 'Video Play', VIDEO_ID + ':' + $("#video-title-in").html());
            }
            break;
        case 'PLAYING':
            if ( !( getParameterByName('cta') == 1 || getParameterByName('cta') == "1" ) )
                hideWatchFullVideo();
            if ($("embed#vdo-player_media_flash").length) {
                $('.ppbuffering').removeClass('active');
                $('.ppbuffering').addClass('inactive');
            }
            if ($('.thumbContainer').is(":visible")) {
                $('.thumbContainer').hide();
            }
            if ($('#thumbContainer').is(":visible")) {
                $('#thumbContainer').hide();
            }
            if(!playEventLog && playReq && BUFFERED){
                ga('send', 'event', 'FanConnect', 'Video Play', VIDEO_ID + ':' + $("#video-title-in").html());
                playEventLog = true;
            }
            playReq = true;

            if( BUFFERED && IS_PREVIEW){
                $('#video-information-in').hide('slow');
                $('#about-video-in').hide('slow');
                $('#previewBtn').hide();
                $('#aboutBtn').hide();
            }

            $('#vBar').show();
            if( !(/Android|ipad|iPhone/i.test(navigator.userAgent)) ){
                $('#fscrWrapper').show();
                $('#fscreenCtrl').show();
            }
            if (playing_status == false){
                playing_status = true;
            }
            break;

        case 'COMPLETED':
            ga('send', 'event', 'FanConnect', 'Finished Video', VIDEO_ID + ':' + $("#video-title-in").html());
            playing_status = false
            playEventLog   = false;
            VIEW_CALL_SENT = false;
        case 'STOPPED':
            if (!(previewFlag))
                prevCallSent = false;
            watchFullVideo();
            $("#about-video-in").attr('style', "display:none");
            $('#previewBtn').show();
            $('#aboutBtn').show();
            $('#vBar').hide();
            $('#hdsdswitch').hide();
            $('#fscreenCtrl').hide();
            $('#hdWrapper').hide();
            $('#fscrWrapper').hide();
            if (!($('#thumbContainer').is(":visible"))) {
                $('#thumbContainer').show();
            }
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf("firefox") > -1) {
                $('#playButton').removeClass('inactive');
                $('#playButton').addClass('active');
                $('#pauseButton').removeClass('active');
                $('#pauseButton').addClass('inactive');
            }
            break;
        case 'PAUSED':
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf("firefox") > -1) {
                $('#playButton').removeClass('inactive');
                $('#playButton').addClass('active');
                $('#pauseButton').removeClass('active');
                $('#pauseButton').addClass('inactive');
            }
            break;
    }

}
function endPayScreen() {
    if (!TOS)
        TOS = true;
    $('#video-information-in').show();
    $("#about-video-in").attr('style', "display:none");
    $('#paymentDiv').html('');
    $('#paymentDiv').hide();
}

var recStrem = function (state) {
    console.log( state )
    switch (state) {
        case 'IDLE':
            $('.ppfsexit').removeClass('active');
            $('.ppfsexit').addClass('inactive');

            $('.ppfsenter').removeClass('inactive');
            $('.ppfsenter').addClass('active');

        case 'STARTING':
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf("firefox") > -1) {
                $('#playButton').removeClass('active');
                $('#playButton').addClass('inactive');
                $('#pauseButton').removeClass('inactive');
                $('#pauseButton').addClass('active');
            }
            if( BROWSER.browser == 'FF'){
                $('.pppause').removeClass('active')
                $('.pppause').addClass('inactive')
                $('.ppplay').removeClass('inactive')
                $('.ppplay').addClass('active')
                ga('send', 'event', 'FanConnect', 'Video Play', VIDEO_ID + ':' + $("#video-title-in").html());
            }
            break;
        case 'PLAYING':
            if ($("embed#vdo-player_media_flash").length) {
                $('.ppbuffering').removeClass('active');
                $('.ppbuffering').addClass('inactive');
            }
            if ($('.thumbContainer').is(":visible")) {
                $('.thumbContainer').hide();
            }
            $('#video-information-in').hide('slow');

            if(!playEventLog){
                ga('send', 'event', 'FanConnect', 'Video Play', VIDEO_ID + ':' + $("#video-title-in").html());
                playEventLog = true;
            }
            if (playing_status == false){
                playing_status = true;
            }
            break;
        case 'STOPPED':
        case 'COMPLETED':
            if (!($('#thumbContainer').is(":visible"))) {
                $('#thumbContainer').show();
            }
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf("firefox") > -1) {
                $('#playButton').removeClass('inactive');
                $('#playButton').addClass('active');
                $('#pauseButton').removeClass('active');
                $('#pauseButton').addClass('inactive');
            }
            ga('send', 'event', 'FanConnect', 'Finished Video', VIDEO_ID + ':' + $("#video-title-in").html());
            playing_status = false
            playEventLog   = false;
            VIEW_CALL_SENT = false;
            break;
    }
}

function playFreeEmailFullVideo(data, AutoPlay) {
    if(data.data.video_details){
        HD = data.data.video_details.hd.mp4_signed_processed_keys;
        SD = data.data.video_details.sd.mp4_signed_processed_keys;

    }else{
        HD = data.data.video.original_videos.hd.signed_processed_keys;
        SD = data.data.video.original_videos.sd.signed_processed_keys;
    }
    if (HD != null && SD != null) {
        currentRES = "HD";
        var video_to_play = {
            0: {
                src: HD,
                type: 'video/mp4'
            }
        };
        $('#hdplug').html('-HD');
        $('#sdplug').html('SD');
    } else {
        alert('HD or SD are under proccess. You are viewing this video in 320P');
        var video_to_play = {
            0: {
                src: data.data.video.original_videos._320.signed_processed_keys,
                type: 'video/mp4'
            }
        };
        $('#hdplug').html('HD');
        $('#sdplug').html('-SD');
    }


    projekktor('#vdo-player').setItem(video_to_play, 0, true);
    projekktor('#vdo-player').config._playlist = video_to_play;
    if (AutoPlay == true) {
        projekktor('#vdo-player').setPlay();
        if( BROWSER.browser == 'FF' ){
            $('.ppstart').removeClass('active')
            $('.ppstart').addClass('inactive')
            $('.pppause').removeClass('inactive')
            $('.pppause').addClass('active')
        }
    }
    else
        projekktor('#vdo-player').setStop();

    projekktor('#vdo-player').removeListener('state', displayInfo);
    projekktor('#vdo-player').removeListener('time', logFanConnectPreview);
    projekktor('#vdo-player').addListener('time', logFanConnectStream);
    projekktor('#vdo-player').addListener('state', recStrem);

    $('#paymentDiv').hide();
    $('#hdsdswitch').show();
    $('#fscreenCtrl').show();
    $('#hdWrapper').show();
    $('#fscrWrapper').show();

    $('#hdsdswitch').show();
    $('#vBar').show();
    $('#previewBtn').hide();
    $('#aboutBtn').hide();
    $('#player-buy-button').hide();
    $('#video-information-in').hide();
    $('#about-video-in').hide();
    $('#video-price-in').hide();
    $("#video-category").show();
    if (/ipad|iPhone/i.test(navigator.userAgent)) {
        $('.ppbuffering').removeClass('active');
        $('.ppbuffering').addClass('inactive');
    }
    if (/Android|ipad|iPhone/i.test(navigator.userAgent)) {
        $('#player-buy-button').html('<a href="https://apps.facebook.com/little-cast/?watch='+VIDEO_ID+'&free_video=1">Buy Now</a>');
    }else{
        $('#player-buy-button').html('<a href="#" onclick="startTOC();">Buy Now</a>');
    }
    if (AutoPlay)
        $('#player-buy-button').show();
    else
        $('#player-buy-button').hide();

    if($('#thumbContainer').is(":visible")){
        $('#thumbContainer').hide();
    }
    if($('.thumbContainer').is(":visible")){
        $('.thumbContainer').hide();
    }

}
function playBoughtEmailFullVideo(data, AutoPlay) {

    // if(data.data.auto_play_video == "false" || data.data.auto_play_video == false){
    //     AutoPlay  = false;
    // }

    if(data.data.video_details){
        HD = data.data.video_details.hd.mp4_signed_processed_keys;
        SD = data.data.video_details.sd.mp4_signed_processed_keys;

    }else{
        HD = data.data.video.original_videos.hd.signed_processed_keys;
        SD = data.data.video.original_videos.sd.signed_processed_keys;
    }
    projekktor('#vdo-player').setStop();
    if (HD != null && SD != null) {
        currentRES = "HD";
        var video_to_play = {
            0: {
                src: HD,
                type: 'video/mp4'
            }
        };
        $('#hdplug').html('-HD');
        $('#sdplug').html('SD');
    } else {
        alert('HD or SD are under proccess. You are viewing this video in 320P');
        var video_to_play = {
            0: {
                src: data.data.video.original_videos._320.signed_processed_keys,
                type: 'video/mp4'
            }
        };
        $('#hdplug').html('HD');
        $('#sdplug').html('-SD');
    }

    projekktor('#vdo-player').setItem(video_to_play, 0, true);
    projekktor('#vdo-player').config._playlist = video_to_play;
    if (AutoPlay == true) {
        projekktor('#vdo-player').setPlay();
        if( BROWSER.browser == 'FF' ){
            $('.ppstart').removeClass('active')
            $('.ppstart').addClass('inactive')
            $('.pppause').removeClass('inactive')
            $('.pppause').addClass('active')
        }
    }else{
        // if( (data.data.auto_play_video == "false" || data.data.auto_play_video == false)){
        //     setTimeout(function(){
        //         projekktor('#vdo-player').setPause();
        //     }, 1000);

        // }
        // else
           projekktor('#vdo-player').setStop();
    }

    projekktor('#vdo-player').removeListener('state', displayInfo);
    projekktor('#vdo-player').removeListener('time', logFanConnectPreview);
    projekktor('#vdo-player').addListener('time', logFanConnectStream);
    projekktor('#vdo-player').addListener('state', recStrem);

    $('#paymentDiv').hide();
    $('#hdsdswitch').show();
    $('#fscreenCtrl').show();
    $('#hdWrapper').show();
    $('#fscrWrapper').show();

    $('#hdsdswitch').show();
    $('#vBar').show();
    $('#previewBtn').hide();
    $('#aboutBtn').hide();
    $('#player-buy-button').hide();
    $('#video-information-in').hide();
    $('#about-video-in').hide();
    $('#video-price-in').hide();
    $("#video-category").show();
    if (/Android|ipad|iPhone/i.test(navigator.userAgent)) {
        $('#player-buy-button').html('<a href="https://apps.facebook.com/little-cast/?watch='+VIDEO_ID+'&free_video=1">Buy Now</a>');
    }else{
        $('#player-buy-button').html('<a href="#" onclick="startTOC();">Buy Now</a>');
    }
    if (/ipad|iPhone/i.test(navigator.userAgent)) {
        $('.ppbuffering').removeClass('active');
        $('.ppbuffering').addClass('inactive');
    }


    $('#player-buy-button').hide();

    if($('#thumbContainer').is(":visible")){
        $('#thumbContainer').hide();
    }
    if($('.thumbContainer').is(":visible")){
        $('.thumbContainer').hide();
    }
}

function loadPaymentDiv() {
    loadEmailPremissionDiv();
}
function confirmPreviewPost() {
    $('#paymentDiv').show();
    $('#paymentDiv').html('');
    $('#paymentDiv').attr('style', "display:block;height:93%;");
    $('#paymentDiv').html('<div class="pop-full" style="display:block;height:100%"><p class="preview-screen-text">This preview has been shared on your Facebook Timeline & LitlleCast activity feed<a href="#">REMOVE</a></p></div>');
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

function removePreviewAct() {
    deletePreview();
    $('.share-video').hide();
    $('#prev-text-for-user').html('Watch activity removed from Facebook and LittleCast &nbsp;<a href="javascript:void(0)" onclick="addPreviewAct();">X</a>');
}

function addPreviewAct() {
    $('#prev-text-for-user').hide();
    $('#prev-text-for-user').remove();
}

function addPreview() {
    //do nothing as of now
}

$(document).ready(function () {
    $('.iTunes-link').live('click',
        function () {
            projekktor('#vdo-player').setPause();
        });
});
$('.ppplay').live('click', function(){
    $('#previewBtn').hide();
    $('#aboutBtn').hide();
    $('#video-information-in').hide('slow');
});
$('.ppstart').live('click', function(){
    $('#previewBtn').hide();
    $('#aboutBtn').hide();
    $('#video-information-in').hide('slow');
});

var logFanConnectPreview = function(time) {
    if( !VIEW_CALL_SENT && time > 3 && time < 4 ){

        VIEW_CALL_SENT  = true ;

        ga('send', 'event', 'FanConnect', 'Video View', VIDEO_ID + ':' + $("#video-title-in").html());

        DataCall("device=FBApp&log_fb_activity=false&log_preview=true", SERVER + VIDEOS + VIDEO_ID + PREVIEWED, "GET", false,
            function (data) {
                if(DEBUG)
                    console.log("Registered Success");
            },
            function (data) {
                if(DEBUG)
                    console.log("Unregistered preview");
            });


    }else if( !SECOND_PREVIEW_CALL_SENT && time > 9 ){

        SECOND_PREVIEW_CALL_SENT = true;

        DataCall("device=FBApp&log_fb_activity=true&log_preview=false&is_preview=true", SERVER + VIDEOS + VIDEO_ID + PREVIEWED, "GET", false,
            function (data) {
                activityId = data.data.activity_id;
                postId = data.data.post_id;
                social_sharing = data.data.is_social_on;
                showPrevText();
            },
            function (data) {
                if(DEBUG)
                    console.log("Unregistered preview");
            });
    }
}

logFanConnectStream = function(time){
    if( !STREAM_CALL_SENT && time > 9 ){

        ga('send', 'event', 'FanConnect', 'Video View', VIDEO_ID + ':' + $("#video-title-in").html());

        DataCall("device=FBApp&uid=" + LC_USER.uid + "&log_fb_activity=true&log_preview=false", SITE_URL + SERVICE_KEY + VIDEO_ID + UPDATE_STREAM, "GET", true,

            function (data) {
            activityId = data.data.activity_id;
            postId = data.data.post_id;
            social_sharing = data.data.is_social_on;


            showPrevText();
        },
        function (data) {
            if (DEBUG)
                console.log("Unregistered preview");
        });
        STREAM_CALL_SENT = true;
    }
}
