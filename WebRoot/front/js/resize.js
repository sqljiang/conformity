/**
 *考虑移动是固定鼠标移动范围 
 */
ESS.event.addEventListener(window,"load",function(e){
	var resize = document.getElementById("resize");
	var left = parseInt(ESS.dom.getStyle(resize,"left")),
		top = parseInt(ESS.dom.getStyle(resize,"top")),
		orignX , orignY,rs = false,dirc,
	    leftBorder = parseInt(ESS.dom.getStyle(resize,"borderLeftWidth")),
	    rightBorder = parseInt(ESS.dom.getStyle(resize,"borderRightWidth")),
	    topBorder =  parseInt(ESS.dom.getStyle(resize,"borderTopWidth")),
	    bottomBorder = parseInt(ESS.dom.getStyle(resize,"borderBottomWidth")),
		direction ={
			left:function(elem,left,top,width,height,dw,dh){ //左边界
				left += dw;
				width -= dw;
				ESS.dom.setStyle(elem,"left",left+"px");
				ESS.dom.setStyle(elem,"width",width+"px");
			},
			right:function(elem,left,top,width,height,dw,dh){ //右边界
				width += dw;
				ESS.dom.setStyle(elem,"width",width+"px");
			},
			top:function(elem,left,top,width,height,dw,dh){ //上边界
				top += dh;
				height -= dh;
				ESS.dom.setStyle(elem,"top",top+"px");
				ESS.dom.setStyle(elem,"height",height+"px");
			},
			bottom:function(elem,left,top,width,height,dw,dh){ //底边界
				height += dh;
				ESS.dom.setStyle(elem,"height",height+"px");
			},
			left_top:function(elem,left,top,width,height,dw,dh){ //左上角
				left(elem,left,width,dw);
				top(elem,top,height,dh);
			},
			right_top:function(elem,left,top,width,height,dw,dh){ //右上角
				right(elem,width,dw);
				top(elem,top,height,dh);
			},
			left_bottom:function(elem,left,top,width,height,dw,dh){ //左下角
				left(elem,left,width,dw);
				bottom(elem,height,dh);
			},
			right_bottom:function(elem,left,top,width,height,dw,dh){ //右下角
				right(elem,width,dw);
				bottom(elem,height,dh);
			}
		};
	function region(elem,e){ //禁止区域
		if(left + leftBorder + 2 < e.clientX && 
			   e.clientX < left + resize.offsetWidth - rightBorder -2 && 
			   top + topBorder + 2 < e.clientY && 
			   e.clientY < top + resize.offsetHeight - bottomBorder -2) return true;
		return false;
	}
	function bound(elem,e){ //2px 感应区
		if(e.clientX <= left + leftBorder + 2 || left + resize.offsetWidth - rightBorder - 2 <= e.clientX){ //左右边框
			resize.style.cursor = "ew-resize";
			e.clientX <= left + leftBorder + 2 ? dirc = "left" : dirc = "right";
		}
		if(e.clientY <= top + topBorder + 2 || top + resize.offsetHeight - bottomBorder - 2 <= e.clientY){ //垂直边框
			resize.style.cursor = "ns-resize";
			e.clientY <= top + topBorder + 2 ? dirc = "top" : dirc = "bottom";
		}
		if(e.clientX == left && e.clientY == top || 
		   e.clientX == left + resize.offsetWidth && 
		   e.clientY == top + resize.offsetHeight){ //左上(右下)角
			resize.style.cursor = "nwse-resize";
			e.clientX == left ? dirc = "left_top" : dirc = "right_bottom";
		}else if(e.clientX == left + resize.offsetWidth && 
				 e.clientY == top  || 
				 e.clientX == left && 
				 e.clientY == top + resize.offsetHeight){  //右上(左下)角
			resize.style.cursor = "nesw-resize";
			e.clientY == top ? dirc = "right_top" : dirc = "left_bottom";
		}
	}
	ESS.event.addEventListener(resize,"mouseover",function(e){
		bound(resize,e);
	});
	ESS.event.addEventListener(resize,"mousemove",function(e){
		if(region(resize,e)) {
			resize.style.cursor = "default";
			rs = false;
		}
		if(rs){
			var dw = isFinite(e.clientX - orignX) ? e.clientX - orignX : 0,
			    dh = isFinite(e.clientY - orignY) ? e.clientY - orignY : 0,
				w = parseInt(ESS.dom.getStyle(resize,"width")),
				h = parseInt(ESS.dom.getStyle(resize,"height"));
			top = parseInt(ESS.dom.getStyle(resize,"top"));
			left = parseInt(ESS.dom.getStyle(resize,"left"));
			bound(resize,e);
			direction[dirc](resize,left,top,w,h,dw,dh);
			orignX = e.clientX;
			orignY = e.clientY;
		}
	});
	ESS.event.addEventListener(resize,"mousedown",function(e){
		if(region(resize,e)) return ;
		orignX = e.clientX;
		orignY = e.clientY;
		rs = true;
	});
	ESS.event.addEventListener(resize,"mouseup",function(e){
		rs = false;
	});
	ESS.event.addEventListener(resize,"mouseout",function(e){
		resize.style.cursor = "default";
		rs = false;
	});
});