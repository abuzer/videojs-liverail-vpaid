var HD = '';
var SD = '';
var currentRES = '';
var TOS = false;
var emailPrev = false;
var playReq = false;
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
VIEW_CALL_SENT = false;
STREAM_CALL_SENT = false;
var playing_status = false;
IS_PREVIEW = false;
var playEventLog   = false;
BUFFERED = false;
ProjThumb = '' ;
window.onresize = function(event) {
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
    $('#thumbContainer').hide();
    $('.ppstart').removeClass('active');
    $('.ppstart').addClass('inactive');
    
}

function btnPlay() {
    $('.ppstart').removeClass('active');
    $('.ppstart').addClass('inactive');
    projekktor('#vdo-player').setPlay();
    $('#paymentDiv').html('');
    $('#paymentDiv').hide();
    $('#paymentDiv').remove();

    $('#notifyExpiry').html('');
    $('#notifyExpiry').hide();
    $('#notifyExpiry').remove();
}

function playBoughtVid( AutoPlay ) {
    if ($('#thumbContainer').is(":visible")) {
        $('#thumbContainer').hide();
    }
    if( typeof AutoPlay == 'undefined'){
        AutoPlay = true;
    }
    console.log( " AutoPlay" +  AutoPlay)
    window.setTimeout(StreamMedia, 100, AutoPlay, true, function() {
        $('#paymentDiv').html('');
        $('#paymentDiv').hide();
    });
    $('#dispPlayBtn').hide();
    $('#dispPlayBtn').remove();
}

function playFromThumb() {
    $('.ppstart').removeClass('active');
    $('.ppstart').addClass('inactive');
    if ($('#thumbContainer').is(":visible")) {
        $('#thumbContainer').hide();
        projekktor('#vdo-player').setPlay();
    }
}

function loadThumb() {
    //$('#thumbContainer').html('<center><img id="thumbPic" height="100%" alt="" src="'+thumbLinkPath+'"></center><button id="thumbCtrPlay" class="play-button" style=""></button>');
    //$('#thumbContainer').html('<center><img id="thumbPic" height="100%" alt="" src="'+thumbLinkPath+'"></center><button id="thumbCtrPlay" class="play-button" style=""></button>');
    // $('#thumbContainer').html('<button id="thumbCtrPlay" class="play-button" style=""></button>');
    //$('#thumbContainer').css({ 'background-image': 'url(' + thumbLinkPath + ')', 'background-repeat': 'no-repeat','background-position-x': '50%', 'background-position-y': '50%', 'background-position': '50% 50%' }) ;
}

function addEventListeners() {

}

