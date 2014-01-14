/**
 * 名字空间
 */
(function(){
        //var me = window 这种情况是ESS = {};
        ESS = (function(){
                
                var me = this;  //可用 this 指向的是window对象
                
                if(!Object.create){
                        Object.create = function(o){
                                if(arguments.length != arguments.callee.length)
                                        throw new Error('Object.create implementation only accepts the first parameter.');
                                function F(){}  //?
                                F.prototype = o;
                                return new F();
                        };
                }
                
                return {
                        /**
                         * 注册名字空间并且关联操作
                         * @param name
                         * @param o
                         */
                        register:function(name,o){
                                if(arguments.length != arguments.callee.length)
                                        throw new Erro("the number of actual arguments is not equal the expected.");
                                if(this.typeOf(name) !== "string") 
                                        throw new Error("the type of the argument("+name+") is not string");
                                var tokens = name.split(".");
                                var that = me, mark;
                                while(mark = tokens.shift()){
                                        if(tokens.length){
                                                if(that[mark] === undefined){
                                                        that[mark] = {};
                                                }
                                                that = that[mark];
                                        }else if(that[mark] === undefined){
                                                that[mark] = o;
                                        } else{
                                                throw new Error("the namespace of ["+mark+"] is illage.");
                                        }
                                }
                        },
                        isExist:function(name){
                                if(arguments.length != arguments.callee.length)
                                        throw new Error("the number of actual arguments is not equal the expected.");
                                var tokens = name.split(".");
                                var that = me, mark;
                                while(mark = tokens.shift()){
                                        if(!that[mark]) return false;
                                        that = that[mark];
                                }
                                return true;
                        },
                        /**
                         * 模拟类继承实现
                         * @param name
                         * @param child 闭包
                         * @param parent
                         */
                        extend:function(name,parent,child){
                                if(arguments.length != arguments.callee.length)        
                                        throw new Error("the number of actual arguments is not equal the expected.");
                                if(this.isExist(name))        //判断名字空间是否已经存在
                                        throw new Error("the namespace of ["+name+"] is already exist.");
                                var ps = child.prototype, p;        //保存子类定义的方法
                                child.prototype = Object.create(parent.prototype); //创建父类的原型对象
                                for(p in ps){                                        //还原子类方法
                                        child.prototype[p] = ps[p];
                                }
                                child.prototype.constructor = child;
                                this.register(name, child);
                        },
                        /**
                         * 遍历数组
                         * @param array        数组
                         * @param fn        数组元素调用方法
                         * @returns
                         */
                        each:function(array,fn){
                                if(arguments.length != arguments.callee.length)
                                        throw new Error("the number of actual arguments is not equal the expected.");
                                if(this.typeOf(array) != "Array" || this.typeOf(fn) != "function")
                                        throw new TypeError("the argument type error.");
                                for(var i = 0 , len = array.length; i < len ; i++){
                                        var item = array[i];
                                        fn(item);
                                }
                        },
                        /**
                         * 方法借用
                         * @param from        目标类
                         * @param to        借用类
                         */
                        borrow:function(from,to){
                                var name;
                                var formPro = form.prototype;
                                var toPro = to.prototype;
                                for(name in formPro){
                                        if(typeof formPro[name] != "function") continue;
                                        toPro[name] = formPro[name];
                                }
                        },
                        isWin:function(){
                                return me.navigator.platform == "Win32" || me.navigator.platform == "Windows";
                        },
                        isMac:function(){
                                return me.navigator.platform == "Mac67k" || me.navigator.platform == "MacPPC" || me.navigator.platform == "Macintosh";
                        },
                        isUnix:function(){
                                return me.navigator.platform == "X11" && !isWin && !isMax;
                        },
                        isIE:function(){
                                var index = me.navigator.appName.indexOf("Microsoft Internet Explorer");
                                if(index) return true;
                                return false;
                        },
                        isChrom:function(){
                                var index = me.navigator.appVersion.indexOf("Chrom");
                                if(index) return true;
                                return false;
                        },
                        isFireFox:function(){
                                var index = me.navigator.userAgent.indexOf("Firefox");
                                if(index) return true;
                                return false;
                        },
                        pageWidth:function(){
                                return me.document.width || document.documentElement.clientWidth;
                        },
                        pageHeight:function(){
                                return me.document.height || document.documentElement.clientHeight;
                        },
                        typeOf:function(arg){
                                if(arguments.length != arguments.callee.length) 
                                        throw new Error("the number of actual arguments is not equal the expected.");
                                if(arg == null) return "null";
                                var type = typeof arg;
                                if(type !== "object") return type;
                                var str = Object.prototype.toString.apply(arg);
                                str = str.substring(8,str.length - 1);
                                if(str !== "Object") return str;
                                if(arg.constructor === Object) return str;
                                if("name" in arg.constructor.prototype && typeof arg.constructor.prototype.name == "string")
                                        return arg.constructor.prototype.classname;
                                return "<unknow type>";
                        },
                        setCapture : function(){ //元素捕获鼠标（拖动、收缩等效果实现使用）
                                var target = arguments[0] ;
                                if(target && target.setCapture) target.setCapture();
                                else if(window.captureEvents) window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                                else throw new Error("can't capture the mouse");
                        },
                        releaseCapture:function(){  //释放元素捕获鼠标
                                var target = arguments[0];
                                if(target && target.releaseCapture) target.releaseCapture();
                                else if(window.releaseEvents) releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                                else throw new Error("release the capture of mouse failure.");
                        },
                        query:function(){
                                
                                var rquickExpr = /^(?:([\w\-]+)|#([\w\-]*)|\.([\w\-]+))$/;  //id or tag or class
                                
//                                var searchExpr = /^([#\.]?[\w\-]+)(((\s*\:\s*|\s*\+\s*|\s*>\s*|\s+)([#\.]?[\w\-]+))+)?$/;
                                
                                var searchExpr = /^([#\.]?[\w\-]+)\s*(\[[\w\-]+=[\w\-]+\]|[\:>\+\s]\s*[\w\-]+)?$/;
                                
                                var rreturn = /\r/g;
                                
                                function isXML(elem){
                                        var documentElement = (elem || elem.ownerDocument).documentElement;
                                        return documentElement ? documentElement.nodeName !== "HTML" : false;
                                }
                                
                                function Query(selector){
                                        return new proto.init(selector);  //改变作用域
                                }
                                //DOMElement
                                function merge(target,dist){
                                        var t = target.length,index = 0;
                                        var d = dist.length | 0;
                                        while(index < t){
                                                dist[d++] = target[index++];
                                        }
                                        dist.length = d;
                                        return dist;
                                }
                                /**
                                 * 通用匹配节点间关系
                                 */
                                function sibling(cur,dir){
                                        do{
                                                cur = cur[dir];
                                        }while(cur && cur.nodeType !== 1);
                                        return cur;
                                }
                                /**
                                 * 获取节点及其子节点的文本内容
                                 */
                                function getText(elem){
                                        var nodeType = elem.nodeType ,content,node;
                                        if(nodeType){
                                                if(nodeType == 1 || nodeType == 9 || nodeType == 11){
                                                        if(typeof elem.textContent === "string") return elem.textContent;
                                                        else {
                                                                for(elem = elem.firstChild; elem; elem = elem.nextSibling){
                                                                        content += getTex(elem);
                                                                }
                                                        }
                                                }else if(nodeType == 3 || nodeType == 4){
                                                        return elem.nodeValue;
                                                }
                                        }else{
                                                for(var i = 0 ; node = elem[i]; i++){
                                                        content += getTex(node);
                                                }
                                        }
                                        return content;
                                }
                                /**
                                 * CSS样式的添加或删除
                                 * @param css [string|Array]
                                 * @param handler [string] DOMTokenList 对象方法名(add 或 remove)
                                 */
                                function cssHandler(css,handler){
                                        var cur = this[0],clazz = cur.classList,i = 0 , len = 0;
                                        if(ESS.typeOf(css) === "string") clazz[handler](css);
                                        else if(ESS.typeOf(css) === "Array"){
                                                for(len = css.length; i < len ; i++)
                                                        clazz[handler](css);
                                        }
                                }
                        
                                var proto = Query.prototype = {
                                        constructor:Query,  //每个对象都有一个创建它的构造函数
                                        onReady:function(fn){
                                                 ESS.event.addEventListener(window,"load",fn);
                                        },
                                        init:function(selector){
                                                var match , index = 0;
                                                if(!selector){
                                                        return this;
                                                }
                                                //DOMElement
                                                if(selector.nodeType){
                                                        this.context = this[0] = selector;
                                                        return this;
                                                }
                                                
                                                if(typeof selector === "string"){
                                                        if(selector.charAt(0) == "<" && selector.charAt(selector.length -1) == ">" && selector.length > 3){
                                                                match = [null,selector,null];
                                                        }else{
                                                                match = rquickExpr.exec(selector);
                                                        }
                                                        if(match && match[1]){
                                                                var tags = me.document.getElementsByTagName(match[1]);
                                                                while(index < tags.length){
                                                                        this[index] = tags[index];
                                                                        index++;
                                                                }
                                                                this.length = index;
                                                                this.context = me.document;
                                                        }else if(match[2]){
                                                                this[0] = me.document.getElementById(match[2]);
                                                                this.length = 1;
                                                                this.context = me.document; 
                                                        }
                                                }
                                                return this;
                                        },
                                        /**
                                         * 将dom元素转换成数组
                                         */
                                        toArray:function(){
                                                return Array.prototype.slice.call(this);
                                        },
                                        size:function(){
                                                return this.length;
                                        },
                                        get:function(index){
                                                return index === undefined || ESS.typeOf(index) != "number" ? this.toArray() : index < 0 ? this[this.length + index] : this[index];
                                        },
                                        /**
                                         * 出现的问题是：调用eq后其他的方法不可再用并且还需要进行到子节点
                                         */
                                        eq:function(index){
                                                if(index >= this.size() || index < 0)
                                                        throw new SyntaxError("index out of array's bound");
                                                //还没到最终进行DOM操作,需要再次的包裹
                                                var real = this.get(index);
                                                return merge([real],this.constructor());
                                        },
                                        first:function(){
                                                return this.eq(0);
                                        },
                                        last:function(){
                                                return this.eq(this.length - 1);
                                        },
                                        prev:function(){
                                                var cur = this[0];
                                                cur = sibling(cur,"previousSibling");
                                                return merge([cur],this.constructor());
                                        },
                                        next:function(){
                                                var cur = this.get(0);
                                                cur = sibling(cur,"nextSibling");
                                                return merge([cur],this.constructor());
                                        },
                                        parent:function(){
                                                var current = this.eq(0).get(0);
                                                var parent = current.parentNode;
                                                return merge([parent],this.constructor());
                                        },
                                        children:function(expr){
                                                var parent = this.get(0),children = parent.children,i = 0,target = [];
                                                if(!arguments.length)
                                                        return merge(children,this.constructor());
                                                var match = rquickExpr.exec(expr);
                                                if(match[1]){ //tag
                                                        for(i ; i < children.length ; i++){
                                                                if(children[i].tagName == match[1])target.push(children[i]);
                                                        }
                                                }
                                                if(match[2]){
                                                        for(i = 0 ; i < children.length; i++){
                                                                if(children[i][id] == match[2]) target.push(children[i]);
                                                        }
                                                }
                                        },
                                        text:function(val){
                                                var elem = this.eq(0);
                                                if(!arguments.length) return getText(elem[0]);
                                                else elem.textContent = val;
                                        },
                                        filter:function(expr){
                                                
                                        },
                                        empty:function(){ // one or more element
                                                var target = [], source = this.toArray(),i = 0 ,len = source.length;
                                                while(i < len){
                                                        var elem = source[i];
                                                        if(!elem.children.length) target.push(elem);
                                                        i++;
                                                }
                                                return merge(target,this.constructor());
                                        },
                                        val:function(val){
                                                if(!argument.length){  //取值操作
                                                        var elem = this.get(0);
                                                        var val = elem.value;
                                                        return typeof val === "string" ? val.replace(rreturn,"") : !val ? "" : val;
                                                }
                                        },
                                        attr:function(){ //1.name;2.properties object(key/value);3.key/value 4.key/function
                                                var cur =  this.get(0),key = arguments[0],arg = arguments[1],val;
                                                if(key){
                                                        if(ESS.typeOf(key) === "string"){
                                                                val = cur[key];
                                                        }else if(ESS.typeOf(key) === "object"){
                                                                for(var prop in key){
                                                                        cur[prop] = key[prop];
                                                                }
                                                                return ;
                                                        }
                                                        if(arg){
                                                                if(ESS.typeOf(arg) === "string"){
                                                                        cur[key] = arg;
                                                                        return ;
                                                                }
                                                                if(ESS.typeOf(arg) === "function"){
                                                                        arg.call(cur);
                                                                }
                                                                return val;
                                                        }
                                                }
                                        },
                                        removeAttr:function(name){
                                                var current = this.get(0);
                                                if(current.attributes[name]){
                                                        current.removeAttribute(name);
                                                }
                                        },
                                        html:function(val){
                                                return val ? this.get(0).innerHTML = val : this.get(0).innerHTML;
                                        },
                                        addClass:function(css){ // one class property or array
                                                if(arguments.length){
                                                        cssHandler.call(this,css,"add");
                                                }
                                        },
                                        removeClass:function(css){
                                                if(arguments.length){
                                                        cssHandler.call(this,css,"remove");
                                                }
                                        },
                                        toggle:function(css){
                                                if(css){
                                                        this.get(0).classList.toggle(css);
                                                }
                                        },
                                        hide:function(){
                                                this.get(0).style.display = "none";
                                        },
                                        show:function(){
                                                this.get(0).style.display = "block";
                                        }
                                };
                                proto.init.prototype = proto;
                                return Query;
                        }()
                };
        })();
})();

/**
 * AJAX 请求
 */
ESS.register("ESS.ajax.request",function(o){
        if(arguments.length != arguments.callee.length)
                throw new Error("the number of actual arguments is not equal the expected.");
        if(!(o instanceof Object)) throw new TypeErro("the argument type is't object");
        var httpRequest = null;
        if(window.XMLHttpReques){
                httpRequest = new XMLHttpRequest();
        }else if(window.ActiveXObject){
                try{
                        httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
                }catch(e){
                        try{
                                httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
                        }catch(e){
                                
                        }
                }
        }
        if(!httpRequest){
                throw new Error("AjaxException:your browser do not support ajxt");
        }
        httpRequest.responseTyep = type | "json";
        httpRequest.onreadystatechange = function(){
                try{
                        if(httpRequest.readyState == 4){
                                if(httpRequest.status == 200){
                                        o.success(httpRequest.responseText | HttpRequest.responseXML);
                                        return ;
                                }
                                throw new Error("AjaxException: ajax request error.");
                        }
                }catch(e){
                        throw new Error("AjaxException:"+e.message);
                }
        };
        var method = o.method.toUpperCase(); //有些浏览器不支持小写
        if(o.xml) httpRequest.setHeader("Content-type","application/xml");
        httpRequest.setRequestHeader("Cache-control", o.cache-type | "no-cache");
        switch(method){
                case "POST" : 
                        httpRequest.open("POST", url, o.async | true);
                        httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                        httpRequest.send(encodeURIComponent(o.param));
                        break;
                case "GET" :
                        httpRequest.open("GET", encodeURIComponent(o.url +"?"+o.param), o.async | true);
                        httpRequest.send(null);
                        break;
                default :
                        httpRequest.open(method, encodeURIComponent(o.url +"?"+o.param), o.async | true);
                        httpRequest.send(null);
        }
});

/**
 * JSON
 */
ESS.register("ESS.JSON",function(){
        
        var rep , indent, gap ,me = this;
        
        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        
        var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        
        var meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
    };
        
        function f(n){
                return n < 10 ? '0' + n : n;
        }
        
        if(typeof Date.prototype.toJSON !== "function"){
                Date.prototype.toJSON = function (key) {
            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
        };
        }
        
        function replace(str){
                return escapable.test(str) ? '"'+str.replace(escapable,function(reg){
                        var exp = meta[reg];
                        return typeof(exp) === "string" ? exp : '\\u' + ('0000' + reg.charCodeAt(0).toString(16)).slice(-4);
                })+'"' : '"'+str+'"';
        }
        
        function toString(key,holder){
                var mind = gap , partial, k, v;
                var value = holder[key];
                if(value && typeof value === "object" && typeof value.toJSON === "function"){
                        value = value.toJSON();
                }
                if(typeof rep === "function") rep.call(holder,key,value);
                switch(typeof value){
                        case "string":
                                return replace(value);
                        case "number" :
                                return isFinite(value) ? String(value) : 'null';
                        case "boolean" :
                        case "null" : 
                                return String(value);
                        case "function" :
                                return value.prototype.constructor;
                        case "object" :
                                if(!value) return 'null';
                                gap += indent;
                    partial = [];
                    if (Object.prototype.toString.apply(value) === '[object Array]') {
                        length = value.length;
                        for (var i = 0; i < length; i += 1) {
                            partial[i] = toString(i, value) || 'null';
                        }
                        v = partial.length === 0 ? '[]': gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }
                    if (rep && typeof rep === 'object') {
                        length = rep.length;
                        for (i = 0; i < length; i += 1) {
                            if (typeof rep[i] === 'string') {
                                k = rep[i];
                                v = toString(k, value);
                                if (v) {
                                    partial.push(replace(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    } else {
                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = toString(k, value);
                                if (v) {
                                    partial.push(replace(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    }
                    v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
                }
        }
        
        return {
                encode : function(text, reviver){
                        if(me.JSON.parse && typeof me.JSON.parse === "function") return me.JSON.parse(text , reviver);
            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }
            var j;
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                j = eval('(' + text + ')');
                return typeof reviver === 'function' ? walk({'': j}, '') : j;
            }
            throw new SyntaxError('ESS.JSON.encode');
                },
                decode : function(value, replacer, space){
                        if(me.JSON.stringify && typeof me.JSON.stringify === "function") return me.JSON.stringify(value,replacer,space);
                        var indent;         //JSON字符串格式缩进
                        if(typeof space === "number"){
                                for(i = 0 ; i < space ; i++){
                                        indent += ' ';
                                }
                        }else if(typeof space === "string"){
                                indent = space;
                        }
                        //replacer 必须是function或者是array
                        if(replacer && typeof replacer !== "function" && 
                                        (typeof replacer !== "object" || typeof replacer.length !== "number")) 
                                throw Error("ESS.JSON.decode");
                        rep = replacer;
                        return toString(" ",{" ":value});
                }
        };
}());

/**
 * 不同浏览器之间EventTarget中的方法不同，ESS.event.Util对象实现浏览器间EventTarget方法的统一
 */
ESS.register("ESS.event",function(){
        
        var me = this;
        
        /**
         * 统一Event对象属性或方法
         */
        function unifyEvent(e){
                /**
                 * 有个特别需要注意的地方时，IE浏览器除了mouserup的event.button = 2之外其他的均为0
                 */
                if(ESS.isIE && ESS.isWin){
                        e.charCode = (e.type == "keyPress") ? e.keycode : 0;
                        e.eventPhase = 2;
                        e.isChar = (e.charCode > 0);
                        //IE的情况
                        e.pageX = e.clientX + me.document.scrollLeft | me.document.documentElement.scrollLeft;
                        e.pageY = e.clientY + me.document.scrollTop | me.document.documentElement.scrollLef;
                        e.preventDefault = function(){
                                this.returnValue = false;
                        };
                        if(e.type == "mouseout") e.relatedTarget = e.toElement;
                        else if(e.type == "mouseOver") e.relatedTarget = e.fromElement;
                        e.stopPropagation = function(){
                                this.cancelBubble = true;
                        };
                        e.target = e.srcElement;
                        e.time = (new Date()).getTime();
                }
                return e;
        }
        
        return {
                addEventListener:function(elem,type,handler){
                        if(arguments.length != arguments.callee.length)
                                throw new Erro("the number of actual arguments is not equal the expected.");
                        if(elem.addEventListener) elem.addEventListener(type,this.wrapperEventHandler(handler),false);
                        else if(elem.attachEvent) elem.attachEvent("on"+type,this.wrapperEventHandler(handler));
                        else elem["on"+type] = this.wrapperEventHandler(handler);
                },
                removeEventListener:function(elem,type,handler){
                        if(arguments.callee.length < 2)
                                throw new Error("removeEventListener function at least need two arguments.");
                        if(elem.removeEventListener) elem.removeEventListener(type,this.wrapperEventHandler(handler),false);
                        else if(elem.detachEvent) elem.detachEvent("on"+type,this.wrapperEventHandler(handler));
                        else elem["on"+type] = null;
                },
                /**
                 * 包装事件执行函数
                 * @param handler 事件执行函数
                 * @returns
                 */
                wrapperEventHandler:function(handler){
                        return function wrapperHandler(e){
                                if(me.event) e = unifyEvent(me.event);
                                handler(e);
                        };
                }
        };
}());

ESS.register("ESS.dom",function(){
        var me = this;
        
        function cssDeclaration(elem){
                return elem.currentStyle ? elem.currentStyle : document.defaultView.getComputedStyle(elem);
        }
        
        function setAttr(elem,attr,val){
                try{
                        cssDeclaration(elem).setProperty(attr,val);
                }catch(e){
                        elem.style[attr] = val;
                }
        }
        
        return {
                /**
                 * 获取样式值
                 * @param elem 目标元素
                 * @param attr 目标属性
                 * @returns
                 */
                getStyle:function(elem,attr){
                        if(elem.style[attr]) return elem.style[attr];
                        var style = cssDeclaration(elem);
                        return cssDeclaration(elem)[attr];
                },
                setStyle:function(elem,style){
                        if(ESS.typeOf(style) === "object"){
                                for(var property in style){
                                        if(style.hasOwnProperty(property)){
                                                var prop = style[property];
                                                if(ESS.typeOf(prop) === "function") continue;
                                                if(ESS.typyOf(prop) === "object") arugments.callee(elem,prop);
                                                setAttr(elem,property,prop);
                                        }
                                }
                        }
                        if(ESS.typeOf(style) === "string"){
                                if(arguments.length == 3){
                                        setAttr(elem,style,arguments[2]);
                                }
                        }
                },
                query:function(){
                        
                        function Query(selector,context){
                                return new Query.prototype.init(selector,context);
                        }
                        
                        var searchExpr = /^([#\.]?[\w\-]+)\s*(\[[\w\-]+=[\w\-]+\]|[\:>\+\s]\s*[\w\-]+)?$/;
                        
                        var prot = Query.prototype = {
                                construtor:Query,
                                init:function(selector,context){
                                        if(!selector) return this;
                                        if(selector.nodeType && selector.nodeType == 1 || selector.nodeType == 9){
                                                this.context = this[0] = selector;
                                                this.length = 1;
                                                return this;
                                        }
                                        if(ESS.typeOf(selector) === "string"){
                                                var match = searchExpr.exec(selector);
                                                
                                        }
                                        
                                }
                        };
                        
                        prot.init.prototype = prot;
                        
                        return Query; //提供一个方法引用,引用方法调用后，返回一个对象，包含各种操作函数
                }(),
                render:function(){
                        
                }
        };
}());
