$(document).ready(function(){

  $(document).off('page:loading').on('page:loading', function(event, $target, render, url) {
     $('.content-wrapper').fadeTo("slow", 0.5)
     $('#loading_image').css("display", "inline");
     window.document.title = "Publish Video | LittleCast.com";
  });

  $(document).off('page:done').on('page:done', function(event, $target, render, url) {
      FacebookPermissionsModule.check_fb_permission();
      $('#loading_image').hide();
      $('.content-wrapper').fadeTo("slow", 1);
      window.document.title = "Publish Video | LittleCast.com";
  });

})


// HomeController = Paloma.controller('Home');
// HomeController.prototype.publish_video_landing= function(){ 
//  // $(".video_player_linkss").bind('ajax:beforeSend', function(){
//  //    $('.content-wrapper').fadeTo("slow", 0.33)
//  //    }).bind("ajax:complete", function(evt, xhr, status){
//  //      if(xhr.status == 200){
//  //        FacebookPermissionsModule.check_fb_permission();      
//  //        $(".content-wrapper").html(xhr.responseText);
//  //        var Controller =  Paloma.engine.factory.get($(evt.target).data().paloma_controller_name);
//  //        var controller = new Controller();
//  //        controller.new();
//  //        $('.content-wrapper').fadeTo("slow", 1);
//  //      }else{
//  //      }
//  //    })
// }
