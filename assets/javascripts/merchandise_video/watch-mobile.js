var HD = '';
var SD = '';
var currentRES = '';
var TOS = false;
var emailPrev = false;
var playReq = false;
var aboutDisp= false;
var DEBUG = false;
var mac_safari_count;
var DELETED = false;
var previewFlag = false;
var activityId = 0;
var postId = "";
var social_sharing = false;
var intervalID = 0;
var PLAYER_HEIGHT = 420;
var PLAYER_WIDTH = 746;


function addAndroidListeners()
{
    window.addEventListener("orientationchange", function() {

        if( ( $('#paymentDiv').is(":visible") ) || ( $('#toc').is(":visible") ) || ( $('#notifyExpiry').is(":visible") ) || ( $('#video-information-in').is(":visible") ) )
        {
            $('#notifyExpiry').hide();
            $('#toc').hide();
            $('#paymentDiv').hide();
            $('#video-information-in').hide();
            location.reload(false);
        }

    }, false);
}
/*
function addEventListeners() {
    document.addEventListener("fullscreenchange", function () {

        if ($('#fscreenCtrl').hasClass('exresize')) {

            if ($.browser.webkit) {

                //FLUID CANVAS CHANGES
                var w = screen.width;
                var h = screen.height;
                var r = gcd(w, h);
                var aspectRatio = ((w / r) / (h / r));
                var disp_height = 0;
                if (aspectRatio <= 1.33)
                    disp_height = screen.height * 0.40;
                else
                    disp_height = screen.height * 0.50;

                $('#vdo-player').attr('style', 'max-width: 100%; height: ' + disp_height + 'px;');
            }
            $('#fscrTip').html('View Full Screen');
            $('#fscreenCtrl').removeClass('exresize');
            $('#fscreenCtrl').addClass('resize');
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
        } else {
            $('#fscrTip').html('Exit Full Screen');
            $('#fscreenCtrl').removeClass('resize');
            $('#fscreenCtrl').addClass('exresize');
        }
    }, false);
    //HERE IE
    document.addEventListener("msfullscreenchange", function () {
        if(DEBUG)
            console.log("IE FULL SCREEN");

        if ($('#fscreenCtrl').hasClass('exresize')) {
            $('#fscrTip').html('View Full Screen');
            $('#fscreenCtrl').removeClass('exresize');
            $('#fscreenCtrl').addClass('resize');
        } else {
            $('#fscrTip').html('Exit Full Screen');
            $('#fscreenCtrl').removeClass('resize');
            $('#fscreenCtrl').addClass('exresize');
        }
    }, false);

    document.addEventListener("webkitfullscreenchange", function () {

        if ($('#fscreenCtrl').hasClass('exresize')) {

            if ($.browser.webkit) {

                //FLUID CANVAS CHANGES
                var w = screen.width;
                var h = screen.height;
                var r = gcd(w, h);
                var aspectRatio = ((w / r) / (h / r));
                var disp_height = 0;
                if (aspectRatio <= 1.33)
                    disp_height = screen.height * 0.40;
                else
                    disp_height = screen.height * 0.50;

                $('#vdo-player').attr('style', 'max-width: 100%; height: ' + disp_height + 'px;');
            }
            $('#fscrTip').html('View Full Screen');
            $('#fscreenCtrl').removeClass('exresize');
            $('#fscreenCtrl').addClass('resize');
        } else {
            $('#fscrTip').html('Exit Full Screen');
            $('#fscreenCtrl').removeClass('resize');
            $('#fscreenCtrl').addClass('exresize');
        }
    }, false);
}*/
function watchFunction() {
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

    //addEventListeners();

    BROWSER = Browser();
    //EDIT
    //if (BROWSER.iP == false)
    $('#vdo-player').html('');

    fblogin(function () {

        if(DEBUG)
            console.log("Calling Video Stuff");

        VideoStuff();
    });

    vToggle(2);

    $('#video-information-in').hide();
    $('#comment-error').hide();
    $('#btnSell').hide();

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;

    if (isAndroid)
        addAndroidListeners();
}

