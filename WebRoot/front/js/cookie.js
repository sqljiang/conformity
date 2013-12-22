/**
 * the problem of domain setting  isn't solution
 */
ESS.register("ESS.cookie",function(config){
	
	function suffix(domain){
		if(ESS.typeOf(domain) === "string"){
			var items = domain.split(".");
			if(items && items.length >= 2) return true;
		}
		return false;
	}
	
	function Cookie(config){
		this.expr = config["expr"] || new Date() ;
		this.domain = suffix(config["domain"]) ? config["domain"] : document.domain;
		this.path = config["path"] || document.location.pathname;
		this.secure = config["secure"] || false;
		this.stamp = config["stamp"] || Cookie.STAMP;
	}
	
	Cookie.STAMP = 60*60*24*365; //one year
	
	Cookie.prototype.setExpr = function(expr){
		this.expr = expr;
	};
	
	Cookie.prototype.getExpr = function(){
		return this.expr;
	};
	
	Cookie.prototype.setDomain = function(domain){
		if(suffix(domain)) this.domain = domain;
	};
	
	Cookie.prototype.getDomain = function(){
		return this.domain;
	};
	
	Cookie.prototype.setPath = function(path){
		this.path = path || this.path;
	};
	
	Cookie.prototype.getPath = function(){
		this.path;
	};
	
	Cookie.prototype.setSecure = function(secure){
		this.secure = secure || this.secure;
	};
	
	Cookie.prototype.getSecure = function(){
		return this.secure;
	};
	
	Cookie.prototype.setCookie = function(key,value){
		if(arguments.length != arguments.callee.length)
			throw new Error("the number of actual arguments is not equal the expected.");
		if (/^(?:expires|max\-age|path|domain|secure)$/i.test(key)) return false;  //避免出现关键字
		key = encodeURIComponent(key);
		value = encodeURIComponent(value);
		var str = key + "=" + value+";domain="+this.domain+";path="+this.path+";";
		switch(ESS.typeOf(this.expr)){
			case "Date" : 
				this.expr.setUTCSeconds(this.stamp);
				this.expr = this.expr.toUTCString();
			case "string" : 
				str += ";expires="+this.expr+";";
				break;
			case "number" :
				str += ";max-age="+this.expr+";";
				break;
			default :
				throw new TypeError("the type of parameter is error.");
		}
		if(this.secure) str+="secure";
		document.cookie = str;
		return true;
	};
	/**
	 * @param key cookie [string or array]
	 */
	Cookie.getCookie = function(key){ //空格的问题需要解决
		function handler(key){
			if(Cookie.hasCookie(key)){ //avoid the cookie key part match
				key = encodeURIComponent(key);
				var cookie = document.cookie,
					len = key.length,
					start = cookie.indexOf(key);
				if(start > -1){ //the second check cookie whether correct
					start += len + 1 ;
					var end = cookie.indexOf(";", start); 
					if(end < 0) end = cookie.length;  //whether is the last one cookie
					return decodeURIComponent(cookie.substring(start, end));
				}
			}
		}
		switch(ESS.typeOf(key)){
			case "string" : 
				return handler(key);
			case "Array" :
				var result = [];
				ESS.each(key,function(i){
					var k = key[i];
					result.push({
						key:k,
						value:handler(k)
					});
				});
				return result;
			default :
				throw new TypeError("the parameter isn't a string or array.");
		}
	};
	
	Cookie.hasCookie = function(key){
		return (new RegExp("(?:^|;\\s*)"+encodeURIComponent(key)+"\\s*\\=")).test(document.cookie);
	};
	
	Cookie.removeCookie = function(key,domain,path){
		domain = domain || document.domain;
		path = path || document.location.pathname;
		if(Cookie.hasCookie(key)){
			document.cookie = encodeURIcomponent(key) +"=;"+"expires=Thu, 01 Jan 1970 00:00:00 GMT;domain="+domain+";path="+path+";";
		}
	};
	/**
	 * judge whether the browser support cookie
	 * @returns Boolean
	 */
	Cookie.isEnable = function(){
		var navigator = window.navigator,
			cookie = document.cookie;
		if(navigator.cookieEnabled) return navigator.cookieEnabled;
		cookie = "test=test;max-age=10000;";  //test whether the browser can add a cookie.the best way is generator two random number
		if(cookie.indexOf("test=test;") > -1) return true;
		return false;
	};
	/**
	 * the class static method transform to the object method
	 */
	for(var item in Cookie){
		if(!Cookie.prototype.hasOwnProperty(item) && ESS.typeOf(Cookie[item]) === "function")
			Cookie.prototype[item] = Cookie[item];
	}
	
	if(!config) return Cookie;
	else if(ESS.typeOf(config) === 'Object')  return new Cookie(config);
	throw new TypeError("the parameter of this function need a plain object.");
});