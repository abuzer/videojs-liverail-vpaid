function Browser (){

	var user_agent = navigator.userAgent.toLowerCase();
	var browser;
	var iP = false;
	var OS = '';
    var version = '';

	if(user_agent.indexOf("firefox") > -1){
		browser = "FF";
		version = user_agent.substring( user_agent.indexOf("firefox")).split('/')[1]
	}else if(user_agent.indexOf("opera") > -1)
		browser = "OP";
	else if(user_agent.indexOf("msie") > -1)
		browser = "IE";
	else if(user_agent.indexOf("chrome") > -1)
		browser = "CR";
	else if(user_agent.indexOf("safari") > -1)
		browser = "SF";
	else if(user_agent.indexOf("fb") > -1)
		browser = "FB";
	else
		browser = "NA";
		
	if( user_agent.indexOf("mac os") > -1 ){
        OS = 'MAC';
    }else if(user_agent.indexOf("linux") > -1){
        OS = 'linux';
    }else if(user_agent.indexOf("windows") > -1){
        OS = 'windows';
    }

	if(user_agent.indexOf("ipad") > -1 || user_agent.indexOf("ipod") > -1 || user_agent.indexOf("iphone") > -1)
		iP = true;
	else
		iP = false;
	
	var data = { agent: user_agent, browser: browser, iP: iP, OS: OS , version: version };
	return data;
}