/**
 * �ƶ�Dom
 */
ESS.event.addEventListener(window,"load",function(e){
	var main = document.getElementById("main"),
		head = document.getElementById("head"),
		left = parseInt(ESS.dom.getStyle(main,"left")),
		top = parseInt(ESS.dom.getStyle(main,"top")),
		orignX,orignY,flag = false;
	/*
	 * ������������������������
	 * 1�����Ϸ��ƶ�  left += dw (dw < 0),top += dh (dh < 0)
	 * 2�����Ϸ��ƶ� left += dw (dw > 0),top += dh (dh < 0)
	 * 3�����·��ƶ� left += dw (dw < 0), top += dh (dh > 0)
	 * 4�����·��ƶ� left += dw (dw > 0), top += dh (dh >0)
	 */
	ESS.event.addEventListener(head,"mousemove",function(e){
		head.style.cursor = "move";
		if(flag){
			var dw = e.clientX - orignX,
				dh = e.clientY - orignY,
				parent = head.parentNode,
				w = parseInt(ESS.dom.getStyle(parent,"width")),
				h = parseInt(ESS.dom.getStyle(parent,"height")),
				clientWidth = document.documentElement.clientWidth,
				clientHeight = document.documentElement.clientHeight;
			orignX = e.clientX;
			orignY = e.clientY;
			/*��Χ�޶�*/
			left = (left += dw) < 0? 0 : left + w > clientWidth ? clientWidth - w : left;
			top = (top += dh ) < 0 ? 0 : top + h > clientHeight ? clientHeight - h : top;
			ESS.dom.setStyle(parent,"left",left+"px");
			ESS.dom.setStyle(parent,"top",top+"px");
		}
	});
	
	ESS.event.addEventListener(head,"mousedown",function(e){
		flag = true;
		orignX = e.clientX;
		orignY = e.clientY;
		ESS.setCapture(head);
	});
	
	ESS.event.addEventListener(head,"mouseup",function(e){
		ESS.releaseCapture(head);
		head.style.cursor = "default";
		flag = false;
	});
	
});