function endTOC() {
    if (document.getElementById("iAgree").checked)
    {
        //$('#toc').hide();
        //$('#video-information-in').hide();
        //fbpay();

        $('#paymentDiv').show();
        $('#paymentDiv').html('<div class="pop-full" id="paymentScreen" style="display:block;height:100%"><a href="#" onclick="fbpay();"><img src="../fb_app/images/pay-with-facebook.png" /></a><a href="#" style="color: red; margin: 0px;" onclick="endPayScreen();">Cancel</a></div>');
    } else {
            $('#warning-Text').html('<span color="#FF0000">You must agree to the terms and conditions first</span>');
    }
}

function exitfs() {

    if ($.browser.webkit) {

        //FLUID CANVAS CHANGES
        /*var w = screen.width;
        var h = screen.height;
        var r = gcd(w, h);
        var aspectRatio = ((w / r) / (h / r));
        var disp_height = 0;
        if (aspectRatio <= 1.33)
            disp_height = screen.height * 0.40;
        else
            disp_height = screen.height * 0.50;*/
        var disp_height = PLAYER_HEIGHT;
        var disp_width = PLAYER_WIDTH;
        $('#vdo-player').attr('style', 'max-width: 100%; height: ' + disp_height + 'px;');
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
        projekktor('#vdo-player').setFullscreen(true);
        $('#fscrTip').html('Exit Full Screen');
        if ($.browser.webkit) {
            //goFullscreen('vdo-player_media');
            var disp_height = screen.height;

            if(DEBUG)
                console.log("DISP-HEIGHT:" + disp_height);

            $('#video-player').css('width', '100%');
            $('#video-player').css('height', '100%');
            $('#vdo-player').attr('style', 'max-width: 100%; height:' + disp_height + 'px;');
            goFullscreen('video-player');
        } else {
            goFullscreen('vdo-player');
        }
    }

}

function btnPreview() {
    projekktor('#vdo-player').setPlay();
    $('#previewBtn').hide();
    $('#aboutBtn').hide();
    if(!playReq)
        {
            setTimeout(sendPreviewCall,10000);           
            playReq = false;
        }
}

