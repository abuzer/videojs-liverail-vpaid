
function DataCall (Data, Url, Type, SuccessCallBack, ErrorCallBack){ 
 jQuery.ajax({
  type: Type,
  url: Url,
  dataType: "jsonp",
  data: Data,
  jsonp: "callback",
  jsonpCallbackString: function (data){
   SuccessCallBack (data);
  },
  success: function (data){
   SuccessCallBack (data);
  },
  error: function (jqXHR, textStatus, errorThrown){
   ErrorCallBack ();
  }
 });
}

function fetching_contacts()
{
  email= $('#inputEmail')[0].value
  password= $('#inputPassword')[0].value
  DataCall('username='+email+'&password='+password,'/connections/fetch_contact','post',sucess_fectching_contacts,failure_fetching_contacts);
}
function sucess_fectching_contacts(data)
{
  contact=data.data.contacts
  html_response="<table border=0>"
  for(i=0;i<contact.length;i++)
  {

    html_response+="<tr>"
    html_response+="<td>"+contact[i][1]+ "</td>" + "<td><button value ='"+contact[i][1]+"' class='btn btn-danger' id='btn_contact_"+i+"' type='button' onClick='change_status(this,\"select\",\"selected\")'>select</button>" +"</td>";
    html_response+="</tr>"
  }
  html_response+="</table>"
  $('#gmail_contacts >.modal-body').html(html_response);
    html_footer_response="<button class='btn btn-primary' type='button' onClick='select_all_gmail()'>Select All </button>";
    html_footer_response+="<button class='btn btn-primary' type='button' onClick='invite_friends()'>Done </button>";
  $('#gmail_contacts >.modal-footer').html(html_footer_response);
}
function failure_fetching_contacts()
{
  alert('wrong user name and password');
}
function change_status(btn,danger_text,sucess_text)
{
  btn_class=$("#"+btn.id).attr("class");
  if (btn_class == "btn btn-success")
  {
    $("#"+btn.id).html(danger_text);
    $("#"+btn.id).attr("class","btn btn-danger");      
  }
  else if (btn_class == "btn btn-danger")
  {
    $("#"+btn.id).html(sucess_text);
    $("#"+btn.id).attr("class","btn btn-success");
  }
}
function select_all_gmail()
{
  btn=$('#gmail_contacts >.modal-body > table > tbody > tr > td > .btn-danger');
  for(i=0;i<btn.length;i++)
  {
    change_status(btn[i],'select','unselect');
  }
}
function invite_friends()
{
  btn=$('#gmail_contacts >.modal-body > table > tbody > tr > td > .btn-success');
  contStr="";
  for(i=0;i<btn.length;i++)
  {
    contStr+=btn[i].value + ","
  }
  $("#gmail_h_contacts")[0].value=contStr;
  $('#gmail_contacts').modal('toggle');
    //DataCall("contacts="+contStr, '/connections/invite', 'post', invite, "alert('error !!!')");
}
function invite(data)
{}