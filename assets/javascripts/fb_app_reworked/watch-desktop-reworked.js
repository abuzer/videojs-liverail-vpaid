var DEBUG = true;
var SERVER = SERVER_URL;
var REGISTER = "device_signup/";
var STREAM_REQUEST = "stream_request.json";
var VIDEOS = "videos/";
var MERCHANDISE_VIDEOS = 'shopconnect-upload/'
var PREVIEWED = "/previewed.json";
var UPDATE_STREAM = "/update_stream_stats.json";
var COMMENT = "add_comment.json";
var VIDEO_LIKES = "video_likes.json";
var LIKE = "liked.json";                                    // >> VIDEOS
var UNLIKE = "unliked.json"
var SERVICE_KEY = "shopconnect-upload/";
var UPDATE_PAID_STREAM = "/update_video_stats.json";

var DEVICE_AUTH = '';
var vid = '';
var disableVideoInformation = false;
var HEIGHT = 0;
var intervalID = 0;
var videoLengthLegal = false;
var prevCallSent = true;
var previewFlag = false;
var activityId = 0;
var postId = "";
var social_sharing = false;
var is_video_bought = false;
var VIDEO_RECORD_TYPE = null;
var VIDEO_TYPE = null;
var playEventLog   = false;
VIEW_CALL_SENT = false;
SECOND_PREVIEW_CALL_SENT = false;
STREAM_CALL_SENT = false;
THREE_SEC_STREAM_CALL_SENT = false;
VIDEO_UUID= null;
DEVICE = ''
VIDEO_TITLE = '';
PLAYER_ID = ''

_BUYURL = '';

if (window.location.protocol == "https:")
    var SITE_URL = "https:" + SERVER_URL.substr(0,(SERVER_URL.length-3));
else
    var SITE_URL = "http:" + SERVER_URL.substr(0,(SERVER_URL.length-3));

function setHeight(fixedHeight) {
    HEIGHT = fixedHeight;
}
/*
 stripeResponseHandler
 */
function stripeResponseHandler(status, response, videoid) {

    if (response.error) {
        $('#spinner-img').removeClass('loader');
        $('#spinner-img').html(response.error.message);
        $('#spinner-img').show();
        $('#spinner-img1').show();
        $('.submit-button').prop('disabled', false);
    }
    else {
        var $form = $('#payment-form');
        var token = response.id;
        $form.append($('<input type="hidden" name="stripeToken" />').val(token));
        var tryAgain = 0;
        if (tryAgain < 4) {
            DataCall("video_id=" + videoid + "&token=" + token + "&device=website", SERVER_URL + "payments/" + "make_stripe_payment.json", "POST", true,
                function (data) {
                    activityId = data.data.activity_id;
                    postId = data.data.post_id;
                    social_sharing = data.data.is_social_on;
                    boughtVideo(videoid);
                },
                function (data) {

                    $('#spinner-img').removeClass('loader');
                    $('.submit-button').prop('disabled', false);
                    var json = jQuery.parseJSON(data.responseText);
                    $('#spinner-img').html(json.data.strip_error_message);
                    $('#spinner-img1').show();
                });
            if (!($('#spinner-img').hasClass('loader'))) {
                tryAgain = 4;
            }
            else {
                tryAgain = tryAgain + 1;
            }
        }
        else {
            unboughtVideo(videoid, false, false)();
        }
    }
}
/*
 showStripeForm
 */
function showStripeForm(videoid) {

    FB.init({
        appId: FB_APP_ID,
        status: true,
        cookie: true,
        xfbml: true,
        oauth: true
    });

    embfblogin(videoid);

}

function stripeFormLoad(videoid) {
    if (!(document.getElementById("iAgree").checked)) {
        $('#warning-Text').html('<span style="color:#FF0000; margin-bottom: 10px;">You must agree to the terms and conditions first</span>');
    } else {
        $('#toc' + videoid).hide();
        $('#toc' + videoid).html('');

        $('#video-information-in' + videoid).hide();
        $("#about-video-in" + videoid).attr('style', "display:none");

        $('#paymentDiv' + videoid).css({height: '100% !important'});
        $('#paymentDiv' + videoid).show();
        $('#paymentDiv' + videoid).html('<form id="payment-form" method="POST" action=""><div style="display:block;" class="pop-full1"><div class="payment-pop-header"><h1 style="color:white;">Secure Credit Card Payment</h1><p>This is a secure 128-bit SSL encrypted payment.</p></div><div class="form-row first-row-start"><label><span class="required">*</span>Credit Card Number</label><div class="clear"></div><input type="text" id="my-ccn' + videoid + '" onKeyDown="limitText("my-ccn' + videoid + '", "", ' + 16 + ');" onKeyUp="limitText("my-ccn' + videoid + '", "", ' + 16 + ');" class="card-number" autocomplete="off" maxlength="16" size="20"><div class="payment-cards"><a href="#"><img src="/fb_app/images/ico-visa.jpg" alt="Visa Card" title="Visa Card" width="33" height="21" /></a><a href="#"><img src="/fb_app/images/ico-mastercard.jpg" alt="Master Card" title="Master Card" width="33" height="21" /></a><a href="#"><img src="/fb_app/images/ico-amex.jpg" alt="Amercian Express" title="Amercian Express" width="33" height="21" /></a><a href="#"><img src="/fb_app/images/ico-discover.jpg" alt="Discover" title="Discover" width="33" height="21" /></a><a href="#"><img src="/fb_app/images/ico-dinner-club.png" alt="Dinner Club" title="Discover" width="33" height="21" /></a><a href="#"><img src="/fb_app/images/ico-jcb.png" alt="JCB" title="JCB" width="33" height="21" /></a><div class="clear"></div></div><div class="clear"></div></div><div class="form-row"><label><span class="required">*</span>Security Code (CVC or CVV)</label><p>For American Express , it is the 4-digit code displayed in the front. For others, the 3 digit code on the back of your card.</p><div class="clear"></div><input type="text" class="card-cvc" id=autocomplete="off" maxlength="4" size="4"><div class="payment-cards cvv"><img src="/fb_app/images/cvv-number.png" alt="CVV" title="CVV" width="30" height="21"  /></div><div class="clear"></div></div><div class="form-row"><label><span class="required">*</span>Expiration (MM/YYYY)</label><p>The date your credit card expired. Find this on the front of your credit card.</p><div class="clear"></div><input type="text" class="card-expiry-month" maxlength="2" size="2"><span class="separator"> / </span><input type="text" class="card-expiry-year" maxlength="4" size="4"></div><div class="form-row"><span id="spinner-img" style="color:#A60404;display:none" class="loader-text loader"></span></div><div class="form-row"><button class="btn fl" type="submit">Submit Payment</button><a id="spinner-img1" class="loader-text" onclick="hideStripeForm(' + videoid + ');" href="javascript:;"><span style="color:#BE0D0F;margin-left: 6px;">Cancel</a></div></div><label class="intimation-required"><span class="required">*</span>Required Fields</label></form><div class="button1" style="text-align: center; bottom: 0; right: 0; z-index: 99999; position: absolute;"><a onclick="hideStripeForm(' + videoid + ');" href="javascript:;">Cancel</a></div>');

        ga('send', 'event', VIDEO_TYPE, 'Payment Select - Stripe', VIDEO_UUID + ':' + VIDEO_TITLE);

        $('#payment-form').submit(function (event) {
            // Disable the submit button to prevent repeated clicks
            $('.submit-button').prop('disabled', true);
            $('#spinner-img1').hide();
            $('#spinner-img').show();
            $('#spinner-img').html('');
            $('#spinner-img').addClass('loader');
            try {
                Stripe.createToken({
                    number: $('.card-number').val(),
                    cvc: $('.card-cvc').val(),
                    exp_month: $('.card-expiry-month').val(),
                    exp_year: $('.card-expiry-year').val()
                }, function (status, response, video_id) {
                    stripeResponseHandler(status, response, videoid);
                });
                return false;
            }
            catch (ex) {
                if (DEBUG)
                    alert("Key Mismatch");
                else
                    console.log("Keys Mismatch");
            }
        });
    }
}

function paypal_payment() {
    if (!(document.getElementById("iAgree").checked)) {
        $('#warning-Text').html('<span style="color:#FF0000; margin-bottom: 10px;">You must agree to the terms and conditions first</span>');
    } else {
        if( LC_USER.id == 0 ){
            reLogin();
            return;
        }
        ga('send', 'event', VIDEO_TYPE, 'Payment Select - PayPal', VIDEO_UUID + ':' + VIDEO_TITLE);

        $('#paypal_submit').click();
    }
}

function paymentCompeltedFunction(response, payment_source) {
    console.log(response);

    videoid  = $('#video_id').val();

    if (($('#toc' + videoid ).is(":visible")))
    {
        $('#toc' + videoid).html('');
        $('#toc' + videoid).html('<div class="pop-full" style="display:block;height: 100%;"><div style="display: block; text-align: center; top: 46%;position: absolute;left: 47.5%;"><img src="/fb_app/images/ajax-loader.gif"></div></div>');
    }
    if(($('#paymentDiv').is(":visible")))
    {
        $('#paymentDiv' + videoid).html('');
        $('#paymentDiv' + videoid).html('<div style="display:block;height:100%" id="paymentScreen" class="pop-full"><div style="display: block; text-align: center; "><img src="/fb_app/images/ajax-loader.gif"></div></div>');
    }
    if(payment_source == "Facebook")
        setTimeout(sendFbPayCall,2000,response);
    else{ //PayPal Case

        activityId          = $('#activityId').val();
        postId              = $('#postId').val();
        social_sharing = $('#social_sharing').val();
        boughtVideo(videoid);
    }
}


