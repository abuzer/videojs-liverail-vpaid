

// LittleCast Login Fuction

function lcLogin (me) {

    FB_USER = me;

    var access_token =  FB.getAuthResponse()['accessToken'];
    var data = 'fb_id=' + me.id + '&user[first_name]=' + me.first_name + '&user[last_name]=' + me.last_name + '&user[email]=' + me.email + '&user[name]=' + me.username + '&accessToken='+access_token;

    DataCall (data, SERVER + REGISTER, "POST", false,

        function (data) {
            if (data.success == true) {


                LC_USER = data.data.user;
                $('#current-user-image').html ('<img alt="" class="media-object hold-pic video_detail_page_pp" src="' + LC_USER.profile_picture_url + '">');
                DEVICE_AUTH = data.data.user.device_auth_token;


            }else {
                Error ("Sign In", "Invalid information.");
            }

        },
        function (){
            Error ("Sign In", "An error occured.");
        }
    );
}

// This function first checked Facebook login Status

function fbLoginStatus() {

    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {

            FB.api('/me', function(me) {
                res = response.authResponse;
                if(me)
                    lcLogin(me);
            });
        } else {

            FB_USER.email = "";
            FB_USER.username = "";

            FB_USER.id = 0;
            FB_USER.uid = 0;

            FB_USER.first_name = "";
            FB_USER.last_name = "";
            FB_USER.name = "";

            LC_USER = FB_USER ;
        }
    });
}


function fbLogin( clickType  ){
    clickType = typeof clickType !== 'undefined' ? clickType : '';
    if( LC_USER.id ==0 ) {

        var VIDEO_ID  = getParameterByName('watch') != '' ? "&watch="+getParameterByName('watch') : '';

        var from_page_id = getParameterByName('from_page_id') != '' ? "&from_page_id="+getParameterByName('from_page_id') : '';
        var page_name = getParameterByName('page_name') != '' ? "&page_name="+getParameterByName('page_name') : '';
        var publisher = getParameterByName('publisher') != '' ? "&publisher="+getParameterByName('publisher') : '';

        var oauth_url = 'https://www.facebook.com/dialog/oauth/';
        oauth_url += '?client_id='+FB_APP_ID;
        oauth_url += '&redirect_uri=' + encodeURIComponent('https://apps.facebook.com/'+ FB_APP_NAME + '/?watch=' + VIDEO_ID + publisher + page_name + from_page_id  );
        oauth_url += '&scope=email,publish_actions,publish_stream,user_location'
        window.top.location = oauth_url;


    }

}