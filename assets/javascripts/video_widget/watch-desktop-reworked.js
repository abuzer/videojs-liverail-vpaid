var DEBUG = true;
var SERVER = SERVER_URL;
var REGISTER = "device_signup/";
var STREAM_REQUEST = "stream_request.json";
var VIDEOS = "videos/";
var PREVIEWED = "/previewed.json";
var UPDATE_STREAM = "/update_video_stats.json";
var COMMENT = "add_comment.json";
var VIDEO_LIKES = "video_likes.json";
var LIKE = "liked.json";                                    // >> VIDEOS
var UNLIKE = "unliked.json"
var DEVICE_AUTH = '';
var vid='';
var disableVideoInformation = false;
var PLAYER_ID = 0;
var PUBLISHER = "";
var BUY_URL;
var VIDEO_RECORD_TYPE  = 0;
var VIDEO_TYPE  = '';
var VIDEO_TITLE= '';
var VIDEO_UUID= '';
var DEVICE = 'embeded'
var Vid_player_height = 0;
var Vid_player_width = 0;
var BROWSER = '';
var IS_EMBEDDED = false;
var BUFFERED = false;
var THREE_SEC_STREAM_CALL_SENT = false;
var VIEW_CALL_SENT = false;
var playEventLog = false;


/*
stripeResponseHandler
*/
function stripeResponseHandler(status, response,videoid) {

        if (response.error)
        {
            $('#spinner-img').removeClass('loader');
            $('#spinner-img').html(response.error.message);
            $('.submit-button').prop('disabled', false);
        }
        else
        {
          var $form = $('#payment-form');
          var token = response.id;
          $form.append($('<input type="hidden" name="stripeToken" />').val(token));
          var tryAgain = 0;
          if (tryAgain < 4){
              DataCall ("video_id=" + videoid+"&token="+token+"&device=website", SERVER_URL + "payments/" + "make_stripe_payment.json", "POST", true,
              function (data){
                boughtVideo(videoid);
              },
              function (data){

                      $('#spinner-img').removeClass('loader');
                      $('.submit-button').prop('disabled', false);
                      var json = jQuery.parseJSON(data.responseText);
                      $('#spinner-img').html(json.data.strip_error_message);
              });
                if( !($('#spinner-img').hasClass('loader'))){
                    tryAgain = 4;
                }
                  else{
                  tryAgain = tryAgain + 1;
                }
            }
            else{
                    unboughtVideo(videoid, false, false)();
            }
      }
}
/*
showStripeForm
*/
function showStripeForm(videoid)
{

  FB.init({
			appId      : FB_APP_ID,
			status     : true,
			cookie     : true,
			xfbml      : true,
			oauth      : true
		});

  embfblogin(videoid);

}

function stripeFormLoad(videoid)
{
    if (!(document.getElementById("iAgree").checked))
    {
        $('#warning-Text').html('<span color="#FF0000">You must agree to the terms and conditions first</span>');
    }
    else
    {
        $('#toc'+videoid).hide();
        $('#toc'+videoid).html('');

        $('#video-information-in'+videoid).hide();
        $("#about-video-in"+videoid).attr('style', "display:none");

        $('#paymentDiv'+videoid).show();
        $('#paymentDiv'+videoid).html('<form id="payment-form" method="POST" action=""><div style="display:block;" class="pop-full1"><div class="payment-pop-header"><h1>Secure Credit Card Payment</h1><p>This is a secure 128-bit SSL encrypted payment.</p></div><div class="form-row first-row-start"><label><span class="required">*</span>Credit Card Number</label><div class="clear"></div><input type="text" id="my-ccn'+videoid+'" onKeyDown="limitText("my-ccn'+videoid+'", "", '+16+');" onKeyUp="limitText("my-ccn'+videoid+'", "", '+16+');" class="card-number" autocomplete="off" maxlength="16" size="20"><div class="payment-cards"><a href="#"><img src="/fb_app/images/ico-visa.jpg" alt="Visa Card" title="Visa Card" width="33" height="21" /></a><a href="#"><img src="/fb_app/images/ico-mastercard.jpg" alt="Master Card" title="Master Card" width="33" height="21" /></a><a href="#"><img src="/fb_app/images/ico-amex.jpg" alt="Amercian Express" title="Amercian Express" width="33" height="21" /></a><a href="#"><img src="/fb_app/images/ico-discover.jpg" alt="Discover" title="Discover" width="33" height="21" /></a><a href="#"><img src="/fb_app/images/ico-dinner-club.png" alt="Dinner Club" title="Discover" width="33" height="21" /></a><a href="#"><img src="/fb_app/images/ico-jcb.png" alt="JCB" title="JCB" width="33" height="21" /></a><div class="clear"></div></div><div class="clear"></div></div><div class="form-row"><label><span class="required">*</span>Security Code (CVC or CVV)</label><p>For American Express , it is the 4-digit code displayed in the front. For others, the 3 digit code on the back of your card.</p><div class="clear"></div><input type="text" class="card-cvc" id=autocomplete="off" maxlength="4" size="4"><div class="payment-cards cvv"><img src="/fb_app/images/cvv-number.png" alt="CVV" title="CVV" width="30" height="21"  /></div><div class="clear"></div></div><div class="form-row"><label><span class="required">*</span>Expiration (MM/YYYY)</label><p>The date your credit card expired. Find this on the front of your credit card.</p><div class="clear"></div><input type="text" class="card-expiry-month" maxlength="2" size="2"><span class="separator"> / </span><input type="text" class="card-expiry-year" maxlength="4" size="4"></div><div class="form-row"><button class="submit-button fl" type="submit">Submit Payment</button><a id="spinner-img" class="loader-text" onclick="hideStripeForm('+videoid+');" href="#"><span style="margin-left: 6px;">Cancel</a></div></div><label class="intimation-required"><span class="required">*</span>Required Fields</label></form>');
        $('#payment-form').submit(function (event)
        {            // Disable the submit button to prevent repeated clicks
                $('.submit-button').prop('disabled', true);
                $('#spinner-img').html('');
                $('#spinner-img').addClass('loader');
                try{
                    Stripe.createToken({
                    number: $('.card-number').val(),
                    cvc: $('.card-cvc').val(),
                    exp_month: $('.card-expiry-month').val(),
                    exp_year: $('.card-expiry-year').val()
                }, function(status,response, video_id){
                    stripeResponseHandler(status, response,videoid);
                });
                return false;
            }
        catch(ex){
            if(DEBUG)
                alert("Key Mismatch");
            else
                console.log("Keys Mismatch");
            }
        });
    }
}


/***************************************** PLAYER CUSTOMIZED WITH ID DOWNWARDS *****************************************************************************************************************************/
function hide_controls_on_play(videoid)
{
    $('#playButton'+videoid).removeClass('active');
    $('#playButton'+videoid).addClass('inactive');
    $('#pauseButton'+videoid).removeClass('inactive');
    $('#pauseButton'+videoid).addClass('active');
    
    if ($('#thumbContainer').is(":visible"))
        $('#thumbContainer').hide();
    
    if ($('.thumbContainer').is(":visible"))         
        $('.thumbContainer').hide();

    if( BROWSER.browser == 'FF' )
    {
        $('.ppstart').removeClass('active')
        $('.ppstart').addClass('inactive')
    }
}

function playBtn(videoid){  
    projekktor('#vdo-player'+videoid).setPlay();
    hide_controls_on_play(videoid);
}

