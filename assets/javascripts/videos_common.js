/*
	Will be placing the common functon in this file for all type of videos, 
*/
function social_login (me, SuccessCallBack){
	try{
		var location = me.location.name.split(","); 
		me.city =  location.length>1 ?location[0] : "" ;
		me.country = location.length>1 ?location[1] : location[0];
	}catch(err) {
		me.city = "";
		me.country = "";
	}
	
	FB_USER = me;
	$('#current-user').html ('<img alt="" src="https://graph.facebook.com/' + me.id + '/picture" width="50" height="50">');
	
	var access_token =  FB.getAuthResponse()['accessToken'];
	var data = 'fb_id=' + me.id + '&user[first_name]=' + me.first_name + '&user[last_name]=' + me.last_name + '&user[email]=' + me.email + '&user[name]=' + me.username + '&accessToken='+access_token + '&user[city]=' + me.city +'&user[country]=' + me.country;

	DataCall (data, SERVER + REGISTER, "POST", false,
		function (data){
		
			if (data.success == true){

				if(DEBUG) 
					console.log ('login success');
				
				LC_USER = data.data.user;				
				DEVICE_AUTH = data.data.user.device_auth_token;				
				SuccessCallBack ();
			}else
				Error ("Sign In", "Invalid information.");
		}, 
		function (){
			Error ("Sign In", "An error occured.");
		}
	);
}

$('#toggle-share').live('click', function(){
    if($('#prev-text-for-user').is(":visible"))
    {
        $('#prev-text-for-user').hide();
    }
    $('.share-video').fadeToggle(300);
});    

var timeListener = function(value) {
        logView(value);
}
var merchantTimeListener  = function(value) {    
        logMerchentView(value);
}

function logView( time ){
    if( !VIEW_CALL_SENT && time > 3 ){
        ga('send', 'event', 'PaidVideo', 'Video View', VIDEO_ID + ':' + $("#video-title-in").html());
        DataCall("device=FBApp&log_fb_activity=false&log_preview=true", SERVER + VIDEOS + VIDEO_ID + PREVIEWED, "GET", false,
        function (data) {
            if(DEBUG)
                console.log("Registered Success");
        },
        function (data) {
            if(DEBUG)
                console.log("Unregistered preview");
        });
        VIEW_CALL_SENT  = true ;
    }
}
function logMerchentView( time ){
    if( !VIEW_CALL_SENT && time > 3 ){
        ga('send', 'event', 'ShopConnect', 'Video View', VIDEO_ID + ':' + $("#video-title-in").html());
        DataCall("device=FBApp&log_fb_activity=false&log_preview=true", SITE_URL + MERCHANDISE_VIDEOS + VIDEO_ID + MERCHANDISE_UPDATE_STREAM, "GET", false,
        function (data) {
            console.log( ' ---------- ');
            console.log( data );
            if(DEBUG)
                console.log("Registered Success");
        },
        function (data) {
            if(DEBUG)
                console.log("Unregistered preview");
        });
        VIEW_CALL_SENT  = true ;
    }
}
Number.prototype.pad = function(size) {
      var s = String(this);
      if(typeof(size) !== "number"){size = 2;}

      while (s.length < size) {s = "0" + s;}
      return s;
}
function setTotalTime( media_length ){
    var x = media_length;
    var hours=  Math.floor(x / (1000*60*60));
    var minutes = Math.floor(x % ((1000*60*60)) / (1000*60));
    var seconds = Math.floor( ((x % (1000*60*60)) % (1000*60)) / 1000);
    if( hours == 00) {
        $('.pphr_dur').hide();
        $('.pphr_elp').hide();
        $('.hr_colon').hide();
    }
    $('.pphr_dur').html( hours.pad() );
    $('.ppmin_dur').html( minutes.pad());
    $('.ppsec_dur').html( seconds.pad());

}
function reLogin( clickType  ){
    clickType = typeof clickType !== 'undefined' ? clickType : '';
    if( LC_USER.id ==0 ){
        var start_payment = getParameterByName('start_payment') != '' ? "&start_payment="+getParameterByName('start_payment') : '';

        if( !VIDEO_ID )
             var VIDEO_ID  = getParameterByName('watch') != '' ? "&watch="+getParameterByName('watch') : '';

        var showpreview = getParameterByName('showpreview') == 1? "&showpreview=1" : '';
        var track_email = getParameterByName('track_email') == 1? "&track_email=1" : '';
        if(clickType == 'watchFullVideo'){
            var track_email = "&track_email=1";
        }
        if(clickType == 'buyNowPaid'){
            showpreview = "";
        }
        var buy = getParameterByName('buy') != '' ? "&buy="+getParameterByName('buy') : '';
        var page_id = getParameterByName('page_id') != '' ? "&page_id="+getParameterByName('page_id') : '';
        var from_page_id = getParameterByName('from_page_id') != '' ? "&from_page_id="+getParameterByName('from_page_id') : '';
        var page_name = getParameterByName('page_name') != '' ? "&page_name="+getParameterByName('page_name') : '';
        var publisher = getParameterByName('publisher') != '' ? "&publisher="+getParameterByName('publisher') : '';
        var free_video= getParameterByName('free_video') != '' ? '&free_video=1' : '';
        var merchandise_video= getParameterByName('merchandise_video') != '' ? '&merchandise_video=1' : '';
        if(getParameterByName('error')  == 'access_denied'){
        window.top.location = 'https://apps.facebook.com/'+ FB_APP_NAME + '/?access_denied=1&watch=' + VIDEO_ID +  showpreview +buy + publisher + page_name + page_id + merchandise_video + free_video +
              from_page_id  + track_email + start_payment;
        } else {
            var oauth_url = 'https://www.facebook.com/dialog/oauth/';
            oauth_url += '?client_id='+FB_APP_ID;
            if( (/Android|ipad|iPhone/i.test(navigator.userAgent)) ){
                REDIRECTED_URL = BASE_URL + 'fb';
            }else{
                REDIRECTED_URL = 'https://apps.facebook.com/'+ FB_APP_NAME;
            }

            oauth_url += '&redirect_uri=' + encodeURIComponent(REDIRECTED_URL + '/?watch=' + VIDEO_ID + showpreview +buy + publisher + page_name + page_id + merchandise_video + free_video +
              from_page_id  + track_email + start_payment );
            oauth_url += '&scope=email,publish_actions,publish_stream,user_location'
            window.top.location = oauth_url;

        }
    }

}

function getCookie(cname)
{
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) 
      {
      var c = ca[i].trim();
      if (c.indexOf(name)==0) return c.substring(name.length,c.length);
      }
    return "";
}

function setCookie(cname,cvalue,exdays)
{
    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function deleteCookie(cname)
{
    document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}
function canvas_mixpanle_merchandise(event_string, source, product_title,video_title, video_type ) {
    projekktor('#vdo-player').setPause();
    video_type = typeof video_type !== 'undefined' ? video_type : 'ShopConnect';
    video_title = typeof video_title !== 'undefined' ? video_title : '';
    ga('send', 'event', video_type,'Product Click: ' + product_title , VIDEO_ID + ':' + video_title);
}

function track_video_click(video_id){
    DataCall("device=FBApp&uid=" + LC_USER.uid + "&id=" + video_id, '/freevideo-upload/track_related_video_click' , 'GET', false,
        function () {
            console.log("success");
        },
        function () {
            console.log("failed");
        });
}
