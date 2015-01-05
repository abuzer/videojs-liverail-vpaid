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
			var oauth_url = 'https://www.facebook.com/dialog/oauth/';
			oauth_url += '?client_id='+FB_APP_ID;			
			oauth_url += '&redirect_uri=' + encodeURIComponent('https://apps.facebook.com/'+ FB_APP_NAME + '/?watch=' + VIDEO_ID);
			oauth_url += '&scope=email,publish_actions,manage_pages,publish_stream'
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

function social_login (me, SuccessCallBack){

	FB_USER = me;
	$('#current-user').html ('<img alt="" src="https://graph.facebook.com/' + me.id + '/picture" width="50" height="50">');
	
	var access_token =  FB.getAuthResponse()['accessToken'];
	var data = 'fb_id=' + me.id + '&user[first_name]=' + me.first_name + '&user[last_name]=' + me.last_name + '&user[email]=' + me.email + '&user[name]=' + me.username + '&accessToken='+access_token;

	DataCall (data, SERVER + REGISTER, "POST", false,
		function (data){
		
			if (data.success == true){

				if(DEBUG) 
					console.log ('login success');
				
				data.data.user.profile_name = "seomname";
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