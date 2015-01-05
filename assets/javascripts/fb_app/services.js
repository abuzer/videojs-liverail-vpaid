var SERVER = SERVER_URL;
var PAYMENT_FILE = "fb_app/payment.html";

// SERVICES
var IS_UNPUBLISHED = "can_purchase.json";
var IS_DELETED = "is_deleted.json";
var VIDEO_INFORMATION = "detail_information.json";
var VIDEO_COMMENTS = "make_payment/";
var COMMENT = "add_comment.json";
var VIDEO_LIKES = "video_likes.json";
var LIKE = "liked.json";									// >> VIDEOS
var UNLIKE = "unliked.json";								// >> VIDEOS
var VIDEO_ACCESS = "detail_information.json";				// >> LIBRARY
var PUBLISHER_VIDEOS = "make_purchase.json";
var MY_VIDEOS = "videos.json";								// NO METHOD. USING <LIBRARY>.json INSTEAD
var REGISTER = "device_signup/";
var SETUP_PAYMENT = "started.json";							// >> PAYMENTS
var PAYMENT_SUCCESS = "success.json";						// >> PAYMENTS
var PAYMENT_FAIL = "cancel.json";							// >> PAYMENTS
var PAYMENT_STATUS = "status";								// >> PAYMENTS
var STREAM_REQUEST = "stream_request.json";					// >> VIDEOS
var PREVIEWED = "/previewed.json";
var UPDATE_STREAM = "/update_video_stats.json";
// CONTROLLERS

var USERS = "users/";
var VIDEOS = "videos/";
var LIBRARY = "video_libraries/";
var PAYMENTS = "payments/";

// GLOBALS

var VIDEO_ID = 0;
var VIDEO;
var PUBLISHER;
//var FB_USER;	// FB SESSION
//var LC_USER;	// LC SESSION
var DEVICE_AUTH;

var BROWSER;
//var DEBUG = true;
var REAL_TIME_INTERVAL = 4000; // 1000 = 1 second

function DataCall (Data, Url, Type, Secure, SuccessCallBack, ErrorCallBack, is_async){
 
	if(typeof(is_async) == "undefined")
		is_async = true;  
	if (Secure == true){
		var sec = SecureKey ();
		//ADD DEVICE TO STREAM REQUEST
		//STREAM REQUEST IS THE ONLY ONE THAT HAS A GET METHOD AND IS SECURE
		if (Type == "GET" )
		{
			Data = sec.key + "&user_id=" + LC_USER.id + "&device=FBApp"+"&" + Data;
		}
		else
		{
			Data = sec.key + "&user_id=" + LC_USER.id + "&" + Data;
		}

	}


	var req = $.ajax({
		type: Type,
		url: Url,
		dataType: "json",
		data: Data,
		async: is_async,
		success: function (data){
			SuccessCallBack (data);
		},
		error: function (data){
			ErrorCallBack (data);
		}
	});

	req.done (function (msg){
		if(DEBUG)
			console.log ('Done: Data Call >> ' + JSON.stringify (msg));
	});

	req.fail(function(jqXHR, textStatus) {
		if(DEBUG)
			console.log ('Fail: Data Call >> ' + JSON.stringify (jqXHR) + " - " + JSON.stringify (textStatus) );
	});

	req.complete (function (jqXHR, textStatus){
		if(DEBUG)
			console.log ('Complete: Data Call >> ' + JSON.stringify (jqXHR) + " - " + JSON.stringify (textStatus) );
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