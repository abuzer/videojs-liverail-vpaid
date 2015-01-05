var HD = '';
var SD = '';
var currentRES = '';
var TOS = false;
var emailPrev = false;
var playReq = false;
var aboutDisp= false;
var DEBUG = true;
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
VIEW_CALL_SENT = false;
var playing_status = false;
BUFFERED = false;
playEventLog = false;

// abuzer
window.onresize = function(event)
{
    if($('#thumbContainer').is(":visible"))
    {
        var wt = $('#vdo-player_media').width();
        if ($('#thumbPic').width() > wt)
        {
            thumbWidth = $('#thumbPic').width();
            $('#thumbPic').attr('width','100%')
        }

        if(thumbWidth != 0 && thumbWidth < wt )
        {
            var attr = $('#thumbPic').attr('width');
            if(typeof attr != 'undefined' && attr != false)
                {
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

function playFromThumb()
{
    if($('#thumbContainer').is(":visible"))
    {
        $('#thumbContainer').hide();
        projekktor('#vdo-player').setPlay();
    }
}
function loadThumb()
{
    return '';
}
function addEventListeners() {

}

function watchFunction() {


    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){
    var ieversion=new Number(RegExp.$1)
        if (ieversion<=8)
        {
            alert("This website is best viewed on Internet Explorer version 9 or above. Please upgrade to a latest version or try using latest Chrome/Firefox");
        }
        else
        {
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
    else
    {
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

        $('#vdo-player').attr('style', 'max-width:'+disp_width+'px; height: ' + disp_height + 'px;');
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
    if(DEBUG)
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
            $("#video-player").attr("style", "height:"+screen.height+ "px;width:"+screen.width+"px;");
            $('#vdo-player').attr('style', 'max-width:'+screen.width+'px !important; height:'+screen.height+'px; width:'+screen.width+'px !important;');
            $('#vdo-player_media_html').attr('style', 'position: absolute;');
            $('#vdo-player_media').attr('style', 'max-width: 100%; height:'+screen.height+'px; width:'+screen.width+' px !important;');
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
}
function LoadHTMLPlayer(poster, video, title, buy) {
    var player = '';
    var container_width =  $('.container .row-fluid').width() ;
    var disp_height = (container_width * 56.6 / 100 )+35;
    var disp_height = '100%';
    var disp_width = '100%';
    PLAYER_HEIGHT = disp_height;
    PLAYER_WIDTH = disp_width
    if(DEBUG)
        console.log("HEIGHT:" + disp_height);

    $("#video-player").attr("style", "height:"+disp_height+ "px;width:"+disp_width+"px;");
    var ua = navigator.userAgent.toLowerCase();
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){
        var ieversion=new Number(RegExp.$1)
        if (ieversion>=9)
        {
            player = player + '<video id="vdo-player" class="projekktor" poster="' + poster + '" title="' + title + '" width="'+disp_width+'" height="' + disp_height + '" controls allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true">';
        }
    }else
    {
        player = player + '<video id="vdo-player" class="projekktor" poster="' + poster + '" title="' + title + '" width="'+disp_width+'" height="' + disp_height + '" controls allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true">';
    }


    if (!(ua.indexOf("msie") > -1))
        player = player + '<source src="' + video + '" type="video/mp4" /></video>';
    else
        player = player + '<source src="' + video + '" type="video/mp4" codecs="avc1.42E01E,mp4a.40.2"/></video>';
    $('#player-loading').hide();
    //$('#html-player').html(player);

    if (ua.indexOf("firefox") > -1){
            var controlsTemplate = '<div class="play-bar-wrap"><div class="play-bar-wraper"><div %{scrubber}><div %{loaded}></div><div %{playhead}></div><div %{scrubberdrag}></div></div></div></div><div class="control-wraper clearfix"><ul class="play fl"><li><a href="#" onclick="return false;"><div id="playButton" onclick="playBtn();" %{play}></div><div id="pauseButton" onclick="pauseBtn();" %{pause}></div></a></li><li id="vBar"><span class="ppmute" id="vmute" onclick="vToggle(1);" onmouseover="dispVolMute();" onmouseout="hideVolTip();"></span><span onclick="vToggle(2);" style="display:none" id="vmax" class="ppvmax" onmouseover="dispVolTip();" onmouseout="hideVolTip();"></span><span style="display:none" id="volTip"><ul><li><a id="volText" href="#">Mute</a></li></ul></span></li></ul><div class="left-section clearfix"><ul class="link icos fl"><li><span class="btnpreview" id="previewBtn" onclick="btnPreview();">Preview</span></li><li><span class="btnabout" id="aboutBtn" onclick="btnAbout();">About</span></li></ul></div><div class="right-section clearfix"><ul class="link icos fl"><li><div %{timeleft}>%{hr_elp}<span class="hr_colon">:</span>%{min_elp}:%{sec_elp} <span class="grey">/ %{hr_dur}<span class="hr_colon">:</span>%{min_dur}:%{sec_dur}</span></div></li><li><div %{fsexit}></div><div %{fsenter}  onmouseover="dispFscr();" onmouseout="hideFscr();"></div></li><li id="fscrWrapper"><span style="display:none" id="fscr" onmouseover="dispFscr();" onmouseout="hideFscr();"><ul><li><a href="#" id="fscrTip" >View Full Screen</a></li></ul></span></li><li id="hdWrapper"><a href="#" ><span id="hdsdswitch" class="hdsd" onmouseover="dispHdSd();" onmouseout="hideHdSd();"></span></a><span style="display:none" id="hdSpanBar" onmouseover="dispHdSd();" onmouseout="hideHdSd();"><ul><li><a href="#" id="hdplug" onclick="hdswitch();">HD</a></li><li><a id="sdplug" href="#" onclick="sdswitch();">SD</a></li></ul></span></li></ul><div class="player-logo"><span class="logo"><span style="display:none" id="lcTip" onmouseover="dispLcTip();" onmouseout="hideLcTip();"><ul><li><a href="#">Watch on LittleCast</a></li></ul></span></div>';
        }
        else{
            var controlsTemplate = '<div class="play-bar-wrap"><div class="play-bar-wraper"><div %{scrubber}><div %{loaded}></div><div %{playhead}></div><div %{scrubberdrag}></div></div></div></div><div class="control-wraper clearfix"><ul class="play fl"><li><a href="#" onclick="return false;"><div %{play}></div><div %{pause}></div></a></li><li id="vBar"><span class="ppmute" id="vmute" onclick="vToggle(1);" onmouseover="dispVolMute();" onmouseout="hideVolTip();"></span><span onclick="vToggle(2);" style="display:none" id="vmax" class="ppvmax" onmouseover="dispVolTip();" onmouseout="hideVolTip();"></span><span style="display:none" id="volTip"><ul><li><a id="volText" href="#">Mute</a></li></ul></span></li></ul><div class="left-section clearfix"><ul class="link icos fl"><li><span class="btnpreview" id="previewBtn" onclick="btnPreview();">Preview</span></li><li><span class="btnabout" id="aboutBtn" onclick="btnAbout();">About</span></li></ul></div><div class="right-section clearfix"><ul class="link icos fl"><li><div %{timeleft}>%{hr_elp}<span class="hr_colon">:</span>%{min_elp}:%{sec_elp} <span class="grey">/ %{hr_dur}<span class="hr_colon">:</span>%{min_dur}:%{sec_dur}</span></div></li><li><div %{fsexit}  onmouseover="dispFscr();" onmouseout="hideFscr();" ></div><div %{fsenter}></div></li><li id="fscrWrapper"><span style="display:none" id="fscr" onmouseover="dispFscr();" onmouseout="hideFscr();"><ul><li><a href="#" id="fscrTip" >View Full Screen</a></li></ul></span></li><li id="hdWrapper"><a href="#" ><span id="hdsdswitch" class="hdsd" onmouseover="dispHdSd();" onmouseout="hideHdSd();"></span></a><span style="display:none" id="hdSpanBar" onmouseover="dispHdSd();" onmouseout="hideHdSd();"><ul><li><a href="#" id="hdplug" onclick="hdswitch();">HD</a></li><li><a id="sdplug" href="#" onclick="sdswitch();">SD</a></li></ul></span></li></ul><div class="player-logo"><span class="logo"></span><span style="display:none" id="lcTip" onmouseover="dispLcTip();" onmouseout="hideLcTip();"><ul><li><a href="#">Watch on LittleCast</a></li></ul></span></div>';
        }

    controlsTemplate = controlsTemplate + '</div></div>';

    var PAY_SERVER = SERVER.substr(0,(SERVER.length-3));

        if (ua.indexOf("firefox") > -1){

                    projekktor('#vdo-player', {
                    playerFlashMP4: PAY_SERVER+"assets/StrobeMediaPlayback.swf",
                    playerFlashMP3: PAY_SERVER+"assets/StrobeMediaPlayback.swf",
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
                    if( !(/Android|ipad|iPhone/i.test(navigator.userAgent)) ){                    
                        hideRuntime();
                        projekktorReadyCallBack();
                    }
                    }

                  );

        }
        else{

                projekktor('#vdo-player', {
                    playerFlashMP4: PAY_SERVER+"assets/StrobeMediaPlayback.swf",
                    playerFlashMP3: PAY_SERVER+"assets/StrobeMediaPlayback.swf",
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
                    },
                    poster: poster,
                    width: disp_width,
                    height: disp_height,
                    playlist: [
                        {

                        0: {src:video , type: "video/mp4"},

                        }
                    ]    
                    },function(){ 
                        if( !(/Android|ipad|iPhone/i.test(navigator.userAgent)) ){
                            projekktorReadyCallBack()
                            hideRuntime();
                        }
                    }
                );
    }
}

function playBtn(){
    $('.ppstart').removeClass('active')
    $('.ppstart').addClass('inactive')
    $('#playButton').removeClass('active');
    $('#playButton').addClass('inactive');
    $('#pauseButton').removeClass('inactive');
    $('#pauseButton').addClass('active');
    $('#video-information-in').hide('slow');
    if($('#thumbContainer').is(":visible"))
    {
        $('#thumbContainer').hide();
    }
    projekktor('#vdo-player').setPlay();

}
function pauseBtn(){
    projekktor('#vdo-player').setPause();
    $('#playButton').removeClass('inactive');
    $('#playButton').addClass('active');
    $('#pauseButton').removeClass('active');
    $('#pauseButton').addClass('inactive');

    if($('#thumbContainer').is(":visible"))
    {
        $('#thumbContainer').hide();
    }
}

function getWidthFromDimension( dimension ){
    var dim =  dimension.split("x");
    return dim[0];
}

function VideoInformation(SuccessCallBack) {
    DataCall("id=1&device=FBApp", SITE_URL + MERCHANDISE_VIDEOS + VIDEO_ID + "/" + VIDEO_INFORMATION, "GET", LC_USER.id==0?false:true ,

    function (data) {
        try {
            from_page_id = getParameterByName('from_page_id');
            if(  from_page_id ){
                data.data.video.facebook_sharings.forEach( function( page ){
                    if( page.fb_posted_object_id ==  from_page_id){
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
            data.data.video.comments_count = data.data.video.recent_comments.length;

            var template = _.template(document.getElementById('type-0').innerHTML);
             $(document.getElementById('video-owner-info')).html(template(data));
            var template = _.template(document.getElementById('likes-template').innerHTML);
            $(document.getElementById('load-likes')).html(template(data));
            var template = _.template(document.getElementById('comments-template').innerHTML);
            $(document.getElementById('load-comments')).html(template(data));
            var template = _.template(document.getElementById('products-template').innerHTML);
            $(document.getElementById('products-container')).html(template(data));

            $('.share').socialLikes();

            if ( typeof gapi != 'undefined' && typeof gapi.plus != 'undefined' )
                gapi.plus.go('.g-plus');

            setTimeout(function () {
                !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
            }, 1500);

            VIDEO = data.data.video;


            VIDEO_OWNER = VIDEO.user;
            PUBLISHER = data.data.video.user;

            $('#video-main-title').html(VIDEO.title);
            //$("#video-title").html(VIDEO.title);
            $("#video-title-in").html(VIDEO.title);
            //$('#video-caption').html(VIDEO.description);

            if(VIDEO.description.length > 750){
                $('#video-caption-in').html(VIDEO.description.substring(0, 750) + "..." + "<a id='description_anchor' href='javascript:;' onclick=\"#description\" >More</a>");
            }
            else{
                $('#video-caption-in').html(VIDEO.description)
            }

            var dmy = VIDEO.media_creation_date.substr(0, 10);
            var y = dmy.substr(0, 4);
            var m = dmy.substr(5, 2);
            var d = dmy.substr(8, 2);
            var month = getMonth(m);

            var pubName = getParameterByName('page_name');
            if( from_page_id ) {
                pubName = from_page_name!=''?from_page_name:getParameterByName('publisher');
            }
            if (pubName==""){
                $('#publisher-name').html("<a href='https://www.facebook.com/"+PUBLISHER.uid+"' target='_blank'>"+PUBLISHER.first_name + " " + PUBLISHER.last_name+"</a>");
                $("#publisher-name-in").html("<a style='color:#FFFFFF;' href='https://www.facebook.com/"+PUBLISHER.uid+"' target='_blank'>"+PUBLISHER.first_name + " " + PUBLISHER.last_name+"</a>");
            }
            else{
                var pageLink = getParameterByName('from_page_id');
                $('#publisher-name').html("<a href='https://www.facebook.com/"+pageLink+"' target='_blank'>"+pubName+"</a>");
                $("#publisher-name-in").html("<a style='color:#FFFFFF;' href='https://www.facebook.com/"+pageLink+"' target='_blank'>"+pubName+"</a>");
            }
            $("#video-category").html(VIDEO.category_name);

            $("#video-category").show();
            if (VIDEO.view_count < 1) {
                $('#views-count-in').html('<br/>');
                $('#views-count-in').removeClass();
                $('#views-count-in').attr("class","clear");
            } else
                $('#views-count-in').html(VIDEO.view_count);

            $('#sold-count-in').removeClass();
            $('#sold-count-in').attr("class","no-solds");

            comment_text = getCookie("comment_text");
            if(comment_text != ""){
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

            preview = VIDEO.original_videos.hd.signed_processed_keys;
            console.log( preview );
            if(DEBUG)
                console.log(preview);
            var thumbCtr = 0;
            var foundIndex= 0;

            var thumb_width = 0;
            var max_width_thumb_index = 0;
            while(thumbCtr < VIDEO.thumbnails.length){

                if (VIDEO.thumbnails[thumbCtr].signed_processed_keys.indexOf("TIMELINE_PLAYER_1280x720")!=-1)
                {
                        foundIndex = thumbCtr;
                        break;
                }
                else
                    thumbCtr++;
            }
            if( foundIndex == 0 ){
                thumbLinkPath =VIDEO.thumbnails[max_width_thumb_index].signed_processed_keys;
            }else{
                thumbLinkPath =VIDEO.thumbnails[foundIndex].signed_processed_keys;

            }

            LoadHTMLPlayer(thumbLinkPath, preview, VIDEO.title, false);
            playFreeEmailFullVideo( data, false );
            $('#notifyExpiry').hide();
            $('#notifyExpiry').html('');
            $('#paymentDiv').hide();
            if (TOS){
                $('#toc').show();
                $('#paymentDiv').html('');
                $('#paymentDiv').hide();
            }
            $('#video-information-in').show();
            $("#about-video-in").attr('style', "display:none");
            $("#video-category").show();

            $('#vBar').hide();

            $('#player-buy-button').show();

            Failure();

                SuccessCallBack();
        } catch (ex) {
            if(DEBUG)
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
            if(DEBUG)
                console.log("Invalid DateTime Format. << Media Creation Date.");
        }
        //$('#video-views').html(VIDEO.view_count);
    },

    function (data) {
        var json = jQuery.parseJSON(data.responseText);
        if( typeof json.data.video.is_deleted != 'undefined')
        if(json.data.video.is_deleted)
        {
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

function showPrevText()
{
    if(social_sharing && postId)
        $('#prev-text-for-user').show();
}

function sendStreamCall()
{
    try
    {
        var a = projekktor('#vdo-player').getDuration();

        if(a>=10 && (!videoLengthLegal))
        {
            videoLengthLegal = true;
        }
    }catch(ex){}


    if ( (projekktor('#vdo-player').getPosition() >= 10) && (!(previewFlag)))
    {
        if(LC_USER.id) {

             DataCall("device=FBApp&request_type=stream_request&log_fb_activity=true&log_preview=false", SITE_URL + MERCHANDISE_VIDEOS + VIDEO_ID + MERCHANDISE_UPDATE_STREAM, "GET", true,
                function (data) {
                    if(DEBUG)
                        console.log("Registered Success");
                    activityId = data.data.activity_id;
                    postId = data.data.post_id;
                    social_sharing = data.data.is_social_on;
                    if(DEBUG)
                        console.log("activity_id: "+activityId+" postid:"+postId);

                    showPrevText();
                },
                function (data) {
                    if(DEBUG)
                        console.log("Unregistered preview");
                });
            previewFlag = true;
            clearInterval(intervalID);
        }
    }
}

var recStrem = function (state) {
    console.log( state );
    console.log( '----');
    switch (state) {
        case 'STARTING':
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf("firefox") > -1)
            {
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
                ga('send', 'event', 'ShopConnect', 'Video Play', VIDEO_ID + ':' + $("#video-title-in").html());
            }

            break;
        case 'PLAYING':
            if($('#thumbContainer').is(":visible"))
            {
                $('#thumbContainer').hide();
            }
            if( BUFFERED ){
                $('#aboutBtn').hide();
                $('#video-information-in').hide('slow');
                $('#about-video-in').hide('slow');
                $('.pop-full').hide('slow');
            }
            if(playReq && !playEventLog){
                ga('send', 'event', 'ShopConnect', 'Video Play', VIDEO_ID + ':' + $("#video-title-in").html());
                playEventLog = true;
            }
            if (!playReq)
            {
                intervalID = window.setInterval(sendStreamCall,2000);
                playReq = true;
            }


            if (playing_status == false){
                playing_status = true;
            }
            break;
        case 'STOPPED':
        case 'COMPLETED':
/*            if(!($('#thumbContainer').is(":visible")))
            {
                $('#thumbContainer').show();
            }
*/            $('#aboutBtn').show();
            var ua = navigator.userAgent.toLowerCase();
            if(ua.indexOf("firefox") > -1)
                {
                    $('#playButton').removeClass('inactive');
                    $('#playButton').addClass('active');
                    $('#pauseButton').removeClass('active');
                    $('#pauseButton').addClass('inactive');
                }
            ga('send', 'event', 'ShopConnect', 'Finished Video', VIDEO_ID + ':' + $("#video-title-in").html());
            playing_status = false
            playEventLog   = false;
            VIEW_CALL_SENT = false;
            break;
    }
}

function playFreeEmailFullVideo(data , AutoPlay ){
    HD =  data.data.video.original_videos.hd.signed_processed_keys ;
    SD =  data.data.video.original_videos.sd.signed_processed_keys ;
    if (HD != null && SD != null) {
        currentRES = "HD";
        var video_to_play = {
            0: {
                src: HD ,
                type: 'video/mp4'
            }
        };
        $('#hdplug').html('-HD');
        $('#sdplug').html('SD');
    } else {
        alert('HDP or SD are under proccess. You are viewing this video in 320P');
        var video_to_play = {
            0: {
                src: data.data.video.original_videos._320.signed_processed_keys,
                type: 'video/mp4'
            }
        };
        $('#hdplug').html('HD');
        $('#sdplug').html('-SD');
    }
    
    if (AutoPlay == true)
        projekktor('#vdo-player').setPlay();
    else
        projekktor('#vdo-player').setStop();

   // projekktor('#vdo-player').removeListener('state', displayInfo);
    projekktor('#vdo-player').addListener('time', logMerchantStream);
    projekktor('#vdo-player').addListener('state', recStrem);

    $('#paymentDiv').hide();
    $('#hdsdswitch').show();
    $('#fscreenCtrl').show();
    $('#hdWrapper').show();
    $('#fscrWrapper').show();

    $('#hdsdswitch').show();
    $('#vBar').show();
    $('#previewBtn').hide();
    $('#player-buy-button').hide();
    $('#video-information-in').hide();
    $('#about-video-in').hide();
    $('#player-buy-button').hide();
    $('#video-price-in').hide();
    $("#video-category").show();
}

function confirmPreviewPost()
{
    $('#paymentDiv').show();
    $('#paymentDiv').html('');
    $('#paymentDiv').attr('style',"display:block;height:93%;");
    $('#paymentDiv').html('<div class="pop-full" style="display:block;height:100%"><p class="preview-screen-text">This preview has been shared on your Facebook Timeline & LitlleCast activity feed<a href="#">REMOVE</a></p></div>');
}
function deletePreview()
{
    if(social_sharing)
    {
        DataCall ("post_id="+postId, SERVER+"feeds/"+activityId.toString()+"/delete.json", "GET", true,
            function ()
            {
                if(DEBUG)
                    console.log("success!!");
            },
            function()
            {
                if(DEBUG)
                    console.log("failed");
            });
    }
}

function removePreviewAct()
{
    deletePreview();
    $('#prev-text-for-user').html('Watch activity removed from Facebook and LittleCast &nbsp;<a href="#" onclick="addPreviewAct();">X</a>');
}

function addPreviewAct()
{
    $('#prev-text-for-user').hide();
    $('#prev-text-for-user').remove();
}

function addPreview()
{
    //do nothing as of now
}
var logMerchantStream  = function(time) {
        logMerchentView(time);
}