function pauseBtn(videoid){
    projekktor('#vdo-player'+videoid).setPause();
    $('#playButton'+videoid).removeClass('inactive');
    $('#playButton'+videoid).addClass('active');
    $('#pauseButton'+videoid).removeClass('active');
    $('#pauseButton'+videoid).addClass('inactive');
}
/*
goFullScreen
*/
function goFullscreen(id)
{
    var element = document.getElementById(id);

    if (element.mozRequestFullScreen)
	{
		element.mozRequestFullScreen();
	}
	else if (element.webkitRequestFullScreen)
	{
        element.webkitRequestFullScreen();
	}
	else
	{
		try
		{
            element.requestFullScreen();
        }
        catch (ex)
		{
            element.msRequestFullScreen();
        }
	}
}
/*
exitfs
*/
function exitfs(playerID)
{
	if(typeof(playerID)=='undefined')
	   playerID = '';

    if ($.browser.webkit) {

        var w = screen.width;
        var h = screen.height;
        var r = gcd(w, h);
        var aspectRatio = ((w / r) / (h / r));
        var disp_height = 0;
        if (aspectRatio <= 1.33)
            disp_height = screen.height * 0.40;
        else
            disp_height = screen.height * 0.50;
        $('#vdo-player'+playerID).attr('style', 'max-width: 100%; height: ' + disp_height + 'px;');
        if (navigator.appVersion.indexOf("Mac") != -1 && navigator.userAgent.toLowerCase().indexOf("safari") != -1) {
            $('#fscrTip'+playerID).html('View Full Screen');
            $('#fscreenCtrl'+playerID).removeClass('exresize');
            $('#fscreenCtrl'+playerID).addClass('resize');
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
    $('.html-player').css({'width': Vid_player_width,'height': Vid_player_height });
}
/*
fscreen
*/
function fscreen(video_id)
{
	if(typeof(video_id)=='undefined')
	   video_id = '';

    setVid(video_id);

    if ((window.fullScreen) || (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
        exitfs(video_id);
        $('#fscrTip'+video_id).html('View Full Screen');
    } else {

        projekktor('#vdo-player'+video_id).setFullscreen(true);
        $('#fscrTip'+video_id).html('Exit Full Screen');

        if ($.browser.webkit) {
            var disp_height = screen.height;

            if (navigator.appVersion.indexOf("Mac") != -1 && navigator.userAgent.toLowerCase().indexOf("safari") != -1) {
                goFullscreen('vdo-player_media'+video_id);
                $('#fscrTip'+video_id).html('View Full Screen');
                $('#fscreenCtrl'+video_id).removeClass('exresize');
                $('#fscreenCtrl'+video_id).addClass('resize');
                return;
            }

            $('#video-player'+video_id).css('width', '100%');
            $('#video-player'+video_id).css('height', screen.height+'px;');
            $('#video-player'+video_id).attr('height', screen.height+'px;');
            $('#vdo-player'+video_id).attr('style', 'max-width: 100%; height:'+screen.height+'px;');
            $('#vdo-player_media'+video_id).attr('style', 'max-width: 100%; height:'+screen.height+'px;');
            $('.html-player').css({'width': '100%','height': '100%'});

            goFullscreen('video-player'+video_id);
            $('#fscreenCtrl'+video_id).removeClass('resize');
            $('#fscreenCtrl'+video_id).addClass('exresize');
            $('#vdo-player'+video_id).removeClass('resize');
            $('#fscreenCtrl'+video_id).removeClass('resize');
        } else {
            goFullscreen('vdo-player'+video_id);
            $('#fscreenCtrl'+video_id).removeClass('resize');
        }
    }

}
function setVid(playerID)
{
    vid = playerID;
}
/*
addEventListeners
*/
function addEventListeners() {

	if(typeof(vid)=='undefined')
	   vid = '';

    document.addEventListener("fullscreenchange", function () {

        if ($('#fscreenCtrl'+vid).hasClass('exresize')) {

            $('#fscrTip'+vid).html('View Full Screen');
            $('#fscreenCtrl'+vid).removeClass('exresize');
            $('#fscreenCtrl'+vid).addClass('resize');
        } else {

            $('#fscrTip'+vid).html('Exit Full Screen');
            $('#fscreenCtrl'+vid).removeClass('resize');
            $('#fscreenCtrl'+vid).addClass('exresize');
        }
    }, false);

    document.addEventListener("mozfullscreenchange", function () {
        if ($('#fscreenCtrl'+vid).hasClass('exresize')) {
            $('#fscrTip'+vid).html('View Full Screen');
            $('#fscreenCtrl'+vid).removeClass('exresize');
            $('#fscreenCtrl'+vid).addClass('resize');
        } else {
            $('#fscrTip'+vid).html('Exit Full Screen');
            $('#fscreenCtrl'+vid).removeClass('resize');
            $('#fscreenCtrl'+vid).addClass('exresize');
        }
    }, false);
    //HERE IE
    document.addEventListener("msfullscreenchange", function () {
        if(DEBUG)
            console.log("IE FULL SCREEN");

        if ($('#fscreenCtrl'+playerID).hasClass('exresize')) {
            $('#fscrTip'+playerID).html('View Full Screen');
            $('#fscreenCtrl'+playerID).removeClass('exresize');
            $('#fscreenCtrl'+playerID).addClass('resize');
        } else {
            $('#fscrTip'+playerID).html('Exit Full Screen');
            $('#fscreenCtrl'+playerID).removeClass('resize');
            $('#fscreenCtrl'+playerID).addClass('exresize');
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

                    $('#vdo-player_media'+vid).attr('style', 'overflow: hidden; height:' + disp_height + 'px; width: 100%; top: 0px; left: 0px; padding: 0px; margin: 0px; display: block;');
                    $('#video-player'+vid).attr('height', disp_height + 'px;');
                    $('#vdo-player'+vid).attr('style', 'max-width: 100%; height: ' + disp_height + 'px;');
                    $('#fscrTip'+vid).html('View Full Screen');
                    $('#fscreenCtrl'+vid).removeClass('exresize');
                    $('#fscreenCtrl'+vid).addClass('resize');
                    mac_safari_count = 0;
                    //NEW CHANGE
                    document.webkitExitFullscreen();
                }
            else {
                    mac_safari_count = mac_safari_count + 1;
                    $('#fscrTip'+vid).html('Exit Full Screen');
                    $('#fscreenCtrl'+vid).removeClass('resize');
                    $('#fscreenCtrl'+vid).addClass('exresize');
                }
                return;
            }
            return;
        }
        else
        {
            if($('#fscreenCtrl'+vid).hasClass('exresize'))
            {
                var w = screen.width;
                var h = screen.height;
                var r = gcd(w, h);
                var aspectRatio = ((w / r) / (h / r));
                var disp_height = 0;
                if (aspectRatio <= 1.33)
                    disp_height = screen.height * 0.40;
                else
                    disp_height = screen.height * 0.50;

                $('#vdo-player'+vid).attr('style', 'max-width: 100%; height: 100%' );
                $('#fscrTip'+vid).html('View Full Screen');
                $('#fscreenCtrl'+vid).removeClass('exresize');
                $('#fscreenCtrl'+vid).addClass('resize');
                return;
            }

            var cr_height = screen.height;
            $('#vdo-player'+vid).attr('style', 'max-width: 100%; height:'+cr_height+'px !important;');
            $('#fscrTip'+vid).html('Exit Full Screen');
            $('#fscreenCtrl'+vid).removeClass('resize');
            $('#fscreenCtrl'+vid).addClass('exresize');
        }
    }, false);
}
/*
LikeVideo
*/
function LikeVideo(vID,playerID) {

	if(typeof(playerID)=='undefined')
	   playerID = '';

    var liked = "like";
    var SERVICE;

    var value = $("#video-like"+playerID).attr('class');
    var oldValue = value;

    // didn't like  == liking or like
    // liked == unlike or unliking
    if (value == "liking-btn") {
        liked = "unliking-btn";
        SERVICE = SERVER + VIDEOS + vID + "/" + LIKE;
    }else{
        liked = "liking-btn";
        SERVICE = SERVER + VIDEOS + vID + "/" + UNLIKE;
    }

    $("#video-like"+playerID).attr('class', value);

        DataCall("device=website", SERVICE, "POST", true,

        function (data) {
            if(value == "unliking-btn"){
                $("#video-like"+playerID).attr('class', 'liking-btn');
                $('#likes-count'+playerID).attr('class', 'liking');
                $("#video-like"+playerID).html('Like Video');
                var count = $('#likes-count'+playerID).html();
                var newCount = (parseInt(count, 10)) - 1;
                $('#likes-count'+playerID).html(newCount);
            }
            else{
                $("#video-like"+playerID).attr('class', 'unliking-btn');
                $('#likes-count'+playerID).attr('class', 'un-liking');
                $("#video-like"+playerID).html('Unlike Video');
                var count = $('#likes-count'+playerID).html();
                var newCount = (parseInt(count, 10)) + 1;
                $('#likes-count'+playerID).html(newCount);
            }
        },

        function (data) {
            $("#video-like"+playerID).attr('class', oldValue);
        });


    return false;
}
function startTOC(videoid)
{
    if(disableVideoInformation)
     $('#video-information-in'+videoid).hide();
    else
       $('#video-information-in'+videoid).show();

    $('#toc'+videoid).hide();
    $('#toc'+videoid).html('');
}
/*
showTOSForm
*/
function showTOSForm(playerID)
{
    if(typeof(playerID)=='undefined')
	   playerID = '';

	$('#paymentDiv'+playerID).html('');
    $('#paymentDiv'+playerID).hide();

	$('#toc'+playerID).show();
	$('#video-information-in'+playerID).show();
  $('#toc'+playerID).html('<div style="display:block;height: 90%;top:58px;" class="pop-full"><h4>What exactly am I buying?</h4><ul><li style="font-size:14px;">Ability to stream on Facebook (via browser) and download to mobile devices of your choice via LittleCast mobile and tablet apps for iOS and Android</li><li style="font-size:14px;">Stream and download, as many times as you like, as long as the video is available for sale. Download a video to your mobile device and keep it forever.</li></ul><p><input type="checkbox" id="iAgree"><label for="iAgree"> I have read and agree to LittleCast Terms of Use </label><a href="/payment-addendum/" target="_blank">Payment Addendum.</a>&nbsp; All Sales are final.</p><p><span color="#FF0000"><a id="warning-Text" href="#"></a></p><p class="butonP"><a id="warning-Text" href="#"><input type="button" onclick="stripeFormLoad('+playerID+');" value="Make Payment" class="app-screen-btn"></a><a onclick="startTOC('+playerID+');" href="#">Cancel</a></p></div>');

  //console.log('<div style="display:block;height: 86%; top: 62px;" class="pop-full"><h4>What exactly am I buying?</h4><ul><li style="font-size:14px;">Ability to stream on Facebook (via browser) and download to mobile devices of your choice via LittleCast mobile and tablet apps for iOS and Android</li><li style="font-size:14px;">Stream and download, as many times as you like, as long as the video is available for sale. Download a video to your mobile device and keep it forever.</li></ul><p><input type="checkbox" id="iAgree"><label for="iAgree"> I have read and agree to LittleCast Terms of Use </label><a href="/payment-addendum/" target="_blank">Payment Addendum.</a>&nbsp; All Sales are final.</p><p><span color="#FF0000"><a id="warning-Text" href="#"></a></p><p class="butonP"><a id="warning-Text" href="#"><input type="button" onclick="showStripeForm("'+playerID+'");" value="Make Payment" class="app-screen-btn"></a><a onclick="startTOC();" href="#">Cancel</a></p></div>');
  //$('#toc'+playerID).html('<div style="display:block;height: 86%; top: 62px;" class="pop-full"><h4>What exactly am I buying?</h4><ul><li style="font-size:14px;">Ability to stream on Facebook (via browser) and download to mobile devices of your choice via LittleCast mobile and tablet apps for iOS and Android</li><li style="font-size:14px;">Stream and download, as many times as you like, as long as the video is available for sale. Download a video to your mobile device and keep it forever.</li></ul><p><input type="checkbox" id="iAgree"><label for="iAgree"> I have read and agree to LittleCast Terms of Use </label><a href="/payment-addendum/" target="_blank">Payment Addendum.</a>&nbsp; All Sales are final.</p><p><span color="#FF0000"><a id="warning-Text" href="#"></a></p><p class="butonP"><a id="warning-Text" href="#"><input type="button" onclick="showStripeForm("");" value="Make Payment" class="app-screen-btn"></a><a onclick="startTOC();" href="#">Cancel</a></p></div>');
  //console.log($('#toc').val());
}
/*
hideTOSForm
*/
function hideTOSForm(playerID)
{
	if(typeof(playerID)=='undefined')
	   playerID = '';

	$('#toc'+playerID).html('');
	$('#toc'+playerID).hide();
}
/*
hideStripeForm
*/
function hideStripeForm(playerID)
{
	if(typeof(playerID)=='undefined')
	   playerID = '';

	$('#paymentDiv'+playerID).html('');
	$('#paymentDiv'+playerID).hide();
}
/*
STRING-> playerID: the indexed id of the player, in case of multiplpe players on a single page. Use 'none' as playerID ig this is not the case
BOOLEAN-> showPaymentScreen: show stripe form directly
BOOLEAN-> showTOS: show TOS screen
*/
function unboughtVideo(playerID,showPaymentScreen,showTOS)
{
	if(typeof(playerID)=='undefined')
	   playerID = '';

	if(showPaymentScreen)
		stripeFormLoad(playerID);
	else
		$('#paymentDiv'+playerID).hide();

	if (showTOS)
	{
		showTOSForm();
    }
	else
	{
        $('#video-information-in'+playerID).hide();
        $("#about-video-in"+playerID).attr('style', "display:none");
	}

	//projekktor('#vdo-player'+playerID).addListener('state', displayInfo);
	projekktor('#vdo-player'+playerID).setStop();

    if(disableVideoInformation)
     $('#video-information-in'+playerID).hide();
    else
	   $('#video-information-in'+playerID).show();

    $("#about-video-in"+playerID).attr('style', "display:none");
    $("#video-category"+playerID).show();
    $('#hdsdswitch'+playerID).hide();
    $('#fscreenCtrl'+playerID).hide();
    $('#hdWrapper'+playerID).hide();
    $('#fscrWrapper'+playerID).hide();
    $('#vBar'+playerID).hide();
	$('#player-buy-button'+playerID).show();
}
/*
Call this function when the video is bought so that the player is adjusted with the bought settings
STRING-> hdsrc: HD SRC of the bought video
STRING-> sdsrc: SD SRC of the bought video
STRING-> playerID: index of the player, 'none' if there's only one player that is being rendered
*/
function boughtVideo(playerID)
{
  console.log('boughtVideo')
	$('#fscreenCtrl'+playerID).show();
	$('#hdWrapper'+playerID).show();
	$('#fscrWrapper'+playerID).show();
	$('#hdsdswitch'+playerID).show();
	$('#vBar'+playerID).show();
	$('#previewBtn'+playerID).hide();
	$('#aboutBtn'+playerID).hide();
	$('#player-buy-button'+playerID).hide();

  $('#spinner-img').removeClass('loader');
    var count = $('#sold-count'+playerID).html();
    var newCount = (parseInt(count, 10)) + 1;
    $('#sold-count').html(newCount);
    $('#video-information-in').hide();
    //$("#payment-form").hide();
    $("#toc").hide();
    //SHOW SUCCESS MESSAGE HERE
    $('#paymentDiv'+playerID).show();
    $('#paymentDiv'+playerID).html('');
    //$('#paymentDiv'+playerID).html('<div id="notifyExpiry"><div style="display:block;" class="pop-full1"><div class="top-space"><h2 class="tic">Purchase Complete</h2><a href="#" style="display: block;">We have sent you an email with payment confirmation and links to LittleCast <br>iOS and Android apps to download.</a><button onclick="StreamMedia(true,function(){},'+playerID+');" class="submit-button" >Play Video</button></div></div></div>');
	showPurchaseCompleteForm(playerID);
}
/*
shows purchase complete form
*/
function showPurchaseCompleteForm(playerID)
{
	if(typeof(playerID)=='undefined')
	   playerID = '';

	$("#toc"+playerID).html('');
	$("#toc"+playerID).hide();
	$('#paymentDiv'+playerID).show();
	$('#paymentDiv'+playerID).html('');
  alert('video_widget/watch-desktop-reworked.js');
  alert('showPurchaseCompleteForm');
  //$('#paymentDiv'+playerID).html('<div id="notifyExpiry"><div style="display:block;" class="pop-full1"><div class="top-space"><h2 class="tic">Purchase Complete</h2><a href="#" style="display: block;">We have sent you an email with payment confirmation and links to LittleCast <br>iOS and Android apps to download.</a><button onclick="playBoughtVid();" class="submit-button" >Play Video</button></div></div></div>');
  alert('<div id="notifyExpiry" onClick="playBoughtVid();" style="cursor:pointer"><p class="buy-screen-text"></p><div class="pop-full1" style="display:block; cursor:pointer" onClick="playBoughtVid();"><div class="top-space" onClick="playBoughtVid();" style="cursor:pointer"><h2 class="tic" onClick="playBoughtVid();" style="cursor:pointer">Thank you for your purchase!</h2></div></div><div class="purchase" onClick="playBoughtVid();" style="cursor:pointer"><div class="watchOn" onClick="playBoughtVid();" style="cursor:pointer"><h4 onClick="playBoughtVid();" style="cursor:pointer"> Watch on the <br>Facebook LittleCast App</h4><img alt="" src="/fb_app/images/img-zoom.png" onClick="playBoughtVid();" style="cursor:pointer"></div><h6 onClick="playBoughtVid();" style="cursor:pointer">OR</h6><div class="mobilApps" onClick="playBoughtVid();" style="cursor:pointer"><h4 onClick="playBoughtVid();" style="cursor:pointer"> Watch on the <br> LittleCast Mobile Apps</h4><img alt="" src="/fb_app/images/app-store.png" onClick="playBoughtVid();" style="cursor:pointer"></div><div class="btn-click" onClick="playBoughtVid();" style="cursor:pointer"><a href="#"><img alt="" src="/fb_app/images/btn-click.png" onClick="playBoughtVid();" style="cursor:pointer"></a></div></div></div>');
	$('#paymentDiv'+playerID).html('<div id="notifyExpiry" onClick="playBoughtVid();" style="cursor:pointer"><p class="buy-screen-text"></p><div class="pop-full1" style="display:block; cursor:pointer" onClick="playBoughtVid();"><div class="top-space" onClick="playBoughtVid();" style="cursor:pointer"><h2 class="tic" onClick="playBoughtVid();" style="cursor:pointer">Thank you for your purchase!</h2></div></div><div class="purchase" onClick="playBoughtVid();" style="cursor:pointer"><div class="watchOn" onClick="playBoughtVid();" style="cursor:pointer"><h4 onClick="playBoughtVid();" style="cursor:pointer"> Watch on the <br>Facebook LittleCast App</h4><img alt="" src="/fb_app/images/img-zoom.png" onClick="playBoughtVid();" style="cursor:pointer"></div><h6 onClick="playBoughtVid();" style="cursor:pointer">OR</h6><div class="mobilApps" onClick="playBoughtVid();" style="cursor:pointer"><h4 onClick="playBoughtVid();" style="cursor:pointer"> Watch on the <br> LittleCast Mobile Apps</h4><img alt="" src="/fb_app/images/app-store.png" onClick="playBoughtVid();" style="cursor:pointer"></div><div class="btn-click" onClick="playBoughtVid();" style="cursor:pointer"><a href="#"><img alt="" src="/fb_app/images/btn-click.png" onClick="playBoughtVid();" style="cursor:pointer"></a></div></div></div>');
}
/*
    duplicate function from free_video/wathc-desktop.js ,
*/

function hideWatchFullVideo() {
    $('#player-buy-button'+PLAYER_ID+' a').removeAttr('disabled');
    $('#paymentDiv'+PLAYER_ID).fadeOut(200);
    $('.pop-full').fadeOut();
    $('.email-premission-container').fadeOut();
}
function watchFullVideo(){
     if (projekktor('#vdo-player'+PLAYER_ID).getState('PLAYING'))

        projekktor('#vdo-player'+PLAYER_ID).setPause();

    if ((window.fullScreen) || (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
        exitfs();
    }
    $('#video-information-in'+PLAYER_ID).hide();
    $('#thumbContainer').hide();
    loadEmailPremissionDiv();
    $('#player-buy-button'+PLAYER_ID+' a').attr('disabled', true);
    track_watchfull_google_analytic();
}
function loadEmailPremissionDiv()
{
    // if (!emailPrev){
    //     mixpanel.track("Watch Full Video", {'Video UUID': VIDEO_ID, 'URL' : document.URL,  Source: "fan-connect"});
    // }
    var from_page_name = 0;
    if( from_page_name ){
        var user_info = from_page_name ;
    }else{
        var user_info = PUBLISHER; // initilizing PUBLISHER is projekktor view file
    }
    $('.ppstart').removeClass('active');
    $('.ppstart').addClass('inactive');
    if($('#full_video_gateway').val() == "SOCIAL_SHARE")
        $('#paymentDiv'+ PLAYER_ID).html('<div class="pop-full email-premission-container" id="watch-full-overlay" style="display:block;height:100%"><h2 class="want-to-connet"> '+user_info+' wants you to spread the word</h2><h2 class="share-email-with">Share this preview using LittleCast to access full video</h2><a href="'+BUY_URL+'&share_type=fb_share" style="display: table; margin: auto;" target="_blank" onclick="track_share_google_analytic();"> <img src="/assets/btn-facebook.png" /></a></div>');
    else
        $('#paymentDiv'+ PLAYER_ID).html('<div class="pop-full email-premission-container" id="watch-full-overlay" style="display:block;height:100%"><h2 class="want-to-connet"> '+user_info+' wants to connect with you</h2><h2 class="share-email-with">Share your information with '+user_info+' to </h2><a href="'+BUY_URL+'&track_email=1" class="watch-full-video-button" target="_blank" onclick="track_share_google_analytic();" > Access Full Video </a></div>');

    $('#paymentDiv'+ PLAYER_ID).fadeIn();
}


/*
Responsible for setting the player's html as per parameters specified
URL->poster: the thumbnail of the video you are playing
URL->video: the preview url of your video
STRING->title: the title of the video
BOOL->buy: if TRUE show buy button, if FALSE remove buy button
STRING->insertionDivTag: the id of the div where your player should be inserted e.g. div id="html-player", therefore insertionDivTag = 'html-player'
STRING->playerID: the id whereby your player is being indexed. If there's no indexing, enter ''
URL->HD: if video is not to be bought by the user under question, this would be the S3 link of the hd resolution of the video
URL->SD: if video is not to be bought by the user under question, this would be the S3 link of the sd resolution of the video
BOOL->showTos: show terms of service when player renders
BOOL->showPayForm: show stripe payment form when video renders
BOOL->buyLink: true if you want to redirect to a page when buy button is clicked
URL->buyURL: redirect URL if the above is true
BOOL->videoHeader: show video info when player completes video or in beginning
BOOL->embedded: whether this player is to be used as an embeddable player
*/
function LoadHTMLPlayer(poster, video, title, buy, insertionDivTag, playerID,HD,SD,showTos,buyLink,buyURL,videoHeader,embedded, record_type, video_uuid, device) {
    BROWSER = Browser();
    PLAYER_ID = playerID;
    BUY_URL = buyURL;
    VIDEO_RECORD_TYPE = record_type;

    VIDEO_UUID = video_uuid;
    VIDEO_TITLE = title;
    DEVICE = device;
    switch(record_type) {
        case 0 :
            VIDEO_TYPE = 'PaidVideo'
            break;
        case 1 :
            VIDEO_TYPE = 'FanConnect'
            break;
        case 2 :
            VIDEO_TYPE = 'ShopConnect'
            break;
        case 3 :
            VIDEO_TYPE = 'FreeVideo'
            break;
    }

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

    if(typeof(playerID)=='undefined')
        playerID = '';

    if(typeof(embedded)=='undefined')
        embedded = false;
    IS_EMBEDDED = embedded;
    //$(".vdo-player"+playerID).css("height", 360 + "px;");
    //$("#vdo-player"+playerID).attr("height", 360 + "px;");


    var ua = navigator.userAgent.toLowerCase();
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){
        var ieversion=new Number(RegExp.$1)
        if (ieversion>=9)
        {
            var disp_width = 0.7943 * screen.width;
            if(!embedded)
                player = player + '<video id="vdo-player'+playerID+'" class="projekktor" poster="' + poster + '" title="' + title + '" width="'+disp_width+'" height="' + disp_height + '" controls allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true">';
            else
                player = player + '<video id="vdo-player'+playerID+'" class="projekktor" poster="' + poster + '" title="' + title + '" width="100%" height="100%" controls allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true">';
        }
    } else  {
        if(!embedded)
            player = player + '<video id="vdo-player'+playerID+'" class="projekktor" poster="' + poster + '" title="' + title + '" width="100%" height="' + disp_height + '" controls allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true">';
        else
            player = player + '<video id="vdo-player'+playerID+'" class="projekktor" poster="' + poster + '" title="' + title + '" width="100%" height="100%" controls allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true">'
    }

    if(buy) {
        if (!(ua.indexOf("msie") > -1))
            player = player + '<source src="' + video + '" type="video/mp4" /></video>';
        else
            player = player + '<source src="' + video + '" type="video/mp4" codecs="avc1.42E01E,mp4a.40.2"/></video>';
    } else {
        if (!(ua.indexOf("msie") > -1))
            player = player + '<source src="' + HD + '" type="video/mp4" /></video>';
        else
            player = player + '<source src="' + HD + '" type="video/mp4" codecs="avc1.42E01E,mp4a.40.2"/></video>';
    }

    //$('#'+insertionDivTag).html(player);
    var canvas_link = 'https://apps.facebook.com/'+FB_APP_NAME+'?watch='+VIDEO_UUID;
    var controlsTemplate='';
    //
    if (ua.indexOf("firefox") > -1) {
        controlsTemplate = '<div class="play-bar-wrap"><div class="play-bar-wraper"><div %{scrubber}><div %{loaded}></div><div %{playhead}></div><div %{scrubberdrag}></div></div></div></div><div class="control-wraper clearfix"><ul class="play fl"><li><a href="javascript:;" onclick="return false;"><div id="playButton'+playerID+'" onclick="playBtn('+playerID+');" %{play}></div><div id="pauseButton'+playerID+'" onclick="pauseBtn('+playerID+');" %{pause}></div></a></li><li id="vBar'+playerID+'"><span class="ppmute" id="vmute'+playerID+'" onclick="vToggle(1,'+playerID+');" onmouseover="dispVolMute('+playerID+');" onmouseout="hideVolTip('+playerID+');"></span><span onclick="vToggle(2,'+playerID+');" style="display:none" id="vmax'+playerID+'" class="ppvmax" onmouseover="dispVolTip('+playerID+');" onmouseout="hideVolTip('+playerID+');"></span><span style="display:none" id="volTip'+playerID+'" class="volTip"><ul><li><a id="volText'+playerID+'" href="javascript:;">Mute</a></li></ul></span></li></ul><div class="left-section"><ul class="link icos fl"><li><span class="btnabout" id="aboutBtn'+playerID+'" onclick="btnAbout('+playerID+');">About</span></li></ul></div><div class="right-section clearfix"><ul class="link icos fl"><li><div %{timeleft}>%{hr_elp}:%{min_elp}:%{sec_elp} <span class="grey">/ %{hr_dur}:%{min_dur}:%{sec_dur}</span></div></li><li><div %{fsexit}></div><div %{fsenter}></div></li><li id="fscrWrapper'+playerID+'"><span style="display:none" id="fscr'+playerID+'" class="fscr" onmouseover="dispFscr('+playerID+');" onmouseout="hideFscr('+playerID+');"><ul><li><a href="javascript:;" id="fscrTip'+playerID+'" >View Full Screen</a></li></ul></span></li></ul><div class="player-logo"><a href="'+canvas_link+'" target="_blank" style="cursor:pointer"></a><span style="display:none" id="lcTip'+playerID+'" class="lcTip" onmouseover="dispLcTip('+playerID+');" onmouseout="hideLcTip('+playerID+');"><ul><li><a href="javascript:;">Watch on LittleCast</a></li></ul></span></div>';

    } else {
        controlsTemplate = '<div class="play-bar-wrap"><div class="play-bar-wraper"><div %{scrubber}><div %{loaded}></div><div %{playhead}></div><div %{scrubberdrag}></div></div></div></div><div class="control-wraper clearfix"><ul class="play fl"><li><a href="javascript:;" onclick="return false;"><div %{play}></div><div %{pause}></div></a></li><li id="vBar'+playerID+'"><span class="ppmute" id="vmute'+playerID+'" onclick="vToggle(1,'+playerID+');" onmouseover="dispVolMute('+playerID+');" onmouseout="hideVolTip('+playerID+');"></span><span onclick="vToggle(2,'+playerID+');" style="display:none" id="vmax'+playerID+'" class="ppvmax" onmouseover="dispVolTip('+playerID+');" onmouseout="hideVolTip('+playerID+');"></span><span style="display:none" id="volTip'+playerID+'" class="volTip"><ul><li><a id="volText'+playerID+'" href="javascript:;">Mute</a></li></ul></span></li></ul><div class="left-section"><ul class="link icos fl"><li><span class="btnabout" id="aboutBtn'+playerID+'" onclick="btnAbout('+playerID+');">About</span></li></ul></div><div class="right-section clearfix"><ul class="link icos fl"><li><div %{timeleft}>%{hr_elp}:%{min_elp}:%{sec_elp} <span class="grey">/ %{hr_dur}:%{min_dur}:%{sec_dur}</span></div></li><li><div %{fsexit}></div><div %{fsenter}></div></li><li id="fscrWrapper'+playerID+'"><span style="display:none" id="fscr'+playerID+'" class="fscr" onmouseover="dispFscr('+playerID+');" onmouseout="hideFscr('+playerID+');"><ul><li><a href="javascript:;" id="fscrTip'+playerID+'" >View Full Screen</a></li></ul></span></li></ul><div class="player-logo"><a href="'+canvas_link+'" target="_blank" style="cursor:pointer"></a><span style="display:none" id="lcTip'+playerID+'" class="lcTip" onmouseover="dispLcTip('+playerID+');" onmouseout="hideLcTip('+playerID+');"><ul><li><a href="javascript:;">Watch on LittleCast</a></li></ul></span></div>';
    }

    if (buy) {
        if(buyLink) {
            if(embedded)
                if(record_type != 2){
                    if(record_type == 1)
                        controlsTemplate = controlsTemplate + '<div class="button" id="player-buy-button'+playerID+'"><a href="#" onclick="watchFullVideo();">Watch Full Video</a></div>';
                    else
                        controlsTemplate = controlsTemplate + '<div class="button" id="player-buy-button'+playerID+'"><a href="'+buyURL+'" target="_blank" onclick="track_buy_google_analytic();">Buy Now</a></div>';
                }
                else
                    controlsTemplate = controlsTemplate + '<div class="button" id="player-buy-button'+playerID+'"><a href="'+buyURL+'">Buy Now</a></div>';
        } else
            controlsTemplate = controlsTemplate + '<div class="button" id="player-buy-button'+playerID+'"><a href="#" onclick="showTOSForm('+playerID+');">Buy Now</a></div>';
    }
    controlsTemplate = controlsTemplate + '</div></div>';
    var PAY_SERVER = SERVER.substr(0,(SERVER.length-3));

    try {
        if(!embedded) {
            projekktor('#vdo-player'+playerID, {
                playerFlashMP4: PAY_SERVER+"assets/StrobeMediaPlayback.swf",
                playerFlashMP3: PAY_SERVER+"assets/StrobeMediaPlayback.swf",
                enableFullscreen: true,
                enableKeyboard: true,
                debug: false,
                imageScaling:'aspectratio',
                videoScaling: 'aspectratio',
                poster: poster,
                width: disp_width,
                height: disp_height,
                playlist: [
                    {
                        0: {src:video , type: "video/mp4"}
                    }
                ],
                plugin_controlbar: {
                    controlsDisableFade: true,
                    showOnStart: true,
                    showOnIdle: true,
                    controlsTemplate: controlsTemplate
                }
            },function() {projekktorReadyCallBack(playerID) });
        } else {
            projekktor('#vdo-player'+playerID, {
                playerFlashMP4: PAY_SERVER+"assets/StrobeMediaPlayback.swf",
                playerFlashMP3: PAY_SERVER+"assets/StrobeMediaPlayback.swf",
                enableFullscreen: true,
                enableKeyboard: true,
                debug: false,
                imageScaling:'aspectratio',
                videoScaling: 'aspectratio',
                poster: poster,
                width: '100%',
                height: '100%',
                playlist: [
                    {
                        0: {src:video , type: "video/mp4"}
                    }
                ],
                iframe:false,
                plugin_controlbar: {
                    controlsDisableFade: true,
                    showOnStart: true,
                    showOnIdle: true,
                    controlsTemplate: controlsTemplate
                }
            },function() {projekktorReadyCallBack(playerID)});
        }
        if (buy) {
            if(disableVideoInformation)
                $('#video-information-in'+playerID).hide();
            else
                $('#video-information-in'+playerID).show();

            $("#about-video-in"+playerID).attr('style', "display:none");
            $("#video-category"+playerID).show();
            $('#hdsdswitch'+playerID).hide();
            $('#hdsdswitch'+playerID).hide();
            $('#fscreenCtrl'+playerID).hide();
            $('#hdWrapper'+playerID).hide();
            $('#fscrWrapper'+playerID).hide();
            $('#vBar'+playerID).hide();
            $('#player-buy-button'+playerID).show();

            if(record_type != 2)
                $('#previewBtn'+playerID).show();

            addPreviewListener(playerID);

            if(showTos)
                showTOSForm(playerID);
        } else {
            $('#fscreenCtrl'+playerID).hide();
            $('#hdWrapper'+playerID).show();
            $('#fscrWrapper'+playerID).show();
            $('#hdsdswitch'+playerID).show();
            $('#vBar'+playerID).show();
            if(record_type != 2)
                $('#previewBtn'+playerID).show();
            else
                $('#previewBtn'+playerID).hide();
            $('#aboutBtn'+playerID).show();
            $('#player-buy-button'+playerID).hide();

            if (HD != null && SD != null) {
                video_to_play = {
                    0: {
                        src: HD,
                        type: 'video/mp4'
                    }
                };
                $('#hdplug'+playerID).html('-HD');
                $('#sdplug'+playerID).html('SD');

            } else {
                alert('HD or SD are under proccess. You are viewing this video in 320P');
                video_to_play = {
                    0: {
                        src: SD,
                        type: 'video/mp4'
                    }
                };

                $('#hdplug'+playerID).html('HD');
                $('#sdplug'+playerID).html('-SD');
            }

            addStreamListener(playerID);
        }
        //hide video info header everywhere
        if(!(videoHeader)) {
            $('#video-information-in'+playerID).hide();
            disableVideoInformation=true;
        }
        $('#paymentDiv'+playerID).hide();
        vToggle(2,playerID);
        addEventListeners();
    }catch(ex) {
        if(DEBUG == true)
            alert(ex.message);
    }
    Vid_player_height = $('.html-player').height();
    Vid_player_width = $('.html-player').width();
}

function gcd(a, b) {
    return (b == 0) ? a : gcd(b, a % b);
}

function dispVolMute(video_id){

    if(typeof(video_id)=='undefined')
	   video_id = '';

    $('#volText'+video_id).html('Mute');
    $('#volTip'+video_id).show();
    if(DEBUG)
        console.log("SHOW MUTE TIP");
}


function vToggle(state, video_id) {
    if(typeof(video_id)=='undefined')
       video_id = '';
    if (state == 1) {
        $('#vmute'+video_id).hide();
        $('#vmax'+video_id).show();
    } else {
        $('#vmute'+video_id).show();
        $('#vmax'+video_id).hide()
    }
}

function hideVolTip(video_id){
    if(typeof(video_id)=='undefined')
       video_id = '';
    $('#volTip'+video_id).hide();
    if(DEBUG)
        console.log("HIDE VOL TIP");
}


function dispFscr(video_id){
  if(typeof(video_id)=='undefined')
       video_id = '';
    $('#fscr'+video_id).show();

    if(DEBUG)
        console.log("Show FS");
}

function hideFscr(video_id){
  if(typeof(video_id)=='undefined')
       video_id = '';
    $('#fscr'+video_id).hide();

    if(DEBUG)
        console.log("HIDE FS");
}
function hideLcTip(video_id){
  if(typeof(video_id)=='undefined')
       video_id = '';
    $('#lcTip'+video_id).hide();

    if(DEBUG)
        console.log("HIDE LC TIP");
}
function dispLcTip(video_id){
  if(typeof(video_id)=='undefined')
       video_id = '';
    $('#lcTip'+video_id).show();
    if(DEBUG)
        console.log("show LC TIP");
}
function dispVolTip(video_id){
  if(typeof(video_id)=='undefined')
       video_id = '';
    $('#volText'+video_id).html('Unmute');
    $('#volTip'+video_id).show();

    if(DEBUG)
        console.log("SHOW VOL TIP");
}
function dispVolMute(video_id){
  if(typeof(video_id)=='undefined')
       video_id = '';
    $('#volText'+video_id).html('Mute');
    $('#volTip'+video_id).show();
    if(DEBUG)
        console.log("SHOW MUTE TIP");
}
function hideVolTip(video_id){
    if(typeof(video_id)=='undefined')
       video_id = '';
    $('#volTip'+video_id).hide();
    if(DEBUG)
        console.log("HIDE VOL TIP");
}

function btnPreview(video_id) {    
    hideWatchFullVideo();
    if(typeof(video_id)=='undefined')
       video_id = '';
    
    projekktor('#vdo-player'+video_id).setPlay();
    hide_controls_on_play(video_id);

    $('#previewBtn'+video_id).hide();
    $('#aboutBtn'+video_id).hide();
}

function btnAbout(video_id) {
    hideWatchFullVideo();
  if(typeof(video_id)=='undefined')
       video_id = '';
  if (($('#about-video-in'+video_id).is(":visible"))) {

    if(disableVideoInformation)
      $('#video-information-in'+video_id).hide();

      $("#about-video-in"+video_id).attr('style', "display:none");
  } else {
      $('#video-information-in'+video_id).show();
      $("#about-video-in"+video_id).attr('style', "display:block");
  }
}

function hideHdSd(video_id) {
  if(typeof(video_id)=='undefined')
       video_id = '';
    $('#hdSpanBar'+video_id).hide();
}


  function dispHdSd(video_id) {
      if(typeof(video_id)=='undefined')
        video_id = '';
        if (($('#hdSpanBar'+video_id).is(":visible")))
        {
                hideHdSd(video_id);
        }
        else
            $('#hdSpanBar'+video_id).show();
    }



 function hdswitch(video_id,HD) {
        if(typeof(video_id)=='undefined')
          video_id = '';
        if ($('#sdplug'+video_id).text() == "-SD") {
            var videoToPlay = {
                0: {
                    src: HD,
                    type: 'video/mp4'
                }
            };
            var elapsedTime = projekktor('#vdo-player'+video_id).getPosition();
            projekktor('#vdo-player'+video_id).setItem(videoToPlay, 0, true);

            projekktor('#vdo-player'+video_id).setPlay();
            projekktor('#vdo-player'+video_id).setPlayhead("+" + elapsedTime);
            $('#hdplug'+video_id).html('-HD');
            $('#sdplug'+video_id).html('SD');
            hideHdSd(video_id);
        } else {
            //Do nothing
        }
    }

    function sdswitch(video_id,SD) {
        if(typeof(video_id)=='undefined')
          video_id = '';
        if ($('#hdplug'+video_id).text() == '-HD') {

            var videoToPlay = {
                0: {
                    src: SD,
                    type: 'video/mp4'
                }
            };
            var elapsedTime = projekktor('#vdo-player'+video_id).getPosition();
            projekktor('#vdo-player'+video_id).setItem(videoToPlay, 0, true);

            projekktor('#vdo-player'+video_id).setPlay();
            projekktor('#vdo-player'+video_id).setPlayhead("+" + elapsedTime);
            $('#sdplug'+video_id).html('-SD');
            $('#hdplug'+video_id).html('HD');
            hideHdSd(video_id);
        } else {
            //Do nothing
        }
    }
function DataCall (Data, Url, Type, Secure, SuccessCallBack, ErrorCallBack){

	if (Secure == true){
		var sec = SecureKey ();
		//ADD DEVICE TO STREAM REQUEST
		//STREAM REQUEST IS THE ONLY ONE THAT HAS A GET METHOD AND IS SECURE
                                        //LC_USER.ID
		Data = sec.key + "&user_id=" + LC_USER.id + "&" + Data;
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

	req.done (function (msg){
		if(DEBUG)
			console.log ('Done: Data Call >> ' + JSON.stringify(msg) + " - " + " :: URL :: " + Url );
	});

	req.fail(function(jqXHR, textStatus) {
		if(DEBUG)
			console.log ('Fail: Data Call >> ' + JSON.stringify(jqXHR) + " - " + JSON.stringify(textStatus) + " :: URL :: " + Url );
	});

	req.complete (function (jqXHR, textStatus){
		if(DEBUG)
			console.log ('Complete: Data Call >> ' + JSON.stringify(jqXHR) + " - " + JSON.stringify(textStatus)+ " :: URL :: " + Url  );
	});
}

function SecureKey (){

	var timestamp = new Date();
	var int_timestamp = timestamp.getTime();
	var auth = int_timestamp + DEVICE_AUTH;
	var hash = CryptoJS.MD5(auth);

	return {
		hash : hash,
		timestamp: 	int_timestamp,
		auth: auth,
		key: "time=" + int_timestamp + "&security_token=" + hash
	};
}

function Error (Title, Message){
	if(DEBUG)
		console.log (Title + " : " + Message);
}

function fb_login ()
{

 try{
 FB.getLoginStatus(function(response){
  if (response.status === 'connected'){
   FB.api('/me', function(me) {
    res = response.authResponse;
    if (me) {
     social_login (me);
    }
   });
  }
 });
}catch(ex){alert(ex.message)}
}


function embfblogin (videoid, action){
 if(typeof(action) == 'undefined')
    action = '';
	FB.getLoginStatus(function(response){
		if (response.status === 'connected'){
			fb_login(action)
		}else{
        FB.logout(function(){/*just exit*/});
        FB.login(function(response) {
			    if (response.authResponse) {
			        fb_login('start_buy_process')
			    } else {
			        // The person cancelled the login dialog
			    }
			});
		}
	});
}

function social_login (me){

	FB_USER = me;
	//$('#current-user').html ('<img alt="" src="https://graph.facebook.com/' + me.id + '/picture" width="50" height="50">');

	var access_token =  FB.getAuthResponse()['accessToken'];
	var data = 'fb_id=' + me.id + '&user[first_name]=' + me.first_name + '&user[last_name]=' + me.last_name + '&user[email]=' + me.email + '&user[name]=' + me.username + '&accessToken=' + access_token;

	DataCall (data, SERVER + REGISTER, "POST", false,
		function (data){

			if (data.success == true){

				if(DEBUG)
					console.log ('login success');

				LC_USER = data.data.user;
				DEVICE_AUTH = data.data.user.device_auth_token;
				//SuccessCallBack ();
			}else
				Error ("Sign In", "Invalid information.");
		},
		function (){
			Error ("Sign In", "An error occured.");
		}
	);
}

function StreamMedia(AutoPlay, Failure,playerID) {

        DataCall("device=website", SERVER + VIDEOS + playerID + "/" + STREAM_REQUEST, "GET", true,

        function (data) {
          /*success*/

         var HD = data.data.video._720p;
         var SD = data.data.video._480p;
         var video_to_play;

          if(typeof(playerID)=='undefined')
             playerID = '';

            if (HD != null && SD != null)
          {
                video_to_play = {
              0: {
                src: HD,
                type: 'video/mp4'
              }
                };
            $('#hdplug'+playerID).html('-HD');
            $('#sdplug'+playerID).html('SD');

            }
          else
          {
                alert('HD or SD are under proccess. You are viewing this video in 320P');
                video_to_play = {
                    0: {
                                    src: SD,
                                    type: 'video/mp4'
                                }
                            };

                $('#hdplug'+playerID).html('HD');
                $('#sdplug'+playerID).html('-SD');
            }

            $('#paymentDiv'+playerID).hide();
            $('#paymentDiv'+playerID).html('');

          projekktor('#vdo-player'+playerID).setItem(video_to_play, 0, true);
          if(AutoPlay)
            projekktor('#vdo-player'+playerID).setPlay();
          else
            projekktor('#vdo-player'+playerID).setStop();


          removePreviewListener(playerID);
          addStreamListener(playerID);
          //projekktor('#vdo-player'+playerID).removeListener('state', displayInfo);
          //projekktor('#vdo-player'+playerID).addListener('state', recStrem);

        },function(data){
          /*fail*/
          Failure();
        });

}
function limitText(limitField, limitCount, limitNum) {
    if ($('#' + limitField).val().length > limitNum) {
        $('#' + limitField).val($('#' + limitField).val().substring(0, limitNum));
    } else {
        $('#' + limitCount).html(limitNum - $('#' + limitField).val().length + " characters.");
    }
}
function removePreviewListener(playerID){

    projekktor('#vdo-player' + playerID).removeListener('time', previewTimeListener);
    projekktor('#vdo-player' + playerID).addListener('buffer', bufferListenerMob);
    projekktor('#vdo-player' + playerID).addListener('start', videoStartedMob);
    projekktor('#vdo-player' + playerID).removeListener('state',function(state) { });
}
function addPreviewListener(playerID)
{
    projekktor('#vdo-player' + playerID).addListener('start', videoStartedMob);
    projekktor('#vdo-player' + playerID).addListener('buffer', bufferListenerMob);
    projekktor('#vdo-player' + playerID).addListener('time', previewTimeListener);

    projekktor('#vdo-player'+playerID).addListener('state',function(state) {
        var index = checkIndex(playerID);
        switch (state) {
            case 'STARTING':
                            var ua = navigator.userAgent.toLowerCase();
                            if (ua.indexOf("firefox") > -1) {

                                $('#playButton'+playerID).removeClass('active');
                                $('#playButton'+playerID).addClass('inactive');
                                $('#pauseButton'+playerID).removeClass('inactive');
                                $('#pauseButton'+playerID).addClass('active');
                                $('#video-information-in'+playerID).hide('slow');
                                $('#previewBtn'+playerID).hide();
                                $('#aboutBtn'+playerID).hide();
                                $('#vBar'+playerID).show();
                                $('#fscrWrapper'+playerID).show();
                                $('#fscreenCtrl'+playerID).show();                                
                            }
                            hideWatchFullVideo();
                            break;
            case 'PLAYING':
                if(!BUFFERED) playing_state_event_occurence += 1;
                if(BUFFERED || playing_state_event_occurence==2){
                    $("#thumbContainer").hide();
                    if(!playEventLog) {
                        ga('send', 'event', VIDEO_TYPE, 'Video Play', VIDEO_UUID + ':' + VIDEO_TITLE);
                        playEventLog = true;
                    }
                }

                hideWatchFullVideo();

                $('#video-information-in'+playerID).hide('slow');
                if(BUFFERED || playing_state_event_occurence==2) {
                  console.log('---Buffere' + playerID);
                  $('#previewBtn'+playerID).hide();
                  $('#fscreenCtrl'+playerID).show();
                  $('#aboutBtn'+playerID).hide();                  
                }                
                
                $('#vBar'+playerID).show();
                $('#fscrWrapper'+playerID).show();                
                  
            break;

            case 'COMPLETED':
                if( VIDEO_RECORD_TYPE == 1 )
                    watchFullVideo();
                ga('send', 'event', VIDEO_TYPE, 'Finished Video', VIDEO_UUID + ':' + VIDEO_TITLE);
                playEventLog = false;
                VIEW_CALL_SENT = false;
                if( VIDEO_RECORD_TYPE == 0 )
                    $('#aboutBtn'+playerID).show();


                break;

            case 'STOPPED':

            if(disableVideoInformation)
                $('#video-information-in'+playerID).hide();
            else
                $('#video-information-in'+playerID).show();

                $("#about-video-in"+playerID).attr('style', "display:none");
                $('#previewBtn'+playerID).show();
                $('#aboutBtn'+playerID).show();
                $('#vBar'+playerID).hide();
                $('#hdsdswitch'+playerID).hide();
                $('#fscreenCtrl'+playerID).hide();
                $('#hdWrapper'+playerID).hide();
                $('#fscrWrapper'+playerID).hide();
                //IE FIX
                var ua = navigator.userAgent.toLowerCase();
                if(ua.indexOf("firefox") > -1)
                {
                    $('#playButton'+playerID).removeClass('inactive');
                    $('#playButton'+playerID).addClass('active');
                    $('#pauseButton'+playerID).removeClass('active');
                    $('#pauseButton'+playerID).addClass('inactive');
                }
            break;

            case 'PAUSED':
                var ua = navigator.userAgent.toLowerCase();
                if(ua.indexOf("firefox") > -1)
                {
                    $('#playButton'+playerID).removeClass('inactive');
                    $('#playButton'+playerID).addClass('active');
                    $('#pauseButton'+playerID).removeClass('active');
                    $('#pauseButton'+playerID).addClass('inactive');
                }
            break;
        }
    });
}
function addStreamListener(playerID) {

    projekktor('#vdo-player'+ playerID).addListener('time', streamTimeListener);
    projekktor('#vdo-player'+playerID).addListener('start', videoStartedMob);
    projekktor('#vdo-player'+playerID).addListener('buffer', bufferListenerMob);

    projekktor('#vdo-player'+playerID).addListener('state',function(state) {
     var index = checkIndex(playerID);     
     switch (state)
     {
        case 'STARTING':
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf("firefox") > -1)
            {
                $('#playButton'+playerID).removeClass('active');
                $('#playButton'+playerID).addClass('inactive');
                $('#pauseButton'+playerID).removeClass('inactive');
                $('#pauseButton'+playerID).addClass('active');
            }
        break;

        case 'PLAYING':
            if(!BUFFERED) playing_state_event_occurence += 1;
            if(BUFFERED || playing_state_event_occurence==2){            
              $("#thumbContainer").hide();              
              $('#fscreenCtrl'+playerID).show();
              $('#aboutBtn'+playerID).hide();
              if(!playEventLog) {
                  ga('send', 'event', VIDEO_TYPE, 'Video Play', VIDEO_UUID + ':' + VIDEO_TITLE);
                  playEventLog = true;
              }
            }

            break;
        case 'STOPPED':                          
        case 'COMPLETED':
            var ua = navigator.userAgent.toLowerCase();
            if(ua.indexOf("firefox") > -1) {
                    $('#playButton'+playerID).removeClass('inactive');
                    $('#playButton'+playerID).addClass('active');
                    $('#pauseButton'+playerID).removeClass('active');
                    $('#pauseButton'+playerID).addClass('inactive');
            }
            if(BUFFERED){
              $('#fscreenCtrl'+playerID).hide();
            }
            ga('send', 'event', VIDEO_TYPE, 'Finished Video', VIDEO_UUID + ':' + VIDEO_TITLE);
            playEventLog = false;
            THREE_SEC_STREAM_CALL_SENT = false
            break;
    }
  });
}

/*
    Listners
*/
function bufferListenerMob(st){
if( st == 'FULL'){
    $('#player_buffer').fadeOut(500);
}
}
function videoStartedMob(){
    $('#player_buffer').show();
}

function AddComment(evt,playerID) {

    var charCode = (evt.which) ? evt.which : evt.keyCode;
    var comment_text = $('#comment_text'+playerID).val();

    if ((charCode == 13 && comment_text != '' && (/\S/.test(comment_text)) )) {

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

        $('#comments'+playerID).prepend(newCommentStructure(comment, false));
        $('#comment_text'+playerID).val('');

        DataCall("device=website&comment[title]=" + comment.title + "&comment[comment]=" + comment.comment, SERVER + VIDEOS + playerID + "/" + COMMENT, "POST", true,

        function (data) {
            var count = $('#comments-count'+playerID).html();
            var newCount = (parseInt(count, 10)) + 1;
            $('#comments-count'+playerID).html(newCount);
            $('#comment_text'+playerID).val('');
            $('#comment-error'+playerID).hide();
            $('#comment-chars'+playerID).html('500 characters.');
        },

        function (data) {
            $('#comment-error'+playerID).show();
        });

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

function checkIndex(playerID)
{
    var index = 0;

    for (var i=0;i<playReq.length;i++)
    {
        if(playReq[i][0]==playerID)
        {
            index = i;
            break;
        }
    }
return index;
}
var playReq = [['45',0],['46',0],['47',0]];
//var LC_USER=
//var DEVICE_AUTH

function newCommentStructure(comment,posted)
{
    var comment_body = "";
    var stamp = TimeStamp(comment.created_at);
    var username = comment.user.first_name + ' ' + comment.user.last_name;

    comment_body = comment_body + '<div class="media view-comments">';
    comment_body = comment_body + '<a class="pull-left" href="#">';
    comment_body = comment_body + '<img alt="' + username + '" src="https://graph.facebook.com/' + comment.user.uid + '/picture" alt="" class="media-object hold-pic">';
    comment_body = comment_body + '</a>';
    comment_body = comment_body + '<div class="media-body">';
    comment_body = comment_body + '<h4 class="media-heading">'+username+'<span>';

    if (!(posted))
        comment_body = comment_body + 'Just Now</span></h4>';
    else
        comment_body = comment_body + stamp.user_stamp+'</span></h4>';

    comment_body = comment_body + '<p>'+comment.comment+'</p></div>';

    return comment_body;
}
function embeded_iframe_width() {
    console.log("embeded iframe_width: "+$(document).width());
    if ($(document).width() == 426) {
        $('#video-caption-in').hide();
        $('#video-caption').show();
    }
}

var streamTimeListener = function(value) {
    logStreamView(value);
}

var logStreamView = function(time) {
    if( !THREE_SEC_STREAM_CALL_SENT && time > 3) {
        ga('send', 'event', VIDEO_TYPE, 'Video View', VIDEO_UUID + ':' + VIDEO_TITLE);
        THREE_SEC_STREAM_CALL_SENT = true;
    }
}

var previewTimeListener = function(value) {
    logPreview(value);
}

var logPreview = function(time) {
    if( !VIEW_CALL_SENT && time > 3 ){
        ga('send', 'event', VIDEO_TYPE, 'Video View', VIDEO_UUID + ':' + VIDEO_TITLE);
        VIEW_CALL_SENT  = true ;
    }
}

var track_product_google_analytic = function(product_name) {
    ga('send', 'event', VIDEO_TYPE,'Product Click: ' + product_name, VIDEO_UUID + ':' + VIDEO_TITLE);
}

var track_buy_google_analytic = function() {
    ga('send', 'event', VIDEO_TYPE, 'Buy Now', VIDEO_UUID + ':' + VIDEO_TITLE);
}

var track_watchfull_google_analytic = function() {
    ga('send', 'event', VIDEO_TYPE, 'Watch Full Video', VIDEO_UUID + ':' + VIDEO_TITLE);
}

var track_share_google_analytic = function() {
    ga('send', 'event', VIDEO_TYPE, 'Select Share Method', VIDEO_UUID + ':' + VIDEO_TITLE);
}