/***************************************** PLAYER CUSTOMIZED WITH ID DOWNWARDS *****************************************************************************************************************************/
function playBtn(videoid) {
    projekktor('#vdo-player' + videoid).setPlay();
    $('#playButton' + videoid).removeClass('active');
    $('#playButton' + videoid).addClass('inactive');
    $('#pauseButton' + videoid).removeClass('inactive');
    $('#pauseButton' + videoid).addClass('active');
    $('#vBar' + videoid).show();
    if($('#thumbContainer').is(":visible"))
    {
        $('#thumbContainer').hide();
    }
}
function pauseBtn(videoid) {
    projekktor('#vdo-player' + videoid).setPause();
    $('#playButton' + videoid).removeClass('inactive');
    $('#playButton' + videoid).addClass('active');
    $('#pauseButton' + videoid).removeClass('active');
    $('#pauseButton' + videoid).addClass('inactive');
}
/*
 goFullScreen
 */
function goFullscreen(id) {
    var element = document.getElementById(id);

    if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    }
    else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
    }
    else {
        try {
            element.requestFullScreen();
        }
        catch (ex) {
            element.msRequestFullScreen();
        }
    }
}
/*
 exitfs
 */
function exitfs(playerID) {
    if (typeof(playerID) == 'undefined')
        playerID = '';
    var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

    if (isChrome || isSafari) {

        var w = screen.width;
        var h = screen.height;
        var r = gcd(w, h);
        var aspectRatio = ((w / r) / (h / r));
        var disp_height = 0;

        if (HEIGHT != 0) {
            disp_height = HEIGHT;
        }
        else {
            if (aspectRatio <= 1.33)
                disp_height = screen.height * 0.40;
            else
                disp_height = screen.height * 0.50;
        }

        $('#vdo-player' + playerID).attr('style', 'max-width: 100%; height: ' + disp_height + 'px;');
        if (navigator.appVersion.indexOf("Mac") != -1 && navigator.userAgent.toLowerCase().indexOf("safari") != -1) {
            $('#fscrTip' + playerID).html('View Full Screen');
            $('#fscreenCtrl' + playerID).removeClass('exresize');
            $('#fscreenCtrl' + playerID).addClass('resize');
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
/*
 fscreen
 */

function fscreen(video_id) {
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
        } else {
            goFullscreen('vdo-player'+video_id);
            $('#fscreenCtrl'+video_id).removeClass('resize');
            $('#fscreenCtrl'+video_id).addClass('exresize');
        }
    }

}


function setVid(playerID) {
    vid = playerID;
}
/*
 addEventListeners
 */
function addEventListeners() {

    if (typeof(vid) == 'undefined')
        vid = '';

    document.addEventListener("fullscreenchange", function () {

        if ($('#fscreenCtrl' + vid).hasClass('exresize')) {

            $('#fscrTip' + vid).html('View Full Screen');
            $('#fscreenCtrl' + vid).removeClass('exresize');
            $('#fscreenCtrl' + vid).addClass('resize');
        } else {

            $('#fscrTip' + vid).html('Exit Full Screen');
            $('#fscreenCtrl' + vid).removeClass('resize');
            $('#fscreenCtrl' + vid).addClass('exresize');
        }
    }, false);

    document.addEventListener("mozfullscreenchange", function () {
        if ($('#fscreenCtrl' + vid).hasClass('exresize')) {
            $('#fscrTip' + vid).html('View Full Screen');
            $('#fscreenCtrl' + vid).removeClass('exresize');
            $('#fscreenCtrl' + vid).addClass('resize');
        } else {
            $('#fscrTip' + vid).html('Exit Full Screen');
            $('#fscreenCtrl' + vid).removeClass('resize');
            $('#fscreenCtrl' + vid).addClass('exresize');
        }
    }, false);
    //HERE IE
    document.addEventListener("msfullscreenchange", function () {
        if (DEBUG)
            console.log("IE FULL SCREEN");

        if ($('#fscreenCtrl' + playerID).hasClass('exresize')) {
            $('#fscrTip' + playerID).html('View Full Screen');
            $('#fscreenCtrl' + playerID).removeClass('exresize');
            $('#fscreenCtrl' + playerID).addClass('resize');
        } else {
            $('#fscrTip' + playerID).html('Exit Full Screen');
            $('#fscreenCtrl' + playerID).removeClass('resize');
            $('#fscreenCtrl' + playerID).addClass('exresize');
        }
    }, false);

    document.addEventListener("webkitfullscreenchange", function () {
        if (navigator.appVersion.indexOf("Mac") != -1 && navigator.userAgent.toLowerCase().indexOf("safari") != -1) {
            if (mac_safari_count > 2) {
                if ((window.fullScreen) || (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
                    console.log("1a");
                    var w = screen.width;
                    var h = screen.height;
                    var r = gcd(w, h);
                    var aspectRatio = ((w / r) / (h / r));
                    var disp_height = 0;

                    if (HEIGHT != 0) {
                        disp_height = HEIGHT;
                    }
                    else {
                        if (aspectRatio <= 1.33)
                            disp_height = screen.height * 0.40;
                        else
                            disp_height = screen.height * 0.50;
                    }

                    $('#vdo-player_media' + vid).attr('style', 'overflow: hidden; height:' + disp_height + 'px; width: 100%; top: 0px; left: 0px; padding: 0px; margin: 0px; display: block;');
                    $('#video-player' + vid).attr('height', disp_height + 'px;');
                    $('#vdo-player' + vid).attr('style', 'max-width: 100%; height: ' + disp_height + 'px;');
                    $('#fscrTip' + vid).html('View Full Screen');
                    $('#fscreenCtrl' + vid).removeClass('exresize');
                    $('#fscreenCtrl' + vid).addClass('resize');
                    mac_safari_count = 0;
                    //NEW CHANGE
                    document.webkitExitFullscreen();
                }
                else {
                    mac_safari_count = mac_safari_count + 1;
                    $('#fscrTip' + vid).html('Exit Full Screen');
                    $('#fscreenCtrl' + vid).removeClass('resize');
                    $('#fscreenCtrl' + vid).addClass('exresize');
                }
                return;
            }
            return;
        }
        else {
            if ($('#fscreenCtrl' + vid).hasClass('exresize')) {
                var w = screen.width;
                var h = screen.height;
                var r = gcd(w, h);
                var aspectRatio = ((w / r) / (h / r));
                var disp_height = 0;

                if (HEIGHT != 0) {
                    disp_height = HEIGHT;
                }
                else {
                    if (aspectRatio <= 1.33)
                        disp_height = screen.height * 0.40;
                    else
                        disp_height = screen.height * 0.50;
                }

                $('#vdo-player' + vid).attr('style', 'max-width: 100%; height: 100%');
                $('#fscrTip' + vid).html('View Full Screen');
                $('#fscreenCtrl' + vid).removeClass('exresize');
                $('#fscreenCtrl' + vid).addClass('resize');
                return;
            }

            var cr_height = screen.height;
            $('#vdo-player' + vid).attr('style', 'max-width: 100%; height:' + cr_height + 'px !important;');
            $('#fscrTip' + vid).html('Exit Full Screen');
            $('#fscreenCtrl' + vid).removeClass('resize');
            $('#fscreenCtrl' + vid).addClass('exresize');
        }
    }, false);
}
/*
 LikeVideo
 */
function LikeVideo(vID, playerID) {

    if (typeof(playerID) == 'undefined')
        playerID = '';

    var liked = "like";
    var SERVICE;

    var value = $("#video-like" + playerID).attr('class');
    var oldValue = value;

    // didn't like  == liking or like
    // liked == unlike or unliking
    if (value == "liking-btn") {
        liked = "unliking-btn";
        SERVICE = SERVER + VIDEOS + vID + "/" + LIKE;
    } else {
        liked = "liking-btn";
        SERVICE = SERVER + VIDEOS + vID + "/" + UNLIKE;
    }

    $("#video-like" + playerID).attr('class', value);

    DataCall("device=website", SERVICE, "POST", true,

        function (data) {
            if (value == "unliking-btn") {
                $("#video-like" + playerID).attr('class', 'liking-btn');
                $('#likes-count' + playerID).attr('class', 'liking');
                $("#video-like" + playerID).html('Like Video');
                var count = $('#likes-count' + playerID).html();
                var newCount = (parseInt(count, 10)) - 1;
                $('#likes-count' + playerID).html(newCount);
            }
            else {
                $("#video-like" + playerID).attr('class', 'unliking-btn');
                $('#likes-count' + playerID).attr('class', 'un-liking');
                $("#video-like" + playerID).html('Unlike Video');
                var count = $('#likes-count' + playerID).html();
                var newCount = (parseInt(count, 10)) + 1;
                $('#likes-count' + playerID).html(newCount);
            }
        },

        function (data) {
            $("#video-like" + playerID).attr('class', oldValue);
        });


    return false;
}
function startTOC(videoid) {
    if (disableVideoInformation)
        $('#video-information-in' + videoid).hide();
    else
        $('#video-information-in' + videoid).show();

    $('#toc' + videoid).hide();
    $('#toc' + videoid).html('');
}
/*
 showTOSForm
 */
function showTOSForm(playerID) {
    if (typeof(playerID) == 'undefined')
        playerID = '';

    projekktor('#vdo-player' + playerID).setStop();

    if ((window.fullScreen) || (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
        exitfs(playerID);
    }

    $('#paymentDiv' + playerID).html('');
    $('#paymentDiv' + playerID).hide();
    $("#about-video-in" + playerID).hide();

    $('#toc' + playerID).show();
    $('#video-information-in' + playerID).show();
    html  = '<div style="display:block;margin:0px 0px 0px 0px;height: 89%;top:59px;width:100%;" class="pop-full">' +
            '<div style="padding: 10% 20% 10% 25%;">'+
            '<div style="margin-bottom: 15px; "><h4 style="color: white; margin: 0 !important;">What exactly am I buying?</h4></div>' +
            '<div style=" color: #CCCCCC; font-size: 12px !important; margin-bottom: 10px;">Ability to stream and download unlimited while video is available.</div>' +
            '<div style=" color: #CCCCCC; font-size: 12px !important; margin-bottom: 10px;">Stream video on Facebook - download on LittleCast App (iOS & Android).</div>'+
            '<div style=" color: #CCCCCC;"><input type="checkbox" id="iAgree" style="float:left">'+
            '<label for="iAgree" style="font-size: 10px !important;"> &nbsp;I have read and agree to LittleCast '+
            '<a href="/terms-of-use" target="_blank" style="color:#FFFFFF; text-decoration: underline;"> Terms of Use</a>'+
            '&nbsp; & <a href="/payment-addendum/" style="color:#FFFFFF; text-decoration: underline;" target="_blank">Payment Addendum.</a>'+
            '&nbsp;All Sales are final. </label><br/></div>'+
            '<div id="warning-Text" style="font-size: 10px;" > </div>'+
            '<div>' +
            '<a href="javascript:;" onclick="stripeFormLoad(' + playerID + ');"><img src="/assets/credit-card-button.png"></a>' +
            '<a href="javascript:;" style= "margin-left: 15px;"onclick="paypal_payment();"><img src="/assets/pay-pal-button.png"/ ></a>' +

            '</div></div>'+
            '<div class="button1" style="text-align: center; bottom: 0; right: 0; z-index: 99999; position: absolute;"><a onclick="startTOC(' + playerID + ');" href="javascript:;">Cancel</a></div>' +
            '</div>'
    $('#toc' + playerID).html(html);
}
/*
 hideTOSForm
 */
function hideTOSForm(playerID) {
    if (typeof(playerID) == 'undefined')
        playerID = '';

    $('#toc' + playerID).html('');
    $('#toc' + playerID).hide();
}
/*
 hideStripeForm
 */
function hideStripeForm(playerID) {
    if (typeof(playerID) == 'undefined')
        playerID = '';

    $('#paymentDiv' + playerID).html('');
    $('#paymentDiv' + playerID).hide();
}
/*
 STRING-> playerID: the indexed id of the player, in case of multiplpe players on a single page. Use 'none' as playerID ig this is not the case
 BOOLEAN-> showPaymentScreen: show stripe form directly
 BOOLEAN-> showTOS: show TOS screen
 */
function unboughtVideo(playerID, showPaymentScreen, showTOS) {
    if (typeof(playerID) == 'undefined')
        playerID = '';

    if (showPaymentScreen)
        stripeFormLoad(playerID);
    else
        $('#paymentDiv' + playerID).hide();

    if (showTOS) {
        showTOSForm();
    }
    else {
        $('#video-information-in' + playerID).hide();
        $("#about-video-in" + playerID).attr('style', "display:none");
    }

    projekktor('#vdo-player' + playerID).setStop();

    if (disableVideoInformation)
        $('#video-information-in' + playerID).hide();
    else
        $('#video-information-in' + playerID).show();

    $("#about-video-in" + playerID).attr('style', "display:none");
    $("#video-category" + playerID).show();
    $('#hdsdswitch' + playerID).hide();
    $('#fscreenCtrl' + playerID).hide();
    $('#hdWrapper' + playerID).hide();
    $('#fscrWrapper' + playerID).hide();
    $('#vBar' + playerID).hide();
    $('#player-buy-button' + playerID).show();
}
/*
 Call this function when the video is bought so that the player is adjusted with the bought settings
 STRING-> hdsrc: HD SRC of the bought video
 STRING-> sdsrc: SD SRC of the bought video
 STRING-> playerID: index of the player, 'none' if there's only one player that is being rendered
 */
function boughtVideo(playerID) {
    is_video_bought = true;
    $('#fscreenCtrl' + playerID).show();
    $('#hdWrapper' + playerID).show();
    $('#fscrWrapper' + playerID).show();
    $('#hdsdswitch' + playerID).show();
    $('#vBar' + playerID).show();
    $('#previewBtn' + playerID).hide();
    $('#aboutBtn' + playerID).hide();
    $('#player-buy-button' + playerID).hide();

    $('#spinner-img').removeClass('loader');
    var count = $('#sold-count' + playerID).html();
    var newCount = (parseInt(count, 10)) + 1;
    $('#sold-count').html(newCount);
    $('#video-information-in').hide();
    //$("#payment-form").hide();
    $("#toc").hide();
    //SHOW SUCCESS MESSAGE HERE
    $('#paymentDiv' + playerID).show();
    $('#paymentDiv' + playerID).html('');
    //$('#paymentDiv'+playerID).html('<div id="notifyExpiry"><div style="display:block;" class="pop-full1"><div class="top-space"><h2 class="tic">Purchase Complete</h2><a href="#" style="display: block;">We have sent you an email with payment confirmation and links to LittleCast <br>iOS and Android apps to download.</a><button onclick="StreamMedia(true,function(){},'+playerID+');" class="submit-button" >Play Video</button></div></div></div>');
    showPurchaseCompleteForm(playerID);
}

function playBoughtVid(playerID) {


    $('#aboutBtn' + playerID).hide();
    window.setTimeout(StreamMedia, 100, true, function () {

        console.log("video with id : " + playerID +" isw now playing " );

   }, playerID);
    $('#paymentDiv'+playerID).html('');
    $('#paymentDiv'+playerID).hide();
}


function StreamMedia(AutoPlay, Failure, playerID) {

    var VIDEO_ID = $('#video_id').prop("value");
    /* console.log($('#video_id').prop("value"));
     console.log('video id ::: ');
     console.log(VIDEO_ID);*/
    DataCall("device=FBApp", SERVER + VIDEOS + VIDEO_ID + "/" + STREAM_REQUEST, "GET", true,

        function (data) {

            try{




            if (data.success == true) {
                var isAlreadyPlaying = false;
                console.log("success called");
                if (DEBUG)
                    console.log("Bought");

                $('#paymentDiv'+playerID).html('');
                $('#paymentDiv'+playerID).hide();
                $('#paymentDiv'+playerID).remove();

//                $('#notifyExpiry').html('');
//                $('#notifyExpiry').hide();
//                $('#notifyExpiry').remove();

                HD = data.data.video._720p;
                SD = data.data.video._480p;

                if (HD != null && SD != null) {
                    $('#hdplug' + playerID).attr('onclick', "hdswitch(" + playerID + ",'" + HD + "')");
                    $('#sdplug' + playerID).attr('onclick', "sdswitch(" + playerID + ",'" + SD + "')");

                    currentRES = "HD";
                    var video_to_play = {
                        0: {
                            src: data.data.video._720p,
                            type: 'video/mp4'
                        }
                    };


                    $('#hdplug' + playerID).html('-HD');
                    $('#sdplug' + playerID).html('SD');
                } else {

                    $('#hdplug' + playerID).attr('onclick', "hdswitch(" + playerID + ",'" + HD + "')");
                    $('#sdplug' + playerID).attr('onclick', "sdswitch(" + playerID + ",'" + SD + "')");

                    alert('HD or SD are under proccess. You are viewing this video in 320P');
                    var video_to_play = {
                        0: {
                            src: data.data.video._320p,
                            type: 'video/mp4'
                        }
                    };
                    $('#hdplug' + playerID).html('HD');
                    $('#sdplug' + playerID).html('-SD');
                }

                $('#toc').hide();

                projekktor('#vdo-player' + playerID).setItem(video_to_play, 0, true);
                projekktor('#vdo-player' + playerID).setPlay();
//                    commenting this code of auto play in case of iPhone as discussed
//                    if (navigator.userAgent.indexOf('iPhone') != -1) {
//                        isAlreadyPlaying = true;
//                        projekktor('#vdo-player' + playerID).setPlay();
//                    }
//                    else
//                        projekktor('#vdo-player' + playerID).setStop();


                removePreviewListener(playerID);
                addStreamListener(playerID);

                $('#hdsdswitch' + playerID).show();
                $('#fscreenCtrl' + playerID).show();
                $('#hdWrapper' + playerID).show();
                $('#fscrWrapper' + playerID).show();
                $("#video-category" + playerID).show();
                $('#vBar' + playerID).show();

                $('#previewBtn' + playerID).hide();
                $('#aboutBtn' + playerID).hide();
                $('#player-buy-button' + playerID).hide();
                $('#video-information-in' + playerID).hide();
                $('#about-video-in' + playerID).hide();
                $('#video-price-in' + playerID).hide();
                $('#paymentDiv' + playerID).hide();
                $('#paymentDiv' + playerID).html('');
            }

            }
            catch(err){
                console.log("this is error :  "+err.message)
            }
        },

        function (data) {
            /* fail case */
            Failure();
        });
}

/*
 shows purchase complete form
 */
function removePurchase() {
    deletePreview();
    $('#social_sharing_message_div').hide();
    $('#social_sharing_message_div').html("");
}

function showPurchaseCompleteForm(playerID) {
    if (typeof(playerID) == 'undefined')
        playerID = '';
    $('#aboutBtn' + playerID).hide();
    $("#toc" + playerID).html('');
    $("#toc" + playerID).hide();
    $('#paymentDiv' + playerID).show();
    $('#paymentDiv' + playerID).html('');

    if (social_sharing && postId) {
        $('#social_sharing_message_div').show();
        $('#social_sharing_message_div').html('Purchase activity shared on Facebook and LittleCast - &nbsp;<a onclick="removePurchase();" href="javascript:;">Remove</a>');
    }

    $('#paymentDiv' + playerID).html('<div id="notifyExpiry" onClick="playBoughtVid(' + playerID + ');" style="cursor:pointer"><p class="buy-screen-text"></p><div class="pop-full1" style="display:block; cursor:pointer" ><div class="top-space"  style="cursor:pointer"><h2 class="tic" style="color:white;"  style="cursor:pointer">Thank you for your purchase!</h2></div></div><div class="purchase"  style="cursor:pointer"><div class="watchOn"  style="cursor:pointer"><h4  style="cursor:pointer"> Watch on the <br>Facebook LittleCast App</h4><img alt="" src="/fb_app/images/img-zoom.png"  style="cursor:pointer"></div><h6  style="cursor:pointer">OR</h6><div class="mobilApps"  style="cursor:pointer"><h4  style="cursor:pointer"> Watch on the <br> LittleCast Mobile Apps</h4><img alt="" src="/fb_app/images/app-store.png"  style="cursor:pointer"></div><div class="btn-click"  style="cursor:pointer"><a href="#"><img alt="" src="/fb_app/images/btn-click.png"  style="cursor:pointer"></a></div></div></div>');

}

function LoadHTMLPlayer(poster, video, title, buy, insertionDivTag, playerID, HD, SD, showTos, buyLink, buyURL, videoHeader, embedded, heightPlayer, widthPlayer, full_screen, controller_action_name, video_record_type, is_email_shared, is_video_purchased, is_owner, video_price, video_uuid, device) {
    var is_email_shared = is_email_shared == true
    var is_video_purchased = is_video_purchased == true
    var is_owner = is_owner == true
    VIDEO_RECORD_TYPE = video_record_type;
    VIDEO_UUID = video_uuid;
    VIDEO_TITLE = title;
    DEVICE = device;
    _BUYURL= buyURL;
    switch(video_record_type) {
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
    PLAYER_ID = playerID
    var player = '';
    var w = screen.width;
    var h = screen.height;
    //var r = gcd(w, h);

    var ua = navigator.userAgent.toLowerCase();

    if (typeof(playerID) == 'undefined')
        playerID = '';

    if (typeof(embedded) == 'undefined')
        embedded = false;

    if (typeof(full_screen) == 'undefined')
        full_screen = true;

    if (typeof(heightPlayer) == 'undefined')
        player_height = 0;
    else
        player_height = heightPlayer;

    if (typeof(widthPlayer) == 'undefined')
        player_width = 0;
    else
        player_width = widthPlayer;

    if (typeof(controller_action_name) == 'undefined')
        controller_action_name = '';

    if (DEBUG) {
        console.log('video player_height ::' + player_height);
        console.log('video player_width :: ' + player_width);
    }

    $(".video-player" + playerID).css("width", player_width + "px;");
    $("#video-player" + playerID).attr("width", player_width + "px;");

    $(".video-player" + playerID).css("height", player_height + "px;");
    $("#video-player" + playerID).attr("height", player_height + "px;");

    if(controller_action_name=="profile_show")
        player = player + '<video id="vdo-player' + playerID + '" class="projekktor" poster="' + poster + '" title="' + title + '" controls allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true">';

    else if (!embedded)
        player = player + '<video id="vdo-player' + playerID + '" class="projekktor" poster="' + poster + '" title="' + title + '" width="' + player_width + '" height="' + player_height + '" controls allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true">';

    else
        player = player + '<video id="vdo-player' + playerID + '" class="projekktor" poster="' + poster + '" title="' + title + '" width="100%" height="100%" controls allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true">'

    if (buy) {
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

    $('#' + insertionDivTag).html(player);

    var controlsTemplate = '';
    var canvas_link = 'https://apps.facebook.com/'+FB_APP_NAME+'?watch='+VIDEO_UUID;
    if (ua.indexOf("firefox") > -1) {
        if (full_screen == true)
            controlsTemplate = '<div class="play-bar-wrap"><div class="play-bar-wraper"><div %{scrubber}><div %{loaded}></div><div %{playhead}></div><div %{scrubberdrag}></div></div></div></div><div class="control-wraper clearfix"><ul class="play fl"><li><a href="javascript:;" onclick="return false;"><div id="playButton' + playerID + '" onclick="playBtn(' + playerID + ');" %{play}></div><div id="pauseButton' + playerID + '" onclick="pauseBtn(' + playerID + ');" %{pause}></div></a></li><li id="vBar' + playerID + '"><span class="ppmute" id="vmute' + playerID + '" onclick="vToggle(1,' + playerID + ');" onmouseover="dispVolMute(' + playerID + ');" onmouseout="hideVolTip(' + playerID + ');"></span><span onclick="vToggle(2,' + playerID + ');" style="display:none" id="vmax' + playerID + '" class="ppvmax" onmouseover="dispVolTip(' + playerID + ');" onmouseout="hideVolTip(' + playerID + ');"></span><span style="display:none" id="volTip' + playerID + '" class="volTip"><ul><li><a id="volText' + playerID + '" href="javascript:;">Mute</a></li></ul></span></li></ul><div class="left-section clearfix"><ul class="link icos fl"><li><span class="btnabout_profile" id="aboutBtn' + playerID + '" onclick="btnAbout(' + playerID + ');">About</span></li></ul></div><div class="right-section clearfix"><ul class="link icos fl"><li><div %{timeleft}>%{hr_elp}:%{min_elp}:%{sec_elp} <span class="grey">/ %{hr_dur}:%{min_dur}:%{sec_dur}</span></div></li><li id="fscrWrapper' + playerID + '"><span class="resize" id="fscreenCtrl' + playerID + '" onclick="fscreen(' + playerID + ');" onmouseover="dispFscr(' + playerID + ');" onmouseout="hideFscr(' + playerID + ');"></span><span style="display:none" id="fscr' + playerID + '" class="fscr" onmouseover="dispFscr(' + playerID + ');" onmouseout="hideFscr(' + playerID + ');"><ul><li><a href="javascript:;" id="fscrTip' + playerID + '" >View Full Screen</a></li></ul></span></li><li id="hdWrapper' + playerID + '"><a href="#" ><span id="hdsdswitch' + playerID + '" class="hdsd" onmouseover="dispHdSd(' + playerID + ');" onmouseout="hideHdSd(' + playerID + ');"></span></a><span style="display:none" id="hdSpanBar' + playerID + '" class="hdSpanBar" onmouseover="dispHdSd(' + playerID + ');" onmouseout="hideHdSd(' + playerID + ');"><ul><li><a href="javascript:;" id="hdplug' + playerID + '" onclick="hdswitch(' + playerID + ",'" + HD + "'" + ');">HD</a></li><li><a id="sdplug' + playerID + '" href="javascript:;" onclick="sdswitch(' + playerID + ',\'' + SD + '\');">SD</a></li></ul></span></li></ul><div class="player-logo"><a href="'+canvas_link+'" target="_blank" style="cursor:pointer"></a><span style="display:none" id="lcTip' + playerID + '" class="lcTip" onmouseover="dispLcTip(' + playerID + ');" onmouseout="hideLcTip(' + playerID + ');"><ul><li><a href="javascript:;">Watch on LittleCast</a></li></ul></span></div>';
        else
            controlsTemplate = '<div class="play-bar-wrap"><div class="play-bar-wraper"><div %{scrubber}><div %{loaded}></div><div %{playhead}></div><div %{scrubberdrag}></div></div></div></div><div class="control-wraper clearfix"><ul class="play fl"><li><a href="javascript:;" onclick="return false;"><div id="playButton' + playerID + '" onclick="playBtn(' + playerID + ');" %{play}></div><div id="pauseButton' + playerID + '" onclick="pauseBtn(' + playerID + ');" %{pause}></div></a></li><li id="vBar' + playerID + '"><span class="ppmute" id="vmute' + playerID + '" onclick="vToggle(1,' + playerID + ');" onmouseover="dispVolMute(' + playerID + ');" onmouseout="hideVolTip(' + playerID + ');"></span><span onclick="vToggle(2,' + playerID + ');" style="display:none" id="vmax' + playerID + '" class="ppvmax" onmouseover="dispVolTip(' + playerID + ');" onmouseout="hideVolTip(' + playerID + ');"></span><span style="display:none" id="volTip' + playerID + '" class="volTip"><ul><li><a id="volText' + playerID + '" href="javascript:;">Mute</a></li></ul></span></li></ul><div class="left-section clearfix"><ul class="link icos fl"><li><span class="btnabout_profile" id="aboutBtn' + playerID + '" onclick="btnAbout(' + playerID + ');">About</span></li></ul></div><div class="right-section clearfix"><ul class="link icos fl"><li><div %{timeleft}>%{hr_elp}:%{min_elp}:%{sec_elp} <span class="grey">/ %{hr_dur}:%{min_dur}:%{sec_dur}</span></div></li><li id="hdWrapper' + playerID + '"><a href="#" ><span id="hdsdswitch' + playerID + '" class="hdsd" onmouseover="dispHdSd(' + playerID + ');" onmouseout="hideHdSd(' + playerID + ');"></span></a><span style="display:none" id="hdSpanBar' + playerID + '" class="hdSpanBar" onmouseover="dispHdSd(' + playerID + ');" onmouseout="hideHdSd(' + playerID + ');"><ul><li><a href="javascript:;" id="hdplug' + playerID + '" onclick="hdswitch(' + playerID + ",'" + HD + "'" + ');">HD</a></li><li><a id="sdplug' + playerID + '" href="javascript:;" onclick="sdswitch(' + playerID + ',\'' + SD + '\');">SD</a></li></ul></span></li></ul><div class="player-logo"><a href="'+canvas_link+'" target="_blank" style="cursor:pointer"></a><span style="display:none" id="lcTip' + playerID + '" class="lcTip" onmouseover="dispLcTip(' + playerID + ');" onmouseout="hideLcTip(' + playerID + ');"><ul><li><a href="javascript:;">Watch on LittleCast</a></li></ul></span></div>';
    }
    else {
        if (full_screen == true)
            controlsTemplate = '<div class="play-bar-wrap"><div class="play-bar-wraper"><div %{scrubber}><div %{loaded}></div><div %{playhead}></div><div %{scrubberdrag}></div></div></div></div><div class="control-wraper clearfix"><ul class="play fl"><li><a href="javascript:;" onclick="return false;"><div %{play}></div><div %{pause}></div></a></li><li id="vBar' + playerID + '"><span class="ppmute" id="vmute' + playerID + '" onclick="vToggle(1,' + playerID + ');" onmouseover="dispVolMute(' + playerID + ');" onmouseout="hideVolTip(' + playerID + ');"></span><span onclick="vToggle(2,' + playerID + ');" style="display:none" id="vmax' + playerID + '" class="ppvmax" onmouseover="dispVolTip(' + playerID + ');" onmouseout="hideVolTip(' + playerID + ');"></span><span style="display:none" id="volTip' + playerID + '" class="volTip"><ul><li><a id="volText' + playerID + '" href="javascript:;">Mute</a></li></ul></span></li></ul><div class="left-section clearfix"><ul class="link icos fl"><li><span class="btnabout_profile" id="aboutBtn' + playerID + '" onclick="btnAbout(' + playerID + ');">About</span></li></ul></div><div class="right-section clearfix"><ul class="link icos fl"><li><div %{timeleft}>%{hr_elp}:%{min_elp}:%{sec_elp} <span class="grey">/ %{hr_dur}:%{min_dur}:%{sec_dur}</span></div></li><li id="fscrWrapper' + playerID + '"><span class="resize" id="fscreenCtrl' + playerID + '" onclick="fscreen(' + playerID + ');" onmouseover="dispFscr(' + playerID + ');" onmouseout="hideFscr(' + playerID + ');"></span><span style="display:none" id="fscr' + playerID + '" class="fscr" onmouseover="dispFscr(' + playerID + ');" onmouseout="hideFscr(' + playerID + ');"><ul><li><a href="javascript:;" id="fscrTip' + playerID + '" >View Full Screen</a></li></ul></span></li><li id="hdWrapper' + playerID + '"><a href="javascript:;" ><span id="hdsdswitch' + playerID + '" class="hdsd" onmouseover="dispHdSd(' + playerID + ');" onmouseout="hideHdSd(' + playerID + ');"></span></a><span style="display:none" id="hdSpanBar' + playerID + '" class="hdSpanBar" onmouseover="dispHdSd(' + playerID + ');" onmouseout="hideHdSd(' + playerID + ');"><ul><li><a href="javascript:;" id="hdplug' + playerID + '" onclick="hdswitch(' + playerID + ',\'' + HD + '\');">HD</a></li><li><a id="sdplug' + playerID + '" href="javascript:;" onclick="sdswitch(' + playerID + ',\'' + SD + '\');">SD</a></li></ul></span></li></ul><div class="player-logo"><a href="'+canvas_link+'" target="_blank" style="cursor:pointer"></a><span style="display:none" id="lcTip' + playerID + '" class="lcTip" onmouseover="dispLcTip(' + playerID + ');" onmouseout="hideLcTip(' + playerID + ');"><ul><li><a href="javascript:;">Watch on LittleCast</a></li></ul></span></div>';
        else
            controlsTemplate = '<div class="play-bar-wrap"><div class="play-bar-wraper"><div %{scrubber}><div %{loaded}></div><div %{playhead}></div><div %{scrubberdrag}></div></div></div></div><div class="control-wraper clearfix"><ul class="play fl"><li><a href="javascript:;" onclick="return false;"><div %{play}></div><div %{pause}></div></a></li><li id="vBar' + playerID + '"><span class="ppmute" id="vmute' + playerID + '" onclick="vToggle(1,' + playerID + ');" onmouseover="dispVolMute(' + playerID + ');" onmouseout="hideVolTip(' + playerID + ');"></span><span onclick="vToggle(2,' + playerID + ');" style="display:none" id="vmax' + playerID + '" class="ppvmax" onmouseover="dispVolTip(' + playerID + ');" onmouseout="hideVolTip(' + playerID + ');"></span><span style="display:none" id="volTip' + playerID + '" class="volTip"><ul><li><a id="volText' + playerID + '" href="javascript:;">Mute</a></li></ul></span></li></ul><div class="left-section clearfix"><ul class="link icos fl"><li><span class="btnabout_profile" id="aboutBtn' + playerID + '" onclick="btnAbout(' + playerID + ');">About</span></li></ul></div><div class="right-section clearfix"><ul class="link icos fl"><li><div %{timeleft}>%{hr_elp}:%{min_elp}:%{sec_elp} <span class="grey">/ %{hr_dur}:%{min_dur}:%{sec_dur}</span></div></li><li id="fscrWrapper' + playerID + '"><li id="hdWrapper' + playerID + '"><a href="javascript:;" ><span id="hdsdswitch' + playerID + '" class="hdsd" onmouseover="dispHdSd(' + playerID + ');" onmouseout="hideHdSd(' + playerID + ');"></span></a><span style="display:none" id="hdSpanBar' + playerID + '" class="hdSpanBar" onmouseover="dispHdSd(' + playerID + ');" onmouseout="hideHdSd(' + playerID + ');"><ul><li><a href="javascript:;" id="hdplug' + playerID + '" onclick="hdswitch(' + playerID + ',\'' + HD + '\');">HD</a></li><li><a id="sdplug' + playerID + '" href="javascript:;" onclick="sdswitch(' + playerID + ',\'' + SD + '\');">SD</a></li></ul></span></li></ul><div class="player-logo"><a href="'+canvas_link+'" target="_blank" style="cursor:pointer"></a><span style="display:none" id="lcTip' + playerID + '" class="lcTip" onmouseover="dispLcTip(' + playerID + ');" onmouseout="hideLcTip(' + playerID + ');"><ul><li><a href="javascript:;">Watch on LittleCast</a></li></ul></span></div>';
    }

    if ( video_record_type == 1  && !is_email_shared && !is_owner && !is_video_purchased){
        var fan_connect_video = true;
        controlsTemplate = controlsTemplate + '<div class="button1" id="player-buy-button' + playerID + '"><a href="#" onclick ="watchFullVideo(\''+buyURL+'\'); ">Watch Full Video</a></div>';
    }
    else if (video_record_type == 1  && is_email_shared && !is_owner ){
        var fan_connect_video = true;
        if (video_price != "0.0" && !is_video_purchased)
            controlsTemplate = controlsTemplate + '<div class="button1" id="player-buy-button' + playerID + '"><a href="' + buyURL + '" target="_blank" >Buy Now</a></div>';
    }

    else if(video_record_type == 0 && buy){
        if (buyLink) {
                if (controller_action_name == "profile_show")
                    controlsTemplate = controlsTemplate + '<div class="button1" id="player-buy-button' + playerID + '"><a href="' + buyURL + '" onclick ="track_buy_google_analytic();">Buy Now</a></div>';
                else
                    controlsTemplate = controlsTemplate + '<div class="button1" id="player-buy-button' + playerID + '"><a href="' + buyURL + '" target="_blank" onclick ="track_buy_google_analytic();">Buy Now</a></div>';
        } else
            controlsTemplate = controlsTemplate + '<div class="button1" id="player-buy-button' + playerID + '"><a href="javascript:;" onclick="showTOSForm(' + playerID + '); track_buy_google_analytic();">Buy Now</a></div>';
    }

    controlsTemplate = controlsTemplate + '</div></div>';
    var PAY_SERVER = SERVER.substr(0, (SERVER.length - 3));

    try {
        if (!embedded) {
            projekktor('#vdo-player' + playerID, {
                playerFlashMP4: PAY_SERVER + "/assets/StrobeMediaPlayback.swf",
                playerFlashMP3: PAY_SERVER + "/assets/StrobeMediaPlayback.swf",
                enableFullscreen: true,
                enableKeyboard: true,
                debug: false,
                imageScaling: 'aspectratio',
                videoScaling: 'aspectratio',
                plugin_controlbar: {
                    controlsDisableFade: true,
                    showOnStart: true,
                    showOnIdle: true,
                    controlsTemplate: controlsTemplate
                }
            });
        }
        else {
            projekktor('#vdo-player' + playerID, {
                playerFlashMP4: PAY_SERVER + "/assets/StrobeMediaPlayback.swf",
                playerFlashMP3: PAY_SERVER + "/assets/StrobeMediaPlayback.swf",
                enableFullscreen: true,
                enableKeyboard: true,
                debug: false,
                imageScaling: 'aspectratio',
                videoScaling: 'aspectratio',
                iframe: true,
                plugin_controlbar: {
                    controlsDisableFade: true,
                    showOnStart: true,
                    showOnIdle: true,
                    controlsTemplate: controlsTemplate
                }
            });
        }

        if(fan_connect_video && (is_email_shared || is_owner) ){
            $('#previewBtn' + playerID).hide();
            $('#aboutBtn' + playerID).hide();
        }

        if (buy || fan_connect_video) {

            if (disableVideoInformation)
                $('#video-information-in' + playerID).hide();
            else
                $('#video-information-in' + playerID).show();

            $("#about-video-in" + playerID).attr('style', "display:none");
            $("#video-category" + playerID).show();
            $('#hdsdswitch' + playerID).hide();
            $('#fscreenCtrl' + playerID).hide();
            $('#hdWrapper' + playerID).hide();
            $('#fscrWrapper' + playerID).hide();
            $('#vBar' + playerID).hide();
            $('#player-buy-button' + playerID).show();
            addPreviewListener(playerID);

            if (showTos) {
                $('#video-information-in' + playerID).show();
                showTOSForm(playerID);
            }

        }
        else {

            $('#fscreenCtrl' + playerID).show();
            $('#hdWrapper' + playerID).show();
            $('#fscrWrapper' + playerID).show();
            $('#hdsdswitch' + playerID).show();
            $('#vBar' + playerID).show();
            $('#previewBtn' + playerID).hide();
            $('#aboutBtn' + playerID).hide();
            $('#player-buy-button' + playerID).hide();

            if (HD != null && SD != null) {
                video_to_play = {
                    0: {
                        src: HD,
                        type: 'video/mp4'
                    }
                };
                $('#hdplug' + playerID).html('-HD');
                $('#sdplug' + playerID).html('SD');

            }
            else {
                alert('HD or SD are under proccess. You are viewing this video in 320P');
                video_to_play = {
                    0: {
                        src: SD,
                        type: 'video/mp4'
                    }
                };

                $('#hdplug' + playerID).html('HD');
                $('#sdplug' + playerID).html('-SD');
            }
            setTimeout(function(){
            projekktor('#vdo-player' + playerID).setItem(video_to_play, 0, true);
            projekktor('#vdo-player' + playerID).setStop();
            addStreamListener(playerID);
            }, 1000);
        }
        //hide video info header everywhere
        if( video_record_type == 2) {
            $('#video-information-in' + playerID).show();
            disableVideoInformation = false;
        }else if (!(videoHeader) ) {
            $('#video-information-in' + playerID).hide();
            disableVideoInformation = true;
        }


        $('#paymentDiv' + playerID).hide();
        vToggle(2, playerID);
        setVid(playerID);
        addEventListeners();
        $('.btnabout_profile').css("display", "block");
        } catch (ex) {
            if (DEBUG == true)
                alert(ex.message);
        }

}

function gcd(a, b) {
    return (b == 0) ? a : gcd(b, a % b);
}

function dispVolMute(video_id) {

    if (typeof(video_id) == 'undefined')
        video_id = '';

    $('#volText' + video_id).html('Mute');
    $('#volTip' + video_id).show();
    if (DEBUG)
        console.log("SHOW MUTE TIP");
}


function vToggle(state, video_id) {
    if (typeof(video_id) == 'undefined')
        video_id = '';
    if (state == 1) {
        $('#vmute' + video_id).hide();
        $('#vmax' + video_id).show();
    } else {
        $('#vmute' + video_id).show();
        $('#vmax' + video_id).hide()
    }
}

function hideVolTip(video_id) {
    if (typeof(video_id) == 'undefined')
        video_id = '';
    $('#volTip' + video_id).hide();
    if (DEBUG)
        console.log("HIDE VOL TIP");
}

function dispFscr(video_id) {
    if (typeof(video_id) == 'undefined')
        video_id = '';
    $('#fscr' + video_id).show();

    if (DEBUG)
        console.log("Show FS");
}

function hideFscr(video_id) {
    if (typeof(video_id) == 'undefined')
        video_id = '';
    $('#fscr' + video_id).hide();

    if (DEBUG)
        console.log("HIDE FS");
}

function hideLcTip(video_id) {
    if (typeof(video_id) == 'undefined')
        video_id = '';
    $('#lcTip' + video_id).hide();

    if (DEBUG)
        console.log("HIDE LC TIP");
}

function dispLcTip(video_id) {
    if (typeof(video_id) == 'undefined')
        video_id = '';
    $('#lcTip' + video_id).show();
    if (DEBUG)
        console.log("show LC TIP");
}

function dispVolTip(video_id) {
    if (typeof(video_id) == 'undefined')
        video_id = '';
    $('#volText' + video_id).html('Unmute');
    $('#volTip' + video_id).show();

    if (DEBUG)
        console.log("SHOW VOL TIP");
}

function dispVolMute(video_id) {
    if (typeof(video_id) == 'undefined')
        video_id = '';
    $('#volText' + video_id).html('Mute');
    $('#volTip' + video_id).show();
    if (DEBUG)
        console.log("SHOW MUTE TIP");
}

function hideVolTip(video_id) {
    if (typeof(video_id) == 'undefined')
        video_id = '';
    $('#volTip' + video_id).hide();
    if (DEBUG)
        console.log("HIDE VOL TIP");
}

function btnPreview(video_id) {
    if (typeof(video_id) == 'undefined')
        video_id = '';
    projekktor('#vdo-player' + video_id).setPlay();
    $('#previewBtn' + video_id).hide();
    $('#aboutBtn' + video_id).hide();
}

function btnAbout(video_id) {
    if (typeof(video_id) == 'undefined')
        video_id = '';
    $('#paymentDiv' + video_id).hide();
    if (($('#about-video-in' + video_id).is(":visible"))) {

        if (disableVideoInformation)
            $('#video-information-in' + video_id).hide();

        $("#about-video-in" + video_id).attr('style', "display:none");
    } else {
        $('#video-information-in' + video_id).show();
        $("#about-video-in" + video_id).attr('style', "display:block");
    }
}

function hideHdSd(video_id) {
    if (typeof(video_id) == 'undefined')
        video_id = '';
    $('#hdSpanBar' + video_id).hide();
}

function dispHdSd(video_id) {
    if (typeof(video_id) == 'undefined')
        video_id = '';
    if (($('#hdSpanBar' + video_id).is(":visible"))) {
        hideHdSd(video_id);
    }
    else
        $('#hdSpanBar' + video_id).show();
}


function hdswitch(video_id, HD) {
    if (typeof(video_id) == 'undefined')
        video_id = '';
    if ($('#sdplug' + video_id).text() == "-SD") {
        var videoToPlay = {
            0: {
                src: HD,
                type: 'video/mp4'
            }
        };
        var elapsedTime = projekktor('#vdo-player' + video_id).getPosition();
        projekktor('#vdo-player' + video_id).setItem(videoToPlay, 0, true);

        projekktor('#vdo-player' + video_id).setPlay();
        projekktor('#vdo-player' + video_id).setPlayhead("+" + elapsedTime);
        $('#hdplug' + video_id).html('-HD');
        $('#sdplug' + video_id).html('SD');
        hideHdSd(video_id);
    } else {
        //Do nothing
    }
}

function sdswitch(video_id, SD) {
    if (typeof(video_id) == 'undefined')
        video_id = '';
    if ($('#hdplug' + video_id).text() == '-HD') {

        var videoToPlay = {
            0: {
                src: SD,
                type: 'video/mp4'
            }
        };
        var elapsedTime = projekktor('#vdo-player' + video_id).getPosition();
        projekktor('#vdo-player' + video_id).setItem(videoToPlay, 0, true);

        projekktor('#vdo-player' + video_id).setPlay();
        projekktor('#vdo-player' + video_id).setPlayhead("+" + elapsedTime);
        $('#sdplug' + video_id).html('-SD');
        $('#hdplug' + video_id).html('HD');
        hideHdSd(video_id);
    } else {
        //Do nothing
    }
}
function DataCall(Data, Url, Type, Secure, SuccessCallBack, ErrorCallBack) {

    if (Secure == true) {
        var sec = SecureKey();
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
        success: function (data) {
            SuccessCallBack(data);
        },
        error: function (data) {
            ErrorCallBack(data);
        }
    });

    req.done(function (msg) {
        if (DEBUG)
            console.log('Done: Data Call >> ' + JSON.stringify(msg) + " - " + " :: URL :: " + Url);
    });

    req.fail(function (jqXHR, textStatus) {
        if (DEBUG)
            console.log('Fail: Data Call >> ' + JSON.stringify(jqXHR) + " - " + JSON.stringify(textStatus) + " :: URL :: " + Url);
    });

    req.complete(function (jqXHR, textStatus) {
        if (DEBUG)
            console.log('Complete: Data Call >> ' + JSON.stringify(jqXHR) + " - " + JSON.stringify(textStatus) + " :: URL :: " + Url);
    });
}

function SecureKey() {

    var timestamp = new Date();
    var int_timestamp = timestamp.getTime();
    var auth = int_timestamp + DEVICE_AUTH;
    var hash = CryptoJS.MD5(auth);

    return {
        hash: hash,
        timestamp: int_timestamp,
        auth: auth,
        key: "time=" + int_timestamp + "&security_token=" + hash
    };
}

function Error(Title, Message) {
    if (DEBUG)
        console.log(Title + " : " + Message);
}

function fb_login() {
    try {
        FB.getLoginStatus(function (response) {
            //alert('getLoginStatus ::' + response.status);
            if (response.status === 'connected') {
                FB.api('/me', function (me) {
                    //alert('  status  ---  getLoginStatus ::  ');
                    //alert(me);
                    res = response.authResponse;
                    if (me) {
                        social_login(me);
                    }
                });
            }
        });
    } catch (ex) {
        alert(ex.message)
    }
}


function embfblogin(videoid, action) {
    if (typeof(action) == 'undefined')
        action = '';
    FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
            fb_login(action)
        } else {
            FB.logout(function () {/*just exit*/
            });
            FB.login(function (response) {
                if (response.authResponse) {
                    fb_login('start_buy_process')
                } else {
                    // The person cancelled the login dialog
                }
            });
        }
    });
}

function social_login(me) {
    //alert('social_login');

    FB_USER = me;
    //$('#current-user').html ('<img alt="" src="https://graph.facebook.com/' + me.id + '/picture" width="50" height="50">');

    var access_token = FB.getAuthResponse()['accessToken'];
    var data = 'fb_id=' + me.id + '&user[first_name]=' + me.first_name + '&user[last_name]=' + me.last_name + '&user[email]=' + me.email + '&user[name]=' + me.username + '&accessToken=' + access_token;

    DataCall(data, SERVER + REGISTER, "POST", false,
        function (data) {

            if (data.success == true) {

                if (DEBUG)
                    console.log('login success');

                LC_USER = data.data.user;
                //alert(LC_USER);
                DEVICE_AUTH = data.data.user.device_auth_token;
                //SuccessCallBack ();
            } else
                Error("Sign In", "Invalid information.");
        },
        function () {
            Error("Sign In", "An error occured.");
        }
    );
}

function limitText(limitField, limitCount, limitNum) {
    if ($('#' + limitField).val().length > limitNum) {
        $('#' + limitField).val($('#' + limitField).val().substring(0, limitNum));
    } else {
        $('#' + limitCount).html(limitNum - $('#' + limitField).val().length + " characters.");
    }
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
    $('#social_sharing_message_div').show();
    $('#social_sharing_message_div').html('Watch activity removed from Facebook and LittleCast &nbsp;<a href="javascript:;" onclick="addPreviewAct();" style="color: #d72a1e; text-decoration: none;">X</a>');
}

function addPreviewAct() {
    //addPreview();
    //$('#prev-text-for-user').html('Added to your timeline &nbsp;<a href="#" onclick="removePreviewAct();">CLICK TO REMOVE</a>');
    $('#social_sharing_message_div').html("");
}

function showPrevText() {
    if (social_sharing && postId) {
        $('#social_sharing_message_div').show();
        $('#social_sharing_message_div').html('Watch activity shared on Facebook and LittleCast -&nbsp;<a href="javascript:;" onclick="removePreviewAct();" style="color: #d72a1e; text-decoration: none;">Remove</a>');
    }
}

function sendPreviewCall() {
    try {
        var a = projekktor('#vdo-player' + vid).getDuration();

        if (a >= 10 && (!videoLengthLegal)) {
            videoLengthLegal = true;
        }
    } catch (ex) {
    }

    if (!prevCallSent) {
        if ((videoLengthLegal) && (!(previewFlag))) {
            DataCall("device=LCWebsite", SERVER + VIDEOS + vid + PREVIEWED, "GET", true,
                function (data) {
                    if (DEBUG)
                        console.log("Registered Success");
                    activityId = data.data.activity_id;
                    postId = data.data.post_id;
                    social_sharing = data.data.is_social_on;

                    if (DEBUG)
                        console.log("activity_id: " + activityId + " postid:" + postId);

                    showPrevText();
                },
                function (data) {
                    if (DEBUG)
                        console.log("Unregistered preview");
                });
            previewFlag = true;
            clearInterval(intervalID);
        }
    }
    if ((projekktor('#vdo-player' + vid).getPosition() >= 10) && (!(previewFlag))) {

        DataCall("device=LCWebsite", SERVER + VIDEOS + vid + PREVIEWED, "GET", true,
            function (data) {
                if (DEBUG)
                    console.log("Registered Success");
                activityId = data.data.activity_id;
                postId = data.data.post_id;
                social_sharing = data.data.is_social_on;

                if (DEBUG)
                    console.log("activity_id: " + activityId + " postid:" + postId);

                showPrevText();
            },
            function (data) {
                if (DEBUG)
                    console.log("Unregistered preview");
            });
        previewFlag = true;
        clearInterval(intervalID);
    }
}

function addPreviewListener(playerID) {
    projekktor('#vdo-player'+ playerID).addListener('time', previewTimeListener);

    projekktor('#vdo-player' + playerID).addListener('state', function (state) {
        var index = checkIndex(playerID);
        switch (state) {
            case 'STARTING':
                var ua = navigator.userAgent.toLowerCase();
                if (ua.indexOf("firefox") > -1) {
                    $('#playButton' + playerID).removeClass('active');
                    $('#playButton' + playerID).addClass('inactive');
                    $('#pauseButton' + playerID).removeClass('inactive');
                    $('#pauseButton' + playerID).addClass('active');
                    $('#video-information-in' + playerID).hide('slow');
                    $('#previewBtn' + playerID).hide();
                    $('#aboutBtn' + playerID).hide();
                    $('#vBar' + playerID).show();
                    $('#fscrWrapper' + playerID).show();
                    $('#fscreenCtrl' + playerID).show();
                }
                break;
            case 'PLAYING':
                if(!playEventLog){
                    ga('send', 'event', VIDEO_TYPE, 'Video Play', VIDEO_UUID + ':' + VIDEO_TITLE);
                    playEventLog = true;
                }

                $('#paymentDiv' + playerID).hide();
                $('#video-information-in' + playerID).hide('slow');
                $('#previewBtn' + playerID).hide();
                $('#aboutBtn' + playerID).hide();
                $('#vBar' + playerID).show();
                $('#fscrWrapper' + playerID).show();
                $('#fscreenCtrl' + playerID).show();

                break;

            case 'COMPLETED':
                ga('send', 'event', VIDEO_TYPE, 'Finished Video', VIDEO_UUID + ':' + VIDEO_TITLE);
                if( VIDEO_TYPE == 'FanConnect')
                    loadEmailPremissionDiv( _BUYURL );
                playEventLog   = false;
            case 'STOPPED':

                if (!(previewFlag))
                    prevCallSent = false;

                if (disableVideoInformation)
                    $('#video-information-in' + playerID).hide();
                else
                    $('#video-information-in' + playerID).show();
                $("#about-video-in" + playerID).attr('style', "display:none");
                if (DEBUG) {
                    console.log("displaying previewBtn on the stopped event addPreviewListener");
                    console.log(is_video_bought);
                }
                if (!is_video_bought) {
                    $('#previewBtn' + playerID).show();
                    $('#aboutBtn' + playerID).show();
                }
                $('#vBar' + playerID).hide();
                $('#hdsdswitch' + playerID).hide();
                $('#fscreenCtrl' + playerID).hide();
                $('#hdWrapper' + playerID).hide();
                $('#fscrWrapper' + playerID).hide();
                //IE FIX
                var ua = navigator.userAgent.toLowerCase();
                if (ua.indexOf("firefox") > -1) {
                    $('#playButton' + playerID).removeClass('inactive');
                    $('#playButton' + playerID).addClass('active');
                    $('#pauseButton' + playerID).removeClass('active');
                    $('#pauseButton' + playerID).addClass('inactive');
                }
                break;

            case 'PAUSED':
                var ua = navigator.userAgent.toLowerCase();
                if (ua.indexOf("firefox") > -1) {
                    $('#playButton' + playerID).removeClass('inactive');
                    $('#playButton' + playerID).addClass('active');
                    $('#pauseButton' + playerID).removeClass('active');
                    $('#pauseButton' + playerID).addClass('inactive');
                }
                break;
        }
    });
}

function removePreviewListener(playerID) {

    projekktor('#vdo-player'+ playerID).removeListener('time', previewTimeListener);
    projekktor('#vdo-player' + playerID).removeListener('state', function (state) {});
}

function addStreamListener(playerID) {

    projekktor('#vdo-player'+ playerID).addListener('time', streamTimeListener);
    projekktor('#vdo-player' + playerID).addListener('state', function (state) {
        var index = checkIndex(playerID);

        switch (state) {
            case 'STARTING':
                var ua = navigator.userAgent.toLowerCase();
                if (ua.indexOf("firefox") > -1) {
                    $('#playButton' + playerID).removeClass('active');
                    $('#playButton' + playerID).addClass('inactive');
                    $('#pauseButton' + playerID).removeClass('inactive');
                    $('#pauseButton' + playerID).addClass('active');
                    $('#vBar' + playerID).show();
                }
                break;

            case 'PLAYING':
                $('#video-information-in' + playerID).hide('slow');
                if(!playEventLog){
                    ga('send', 'event', VIDEO_TYPE, 'Video Play', VIDEO_UUID + ':' + VIDEO_TITLE);
                    playEventLog = true;
                }

                break;
            case 'STOPPED':
            case 'COMPLETED':

                ga('send', 'event', VIDEO_TYPE, 'Finished Video', VIDEO_UUID + ':' + VIDEO_TITLE);
                playEventLog   = false;
                

                var ua = navigator.userAgent.toLowerCase();
                if (ua.indexOf("firefox") > -1) {
                    $('#playButton' + playerID).removeClass('inactive');
                    $('#playButton' + playerID).addClass('active');
                    $('#pauseButton' + playerID).removeClass('active');
                    $('#pauseButton' + playerID).addClass('inactive');
                }
                break;
                $('#previewBtn' + playerID).hide();
                $('#aboutBtn' + playerID).hide();
        }
    });
}

function AddComment(evt, playerID) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    var comment_text = $('#comment_text' + playerID).val();

    if ((charCode == 13 && comment_text != '' && (/\S/.test(comment_text)) )) {

        var posted_at = dateFormat(new Date(), "yyyy-mm-dd'T'HH:MM:ss");
        var comment = {
            user: {
                first_name: LC_USER.first_name,
                last_name: LC_USER.last_name,
                profile_name: LC_USER.profile_name,
                uid: LC_USER.uid
            },
            id: "1",
            comment: comment_text,
            title: null,
            created_at: posted_at
        }

        $('#comments' + playerID).prepend(newCommentStructure(comment, false));
        $('#comment_text' + playerID).val('');

        DataCall("device=website&comment[title]=" + comment.title + "&comment[comment]=" + comment.comment, SERVER + VIDEOS + playerID + "/" + COMMENT, "POST", true,

            function (data) {
                var count = $('#comments-count' + playerID).html();
                var newCount = (parseInt(count, 10)) + 1;
                $('#comments-count' + playerID).html(newCount);
                $('#comment_text' + playerID).val('');
                $('#comment-error' + playerID).hide();
                $('#comment-chars' + playerID).html('500 characters.');
            },

            function (data) {
                $('#comment-error' + playerID).show();
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
        comment_body = comment_body + '<div class="comment-time" title="' + stamp.stamp + '">. Just Now</div>';
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
            stamp = Math.floor(sec_diff / 60) + " minutes ago";
        else if (sec_diff < 7200 && day_diff == 0)
            stamp = "1 hour ago";
        else if (sec_diff < 86400 && day_diff == 0)
            stamp = Math.floor(sec_diff / 3600) + " hours ago";
        else if (day_diff == 1)
            stamp = "Yesterday";
        else if (day_diff < 7)
            stamp = day_diff + " days ago";
        else if (day_diff < 31) {
            var weekCount = Math.ceil(day_diff / 7);
            if (weekCount > 1)
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
        if (DEBUG)
            console.log("Invalid DateTime Format. << DateTime");

        return {
            user_stamp: '',
            utc: '',
            stamp: ''
        };

    }
}

function checkIndex(playerID) {
    var index = 0;

    for (var i = 0; i < playReq.length; i++) {
        if (playReq[i][0] == playerID) {
            index = i;
            break;
        }
    }
    return index;
}

var playReq = [
    ['45', 0],
    ['46', 0],
    ['47', 0]
];
//var LC_USER=
//var DEVICE_AUTH

function newCommentStructure(comment, posted) {

    console.log(comment.user)

    var comment_body = "";
    var stamp = TimeStamp(comment.created_at);
    var username = comment.user.first_name + ' ' + comment.user.last_name;

    comment_body = comment_body + '<div class="media view-comments">';
    comment_body = comment_body + '<a class="pull-left" href="#">';
    comment_body = comment_body + '<img alt="' + username + '" src="' + $('#current_user_dp').prop('src') + '" alt="" class="media-object hold-pic video_detail_page_pp">';
    comment_body = comment_body + '</a>';
    comment_body = comment_body + '<div class="media-body">';
    comment_body = comment_body + '<h4 class="media-heading"><a href="/'+comment.user.profile_name+'" >' + username + '</a><span>';

    if (!(posted))
        comment_body = comment_body + '. Just Now</span></h4>';
    else
        comment_body = comment_body + stamp.user_stamp + '</span></h4>';

    comment_body = comment_body + '<p>' + comment.comment + '</p></div>';

    return comment_body;
}


$(document).ready(function(){
    if( typeof PAYPAL != 'undefined' )
        try{
            window.dg = new PAYPAL.apps.DGFlow({trigger: 'paypal_submit',expType: 'instant'           });
        }catch(ex){}
})


var previewTimeListener = function(value) {
    logPreview(value);
}

var streamTimeListener = function(value) {
//    if(VIDEO_RECORD_TYPE == 0 || VIDEO_RECORD_TYPE == 1)
    logStreamView(value);
}

var logPreview = function(time) {

    if( !VIEW_CALL_SENT && time > 3 ){
        VIEW_CALL_SENT  = true ;
        ga('send', 'event', VIDEO_TYPE, 'Video View', VIDEO_UUID + ':' + VIDEO_TITLE);

        parameters = "device="+ DEVICE + "&log_fb_activity=false&log_preview=true"
        if(DEVICE != "LCWebsite")
          parameters += "&uid=" + LC_USER.uid

        DataCall(parameters, SERVER + VIDEOS + vid + PREVIEWED, "GET", false,
            function (data) {
                if(DEBUG)
                    console.log("Registered Success");
            },
            function (data) {
                if(DEBUG)
                    console.log("Unregistered preview");
            });

    } else if( !SECOND_PREVIEW_CALL_SENT && time > 9 ) {

        SECOND_PREVIEW_CALL_SENT = true;
        parameters = "device="+ DEVICE + "&log_fb_activity=true&log_preview=false"
        if(DEVICE != "LCWebsite")
            parameters += "&uid=" + LC_USER.uid

        DataCall(parameters, SERVER + VIDEOS + vid + PREVIEWED, "GET", false,
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

logStreamView = function(time) {

    if( !THREE_SEC_STREAM_CALL_SENT && time > 3 && (VIDEO_TYPE == 'ShopConnect' || VIDEO_TYPE == 'FreeVideo') ) {

        ga('send', 'event', VIDEO_TYPE, 'Video View', VIDEO_UUID + ':' + VIDEO_TITLE);

        parameters = "device="+ DEVICE +"&uid=" + LC_USER.uid + "&log_fb_activity=false&log_preview=true";
        if(VIDEO_TYPE == 'FreeVideo')
            parameters += '&time_watched=0'
        url = SITE_URL + SERVICE_KEY + vid + UPDATE_STREAM;

        DataCall(parameters, url, 'GET', false,
            function (data) { },
            function (data) { }
        );
        THREE_SEC_STREAM_CALL_SENT = true;

    } else if ( !STREAM_CALL_SENT && time > 9 ) {

        if(VIDEO_TYPE == 'FanConnect' || VIDEO_TYPE == 'PaidVideo')
            ga('send', 'event', VIDEO_TYPE, 'Video View', VIDEO_UUID + ':' + VIDEO_TITLE);

        parameters = "device="+ DEVICE +"&uid=" + LC_USER.uid + "&log_fb_activity=true&log_preview=false";
        request_method = 'GET';
        scure = false

        if(VIDEO_TYPE == 'PaidVideo'){
            url = SERVER + VIDEOS + vid + UPDATE_PAID_STREAM;
            parameters += '&request_type=stream_request'
            request_method = 'POST';
            scure = true;
        } else {
            url = SITE_URL + SERVICE_KEY + vid + UPDATE_STREAM;
        }

        if(VIDEO_TYPE == 'FreeVideo')
            parameters += '&time_watched=1'

        DataCall(parameters, url, request_method, scure,

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

var track_product_google_analytic = function(product_name) {
    ga('send', 'event', VIDEO_TYPE,'Product Click: ' + product_name, VIDEO_UUID + ':' + VIDEO_TITLE);
}

var track_watchfull_google_analytic = function() {
    ga('send', 'event', VIDEO_TYPE, 'Watch Full Video', VIDEO_UUID + ':' + VIDEO_TITLE);
}


var track_buy_google_analytic = function() {
    ga('send', 'event', VIDEO_TYPE, 'Buy Now', VIDEO_UUID + ':' + VIDEO_TITLE);
}
function watchFullVideo( buyURL ){
     if (projekktor('#vdo-player'+PLAYER_ID).getState('PLAYING'))

        projekktor('#vdo-player'+PLAYER_ID).setPause();

    if ((window.fullScreen) || (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
        exitfs();
    }
    $('#video-information-in'+PLAYER_ID).hide();
    $('#thumbContainer').hide();
    loadEmailPremissionDiv(buyURL);
    $('#player-buy-button'+PLAYER_ID+' a').attr('disabled', true);
}
function loadEmailPremissionDiv(buyURL)
{
    track_watchfull_google_analytic();
    var from_page_name = 0;
    if( from_page_name ){
        var user_info = from_page_name ;
    }else{
        var user_info = PUBLISHER; // initilizing PUBLISHER is projekktor view file
    }
    $('.ppstart').removeClass('active');
    $('.ppstart').addClass('inactive');
    BUY_URL = buyURL;
    if (($('#about-video-in' + PLAYER_ID).is(":visible"))) {

        if (disableVideoInformation)
            $('#video-information-in' + PLAYER_ID).hide();

        $("#about-video-in" + PLAYER_ID).attr('style', "display:none");
    }

    if($('#full_video_gateway').val() == "SOCIAL_SHARE")
        $('#paymentDiv'+ PLAYER_ID).html('<div class="pop-full email-premission-container" id="watch-full-overlay" style="display:block;height:100%"><h2 class="want-to-connet"> '+user_info+' wants you to spread the word</h2><h2 class="share-email-with">Share this preview using LittleCast to access full video</h2><a href="'+BUY_URL+'&share_type=fb_share" style="display: table; margin: auto;" target="_blank" onclick="track_share_google_analytic();"> <img src="/assets/btn-facebook.png" /></a></div>');
    else
        $('#paymentDiv'+ PLAYER_ID).html('<div class="pop-full email-premission-container" id="watch-full-overlay" style="display:block;height:100%"><h2 class="want-to-connet"> '+user_info+' wants to connect with you</h2><h2 class="share-email-with">Share your information with '+user_info+' to </h2><a href="'+BUY_URL+'&track_email=1" class="watch-full-video-button" target="_blank" onclick="track_share_google_analytic();" > Access Full Video </a></div>');

    $('#paymentDiv'+ PLAYER_ID).fadeIn();
}
var track_share_google_analytic = function() {
    ga('send', 'event', VIDEO_TYPE, 'Select Share Method', VIDEO_UUID + ':' + VIDEO_TITLE);
}