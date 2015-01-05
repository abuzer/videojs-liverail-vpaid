function loadPopup(){
    //loads popup only if it is disabled
    if($("#bgPopup").data("state")==0){
        $("#bgPopup").css({
            "opacity": "0.8"
        });
        $("#bgPopup").fadeIn("medium");
        $("#Popup").fadeIn("medium");
        $("#bgPopup").data("state",1);
    }
}

function disablePopup(){
    if ($("#bgPopup").data("state")==1){
        $("#bgPopup").fadeOut("medium");
        $("#Popup").fadeOut("medium");
        $("#bgPopup").data("state",0);
    }
}

function centerPopup(){
    var winw = $(window).width();
    var winh = $(window).height();
    var popw = $('#Popup').width();
    var poph = $('#Popup').height();
    $("#Popup").css({
        "position" : "absolute",
        "top" : winh/2-poph/2,
        "left" : winw/2-popw/2
    });
    //IE6
    $("#bgPopup").css({
        "height": winh
    });
}

$(document).ready(function() {
    $("#bgPopup").data("state",0);
    $("#myButton").click(function(){
        centerPopup();
        loadPopup();
    });
    $("#popupClose").click(function(){        
        $('#demo_iframe')[0].contentWindow.projekktor().setPause();
        disablePopup();
    });
    $(document).keypress(function(e){
        if(e.keyCode==27) {
            disablePopup();
        }
    });
});

//Recenter the popup on resize - Thanks @Dan Harvey [http://www.danharvey.com.au/]
$(window).resize(function() {
    centerPopup();
});