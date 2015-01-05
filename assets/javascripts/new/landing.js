$(window).load(function() {
  $('#iphone-slideshow').show();
  $('#iphone-slideshow').flexslider(
    {
      animation: "slide",
      direction: "horizontal",
      pauseOnHover: true,
      controlNav: false,
      directionNav: false,
      slideshowSpeed: 3000
    }
  );
});

$(document).ready(function(){
  $('#iphone-slideshow').hide();
});

