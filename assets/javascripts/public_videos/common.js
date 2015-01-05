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

function CommentStructure(comment, posted) {

    var comment_body = '';

    var stamp = TimeStamp(comment.created_at);
    var username = comment.user.first_name + ' ' + comment.user.last_name ;
    var profile_pic = LC_USER.profile_picture_url!= '' ?LC_USER.profile_picture_url : 'https://graph.facebook.com/' + comment.user.uid + '/picture'; 
    comment_body+= '<div class="media view-comments">'
    comment_body+= '<a href="'+BASE_URL+LC_USER.profile_name+'" class="pull-left" target="_blank"> '
    comment_body+= '<img alt="" class="media-object hold-pic video_detail_page_pp" src="'+profile_pic+'"> </a> '
    comment_body+= '<div class="media-body"><h4 class="media-heading"><a href="'+BASE_URL+LC_USER.profile_name+'" target="_blank">' + username + '</a>'
    comment_body+= '<span>&nbsp; Just Now</span></h4>'
    comment_body+= '<p> ' + comment.comment + ' </p>'
    comment_body+= '</div></div>'
    return comment_body;

}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++)
    {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) return c.substring(name.length,c.length);
    }
    return "";
}

function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function deleteCookie(cname) {
    document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

function showPrevText()
{
    if(social_sharing && postId)
        $('#prev-text-for-user').show();
}



function removePreviewAct()
{
    deletePreview();
    //$('#prev-text-for-user').html('Removed from your timeline &nbsp;<a href="#" onclick="addPreviewAct();">CLICK TO ADD</a>');
    $('#prev-text-for-user').html('Watch activity removed from Facebook and LittleCast &nbsp;<a href="#" onclick="addPreviewAct();">X</a>');
}

function addPreviewAct() {
    $('#prev-text-for-user').hide();
    $('#prev-text-for-user').remove();
}
function removeFixedControls( id ){
    $('#'+id).removeClass('fixed-controls');
}