function btnAbout() {
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") != -1;
    if(!isAndroid)
    {
        if (($('#about-video-in').is(":visible"))) {
            //$('#video-information-in').hide('slow');
            $("#about-video-in").attr('style', "display:none");
        } else {
            $('#video-information-in').show();
            $("#about-video-in").attr('style', "display:block");
        }
    }
    else{
            if(!aboutDisp)
            {
                $('#video-information-in').show();
                $("#about-video-in").attr('style', "display:block");
                aboutDisp = true;
            }
            else
            {
                $("#about-video-in").attr('style', "display:none");
                aboutDisp = false;
            }
    }
}
function startTOC()
{
    if (projekktor('#vdo-player').getState('PLAYING'))
        projekktor('#vdo-player').setPause();
    //4 MARCH EDIT FOR TOC SCREEN SHOW
    if ((window.fullScreen) || (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
        exitfs();
    }

    if (emailPrev ) {
        if (!(($('#toc').is(":visible")))) {
            $('#video-information-in').show();
            $("#about-video-in").attr('style', "display:none");
            $('#paymentDiv').html('');
            $('#toc').show();
            $('#toc').html('<div class="pop-full landscape" style="display:block;height:100%;top:0px;"><h4>What exactly am I buying?</h4><ul><li>Ability to stream on Facebook (via browser) and download to mobile devices of your choice via LittleCast mobile and tablet apps for iOS & Android</li><li>Stream and download, as many times as you like, as long as the video is available for sale. Download a video to your mobile device and keep it forever.</li></ul><p><input type="checkbox" id="iAgree"><label for="iAgree">I have read and agree to LittleCast Terms of Use </label><a target="_blank" href="/payment-addendum/">Payment Addendum.</a> <label>All Sales are final.</label></p><p><a href="#" id="warning-Text"></a><p class="butonP"><input type="button" class="app-screen-btn" value="Make Payment" onclick="fbpay();"><a href="#" onclick="startTOC();">Cancel</a></p></div>');
        } else {
            $('#toc').hide();
            $('#toc').html('');
            $('#video-information-in').show();
        }

    }
    else{
        if (($('#toc').is(":visible"))) {
            $('#toc').hide();
            $('#toc').html('');
            $('#video-information-in').hide();
        }
        else{
                //$('#video-information-in').show();
                $("#about-video-in").attr('style', "display:none");
                $('#paymentDiv').html('');
                $('#toc').show();
                $('#toc').html('<div class="pop-full landscape" style="display:block;height:100%;top:0px;"><h4>What exactly am I buying?</h4><ul><li>Ability to stream on Facebook (via browser) and download to mobile devices of your choice via LittleCast mobile and tablet apps for iOS & Android</li><li>Stream and download, as many times as you like, as long as the video is available for sale. Download a video to your mobile device and keep it forever.</li></ul><p><input type="checkbox" id="iAgree"><label for="iAgree">I have read and agree to LittleCast Terms of Use </label><a target="_blank" href="/payment-addendum/">Payment Addendum.</a> <label>All Sales are final.</label></p><p><a href="#" id="warning-Text"></a><p class="butonP"><input type="button" class="app-screen-btn" value="Make Payment" onclick="fbpay();"><a href="#" onclick="startTOC();">Cancel</a></p></div>');
            }
        }
}

function redirectURLAndroid(){

    var ur = window.top.location.href.slice(-1);
    var new_url;

    if(ur=='#')
        {
            new_url=window.top.location.href.substr(0,window.top.location.href.length-1);
            new_url = new_url + "&android=1";
        }
    else
        new_url = window.top.location.href + "&android=1";
    window.top.location = new_url;
}
function LoadHTMLPlayer(poster, video, title, buy) {

    var player = '';

    var player = '';
    var container_width =  $('.container .row-fluid').width() ;
    //var disp_height = (container_width * 56.6 / 100 )+35;
    var disp_height = '100%';
    var disp_width = '100%';
    PLAYER_HEIGHT = disp_height; 
    PLAYER_WIDTH = container_width 


    if(DEBUG)
        console.log("HEIGHT:" + disp_height);

    $(".video-player").css("height", disp_height + "px;");
    $("#video-player").attr("height", disp_height + "px;");

    var isApple = (navigator.userAgent.indexOf('iPad') != -1 || navigator.userAgent.indexOf('iPhone') != -1);
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") != -1;

    if (isApple || isAndroid) {
        player = player + '<video id="vdo-player" class="projekktor" title="' + title + '" width="100%" height="' + disp_height + '" controls>';
    }
    else
        player = player + '<video id="vdo-player" class="projekktor" title="' + title + '" width="100%" height="' + disp_height + '" controls>';
    //IF NOT IE
    if (!(ua.indexOf("msie") > -1))
        player = player + '<source src="' + video + '" type="video/mp4" /></video>';
    else
        player = player + '<source src="' + video + '" type="video/mp4" codecs="avc1.42E01E,mp4a.40.2"/></video>';

    try{
    $('#player-loading').hide();
    $('#html-player').html(player);    
    
    var controlsTemplate = '<div class="play-bar-wrap"><div class="play-bar-wraper"><div %{scrubber}><div %{loaded}></div><div %{playhead}></div><div %{scrubberdrag}></div></div></div></div><div class="control-wraper clearfix"><ul class="play fl"><li><a href="#" onclick="return false;"><div %{play} onclick="playBtn();"></div><div %{pause}></div></a></li><li id="vBar"><span class="ppmute" id="vmute" onclick="vToggle(1);"></span><span onclick="vToggle(2);" style="display:none" id="vmax" class="ppvmax"></span></li></ul><div class="left-section clearfix"><ul class="link icos fl"><li><span class="btnpreview" id="previewBtn" onclick="btnPreview();">Preview</span></li><li><span class="btnabout" id="aboutBtn" onclick="btnAbout();">About</span></li></ul></div><div class="right-section clearfix"><ul class="link icos fl"><li><div %{timeleft}>%{hr_elp}:%{min_elp}:%{sec_elp} <span class="grey">/ %{hr_dur}:%{min_dur}:%{sec_dur}</span></div></li><li><div %{fsexit}></div><div %{fsenter}></div></li><li id="hdWrapper"><a href="#"><span id="hdsdswitch" class="hdsd" onclick="dispHdSd();"></span></a><span style="display:none" id="hdSpanBar"><ul><li><a href="#" id="hdplug" onclick="hdswitch();">720p</a></li><li><a id="sdplug" href="#" onclick="sdswitch();">480p</a></li></ul></span></li><div class="player-logo"><span class="logo"></span></div>';

    if (buy == true && (!isApple) && (!isAndroid)) {
            controlsTemplate = controlsTemplate + '<div class="button" id="player-buy-button"><a href="#" onclick="startTOC();">Buy Now</a></div>';
    }

    controlsTemplate = controlsTemplate + '</div></div>';

        projekktor('#vdo-player', {
            enableFullscreen: true,
            enableKeyboard: true,
            debug: false,
            imageScaling: 'none',
            videoScaling: 'aspectratio',
            plugin_controlbar: {
                controlsDisableFade: true,
                showOnStart: true,
                showOnIdle: true,
                controlsTemplate: controlsTemplate
            }
        });
    }catch(ex)
    {
        console.log(ex.message);
        }
}
function VideoInformation(SuccessCallBack) {
    //REMOVE 2 FOR PROPER EXECUTION
    DataCall("id=1", SERVER + VIDEOS + VIDEO_ID + "/" + VIDEO_INFORMATION, "GET", true,

    function (data) {
        try {

            var dmy = data.data.video.media_creation_date.substr(0, 10);
            var y = dmy.substr(0, 4);
            var m = dmy.substr(5, 2);
            var d = dmy.substr(8, 2);
            var month = getMonth(m);
            data.data.video.media_creation_date_formated = month + " " + d + ", " + y;

            /* Undersocre tempaltes*/
            if( data.data.is_paid || data.data.is_purchased || data.data.is_video_owner ){
                var template = _.template(document.getElementById('title-container-purchase').innerHTML);
            }else{
                var template = _.template(document.getElementById('type-0').innerHTML);
            }
            $(document.getElementById('video-owner-info')).html(template(data));
            var template = _.template(document.getElementById('likes-template').innerHTML);
            $(document.getElementById('load-likes')).html(template(data));
            var template = _.template(document.getElementById('comments-template').innerHTML);
            $(document.getElementById('load-comments')).html(template(data));
            var template = _.template(document.getElementById('user-info').innerHTML);
            $(document.getElementById('load-user')).html(template(FB_USER));

            /*
                LIT-3070
                Hiding top navigation Who We are , How it works
                managing toggle of description area
            */
            if( data.data.is_video_owner ||  data.data.is_purchased ){
                /*$('.hide-nav-links').hide();*/
                $('.desc-container').hide();
                $('#toggle-desc').css('background-position','0px -17px'); 
            }else{
                $('#toggle-desc').addClass('desc-show');
                $('#toggle-desc').css('background-position','0px 0px'); 
            }
            $('#toggle-desc').show();

            $('#comment-error').hide();
            $('.share').socialLikes();

            if ( typeof gapi != 'undefined' && typeof gapi.plus != 'undefined' )
                gapi.plus.go('.g-plus');

            !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");


            VIDEO = data.data.video;
            PUBLISHER = data.data.video.user;

            $('#video-main-title').html(VIDEO.title);
            $("#video-title").html(VIDEO.title);
            $("#video-title-in").html(VIDEO.title);
            $('#video-caption').html(VIDEO.description);
            if(VIDEO.description.length > 230){
                $('#video-caption-in').html(VIDEO.description.substring(0, 230) + "..." + "<a id='description_anchor' href='javascript:;' onclick=\"#description\" >More</a>");
            }
            else{
                $('#video-caption-in').html(VIDEO.description)
            }
            //CREATION DATE EDITS GO HERE
            var dmy = VIDEO.media_creation_date.substr(0, 10);
            var y = dmy.substr(0, 4);
            var m = dmy.substr(5, 2);
            var d = dmy.substr(8, 2);
            var month = getMonth(m);
            $('#creation-date').html(month + " " + d + ", " + y);
            $('#creation-date').attr('title', 'Creation Date' + month + " " + d + ", " + y);
            //END OF EDITS
            $('#publisher-photo').html('<img alt="" src="https://graph.facebook.com/' + PUBLISHER.uid + '/picture" width="50" height="50">');
            var pubName = getParameterByName('page_name');
            if (pubName==""){
                $('#publisher-name').html("<a href='https://www.facebook.com/"+PUBLISHER.uid+"' target='_blank'><font color='#FFFFFF'>"+PUBLISHER.first_name + " " + PUBLISHER.last_name+"</font></a>");
                $("#publisher-name-in").html("<a style='color:#FFFFFF;' href='https://www.facebook.com/"+PUBLISHER.uid+"' target='_blank'><font color='#FFFFFF'>"+PUBLISHER.first_name + " " + PUBLISHER.last_name+"</font></a>");
            }
            else{
                var pageLink = getParameterByName('page_id');
                $('#publisher-name').html("<a href='https://www.facebook.com/"+pageLink+"' target='_blank'><font color='#FFFFFF'>"+pubName+"</font></a>");
                $("#publisher-name-in").html("<a style='color:#FFFFFF;' href='https://www.facebook.com/"+pageLink+"' target='_blank'><font color='#FFFFFF'>"+pubName+"</font></a>");
            }
            $("#video-category").html(VIDEO.category_name);
            $('#comments-count').html(VIDEO.comments_count);
            $('#likes-count').html(VIDEO.likes_count);
            $('#sold-count').html(VIDEO.total_sold);
            $("#video-category").show();


            if (VIDEO.preview.total_previews_all < 1) {
                $('#views-count-in').html('<br/>');
                $('#views-count-in').removeClass();
                $('#views-count-in').attr("class","clear");
            } else
                $('#views-count-in').html(VIDEO.preview.total_previews_all);

            if (VIDEO.total_sold < 1) {
                $('#sold-count-in').html('<br/>');
                $('#sold-count-in').removeClass();
                $('#sold-count-in').attr("class","no-solds");
            } else
                $('#sold-count-in').html(VIDEO.total_sold);

            $('#video-price-in').html('$' + VIDEO.price);
            $('#video-price-mob').html('$' + VIDEO.price);

            if (TOS) {

                $('#video-information-in').hide();
                $("#about-video-in").attr('style', "display:none");
                $('#toc').hide();


                var ua = navigator.userAgent.toLowerCase();
                var isFB = ua.indexOf("fb") > -1;

                $('#video-information-in').hide();
                $('#toc').html('<div class="pop-full landscape" style="display:block;height:100%;top:0px;"><h4>What exactly am I buying?</h4><ul><li>Ability to stream on Facebook (via browser) and download to mobile devices of your choice via LittleCast mobile and tablet apps for iOS & Android</li><li>Stream and download, as many times as you like, as long as the video is available for sale. Download a video to your mobile device and keep it forever.</li></ul><p><input type="checkbox" id="iAgree"><label for="iAgree">I have read and agree to LittleCast Terms of Use </label><a target="_blank" href="/payment-addendum/">Payment Addendum.</a> <label>All Sales are final.</label></p><p><a href="#" id="warning-Text"></a><p class="butonP"><input type="button" class="app-screen-btn" value="Make Payment" onclick="fbpay();"><a href="#" onclick="startTOC();">Cancel</a></p></div>');

            }

            var preview = '';
            if (VIDEO.processed_preview_information) {
                var len = VIDEO.processed_preview_information.length;
                for (i = 0; i < len; i++)
                    if (VIDEO.processed_preview_information[i].format == "mpeg4")
                        preview = VIDEO.processed_preview_information[i].signed_processed_keys;
            }

            //UNLIKE ICON IF VIDEO IS ALREADY LIKED BY THIS USER
            if (data.data.is_liked_by_me) {
                $("#video-like").addClass('unlike');
                $("#video-like").html('Unlike ');
            } else {
                $("#video-like").addClass('like');
                $("#video-like").html('Like ');
            }

            if(DEBUG)
                console.log(preview);
            
            if( data.data.is_paid || data.data.is_purchased || data.data.is_video_owner ){
                LoadHTMLPlayer(VIDEO.thumbnails[0].thumbnail_signed_path, preview, VIDEO.title, false);
            }else{
                LoadHTMLPlayer(VIDEO.thumbnails[0].thumbnail_signed_path, preview, VIDEO.title, true);
            }


            StreamMedia(false,

            function () {
                if (getParameterByName('buy') == "invoke") {
                    if (BROWSER.browser != "FB") {
                        projekktor('#vdo-player').setStop();
                        projekktor('#vdo-player').setPause();
                    }
                }
            });
            SuccessCallBack();
        } catch (ex) {
            if(DEBUG)
                console.log("Exception: " + ex.message);
        }
        try {

            if (VIDEO.media_creation_date != null) {
                var stamp = TimeStamp(VIDEO.media_creation_date);
                $('#video-stamp').html($('#video-stamp-in').html(stamp.user_stamp));
                //$('#video-stamp').attr('title', 'Published Date: '+stamp.stamp);
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



        $('#video-views').html(VIDEO.view_count);
        
    },

    function (data) {
        var json = jQuery.parseJSON(data.responseText);

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
function playBoughtVid(){
    window.setTimeout(StreamMedia, 100, true, function () {
        $('#paymentDiv').html('');
        $('#paymentDiv').hide();
    });
}
function stripeSuccess() {

    $('#spinner-img').removeClass('loader');
    var count = $('#views-count-in').html();
    var newCount = (parseInt(count, 10)) + 1;
    $('#views-count-in').html(newCount);
    playReq = false;
    count = $('#sold-count').html();
    var newCount = (parseInt(count, 10)) + 1;
    $('#sold-count').html(newCount);
    $('#video-information-in').hide();
    //$("#payment-form").hide();
    $("#toc").hide();
    $('#player-buy-button').hide();
    $('#previewBtn').hide();
    $('#aboutBtn').hide();
    $('#video-price-in').hide();
    $("#video-category").show();
    $('#video-price-in').hide();
    //SHOW SUCCESS MESSAGE HERE
    $('#paymentDiv').html('');
    $('#paymentDiv').html('<div id="notifyExpiry"><div style="display:block;" class="pop-full1"><div class="top-space"><h2 class="tic">Purchase Complete</h2><p class="purchase-complete"><a href="#" style="display: block;">We have sent you an email with payment confirmation and links to LittleCast iOS & Android apps to download.</a></p><button onclick="playBoughtVid();" class="submit-button" >Play Video</button></div></div></div>');
}

function stripeFail() {
    $('#spinner-img').removeClass('loader');
    $('.submit-button').prop('disabled', false);
    $("#payment-form").hide();
    $('#video-price-in').show();
    $("#video-category").show();
}
function showPrevText()
{
    if(social_sharing && postId)
        $('#prev-text-for-user').show();
}

function sendPreviewCall()
{
    if( (!(previewFlag)))
    {
        DataCall("device=FBApp", SERVER + VIDEOS + VIDEO_ID + PREVIEWED, "GET", true,
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
    }
}

var displayInfo = function (state) {
    switch (state) {
        case 'PLAYING':

            /*if (!playReq)
            {                
                sendPreviewCall();
                playReq = true;
            }*/
            $('#video-information-in').hide('slow');
            $('#previewBtn').hide();
            $('#aboutBtn').hide();
            $('#vBar').show();
            $('#fscrWrapper').show();
            $('#fscreenCtrl').show();
            $('#fscrWrapper').show();
            break;
        case 'COMPLETED':
        case 'STOPPED':
            $('#video-information-in').show();
            $("#about-video-in").attr('style', "display:none");
            $('#previewBtn').show();
            $('#aboutBtn').show();
            $('#vBar').hide();
            $('#hdsdswitch').hide();
            $('#hdWrapper').hide();
            $('#fscreenCtrl').hide();
            break;

    }

}
function endPayScreen() 
{
        $('#video-information-in').show();
        $("#about-video-in").attr('style', "display:none");
        $('#paymentDiv').html('');
        $('#paymentDiv').hide();
}

var recStrem = function (state) {
    switch (state) {
        case 'PLAYING':
            if (!playReq) {
                DataCall("device=FBApp&request_type=stream_request", SERVER + VIDEOS + VIDEO_ID + UPDATE_STREAM, "POST", true,

                function () {

                    if(DEBUG)
                        console.log("Stream Success");
                },

                function () {

                    if(DEBUG)
                        console.log("STREAM REQUEST FAIL");
                });
            }
            playReq = true;
            break;
        case 'STOPPED':
        case 'COMPLETED':
                break;
    }
}
function StreamMedia(AutoPlay, Failure) 
{

        DataCall("", SERVER + VIDEOS + VIDEO_ID + "/" + STREAM_REQUEST, "GET", true,

        function (data) {
            if (data.success == true) {

                if(DEBUG)
                    console.log("Bought");

                $('#paymentDiv').html('');
                $('#paymentDiv').hide();
                $('#paymentDiv').remove();

                $('#notifyExpiry').html('');
                $('#notifyExpiry').hide();
                $('#notifyExpiry').remove();

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
                    $('#hdplug').html('-720p');
                    $('#sdplug').html('480p');
                } else {
                    alert('720P or 480P are under proccess. You are viewing this video in 320P');
                    var video_to_play = {
                        0: {
                            src: data.data.video._320p,
                            type: 'video/mp4'
                        }
                    };
                    $('#hdplug').html('720p');
                    $('#sdplug').html('-480p');
                }

                $('#toc').hide();

                if (navigator.userAgent.indexOf('iPhone') != -1)
                    projekktor('#vdo-player').setPlay();
                else
                    projekktor('#vdo-player').setStop();

                projekktor('#vdo-player').setItem(video_to_play, 0, true);
                projekktor('#vdo-player').setStop();


                $('#previewBtn').hide();
                $('#aboutBtn').hide();
                $('#player-buy-button').hide();

                $('#previewBtn').attr('style', "display:none");
                $('#aboutBtn').attr('style', "display:none");
                $('#player-buy-button').attr('style', "display:none");

                $('#previewBtn').remove();
                $('#aboutBtn').remove();
                $('#player-buy-button').remove();

                projekktor('#vdo-player').removeListener('mouseenter', infoPlayPause);
                projekktor('#vdo-player').removeListener('state', stateInfoPrev);
                projekktor('#vdo-player').removeListener('state', displayInfo);
                projekktor('#vdo-player').removeListener('state', regPreview);

                projekktor('#vdo-player').addListener('state', recStrem);

                $('#hdsdswitch').show();
                $('#hdWrapper').show();
                $('#fscreenCtrl').show();
                $('#hdsdswitch').show();
                $('#vBar').show();
                $('#video-information-in').hide();
                $('#about-video-in').hide();
                $('#player-buy-button').hide();
                $('#video-price-in').hide();
                $("#video-category").show();
            }
        },

        function (data) {

            var preview = '';
            if (VIDEO.processed_preview_information)
                preview = VIDEO.processed_preview_information[0].signed_processed_keys;

            if(DEBUG) {
                console.log("Preview");
               console.log(preview);
            }

            var isApple = (navigator.userAgent.indexOf('iPad') != -1 || navigator.userAgent.indexOf('iPhone') != -1);
            var isAndroid = navigator.userAgent.indexOf("Android") != -1;

            $('#notifyExpiry').hide();
            $('#notifyExpiry').html('');

            //INSERT CHECKOUT WITH PAYPAL SCREEN
            if (!emailPrev && (!isApple) && (!isAndroid) ){

                $('#paymentDiv').html('<div class="pop-full" id="paymentScreen" style="display:block;height:100%"><a href="#" onclick="fbpay();"><img src="../fb_app/images/pay-with-facebook.png" /></a><a href="#" style="color: red; margin: 0px;" onclick="endPayScreen();">Cancel</a></div>');
            } else
                $('#paymentDiv').hide();

                var STREAM_FLAG = true; // added to clear , not sure
                if (!STREAM_FLAG)
                    projekktor('#vdo-player').setStop();
                else
                    projekktor('#vdo-player').setStop();

            if (TOS){
                    if(!isApple && ((getParameterByName("android")==1) || (getParameterByName("android")=='1')))
                        $('#toc').show();
                    else
                    {
                        $('#toc').hide();
                        $('#toc').html('');
                    }
                    $('#paymentDiv').html('');
                    $('#paymentDiv').hide();
            }


                if(isApple || isAndroid)
                        $('#video-information-in').hide();
                 else
                    $('#video-information-in').show();

                $("#about-video-in").attr('style', "display:none");
                $("#video-category").show();
                $('#hdsdswitch').hide();
                $('#hdWrapper').hide();
                $('#fscreenCtrl').hide();
                projekktor('#vdo-player').addListener('state', displayInfo);
                $('#vBar').hide();

                if(!TOS)
                {
                    $('#video-information-in').hide();
                    $("#about-video-in").attr('style', "display:none");
                }

            $('#player-buy-button').show();

            if(isApple)
            {
                $('#toc').html('');
                $('#paymentDiv').html('');
                $('#toc').hide();
                $('#paymentDiv').hide();
                $('#notifyExpiry').html('');
                $('#notifyExpiry').hide();
                $('#toc').remove();
                $('#paymentDiv').remove();
                $('#notifyExpiry').remove();            }
            Failure();
        });
        //UserAccess ();
    }
    function endNotice(){

        $('#notifyExpiry').remove();
    }
    function nextScreen(){
        $('#notifyExpiry').remove();

        if(TOS)
        {
            startTOC();
        }
        else
        {
            if (!emailPrev){


                $('#paymentDiv').show();
                $('#paymentDiv').html('<div class="pop-full" id="paymentScreen" style="display:block;height:100%"><a href="#" onclick="fbpay();"><img src="../fb_app/images/pay-with-facebook.png" /></a><a href="#" style="color: red; margin: 0px;" onclick="endPayScreen();">Cancel</a></div>');
            } else{
                $('#paymentDiv').hide();
                startTOC();
            }
    }
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
function playBtn()
{
    projekktor('#vdo-player').setPlay();
    $('#previewBtn').hide();
    $('#aboutBtn').hide();
    if(!playReq)
        {
            setTimeout(sendPreviewCall,10000);           
            playReq = false;
        }
}
function removePreviewAct()
{
    deletePreview();
    //$('#prev-text-for-user').html('Removed from your timeline &nbsp;<a href="#" onclick="addPreviewAct();">CLICK TO ADD</a>');
    $('#prev-text-for-user').html('Watch activity removed from Facebook and LittleCast &nbsp;<a href="#" onclick="addPreviewAct();">X</a>');    
}

function addPreviewAct()
{
    //addPreview();
    //$('#prev-text-for-user').html('Added to your timeline &nbsp;<a href="#" onclick="removePreviewAct();">CLICK TO REMOVE</a>');       
    $('#prev-text-for-user').hide();
    $('#prev-text-for-user').remove();
}

function addPreview()
{
    //do nothing as of now
}
/*
function removePreviewAct()
{
    deletePreview();
    $('#prev-text-for-user').html('Removed from your timeline &nbsp;<a href="#" onclick="addPreviewAct();">CLICK TO ADD</a>');    
}

function addPreviewAct()
{
    addPreview();
    $('#prev-text-for-user').html('Added to your timeline &nbsp;<a href="#" onclick="removePreviewAct();">CLICK TO REMOVE</a>');       
}

function addPreview()
{
    //do nothing as of now
}*/