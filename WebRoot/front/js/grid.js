/**
 * 
 */
ESS.event.addEventListener(window,"load",function(e){
	
	var content = [
	   "<table id='lastname'>",
	   		"<thead>",
	   			"<tr><th>Last Name<th></tr>",
	   		"</thead>",
	   		"<tbody>",
	   			"<tr><td>Smith</td></tr>",
	   			"<tr><td>Johnson</td></tr>",
	   			"<tr><td>Henderson</td></tr>",
	   			"<tr><td>Williams</td></tr>",
	   			"<tr><td>Gilliam</td></tr>",
	   			"<tr><td>Walker</td></tr>",
	   		"</tbody>",
	   "</table>"
	];
	document.open();
	document.writeln(content.join(""));
	document.close();
	
	var tb = document.getElementById("lastname");
	var tbody = tb.tBodies[0];
	
	var trs = [];
	
	sort(tbody,0);
	
	/**
	 * 列表排序
	 */
	function sort(tbody,index){
		var rows = tbody.rows;
		for(var i = 0 , len = rows.length; i < len ; i++){
			trs.push(rows[i]);
		}
		trs.sort(handler(index));
		reload(tbody,trs);
	}
	
	/**
	 * 排序反转
	 */
	function reverse(tbody){
		trs.reverse();
		reload(tbody);
	}
	
	/**
	 * 列比较闭包
	 */
	function handler(index){
		return function (source,target){
			var len = source.cells.length;
			if(index < 0 || index >= len)
				throw new SyntaxError("array index out of bound.");
			var sc = source.cells[index].firstChild.nodeValue;
			var tc = target.cells[index].firstChild.nodeValue;
			return sc.localeCompare(tc);
		};
	}
	
	/**
	 * 重新加载tbody
	 */
	function reload(tbody,trs){
		var fragment = document.createDocumentFragment();
		for(var i = 0,len = trs.length; i < len ; i++){
			fragment.appendChild(trs[i]);
		}
		tbody.appendChild(fragment);
	}
		
});