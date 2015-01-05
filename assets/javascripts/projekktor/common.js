/*
    Projekktor most common JS code
*/
var p_id = '';
projekktorReadyCallBack = function( player_id ){
    if(typeof(player_id) == 'undefined' || typeof(player_id) == 'object')
      player_id = '';
    p_id = player_id;
    ProjThumb =  $('#vdo-player' + player_id + '_media').html()
    ProjThumbSrc =  $('#vdo-player'+p_id+'_media img').attr('src');
    $('#vdo-player' + player_id + '_media').html();
    projekktor('#vdo-player'+ player_id).setPlay();
    projekktor('#vdo-player'+ player_id).setPause();
    if(!BUFFERED)
      setTimeout(hideProjekktorStuff,1700)

}
hideProjekktorStuff = function(){
    if(typeof(playing_state_event_occurence) == 'undefined' || (typeof(playing_state_event_occurence)!='undefined' && playing_state_event_occurence != 2 ))
    {

      $('.ppstart').removeClass('inactive')
      $('.ppstart').addClass('active')
      if( BROWSER.browser == 'FF'){
        $('#thumbContainer').html( ProjThumb );
        $('.thumbContainer').html( ProjThumb );
      }
      $('#video-information-in').show();
      $('#vdo-player'+p_id+'_media_html').attr('poster', ProjThumbSrc);
      $('#thumbContainer').show();
      $('#thumbContainer img').show();

      if(typeof(PLAYER_ID) != 'undefined' && typeof(IS_EMBEDDED) != 'undefined' && IS_EMBEDDED == true && typeof(VIDEO_TYPE) != 'undefined' && (VIDEO_TYPE == 0 || VIDEO_TYPE == 1))
      {
        $('#previewBtn'+PLAYER_ID).show();
        $('#aboutBtn'+PLAYER_ID).show();
      }
      $('.ppcontrols').removeClass('inactive');
      $('.ppcontrols').addClass('active');
      $('.ppbuffering').removeClass('active');
      $('.ppbuffering').addClass('inactive');
      $('.pppause').removeClass('active');
      $('.pppause').addClass('inactive');
      $('.ppplay').removeClass('inactive');
      $('.ppplay').addClass('active');
    }

    BUFFERED = true; // SET BUFFER = false in watch-desltop
    console.log('hideProjekktorStuff' + BUFFERED );
}
$('.ppstart').live('click', function(){
    if( BROWSER.browser == 'FF' ){
        $('#thumbContainer').hide();
        $('.thumbContainer').hide();
        $('.ppstart').removeClass('active');
        $('.ppstart').addClass('inactive');
        $('.pppause').removeClass('inactive');
        $('.pppause').addClass('active');
        if( typeof( PLAYER_ID ) == 'undefined'){
            PLAYER_ID = ''
            playBtn();
        }else{
            playBtn( PLAYER_ID );

        }
    }
});
$('.ppplay').live('click', function(){
    if( BROWSER.browser == 'FF' ){
        $('.ppstart').removeClass('active');
        $('.ppstart').addClass('inactive');
    }
    if($('#thumbContainer').is(":visible")){
        $('#thumbContainer').hide();
    }
    if($('.thumbContainer').is(":visible")){
        $('.thumbContainer').hide();
    }
    if( typeof( PLAYER_ID ) == 'undefined'){
        PLAYER_ID = ''
        playBtn();
    }else{
        playBtn( PLAYER_ID );
    }
});
FCprojekktorReadyCallBack = function( isPreview ){
    ProjThumb =  $('#vdo-player_media').html()
    ProjThumbSrc =  $('#vdo-player_media img').attr('src');
    projekktor('#vdo-player').setPlay();
    projekktor('#vdo-player').setPause();
    if(!BUFFERED)
      setTimeout(function(){
        FChideProjekktorStuff( isPreview )
        }, 1700 );
}
FChideProjekktorStuff = function(isPreview){
    if( BROWSER.browser == 'FF'){
      $('#thumbContainer').html( ProjThumb );
      $('.thumbContainer').html( ProjThumb );
    }
    $('.ppstart').removeClass('inactive')
    $('.ppstart').addClass('active')

    $('#vdo-player_media_html').attr('poster', ProjThumbSrc);
    $('#video-information-in').show();
    $("#about-video-in").attr('style', "display:none");

    $('.thumbContainer').show();
    $('.thumbContainer img').show();
    if( isPreview ){
        $('#previewBtn').show();
        $('#aboutBtn').show();
    }
    $('.ppcontrols').removeClass('inactive')
    $('.ppcontrols').addClass('active')

    $('.pppause').removeClass('active')
    $('.pppause').addClass('inactive')
    $('.ppplay').removeClass('inactive')
    $('.ppplay').addClass('active')

    $('.ppbuffering').removeClass('active')
    $('.ppbuffering').addClass('inactive')
    $('#vdo-player_media_image').show();
    BUFFERED = true; // SET BUFFER = false in watch-desltop
}

hideRuntime = function(){
    if( BROWSER.browser == 'FF' && (BROWSER.OS == 'MAC' || BROWSER.OS =='linux' || (BROWSER.OS =='windows' && BROWSER.version < 28 )) )
        $('.pptimeleft').hide();
}

function thumbContainerHover(){
    $('.ppcontrols').removeClass('inactive');
    $('.ppcontrols').addClass('active');
}
