$(document).ready(function(){
    $('#user_country_id').change(function(){
      if($('#user_country_id option:selected').text() == "UNITED STATES") 
        $('#state_div').show();
      else
        $('#state_div').hide();
    })
})