function watchFunction() {


    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
        var ieversion = new Number(RegExp.$1)
        if (ieversion <= 8) {
            alert("This website is best viewed on Internet Explorer version 9 or above. Please upgrade to a latest version or try using latest Chrome/Firefox");
        } else {
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
    } else {
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

    if ($.browser.webkit) {

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
        console.log("\nEXIT FS CALLED\n");

}

function fscreen() {
    if ((window.fullScreen) || (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
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

            /*$('#video-player').css('width', '100%');
            $('#video-player').css('height', screen.height+'px;');
            $('#video-player').attr('height', screen.height+'px;');
            $('#video-player').css('height', screen.width+'px;');
            $('#video-player').attr('height', screen.width+'px;');*/
            $("#video-player").attr("style", "height:" + screen.height + "px;width:" + screen.width + "px;");
            $('#vdo-player').attr('style', 'max-width:' + screen.width + 'px !important; height:' + screen.height + 'px; width:' + screen.width + 'px !important;');
            $('#vdo-player_media_html').attr('style', 'position: absolute;');
            $('#vdo-player_media').attr('style', 'max-width: 100%; height:' + screen.height + 'px; width:' + screen.width + ' px !important;');
            goFullscreen('video-player');
        } else {
            goFullscreen('vdo-player');
        }
    }

}


function btnAbout() {

    if (($('#about-video-in').is(":visible"))) {
        $("#about-video-in").attr('style', "display:none");
    } else {
        if (($('#toc').is(":visible"))) {
            $('#toc').hide();
            $('#toc').html('');
        }
        $('#video-information-in').show();
        $("#about-video-in").attr('style', "display:block");
    }
    if (BROWSER.browser == "FF") {
        if ((window.fullScreen) || (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
            exitfs();
        }
    }
}

function startTOC(cancel_button) {
    if(cancel_button){
        $('#player-buy-button').find("a").html("Buy Now");
    }
    else if ($('#player-buy-button').find("a").html() == "Buy Now") {
        $('#player-buy-button').find("a").html("Cancel");
    } else {
        $('#player-buy-button').find("a").html("Buy Now");
    }

    if (projekktor('#vdo-player').getState('PLAYING'))
        projekktor('#vdo-player').setPause();

    if ((window.fullScreen) || (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
        exitfs();
    }

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

    } else {
        if (($('#toc').is(":visible"))) {
            $('#toc').hide();
            $('#toc').html('');
            $('#video-information-in').hide();
        } else {
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

    if (LC_USER.id == 0) {
        reLogin("buyNowPaid");
        return;
    }

    $('#toc').html('<div style="display:block;overflow: hidden;" class="buy-now-container"><div style="padding-left: 20%; padding-top: 5%; padding-bottom: 5%"><h4>What exactly am I buying?</h4><ul><li style="font-size:14px;">Ability to stream and download unlimited while video is available.</li><li style="font-size:14px;">Stream video on Facebook - download on LIttleCast App (iOS and Android)</li></ul><p style="font-size: 10px;"><input type="checkbox" id="iAgree">'  +
            ' <label for="iAgree" style="font-size: 10px;"> I have read and agree to LittleCast ' +
            '<a href="/terms-of-use/" target="_blank"  style="color:white; text-decoration:underline;">Terms of Use</a> & </label>'+
            '<a href="/payment-addendum/" target="_blank" style="color:white;text-decoration:underline;">Payment Addendum.</a>&nbsp;All Sales are final.</p>'+
            '<p id="error-text" style="font-weight:bold; padding: 0px 0px 0px 15px;font-size: 15px;width: 400px;margin: 0px;color:red;height: 20px;"></p><p class="butonP">'+
            '<a href="#" onclick="fbpay();"><img src="../fb_app/images/pay-with-facebook.png"></a>' +
            '<a href="#" onclick="paypal_payment();"><img src="/assets/pay-with-paypal.png"></a>' +
            '</p></div>' +
            '<div class="button1" style="text-align: center; bottom: 0; right: 0; z-index: 99999; position: absolute;width:74px;"><a onclick="startTOC(\'cancel\');" href="javascript:;" style="color:white;width:54px;">Cancel</a></div>' +
            '</div>');

    $('#player-buy-button').find("a").html("Cancel");

    if (!(($('#toc').is(":visible")))) {
        $('#toc').show();
    }
}

show_payment_options = function() {
    $('#toc').show();
    $('#video-information-in').show();
}

offLoadToc = function() {
    $('#toc').hide();
    $('#video-information-in').hide();
}

function LoadHTMLPlayer(poster, video, title, buy) {
    var player = '';
    var container_width = $('.container .row-fluid').width();
    var disp_height = (container_width * 56.6 / 100) + 35;
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
            player = player + '<video id="vdo-player" class="projekktor" poster="' + poster + '" title="' + title + '" width="' + disp_width + '" height="' + disp_height + '" controls allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" preload="true">';
        }
    } else {
        player = player + '<video id="vdo-player" class="projekktor" poster="' + poster + '" title="' + title + '" width="' + disp_width + '" height="' + disp_height + '" controls allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" preload="true">';
    }


    if (!(ua.indexOf("msie") > -1))
        player = player + '<source src="' + video + '" type="video/mp4" /></video>';
    else
        player = player + '<source src="' + video + '" type="video/mp4" codecs="avc1.42E01E,mp4a.40.2"/></video>';
    $('#player-loading').hide();
    $('#html-player').html(player);

    if (ua.indexOf("firefox") > -1){
            var controlsTemplate = '<div class="play-bar-wrap"><div class="play-bar-wraper"><div %{scrubber}><div %{loaded}></div><div %{playhead}></div><div %{scrubberdrag}></div></div></div></div><div class="control-wraper clearfix"><ul class="play fl"><li><a href="#" onclick="return false;"><div id="playButton" onclick="playBtn();" %{play}></div><div id="pauseButton" onclick="pauseBtn();" %{pause}></div></a></li><li id="vBar"><span class="ppmute" id="vmute" onclick="vToggle(1);" onmouseover="dispVolMute();" onmouseout="hideVolTip();"></span><span onclick="vToggle(2);" style="display:none" id="vmax" class="ppvmax" onmouseover="dispVolTip();" onmouseout="hideVolTip();"></span><span style="display:none" id="volTip"><ul><li><a id="volText" href="#">Mute</a></li></ul></span></li></ul><div class="left-section clearfix"><ul class="link icos fl"><li></li><li><span class="btnabout" id="aboutBtn" onclick="btnAbout();">About</span></li></ul></div><div class="right-section clearfix"><ul class="link icos fl"><li><div %{timeleft}>%{hr_elp}<span class="hr_colon">:</span>%{min_elp}:%{sec_elp} <span class="grey">/ %{hr_dur}<span class="hr_colon">:</span>%{min_dur}:%{sec_dur}</span></div></li><li><div %{fsexit}></div><div %{fsenter}  onmouseover="dispFscr();" onmouseout="hideFscr();"></div></li><li id="fscrWrapper"><span style="display:none" id="fscr" onmouseover="dispFscr();" onmouseout="hideFscr();"><ul><li><a href="#" id="fscrTip" >View Full Screen</a></li></ul></span></li><li id="hdWrapper"><a href="#" ><span id="hdsdswitch" class="hdsd" onmouseover="dispHdSd();" onmouseout="hideHdSd();"></span></a><span style="display:none" id="hdSpanBar" onmouseover="dispHdSd();" onmouseout="hideHdSd();"><ul><li><a href="#" id="hdplug" onclick="hdswitch();">HD</a></li><li><a id="sdplug" href="#" onclick="sdswitch();">SD</a></li></ul></span></li></ul><div class="player-logo"><span class="logo"><span style="display:none" id="lcTip" onmouseover="dispLcTip();" onmouseout="hideLcTip();"><ul><li><a href="#">Watch on LittleCast</a></li></ul></span></div>';
        }
        else{
            var controlsTemplate = '<div class="play-bar-wrap"><div class="play-bar-wraper"><div %{scrubber}><div %{loaded}></div><div %{playhead}></div><div %{scrubberdrag}></div></div></div></div><div class="control-wraper clearfix"><ul class="play fl"><li><a href="#" onclick="return false;"><div %{play}></div><div %{pause}></div></a></li><li id="vBar"><span class="ppmute" id="vmute" onclick="vToggle(1);" onmouseover="dispVolMute();" onmouseout="hideVolTip();"></span><span onclick="vToggle(2);" style="display:none" id="vmax" class="ppvmax" onmouseover="dispVolTip();" onmouseout="hideVolTip();"></span><span style="display:none" id="volTip"><ul><li><a id="volText" href="#">Mute</a></li></ul></span></li></ul><div class="left-section clearfix"><ul class="link icos fl"><li></li><li><span class="btnabout" id="aboutBtn" onclick="btnAbout();">About</span></li></ul></div><div class="right-section clearfix"><ul class="link icos fl"><li><div %{timeleft}>%{hr_elp}<span class="hr_colon">:</span>%{min_elp}:%{sec_elp} <span class="grey">/ %{hr_dur}<span class="hr_colon">:</span>%{min_dur}:%{sec_dur}</span></div></li><li><div %{fsexit}></div><div %{fsenter}  onmouseover="dispFscr();" onmouseout="hideFscr();"></div></li><li id="fscrWrapper"><span style="display:none" id="fscr" onmouseover="dispFscr();" onmouseout="hideFscr();"><ul><li><a href="#" id="fscrTip" >View Full Screen</a></li></ul></span></li><li id="hdWrapper"><a href="#" ><span id="hdsdswitch" class="hdsd" onmouseover="dispHdSd();" onmouseout="hideHdSd();"></span></a><span style="display:none" id="hdSpanBar" onmouseover="dispHdSd();" onmouseout="hideHdSd();"><ul><li><a href="#" id="hdplug" onclick="hdswitch();">HD</a></li><li><a id="sdplug" href="#" onclick="sdswitch();">SD</a></li></ul></span></li></ul><div class="player-logo"><span class="logo"></span><span style="display:none" id="lcTip" onmouseover="dispLcTip();" onmouseout="hideLcTip();"><ul><li><a href="#">Watch on LittleCast</a></li></ul></span></div>';
        }

    if (buy == true) {
        controlsTemplate = controlsTemplate + '<div class="button" id="player-buy-button" style="width:74px;"><a href="#" onclick="startTOC(); track_buy_google_analytic(); ">Buy Now</a></div>';
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
            plugin_controlbar: {
                controlsDisableFade: false,
                showOnStart: true,
                showOnIdle: true,
                controlsTemplate: controlsTemplate
            }
        }, function() {
            if (IS_PREVIEW && !(/Android|ipad|iPhone/i.test(navigator.userAgent))) {
                PaidProjekktorReadyCallBack(IS_PREVIEW)
            }
            if( !IS_PREVIEW ){
                $('#previewBtn').hide();
                $('#aboutBtn').hide();
            }

        });

    } else {
        projekktor('#vdo-player', {
            playerFlashMP4: PAY_SERVER + "/assets/StrobeMediaPlayback.swf",
            playerFlashMP3: PAY_SERVER + "/assets/StrobeMediaPlayback.swf",
            enableFullscreen: true,
            enableKeyboard: true,
            debug: false,
            imageScaling: 'fixed',
            videoScaling: 'aspectratio',
            plugin_controlbar: {
                controlsDisableFade: true,
                showOnStart: true,
                showOnIdle: true,
                controlsTemplate: controlsTemplate
            }
        }, function() {
            hideRuntime();
            if (IS_PREVIEW && !(/Android|ipad|iPhone/i.test(navigator.userAgent))) {
                PaidProjekktorReadyCallBack(IS_PREVIEW)
            }
            if( !IS_PREVIEW ){
                $('#previewBtn').hide();
                $('#aboutBtn').hide();
            }
         });
    }
}
PaidProjekktorReadyCallBack = function(isPreview) {

    ProjThumb = $('#vdo-player_media').html()
    ProjThumbSrc = $('#vdo-player_media img').attr('src');
    console.log(ProjThumbSrc)
    projekktor('#vdo-player').setPlay();
    projekktor('#vdo-player').setPause();
    if (!BUFFERED)
        setTimeout(function() {
            PAIDhideProjekktorStuff(isPreview)
        }, 1000);

    if( isPreview){ 
        $('#hdsdswitch').hide();
        $('#fscreenCtrl').hide();
        $('#hdWrapper').hide();
        $('#fscrWrapper').hide();


        $('#notifyExpiry').hide();
        $('#notifyExpiry').html('');

        //INSERT CHECKOUT WITH PAYPAL SCREEN
/*         if (!emailPrev) {
            loadPaymentDiv();
        } else
            $('#paymentDiv').hide();

        if (AutoPlay == true)
            projekktor('#vdo-player').setStop();*/

        if (TOS) {
            $('#toc').show();
            $('#paymentDiv').html('');
            $('#paymentDiv').hide();
        }
        $('#video-information-in').show();
        $("#about-video-in").attr('style', "display:none");
        $("#video-category").show();
        

        projekktor('#vdo-player').addListener('state', displayInfo);
        projekktor('#vdo-player').addListener('time', timeListener);

        // projekktor('#vdo-player').addListener('start', videoStarted);
        // projekktor('#vdo-player').addListener('buffer', bufferListener);

        $('#vBar').hide();
        //12 APRIL FIX LIT 997
        if (!TOS) {
            $('#video-information-in').hide();
            $("#about-video-in").attr('style', "display:none");
        }
        $('#player-buy-button').show();

    }
}
PAIDhideProjekktorStuff = function(isPreview) {

    $('.ppstart').removeClass('inactive')
    $('.ppstart').addClass('active')
    $('#thumbContainer').html(ProjThumb);
    $('.thumbContainer').html(ProjThumb);
    $('#vdo-player_media_html').attr('poster', ProjThumbSrc);
    $('#video-information-in').show();
    $("#about-video-in").attr('style', "display:none");

    if( BROWSER.browser == 'FF' ){
        $('#thumbContainer').show();
        $('#thumbContainer img').show();
        $('.thumbContainer').show();
        $('.thumbContainer img').show();
    }else{
        $('#thumbContainer').hide();
    }


    if (isPreview) {
        $('#previewBtn').show();
        $('#aboutBtn').show();
    }
    $('.ppcontrols').removeClass('inactive')
    $('.ppcontrols').addClass('active')

    $('.pppause').removeClass('active')
    $('.pppause').addClass('inactive')
    $('.ppplay').removeClass('inactive')
    $('.ppplay').addClass('active')

    $('.ppbuffering').removeClass('active')
    $('.ppbuffering').addClass('inactive')
    $('#vdo-player_media_image').show();
    BUFFERED = true; // SET BUFFER = false in watch-desltop
    $('.ppbuffering').hide();
}


function playBtn() {
    projekktor('#vdo-player').setPlay();
    
    $('.ppstart').removeClass('active');
    $('.ppstart').addClass('inactive');

    $('#playButton').removeClass('active');
    $('#playButton').addClass('inactive');
    $('#pauseButton').removeClass('inactive');
    $('#pauseButton').addClass('active');
    $('#thumbContainer').hide();
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
    DataCall("id=1&device=FBApp", SERVER_URL + VIDEOS + VIDEO_ID + "/" + VIDEO_INFORMATION, "GET", LC_USER.id == 0 ? false : true,

        function(data) {
            try {
                from_page_id = (getParameterByName('page_id') || getParameterByName('from_page_id'));
                from_page_name = (getParameterByName('page_name') || getParameterByName('publisher'));
                if (from_page_id) {
                    data.data.video.facebook_sharings.forEach(function(page) {
                        if (page.fb_sharing_details.page_id == from_page_id) {
                            from_page_name = page.fb_sharing_details.page_name;
                        }
                    });
                }
                var dmy = data.data.video.media_creation_date.substr(0, 10);
                var y = dmy.substr(0, 4);
                var m = dmy.substr(5, 2);
                var d = dmy.substr(8, 2);
                var month = getMonth(m);
                data.data.video.media_creation_date_formated = month + " " + d + ", " + y;
                /* Undersocre tempaltes*/
                try {
                    var template = _.template(document.getElementById('user-info').innerHTML);
                    $(document.getElementById('load-user')).html(template());
                    var template = _.template(document.getElementById('type-0').innerHTML);
                    $(document.getElementById('video-owner-info')).html(template(data));
                    var template = _.template(document.getElementById('likes-template').innerHTML);
                    $(document.getElementById('load-likes')).html(template(data));
                    var template = _.template(document.getElementById('comments-template').innerHTML);
                    $(document.getElementById('load-comments')).html(template(data));
                } catch (ex) {}

                if (data.data.is_video_owner || data.data.is_purchased) {
                    $('.desc-container').hide();
                    $('#toggle-desc').css('background-position', '0px -17px');
                } else {
                    $('#toggle-desc').addClass('desc-show');
                    $('#toggle-desc').css('background-position', '0px 0px');
                }
                $('#toggle-desc').show();

                $('#comment-error').hide();
                $('.share').socialLikes();

                if (typeof gapi != 'undefined' && typeof gapi.plus != 'undefined')
                    gapi.plus.go('.g-plus');

                setTimeout(function() {
                    ! function(d, s, id) {
                        var js, fjs = d.getElementsByTagName(s)[0];
                        if (!d.getElementById(id)) {
                            js = d.createElement(s);
                            js.id = id;
                            js.src = "https://platform.twitter.com/widgets.js";
                            fjs.parentNode.insertBefore(js, fjs);
                        }
                    }(document, "script", "twitter-wjs");
                }, 1500);


                setTimeout(function() {
                    if (window.location.hash == '#description') {
                        scrollTo(400)
                    }
                }, 2000);
                VIDEO = data.data.video;
                PUBLISHER = data.data.video.user;

                $('#video-main-title').html(VIDEO.title);
                $("#video-title-in").html(VIDEO.title);

                if (VIDEO.description.length > 750) {
                    $('#video-caption-in').html(VIDEO.description.substring(0, 750) + "..." + "<a id='description_anchor' href='javascript:;' onclick=\"#description\" >More</a>");
                } else {
                    $('#video-caption-in').html(VIDEO.description)
                }

                var dmy = VIDEO.media_creation_date.substr(0, 10);
                var y = dmy.substr(0, 4);
                var m = dmy.substr(5, 2);
                var d = dmy.substr(8, 2);
                var month = getMonth(m);
                pubName = from_page_name;
                if (pubName == "") {
                    $('#publisher-name').html("<a href='https://www.facebook.com/" + PUBLISHER.uid + "' target='_blank'>" + PUBLISHER.first_name + " " + PUBLISHER.last_name + "</a>");
                    $("#publisher-name-in").html("<a style='color:#FFFFFF;' href='https://www.facebook.com/" + PUBLISHER.uid + "' target='_blank'>" + PUBLISHER.first_name + " " + PUBLISHER.last_name + "</a>");
                } else {
                    var pageLink = getParameterByName('page_id') != '' ? getParameterByName('page_id') : getParameterByName('from_page_id');

                    $('#publisher-name').html("<a href='https://www.facebook.com/" + pageLink + "' target='_blank'>" + pubName + "</a>");
                    $("#publisher-name-in").html("<a style='color:#FFFFFF;' href='https://www.facebook.com/" + pageLink + "' target='_blank'>" + pubName + "</a>");
                }
                $("#video-category").html(VIDEO.category_name);
                $("#video-category").show();
                if (VIDEO.preview.total_previews_all < 1) {
                    $('#views-count-in').html('<br/>');
                    $('#views-count-in').removeClass();
                    $('#views-count-in').attr("class", "clear");
                } else
                    $('#views-count-in').html(VIDEO.preview.total_previews_all);

                if (VIDEO.total_sold < 1) {
                    $('#sold-count-in').html('<br/>');
                    $('#sold-count-in').removeClass();
                    $('#sold-count-in').attr("class", "no-solds");
                } else
                    $('#sold-count-in').html(VIDEO.total_sold);

                $('#video-price-in').html('$' + VIDEO.price);

                if (TOS) {

                    $('#video-information-in').hide();
                    $("#about-video-in").attr('style', "display:none");
                    $('#toc').hide();

                    $('#video-information-in').show();
                    loadToc();
                }
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
                if (like_video == "like") {
                    deleteCookie("like_video");
                    $('#video-like').click();
                }

                if (DEBUG)
                    console.log(preview);

                var thumbCtr = 0;
                var foundIndex = 0;
                var max_thumb_width = getWidthFromDimension(VIDEO.thumbnails[0]['dimension']); // getting first index thumbnail widht
                var thumb_width = 0;
                var max_width_thumb_index = 0;

                while (thumbCtr < VIDEO.thumbnails.length) {
                    thumb_width = getWidthFromDimension(VIDEO.thumbnails[thumbCtr]['dimension']); // temp
                    if (thumb_width > max_thumb_width) {
                        max_thumb_width = thumb_width;
                        max_width_thumb_index = thumbCtr;
                    }
                    if (VIDEO.thumbnails[thumbCtr].thumbnail_signed_path.indexOf("TIMELINE_PLAYER_1280x720") != -1) {
                        foundIndex = thumbCtr;
                        break;
                    } else
                        thumbCtr++;
                } //thumbnails[foundIndex]

                /*
                checking if the 1280*720 is not founded in the array
            */
            if( foundIndex == 0 ){
                thumbLinkPath =VIDEO.thumbnails[max_width_thumb_index].thumbnail_signed_path;
            }else{
                thumbLinkPath =VIDEO.thumbnails[foundIndex].thumbnail_signed_path;

            }
            
            if( data.data.is_paid || data.data.is_purchased || data.data.is_video_owner ){
                LoadHTMLPlayer(thumbLinkPath, preview, VIDEO.title, false);
                IS_PREVIEW = false;
            }else{
                IS_PREVIEW = true;
                LoadHTMLPlayer(thumbLinkPath, preview, VIDEO.title, true);

                if(getParameterByName("buy") == "invoke" && getParameterByName("showpreview") != "1"){

                    console.log("buy screen is invoked");

                    loadToc();
                    TOS=true;
                  }
                }
               
                if( !IS_PREVIEW ){
                StreamMedia(false,
                        function() {
                            if (getParameterByName('buy') == "invoke") {
                                if (BROWSER.browser != "FB") {
                                    projekktor('#vdo-player').setStop();
                                    projekktor('#vdo-player').setPause();
                                }
                            }
                        });
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


            try {
                $('#video-views').html(VIDEO.view_count);
            } catch (ex) {
                console.log(ex);
            }


        },

        function(data) {
            var json = jQuery.parseJSON(data.responseText);

            if (json.data.video.is_deleted) {
                setInterfaceForDeletedVideos();
            } else
                alert("Failed to load video. Refresh or try again later.");
        });

}

function stripeSuccess() {
    console.log("HERE!!");
    $('#spinner-img').removeClass('loader');
    var count = $('#sold-count-in').html();
    var newCount = (parseInt(count, 10)) + 1;
    $('#sold-count-in').html(newCount);
    playReq = false;
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

function showPaySuccess() {

    $('#thumbCtrPlay').hide();
    $('#thumbCtrPlay').remove();

    if (social_sharing && postId) {
        $('#prev-text-for-user').show();
        $('#prev-text-for-user').html('Purchase activity shared on Facebook and LittleCast - &nbsp;<a onclick="removePurchase();" href="#">Remove</a>');
        $('#paymentDiv').html('<div id="notifyExpiry" onclick="btnPlay();" style="cursor:pointer"><p class="buy-screen-text"></p><div class="pop-full1" style="display:block; cursor:pointer"><div class="top-space" style="cursor:pointer"><h2 class="tic" style="cursor:pointer">Thank you for your purchase!</h2></div></div><div class="purchase" style="cursor:pointer"><div class="watchOn" style="cursor:pointer"><h4 style="cursor:pointer"> Watch on the <br>Facebook LittleCast App</h4><img alt="" src="/fb_app/images/img-zoom.png" style="cursor:pointer"></div><h6 style="cursor:pointer">OR</h6><div class="mobilApps" style="cursor:pointer"><h4 style="cursor:pointer"> Watch on the <br> LittleCast Mobile Apps</h4><img alt="" src="/fb_app/images/app-store.png" style="cursor:pointer"></div><div class="btn-click" style="cursor:pointer"><a href="#"><img alt="" src="/fb_app/images/btn-click.png" style="cursor:pointer"></a> </div></div></div>');
    } else
        $('#paymentDiv').html('<div id="notifyExpiry" onclick="btnPlay();" style="cursor:pointer"><p class="buy-screen-text"></p><div class="pop-full1" style="display:block; cursor:pointer"><div class="top-space" style="cursor:pointer"><h2 class="tic" style="cursor:pointer">Thank you for your purchase!</h2></div></div><div class="purchase" style="cursor:pointer"><div class="watchOn" style="cursor:pointer"><h4 style="cursor:pointer"> Watch on the <br>Facebook LittleCast App</h4><img alt="" src="/fb_app/images/img-zoom.png" style="cursor:pointer"></div><h6 style="cursor:pointer">OR</h6><div class="mobilApps" style="cursor:pointer"><h4 style="cursor:pointer"> Watch on the <br> LittleCast Mobile Apps</h4><img alt="" src="/fb_app/images/app-store.png" style="cursor:pointer"></div><div class="btn-click" style="cursor:pointer"><a href="#"><img alt="" src="/fb_app/images/btn-click.png" style="cursor:pointer"></a> </div></div></div>');
    //$('#paymentDiv').html('<div id="notifyExpiry"><p class="buy-screen-text"></p><div class="pop-full1" style="display:block;"><div class="top-space"><h2 class="tic">Thank you for your purchase!</h2></div></div><div class="purchase"><div class="watchOn"><h4> Watch on the <br>Facebook LittleCast App</h4><img alt="" src="/fb_app/images/img-zoom.png"></div><h6>OR</h6><div class="mobilApps"><h4> Watch on the <br> Facebook LittleCast App</h4><img alt="" src="/fb_app/images/app-store.png"></div><div class="btn-click"><a href="#"><img alt="" src="/fb_app/images/btn-click.png"></a> </div></div></div>');
    setTimeout( function(){
        playBoughtVid(false);
    }, 1000);
    
    FB.Canvas.setAutoGrow(100);
    $("body").css("overflow", "hidden");
    //$('#dispPlayBtn').show();
}

function removePurchase() {
    deletePreview();
    $('#prev-text-for-user').hide();
    $('#prev-text-for-user').remove();
    //playBoughtVid();
    //$('#paymentDiv').html('');
    //$('#paymentDiv').hide();
    //projekktor('#vdo-player').setStop();
}

function stripeFail() {
    $('#spinner-img').removeClass('loader');
    $('.submit-button').prop('disabled', false);
    //$("#payment-form").hide();
    $("#toc").hide();
    $('#video-price-in').show();
    $("#video-category").show();

    $('#player-buy-button').find("a").html("Buy Now");
}

function showPrevText() {
    if (social_sharing && postId)
        $('#prev-text-for-user').show();
}

function sendPreviewCall() {
    try {
        var a = projekktor('#vdo-player').getDuration();

        if (a >= 10 && (!videoLengthLegal)) {
            videoLengthLegal = true;
        }
    } catch (ex) {}

    if (!prevCallSent) {
        if ((videoLengthLegal) && (!(previewFlag))) {
            DataCall("device=FBApp" + "&log_fb_activity=true&log_preview=false", SERVER + VIDEOS + VIDEO_ID + PREVIEWED, "GET", true,
                function(data) {
                    if (DEBUG)
                        console.log("Registered Success");
                    activityId = data.data.activity_id;
                    postId = data.data.post_id;
                    social_sharing = data.data.is_social_on;

                    if (DEBUG)
                        console.log("activity_id: " + activityId + " postid:" + postId);

                    showPrevText();
                },
                function(data) {
                    if (DEBUG)
                        console.log("Unregistered preview");
                });
            previewFlag = true;
            clearInterval(intervalID);
        }
    }
    if ((projekktor('#vdo-player').getPosition() >= 10) && (!(previewFlag))) {

        DataCall("device=FBApp" + "&log_fb_activity=true&log_preview=false", SERVER + VIDEOS + VIDEO_ID + PREVIEWED, "GET", true,
            function(data) {
                if (DEBUG)
                    console.log("Registered Success");
                activityId = data.data.activity_id;
                postId = data.data.post_id;
                social_sharing = data.data.is_social_on;

                if (DEBUG)
                    console.log("activity_id: " + activityId + " postid:" + postId);

                showPrevText();
            },
            function(data) {
                if (DEBUG)
                    console.log("Unregistered preview");
            });
        previewFlag = true;
        clearInterval(intervalID);
    }
}
var displayInfo = function(state) {
    console.log( state );
    switch (state) {
        case 'STARTING':
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf("firefox") > -1) {
                $('#playButton').removeClass('active');
                $('#playButton').addClass('inactive');
                $('#pauseButton').removeClass('inactive');
                $('#pauseButton').addClass('active');
                $('#video-information-in').hide('slow');
                $('#previewBtn').hide();
                $('#aboutBtn').hide();
                $('#vBar').show();
                $('#fscrWrapper').show();
                $('#fscreenCtrl').show();
            }
            

            break;
        case 'PLAYING':

            if ($('#thumbContainer').is(":visible")) {
                $('#thumbContainer').hide();
            }

            if(!playEventLog && playReq){
                ga('send', 'event', 'PaidVideo', 'Video Play', VIDEO_ID + ':' + $("#video-title-in").html());
                playEventLog = true;
            }

            if (!playReq) {
                intervalID = window.setInterval(sendPreviewCall, 2000);
                playReq = true;
            }
            if( BUFFERED ){
                $('#video-information-in').hide('slow');
                $('#about-video-in').hide('slow');
                $('.pop-full').hide('slow');
                $('#previewBtn').hide();
                $('#aboutBtn').hide();
                $('#vBar').show();
                $('#fscrWrapper').show();
                $('#fscreenCtrl').show();
            }
            break;
        case 'COMPLETED':
            ga('send', 'event', 'PaidVideo', 'Finished Video', VIDEO_ID + ':' + $("#video-title-in").html());
            playing_status = false;
            playEventLog   = false;
        case 'STOPPED':
            if (!(previewFlag))
                prevCallSent = false;
            startTOC();
            // $('#video-information-in').show();
            // $("#about-video-in").attr('style', "display:none");
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
            if(ua.indexOf("firefox") > -1)
                {
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

var recStrem = function(state) {
    console.log( state + '  recStrem' );
    switch (state) {
        case 'STARTING':
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf("firefox") > -1) {
                $('#playButton').removeClass('active');
                $('#playButton').addClass('inactive');
                $('#pauseButton').removeClass('inactive');
                $('#pauseButton').addClass('active');
            }
            break;
        case 'PLAYING':
            if( BUFFERED ){
                $('#video-information-in').hide('slow');
                $('#about-video-in').hide('slow');
                $('.pop-full').hide('slow');
            }
            if ($('#thumbContainer').is(":visible")) {
                $('#thumbContainer').hide();
            }
            if(!playEventLog && playReq){
                ga('send', 'event', 'PaidVideo', 'Video Play', VIDEO_ID + ':' + $("#video-title-in").html());
                playEventLog = true;
            }
            playReq = true;
            if (playing_status == false){
                setTimeout(function(){},3000);
                playing_status = true;
            }
            break;
        case 'STOPPED':
        case 'COMPLETED':
            if (!($('#thumbContainer').is(":visible"))) {
                $('#thumbContainer').show();
            }
            var ua = navigator.userAgent.toLowerCase();
            if(ua.indexOf("firefox") > -1)
                {
                    $('#playButton').removeClass('inactive');
                    $('#playButton').addClass('active');
                    $('#pauseButton').removeClass('active');
                    $('#pauseButton').addClass('inactive');
                }
            ga('send', 'event', 'PaidVideo', 'Finished Video', VIDEO_ID + ':' + $("#video-title-in").html());
            playing_status = false
            playEventLog = false;
            break;
    }
}

    function StreamMedia(AutoPlay, purchased,  Failure) {
        if( typeof purchased == 'undefined'){
            purchased = false;
        }
        DataCall("device=FBApp", SERVER + VIDEOS + VIDEO_ID + "/" + STREAM_REQUEST, "GET", true,

            function(data) {
                if (data.success == true) {

                    if (DEBUG)
                        console.log("Bought");
                    if( !purchased ){
                        $('#paymentDiv').html('');
                        $('#paymentDiv').hide();
                        $('#paymentDiv').remove();

                        $('#notifyExpiry').html('');
                        $('#notifyExpiry').hide();
                        $('#notifyExpiry').remove();
                    }

                    HD = data.data.video._720p;
                    SD = data.data.video._480p;
                    if (HD != null && SD != null) {
                        currentRES = "HD";
                        var video_to_play = {
                            0: {
                                src: data.data.video._720p,
                                type: 'video/mp4'
                            }
                        };
                        $('#hdplug').html('-HD');
                        $('#sdplug').html('SD');
                    } else {
                        alert('HD or SD are under proccess. You are viewing this video in 320P');
                        var video_to_play = {
                            0: {
                                src: data.data.video._320p,
                                type: 'video/mp4'
                            }
                        };
                        $('#hdplug').html('HD');
                        $('#sdplug').html('-SD');
                    }
                    if( !purchased ){
                        ('#toc').hide();                    
                        if (navigator.userAgent.indexOf('iPhone') != -1)
                            projekktor('#vdo-player').setPlay();
                        else
                            projekktor('#vdo-player').setStop();
                    }

                    projekktor('#vdo-player').setItem(video_to_play, 0, true);
                    projekktor('#vdo-player').config._playlist = video_to_play;

                    if (AutoPlay == true) {
                        projekktor('#vdo-player').setPlay();
                        if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
                            if (!playReq) {
                                DataCall("device=FBApp&request_type=stream_request", SERVER + VIDEOS + VIDEO_ID + UPDATE_STREAM, "POST", true,
                                    function() {
                                        if (DEBUG)
                                            console.log("Stream Success");
                                    }, function() {
                                        if (DEBUG)
                                            console.log("STREAM REQUEST FAIL");
                                    });
                                playReq = true;
                            }
                        }
                    } else{
                        if( !purchased)
                            projekktor('#vdo-player').setStop();
                    }

                    //REMOVE EVENT LISTENERS HERE
                    projekktor('#vdo-player').removeListener('state', displayInfo);
                    projekktor('#vdo-player').removeListener('time', timeListener);
                    projekktor('#vdo-player').addListener('time', streamTimeListener);
                    projekktor('#vdo-player').addListener('state', recStrem);

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
                    $('#player-buy-button').hide();
                    $('#video-price-in').hide();
                    $("#video-category").show();
                    IS_PREVIEW = false;
                    if( ProjThumb == '' ){
                        ProjThumb = $('#vdo-player_media').html();
                        ProjThumbSrc = $('#vdo-player_media img').attr('src');
                    }
                    projekktor('#vdo-player').setPlay();
                    projekktor('#vdo-player').setPause();
                    setTimeout( function(){
                        $('#vdo-player_media_html').attr('poster', ProjThumbSrc);
                        $('.ppbuffering').removeClass('active')
                        $('.ppbuffering').addClass('inactive')
                    }, 500);
                    if (!BUFFERED)
                        setTimeout(function() {
                            PAIDhideProjekktorStuff(false);
                        }, 1000);
                    loadThumb();
                }
            },

            function(data) {

                var preview = '';
                try {
                    if (VIDEO.processed_preview_information)
                        preview = VIDEO.processed_preview_information[0].signed_processed_keys;
                } catch (ex) {

                }
                if (DEBUG) {
                    console.log("Preview");
                    console.log(preview);
                }


                $('#notifyExpiry').hide();
                $('#notifyExpiry').html('');

                //INSERT CHECKOUT WITH PAYPAL SCREEN
                if (!emailPrev) {
                    loadPaymentDiv();
                } else
                    $('#paymentDiv').hide();

                if (AutoPlay == true)
                    projekktor('#vdo-player').setStop();

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

                projekktor('#vdo-player').addListener('state', displayInfo);

                projekktor('#vdo-player').addListener('time', timeListener);

                // projekktor('#vdo-player').addListener('start', videoStarted);
                // projekktor('#vdo-player').addListener('buffer', bufferListener);

                $('#vBar').hide();
                //12 APRIL FIX LIT 997
                if (!TOS) {
                    $('#video-information-in').hide();
                    $("#about-video-in").attr('style', "display:none");
                }
                $('#player-buy-button').show();

                loadThumb();
                Failure();
            });
        //UserAccess ();
    }

    // function bufferListener(st){
    //     if( st == 'FULL'){
    //         $('#player_buffer').fadeOut(500);
    //     }
    // }
    // function videoStarted(){
    //     $('#player_buffer').show();
    // }


    function loadPaymentDiv() {
        loadToc();

        // $('#paymentDiv').attr('style',"display:block;height:100%;");
        // $('#paymentDiv').html('<div class="pop-full" id="paymentScreen" style="display:block;height:100%">' +
        //         '<div>' +
        //             '<a href="#" onclick="fbpay();"><img src="../fb_app/images/pay-with-facebook.png"></a>' +
        //             '<a href="#" onclick="paypal_payment();"><img src="/assets/pay-with-paypal.png"></a>' +
        //             '<br/>' +
        //             '<a href="#" style="color: red; margin: 0px;" onclick="endPayScreen();">Cancel</a>' +
        //         '</div>' +
        //     '</div>');
    }

paypal_payment = function() {
    if (!$('#iAgree').is(":checked")) {
        $('#error-text').html("You must agree to the terms and conditions first.")
        return;
    }

    $('#error-text').html("");

    if (LC_USER.id == 0) {
        reLogin();
        return;
    }

    checkDeleteStatus();
    if (DELETED)
        return;

    ga('send', 'event', 'PaidVideo', 'Payment Select - PayPal', VIDEO_ID + ':' + $("#video-title-in").html());
    $('#paypal_submit').click();
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
            function() {
                if (DEBUG)
                    console.log("success!!");
            },
            function() {
                if (DEBUG)
                    console.log("failed");
            });
    }
}

function removePreviewAct() {
    deletePreview();
    //$('#prev-text-for-user').html('Removed from your timeline &nbsp;<a href="#" onclick="addPreviewAct();">CLICK TO ADD</a>');
    $('#prev-text-for-user').html('Watch activity removed from Facebook and LittleCast &nbsp;<a href="#" onclick="addPreviewAct();">X</a>');
}

function addPreviewAct() {
    //addPreview();
    //$('#prev-text-for-user').html('Added to your timeline &nbsp;<a href="#" onclick="removePreviewAct();">CLICK TO REMOVE</a>');
    $('#prev-text-for-user').hide();
    $('#prev-text-for-user').remove();
}

$(".projekktor, #thumbContainer").live('mouseover', function(){
    $(".ppcontrols").fadeIn(500);
})

var streamTimeListener = function(value) {
    logStreamView(value);
}

function logStreamView( time ){

    if( !STREAM_CALL_SENT && time > 9 ){
        DataCall("device=FBApp&request_type=stream_request", SERVER + VIDEOS + VIDEO_ID + UPDATE_STREAM, "POST", true,

            function() {

                if (DEBUG)
                    console.log("Stream Success");
            },

            function() {

                if (DEBUG)
                    console.log("STREAM REQUEST FAIL");
            });
        STREAM_CALL_SENT  = true ;
        ga('send', 'event', 'PaidVideo', 'Video View', VIDEO_ID + ':' + $("#video-title-in").html());
    }
}

var track_buy_google_analytic = function() {
    ga('send', 'event', 'PaidVideo', 'Buy Now', VIDEO_ID + ':' + $("#video-title-in").html());
}