function setFanVal(btn)
{
  
  btn_class=$("#"+btn.id).attr("class");
  if (btn_class == "btn btn-success")
  {

    $("#"+btn.id).html("Select My facebook fans");
    $("#"+btn.id).attr("class","btn btn-danger");      
    $("#facebook_fan").value("false");
  }
  else if (btn_class == "btn btn-danger")
  {

    $("#"+btn.id).html("My facebook fans selected");
    $("#"+btn.id).attr("class","btn btn-success");
    $("#facebook_fan").val("true");
  }
}

function setFollowerVal(btn)
{
  btn_class=$("#"+btn.id).attr("class");
  if (btn_class == "btn btn-success")
  {
    $("#"+btn.id).html("Select Follower on LittleCast");
    $("#"+btn.id).attr("class","btn btn-danger");      
    $("#follower").val("false");
 
  }
  else if (btn_class == "btn btn-danger")
  {
    $("#"+btn.id).html("Follower on LittleCast selected");
    $("#"+btn.id).attr("class","btn btn-success");
    $("#follower").val("true");
  }
}