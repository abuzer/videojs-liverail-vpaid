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

$(document).ready(function(){
    $('.re-auth').click(function(){
        var showpreview = getParameterByName('showpreview') == 1? "&showpreview=1" : '';
        var track_email = getParameterByName('track_email') == 1? "&track_email=1" : '';
        var buy = getParameterByName('buy') != '' ? "&buy="+getParameterByName('buy') : '';
        var page_id = getParameterByName('page_id') != '' ? "&page_id="+getParameterByName('page_id') : '';
        var page_name = getParameterByName('page_name') != '' ? "&page_name="+getParameterByName('page_name') : '';
        var publisher = getParameterByName('publisher') != '' ? "&publisher="+getParameterByName('publisher') : '';
        VIDEO_ID = getParameterByName('watch') != '' ? "&watch="+getParameterByName('watch') : '';
        if( (/Android|ipad|iPhone/i.test(navigator.userAgent)) ){
            REDIRECTED_URL = BASE_URL + 'fb';
        }else{
            REDIRECTED_URL = 'https://apps.facebook.com/'+ FB_APP_NAME;
        }
        var oauth_url = 'https://www.facebook.com/dialog/oauth/';
        oauth_url += '?client_id='+FB_APP_ID;
        oauth_url += '&redirect_uri=' + encodeURIComponent(REDIRECTED_URL+ '/?watch=' + VIDEO_ID + showpreview +buy + publisher + page_name + page_id + track_email);
        oauth_url += '&scope=email,publish_actions,publish_stream,user_location'
        window.top.location = oauth_url;
    });
});
