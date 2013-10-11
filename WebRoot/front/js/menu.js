/**
 * 
 */
ESS.event.addEventListener(window,"load",function(e){
	var content = [
	   "<div id='context_menu'><ul>",
	   	  "<li>±£´æ</li>",
	   	  "<li>É¾³ý</li>",
	   "</ul></div>"
	];
	document.body.innerHTML = content.join("");
	var menu = document.getElementById("context_menu");
	ESS.dom.addClass(menu,"menu_bord_style");
	menu.style.width = "30px";
	menu.style.height = "30px";
	menu.style.display = "none";
	menu.style.position = "absolute";
	ESS.event.addEventListener(document,"contextmenu",function(e){
		e.preventDefault();
		menu.style.left = e.clientX + "px";
		menu.style.top = e.clientY + "px";
		menu.style.display = "block";
	});
	ESS.event.addEventListener(document,"click",function(e){
		menu.style.display = "none";
	});
});