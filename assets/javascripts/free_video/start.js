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
		
		FB.Event.subscribe('auth.login', function(response) {
			
			if(DEBUG) 
				console.log("FB API CALLED");

			FB.api('/me', function(me) {
				if(response.error)
				{
					alert("An error occured. Kindly refresh the page or try again later");
				}
				res = response.authResponse;
				if (me) {

				if(DEBUG) 	
					console.log("CALLING SOCIAL LOGIN");

					social_login (me, VideoStuff);

				if(DEBUG) 	
					console.log("SOCIAL LOGIN DONE");

				}else{
					alert ('Failed to get user information.');
				}
			});
		});		
		if(DEBUG) 
			console.log("CALLING WATCH FUNCTION");

		watchFunction();
		FB.Canvas.setAutoGrow(1000);		
	}	
   
function fblogin (SuccessCallBack){	

	FB.getLoginStatus(function(response){
		if (response.status === 'connected'){
			FB.api('/me', function(me) {
				res = response.authResponse;
				if (me) {
					social_login (me, SuccessCallBack);
				}
			});
		}else{					
			var track_email = getParameterByName('track_email') == 1? "&track_email=1" : '';
			var buy = getParameterByName('buy') != '' ? "&buy="+getParameterByName('buy') : '';
			var page_name = getParameterByName('page_name') != '' ? "&page_name="+getParameterByName('page_name') : '';
			var from_page_id = getParameterByName('from_page_id') != '' ? "&from_page_id="+getParameterByName('from_page_id') : '';
			var publisher = getParameterByName('publisher') != '' ? "&publisher="+getParameterByName('publisher') : '';
			var oauth_url = 'https://www.facebook.com/dialog/oauth/';
			oauth_url += '?client_id='+FB_APP_ID + '&free_video=1';
			oauth_url += '&redirect_uri=' + encodeURIComponent('https://apps.facebook.com/'+ FB_APP_NAME + '/?watch=' + VIDEO_ID + '&free_video=1' + track_email + buy + page_name + from_page_id + publisher);
			oauth_url += '&scope=email,publish_actions,publish_stream,user_location'
			window.top.location = oauth_url;
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
