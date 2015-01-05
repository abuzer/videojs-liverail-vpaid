FB_USER = new Object();
LC_USER = new Object();
window.fbAsyncInit = function() {	
	if(DEBUG) 
		console.log("CALLING FB INIT");

	FB.init({
		appId      : FB_APP_ID,		
		status     : true,
		cookie     : true,
		xfbml      : true,
		oauth      : true
	});
	 
	 //FB.Canvas.setAutoGrow(1000); //Resize every 1000 millisecs
	 if(DEBUG) 
		console.log("FB INIT CALL COMPLETE");
		
	if(DEBUG) 
		console.log("CALLING WATCH FUNCTION");

	fblogin( function(){} );
	FB.Canvas.setAutoGrow(1000);		
}

  function getParentUrl() {
      var isInIframe = (parent !== window),
          parentUrl = null;

      if (isInIframe) {
          parentUrl = document.referrer;
      }

      return parentUrl;
  }

function fblogin (SuccessCallBack){
	FB.getLoginStatus(function(response){
		console.log( response );
	if (response.status === 'connected'){
		FB.api('/me', function(me) {
			res = response.authResponse;
			if (me) {
				social_login (me, function (){watchFunction()});
			}
		});
	}else{
		FB_USER.email = "";
		FB_USER.first_name = "";
		FB_USER.id = 0;
		FB_USER.uid = 0;
		FB_USER.last_name = "";
		FB_USER.link = "";
		FB_USER.locale = "";
		FB_USER.location = "";
		FB_USER.name = "";
		FB_USER.timezone = "";
		FB_USER.updated_time = "";
		FB_USER.username = "";
		FB_USER.verified = "";

		LC_USER = FB_USER ;
		if(getParameterByName("share_type") == "fb_share"){
			setCookie("social_share", 'facebook', 1/24/58);
		}

		if( getParameterByName('from_flash_player') ==1 || getParameterByName('from_flash_player') =='1'){
			reLogin();
		}
		watchFunction();
	}
});
}

function embfblogin (SuccessCallBack,RED_URL){

	FB.getLoginStatus(function(response){
		if (response.status === 'connected'){
			FB.api('/me', function(me) {
				res = response.authResponse;
				if (me) {
					social_login (me, SuccessCallBack);
				}
			});
		}else{	
			FB.logout(function(response) {
			//do nothing really
			});	
			FB.login(function(response) {
			    if (response.authResponse) {
			        FB.api('/me', function(me) {
						res = response.authResponse;
						if (me) {
							social_login (me, SuccessCallBack);
						}
					});
			    } else {
			        // The person cancelled the login dialog
			    }
			});		
		}
	});
}
