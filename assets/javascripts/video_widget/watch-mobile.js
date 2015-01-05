var comments_all_open = false;
var dgFlow;
var trans_id = 0;
var STREAM_FLAG = true;//WAS USED TO AVOID REFRESH FOR PAYPAL CASE
var HD = '';
var SD = '';
var currentRES = '';
var TOS = false;
var emailPrev = false;
var playReq = false;
var aboutDisp= false;
var DEBUG = false;
var mac_safari_count;


function fbpay()
{

  var allow = true;
  if (TOS) {
    if (document.getElementById("iAgree").checked) 
    {

    }
    else
    {
        allow= false;
        $('#warning-Text').html('<span color="#FF0000">You must agree to the terms and conditions first</span>');
    }
  }
  if (allow)
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
        	FB.ui({
              method: 'pay',
              user_currency: "USD",
              action: 'purchaseitem',
              product: PAY_SERVER+'/videos/'+VIDEO_ID+'/price',
              request_id: requestID
        	  },
        	  function(response) {
        			
        			if(response.status=="completed")
        			{
        				if (true){		
        					console.log("Verifying purchase with server");
        					console.log(response);
        				}
        				DataCall("paymentid="+response.payment_id+"&videoid="+VIDEO_ID, SERVER + "fb_local_currency_payment.json/", "POST", true,
        				function(data){
        					//Success Case
        					stripeSuccess();			
        				}, 
        				function (data){
        					//Failed case
        					stripeFail();
        				});        				
        			}
        			else{
        				stripeFail();
        			}
            }
          );
    }
}  

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

    if(getParameterByName('android') == '1' || getParameterByName('android') == 1)
    {
        $('#paymentDiv').hide();
        $('#paymentDiv').html('');
        $('#toc').show();   
        $('#toc').html('<div class="pop-full landscape" style="display:block;height:100%;top:0px;"><h4>What exactly am I buying?</h4><ul><li>Ability to stream on Facebook (via browser) and download to mobile devices of your choice via LittleCast mobile and tablet apps for iOS & Android</li><li>Stream and download, as many times as you like, as long as the video is available for sale. Download a video to your mobile device and keep it forever.</li></ul><p><input type="checkbox" id="iAgree"><label for="iAgree">I have read and agree to LittleCast Terms of Use </label><a target="_blank" href="/payment-addendum/">Payment Addendum.</a> <label>All Sales are final.</label></p><p><a href="#" id="warning-Text"></a><p class="butonP"><input type="button" class="app-screen-btn" value="Make Payment" onclick="fbpay();"><a href="#" onclick="startTOC();">Cancel</a></p></div>');       
    }
    else
    {
        var checkEmailLink = getParameterByName('showpreview');
        if (checkEmailLink == '1' || checkEmailLink == 1) {
            emailPrev = true;
        }

        addEventListeners();

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
}

