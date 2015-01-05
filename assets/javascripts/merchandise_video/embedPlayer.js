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

function addEventListeners() {
    
    document.addEventListener("fullscreenchange", function () {

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
        if (navigator.appVersion.indexOf("Mac") != -1 && navigator.userAgent.toLowerCase().indexOf("safari") != -1) {
            if (mac_safari_count > 2 ) {
                if ((window.fullScreen) || (window.innerWidth == screen.width && window.innerHeight == screen.height)) { 
                    console.log("1a");                   
                    var w = screen.width;
                    var h = screen.height;
                    var r = gcd(w, h);
                    var aspectRatio = ((w / r) / (h / r));
                    var disp_height = 0;
                    if (aspectRatio <= 1.33)
                        disp_height = screen.height * 0.40;
                    else
                        disp_height = screen.height * 0.50;

                    $('#vdo-player_media').attr('style', 'overflow: hidden; height:100%; width: 100%; top: 0px; left: 0px; padding: 0px; margin: 0px; display: block;');
                    $('#video-player').attr('height','100%;');
                    $('#vdo-player').attr('style', 'max-width: 100%; height: 100%;');
                    $('#fscrTip').html('View Full Screen');
                    $('#fscreenCtrl').removeClass('exresize');
                    $('#fscreenCtrl').addClass('resize');
                    mac_safari_count = 0;                    
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
        else
        {         
            if($('#fscreenCtrl').hasClass('exresize'))
            { 
                $('#vdo-player').attr('style', 'max-width: 100%; height: 100% !important;');
                $('#fscrTip').html('View Full Screen');
                $('#fscreenCtrl').removeClass('exresize');
                $('#fscreenCtrl').addClass('resize');
                return;   
            }

            var cr_height = screen.height;
            $('#vdo-player').attr('style', 'max-width: 100%; height:100% !important;'); 
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
            
            $('#vdo-player').html('');

            embfblogin(function () {
                
                if(DEBUG) 
                    console.log("Calling Video Stuff");

                VideoStuff();
            },window.location);

            vToggle(2);

            $('#video-information-in').hide();            
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

            embfblogin(function () {
                
                if(DEBUG) 
                    console.log("Calling Video Stuff");

                VideoStuff();
            },window.location);

            vToggle(2);

            $('#video-information-in').hide();            
            $('#comment-error').hide();
    }

}

function VideoStuff() {
    VideoInformation(function () {        
        RealTimeActivities();
    });
}
function VideoInformation(SuccessCallBack) {    
    DataCall("id=1&device=FBApp", SERVER + VIDEOS + VIDEO_ID + "/" + VIDEO_INFORMATION, "GET", true,

    function (data) 
    {
        try {
            		VIDEO = data.data.video;
            		PUBLISHER = data.data.video.user;

            		$('#video-main-title').html(VIDEO.title);
            		$("#video-title").html(VIDEO.title);
            		$("#video-title-in").html(VIDEO.title);
            		$('#video-caption').html(VIDEO.description);
            		$('#video-caption-in').html(VIDEO.description);
            		var dmy = VIDEO.media_creation_date.substr(0, 10);
            		var y = dmy.substr(0, 4);
            		var m = dmy.substr(5, 2);
            		var d = dmy.substr(8, 2);
            		var month = getMonth(m);
            		$('#creation-date').html(month + " " + d + ", " + y);
            		$('#creation-date').attr('title', 'Creation Date' + month + " " + d + ", " + y);            

            		var pubName = getParameterByName('page_name');
            		
            		if (pubName=="")
            		{            			
                		$('#publisher-name').html("<a href='https://www.facebook.com/"+PUBLISHER.uid+"' target='_blank'>"+PUBLISHER.first_name + " " + PUBLISHER.last_name+"</a>");
                		$("#publisher-name-in").html("<a style='color:#FFFFFF;' href='https://www.facebook.com/"+PUBLISHER.uid+"' target='_blank'>"+PUBLISHER.first_name + " " + PUBLISHER.last_name+"</a>");
            		}
            		else
            		{
                		var pageLink = getParameterByName('page_id');
                		$('#publisher-name').html("<a href='https://www.facebook.com/"+pageLink+"' target='_blank'>"+pubName+"</a>");
                		$("#publisher-name-in").html("<a style='color:#FFFFFF;' href='https://www.facebook.com/"+pageLink+"' target='_blank'>"+pubName+"</a>");
            		}
            		
            		$("#video-category").html(VIDEO.category_name);            
            		$("#video-category").show();


            		if (VIDEO.total_sold < 1) 
            		{                
                		$('#views-count-in').removeClass("eye");
                		$('#views-count-in').addClass("clear");
            		}
            		else
                		$('#views-count-in').html(VIDEO.total_sold);

            		$('#video-price-in').html('$' + VIDEO.price);

            		if (TOS) 
            		{                
                		$('#video-information-in').hide();
                		$("#about-video-in").attr('style', "display:none");
                		$('#toc').hide();
                		$('#video-information-in').show();
                		$('#toc').html('<div style="display:block;height: 86%; top: 62px;z-index:999999 !important;" class="pop-full"><h4>What exactly am I buying?</h4><ul><li style="font-size:14px;">Ability to stream on Facebook (via browser) and download to mobile devices of your choice via LittleCast mobile and tablet apps for iOS and Android</li><li style="font-size:14px;">Stream and download, as many times as you like, for 30 days from the time of purchase. Download a video to your mobile device and keep it forever.</li></ul><p><input type="checkbox" id="iAgree"><label for="iAgree"> I have read and agree to LittleCast Terms of Use </label><a href="/payment-addendum/" target="_blank">Payment Addendum.</a>&nbsp; All Sales are final.</p><p><span color="#FF0000"><a id="warning-Text" href="#"></a></p><p class="butonP"><a id="warning-Text" href="#"><input type="button" onclick="endTOC();" value="Make Payment" class="app-screen-btn"></a><a onclick="startTOC();" href="#">Cancel</a></p></div>');	
            		}

            		var preview = '';

            		if (VIDEO.processed_preview_information) 
            		{
                		var len = VIDEO.processed_preview_information.length;
                		for (i = 0; i < len; i++)
                    			if (VIDEO.processed_preview_information[i].format == "mpeg4")
                        			preview = VIDEO.processed_preview_information[i].signed_processed_keys;
            		}

            		LoadHTMLPlayer(VIDEO.thumbnails[0].thumbnail_signed_path, preview, VIDEO.title, true);            

            		StreamMedia(false,
            				function () {                
                				if (getParameterByName('buy') == "invoke") 
                				{
                    					if (BROWSER.browser != "FB") 
                    					{
                        						projekktor('#vdo-player').setStop();
                        						projekktor('#vdo-player').setPause();
                    					}
                				}
            					});
            		SuccessCallBack();
        	} 
        	catch (ex) 
        	{
            	if(DEBUG) 
                console.log("Exception: " + ex.message);
        	}
        	try
        	{

            		if (VIDEO.media_creation_date != null) 
            		{
                		var stamp = TimeStamp(VIDEO.media_creation_date);
                		$('#video-stamp').html($('#video-stamp-in').html(stamp.user_stamp));               
                		var dmy = VIDEO.media_creation_date.substr(0, 10);
                		var y = dmy.substr(0, 4);
                		var m = dmy.substr(5, 2);
                		var d = dmy.substr(8, 2);
                		var month = getMonth(m);
                		$('#video-stamp').attr('title', 'Published Date: ' + month + " " + d + ", " + y);
            		}

        	}
        	catch (err) 
        	{
            	if(DEBUG) 
	                console.log("Invalid DateTime Format. << Media Creation Date.");
        	}

        	$('#video-views').html(VIDEO.view_count);
    },

    function (data) {
        alert("Failed to load video. Refresh or try again later.");
    });
}

function LoadHTMLPlayer(poster, video, title, buy) {

    var player = '';

    $(".video-player").css("height","100%;");
    $("#video-player").attr("height","100%;");
   
    var ua = navigator.userAgent.toLowerCase();
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){
    var ieversion=new Number(RegExp.$1) 
        if (ieversion>=9)
        {            
            player = player + '<video id="vdo-player" class="projekktor" poster="' + poster + '" title="' + title + '" width=100% height=100% controls allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true">';
        }
    }
    else
    {
        player = player + '<video id="vdo-player" class="projekktor" poster="' + poster + '" title="' + title + '" style="position: absolute; top:0; left: 0; margin:0; padding:0;" controls allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true">';
    }
   
    
    if (!(ua.indexOf("msie") > -1))
        player = player + '<source src="' + video + '" type="video/mp4" /></video>';
    else
        player = player + '<source src="' + video + '" type="video/mp4" codecs="avc1.42E01E,mp4a.40.2"/></video>';

    $('#html-player').html(player);

    if (ua.indexOf("firefox") > -1){
            var controlsTemplate = '<div class="play-bar-wrap"><div class="play-bar-wraper"><div %{scrubber}><div %{loaded}></div><div %{playhead}></div><div %{scrubberdrag}></div></div></div></div><div class="control-wraper clearfix"><ul class="play fl"><li><a href="#" onclick="return false;"><div id="playButton" onclick="playBtn();" %{play}></div><div id="pauseButton" onclick="pauseBtn();" %{pause}></div></a></li><li id="vBar"><span class="ppmute" id="vmute" onclick="vToggle(1);" onmouseover="dispVolMute();" onmouseout="hideVolTip();"></span><span onclick="vToggle(2);" style="display:none" id="vmax" class="ppvmax" onmouseover="dispVolTip();" onmouseout="hideVolTip();"></span><span style="display:none" id="volTip"><ul><li><a id="volText" href="#">Mute</a></li></ul></span></li></ul><div class="left-section clearfix"><ul class="link icos fl"><li><span class="btnpreview" id="previewBtn" onclick="btnPreview();">Preview</span></li><li><span class="btnabout" id="aboutBtn" onclick="btnAbout();">About</span></li></ul></div><div class="right-section clearfix"><ul class="link icos fl"><li><div %{timeleft}>%{hr_elp}:%{min_elp}:%{sec_elp} <span class="grey">/ %{hr_dur}:%{min_dur}:%{sec_dur}</span></div></li><li id="fscrWrapper"><span class="resize" id="fscreenCtrl" onclick="fscreen();" onmouseover="dispFscr();" onmouseout="hideFscr();"></span><span style="display:none" id="fscr" onmouseover="dispFscr();" onmouseout="hideFscr();"><ul><li><a href="#" id="fscrTip" >View Full Screen</a></li></ul></span></li><li id="hdWrapper"><a href="#" ><span id="hdsdswitch" class="hdsd" onmouseover="dispHdSd();" onmouseout="hideHdSd();"></span></a><span style="display:none" id="hdSpanBar" onmouseover="dispHdSd();" onmouseout="hideHdSd();"><ul><li><a href="#" id="hdplug" onclick="hdswitch();">720p</a></li><li><a id="sdplug" href="#" onclick="sdswitch();">480p</a></li></ul></span></li></ul><div class="player-logo"><a href="/" target="_blank" onmouseover="dispLcTip();" onmouseout="hideLcTip();"></a><span style="display:none" id="lcTip" onmouseover="dispLcTip();" onmouseout="hideLcTip();"><ul><li><a href="#">Watch on LittleCast</a></li></ul></span></div>';
        }
        else{
            var controlsTemplate = '<div class="play-bar-wrap"><div class="play-bar-wraper"><div %{scrubber}><div %{loaded}></div><div %{playhead}></div><div %{scrubberdrag}></div></div></div></div><div class="control-wraper clearfix"><ul class="play fl"><li><a href="#" onclick="return false;"><div %{play}></div><div %{pause}></div></a></li><li id="vBar"><span class="ppmute" id="vmute" onclick="vToggle(1);" onmouseover="dispVolMute();" onmouseout="hideVolTip();"></span><span onclick="vToggle(2);" style="display:none" id="vmax" class="ppvmax" onmouseover="dispVolTip();" onmouseout="hideVolTip();"></span><span style="display:none" id="volTip"><ul><li><a id="volText" href="#">Mute</a></li></ul></span></li></ul><div class="left-section clearfix"><ul class="link icos fl"><li><span class="btnpreview" id="previewBtn" onclick="btnPreview();">Preview</span></li><li><span class="btnabout" id="aboutBtn" onclick="btnAbout();">About</span></li></ul></div><div class="right-section clearfix"><ul class="link icos fl"><li><div %{timeleft}>%{hr_elp}:%{min_elp}:%{sec_elp} <span class="grey">/ %{hr_dur}:%{min_dur}:%{sec_dur}</span></div></li><li id="fscrWrapper"><span class="resize" id="fscreenCtrl" onclick="fscreen();" onmouseover="dispFscr();" onmouseout="hideFscr();"></span><span style="display:none" id="fscr" onmouseover="dispFscr();" onmouseout="hideFscr();"><ul><li><a href="#" id="fscrTip" >View Full Screen</a></li></ul></span></li><li id="hdWrapper"><a href="#" ><span id="hdsdswitch" class="hdsd" onmouseover="dispHdSd();" onmouseout="hideHdSd();"></span></a><span style="display:none" id="hdSpanBar" onmouseover="dispHdSd();" onmouseout="hideHdSd();"><ul><li><a href="#" id="hdplug" onclick="hdswitch();">720p</a></li><li><a id="sdplug" href="#" onclick="sdswitch();">480p</a></li></ul></span></li></ul><div class="player-logo"><a href="/" target="_blank" onmouseover="dispLcTip();" onmouseout="hideLcTip();"></a><span style="display:none" id="lcTip" onmouseover="dispLcTip();" onmouseout="hideLcTip();"><ul><li><a href="#">Watch on LittleCast</a></li></ul></span></div>';
        }
      
    if (buy == true) {     
            controlsTemplate = controlsTemplate + '<div class="button" id="player-buy-button"><a href="#" onclick="startTOC();">Buy Now</a></div>';
    }

    controlsTemplate = controlsTemplate + '</div></div>'; 
      
        if (ua.indexOf("firefox") > -1){                                
                projekktor('#vdo-player', {
                iframe:true,
                playerFlashMP4: SERVER_URL+"/assets/StrobeMediaPlayback.swf",
                playerFlashMP3: SERVER_URL+"/assets/StrobeMediaPlayback.swf",
                enableFullscreen: true,
                enableKeyboard: true,
                debug: false,
                imageScaling:'aspectratio',                
                videoScaling: 'aspectratio',
                plugin_controlbar: {                
                    controlsDisableFade: false,  
                    showOnStart: false,
                    showOnIdle: false,                 
                    controlsTemplate: controlsTemplate,
                }
            });                
        }
        else{
            projekktor('#vdo-player', {
                iframe:true,
                playerFlashMP4: SERVER_URL+"/assets/StrobeMediaPlayback.swf",
                playerFlashMP3: SERVER_URL+"/assets/StrobeMediaPlayback.swf",
                enableFullscreen: true,
                enableKeyboard: true,
                debug: false,
                imageScaling:'aspectratio',
                videoScaling: 'aspectratio',
                plugin_controlbar: {                
                    controlsDisableFade: true,
                    showOnStart: true,
                    showOnIdle: true,
                    controlsTemplate: controlsTemplate
                }
            }); 
    }
}
var recStrem = function (state) {
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
            break;
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
                //alert('PLAYREQ AFTER FUNCTION CALL: '+playReq);
            }
            playReq = true;
            break;
        case 'STOPPED':
        case 'COMPLETED':               
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
function StreamMedia(AutoPlay, Failure) {

        DataCall("device=FBApp", SERVER + VIDEOS + VIDEO_ID + "/" + STREAM_REQUEST, "GET", true,

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
               

               
                    if (AutoPlay == true)
                    {
                        projekktor('#vdo-player').setPlay();
                        if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1)
                        {
                                 if (!playReq) 
                                 {
                                    DataCall("device=FBApp&request_type=stream_request", SERVER + VIDEOS + VIDEO_ID + UPDATE_STREAM, "POST", true,
                                    function () {
                                        if(DEBUG) 
                                            console.log("Stream Success");
                                        },function () {
                                            if(DEBUG) 
                                                console.log("STREAM REQUEST FAIL");
                                    });
                                    playReq = true;
                                }
                        }
                    }
                    else
                        projekktor('#vdo-player').setStop();
                
                
                projekktor('#vdo-player').removeListener('state', displayInfo);          
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

            
            $('#notifyExpiry').hide();
            $('#notifyExpiry').html('');

            //INSERT CHECKOUT WITH PAYPAL SCREEN
            if (!emailPrev){               
         
                $('#paymentDiv').html('<form id="payment-form" method="POST" action=""><div style="display:block;z-index:999999 !important;" class="pop-full1"><div class="payment-pop-header"><h1>Secure Credit Card Payment</h1><p>This is a secure 128-bit SSL encrypted payment.</p></div><div class="form-row first-row-start"><label><span class="required">*</span>Credit Card Number</label><div class="clear"></div><input type="text" id="my-ccn" onKeyDown="limitText("my-ccn", "", '+16+');" onKeyUp="limitText("my-ccn", "", '+16+');" class="card-number" autocomplete="off" maxlength="16" size="20"><div class="payment-cards"><a href="#"><img src="/fb_app/images/ico-visa.jpg" alt="Visa Card" title="Visa Card" width="33" height="21" /></a><a href="#"><img src="/fb_app/images/ico-mastercard.jpg" alt="Master Card" title="Master Card" width="33" height="21" /></a><a href="#"><img src="/fb_app/images/ico-amex.jpg" alt="Amercian Express" title="Amercian Express" width="33" height="21" /></a><a href="#"><img src="/fb_app/images/ico-discover.jpg" alt="Discover" title="Discover" width="33" height="21" /></a><a href="#"><img src="/fb_app/images/ico-dinner-club.png" alt="Dinner Club" title="Discover" width="33" height="21" /></a><a href="#"><img src="/fb_app/images/ico-jcb.png" alt="JCB" title="JCB" width="33" height="21" /></a><div class="clear"></div></div><div class="clear"></div></div><div class="form-row"><label><span class="required">*</span>Security Code (CVC or CVV)</label><p>For American Express , it is the 4-digit code displayed in the front. For others, the 3 digit code on the back of your card.</p><div class="clear"></div><input type="text" class="card-cvc" autocomplete="off" maxlength="4" size="4"><div class="payment-cards cvv"><img src="/fb_app/images/cvv-number.png" alt="CVV" title="CVV" width="30" height="21"  /></div><div class="clear"></div></div><div class="form-row"><label><span class="required">*</span>Expiration (MM/YYYY)</label><p>The date your credit card expired. Find this on the front of your credit card.</p><div class="clear"></div><input type="text" class="card-expiry-month" maxlength="2" size="2"><span class="separator"> / </span><input type="text" class="card-expiry-year" maxlength="4" size="4"></div><div class="form-row"><button class="submit-button fl" type="submit">Submit Payment</button><a id="spinner-img" class="loader-text" onclick="endPayScreen();" href="#"><span style="margin-left: 6px;">Cancel</a></div></div><label class="intimation-required"><span class="required">*</span>Required Fields</label></form>');
         
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
                }
                
            } else
                $('#paymentDiv').hide();
         
            if (AutoPlay == true)
                    projekktor('#vdo-player').setStop();        

            if (TOS){
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

                $('#vBar').hide();
                //12 APRIL FIX LIT 997
                if(!TOS)
                {
                    $('#video-information-in').hide();
                    $("#about-video-in").attr('style', "display:none");
                }          

            $('#player-buy-button').show(); 

        Failure();
    });        
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
                $('#paymentDiv').html('<form id="payment-form" method="POST" action=""><div style="display:block;z-index:999999 !important;" class="pop-full1"><div class="payment-pop-header"><h1>Secure Credit Card Payment</h1><p>This is a secure 128-bit SSL encrypted payment.</p></div><div class="form-row first-row-start"><label><span class="required">*</span>Credit Card Number</label><div class="clear"></div><input type="text" class="card-number" autocomplete="off" maxlength="16" size="20"><div class="payment-cards"><a href="#"><img src="/fb_app/images/ico-visa.jpg" alt="Visa Card" title="Visa Card" width="33" height="21" /></a><a href="#"><img src="/fb_app/images/ico-mastercard.jpg" alt="Master Card" title="Master Card" width="33" height="21" /></a><a href="#"><img src="/fb_app/images/ico-amex.jpg" alt="Amercian Express" title="Amercian Express" width="33" height="21" /></a><a href="#"><img src="/fb_app/images/ico-discover.jpg" alt="Discover" title="Discover" width="33" height="21" /></a><a href="#"><img src="/fb_app/images/ico-dinner-club.png" alt="Dinner Club" title="Discover" width="33" height="21" /></a><a href="#"><img src="/fb_app/images/ico-jcb.png" alt="JCB" title="JCB" width="33" height="21" /></a><div class="clear"></div></div><div class="clear"></div></div><div class="form-row"><label><span class="required">*</span>Security Code (CVC or CVV)</label><p>For American Express , it is the 4-digit code displayed in the front. For others, the 3 digit code on the back of your card.</p><div class="clear"></div><input type="text" class="card-cvc" autocomplete="off" maxlength="4" size="4"><div class="payment-cards cvv"><img src="/fb_app/images/cvv-number.png" alt="CVV" title="CVV" width="30" height="21"  /></div><div class="clear"></div></div><div class="form-row"><label><span class="required">*</span>Expiration (MM/YYYY)</label><p>The date your credit card expired. Find this on the front of your credit card.</p><div class="clear"></div><input type="text" class="card-expiry-month" maxlength="2" size="2"><span class="separator"> / </span><input type="text" class="card-expiry-year" maxlength="4" size="4"></div><div class="form-row"><button class="submit-button fl" type="submit">Submit Payment</button><a id="spinner-img" class="loader-text" onclick="endPayScreen();" href="#"><span color="#FF0000" style="margin-left: 6px;">Cancel</span></a></div></div><label class="intimation-required"><span class="required">*</span>Required Fields</label></form>');
            
                
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
                }
                
            } 
            else
            {
                $('#paymentDiv').hide();
                startTOC();
            }
    }
}
var displayInfo = function (state) {
    switch (state) {
        case 'STARTING':
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf("firefox") > -1)
            {            
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
            if (!playReq) {
                DataCall("device=FBApp", SERVER + VIDEOS + VIDEO_ID + PREVIEWED, "GET", true,

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
            break;
        case 'COMPLETED':
        case 'STOPPED':
            $('#video-information-in').show();
            $("#about-video-in").attr('style', "display:none");
            $('#previewBtn').show();
            $('#aboutBtn').show();
            $('#vBar').hide();
            $('#hdsdswitch').hide();
            $('#fscreenCtrl').hide();
            $('#hdWrapper').hide();
            $('#fscrWrapper').hide();
            //IE FIX
            var ua = navigator.userAgent.toLowerCase();
            if(ua.indexOf("firefox") > -1)
                {
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
    $("#payment-form").hide();
    $('#player-buy-button').hide();
    $('#video-price-in').hide();
    $("#video-category").show();    
    $('#video-price-in').hide();

    //SHOW SUCCESS MESSAGE HERE
    $('#paymentDiv').html('');
    $('#paymentDiv').html('<div id="notifyExpiry"><div style="display:block;z-index:999999 !important;" class="pop-full1"><div class="top-space"><h2 class="tic">Purchase Complete</h2><a href="#" style="display: block;">We have sent you an email with payment confirmation and links to LittleCast <br>iOS and Android apps to download.</a><button onclick="playBoughtVid();" class="submit-button" >Play Video</button></div></div></div>');

}
function stripeFail() {
    $('#spinner-img').removeClass('loader');
    $('.submit-button').prop('disabled', false);    
    $("#payment-form").hide();
    $('#video-price-in').show();
 
    $("#video-category").show();    
}
function playBoughtVid(){
    window.setTimeout(StreamMedia, 100, true, function () {
        $('#paymentDiv').html('');
        $('#paymentDiv').hide();        
    });    
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
function playBtn(){
    projekktor('#vdo-player').setPlay();
    $('#playButton').removeClass('active');
    $('#playButton').addClass('inactive');
    $('#pauseButton').removeClass('inactive');
    $('#pauseButton').addClass('active');
}
function pauseBtn(){
    projekktor('#vdo-player').setPause();
    $('#playButton').removeClass('inactive');
    $('#playButton').addClass('active');
    $('#pauseButton').removeClass('active');
    $('#pauseButton').addClass('inactive');
}

function startTOC() 
{
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
            $('#toc').show();
            $('#toc').html('<div style="display:block;height: 86%; top: 62px;z-index:999999 !important;" class="pop-full"><h4>What exactly am I buying?</h4><ul><li style="font-size:14px;">Ability to stream on Facebook (via browser) and download to mobile devices of your choice via LittleCast mobile and tablet apps for iOS and Android</li><li style="font-size:14px;">Stream and download, as many times as you like, for 30 days from the time of purchase. Download a video to your mobile device and keep it forever.</li></ul><p><input type="checkbox" id="iAgree"><label for="iAgree"> I have read and agree to LittleCast Terms of Use </label><a href="/payment-addendum/" target="_blank">Payment Addendum.</a>&nbsp; All Sales are final.</p><p><span color="#FF0000"><a id="warning-Text" href="#"></a></p><p class="butonP"><a id="warning-Text" href="#"><input type="button" onclick="endTOC();" value="Make Payment" class="app-screen-btn"></a><a onclick="startTOC();" href="#">Cancel</a></p></div>');
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
                $('#video-information-in').show();
                $("#about-video-in").attr('style', "display:none");
                $('#paymentDiv').html('');            
                $('#toc').show();
                $('#toc').html('<div style="display:block;height: 86%; top: 62px;z-index:999999 !important;" class="pop-full"><h4>What exactly am I buying?</h4><ul><li style="font-size:14px;">Ability to stream on Facebook (via browser) and download to mobile devices of your choice via LittleCast mobile and tablet apps for iOS and Android</li><li style="font-size:14px;">Stream and download, as many times as you like, for 30 days from the time of purchase. Download a video to your mobile device and keep it forever.</li></ul><p><input type="checkbox" id="iAgree"><label for="iAgree"> I have read and agree to LittleCast Terms of Use </label><a href="/payment-addendum/" target="_blank">Payment Addendum.</a>&nbsp; All Sales are final.</p><p><span color="#FF0000"><a id="warning-Text" href="#"></a></p><p class="butonP"><a id="warning-Text" href="#"><input type="button" onclick="endTOC();" value="Make Payment" class="app-screen-btn"></a><a onclick="startTOC();" href="#">Cancel</a></p></div>');
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
}function btnPreview() {
    projekktor('#vdo-player').setPlay();
    $('#previewBtn').hide();
    $('#aboutBtn').hide();
}

function btnAbout() {
     
        if (($('#about-video-in').is(":visible"))) {           
            $("#about-video-in").attr('style', "display:none");
        } else {
            $('#video-information-in').show();
            $("#about-video-in").attr('style', "display:block");
        }    
}

function hideHdSd() {
    $('#hdSpanBar').hide();
}

function fscreen() {
    if ((window.fullScreen) || (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
        exitfs();
    } else {

        projekktor('#vdo-player').setFullscreen(true);
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

            $('#video-player').css('width', '100%');
            $('#video-player').css('height', screen.height+'px;');  
            $('#video-player').attr('height', screen.height+'px;');                                  
            $('#vdo-player').attr('style', 'max-width: 100%; height:'+screen.height+'px;');                     
            $('#vdo-player_media').attr('style', 'max-width: 100%; height:'+screen.height+'px;');                              
            
            goFullscreen('video-player');
        } else {
            goFullscreen('vdo-player');
        }
    }

}
function exitfs() {

    if ($.browser.webkit) {

        $('#vdo-player').attr('style', 'max-width: 100%; height: 100%;');
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
function vToggle(state) {
    if (state == 1) {
        $('#vmute').hide();
        $('#vmax').show();
    } else {
        $('#vmute').show();
        $('#vmax').hide()
    }
}
function endTOC() {
    if (document.getElementById("iAgree").checked) 
    {
        $('#toc').hide();
        $('#video-information-in').hide();
         
        $('#paymentDiv').html('<form id="payment-form" method="POST" action=""><div style="display:block;z-index:999999 !important;" class="pop-full1"><div class="payment-pop-header"><h1>Secure Credit Card Payment</h1><p>This is a secure 128-bit SSL encrypted payment.</p></div><div class="form-row first-row-start"><label><span class="required">*</span>Credit Card Number</label><div class="clear"></div><input type="text" class="card-number" autocomplete="off" maxlength="16" size="20"><div class="payment-cards"><a href="#"><img src="/fb_app/images/ico-visa.jpg" alt="Visa Card" title="Visa Card" width="33" height="21" /></a><a href="#"><img src="/fb_app/images/ico-mastercard.jpg" alt="Master Card" title="Master Card" width="33" height="21" /></a><a href="#"><img src="/fb_app/images/ico-amex.jpg" alt="Amercian Express" title="Amercian Express" width="33" height="21" /></a><a href="#"><img src="/fb_app/images/ico-discover.jpg" alt="Discover" title="Discover" width="33" height="21" /></a><a href="#"><img src="/fb_app/images/ico-dinner-club.png" alt="Dinner Club" title="Discover" width="33" height="21" /></a><a href="#"><img src="/fb_app/images/ico-jcb.png" alt="JCB" title="JCB" width="33" height="21" /></a><div class="clear"></div></div><div class="clear"></div></div><div class="form-row"><label><span class="required">*</span>Security Code (CVC or CVV)</label><p>For American Express, it is the 4-digit code displayed in the front. For others, the 3 digit code on the back of your card.</p><div class="clear"></div><input type="text" class="card-cvc" autocomplete="off" maxlength="4" size="4"><div class="payment-cards cvv"><img src="/fb_app/images/cvv-number.png" alt="CVV" title="CVV" width="30" height="21"  /></div><div class="clear"></div></div><div class="form-row"><label><span class="required">*</span>Expiration (MM/YYYY)</label><p>The date your credit card expired. Find this on the front of your credit card.</p><div class="clear"></div><input type="text" class="card-expiry-month" maxlength="2" size="2"><span class="separator"> / </span><input type="text" class="card-expiry-year" maxlength="4" size="4"></div><div class="form-row"><button class="submit-button fl" type="submit">Submit Payment</button><a id="spinner-img" class="loader-text" onclick="endPayScreen();" href="#"><span color="#FF0000" style="margin-left: 6px;">Cancel</a></div></div><label class="intimation-required"><span class="required">*</span>Required Fields</label></form>');

        
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
            $('#paymentDiv').show();                
    } else {            
            $('#warning-Text').html('You must agree to the terms and conditions first');
    }
}