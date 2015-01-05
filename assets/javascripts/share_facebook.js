function change_status_fb(btn)
{
  btn_class=$("#"+btn.id).attr("class");
  if (btn_class == "btn btn-success")
  {
    $("#"+btn.id).html("select");
    $("#"+btn.id).attr("class","btn btn-danger");      
  }
  else if (btn_class == "btn btn-danger")
  {
    $("#"+btn.id).html("unselect");
    $("#"+btn.id).attr("class","btn btn-success");
  }
}

function select_all_facebook()
{
  btn=$('#facebook_friends >.modal-body > table > tbody > tr > td > .btn-danger');
  for(i=0;i<btn.length;i++)
  {
    change_status_fb(btn[i]);
  }
}
function share()
{
  btn_selected=$('#facebook_friends >.modal-body > table > tbody > tr > td > .btn-danger');
  if (btn_selected.length!=0)
  {
    btn=$('#facebook_friends >.modal-body > table > tbody > tr > td > .btn-success');
    friend_list=""
    for(i=0;i<btn.length;i++)
      friend_list+= btn[i].id + ","
    $("#FACEBOOK_FRIENDS").val(friend_list);
    $("#FACEBOOK_FRIENDS").siblings('span').html("("+btn.length+" Selected)");

  }
  else
  {
    $("#FACEBOOK_FRIENDS").siblings('span').html("(All Selected)");
    $("#FACEBOOK_FRIENDS").val("all");

  }
    
  $('#FACEBOOK_FRIENDS_cb').attr("checked", true);

  $('#facebook_friends').modal('toggle');
}