function endTOC() {
    if (document.getElementById("iAgree").checked) 
    {
        //$('#toc').hide();
        //$('#video-information-in').hide(); 
        //fbpay();

        $('#paymentDiv').show(); 
        $('#paymentDiv').html('<div class="pop-full" id="paymentScreen" style="display:block;height:100%"><a href="#" onclick="fbpay();"><img src="../fb_app/images/pay-with-facebook.png" /></a><a href="#" style="color: red; margin: 0px;" onclick="endPayScreen();">Cancel</a></div>');
        /*$('#paymentDiv').html('<form id="payment-form" method="POST" action=""><div style="display:block;" class="pop-full1"><div class="payment-pop-header"><h1>Secure Credit Card Payment</h1></div><div class="form-row first-row-start"><label><span class="required">*</span>Credit Card Number</label><input type="text" id="my-ccn" onKeyDown="limitText("my-ccn", "", '+16+');" onKeyUp="limitText("my-ccn", "", '+16+');" class="card-number" autocomplete="off" maxlength="16" size="20"></div><div class="clear"></div><div class="form-row"><label  style="line-height:29px;"><span class="required">*</span> Security Code (CVC or CVV)</label><input type="text" class="card-cvc" autocomplete="off" maxlength="4" size="4"><div class="payment-cards cvv"><img src="/fb_app/images/cvv-number.png" alt="CVV" title="CVV" width="30" height="21" /></div></div><div class="form-row"><label style="line-height:29px;"><span class="required">*</span> Expiration (MM/YYYY)</label><input type="text" class="card-expiry-month" maxlength="2" size="2"><span class="separator"> / </span><input type="text" class="card-expiry-year" maxlength="4" size="4"><div class="clear"></div></div><div class="form-row"><button class="submit-button" type="submit">Submit Payment</button><a id="spinner-img" class="loader-text" onclick="endPayScreen();" href="#"><font color="#FF0000" style="margin-left: 6px;">Cancel</font></a></div></div><label class="intimation-required"><span class="required">*</span>Required Fields</label></form>');
        $('#payment-form').submit(function (event) {                
				// Disable the submit button to prevent repeated clicks
                $('.submit-button').prop('disabled', true);
	          	$('#spinner-img').html('');
          		$('#spinner-img').addClass('loader');
				
                Stripe.createToken({
                    number: $('.card-number').val(),
                    cvc: $('.card-cvc').val(),
                    exp_month: $('.card-expiry-month').val(),
                    exp_year: $('.card-expiry-year').val()
                }, stripeResponseHandler);

                // Prevent the form from submitting with the default action
                return false;
            });
            $('#paymentDiv').show();*/  
    } else {            
            $('#warning-Text').html('<span color="#FF0000">You must agree to the terms and conditions first</span>');
    }
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

function exitfs() {

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

function hideHdSd() {
    $('#hdSpanBar').hide();
}

//ASPECT RATIO

function gcd(a, b) {
    return (b == 0) ? a : gcd(b, a % b);
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
function dispFscr(){    
    $('#fscr').show();

    if(DEBUG)   
        console.log("Show FS");
}

function hideFscr(){
    $('#fscr').hide();   

    if(DEBUG)    
        console.log("HIDE FS");
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
function hideVolTip(){
    $('#volTip').hide();    
    if(DEBUG) 
        console.log("HIDE VOL TIP");       
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
    
    var w = screen.width;
    var h = screen.height;
    var r = gcd(w, h);
    var aspectRatio = ((w / r) / (h / r));
    var disp_height = 0;
    if (aspectRatio <= 1.33)
        disp_height = screen.height * 0.40;
    else
        disp_height = screen.height * 0.50;


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
    //IF NOT IE
    if (!(ua.indexOf("msie") > -1))
        player = player + '<source src="' + video + '" type="video/mp4" /></video>';
    else
        player = player + '<source src="' + video + '" type="video/mp4" codecs="avc1.42E01E,mp4a.40.2"/></video>';

    $('#html-player').html(player);
    var controlsTemplate = '<div class="play-bar-wrap"><div class="play-bar-wraper"><div %{scrubber}><div %{loaded}></div><div %{playhead}></div><div %{scrubberdrag}></div></div></div></div><div class="control-wraper clearfix"><ul class="play fl"><li><a href="#" onclick="return false;"><div %{play}></div><div %{pause}></div></a></li><li id="vBar"><span class="ppmute" id="vmute" onclick="vToggle(1);"></span><span onclick="vToggle(2);" style="display:none" id="vmax" class="ppvmax"></span></li></ul><div class="left-section clearfix"><ul class="link icos fl"><li><span class="btnpreview" id="previewBtn" onclick="btnPreview();">Preview</span></li><li><span class="btnabout" id="aboutBtn" onclick="btnAbout();">About</span></li></ul></div><div class="right-section clearfix"><ul class="link icos fl"><li><div %{timeleft}>%{hr_elp}:%{min_elp}:%{sec_elp} <span class="grey">/ %{hr_dur}:%{min_dur}:%{sec_dur}</span></div></li><li><div %{fsexit}></div><div %{fsenter}></div></li><li id="hdWrapper"><a href="#"><span id="hdsdswitch" class="hdsd" onclick="dispHdSd();"></span></a><span style="display:none" id="hdSpanBar"><ul><li><a href="#" id="hdplug" onclick="hdswitch();">720p</a></li><li><a id="sdplug" href="#" onclick="sdswitch();">480p</a></li></ul></span></li><div class="player-logo"><a href="/" target="_blank"></a></div>';
        
  
    if (buy == true && (!isApple) && (!isAndroid)) {                    
            controlsTemplate = controlsTemplate + '<div class="button" id="player-buy-button"><a href="#" onclick="startTOC();">Buy Now</a></div>';
    }

    controlsTemplate = controlsTemplate + '</div></div>';


    
        projekktor('#vdo-player', {
            enableFullscreen: true,
            enableKeyboard: true,
            debug: false,
            imageScaling: 'none',
            videoScaling: 'none',
            plugin_controlbar: {                
                controlsDisableFade: true,
                showOnStart: true,
                showOnIdle: true,
                controlsTemplate: controlsTemplate
            }
        }); 
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

function CommentStructure(comment, posted) {

    var comment_body = '';

    var stamp = TimeStamp(comment.created_at);
    var username = comment.user.first_name + ' ' + comment.user.last_name;

    comment_body = comment_body + '<div class="user-row clearfix coment-panel">';
    comment_body = comment_body + '<div class="user-img"><img width="50" alt="' + username + '" height="50" src="https://graph.facebook.com/' + comment.user.uid + '/picture"></div>';
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
    comment_body = comment_body + '</div></div></div>';

    return comment_body;

}


function VideoStuff() {
    VideoInformation(function () {
        //VideoLikes ();
        RealTimeActivities();
    });
}

function UserAccess() {

    DataCall("", SERVER + LIBRARY + VIDEO_ID + "/" + VIDEO_ACCESS, "GET", true,

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

    DataCall("id=1", SERVER + VIDEOS + VIDEO_ID + "/" + VIDEO_LIKES, "GET", true,

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

function MakeMyPayment() {
    if (!STREAM_FLAG)
        STREAM_FLAG = true;

    $("#payment-form").remove();
    return MakePayment();
}

function VideoInformation(SuccessCallBack) {
    //REMOVE 2 FOR PROPER EXECUTION
    DataCall("id=1", SERVER + VIDEOS + VIDEO_ID + "/" + VIDEO_INFORMATION, "GET", true,

    function (data) {
        try {
            VIDEO = data.data.video;
            PUBLISHER = data.data.video.user;

            $('#video-main-title').html(VIDEO.title);
            $("#video-title").html(VIDEO.title);
            $("#video-title-in").html(VIDEO.title);
            $('#video-caption').html(VIDEO.description);
            $('#video-caption-in').html(VIDEO.description);
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


            if (VIDEO.total_sold < 1) {
                $('#views-count-in').html('<br/>');
                $('#views-count-in').removeClass();
                $('#views-count-in').attr("class","clear");
            } else
                $('#views-count-in').html(VIDEO.total_sold);

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

            LoadHTMLPlayer(VIDEO.thumbnails[0].thumbnail_signed_path, preview, VIDEO.title, true);            

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

        try {

            if (VIDEO.comments_count > 0) {
                var comments = VIDEO.recent_comments;
                var total = comments.length;

                for (i = 0; i < total; i++) {
                    comment = comments[i];
                    $('#comments').append(CommentStructure(comment, true));
                }
            }

        } catch (err) {
            if(DEBUG) 
                console.log("Invalid Data. << Video Comments.");
        }
    },

    function (data) {
        alert("Failed to load video. Refresh or try again later.");
    });
}

function RealTimeActivities() {
    GetComments();   
}

function GetComments() {

    DataCall("id=1", SERVER + VIDEOS + VIDEO_ID + "/" + VIDEO_INFORMATION, "GET", true,

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

        DataCall("comment[title]=" + comment.title + "&comment[comment]=" + comment.comment, SERVER + VIDEOS + VIDEO_ID + "/" + COMMENT, "POST", true,

        function (data) {
            var count = $('#comments-count').html();
            var newCount = (parseInt(count, 10)) + 1;
            $('#comments-count').html(newCount);
            $('#comment_text').val('');
            $('#comment-error').hide();
            $('#comment-chars').html('500 characters.');
        },

        function (data) {
            $('#comment-error').show();
        });

    }
}

function AddComment(evt) {

    var charCode = (evt.which) ? evt.which : evt.keyCode;
    var comment_text = $('#comment_text').val();

    if ((charCode == 13 && comment_text != '' && (/\S/.test(comment_text)))) {

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

        DataCall("comment[title]=" + comment.title + "&comment[comment]=" + comment.comment, SERVER + VIDEOS + VIDEO_ID + "/" + COMMENT, "POST", true,

        function (data) {
            var count = $('#comments-count').html();
            var newCount = (parseInt(count, 10)) + 1;
            $('#comments-count').html(newCount);
            $('#comment_text').val('');
            $('#comment-error').hide();
            $('#comment-chars').html('500 characters.');
        },

        function (data) {
            $('#comment-error').show();
        });

    }
}

function LikeVideo() {

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

        DataCall("", SERVICE, "POST", true,

        function (data) {
            if(value == "unlike"){
                $("#video-like").attr('class', 'like');
                VideoLikes();
                $("#video-like").html('Like ');
                var count = $('#likes-count').html();
                var newCount = (parseInt(count, 10)) - 1;
                $('#likes-count').html(newCount);
            }
            else{
                $("#video-like").attr('class', 'unlike');
                VideoLikes();
                $("#video-like").html('Unlike ');
                var count = $('#likes-count').html();
                var newCount = (parseInt(count, 10)) + 1;
                $('#likes-count').html(newCount);
            }
        },

        function (data) {
            $("#video-like").attr('class', oldValue);
        });
    

    return false;
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

var displayInfo = function (state) {
    switch (state) {
        case 'PLAYING':
            if (!playReq) {
                DataCall("", SERVER + VIDEOS + VIDEO_ID + PREVIEWED, "GET", true,

                function () {
                    if(DEBUG) 
                        console.log("Registered Success");

                    playReq = true;
                },

                function () {
                    
                    if(DEBUG) 
                        console.log("Unregistered preview");

                });
            }
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
function hidePlay(){
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
            $('#hdplug').html('-720p');
            $('#sdplug').html('480p');
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
            $('#sdplug').html('-480p');
            $('#hdplug').html('720p');
            hideHdSd();
        } else {
            //Do nothing
        }
    }

function endPayScreen() {
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

function StreamMedia(AutoPlay, Failure) {

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
            if (!emailPrev && (!isApple)){                

                $('#paymentDiv').html('<div class="pop-full" id="paymentScreen" style="display:block;height:100%"><a href="#" onclick="fbpay();"><img src="../fb_app/images/pay-with-facebook.png" /></a><a href="#" style="color: red; margin: 0px;" onclick="endPayScreen();">Cancel</a></div>');

             /*$('#paymentDiv').html('<form id="payment-form" method="POST" action=""><div style="display:block;" class="pop-full1"><div class="payment-pop-header"><h1>Secure Credit Card Payment</h1></div><div class="form-row first-row-start"><label><span class="required">*</span>Credit Card Number</label><input type="text" id="my-ccn" onKeyDown="limitText("my-ccn", "", '+16+');" onKeyUp="limitText("my-ccn", "", '+16+');" class="card-number" autocomplete="off" maxlength="16" size="20"></div><div class="clear"></div><div class="form-row"><label  style="line-height:29px;"><span class="required">*</span>Security Code (CVC or CVV)</label><input type="text" class="card-cvc" autocomplete="off" maxlength="4" size="4"><div class="payment-cards cvv"><img src="/fb_app/images/cvv-number.png" alt="CVV" title="CVV" width="30" height="21"  /></div></div><div class="form-row"><label style="line-height:29px;"><span class="required">*</span>Expiration (MM/YYYY)</label><input type="text" class="card-expiry-month" maxlength="2" size="2"><span class="separator"> / </span><input type="text" class="card-expiry-year" maxlength="4" size="4"><div class="clear"></div></div><div class="form-row"><button class="submit-button fl" type="submit">Submit Payment</button><a id="spinner-img" class="loader-text" onclick="endPayScreen();" href="#"><font color="#FF0000" style="margin-left: 6px;">Cancel</font></a></div></div><label class="intimation-required"><span class="required">*</span>Required Fields</label></form>');

                
                 $('#payment-form').submit(function (event) {
                    // Disable the submit button to prevent repeated clicks    
                    $('.submit-button').prop('disabled', true);
                    $('#spinner-img').html('');
                    $('#spinner-img').addClass('loader'); 
                    try{
                        Stripe.createToken({
                            number: $('.card-number').val(),
                            cvc: $('.card-cvc').val(),
                            exp_month: $('.card-expiry-month').val(),
                            exp_year: $('.card-expiry-year').val()
                        }, stripeResponseHandler);
                        return false;
                    }
                    catch(ex){
                        if(DEBUG)
                            alert("Key Mismatch");
                        else
                            console.log("Keys Mismatch");
                    }
                });
                //ALLOW IPOD/IPAD DEVICES TO PLAY PREVIEW
                if (!STREAM_FLAG) {
                    $('#paymentDiv').html('');
                    $('#paymentDiv').hide();
                }*/
                
            } else
                $('#paymentDiv').hide();


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

            var json = jQuery.parseJSON(data.responseText);         

            if(json.data.streams_left > 0)
            {                
                if(json.data.downloads_left > 0){

                    $('#toc').html('');
                    $('#paymentDiv').html('');
                    $('#toc').hide();
                    $('#paymentDiv').hide();   
                    $('#video-information-in').hide();
                    $("#about-video-in").attr('style', "display:none");   
                    $('#notifyExpiry').show();                         
                    $('#notifyExpiry').html('<div style="display:block;" class="pop-full1"><a onclick="nextScreen();" href="#" style="display: block; padding-top: 16%;">Your allocated time (30 days) to stream this video has expired<br> and you are now required to purchase this video again. <br> However you still have downloads remaining which you can download using your mobile device(s)</a><div class="form-row"><button type="submit" onclick="nextScreen();" class="submit-button">Buy Now</button><a href="#" onclick="endNotice();"><font color="#FF0000" style="margin-left: 6px;">Cancel</font></a></div></div>');
                }
                else{
                    $('#toc').html('');
                    $('#paymentDiv').html('');
                    $('#toc').hide();
                    $('#paymentDiv').hide();   
                    $('#video-information-in').hide();
                    $("#about-video-in").attr('style', "display:none"); 
                    $('#notifyExpiry').show();                           
                    $('#notifyExpiry').html('<div style="display:block;" class="pop-full1"><a onclick="nextScreen();" href="#" style="display: block; padding-top: 16%;">Your allocated time (30 days) to stream this video has expired<br> and you are now required to purchase this video again.</a><div class="form-row"><button type="submit" onclick="nextScreen();" class="submit-button">Buy Now</button><a href="#" onclick="endNotice();"><font color="#FF0000" style="margin-left: 6px;">Cancel</font></a></div></div>');
                }            
            }
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
                $('#notifyExpiry').remove();
            }
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
                //$('#paymentDiv').html('<form id="payment-form" method="POST" action=""><div style="display:block;" class="pop-full1"><div class="payment-pop-header"><h1>Secure Credit Card Payment</h1></div><div class="form-row first-row-start"><label><span class="required">*</span>Credit Card Number</label><input type="text" id="my-ccn" onKeyDown="limitText("my-ccn", "", '+16+');" onKeyUp="limitText("my-ccn", "", '+16+');" class="card-number" autocomplete="off" maxlength="16" size="20"></div><div class="clear"></div><div class="form-row"><label  style="line-height:29px;"><span class="required">*</span>Security Code (CVC or CVV)</label><input type="text" class="card-cvc" autocomplete="off" maxlength="4" size="4"><div class="payment-cards cvv"><img src="/fb_app/images/cvv-number.png" alt="CVV" title="CVV" width="30" height="21"  /></div></div><div class="form-row"><label style="line-height:29px;"><span class="required">*</span>Expiration (MM/YYYY)</label><input type="text" class="card-expiry-month" maxlength="2" size="2"><span class="separator"> / </span><input type="text" class="card-expiry-year" maxlength="4" size="4"><div class="clear"></div></div><div class="form-row"><button class="submit-button fl" type="submit">Submit Payment</button><a id="spinner-img" class="loader-text" onclick="endPayScreen();" href="#"><font color="#FF0000" style="margin-left: 6px;">Cancel</font></a></div></div><label class="intimation-required"><span class="required">*</span>Required Fields</label></form>');

                
                 /*$('#payment-form').submit(function (event) {
                    // Disable the submit button to prevent repeated clicks    
                    $('.submit-button').prop('disabled', true);
                    $('#spinner-img').html('');
                    $('#spinner-img').addClass('loader'); 
                    try{
                        Stripe.createToken({
                            number: $('.card-number').val(),
                            cvc: $('.card-cvc').val(),
                            exp_month: $('.card-expiry-month').val(),
                            exp_year: $('.card-expiry-year').val()
                        }, stripeResponseHandler);
                        return false;
                    }
                    catch(ex){
                        if(DEBUG)
                            alert("Key Mismatch");
                        else
                            console.log("Keys Mismatch");
                    }
                });
                //ALLOW IPOD/IPAD DEVICES TO PLAY PREVIEW
                if (!STREAM_FLAG) {
                    $('#paymentDiv').html('');
                    $('#paymentDiv').hide();
                }*/
                
            } else{
                $('#paymentDiv').hide();
                startTOC();
            }
        }
}