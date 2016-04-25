var SYS = {
window: {},tempIntervals: []
};var g_lvl = {
0:   'Guest',10:  'Unregistered',20:  'User',100: 'Manager',200: 'Admin',250: 'Super',255: 'Super'
}
var NOW = new Date()*1;window.ENGINE = {
path: {
page:      'http://test.com',handler:   'http://test.com/_handler/',static:    'http://test.com/static/',media_raw: 'http://test.com/_media/',media:     ['http://test.com/_media/',NOW,'/'].join(''),compiled:  ['http://test.com/_compiled/',NOW,'/'].join('')
},menu: {},goAnimation: false
};function nf(){}
function log() { for ( var key in arguments) { console.log(key+':', arguments[key]); } }
function def(val) { return typeof(val) != 'undefined' && val !== null; }
function okeys(obj) { try { return Object.keys(obj); } catch(err) { return []; }}
function extendPrimitive(base, key, f) {
base.prototype[key] = f;Object.defineProperty(base.prototype, key, {
enumerable: false
});}
var T = function(ref,tMap) {
if ( !def(ref) ) { return null; }
if ( tMap ) {
var C = ref.constructor;for ( var i = 0; i < tMap.length; i++ ) {
if ( C == T[tMap[i]] ) {
return true;}
}
return false;}
return ref.constructor;}
T.B = Boolean;T.R = RegExp;T.E = Error;T.S = String;T.D = Date;T.O = Object;T.F = Function;T.A = Array;T.N = Number;function getEnv(obj) {
return obj.__ENV || {};}
extendPrimitive(T.F,'ENV',function(env) {
var fn = this;return function() {
var args = arguments,context = Object.create(this);context.__ENV = env;return fn.apply(context,args);};});function tm(func, timer) {
timer = timer||1;return setTimeout(func, timer);}
extendPrimitive(T.F, 'tm', function() {
var ENV = getEnv(this);var tm = ENV.delay || 1;var fn = this;var args = arguments;setTimeout(function() { fn.apply(fn, args); }, tm);});var docCookies = {
getItem: function (sKey) {
if (!sKey) { return null; }
return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;},setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
var sExpires = "";if (vEnd) {
switch (vEnd.constructor) {
case Number:
sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;break;case String:
sExpires = "; expires=" + vEnd;break;case Date:
sExpires = "; expires=" + vEnd.toUTCString();break;}
}
document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");return true;},removeItem: function (sKey, sPath, sDomain) {
if (!this.hasItem(sKey)) { return false; }
document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");return true;},hasItem: function (sKey) {
if (!sKey) { return false; }
return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);},keys: function () {
var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
return aKeys;}
};function testStorage() {
try {
localStorage.setItem('test',1);localStorage.removeItem('test');window.___glob = localStorage;} catch(err) {
window.___glob = docCookies;}
window.glob = function(key, val) {
if ( def(val) ) {
return window.___glob.setItem(key, val);}
return window.___glob.getItem(key);}
window.glob.removeItem = function(key) {
window.___glob.removeItem(key)
}
}
testStorage();extendPrimitive(T.N, 'toLen', function(len) {
len     = len || 2;var str = this.toString();var res = '';for ( var i = str.length; i < len; i++ ) { res += '0'; }
return res+str;});extendPrimitive(String, 'toLen', T.N.prototype.toLen);function listToArray(list) {
var result = [];for ( var i = 0, len = parseInt(list.length); i < len; i++ ) {
result.push(list[i]);}
return result;}
function objToArray(obj) {
if ( obj.constructor && obj.constructor == Array ) { return obj; }
var result = [];mapO(obj, function(data) {
if ( data ) { result.push(data); }
});return result;}
function map(list, func, data) {
data          = data || this;data.returnOn = data.returnOn || false;for ( var i = 0, len = parseInt(list.length); i < len; i++ ) {
if ( data.returnOn == func(list[i], i) ) {
return 0;}
}
if ( list.length == 0 && data.else ) {
data.else();}
return !data.returnOn;}
function mapO(obj, func, data) {
var ENV = getEnv(this);data          = data || this;data.returnOn = data.returnOn || ENV.returnOn || false;data.sort = data.sort || ENV.sort;obj           = obj||ENV.obj||{};var keys = ENV.keys || Object.keys(obj);if ( data.sort ) {
keys.sort(data.sort);}
for ( var i = 0, len = parseInt(keys.length); i < len; i++ ) {
if ( data.returnOn == func(obj[keys[i]], keys[i]) ) {
return data.returnOn;}
}
if ( keys.length == 0 && data.else ) {
data.else();}
return !data.returnOn;}
function parseLS(obj) {
if ( !def(obj) ) { return []; }
if ( typeof(obj) == 'string' ) { return obj.split(','); }
return objToArray(obj);}
function mapLS(obj, func) {
mapO(obj, function(val, keys) {
map(parseLS(keys), function(key) {
func(val, key);});});}
function mapDLS(obj, func) {
mapO(obj, function(vals, keys) {
map(parseLS(keys), function(key) {
map(parseLS(vals), function(val) {
func(val, key);});});});}
function lsMapToDict(obj) {
var result = {};mapLS(obj, function(val, key) {
result[key] = val;});return result;}
function dlsMapToDict(obj) {
var result = {};mapLS(obj, function(val, key) {
result[key] = result[key] || [];result[key].push(val);});return result;}
function reverseDict(obj) {
var result = {};mapO(obj, function(val, key) {
result[val] = key;});return result;}
function reverseLSDict(obj) {
var result = {};mapO(obj, function(vals, key) {
map(parseLS(vals), function(val) {
result[val] = key;});});return result;}
window._jOInd = 1;window.O = {};function _jO(obj, parent) {
obj.C = obj.C||{}; 
obj.V = obj.V||{};obj.F = obj.F||{};obj.A = obj.A||{};obj.D = obj.D||{};obj.___id = obj.___id || ['[object ',']'].join(window._jOInd += 1);window.O[obj.___id] = obj;obj.toString = function() { return obj.___id; }
if ( def(parent) ) { obj.parent = _jO(parent); }
if ( def(obj.attributes) ) {
map(obj.attributes, function(attr) {
obj.A[attr.name] = attr.value;var map = attr.name.split('data-');if ( def(map[1]) ) {
obj.D[map[1]] = attr.value;}
})
}
return obj;}
function CO(obj) { return JSON.parse(JSON.stringify(obj)); }
extendPrimitive(T.A, 'add', function(val) {
var pos = this.indexOf(val);if ( pos == -1 ) {
this.push(val);}
return this;});extendPrimitive(T.A, 'remove', function(val) {
var pos = this.indexOf(val);if ( pos >= 0 ) {
this.splice(pos, 1);}
return this;});extendPrimitive(T.S, 'rp', function(from,to) { return this.split(from).join(to); });if ( !T.S.repeat ) {
extendPrimitive(T.S, 'repeat', function(val) { val = val || 0; return new T.A(val+1).join(this); });}
function generateDetailedMap(obj) {
var result = {};mapO(obj, function(data, str) {
data.str = str;var newStr = '';map(str, function(symb) {
newStr += symb;result[newStr] = result[newStr]||[];result[newStr].add(data);});});return result;}
function getQuery (str, splitBy,ignoreAfter) {
str = str||window.location.href;splitBy = splitBy||'?';ignoreAfter = ignoreAfter || '#';var data = str.split(splitBy)[1];if ( !def(data) ) { return {} }
data = data.split(ignoreAfter)[0];var result = {};data.split('&').map(function(pair) {
var str = pair.split('=');if ( str[0].length > 0 ) {
if ( def(str[1]) ) {
result[str[0]] = str[1];} else {
result[str[0]] = true;}
}
});return result;}
extendPrimitive(T.S, 'contains', function(val) { return this.indexOf(val) >= 0; });extendPrimitive(T.A, 'contains', function(val) { return this.indexOf(val) >= 0; });function mergeObjects(basic, extend) {
var result = {};mapO(basic,  function(val, key) { result[key] = val; })
mapO(extend, function(val, key) { result[key] = val; })
return result;}
function evt(obj, event, todo) {
if ( !def(obj) ) { return null; }
obj.addEventListener(event, todo);}
function evtDel(obj, event, todo) {
if ( !def(obj) ) { return null; }
obj.removeEventListener(event, todo);}
function sl(obj, query, isStr) {
query   = query||'';isStr   = isStr||false;var req = query;if ( typeof(req) == 'string' ) {
req = req.split(':');}
var start   = parseInt(req[0]||0);if ( start < 0 ) { start += obj.length; }
var end     = parseInt(req[1]||obj.length);if ( end < 0 ) { end += obj.length; }
var step    = parseInt(req[2]||1);var len     = parseInt((end-start)/Math.abs(step));var result  = new Array(Math.max(len, 0));var j = 0;if ( step < 0 ) {
for ( var i = end-1; i >= start; i += step ) { if ( def(obj[i]) ) {result[j] = obj[i]; j += 1; } }
} else {
for ( var i = start; i < end;    i += step ) { if ( def(obj[i]) ) {result[j] = obj[i]; j += 1; } }
}
result = result.splice(0, j);if ( isStr ) { return result.join(''); }
return result;}
extendPrimitive(T.S, 'sl', function(query) { return sl(this, query, true); });extendPrimitive(T.A, 'sl', function(query) { return sl(this, query); });function filterObjects(list, data, func) {
if ( list.constructor != Array ) { list = objToArray(list); }
var result = [];map(list, function(obj) {
if (mapO(data, function(val, key) {
return obj[key] == val;}) ) {
result.push(obj);if ( func ) { func(obj); }
};});return result;}
function $P(obj, key, getter, setter) {
if ( Object.__defineGetter__ ) {
if ( def(getter) ) { obj.__defineGetter__(key, getter); }
if ( def(setter) ) { obj.__defineSetter__(key, setter); }
} else {
var DO = {
enumerable: true,configurable: true
}
if ( def(getter) ) { DO['get'] = getter; }
if ( def(setter) ) { DO['set'] = setter; }
Object.defineProperty(obj, key, DO);}
}
function filterArgs(mapData, args) {
if ( typeof(mapData) == 'string') {
var t = mapData.rp(',','');mapData = [];map(t,function(k) { mapData.push(T[k]); });}
var result = new Array(mapData.length);map(args, function(arg) {
if ( arg && arg.constructor ) {
var pos = mapData.indexOf(arg.constructor);result[pos] = arg;mapData[pos] = null;}
});map(mapData, function(type, pos) {
if ( type ) {
result[pos] = new type();}
});return result;}
function newDate(data) {
var idt = parseInt(data);if ( idt == data ) { data = idt; }
var dt = new Date(data);if ( dt == 'Invalid Date' ) { dt = new Date(); }
return dt;}
function clearSeconds(dateObj) {
dateObj.setMilliseconds(0);dateObj.setSeconds(0);return dateObj;}
function clearMinutes(dateObj) {
dateObj.setMinutes(0);dateObj.setHours(0);return dateObj;}
function clearTime(dateObj) {
return clearMinutes(clearSeconds(dateObj));}
function endOfDay(time) {
var dateObj = new Date(time);dateObj.setMinutes(59);dateObj.setHours(23);return dateObj;}
ENGINE.isIE = (window.navigator.userAgent.contains('MSIE ') || window.navigator.userAgent.contains('Trident/'));ENGINE.isFF = (window.navigator.userAgent.contains('Firefox/'));ENGINE.isOP = (window.navigator.userAgent.contains('Opera'));ENGINE.isIB = (/iPhone|iPad/i.test(window.navigator.userAgent));ENGINE.isAN = (window.navigator.userAgent.contains('Android'));ENGINE.isMOB = ENGINE.isIB || ENGINE.isAN;ENGINE.IEver = 0;if ( ENGINE.isIE && window.navigator.userAgent.contains('MSIE ') ) {
ENGINE.IEver = window.navigator.userAgent.indexOf('MSIE');ENGINE.IEver = parseInt(window.navigator.userAgent.substring(ENGINE.IEver+5, ENGINE.IEver+6));if ( ENGINE.IEver == 0 ) { ENGINE.IEver = 11; }
}
ENGINE.isIframe = window != window.top;function getSel() {
var sel = window.getSelection();try {
return sel.getRangeAt(0);} catch(err) {
return null;}
}
function restoreSelectionAfter(func) {
try {
var sel = window.getSelection();var rng = sel.getRangeAt(0);var rngBounds = [rng.startContainer,rng.startOffset,rng.endContainer,rng.endOffset];func();rng.setStart(rngBounds[0],rngBounds[1]);rng.setEnd(rngBounds[2],rngBounds[3]);sel.removeAllRanges();sel.addRange(rng);return true;} catch(err) {
func();return false;}
}
function S(query, node, direct) {
var marker = query[0];var str    = query.substring(1, query.length);var result = null;if ( marker == '#' ) {
return document.getElementById(str);}
node = node||document;if ( marker == '.' ) {
result = listToArray(node.getElementsByClassName(str));} else {
result = listToArray(node.getElementsByTagName(query));}
if ( def(direct) && direct ) {
var newResult = [];map(result, function(elem) {
if ( elem.parentNode == node ) { newResult.push(elem); }
});}
return result;}
addCls = function(node, cls) {
if ( node.className.split(/\s+/g).indexOf(cls) == -1 ) {
node.className += ' '+cls;}
}
extendPrimitive(Node, 'addCls', function(cls) { addCls(this, cls); });remCls = function(node, cls) {
node.className = node.className.split(cls).join('');node.className = node.className.split('  ').join(' ');}
extendPrimitive(Node, 'remCls', function(cls) { remCls(this, cls); });swCls = function(node, cls) {
if ( node.className.indexOf(cls) == -1 ) {
addCls(node, cls);return true;}
remCls(node, cls);return false;}
extendPrimitive(Node, 'swCls', function(cls) { swCls(this, cls); });function attach(node, target) { target.appendChild(node); }
extendPrimitive(Node, 'attach', function(node) { attach(node, this); });function attachFirst(node, target) {
if( target.childNodes ) {
target.insertBefore(node, target.firstChild);} else {
target.attach(node);}
}
extendPrimitive(Node, 'attachFirst', function(node) { attachFirst(node, this); });function detach(node) {
if ( node && node.parentNode ) {
node.parentNode.removeChild(node);}
}
extendPrimitive(Node, 'detach', function() { detach(this); });function getChildren(node) {
var children = [];for( var i in node.childNodes ) {
if( node.childNodes[i].nodeType === 1 ) {
children.push(node.childNodes[i]);}
}
return children;}
extendPrimitive(Node, 'getChildren', function() { getChildren(this); });function insBefore(node, target) {
if ( !def(target.parentNode) ) { return 0; }
target.parentNode.insertBefore(node, target);}
extendPrimitive(Node, 'insBefore', function(node) { insBefore(node, this); });function insAfter(node, target) {
var parent = target.parentNode;var next   = target.nextSibling;if ( !def(parent) ) { return 0; }
if ( def(next) ) {
insBefore(node, next);} else {
parent.attach(node);}
}
extendPrimitive(Node, 'insAfter', function(node) { insAfter(node, this); });function setTag(node, data, params) {
params = mergeObjects({
cls  : true,attr : true
},params);var newNode, rngData;var selObj = getSel()
if ( !selObj || selObj.startContainer != node ) {
selObj = null;} else {
rngData = [selObj.startOffset, selObj.endOffset, selObj.startContainer.nodeType];}
restoreSelectionAfter(function(){
if ( !def(data) ) {
newNode = document.createTextNode(node.val);} else {
var cls = data.split('.');var tag = cls.splice(0, 1)[0];if ( !params.cls ) {
cls = null;} else if ( cls.length == 0 ) {
cls = node.className;} else {
cls = cls.join(' ');}
newNode = cr(tag, cls);if ( node.nodeType == 3 ) {
newNode.val = node.val;} else {
while (node.firstChild) {
newNode.appendChild(node.firstChild);}
if ( params.attr ) {
var attrs = {};mapO(node.attributes, function(attr) {
if ( attr.name ) { attrs[attr.name] = attr.value; }
});newNode.attr(attrs);}
}
}
if ( node.C ) { _jO(newNode, node); }
if ( node.parentNode ) {
insBefore(newNode, node);detach(node);if ( selObj ) {
var sel = window.getSelection();sel.removeAllRanges();try {
if ( rngData[2] == 3 ) {
selObj.setStartAfter(newNode);selObj.setEndAfter(newNode);} else {
selObj.setStart(newNode,rngData[0]);selObj.setEnd(newNode,rngData[1]);}
} catch(err) {
selObj.setStart(newNode,0);selObj.setEnd(newNode,0);}
sel.addRange(selObj);}
}
});return newNode;}
$P(Node.prototype, '_tag',function() {
if ( this.tagName ) {
return this.tagName.toLowerCase();}
return null;},function(data) {
return setTag(this, data);}
);function insToSelection(dom) {
var sel = getSel();if (sel) {
sel.insertNode(dom);var parent = dom.parentNode;if ( parent._tag == 'p' ) {
var sibs = parent.getChildren();if ( sibs.length == 2 && dom == sibs[0] && sibs[1]._tag == 'br' ) {
detach(sibs[1]);} 
}
}
}
ENGINE.selections = {};function saveSelection(name) {
var sel = getSel();if ( sel ) {
ENGINE.selections[name] = [sel.startContainer, sel.startOffset, sel.endContainer, sel.endOffset];}
}
function restoreSelection(name) {
var rdata = ENGINE.selections[name];if ( rdata && rdata[0] && rdata[2] ) {
var sel = window.getSelection();var range = document.createRange();range.setStart(rdata[0], rdata[1]);range.setEnd(rdata[2], rdata[3]);sel.removeAllRanges();sel.addRange(range);}
}
$P(Node.prototype, 'val',function() {
if ( this.__isHtml ) { return this.innerHTML; }
if ( def(this.value) ) {
if ( this.type == 'checkbox' ) {
return this.checked;}
return this.value;}
return this.textContent;},function(data) {
if ( this.__isHtml ) { return this.innerHTML = data; }
if ( def(this.value) ) {
if ( this.type == 'checkbox' ) {
return this.checked = data;}
return this.value = data;}
return this.textContent = data;});extendPrimitive(Node,'VAL', function(value) {
if ( def(value) ) {
this.val = value;return this;}
return this.val;});function attr(node, key, value) {
if ( typeof(key) == 'object' ) {
mapO(key, function(value, key) {
node.setAttribute(key, value);});return node;}
if ( def(value) ) {
node.setAttribute(key, value);return node;}
return node.getAttribute(key);}
extendPrimitive(Node, 'attr', function(key, value) { return attr(this, key, value); });function remattr(node, keys) {
keys = parseLS(keys);map(keys, function(key) {
node.removeAttribute(key);});return node;}
extendPrimitive(Node, 'remattr', function(keys) { return remattr(this, keys); });extendPrimitive(Node, 'remAttr', Node.prototype.remattr);function cr(tag, cls, parent) {
var node = document.createElement(tag);if ( def(cls) ) { node.className = cls; }
if ( def(parent) ) { parent.appendChild(node); node.parent = parent; }
return node;}
extendPrimitive(Node, 'cr', function(tag, cls) { return cr(tag, cls, this); });function formatDate(date, withTime, includeYear, includeSeconds) {
if ( !def(date) || date.length == 0 ) { return ''; }
var dateInt = parseInt(date);if ( date == dateInt ) { date = dateInt; }
var fDate = new Date(date);var today = new Date();if ( fDate == 'Invalid Date' ) {
try {
var dtMap = obj.created_at.split(' ')
var fDate = new Date(dtMap[0]);dtMap     = dtMap[1].split(':');fDate.setHours(dtMap[0]);fDate.setMinutes(dtMap[1]);} catch(err) { fDate = today; }
}
var dateString = [fDate.getDate().toLen(), (fDate.getMonth()+1).toLen() ];if ( fDate.getFullYear() != today.getFullYear() || includeYear) {
dateString.push(fDate.getFullYear().toLen(4));} else if ( fDate.getDate() == today.getDate() && fDate.getMonth() == today.getMonth() ) {
dateString = [];}
dateString = dateString.join('/');if ( withTime ) {
dateString += [' ', fDate.getHours().toLen(), ':', fDate.getMinutes().toLen()].join('');if ( includeSeconds ) {
dateString += ':'+fDate.getSeconds().toLen();}
}
return dateString;}
function formatDateBackwards(str) {
var date = str.split(' ')[0];var date = date.split('/');if ( date.length != 3 ) { return str; }
return date[2]+'-'+date[1]+'-'+date[0];}
function formatTimer(est) {
est /= 1000;var mins = parseInt(est/60);var secs = parseInt(est-(mins*60));return [mins.toLen(),secs.toLen()].join(':');}
function dispatchOnUpdate(node) {
_jO(node).C._updData = null;node.C._updFunc = [];node.C._emitUpdated = function() {
node.C._updFunc.map(function(func) {
func(node.val);});}
node.C._emitValue = function(val) {
node.C._updFunc.map(function(func) {
func(val);});}
node.addEventListener('focus', function(ev){ this.C._updData = this.val; });node.addEventListener('blur', function(ev){
if ( this.C._updData != this.val ) {
node.C._emitUpdated();}
});return node;}
extendPrimitive(Node, 'onupdate', function(func, eraseOld) {
if ( !def(this.C) || !def(this.C._updData) ) { dispatchOnUpdate(this); }
if ( eraseOld ) { this.C._updFunc = []; }
this.C._updFunc.add(func);});function setNodeView(node, viewTag, cls, func) {
_jO(node).V.viewNode = _jO(cr(viewTag, node.className));if ( def(cls) ) { node.V.viewNode.addCls(cls); }
insBefore(node.V.viewNode, node);detach(node);node.V.viewNode.__isHtml = node.__isHtml;node.V.viewNode.val      = node.val;if ( def(func) ) {
node.V.viewNode.onupdate(func);}
}
function remNodeView(node) {
if ( def(_jO(node).V.viewNode) ) {
insBefore(node, node.V.viewNode);node.V.viewNode.detach();node.val = node.V.viewNode.val;delete node.V.viewNode;return true;}
return false;}
extendPrimitive(Node, 'setView', function(tag, cls, func) {
if ( def(tag) ) { return setNodeView(this, tag, cls, func); }
return remNodeView(this);});function adjustHeight(node, fetch) {
if ( node.scrollHeight ) {
if ( fetch ) {
node.style.height = '0px';}
if ( node.scrollHeight + 2 - node.offsetHeight > 2 ) {
node.style.height = node.scrollHeight+2+'px';}
}
return node;}
extendPrimitive(Node, 'adjustHeight', function() { return adjustHeight(this);});function autoAdjust(node) {
evt(node, 'keydown', node.adjustHeight);evt(node, 'keyup',   node.adjustHeight);evt(node, 'focus',   node.adjustHeight);evt(node, 'blur',    node.adjustHeight);node.adjustHeight();return node;}
function clearEvents(node) {
node.onclick =     function() { return false; }
node.onmouseup =   function() { return false; }
node.onmousedown = function() { return false; }
node.onmousemove = function() { return false; }
return node;    
}
extendPrimitive(Node, 'clearEvents', function() { return clearEvents(this); });function selectorMapping(node, data) {
node = node||document;var result = {};mapO(data, function(keys, selector) {
if ( typeof(keys) == 'string' ) { keys = keys.split(','); }
var list = S(selector, node);map(keys, function(key, index) {
result[key] = list[index];})
});return result;}
function domSearch(list, pattern, funcOk, funcBad, params) {
params  = params || {};funcOk  = funcOk ||function(node) { node.remCls('hidden'); }
funcBad = funcBad||function(node) { node.addCls('hidden'); }
pattern = pattern.toLowerCase();var result = [];params.limit = params.limit || list.length;if ( params.reqValue && pattern.length == 0 ) { params.limit = 0; }
var i = 0;var j = 0;for ( ; i < list.length && j < params.limit; i++ ) {
var node = list[i];if ( node.val.toLowerCase().contains(pattern) ) {
funcOk(node);result.push(node);j += 1;} else {
funcBad(node);}
}
for ( ; i < list.length; i++ ) { funcBad(list[i]); }
return result;}
function switchActive(list, node, cls) {
list = objToArray(list);cls  = cls||'active';mapO(list, function(node) {
node.remCls(cls);});node.addCls(cls);}
extendPrimitive(Node, 'isValid', function(){ return true; })
function getOffsetRect(elem) {
var box        = elem.getBoundingClientRect();var body       = document.body;var docElem    = document.documentElement;var clientTop  = docElem.clientTop  || body.clientTop  || 0;var clientLeft = docElem.clientLeft || body.clientLeft || 0;var top        = 0;var left       = 0;if ( 0 && isMOB ) {
top  = box.top  - clientTop;left = box.left - clientLeft;} else {
var scrollTop  = window.pageYOffset || docElem.scrollTop  || body.scrollTop;var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;top  = box.top  + scrollTop  - clientTop;left = box.left + scrollLeft - clientLeft;}
return { top: Math.round(top), left: Math.round(left) }
}
extendPrimitive(Node, 'getOffsetRect', function() { return getOffsetRect(this); });function getDocumentScroll() {
if ( ENGINE.isFF ) {
var temp = S('html')[0];return [temp.scrollLeft, temp.scrollTop, temp.scrollWidth, temp.scrollHeight];}
return [document.body.scrollLeft, document.body.scrollTop, document.body.scrollWidth, document.body.scrollHeight];}
if ( window.scrollTo ) {
window.__scrollFunction = window.scrollTo;} else if ( window.scroll ) {
window.__scrollFunction = window.scroll;} else {
window.__scrollFunction = function(x, y) {
document.body.scrollLeft = x;document.body.scrollTop  = y;}
}
var __scrollAnimationInterval = null;function setDocumentScroll(val) {
val = val||[0,0];clearInterval(__scrollAnimationInterval);var pos = getDocumentScroll();var steps = 250 / 10;var step = (val[1] - pos[1]) / steps;if ( 1 || ENGINE.isMOB ) {
window.__scrollFunction(val[0],val[1]);} else {
__scrollAnimationInterval = setInterval(function() {
pos[1] += step;window.__scrollFunction(val[0],pos[1]);steps -= 1;if ( steps == 0 ) { clearInterval(__scrollAnimationInterval); }
}, 10);}
}
cr.bool = function(cls, parent) {
var node = cr('div', 'jBool fa '+cls||'', parent);node._txt = node.cr('span','hidden').VAL('0 No Fail');dispatchOnUpdate(node);node._swNode = node.cr('div', 'vfa');node._state = false;$P(node, 'val', function() { return node._state; }, function(data) {
if ( data ) {
node.addCls('active');node._txt.VAL('1 Yes Ok');} else {
node.remCls('active');node._txt.VAL('0 No Fail');}
node._state = data;node.C._emitUpdated();return node._state;});clearEvents(node).onclick = function() {
node.val = !node.val;return false;}
return node;}
cr.bool3 = function(cls,parent) {
var node = cr('div', 'jBool 3pos inactive fa '+cls||'', parent);node._txt = node.cr('span','hidden').VAL('0 No Fail');dispatchOnUpdate(node);node._swNode = node.cr('div', 'vfa');node._state = null;$P(node, 'val', function() { return node._state; }, function(data) {
if ( data == true ) {
node.addCls('active');node.remCls('inactive');node._txt.VAL('1 Yes Ok');} else if ( data == false ) {
node.remCls('active');node.remCls('inactive');node._txt.VAL('0 No Fail');} else {
node.remCls('active');node.addCls('inactive');node._txt.VAL('');}
node._state = data;node.C._emitUpdated();return node._state;});clearEvents(node).onclick = function() {
if ( node._state == true ) {
node.val = false;} else if ( node._state == false ) {
node.val = null;} else {
node.val = true;}
return false;}
return node;}
cr.dropdown = function(data, cls, parent, params) {
params = mergeObjects({
limit: 0,customInput: false,noUpdateOnVal: false
}, params);var node = _jO(cr('div', 'jDropdown '+cls, parent));node.lastSelectedNode = false;dispatchOnUpdate(node);node._data = data;node._ddHead = node.cr('div', 'jHead');node._ddBody = node.cr('div', 'jBody');node._ddFilt = node.cr('input', 'jFilt').attr({type:'text'});node._ddnodes    = {};node._ddnodeList = [];node._state      = null;node.C._updData = null;node.C._updFunc = [];node._ddOpened = false;node._curResults = [];node._ddHead.onclick = function() {
node._ddFilt.focus();}
node.directSelect = function() {}
node.oneachstate = function() {}
node._oneachstate = function() {
node.oneachstate(node._state);}
node.F.ddopen  = function() {
if ( node.lastSelectedNode ) { detach(node.lastSelectedNode); }
node.addCls('active');if ( params.customInput ) {
node._ddFilt.val = node._ddHead.val;node._ddHead.val = '';} else {
node._ddHead.val = '';node._ddFilt.val = '';}
node._curResults = domSearch(node._ddnodeList, node._ddFilt.val, null, null, {limit:params.limit,reqValue:params.limit});node._ddOpened = true;node._ddFilt.focus();}
node.F.ddclose = function() {
node.remCls('active');if ( params.customInput ) {
node._ddHead.val = node._ddFilt.val;node._ddFilt.val = '';} else if ( node._ddnodes[node._state] ) {
node._ddFilt.val = '';node._ddHead.innerHTML = '';var anode = node._ddnodes[node._state].cloneNode(true);node._ddHead.attach(anode);node.lastSelectedNode = anode;} else {
node._ddFilt.val = '';node._ddHead.val = '';}
node._ddOpened = false;}
node._ddFilt.onkeyup = function(ev) {
if ( ev.keyCode == 13 ) {
if ( params.customInput ) {
node._ddFilt.blur();} else if ( node._curResults.length > 0 ) {
node._curResults[0].clickOn();}
return false;} else {
node._curResults = domSearch(node._ddnodeList, node._ddFilt.val, null, null, {limit:params.limit,reqValue:params.limit});}
}
node.F.ddBuild = function() {
node._ddnodeList = [];node._ddnodes = {};node._ddBody.innerHTML = '';var iterf = mapO;if ( T(node._data) == T.A ) {
iterf = map;}
iterf(node._data, function(val, key) {
if ( key == 'null' ) { key = null; }
var btn = node._ddBody.cr('div', 'asBtn fa')
if ( typeof(val) == 'string' || typeof(val) == 'number' ) {
btn.VAL(val);} else {
btn.attach(val);}
node._ddnodes[key] = btn;node._ddnodeList.push(btn);btn.selfKey = key;btn.clickOn = function() {
node._ddFilt.blur();node.val = this.selfKey;node.F.runUpdates(node.val, true);node.directSelect(node.val);}
btn.onmousedown = btn.clickOn;});node._oneachstate();}
node.F.runUpdates = function(data, forceUpdate) {
var updateOnVal = forceUpdate || !params.noUpdateOnVal;if ( updateOnVal && node.C._updData != data ) {
node.C._updFunc.map(function(func) {
func(data);});}
}
$P(node, 'val', function() { return node._state; }, function(data) {
if ( data === true ) { data = 'True'; } else if ( data === false ) { data = 'False'; }
if ( params.customInput ) {
node._ddHead.val = data;node._state = data;node.F.runUpdates(data);node._oneachstate();return node._state;}
if ( node._ddnodes[data] ) {
node._ddHead.innerHTML = '';var anode = node._ddnodes[data].cloneNode(true);node._ddHead.attach(anode);node.lastSelectedNode = anode;node._state = data;node.F.runUpdates(data);if ( node._state && node._state != 'None' ) { node.addCls('selected'); } else { node.remCls('selected'); }
node._oneachstate();return node._state;}
node._ddHead.val = '';node._state = null;node._oneachstate();return node._state;});evt(node._ddFilt, 'focus', function() { node.F.ddopen(); });evt(node._ddFilt, 'blur', function() {
node.F.ddclose();if ( params.customInput ) {
node.val = node._ddHead.val;node.directSelect(node.val);} else {
if ( node._curResults.length == 1) {
node._curResults[0].clickOn();} else if ( node.lastSelectedNode ) {
node.lastSelectedNode.remCls('hidden');node._ddHead.attach(node.lastSelectedNode);}
}
});node.F.ddBuild();return node;}
cr.ormdropdown = function(objList, cls, parent, params) {
var reqD = {};map(objList, function(obj) {
reqD[obj.id] = ORM.getFullName(obj);});return cr.dropdown(reqD, cls, parent, params);}
cr.tagline = function(cls, parent) {
var node = dispatchOnUpdate(_jO(cr('div', 'jTagline '+(cls||''), parent)));node.V.inp = node.cr('div','inp').attr({contenteditable: true});node.cr('hr','wClear');node.C.tagb = [];node.__listVal = [];node.clickInt = null;node.state = '';node.F.upd = CEF(function(){ node.C._emitUpdated(node.val); });node.F.newtag = function(name) {
node.__listVal.add(name);var newNode = cr('div','tagb').VAL(name);newNode.cbtn = newNode.cr('div','cbtn');SVG.close(newNode.cbtn);newNode.cbtn.selfName = name;newNode.onclick = function() {
tm(function(){
clearInterval(node.clickInt);});}
newNode.cbtn.onclick = function() {
node.__listVal.remove(this.selfName);node.__listValProc();}
node.C.tagb.push(newNode);insBefore(newNode,node.V.inp);node.F.upd();}
node.__listValProc = function() {
var newData = CO(node.__listVal);var data = node.V.inp.textContent.toLowerCase().split(/[^\wа-яґєії]/g);map(data, function(value) {
var nval = value.rp(/\s+/g,'');if ( nval.length > 1 && !newData.contains(nval) ) { newData.push(nval); }
});node.__listVal = newData;node.V.inp.textContent = '';var testState = parseStr(newData);if ( testState != node.state ) {
map(node.C.tagb, detach);map(newData, node.F.newtag);node.state = testState
}
return newData;}
$P(node, 'val', function() {
return node.__listValProc();}, function(data) {
if ( !def(data) ) { data = ''; }
if ( typeof(data) == 'string' ) {
node.__listVal = [];node.V.inp.textContent = data;node.__listValProc();} else {
node.__listVal = data;node.__listValProc();}
return node.__listVal;});node.onclick = function() {
node.clickInt = tm(function() {
node.V.inp.focus();}, 5);}
node.C.keys = [13,32];node.dellocked = false;node.V.inp.onkeydown = function(ev) {
if ( ev.keyCode == 8 ) {
if ( !node.dellocked && node.V.inp.textContent.length == 0 && node.__listVal.length > 0 ) {
node.__listVal.pop();node.__listValProc();} else {
node.dellocked = true;}
} else if ( node.C.keys.contains(ev.keyCode) ) {
node.__listValProc();}
}
node.V.inp.onkeyup = function(ev) {
node.dellocked = false;}
evt(node.V.inp, 'blur', node.__listValProc);return node;}
SYS.month = parseLS('January,February,March,April,May,June,July,August,September,October,November,December');SYS.wDay  = parseLS('Mon,Tue,Wed,Thu,Fri,Sat,Sun');SYS.calendarRows = 6;cr.dateinput = function(cls, parent) {
var self = _jO(cr('div', 'dateinput-def dateinput '+(cls||''), parent));dispatchOnUpdate(self);var n = newDate();self.F._prepData = function() {
RNG(32).sl([1]).each(function(val) {
self.C.dd[val] = val;});map(SYS.month, function(mStr, ind) {
var tn = cr('span').VAL(PAGE.ld(mStr));tn.cr('span','hidden').VAL(ind+1);tn.cr('span','hidden').VAL(mStr);self.C.mm[ind] = tn;});var st = n.getFullYear();var en = st - 100;for ( var i = st; i > en; i-- ) {
self.C.yy[i] = i;}
}
self.C.dd = {};self.C.mm = {};self.C.yy = {};self.F._prepData();map(['dd','mm','yy'], function(key) {
self.V[key] = cr.dropdown(self.C[key], null, self, {
limit        : 10,noUpdateOnVal: true
});self.V[key].onupdate(function() {
self.C._emitUpdated(self.val);});});self.V.yy.val = n.getFullYear();self.V.mm.val = 0;self.V.dd.val = 1;$P(self, 'val', function() {
var dt = newDate(0);dt.setFullYear(self.V.yy.val);dt.setMonth(self.V.mm.val);dt.setDate(self.V.dd.val);return dt*1;}, function(data) {
var dt = newDate(data);self.V.yy.val = dt.getFullYear();self.V.mm.val = dt.getMonth();self.V.dd.val = dt.getDate();});SYS.test = self;return self;}
cr.calendar = function(cls, parent) {
var self = _jO(cr('div', 'calendar-def calendar '+cls, parent));dispatchOnUpdate(self);self.updateOnVal = false;self.hasValue = false;self.V.head  = self.cr('div','calendar-head');self.V.table = self.cr('table');self.V.left  = self.V.head.cr('div','asBtn');self.V.right = self.V.head.cr('div','asBtn');self.V.month = self.V.head.cr('div','month');var now  = clearTime(new Date());var virtualTime = new Date(now);var iter;var table = self.V.table;self.curDate = now * 1;self.now = now;self.virtualTime = virtualTime;self.iter = iter;self.F.drawMonth = function() {
self.V.month.val = [
PAGE.ld(SYS.month[virtualTime.getMonth()]),virtualTime.getFullYear()
].join(' ');}
self.F.prepTable = function() {
table.innerHTML = '';var row = table.cr('tr','wDay');map(SYS.wDay, function(wdStr) {
row.cr('td').VAL(PAGE.ld(wdStr));});}
self.F.onDraw = function(){};self.F.setDraw = function() {
iter = new Date(virtualTime);iter.setDate(1);iter.setDate(iter.getDay() * -1 + 2);self.F.drawMonth();self.F.prepTable();for ( var rInd = 0; rInd < SYS.calendarRows; rInd++ ) {
var row = table.cr('tr', 'cTime');map(SYS.wDay, function(wdStr) {
var col = row.cr('td','fa');col.val = iter.getDate();if ( iter.getMonth() == virtualTime.getMonth() ) {
col.addCls('curMonth');}
if ( self.hasValue && iter.getMonth() == now.getMonth() && iter.getDate() == now.getDate() ) { col.addCls('curDate'); }
col._val = iter * 1;col.onclick = function() {
self.curDate = this._val;now = new Date(self.curDate);self.hasValue = true;self.F.setDraw();self.C._emitUpdated();}
iter.setDate(iter.getDate()+1);});}
self.F.onDraw();}
SVG.arrLeft (self.V.left );SVG.arrRight(self.V.right);SVG.meshChess.bg(self.V.head, {fill:'rgba(0,0,0,0.1)'});clearEvents(self.V.left).onclick  = function() {
virtualTime.setMonth(virtualTime.getMonth()-1);self.F.setDraw();return false;}
clearEvents(self.V.right).onclick = function() {
virtualTime.setMonth(virtualTime.getMonth()+1);self.F.setDraw();return false;}
self.F.setDraw();$P(self, 'val', function() {
if ( self.hasValue ) {
return self.curDate;}
return null;}, function(val) {
now = new Date(val);self.hasValue = true;if ( !def(val) || now == 'Invalid Date' ) { now = new Date(); self.hasValue = false; }
self.curDate = now*1;virtualTime = new Date(now);self.F.setDraw();if ( self.updateOnVal ) {
self.C._emitUpdated();}
return self.curDate;});return self;}
cr.calendartime = function(cls, parent) {
var self = cr.calendar(cls, parent);self.V.timeBlock = self.cr('div','time-block');self.V.hours = self.V.timeBlock.cr('input').attr({
type:'text', min:0, max:23
}).VAL('00');self.V.timeBlock.cr('div').VAL(':');self.V.minutes = self.V.timeBlock.cr('input').attr({
type:'text', min:0, max:59
}).VAL('00');self.F.fetchTimeItem = function(node, max) {
var val = parseInt(node.val);if ( val == NaN ) {
val = 0;}
val = Math.min(Math.max(val, 0), max);node.val = val.toLen();return val;}
self.F.fetchTime = function() {
var date = new Date(self.curDate);date.setHours(self.F.fetchTimeItem(self.V.hours, 23));date.setMinutes(self.F.fetchTimeItem(self.V.minutes, 59));self.curDate = date * 1;self.now = new Date(self.curDate);self.F.setDraw();self.C._emitUpdated();}
self.F.onDraw = function() {
var date = new Date(self.curDate);self.V.hours.val   = (date.getHours()).toLen();self.V.minutes.val = (date.getMinutes()).toLen();}
self.V.hours.onupdate(self.F.fetchTime);self.V.minutes.onupdate(self.F.fetchTime);return self;}
cr.calendartimeinput = function(cls, parent) {
var self = cr('div', 'calendar-def calendar-input '+cls, parent);self.repr = self.cr('div','calendar-represent');SVG.meshChess.bg(self.repr, {fill:'rgba(0,0,0,0.1)'});self.calendar = cr.calendartime(cls, self);self.fetchVal = function() {
self.repr.val = formatDate(self.calendar.val, true, true, true);}
$P(self, 'val', function() {
return self.calendar.val;}, function(val) {
var t = self.calendar.val = val;self.fetchVal();return t;});$P(self, 'updateOnVal', function() {
return self.calendar.updateOnVal;}, function(data) {
return self.calendar.updateOnVal = data;})
dispatchOnUpdate(self);self.C._updFunc = self.calendar.C._updFunc;self.calendar.onupdate(function() {
self.fetchVal();self.C._emitUpdated();});self.fetchVal();self.repr.onclick = function() {
self.swCls('active');}
return self;}
cr.switcher = function(data, cls, parent) {
data = data || {true:'Yes',false:'No'};var node = cr('div', 'jSwitch fa '+cls||'', parent);dispatchOnUpdate(node);node._swNode = node.cr('div', 'vfa');node.states = {};mapO(data, function(str,val) {
var newNode = node._swNode.cr('div').VAL(str);newNode._selfVal = val;node.states[val] = newNode;});node._keys = okeys(node.states);node._state = node._keys[0];node.F.setVal = function(val) {
val = val || node._state;if ( node.states[val] ) {
node._state = val;node._swNode.style.marginLeft = node._keys.indexOf(val) * -node.offsetWidth + 'px';}
return node._state;}
$P(node, 'val', function() { return node._state; }, function(data) {
return node.F.setVal(data);});clearEvents(node).onclick = function() {
var nInd = node._keys.indexOf(node._state)+1;if ( !node._keys[nInd] ) { nInd = 0; }
node._state = node._keys[nInd];node.F.setVal();node.C._emitUpdated();return false;}
return node;}
var createRequest = function(method, url, f200, fFalse) {
var ajaxRequest = new XMLHttpRequest();f200   = f200   || log;fFalse = fFalse || f200;ajaxRequest.open(method, url, true);ajaxRequest.onreadystatechange = function() {
if (ajaxRequest.readyState == 4) {
LOG.ajax.write(method + ': ' + ajaxRequest.status, url);if ( ajaxRequest.status >= 200 && ajaxRequest.status <= 203 ) {
f200(ajaxRequest.responseText, ajaxRequest);} else {
fFalse(ajaxRequest.responseText, ajaxRequest);}
}
}
return ajaxRequest;}
var postRawData = function(url, data, f200, fFalse, headers) {
var req = createRequest('POST', url, f200, fFalse);if ( def(headers) ) {
mapO(headers, function(val, key) {
req.setRequestHeader(key, val);});}
req.send(data);}
var getRawData = function(url, f200, fFalse) {
var req = createRequest('GET', url, f200, fFalse);req.send();}
var getData = function(url, f200, fFalse) {
f200 = f200||log;fFalse = fFalse||f200;url = ENGINE.path.handler + url;var token = glob('token');if ( def(token) ) {
if ( url.indexOf('?') >= 0 ) {
url += '&token='+token;} else {
url += '?token='+token;}
}
getRawData(url, function(data, resp) {
f200(parseObj(data), resp);}, fFalse);}
var postData = function(url, data, f200, fFalse, headers) {
f200 = f200||log;fFalse = fFalse||f200;data = data||{};if ( typeof(data) == 'object') { data = parseStr(data); }
headers = mergeObjects({
"Content-Type": "application/json"
}, headers);url = ENGINE.path.handler + url;var token = glob('token');if ( def(token) ) {
if ( url.indexOf('?') >= 0 ) {
url += '&token='+token;} else {
url += '?token='+token;}
}
postRawData(url, data, function(data, resp) {
f200(parseObj(data), resp);}, fFalse, headers);}
var getString = function(url, data) {
if ( !data ) { return url; }
var qStr = [];mapO(data, function(val, key) { qStr.push(key+'='+val); })
return url+'?'+qStr.join('&');}
var _createBlankFormPage = function(url, method, data, params) {
params = mergeObjects({
displayParams: 'width=500,height=300'
}, params);var name = params.name || (new Date()*1).toString();var wind = window.open('about:blank', name, params.displayParams)
var formNode = cr('form').attr({
action: url,method: (method||'GET').toUpperCase()
})
attach(formNode, wind.document.body);formNode.insertFields = function(data) {
mapO(data, function(val, key) {
var newString = cr('input', null, formNode).attr({
name: key,value: val
});});}
formNode.insertFields(data);return {window: wind, form: formNode};}
var getPageForm  = function(url, data, params) { return _createBlankFormPage(url, 'GET',  data, params); }
var postPageForm = function(url, data, params) { return _createBlankFormPage(url, 'POST', data, params); }
ENGINE.decPrecision = 9;ENGINE.decMult = Math.pow(10,ENGINE.decPrecision);ENGINE.decDisplay = 5;ENGINE._decDiff = Math.pow(10,ENGINE.decPrecision-ENGINE.decDisplay);function toDec(val, nums) {
nums = nums || ENGINE.decDisplay;var isNegative = (val < 0);if ( isNegative ) { val *= -1; }
var decDiff = Math.pow(10,ENGINE.decPrecision-nums);var val = Math.floor(val);var n = Math.floor(val / ENGINE.decMult);var d = val % ENGINE.decMult;var str = [(isNegative && '-' || '')+n,Math.abs(Math.floor(d/decDiff)).toLen(nums)].join('.');return str;}
extendPrimitive(T.N, 'toDec', function(nums) { return toDec(this, nums); });extendPrimitive(T.S, 'toDec', Number.prototype.toDec );function fromDec(val) {
val = parseFloat(val);var isNegative = ((val < 0) && ( (val *= -1) || true ));var val = val.toString();var pos = val.indexOf('.');var precd = ENGINE.decPrecision;if ( pos != -1 ) {
var tp = val.length - pos - 1;precd -= tp;val = val.rp('.','');}
val = Math.floor(val);if ( isNegative ) { val *= -1; }
return Math.floor(val * Math.pow(10,precd));}
extendPrimitive(T.N, 'fromDec', function(){ return fromDec(this); });extendPrimitive(T.S, 'fromDec', Number.prototype.fromDec );function GCD(a, b) {
if ( ! b) { return a; }
return GCD(b, a % b);};function optDelims(a,b) {
var del = GCD(a,b);if ( del % 1 == 0 ) {
return [a/del, b/del];}
return [a,b];}
function optDelim(x) {
if ( !x ) { return [1,Infinity]; }
x = parseFloat(x);if ( x < 1 ) {
return [1, 1/x];}
return [x, 1];}
function jN(a,b, noopt) {
b = b || 1;if ( !noopt ) {
return findNat(a/b);}
var obj = new T.A(a,b);obj.valueOf = function() {
return this[0]/this[1];}
return obj;}
function parseJN(val, add) {
if ( T(val) == T.N ) {
if ( !def(add) ) { add = 1; }
return jN(val, add);}
return val;}
function findNat(fl) {
for ( var i = 1; i < 1000; i += 1 ) {
var t = fl * i;if ( t % 1 == 0 ) { return jN(t, i, true); }
}
return jN(fl, 1, true);}
var CLASSES = {};function newClass(name, params, func) {
var args = filterArgs('OF', [params,func]);params   = args[0];func     = args[1];CLASSES[name] = function(self, args) {
if ( params.extends ) {
map(parseLS(params.extends), function(pName) {
CLASSES[pName](self, args);});}
args = listToArray(args);args.splice(0,0,self);func.apply(self,args);self.__class = name;return self;}
window[name] = function() {
var obj = _jO({});obj.__extendFrom = function(pName, args) {
CLASSES[pName](obj, args);}
return CLASSES[name](obj, arguments);}
}
function RNG(data) {
var self;var t = T(data);if ( t == null ) {
self = new T.A();} else if ( t == T.A ) {
self = new T.A(data.length);map(data, function(val,k) { self[k] = val; });} else if ( t == T.O ) {
self = objToArray(data);} else if ( t == T.N ) {
self = new T.A(data);for ( var i = 0; i < data; i++) { self[i] = i; }
} else {
self = parseLS(data);}
self.each = function(func) {
return map(self, func);}
self.sl   = function(q) { return RNG(sl(self,q,false)); }
self.SORT = function(q) { return RNG(self.sort(q)); }
self.spl  = function(q) { return RNG(self.splice(q)); }
self.getRandom = function() {
return self[Math.round(Math.random()*self.length)];}
self.filter = function(fd) {
var result = [];if ( T(fd) == T.F ) {
map(self, function(val, key) {
if ( fd(val, key) ) {
result.push(val);}
});} else {
map(self, function(val, key) {
var ch = mapO(fd, function(cv,ck) {
if ( val[ck] != cv ) { return false; }
});if ( ch ) {
result.push(val);}
});}
return RNG(result);}
return self;}
ENGINE.rels = {
parent: {},child: {},available: []
};ENGINE.addRel = function(from, to) {
ENGINE.rels.parent[from] = ENGINE.rels.parent[from] || [];ENGINE.rels.parent[from].add(to);ENGINE.rels.child[to] = ENGINE.rels.child[to] || [];ENGINE.rels.child[to].add(from);ENGINE.rels.available.add(from);ENGINE.rels.available.add(to);}
ENGINE.buildRels = function() {
map(ENGINE.rels.available, function(model) {
var parent_list = ENGINE.rels.parent[model]||[];var child_list  = ENGINE.rels.child[model] ||[];ORM.onModel(model, function(obj) {
map(parent_list, function(m2) {
$P(obj._rel, m2, function() { return ORM.O(m2+'_'+obj[m2+'_id']); });});map(child_list, function(m2) {
var r = {}; r[model+'_id'] = obj.id;$P(obj._rel, m2,  function() { return RNG(ORM.model[m2]).filter(r); });})
});});}
window.CONF = {
engine:  {},object:  {},extend:  {},project: {}
};ENGINE.path.fbpage = null;CONF.engine.dynamicPageSelectors = ".menu,.wrapper:class,.content,footer,.dynb,.canonical:href".split(',');CONF.engine.dynamicPopSelectors  = ".content,.dynb".split(',');CONF.engine.mainContentSelector = ".content";CONF.engine.switchedOffLangs = ['en'];CONF.engine.dynamicPageRetarget = {
exchange: {
pop      : "window",urlMap   : "/pop/".split('/'),selector : [".container"]
}
}
CONF.engine.layer = {
pop: ["/pop/".split('/')]
}
CONF.engine.defaultDomFilterRules = {
available   : 'a,table,tr,td,th,font,ins,img,br,h3,h4,code,blockquote,pre,p,strong,i',stackable   : 'p',textwrap    : 'p',plain       : 'span,nobr',empty       : 'td,img,br',morph       : {
h3      : 'h1,h2',h4      : 'h5,h6',p       : 'div,label,article,body,html,header,footer,li',strong  : 'b',i       : 'em'
},attrs       : {
'p,blockquote' : 'style',a       : 'href',font    : 'color',img     : 'src,alt,width,height,data-imagetype,data-media,data-preview,data-full','td,th' : 'colspan,rowspan'
},styles      : {
'p,blockquote' : 'text-align'
}
}
CONF.engine.articleImage = {
size: {
thumb:   '40x40x2',thumb2:  '120x80x2',preview: '640x360x2'
},type: 'ogimage',startSize: 'preview',thumbSize: 'thumb2'
};CONF.engine.swipeEvents = 'touchstart,touchend,touchcancel,touchleave,touchmove,mousedown,mousemove';CONF.engine.table = {
entitiesPerPage: 30,offsetTop: 65
};CONF.engine.notify = {
timeout: {
def: 3000,red: 6000
}
}
function $AD(obj, path, params) {
params = params || {};if ( !def(obj) ) { return null; }
if ( typeof(path) == 'string' ) { path = path.split('.'); }
if ( path.length > 0 ) {
if ( !def(obj[path[0]]) && def(params.autocreate) ) {
obj[path[0]] = CO(params.autocreate);}
if ( path.length == 1 ) {
if ( params.del ) {
var o = obj[path[0]];delete obj[path[0]];return o;} else if ( def(params.setVal) ) {
obj[path[0]] = params.setVal;}
}
return $AD(obj[path.splice(0,1)[0]], path, params);}
return obj;}
var addressIt = $AD;ENGINE.translits = {
def: function(str) { return str; },url: function(str) {
return str.replace(/[^\w\- ]/g, '').rp(/\-+/g,' ').trim().rp(/\s+/g, '-').toLowerCase();}
}
extendPrimitive(String, 'translit', (function(){
var L = {
'А':'A','а':'a','Б':'B','б':'b','В':'V','в':'v','Г':'G','г':'g','Д':'D','д':'d','Е':'E','е':'e','Ё':'Yo','ё':'yo','Ж':'Zh','ж':'zh','З':'Z','з':'z','И':'I','и':'i','Й':'Y','й':'y','К':'K','к':'k','Л':'L','л':'l','М':'M','м':'m','Н':'N','н':'n','О':'O','о':'o','П':'P','п':'p','Р':'R','р':'r','С':'S','с':'s','Т':'T','т':'t','У':'U','у':'u','Ф':'F','ф':'f','Х':'Kh','х':'kh','Ц':'Ts','ц':'ts','Ч':'Ch','ч':'ch','Ш':'Sh','ш':'sh','Щ':'Sch','щ':'sch','Ъ':'"','ъ':'"','Ы':'Y','ы':'y','Ь':"'",'ь':"'",'Э':'E','э':'e','Ю':'Yu','ю':'yu','Я':'Ya','я':'ya'
},r = '',k;for (k in L) r += k;r = new RegExp('[' + r + ']', 'g');k = function(a){
return a in L ? L[a] : '';};return function(type){
var result = this.replace(r, k);return (ENGINE.translits[type] || ENGINE.translits.def)(result);};})());function $F(str, data) {
return str.replace(/{([a-z0-9\._\-\[\]]+)}?/gi, function(match, address) {
log(address);return $AD(data, address);});}
ENGINE._clear     = [];ENGINE._clearOnce = [];ENGINE.clear = function() {
map(ENGINE._clear, function(func, index) {
if ( !def(func) ) {
ENGINE._clear.splice(index,1);return ENGINE.clear();}
func();});map(ENGINE._clearOnce, function(func) {
func();});ENGINE._clearOnce = [];};CONF.engine.dynamicPageRetarget = CONF.engine.dynamicPageRetarget || {};ENGINE.getUrlData = function(url) {
var urlMap = url.split('/');var result = {
url: '',own: false
};if ( url.indexOf('http') == 0 ) {
if ( url.indexOf(ENGINE.path.page) == 0 ) { result.own = true; }
result.url = url;} else if( urlMap.length > 1 && !urlMap[0].contains('.') ) {
result.own = true;if ( url[0] != '/' ) { url = '/'+url; }
result.url = ENGINE.path.page+url;} else {
result.url = 'http://'+url;}
result.map = result.url.split('/');result.map[0] = result.map[0].rp(':','');result.map.splice(1,1);var t = result.map[result.map.length-1];t = t.split('?')[0];result.map[result.map.length-1] = t.split('#')[0];mapO(CONF.engine.dynamicPageRetarget, function(rules, key) {
if ( map(rules.urlMap, function(urlPart, i) {
if ( urlPart.length > 0 && urlPart != result.map[i] ) { return false; }
}) ) {
result.retarget = key;}
});result.query  = getQuery(result.url);result.anchor = getQuery(result.url, '#', null);return result;}
ENGINE.modLink = function(url) { return ENGINE.getUrlData(url).url; }
window.onpopstate = function(ev) {
var newUrl = ENGINE.modLink(window.location.pathname)+(window.location.hash||'');LM.go(newUrl, null, {noHistory:true});}
ENGINE.gaBlocked = false;ENGINE.apiPageWork = function() {
if ( !ENGINE.gaBlocked && window.ga ) {
map(S('script'), function(scr) {
var att = scr.attr('src');if ( att && (att.contains('pagead2.googlesyndication.com') || att.contains('an.yandex.ru')) ) {
scr.detach();}
});for ( var key in window ) {
var pkey = key.toLowerCase();if ( pkey.indexOf('google') >= 0 || pkey.indexOf('yandex') >= 0 ) { delete window[key]; }
}
delete window.yandex_context_callbacks;gss = cr('script').attr({
async : 'true'
});gss.className = 'gss';gss.src = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';document.body.attach(gss);window.ga.l = new Date()*1;window.ga.q = [];ga('send', 'pageview', {
'page': PAGE.url,'title': document.title
});LOG.ga.write('pageview',PAGE.url);ENGINE.gaBlocked = true;tm(function() { ENGINE.gaBlocked = false; }, 1000);}
try {
FB.XFBML.parse(null, function() {
EVENT.emit('resize');});} catch(err) {}
}
ENGINE.domFilter = function() {
var self = _jO(this);self.init = function() {
self.rules       = CO(CONF.engine.defaultDomFilterRules);self.C.available = parseLS(self.rules.available);self.C.stackable = parseLS(self.rules.stackable);self.C.plain     = parseLS(self.rules.plain);self.C.inline    = parseLS(self.rules.inline);self.C.empty     = parseLS(self.rules.empty);self.C.attrs     = lsMapToDict(self.rules.attrs);self.C.morph     = reverseLSDict(self.rules.morph);self.C.styles    = lsMapToDict(self.rules.styles);self.C.textwrap  = self.rules.textwrap;}
self.process = function(dom) {
self.firstProcess(dom);self.doProcess(dom);var c = 6;for ( ; c > 0; c-- ) {
self.doProcess(dom);}
}
self.firstProcess = function(dom) {
map(dom.childNodes, function(node) {
if ( node._tag ) {
if ( node.nodeType == 3 || !self.C.stackable.contains(node._tag) ) {
var newNode = cr(self.C.textwrap);insBefore(newNode, node);newNode.attach(node);}
}
});}
self.doProcess = function(dom) {
if ( dom._domFilterBlocked ) { return 0; }
var lastTextContainer = null;map(dom.childNodes, function(node) {
if ( def(node) && !node._domFilterBlocked ) {
if ( node.nodeType == 3 || (node._tag && self.C.inline.contains(node._tag)) ) {
if ( lastTextContainer ) {
if ( node.nodeType == 1 ) {
lastTextContainer.innerHTML += node.outerHTML;} else {
lastTextContainer.textContent += node.textContent;}
detach(node);} else {
if ( node.nodeType == 3 ) {
lastTextContainer = setTag(node, self.C.textwrap, {
cls:  false,attr: false
});} else {
lastTextContainer = cr(self.C.textwrap);insBefore(lastTextContainer, node);lastTextContainer.attach(node);}
}
} else {
lastTextContainer = null;self._process(node);}
} else {
lastTextContainer = null;}
});map(getChildren(dom), function(node) {
self._optimise(node, true);});}
self._optimise = function(dom) {
if ( dom._domFilterBlocked ) { return 0; }
if ( !self.C.empty.contains(dom._tag) ) {
map(getChildren(dom), function(node) {
if ( self.C.stackable.contains(node._tag) ) {
insBefore(node, dom);}
self._optimise(node);});if ( !self.C.empty.contains(dom._tag) && getChildren(dom).length == 0 && dom.textContent.length == 0 ) {
detach(dom);}
}
}
self._process = function(dom) {
if ( !dom || dom._domFilterBlocked ) { return 0; }
if ( self.C.plain.contains(dom._tag) ) {
dom = setTag(dom);} else if ( def(self.C.morph[dom._tag]) ) {
dom = setTag(dom, self.C.morph[dom._tag]);} else if ( !self.C.available.contains(dom._tag) ) {
detach(dom);return null;}
var avAttrs = self.C.attrs[dom._tag]||[];if ( dom.attributes ) {
mapO(dom.attributes, function(attr) {
if ( attr && attr.name && !avAttrs.contains(attr.name) ) {
dom.removeAttribute(attr.name);}
});}
if ( self.C.styles[dom._tag] ) {
var list = parseLS(self.C.styles[dom._tag]);var result = [];var attrs = dom.attr('style');map(list, function(stl) {
var reg = new RegExp(["(;| |^)",":([^\\;]+)\\;"].join(stl));var val = reg.exec(attrs);if ( val && val[2] ) {
result.push([stl,val[2]].join(':'));}
});if ( result.length > 0 ) {
dom.attr({style:result.join(';')+';'});} else {
dom.removeAttribute('style');}
}
map(listToArray(dom.childNodes), function(node) {
if ( node._tag ) {
self._process(node);} else {
node.val = node.val.rp(/\u00a0/g,' ');}
});}
self.init();}
window.domFilter = new ENGINE.domFilter().process;function domSwipe(dom, data) {
var self = this;self.init = function() {
self.data = mergeObjects({
start   : function(x,y){},move    : function(x,y){},end     : function(x,y){},cancel  : function(x,y){},leave   : function(x,y){},startx  : function(x,y){},movex   : function(x,y){},endx    : function(x,y){},cancelx : function(x,y){},leavex  : function(x,y){},starty  : function(x,y){},movey   : function(x,y){},endy    : function(x,y){},cancely : function(x,y){},leavey  : function(x,y){},precision: null
}, data);self.has = {
x: (data.startx || data.movex || data.endx || data.cancelx || data.leavex) && true || false,y: (data.starty || data.movey || data.endy || data.cancely || data.leavey) && true || false
}
self.dimData = mergeObjects({
startx  : null,movex   : null,endx    : null,cancelx : null,leavex  : null,starty  : null,movey   : null,endy    : null,cancely : null,leavey  : null
}, data);self.precision  = self.data.precision || (ENGINE.isMOB && 20 || 50);self._initPos   = [0,0];self._startPos  = [0,0];self._curPos    = [0,0];self._relPos    = [0,0];self._touches   = [];self._dragging  = false;self._dragMouse = false;self.swipeInd   = 0;$P(self, 'swipeDirection', function() { return self.swipeInd && 'y' || 'x'; });self.dispatchEvents();ENGINE._clearOnce.add(self.clearEvents);}
self.dispatchEvents = function() {
map(parseLS(CONF.engine.swipeEvents), self._registerDefaultEvent);evt(document, 'mouseup', self.domouseup);}
self.clearEvents = function() {
map(parseLS(CONF.engine.swipeEvents), self._clearDefaultEvent);evtDel(document, 'mouseup', self.domouseup);}
self._registerDefaultEvent = function(event) { evt   (dom, event, self['do'+event]); }
self._clearDefaultEvent    = function(event) { evtDel(dom, event, self['do'+event]); }
self._evParser = function(ev, func) {
if ( SYS._edit ) { return false; }
if ( self._dragging && self.has[self.swipeInd] ) { ev.preventDefault(); }
self._touches = ev.changedTouches;if ( self._touches.length == 1 ) {
func(self._touches[0]);}
}
self.dotouchstart  = function(ev) { self._evParser(ev, self._touchstart); }
self.dotouchmove   = function(ev) { self._evParser(ev, self._touchmove); }
self.dotouchend    = function(ev) { self._evParser(ev, self._touchend); }
self.dotouchcancel = function(ev) {}
self.dotouchleave  = function(ev) {}
self._descEvParser = function(ev, func) {
if ( SYS._edit ) { return false; }
ev.preventDefault();func({pageX:ev.clientX,pageY:ev.clientY});}
self.domousedown = function(ev) {
self._dragMouse = true;self._descEvParser(ev, self._touchstart);}
self.domousemove = function(ev) {
if ( self._dragMouse ) {
self._descEvParser(ev, self._touchmove);}
}
self.domouseup = function(ev) {
if ( self._dragMouse ) {
self._descEvParser(ev, self._touchend);self._dragMouse = false;}
}
self._touchstart = function(touch) {
self._initPos  = [touch.pageX, touch.pageY];self._startPos = [touch.pageX, touch.pageY];self._curPos   = [touch.pageX, touch.pageY];}
self._touchmove = function(touch) {
self._curPos   = [touch.pageX, touch.pageY];if ( self._dragging ) {
self._relPos   = [self._curPos[0] - self._startPos[0], self._curPos[1] - self._startPos[1]];self.data['move'+self.swipeDirection](self._curPos, self._relPos);self.data.move(self._curPos, self._relPos);} else {
if (        Math.abs(self._curPos[0] - self._initPos[0]) >= self.precision ) {
self.swipeInd = 0;self._startPos = [touch.pageX, touch.pageY];self._relPos   = [0,0];self._dragging = true;self.data.startx(self._curPos, self._relPos);self.data.start(self._curPos, self._relPos);} else if ( Math.abs(self._curPos[1] - self._initPos[1]) >= self.precision ) {
self.swipeInd = 1;self._startPos = [touch.pageX, touch.pageY];self._relPos   = [0,0];self._dragging = true;self.data.starty(self._curPos, self._relPos);self.data.start(self._curPos, self._relPos);}
}
}
self._touchend = function(touch) {
self._curPos   = [touch.pageX, touch.pageY];self._relPos   = [self._curPos[0] - self._startPos[0], self._curPos[1] - self._startPos[1]];self.data['end'+self.swipeDirection](self._curPos, self._relPos);self.data.end(self._curPos, self._relPos);self._dragging = false;}
self._touchcancel = function(touch) {}
self._touchleave  = function(touch) {}
self.init();}
function CEF(func, tm) {
tm = Math.max(tm||0, 0);var int = null;var args = [];var fl = false;var newFunc = function() {
args = arguments;if ( fl ) { return 0; }
clearInterval(int);int = setTimeout(function() { func.apply(func,args); fl = false; }, tm);fl = true;}
return newFunc;}
function closeOnClick(node, ignore, hideFunc) {
if ( !node ) { return null; }
hideFunc = hideFunc || detach;var int = null;ignore = ignore || [];ignore.push(node);var close = function() {
hideFunc(node);evtDel(document.body, 'click'     , closeEv);evtDel(document.body, 'touchstart', closeEv);}
var closeEv = function() { int = tm(close, 10); }
var prevent = function() { tm(function() { clearInterval(int); }); }
evt(document.body, 'click'     , closeEv);evt(document.body, 'touchstart', closeEv);map(ignore, function(elem) {
evt(elem, 'click'     , prevent);evt(elem, 'touchstart', prevent);});return node;}
SYS.notArea = cr('div','notify-area');tm(function() {
document.body.attach(SYS.notArea);});SYS.bareNotifyObj = function(str, cls) {
var newNode = SYS.notArea.cr('div','notify fa closed '+cls);var t = T(str);if ( t == T.S || t == T.N ) {
newNode.val = str;} else {
newNode.attach(str);}
newNode._close = function() {
newNode.addCls('closed');tm(function() {
newNode.detach();}, 260)
}
tm(function() { newNode.remCls('closed'); }, 10);return newNode;}
SYS.notify = function(str, cls) {
cls = cls || 'def';var conf = CONF.engine.notify.timeout;var newNode = SYS.bareNotifyObj(str, cls);tm( newNode._close, (conf[cls]||conf.def));newNode.onclick = newNode._close;}
SYS.success = function(str) { SYS.notify([PAGE.ld('Success'),PAGE.ld(str)].join(' '),'center green'); }
SYS.fail    = function(str) { SYS.notify([PAGE.ld('Fail'),   PAGE.ld(str)].join(' '),'center red'); }
SYS.error   = function(str) { SYS.notify([PAGE.ld('Error'),  PAGE.ld(str)].join(' '),'center red'); }
SYS.confirm = function(str, cls, func) {
if ( T(cls) == T.F ) {
func = cls;cls = 'def';}
cls = cls || 'def';func = func || function(){};var newNode = SYS.bareNotifyObj(str, cls);var optsNode = newNode.cr('div','opts');var bPos = optsNode.cr('div','asBtn half first' ).VAL(PAGE.ld('Ok'));var bNeg = optsNode.cr('div','asBtn half second').VAL(PAGE.ld('Cancel'));bPos.onclick = function() { func(); newNode._close(); }
bNeg.onclick = newNode._close;}
SYS.alert = function(str, cls, func) {
if ( T(cls) == T.F ) {
func = cls;cls = 'def';}
cls = cls || 'def';func = func || function(){};var newNode = SYS.bareNotifyObj(str, cls);var optsNode = newNode.cr('div','opts');var bPos = optsNode.cr('div','asBtn').VAL(PAGE.ld('Ok'));bPos.onclick = function() { func(); newNode._close(); }
}
SYS.input = function(str, cls, func, params) {
params = mergeObjects(getEnv(this), params);if ( T(cls) == T.F ) {
func = cls;cls = 'def';}
cls = cls || 'def';func = func || function(){};params = mergeObjects({
validator: function(){return true;},init:function(){},val: ''
}, params);var newNode = SYS.bareNotifyObj(str, cls);var optsNode = newNode.cr('div','opts');var inp = optsNode.cr('input').attr('type','text').VAL(params.val);var bPos = optsNode.cr('div','asBtn half first' ).VAL(PAGE.ld('Ok'));var bNeg = optsNode.cr('div','asBtn half second').VAL(PAGE.ld('Cancel'));params.init(newNode, inp, bPos);bPos.onclick = function() {
if ( params.validator(inp) ) {
func(inp.val); newNode._close();}
}
bNeg.onclick = newNode._close;}
window.PARSE = {};function eParse(name, data) {
var self   = this;self.model = PARSE;self.init = function() {
self.data = mergeObjects({
parse: function(data){ return data; }
}, data);PARSE[name] = self.data.parse;}
self.init();}
window.PROTOCOL = {};ENGINE.protocolData = {};function eProtocol(name, data, parent) {
var self   = this;self.model = PROTOCOL;self.init = function() {
if ( def(parent) ) {
self.data = mergeObjects(ENGINE.protocolData[parent], data);} else {
self.data = mergeObjects({
method: 'post',prefix: '_handler',headers:{},write: function(self){},read: function(self) {}
}, data);}
self.reqester = window[self.data.method+'RawData'] || postRawData;ENGINE.protocolData[name] = self.data;PROTOCOL           [name] = self;}
self.write = function() {
var data = listToArray(arguments);data.splice(0,0,self);self.data.write.apply(self, data);}
self.read = function() {
var data = listToArray(arguments);data.splice(0,0,self);self.data.read.apply(self, data);}
self.doReq = function(url, data, pFunc) {
LOG.ajax.write(name+': ', data, {format:'obj'});self.reqester(url, data, pFunc, log, self.data.headers);}
self.init();}
window.SVG = {
_static: {
part1: '<svg version="1.1" viewBox="0 0 ',part2: '>',part3: '</svg>',part1Bg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ',part0Bg: 'data:image/svg+xml;base64,'
},_obj: {},clear: function(node) {
node.innerHTML = '';},clearBg: function(node) {
node.style.backgroundImage = '';}
};function eSvg(name, content, data) {
var self   = this;self.model = SVG;self.init = function() {
self.data = mergeObjects({
size: '40x40',params: {}
}, data);self.size = self.data.size.split('x');var dataMap = self.build(self.data.params);self.paramsString = dataMap[0];self.svgHtml   = dataMap[1];self.svgCss    = dataMap[2];SVG[name]      = self.clone;SVG[name].bg   = self.bgClone;SVG._obj[name] = self;}
self.build = function(params) {
var pString = [];mapO(params, function(val, key) {
pString.push([' ',key,'="',val,'"'].join(''));});pString = pString.join('');var html = [SVG._static.part1,  self.size[0],' ',self.size[1],'"',pString,SVG._static.part2,content,SVG._static.part3].join('');var css  = [SVG._static.part1Bg,self.size[0],' ',self.size[1],'"',pString,SVG._static.part2,content,SVG._static.part3].join('');css = ['url(',SVG._static.part0Bg, btoa(css),')'].join('');return [pString, html, css];}
self.clone = function(target, params) {
target = target || cr('div');if ( def(params) ) {
var dataMap = self.build(params);target.innerHTML = dataMap[1];} else {
target.innerHTML = self.svgHtml;}
return target;}
self.bgClone = function(target, params) {
target = target || cr('div');if ( def(params) ) {
var dataMap = self.build(params);target.style.backgroundImage = dataMap[2];} else {
target.style.backgroundImage = self.svgCss;}
return target;}
self.init();}
window.LOG          = {};ENGINE.logPrefix    = 'log_';ENGINE.logMaxLength = 50;function eLog(name, maxLength) {
var self   = this;self.model = LOG;self.init = function() {
self.fullName = ENGINE.logPrefix+name;maxLength     = maxLength || ENGINE.logMaxLength;self.load();LOG[name] = self;}
self.save = function() {
self.cont.splice(0, Math.max(self.cont.length - maxLength, 0) );glob(self.fullName, parseStr(self.data));}
self.load = function() {
if ( def(glob(self.fullName)) ) {
try {
self.data = JSON.parse(glob(self.fullName));} catch(err) {
self.data = {
cont: [],tail: false
};}
} else {
self.data = {
cont: [],tail: false
};}
self.cont = self.data.cont;}
self.write = function(key, data, params) {
params = params||{};var line = [new Date()*1, key, data, params];self.cont.push(line);self.save();if ( self.data.tail ) { self._printLine(line); }
}
self.read = function(lines) {
var logList = self.cont;if ( def(lines) ) {
logList = self.cont.slice(self.cont.length-lines);}
map(logList, self._printLine);}
self._printLine = function(line) {
line[2] = line[2]||'';if ( line[3].format == 'obj' ) {
console.log(formatDate(line[0], true), line[1], parseObj(line[2]));} else {
console.log(formatDate(line[0], true), line[1], line[2]);}
}
self.setTail = function(data) {
self.data.tail = data;self.save();}
self.init();}
window.SUBPROGRAM = {};function eSubprogram(name, func) {
var self   = this;self.model = SUBPROGRAM;self.init = function() {
self.program = func||function(){};SUBPROGRAM[name] = func;}
self.init();}
window.STORAGE = {}
function eStorage(name, data, links) {
var self   = this;self.model = STORAGE;self.init = function() {
self.data = mergeObjects({
cache:   false,store: function(self, key, data) {
self.cont[key] = data;return key;},sharedWith: self
}, data);links = parseLS(links);map(links, function(link) {
var ref = self.data[link];self[link] = function() {
return ref.apply(self, [self].concat(listToArray(arguments)));}
})
self.cont   = self.data.sharedWith.cont||{};self.event  = self.data.sharedWith.event||{};self.gevent = self.data.sharedWith.gevent||[];self.cache  = self.data.sharedWith.cache||{};STORAGE[name] = self;ENGINE._clear.add(self.clear);}
self.clear = function() {
self.event  = {};self.gevent = [];self.cache  = {};}
self.storePriv = function(model, id, data, isDynamic) {
var oid = self.data.storePriv(self, model, id, data);self._store(oid, oid, data, isDynamic);}
self.store = function(key, data, isDynamic) {
var oid = self.data.store(self, key, data);self._store(oid, key, data, isDynamic);}
self._store = function(oid, key, data, isDynamic) {
if ( def(self.event[oid]) ) {
map(self.event[oid], function(func) {
func(self.cont[oid]);});}
map(self.gevent, function(func) {
func(self.cont[oid]);});return 0;var strData = parseStr(data);if ( self.cache[key] != strData ) {
if ( def(self.event[oid]) ) {
map(self.event[oid], function(func) {
func(self.cont[oid]);});}
map(self.gevent, function(func) {
func(self.cont[oid]);});}
self.cache[key] = strData;}
self.O = function(reqst) {
if ( self.data.O ) { return self.data.O(self, reqst); }
return self.cont[reqst];}
self.onStore = function(key, func) {
if ( def(func) ) {
self.event[key] = self.event[key]||[];self.event[key].push(func);} else {
func = key;self.gevent.push(func);}
}
self.setView = function(key, view) {
if ( def(view.C.reinit) ) {
self.event[key] = self.event[key]||[];self.event[key].push(function(data) {
view.C.reinit(data);});}
}
self.init();}
window.LAYER = {};SYS.globalUrlModification = function(url){return url;}
ENGINE.lastLayerUrl = null;function eLayer(name, data) {
var self   = this;self.model = LAYER;self.init = function() {
self.data = mergeObjects({
dom: cr('div'),select: ['.dynamicBlock'],parent: null,parentUrl: function() { return '/'; },hide: function() {},getData   : function(self, url, func, params) {
getRawData(url, function(html) {
var domFilter = cr('div');domFilter.innerHTML = html;self.data.parseDom(self, domFilter, url, func, params);});},parseDom : function(self, domFilter, url, func, params) {
self.data.fetchLang(self, domFilter);self.data.fetchSelection(self, domFilter);if ( !params.noHistory ) {
self.data.fetchHistory(self, url);}
if ( func ) { func(); }
},fetchLang : function(self, dom) {
var locsFrom = S('.relLoc', dom);var locsTo   = S('.relLoc', self.dom);if ( locsTo.length > 0 ) {
map(locsFrom, function(node) {
insBefore(node, locsTo[0]);});} else {
map(locsFrom, function(node) {
self.attachHead.attach(node);});}
map(locsTo, detach);},fetchSelection: function(self, domFilter) {
self.title = S('title', domFilter)[0].val;map(self.data.select, function(selector) {
var selMap = selector.split(':');selector = selMap.splice(0,1)[0];var attrs = selMap;var list_from = S(selector, domFilter);var list_to   = S(selector, self.data.dom);map(list_to, function(to, index) {
var from = list_from[index];if ( from ) {
var from_ver = from.attr('data-version');var to_ver   = to.attr('data-version');if ( selector == '.canonical' && from._tag == 'link' && to._tag == 'meta' ) {
var newNode = cr('link', 'canonical').attr({rel:'canonical'});to.insBefore(newNode);to.detach();to = newNode;}
if ( !def(from_ver) || !def(to_ver) || from_ver != to_ver ) {
if ( def(attrs) && attrs.length > 0 ) {
map(attrs, function(attrb) {
to.attr(attrb, from.attr(attrb));});} else {
to.innerHTML = from.innerHTML;to.className = from.className + ' fa';}
to.attr('data-version', from_ver);if ( def(to.C) && def(to.C.processors) ) {
to.C.processors = {};}
}
} else {
to.innerHTML = '';}
});});},fetchHistory: function(self, url) {
document.title = self.title;setDocumentScroll();PAGE.url = url;ENGINE.lastLayerUrl = url;var durl = url;history.pushState({
selfUrl: url
}, document.title, durl);},ontravel: function(){}
}, data);self.name = name;self.dom = self.data.dom;self.attachHead = self.dom;self.attachBody = self.dom;if ( self.attachHead == document || self.attachHead == window ) {
self.attachHead = document.head;self.attachBody = document.body;}
self._setUrl();LAYER[name] = self;}
self._setUrl = function(url) {
self.url = ENGINE.getUrlData(url||window.location.href)
}
self.fetchHistory = function() {
if ( ENGINE.lastLayerUrl != self.url.url ) {
ENGINE.lastLayerUrl = self.url.url;self.data.fetchHistory(self, self.url.url);}
}
self.rememberHistory = function() {
self.title = S('title')[0].val;self._setUrl();}
self.go = function(url, func, params) {
params = mergeObjects({
noHistory : false
},params);if ( !url ) {
self.fetchHistory();} else {
EVENT.emit('togo', {
path: url,layer: self,params: params
});self.urlData = ENGINE.getUrlData(url);self.data.getData(self, self.urlData.url, function() {
self.url = self.urlData;self.data.ontravel(self);if ( def(func) ) { func(); }
EVENT.emit(['go',name].join('.'), {
path: url,layer: self,params: params
});EVENT.emit('insert');}, params);}
}
self.init();}
CONF.engine.layer = CONF.engine.layer || {};function layerManager() {
var self = this;self.init = function() {
}
self._getLayer = function(url) {
var layer = LAYER.main;var urlMap = ENGINE.getUrlData(url).map;mapO(CONF.engine.layer, function(patterns, key) {
map(patterns, function(pattern) {
var isPat = map(pattern, function(urlPart, i) {
if ( urlPart.length > 0 && urlPart != urlMap[i] ) { return false; }
});if ( isPat ) {
layer = LAYER[key];return false;}
});})
return layer;}
self.go = function(url, func, params) {
url = SYS.globalUrlModification(url||window.location.href);params = params||{};var layer = self._getLayer(url);layer.go(url, func, params);if ( !params.noHide ) {
mapO(LAYER, function(l) {
if ( l != layer ) { l.data.hide({type:'go'}); }
});}
}
self.recognisePos = function() {
var layer = self._getLayer(window.location.href);layer.rememberHistory();layer.data.parseDom(layer, document, layer.url.url, function() {
}, {noHistory:true});return layer;}
self.fetchPos = function(func) {
func = func || new T.F();var layer = self.recognisePos();if ( layer.data.parent ) {
var parent = LAYER[layer.data.parent];var parentUrl = SYS.globalUrlModification(layer.data.parentUrl(window.location.href));parent.go(parentUrl, function() {
layer.data.ontravel(layer);func();}, {noHistory:true,noHide:true})
} else {
func();}
}
self.init();}
window.LM = new layerManager();window.VALIDATOR = {};function eValidator(name, data, isCustom) {
var self = this;self.model = VALIDATOR;self.init = function() {
if ( isCustom ) {
VALIDATOR[name] = function() {
return data.apply(self, [self].concat(listToArray(arguments)));}
} else if ( typeof(data) == 'function' ) {
VALIDATOR[name] = function(node) {
return self.run(node, data);}
} else if ( typeof(data) == 'object' && data.constructor == RegExp ) {
VALIDATOR[name] = function(node) {
return self.run(node, function(val) { return data.test(val); });}
}
}
self.runSingle = function(elem, func) {
if ( func(elem.val) ) {
remCls(elem, 'notValid');addCls(elem, 'isValid');return true;} else {
remCls(elem, 'isValid');addCls(elem, 'notValid');return false;}
}
self.run = function(target, func) {
target.onkeyup = function() { self.runSingle(this, func); }
return self.runSingle(target, func);}
self.init();}
window.VIEW = {};window.HTML = {};function eView(name, params, parent) {
var self = this;self.model = VIEW;params = params||{};params.create = params.create||function(block){ return block; }
self._generate = function(block) {
if ( def(parent) ) {
block = VIEW[parent]._generate(block);}
return params.create(block);}
self.generate = function(func) {
var block = self._generate();if ( def(params.init) ) { func(block); }
return _jO(block);}
self.req = function(oid, hard) {
return self.generate(function(block) {
ORM.O(oid, function(obj) {
params.init(block, obj);ENGINE.processDom(block);}, hard);});}
self.build = function(obj) {
return self.generate(function(block) {
block.C.reinit = function(data) {
params.init(block, data);ENGINE.processDom(block);}
block.C.reinit(obj);});}
self.clone           = self.build;self.clone._generate = self._generate;self.clone.req       = self.req;VIEW[name] = self.clone;}
function eHtml(name, html, data) {
var self = this;self.model = HTML;html = html||'';data = data||{};self.generate = function(block) {
_jO(block).innerHTML = html;block.V = mergeObjects(block.V, selectorMapping(block, data));return block;}
HTML[name] = self.generate;}
window.POP = {};ENGINE.popMap = [];function ePop(popName, cls, data, parent) {
var self = _jO(this);self.model = POP;self._createDom     = function(self) {
self.block      = cr('div', self.data.parentCls);self.V.cont     = self.block.cr('div', self.pcls );self.C.contElem = cr('div');}
self.init = function() {
self.pcls = 'pop-cont '+(cls||'');var defaultData = {
createDom:     self._createDom,parentCls:     'fullscreen popBg fa',alwaysPersist: false,oncreate:      function(){},onshowstart:   function(){},onshow:        function(){}
};if ( def(POP[parent]) ) {
defaultData = mergeObjects(defaultData, POP[parent].data);}
data = mergeObjects(defaultData, data);self.data = data;}
self.initDom = function() {
self.data.createDom(self);self.data.oncreate(self);if ( self.data.domInit ) { self.data.domInit(self); }
self.C.int = null;self.block.onclick = function() {
if ( !self.data.alwaysPersist && !self.isBlocked ) {
self.C.int = tm(self.hide, 10);}
}
self.V.cont.onclick = function() {
tm(function() {
clearInterval(self.C.int);});}
}
self.showNew = function(node, persistent, rdata) {
rdata = rdata||{};var newInst = new ePop(null, cls, data);newInst.show(node, persistent, rdata);return newInst;}
self.show = function(node, persistent, rdata) {
self.isBlocked = persistent||false;if ( node._currentPop ) {
node._currentPop.hide();}
node._currentPop = self;ENGINE.popMap.add(node);self.rdata = rdata || {};if ( typeof(node) == 'string' ) {
self.show(VIEW[node](rdata), persistent, rdata);return 0;}
if ( !def(self.block) ) { self.initDom(); }
self.data.onshowstart(self, rdata);self.C.contElem.detach();self.C.contElem = node;self.V.cont.attach(node);self.block.addCls('closed');document.body.attach(self.block);tm(function() {
self.block.remCls('closed');if ( def(node.popFocusOn)) {
node.popFocusOn.focus();}
}, SYS.animDelay);self.data.onshow(self, rdata);}
self.hide = function(params) {
params = params || {};if ( self.C.contElem ) {
self.C.contElem._currentPop = null;ENGINE.popMap.remove(self.C.contElem);if ( !params.noOnHide && self.C.contElem._onpopclose ) {
self.C.contElem._onpopclose();}
}
if ( self.block ) {
self.block.detach();}
}
if ( popName ) {
window.POP[popName] = self;}
self.init();}
window.ADAPTER = {
selectable: {}
};function eAdapter(name, data) {
var self   = this;self.model = ADAPTER;self.init = function() {
self.data = mergeObjects({
process: function(){},selector: null
}, data);if ( def(self.data.selector) ) {
ADAPTER.selectable[self.data.selector] = ADAPTER.selectable[self.data.selector] || [];ADAPTER.selectable[self.data.selector].push(self);}
ADAPTER[name] = self;}
self.process = function(node) {
_jO(node);node.__adapted = node.__adapted || [];if ( !node.__adapted.contains(name) ) {
self.data.process.apply(self, [self].concat(listToArray(arguments)) );node.__adapted.push(name);}
return node;}
self.init();}
window.PROCESSOR = {};window.ENGINE.processorPrefix = 'pr_';function eProcessor(actor, data) {
var self   = this;self.model = PROCESSOR;self.init = function() {
self.data = mergeObjects({
process:       function(){},selector:      '.'+ENGINE.processorPrefix+actor,onreleace:     function(){},onprocessed:   function(){},singleProcess: true
}, data);window.PROCESSOR[actor] = self;}
self.process = function(dom) {
_jO(dom);dom.C.processors = dom.C.processors||{};if ( !dom.C.processors[actor] || !dom.C.processors[actor].data.singleProcess ) {
dom.C.processors[actor] = self;self.data.process(dom, self.data);EVENT.emit('processed.'+actor, dom);}
}
self.onDone = function() {
self.data.onprocessed(self.data);}
self.init();}
ENGINE.processDomQueue = [];ENGINE.processDom = function(dom) {
dom = dom||document;map(ENGINE.processDomQueue, function(func) { func(); });mapO(PROCESSOR, function(processor) {
map(S(processor.data.selector, dom), processor.process);})
mapO(ADAPTER.selectable, function(list, selector) {
map(S(selector, dom), function(node) {
map(list, function(item) {
item.process(node);});});})
}
ENGINE.processDomFinish = function(dom) {
mapO(PROCESSOR, function(processor) {
processor.onDone();})
}
new eLog('event', 200);window.EVENT = {
data: {}
};window.EVENT.inst = {};window.EVENT.global = {};window.EVENT._on = {};window.EVENT.on   = function(name, func, persist) {
if ( !def(EVENT._on[name]) ) {
EVENT._on[name] = [];if ( !persist ) {
ENGINE._clear.add(function() {
EVENT._on[name] = [];});}
}
EVENT._on[name].add(func);}
window.EVENT.emit = function(gotName, data) {
if ( gotName ) { LOG.event.write('emit',gotName); }
var nameMap = gotName.split('.');for ( var i = nameMap.length; i > 0; i-- ) {
var name = nameMap.sl([0, i]).join('.');if ( EVENT._on[name] ) {
map(EVENT._on[name], function(func) { func(data); });}
}
}
function eEvent(actor, data, oninit) {
data       = data||{};var self   = this;self.model = EVENT;var EV     = window.EVENT;var EVG    = window.EVENT.global;self.init = function() {
self.data = mergeObjects({
initiator: document,ontrigger: function(){},onfinish:  function(){}
}, data);self.clear();EVG[actor] = [];if ( def(oninit) ) { oninit(); }
self.data.initiator.addEventListener(actor, function(ev) {
self.data.ontrigger(ev);self.runTriggers(ev);});ENGINE._clear.add(self.clear);EVENT.inst[actor] = self
}
self.runTriggers = function(ev) {
map(EV[actor], function(action) {
action(ev);})
map(EVG[actor], function(action) {
action(ev);})
}
self.clear = function() {
EVENT[actor] = [];}
self.init();}
EVENT.stor = EVENT.stor || {};window.SCENARIO = {};function eScenario(name, data) {
var self   = this;self.model = SCENARIO;self.init = function() {
self.data = mergeObjects({
initialRun: false,autoClear: false
}, data);self.rules     = {};self.links     = {};self.onDone    = {};self.processed = [];self.toRun     = [];SCENARIO[name] = self;self.addAction('init');if ( self.data.initialRun ) { tm(self.run); }
ENGINE._clear.push(function() { self.processed = []; });}
self._emit = function(key) {
var ch = true;map(self.rules[key][1].require, function(key) {
return ch = self.processed.contains(key);});if ( ch ) {
self.rules[key][0]();}
}
self.emit = function(key){
if ( !def(self.rules[key]) ) {
self.addAction(key);}
self._emit(key);}
self.addOnDone = function(key, target) {
self.onDone[key] = self.onDone[key] || [];if ( def(target) ) { self.onDone[key].add(target); }
}
self.addAction = function(key, todo, data) {
data = mergeObjects({
require: [],autoRun: false
}, data);data.require = parseLS(data.require);todo = todo || function(link, self, done){ done(); }
if ( data.autoRun ) {
data.autoRun = parseLS(data.autoRun);data.require = data.require.concat(data.autoRun);map(data.autoRun, function(runKey) {
self.addOnDone(runKey, key);});}
self.addOnDone(key);var evDone = function(){
self.processed.add(key);map(self.onDone[key], self.emit);};self.rules[key] = [function() {
todo(self.links, self, evDone);}, data];}
self.clear = function() {
if (self.data.autoClear) {
self.processed = [];}
}
self.run = function() {
self._emit('init');}
self.init();}
CONF.object.tag = {
map: CONF.engine.tagMap || '98765432'.split('')
}
CONF.object.orm = {
ignoreFields: '_oid,_oname,_model,_bid,_bname,_hasLang,_rel,created_at,updated_at,tokens,static'.split(','),storedModels: 'template,lang,settings'.split(',')
}
CONF.object.pop_drag = {
scale:      [0.70,0.75],smallscale: [0.35,0.50]
}
CONF.project.bbRules = {
in: {},out: {}
}
CONF.project.gallery = {
thumbSize: 120,thumbCount: 1,imageProp: '16,9',heightOffset: -40
}
CONF.seo = {
keywordsLimit: [5,15]
};CONF.object.adapter_filesize = {
strs: ['b','kb','mb','gb','tb','pb'],mult: 1024,limit: 999,precision: 100
};CONF.object.svgCls = 'svg_container';CONF.project.apiFieldMap = {
test: parseLS('table,method,selector')
};CONF.project.auth = {
askLogin: function() {
ENGINE._auth.authCancel();var node = VIEW['auth-login']();node._onpopclose = function() {
ENGINE._auth.authCancel();PROTOCOL.tab.write('window.location.reload()', null, true);}
POP.modal.show(node);}
};CONF.project.editManagerRules = {
}
CONF.project.themeEditor = {
adspos: {
''     : 'Не показывать','Last' : 'После списка новостей','1'    : 'После каждой статьи','3'    : 'После каждой 3ей','6'    : 'После каждой 6й','9'    : 'После каждой 9й','15'   : 'После каждой 15й','20'   : 'После каждой 20й','30'   : 'После каждой 30й','50'   : 'После каждой 50й'
},articleCount: {
'1'  : '1 штука','3'  : '3 штуки','5'  : '5 штук','6'  : '6 штук','7'  : '7 штук','9'  : '9 штук','10' : '10 штук','12' : '12 штук','15' : '15 штук','20' : '20 штук','24' : '24 штук','30' : '30 штук','40' : '40 штук','50' : '50 штук','60' : '60 штук'
}
}
tm(function() {
var data = CONF.project.themeEditor.articleIco = {};data[''] = 'Без картинки';map(parseLS('image,video'), function(name) {
data[name] = SVG[name](cr('div'));})
});CONF.project._moneyPrecision = 2;CONF.project.moneyPrecision = Math.pow(10,CONF.project._moneyPrecision);CONF.project._ratePrecision = 3;CONF.project.moneyFormatBy  = 1000;CONF.project.gallery = {
thumbSize: 120,thumbCount: 1,imageProp: '16,9',heightOffset: -40
}
CONF.project.ormDropdownName = {
test: function(stor, obj) {
return ['object at ', obj.id].join(' ');}
};CONF.project.dropdownName = {
def: function(obj) { return ORM.getVisName(obj); }
}
CONF.project.musicExts = parseLS('mp3,flac');CONF.project.fileExt = lsMapToDict({
'def': function(self, path) {
SYS.targetPath = self.path;SYS.WS.send({command:'reqFile',path:self.path});},'jpg,jpeg,png,gif,svg': function(self,path) {
var node = cr('img', 'previewImg').attr({src:'file://'+path});POP.drag.showNew(node);},'mp3,flac': function(self,path) {
SYS.player.F.play(path);}
});CONF.project.fileListExt = lsMapToDict({
def: function(){},'mp3,flac': function(self, path) {
if ( SYS.drawedDirs[self.dirPath] ) {
SYS.drawedDirs[self.dirPath].F.setHasMusic();}
}
});new eParse('string', {
parse: function(data) {
try {
return JSON.stringify(data);} catch(err) {
return data;}
}
});window.parseStr = PARSE.string;new eParse('number', {
parse: function(val) {
val = (val || 0).toString();var mp = val.split(/\D+/g);var numberMap = mp.splice((( mp[0].length == 0 ) && 1 || 0), 2);return (numberMap.length == 1) && parseInt(numberMap[0]) || parseFloat(numberMap.join('.'));}
});window.parseNum = PARSE.number;new eParse('form', {
parse: function(obj) {
var form = new FormData();mapO(obj, function(val, key) {
if ( typeof(val) == 'object' && val.constructor == Array ) {
form.append(key, val[0], val[1]);} else {
form.append(key, val);}
});return form;}
});window.parseForm = PARSE.form;new eParse('object', {
parse: function(data) {
try {
return JSON.parse(data);} catch(err) {
return data;}
}
});window.parseObj = PARSE.object;PARSE.listStr = window.parseLS;new eParse('test', {
parse: function(sum) {
return Math.floor(sum);}
});new eProtocol('auth', {
prefix: '/_handler/auth/',fieldMap: {
login:    parseLS('method,data'),confirm:  parseLS('method,data'),forgot:   parseLS('method,data'),getuser:  parseLS('method,data'),register: parseLS('method,data'),renew:    parseLS('method')
}
}, 'api');ENGINE._auth = mergeObjects(CONF.project.auth, {
reload: function() {
PROTOCOL.tab.write('window.location.href = window.location.href.split("#")[0];', null, true);},viewProcess: function() {
map(S('.authOnly'),    function(node) { node.remCls('hidden'); });map(S('.unauthOnly'),  function(node) { node.addCls('hidden'); });},initLoggedMenu: function(func) {
ENGINE._auth.viewProcess();ENGINE.processDomQueue.add(ENGINE._auth.viewProcess);func();},renewMaybe: function(func) {
var now = new Date()*1;func = func||function(){};if ( now > parseInt(glob('expiry')||0) ) {
PROTOCOL.tab.write('ENGINE._auth.askLogin', [], true);ENGINE._auth.authCancel();func();} else if ( now > parseInt(glob('renew')||0) ) {
ENGINE._auth.renew(function() { ENGINE._auth.initLoggedMenu(func); });} else {
ENGINE._auth.initLoggedMenu(func);}
},forgot: function(data, func, funcBad) {
func = func||function(){};funcBad = funcBad||func;if ( data.email ) { data.email = data.email.toLowerCase(); }
PROTOCOL.auth.write(':forgot', data, function(resp) {
POP.info.show(cr('div').VAL([PAGE.ld('check mail'), data.email].join(' ')));}, log);},register: function(data, func, funcBad){
func = func||function(){};funcBad = funcBad||func;if ( data.email ) { data.email = data.email.toLowerCase(); }
PROTOCOL.auth.write(':register', data, function(resp) {
POP.info.show(cr('div').VAL([PAGE.ld('check mail'), data.email].join(' ')));}, function(resp) {
LOG.auth.write('register:', ['Fail',parseStr(resp.statusData)].join(' '));ENGINE._auth.authFail(data, resp.statusData);funcBad(resp.statusData);});},login: function(data, func, funcBad) {
func = func||function(){};funcBad = funcBad||func;if ( data.email ) { data.email = data.email.toLowerCase(); }
PROTOCOL.auth.write(':login', data, function(resp) {
ENGINE._auth.authOk(data, resp.user[0], resp.session[0], function() {
LOG.auth.write('login:', ['OK expiry',formatDate(resp.session[0].expiry, true, true),resp.session[0].token].join(' '));func();ENGINE._auth.reload();});}, function(resp) {
LOG.auth.write('login:', ['Fail',parseStr(resp.statusData)].join(' '));ENGINE._auth.authFail(data, resp.statusData);funcBad(resp.statusData);});},renew: function(func) {
var now = new Date()*1;if ( now > parseInt(glob('renew')||0) ) {
PROTOCOL.auth.write(':renew', {}, function(resp) {
log(resp);var user;if ( resp.user ) {
user = resp.user[0];} else {
user = PAGE.user||parseObj(glob('user'));}
ENGINE._auth.authOk({}, user, resp.session[0], function() {
LOG.auth.write('renew:', ['OK expiry',formatDate(resp.session[0].expiry, true, true),resp.session[0].token].join(' '));func();ENGINE._auth.renewDelayed();});}, function(resp) {
LOG.auth.write('renew:', ['Fail',parseStr(resp.statusData)].join(' '));ENGINE._auth.authFail({}, resp.statusData);});}
},delayInt: null,renewDelayed: function() {
var now = new Date()*1;ENGINE._auth.delayInt = tm(ENGINE._auth.renewMaybe, now-parseInt(glob('renew'))+parseInt(Math.random()*30000));},authOk: function(data, user, session, func) {
func = func||function(){};var now = new Date()*1;glob('token'  , session.token);glob('expiry' , session.expiry);glob('renew'  , now + (session.expiry - now) / 2);glob('user'   , parseStr(user));glob('email'  , user.email);ENGINE._auth.renewDelayed();func();},authFail: function(data, resp) {
},authCancel: function(data, resp) {
clearInterval(ENGINE._auth.delayInt);glob.removeItem('token');glob.removeItem('expiry');glob.removeItem('renew');glob.removeItem('user');},logout: function(data, resp) {
PROTOCOL.auth.write(':logout', {}, function(resp) {
ENGINE._auth.authCancel();tm(ENGINE._auth.reload);});}
});ENGINE._auth.oauth2Success = function(key) {
var data = glob(key);glob.removeItem(key);log(data);PROTOCOL.auth.data.read({}, data, null, function(resp) {
log(resp);ENGINE._auth.authOk(data, resp.user[0], resp.session[0], function() {
LOG.auth.write('login:', ['OK oauth2 expiry',formatDate(resp.session[0].expiry, true, true),resp.session[0].token].join(' '));ENGINE._auth.reload();});}, function(resp) {
log(resp);LOG.auth.write('login:', ['Fail oauth2',parseStr(resp.statusData)].join(' '));ENGINE._auth.authFail(data, resp.statusData);funcBad(resp.statusData);})
}
ENGINE._auth.askLogin = function() {
POP.info.show(VIEW.loginMenu());}
new eProtocol('cache', {
prefix: '/_handler/cache/',write: function(self, dataMap, url, todo) {
if ( typeof(url) == 'function' ) {
todo = url;url = null;} else if ( typeof(dataMap) == 'function' ) {
todo = dataMap;dataMap = null;url = null;}
todo = todo || function() {};dataMap = (dataMap||'').split(':');var req = { method: 'purge' };if ( dataMap[0] ) { req.table  = dataMap[0]; }
if ( dataMap[1] ) { req.method = dataMap[1]; }
if ( url )        { req.url    = url; }
var tokenStr = '';if ( def(glob('token')) ) {
tokenStr = ['?token', glob('token')].join('=');}
self.doReq(self.data.prefix+tokenStr, parseStr(req), function(resp) { self.read(resp, todo); }, log);},read: function(self, resp, todo) {
log('cache purged');todo();}
});new eProtocol('tab', {
lsName: 'tabCon',write: function(self, method, data, runSelf) {
glob(self.data.lsName, parseStr([method, data]));tm(function() { glob(self.data.lsName, ''); }, 2);if ( runSelf ) {
tm(function() { self.read(method, data); }, 3);}
},read: function(self, method, data) {
if ( !method ) { return 0; }
if ( def(data) ) {
var methodMap = method.split('.');method = addressIt(window, methodMap);if ( def(method) ) {
method.apply(null, data);}
} else {
eval(method);}
},addressIt: function(obj, path) {
if ( !obj ) { return null; }
if ( path.length > 0 ) {
return addressIt(obj[path.splice(0,1)[0]], path);}
return obj;}
});EVENT.stor[PROTOCOL.tab.data.lsName] = function(val) {
PROTOCOL.tab.read(val[0],val[1]);}
new eProtocol('regview', {
prefix: '/_handler/regview/',lastId: '',write: function(self, id) {
id = id || g_id;if ( id != self.data.lastId ) {
self.data.lastId = id;self.doReq(self.data.prefix, parseStr({
id:id,lang_id: PAGE.langObj.id
}), function(resp) { self.read(resp); });}
},read: function(self) {}
});SYS.view_select = SYS.view_select || [];new eProtocol('api', {
prefix: '/_handler/api/',dataHasLang:  parseLS('insert,update'),write: function(self, reqMap,reqData,funcOk,funcBad,options) {
if ( typeof(reqData) == 'function' ) {
options = funcBad;funcBad = funcOk;funcOk  = reqData;reqData = {};}
reqData = reqData || {};funcOk  = funcOk || log;funcBad = funcBad || function(){};options = options || {};reqMap     = reqMap.split(':');reqMap[0]  = reqMap[0].split('_');var model  = reqMap[0].splice(0,1)[0];var oid    = reqMap[0].join('_');var lang   = null;var method = null;if ( reqMap.length == 2 ) {
method = reqMap[1];} else {
lang   = reqMap[1];method = reqMap[2];}
var reqDict      = CO(options);reqDict.table    = model;reqDict.method   = method;reqDict.selector = reqDict.selector || {};reqDict.data     = reqData;if ( def(oid) && oid != '' ) {
if ( parseInt(oid) == oid ) {
reqDict.selector.id   = ['=', Math.floor(oid)];} else {
reqDict.selector.name = ['=', oid];}
}
if ( def(lang) && model != 'user' ) {
if ( parseInt(lang) == lang ) {
reqDict.selector.lang_id = ['=', Math.floor(lang)];} else {
reqDict.selector.lang_id = ['=', Math.floor(ORM.O('lang_'+lang).id)];}
if ( self.data.dataHasLang.contains(method) ) {
reqDict.data.lang_id = reqDict.selector.lang_id[1];}
}
var tokenStr = '';if ( options.token ) {
tokenStr = ['?token', options.token].join('=');} else if ( def(glob('token')) ) {
tokenStr = ['?token', glob('token')].join('=');}
if ( reqDict.method == 'select' && SYS.view_select.contains(reqDict.table) && okeys(reqDict.selector).length == 0 ) {
getRawData(['/_view/',PAGE.lang,'/select_',reqDict.table].join(''),function(dt) {
self.read(parseObj(dt),null, funcOk, funcBad);})
} else {
self.doReq(self.data.prefix+tokenStr, parseStr(reqDict), function(resp, respObj) { self.read(resp, respObj, funcOk, funcBad); });}
},read: function(self, resp, respObj, funcOk, funcBad) {
var numFix = resp;try { 
resp = JSON.parse(numFix);} catch(err) {
resp = parseObj(resp);}
var status;if ( respObj ) { status = respObj.getResponseHeader('X-jlx-status'); } else { status = 'OK'; }
if ( status == 'OK' ) {
var result = {};if ( resp.fields ) {
map(resp.fields, function(fieldSet) {
result[fieldSet[0]] = [];});map(resp.data, function(obj) {
var index = 0;map(resp.fields, function(fieldSet) {
var writeTo = {};result[fieldSet[0]].push(writeTo);for ( var i = 1; i < fieldSet.length; i++ ) {
writeTo[fieldSet[i]] = obj[index];index += 1;}
});});}
funcOk(result, resp);} else if ( status == 'exception' ) {
if ( resp.statusData && resp.statusData.exception == 'Unauth') {
var msg = cr('div','alert').VAL(PAGE.ld('Session expired'));msg._onpopclose = function() {
ENGINE._auth.authCancel();ENGINE._auth.reload();}
POP.info.show(msg);}
SYS.notify([resp.statusData.field, resp.statusData.exception].join(' '), 'center red');funcBad(resp);}
}
});new eProtocol('search', {
prefix: '/_handler/search/',write: function(self, keywords) {
var newKeywords = [];if ( typeof(keywords) == 'string' ) {
keywords = keywords.split(/[\s\,]+/g);map(keywords, function(word) {
if ( word.rp(/\s/g,'').length > 1 ) { newKeywords.push(word.trim().rp(/\s+/g, ' ').toLowerCase())}
});} else {
map(keywords, function(word) {
if ( word.rp(/\s/g,'').length > 1 ) { newKeywords.push(word.trim().rp(/\s+/g, ' ').toLowerCase())}
});}
if ( newKeywords.length > 0 ) {
self.doReq(self.data.prefix, parseStr({
keywords:newKeywords,lang_id: PAGE.langObj.id
}), function(resp) { self.read(resp); }, log);}
},read: function(self, resp) {
var tmp = cr('div');tmp.innerHTML = resp;var target = S(CONF.engine.mainContentSelector)[0];var thDef = S('.defineTheme', tmp)[0];if ( thDef ) {
S('.theme')[0].className = thDef.val;thDef.detach();}
var bCls = S('.defineBlockCls', tmp)[0];if ( bCls ) {
target.className = bCls.val;bCls.detach();}
target.innerHTML = tmp.innerHTML;ENGINE.processDom(target);EVENT.emit('resize');}
});new eProtocol('media', {
prefix: '/_handler/media/',write: function(self,reqStr,data,funcOk,funcBad, table) {
table = table || 'media';data = data || {};reqStr     = reqStr.split(':');reqStr[0]  = reqStr[0].split('_');var oid    = reqStr[0][0];var tag    = reqStr[0][1]||'notag';var method = reqStr[1]||'upload';var reqDict = mergeObjects({
table: table,id: oid,tag: tag,method: method
}, data);var tokenStr = '';if ( def(glob('token')) ) {
tokenStr = ['?token', glob('token')].join('=');}
self.doReq(self.data.prefix+tokenStr, parseForm(reqDict), function(resp, respObj) { self.read(resp, respObj, funcOk, funcBad); });},read: function(self, resp, respObj, funcOk, funcBad) {
funcOk = funcOk||log;funcBad = funcBad || funcOk;SYS.notify(PAGE.ld('file uploaded'),'ok');PROTOCOL.api.read(resp, respObj, funcOk, funcBad);}
});new eSvg('move',  '<path d="M14,14v-6l6,-6l6,6v6h6l6,6l-6,6h-6v6l-6,6l-6,-6v-6h-6l-6,-6l6,-6z"></path>');new eSvg('move2', '<path d="M12,16l-2,2h8v-8l-2,2l-2,-2l6,-6l6,6l-2,2l-2,-2v8h8l-2,-2l2,-2l6,6l-6,6l-2,-2l2,-2h-8v8l2,-2l2,2l-6,6l-6,-6l2,-2l2,2v-8h-8l2,2l-2,2l-6,-6l6,-6z"></path>');new eSvg('bold', '<path d="M310.723,0.929H81.896C36.738,0.929,0,37.667,0,82.825v226.969c0,45.158,36.738,81.896,81.896,81.896h228.827c45.158,0,81.896-36.738,81.896-81.896V82.825C392.619,37.667,355.881,0.929,310.723,0.929z M362.619,309.794c0,28.616-23.28,51.896-51.896,51.896H81.896C53.28,361.69,30,338.41,30,309.794V82.825c0-28.615,23.28-51.896,51.896-51.896h228.827c28.616,0,51.896,23.28,51.896,51.896V309.794z"/><path d="M211.056,105.476h-81.993v35h10.334v111.667h-10.334v35h81.993c29.868,0,54.167-24.299,54.167-54.167c0-14.132-5.445-27.012-14.341-36.667c8.896-9.655,14.341-22.535,14.341-36.667C265.223,129.775,240.924,105.476,211.056,105.476zM211.056,140.476c10.568,0,19.167,8.598,19.167,19.167c0,10.568-8.599,19.167-19.167,19.167h-36.659v-38.333H211.056zM211.056,252.143h-36.659V213.81h36.659c10.568,0,19.167,8.598,19.167,19.167C230.223,243.545,221.624,252.143,211.056,252.143z"/>', {
size: '393x393'
});new eSvg('italic', '<path d="M310.723,0.929H81.896C36.738,0.929,0,37.667,0,82.825v226.97c0,45.158,36.738,81.896,81.896,81.896h228.827c45.158,0,81.896-36.738,81.896-81.896V82.825C392.619,37.667,355.881,0.929,310.723,0.929z M362.619,309.794c0,28.616-23.28,51.896-51.896,51.896H81.896C53.28,361.69,30,338.41,30,309.794V82.825c0-28.616,23.28-51.896,51.896-51.896h228.827c28.616,0,51.896,23.28,51.896,51.896V309.794z"/><path d="M263.825,96.94h-91.03c-8.284,0-15,6.716-15,15s6.716,15,15,15h26.102l-36.177,138.739h-33.925c-8.284,0-15,6.716-15,15s6.716,15,15,15h45.402c0.041,0,0.082,0.004,0.123,0.004c0.031,0,0.062-0.004,0.093-0.004h45.411c8.284,0,15-6.716,15-15s-6.716-15-15-15h-26.102L229.9,126.94h33.925c8.284,0,15-6.716,15-15S272.109,96.94,263.825,96.94z"/>', {
size: '393x393'
});new eSvg('alignLeft', '<path d="M27.235,50.809h561.65c14.188,0,25.175-10.986,25.175-25.175C614.061,12.363,603.074,0,588.886,0H27.235C13.046,0,2.061,12.363,2.061,25.634C2.061,39.823,13.046,50.809,27.235,50.809z"/><path d="M27.235,164.33h350.632c14.189,0,25.176-10.986,25.176-25.175s-10.986-25.634-25.176-25.634H27.235c-14.189,0-25.175,11.445-25.175,25.634S13.046,164.33,27.235,164.33z"/><path d="M588.886,226.125H27.235c-14.189,0-25.175,10.986-25.175,25.175s10.986,25.634,25.175,25.634h561.65c14.188,0,25.175-11.445,25.175-25.634S603.074,226.125,588.886,226.125z"/><path d="M27.235,389.996h350.632c14.189,0,25.176-10.986,25.176-25.175s-10.986-25.175-25.176-25.175H27.235c-14.189,0-25.175,10.985-25.175,25.175S13.046,389.996,27.235,389.996z"/><path d="M588.886,452.25H27.235c-14.189,0-25.175,10.985-25.175,25.175c0,14.188,10.986,25.175,25.175,25.175h561.65c14.188,0,25.175-10.986,25.175-25.175C614.061,463.235,603.074,452.25,588.886,452.25z"/><path d="M377.867,565.312H27.235c-14.189,0-25.175,11.444-25.175,25.634c0,14.188,10.986,25.175,25.175,25.175h350.632c14.189,0,25.176-10.986,25.176-25.175C403.043,576.757,392.057,565.312,377.867,565.312z"/>', {
size: '616x616'
});new eSvg('alignRight', '<path d="M588.216,113.437h-350.36c-14.188,0-25.166,11.436-25.166,25.615c0,14.178,10.978,25.156,25.166,25.156h350.36c14.178,0,25.614-10.978,25.614-25.156C613.83,124.873,602.394,113.437,588.216,113.437z"/><path d="M588.216,339.393h-350.36c-14.188,0-25.166,10.977-25.166,25.154c0,14.18,10.978,25.156,25.166,25.156h350.36c14.178,0,25.614-10.977,25.614-25.156C613.83,350.369,602.394,339.393,588.216,339.393z"/><path d="M588.216,564.889h-350.36c-14.188,0-25.166,11.436-25.166,25.615c0,14.178,10.978,25.156,25.166,25.156h350.36c14.178,0,25.614-10.979,25.614-25.156C613.83,576.324,602.394,564.889,588.216,564.889z"/><path d="M27.445,50.771h560.771c14.178,0,25.614-10.978,25.614-25.156C613.83,12.354,602.394,0,588.216,0H27.445C13.267,0,1.83,12.354,1.83,25.615C1.83,39.793,13.267,50.771,27.445,50.771z"/><path d="M588.216,225.956H27.445c-14.178,0-25.615,10.978-25.615,25.156s11.437,25.615,25.615,25.615h560.771c14.178,0,25.614-11.437,25.614-25.615S602.394,225.956,588.216,225.956z"/><path d="M588.216,451.91H27.445c-14.178,0-25.615,10.979-25.615,25.156c0,14.18,11.437,25.156,25.615,25.156h560.771c14.178,0,25.614-10.977,25.614-25.156C613.83,462.889,602.394,451.91,588.216,451.91z"/>', {
size: '616x616'
});new eSvg('alignCenter', '<path d="M132.974,113.521c-14.189,0-25.175,11.445-25.175,25.634s10.986,25.175,25.175,25.175h349.714c14.188,0,25.175-10.986,25.175-25.175s-10.986-25.634-25.175-25.634H132.974L132.974,113.521z"/><path d="M482.688,389.996c14.188,0,25.175-10.986,25.175-25.175s-10.986-25.175-25.175-25.175H132.974c-14.189,0-25.175,10.986-25.175,25.175s10.986,25.175,25.175,25.175H482.688z"/><path d="M482.688,565.312H132.974c-14.189,0-25.175,11.444-25.175,25.634c0,14.188,10.986,25.175,25.175,25.175h349.714c14.188,0,25.175-10.986,25.175-25.175C507.863,576.757,496.877,565.312,482.688,565.312z"/><path d="M27.235,50.809h561.65c14.188,0,25.175-10.986,25.175-25.175C614.061,12.363,603.074,0,588.886,0H27.235C13.046,0,2.061,12.363,2.061,25.634C2.061,39.823,13.046,50.809,27.235,50.809z"/><path d="M588.886,226.125H27.235c-14.189,0-25.175,10.986-25.175,25.175s10.986,25.634,25.175,25.634h561.65c14.188,0,25.175-11.445,25.175-25.634S603.074,226.125,588.886,226.125z"/><path d="M588.886,452.25H27.235c-14.189,0-25.175,10.985-25.175,25.175c0,14.188,10.986,25.175,25.175,25.175h561.65c14.188,0,25.175-10.986,25.175-25.175C614.061,463.235,603.074,452.25,588.886,452.25z"/>', {
size: '616x616'
});new eSvg('alignFull', '<path d="M27.235,50.809h561.65c14.188,0,25.175-10.986,25.175-25.175C614.061,12.363,603.074,0,588.886,0H27.235C13.046,0,2.061,12.363,2.061,25.634C2.061,39.823,13.046,50.809,27.235,50.809z"/><path d="M588.886,113.521H27.235c-14.189,0-25.175,11.445-25.175,25.634s10.986,25.175,25.175,25.175h561.65c14.188,0,25.175-10.986,25.175-25.175S603.074,113.521,588.886,113.521z"/><path d="M588.886,226.125H27.235c-14.189,0-25.175,10.986-25.175,25.175s10.986,25.634,25.175,25.634h561.65c14.188,0,25.175-11.445,25.175-25.634S603.074,226.125,588.886,226.125z"/><path d="M588.886,339.646H27.235c-14.189,0-25.175,10.985-25.175,25.175s10.986,25.175,25.175,25.175h561.65c14.188,0,25.175-10.986,25.175-25.175S603.074,339.646,588.886,339.646z"/><path d="M588.886,452.25H27.235c-14.189,0-25.175,10.985-25.175,25.175c0,14.188,10.986,25.175,25.175,25.175h561.65c14.188,0,25.175-10.986,25.175-25.175C614.061,463.235,603.074,452.25,588.886,452.25z"/><path d="M588.886,565.312H27.235c-14.189,0-25.175,11.444-25.175,25.634c0,14.188,10.986,25.175,25.175,25.175h561.65c14.188,0,25.175-10.986,25.175-25.175C614.061,576.757,603.074,565.312,588.886,565.312z"/>', {
size: '616x616'
});new eSvg('header', '<path d="M327.081,0H90.234c-15.9,0-28.854,12.959-28.854,28.859v412.863c0,15.924,12.953,28.863,28.854,28.863H380.35c15.917,0,28.855-12.939,28.855-28.863V89.234L327.081,0z M333.891,43.184l35.996,39.121h-35.996V43.184z M384.972,441.723c0,2.542-2.081,4.629-4.634,4.629H90.234c-2.551,0-4.62-2.087-4.62-4.629V28.859c0-2.548,2.069-4.613,4.62-4.613h219.41v70.181c0,6.682,5.444,12.099,12.129,12.099h63.198V441.723z M292.415,111.713H111.593V63.292h180.898c0,0.267-0.076,0.485-0.076,0.757V111.713z"/>', {
size: '470x470'
});new eSvg('text', '<path d="M327.081,0H90.234C74.331,0,61.381,12.959,61.381,28.859v412.863c0,15.924,12.95,28.863,28.853,28.863H380.35c15.917,0,28.855-12.939,28.855-28.863V89.234L327.081,0z M333.891,43.184l35.996,39.121h-35.996V43.184z M384.972,441.723c0,2.542-2.081,4.629-4.635,4.629H90.234c-2.55,0-4.619-2.087-4.619-4.629V28.859c0-2.548,2.069-4.613,4.619-4.613h219.411v70.181c0,6.682,5.443,12.099,12.129,12.099h63.198V441.723z M128.364,128.89H334.15c5.013,0,9.079,4.066,9.079,9.079c0,5.013-4.066,9.079-9.079,9.079H128.364c-5.012,0-9.079-4.066-9.079-9.079C119.285,132.957,123.352,128.89,128.364,128.89zM343.229,198.98c0,5.012-4.066,9.079-9.079,9.079H128.364c-5.012,0-9.079-4.066-9.079-9.079s4.067-9.079,9.079-9.079H334.15C339.163,189.901,343.229,193.968,343.229,198.98z M343.229,257.993c0,5.013-4.066,9.079-9.079,9.079H128.364c-5.012,0-9.079-4.066-9.079-9.079s4.067-9.079,9.079-9.079H334.15C339.163,248.914,343.229,252.98,343.229,257.993zM343.229,318.011c0,5.013-4.066,9.079-9.079,9.079H128.364c-5.012,0-9.079-4.066-9.079-9.079s4.067-9.079,9.079-9.079H334.15C339.163,308.932,343.229,312.998,343.229,318.011z"/>', {
size: '470x470'
});new eSvg('quote', '<path d="M925.036,57.197h-304c-27.6,0-50,22.4-50,50v304c0,27.601,22.4,50,50,50h145.5c-1.9,79.601-20.4,143.3-55.4,191.2c-27.6,37.8-69.399,69.1-125.3,93.8c-25.7,11.3-36.8,41.7-24.8,67.101l36,76c11.6,24.399,40.3,35.1,65.1,24.399c66.2-28.6,122.101-64.8,167.7-108.8c55.601-53.7,93.7-114.3,114.3-181.9c20.601-67.6,30.9-159.8,30.9-276.8v-239C975.036,79.598,952.635,57.197,925.036,57.197z"/><path d="M106.036,913.497c65.4-28.5,121-64.699,166.9-108.6c56.1-53.7,94.4-114.1,115-181.2c20.6-67.1,30.899-159.6,30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6,0-50,22.4-50,50v304c0,27.601,22.4,50,50,50h145.5c-1.9,79.601-20.4,143.3-55.4,191.2c-27.6,37.8-69.4,69.1-125.3,93.8c-25.7,11.3-36.8,41.7-24.8,67.101l35.9,75.8C52.336,913.497,81.236,924.298,106.036,913.497z"/>', {
size: '975x975'
});new eSvg('image', '<path d="M568.247,72.536L523.25,503.071c-1.537,14.732-13.554,25.741-27.868,26.606l-5.508-120.146l13.001,1.358l35.69-341.459L159.983,29.868l-5,47.878l-30.16,1.381l5.471-52.371c1.717-16.404,16.39-28.302,32.794-26.593l378.574,39.564C558.067,41.451,569.964,56.132,568.247,72.536z M461.117,108.524l19.838,432.424c0.754,16.479-11.979,30.436-28.45,31.189L72.273,589.587c-16.479,0.754-30.436-11.979-31.189-28.45L21.239,128.714c-0.754-16.479,11.979-30.437,28.45-31.19L429.92,80.074C446.407,79.32,460.363,92.053,461.117,108.524z M66.795,470.299l380.231-17.449l-15.732-342.959L51.062,127.34L66.795,470.299zM427.397,350.623c-0.485-10.575-4.702-20.636-11.904-28.398l-26.733-28.823c-9.3-8.911-24.062-8.232-32.504,1.492l-48.385,56.014L202.786,221.469c-9.031-11.165-26.137-11.054-34.951,0.261L85.7,329.949c-6.336,8.352-9.546,18.659-9.061,29.123l4.388,95.628l350.415-16.076L427.397,350.623z M365.937,232.433c22.666-1.037,40.16-20.226,39.123-42.885c-1.037-22.667-20.226-40.161-42.885-39.123c-22.666,1.037-40.16,20.226-39.123,42.885C324.097,215.976,343.277,233.478,365.937,232.433z"/>', {
size: '590x590'
});new eSvg('imagelink', '<path d="M475.095,131.997c-0.032-2.526-0.833-5.021-2.568-6.992L366.324,3.694c-0.021-0.031-0.053-0.042-0.084-0.076c-0.633-0.707-1.36-1.29-2.141-1.804c-0.232-0.15-0.465-0.285-0.707-0.422c-0.686-0.366-1.393-0.667-2.131-0.889c-0.2-0.061-0.379-0.143-0.58-0.195C359.87,0.119,359.047,0,358.203,0H97.2C85.292,0,75.6,9.693,75.6,21.601v507.6c0,11.913,9.692,21.601,21.6,21.601H453.6c11.918,0,21.601-9.688,21.601-21.601V133.202C475.2,132.799,475.137,132.398,475.095,131.997z M193.957,516.207h-77.15V392.692h28.039V492.75h49.111V516.207zM312.704,516.207h-29.32l-26.394-47.641c-7.327-13.194-15.393-29.141-21.437-43.622l-0.551,0.19c0.733,16.311,1.102,33.718,1.102,53.878v37.204H210.45V392.692h32.622l25.655,45.267c7.327,13.016,14.657,28.403,20.157,42.336h0.554c-1.835-16.316-2.383-32.985-2.383-51.501v-36.102h25.655v123.515H312.704z M405.422,516.207l-30.238-53.325l-10.631,13.01v40.315h-27.675V392.692h27.675v54.611h0.549c2.752-4.767,5.685-9.165,8.432-13.563l28.039-41.048h34.267l-40.869,52.592l43.068,70.923H405.422L405.422,516.207z M97.2,366.752V21.601h250.203v110.515c0,5.961,4.831,10.8,10.8,10.8H453.6l0.011,223.836H97.2z"/><path d="M357.091,259.865l-36.435-50.084c-10.583-14.549-29.473-19.506-45.488-13.188l-1.495-2.052c10.939-13.3,12.042-32.788,1.458-47.34l-27.514-37.823c-12.557-17.252-36.801-21.081-54.061-8.538l-3.913,2.853c-17.26,12.548-21.078,36.806-8.527,54.058l27.506,37.815c10.238,14.086,28.271,19.209,43.941,13.819l1.988,2.721c-9.97,13.242-10.645,31.975-0.401,46.053l36.438,50.084c12.551,17.244,36.803,21.073,54.058,8.522l3.907-2.838C365.818,301.367,369.642,277.099,357.091,259.865z M238.847,168.6c-5.756,4.179-7.03,12.263-2.84,18.014l8.369,11.496c-9.395,1.643-19.348-1.912-25.321-10.12l-27.506-37.831c-8.377-11.491-5.822-27.665,5.685-36.042l3.916-2.85c11.501-8.358,27.675-5.817,36.039,5.697l27.515,37.806c6.349,8.735,6.383,20.142,1.01,28.809l-8.831-12.14C252.682,165.663,244.608,164.397,238.847,168.6z M340.97,303.492l-3.913,2.842c-11.501,8.364-27.675,5.822-36.038-5.674l-36.435-50.09c-5.982-8.229-6.291-18.781-1.848-27.216l8.367,11.498c4.189,5.767,12.261,7.051,18.019,2.851c5.759-4.195,7.035-12.264,2.838-18.02l-8.828-12.149c9.893-2.452,20.735,1.083,27.095,9.832l36.429,50.074C355.029,278.944,352.477,295.123,340.97,303.492z"/></g>', {
size: '551x551'
});new eSvg('imagesync', '<g><path d="M195.952,230.893c-4.276,0-8.552-1.069-11.758-4.276l-67.344-67.344c-6.414-6.414-6.414-16.034,0-22.448c6.414-6.414,16.034-6.414,22.448,0l56.654,55.585l55.585-56.654c6.414-6.414,16.034-6.414,22.448,0c6.414,6.414,6.414,16.034,0,22.448l-67.344,67.344C203.435,228.755,200.228,230.893,195.952,230.893z"/><path d="M195.952,230.893c-8.552,0-16.034-7.483-16.034-16.034V16.034C179.918,7.483,187.4,0,195.952,0s16.034,7.483,16.034,16.034V213.79C211.986,223.411,204.503,230.893,195.952,230.893z"/></g><g><path d="M330.639,392.305H60.195c-23.517,0-42.758-19.241-42.758-42.758v-73.758c0-8.552,7.483-16.034,16.034-16.034h84.447c8.552,0,16.034,7.483,16.034,16.034v21.379c0,6.414,5.345,10.69,10.689,10.69h101.55c6.414,0,10.689-5.345,10.689-10.69v-21.379c0-8.552,7.483-16.034,16.034-16.034h84.447c8.552,0,16.034,7.483,16.034,16.034v73.758C374.466,373.063,354.156,392.305,330.639,392.305z M49.506,291.823v57.723c0,6.414,5.345,10.689,10.689,10.689h270.444c6.414,0,10.69-5.345,10.69-10.689v-57.723H288.95v5.345c0,23.517-19.241,42.758-42.758,42.758h-101.55c-23.517,0-42.758-19.241-42.758-42.758v-5.345C101.884,291.823,49.506,291.823,49.506,291.823z"/><path d="M358.432,291.823h-84.447c-8.552,0-16.034-7.483-16.034-16.034c0-8.552,7.483-16.034,16.034-16.034h65.206L309.26,86.585h-51.31c-8.552,0-16.034-7.483-16.034-16.034s7.483-16.034,16.034-16.034h64.137c7.483,0,14.965,5.345,16.034,12.827l36.344,205.238c1.069,4.276,0,9.621-3.207,12.827C366.984,289.685,362.708,291.823,358.432,291.823z"/><path d="M117.919,291.823H33.471c-4.276,0-9.621-2.138-11.758-5.345c-3.207-3.207-4.276-8.552-3.207-12.827L54.851,68.413c1.069-7.483,7.483-12.827,16.034-12.827h60.93c8.552,0,16.034,7.483,16.034,16.034s-7.483,16.034-16.034,16.034H82.643l-29.931,173.17h65.206c8.552,0,16.034,7.483,16.034,16.034C133.953,284.341,126.47,291.823,117.919,291.823z"/></g>', {
size: '393x393'
});new eSvg('link', '<path d="M156.347,187.172c16.458-16.479,45.128-16.479,61.563,0l15.391,15.369c8.512,8.534,22.27,8.534,30.782,0c8.512-8.49,8.512-22.27,0-30.782l-15.369-15.369c-16.458-16.479-38.336-25.535-61.585-25.535s-45.128,9.056-61.563,25.492L25.492,256.442c-33.96,33.938-33.96,89.189,0,123.127l15.391,15.369c16.458,16.479,38.314,25.535,61.585,25.535c23.25,0,45.106-9.1,61.542-25.514l47.305-47.283c8.512-8.512,8.512-22.27,0-30.76c-8.512-8.534-22.27-8.534-30.782,0l-47.305,47.261c-16.436,16.458-45.084,16.458-61.563,0l-15.391-15.391c-16.958-16.98-16.958-44.605,0-61.563C56.273,287.223,156.347,187.172,156.347,187.172z M294.886,264.126l100.051-100.095c16.458-16.436,25.514-38.292,25.514-61.542c0-23.271-9.056-45.128-25.514-61.542l-15.391-15.434C363.089,9.056,341.233,0,317.983,0s-45.128,9.056-61.563,25.514l-43.212,43.212c-8.512,8.534-8.512,22.292-0.022,30.76c8.512,8.555,22.292,8.555,30.803,0.022l43.212-43.212c8.229-8.229,19.157-12.757,30.782-12.757s22.553,4.528,30.782,12.757l15.391,15.413c8.229,8.207,12.757,19.135,12.757,30.782c0,11.625-4.528,22.553-12.757,30.76L264.083,233.301c-16.436,16.479-45.106,16.479-61.542,0.022c-8.512-8.512-22.27-8.512-30.782-0.022c-8.512,8.534-8.512,22.27-0.022,30.782c16.458,16.458,38.314,25.535,61.563,25.535C256.572,289.618,278.428,280.54,294.886,264.126z"/>', {
size: '420x420'
});new eSvg('html', '<path d="M153.821,358.226L0,274.337v-46.463l153.821-83.414v54.574L46.636,250.523l107.185,53.431C153.821,303.954,153.821,358.226,153.821,358.226z"/><path d="M180.094,387.584L282.103,115.08h32.227L212.084,387.584H180.094z"/><path d="M348.843,358.226v-54.272l107.164-52.999l-107.164-52.59v-53.927l153.821,83.522v46.183L348.843,358.226z"/>', {
size: '503x503'
});new eSvg('add', '<path d="M4,16h12v-12h8v12h12v8h-12v12h-8v-12h-12z"></path>');new eSvg('add2', '<path d="M4,16h12v-12h8v12h12v8h-12v12h-8v-12h-12z"></path>');new eSvg('arrTop',      '<path d="M8,26l12,-12l12,12l2,-2l-14,-14l-14,14z"></path>');new eSvg('arrBottom',   '<path d="M8,14l12,12l12,-12l2,2l-14,14l-14,-14z"></path>');new eSvg('arrLeft',     '<path d="M26,8l-12,12l12,12l-2,2l-14,-14l14,-14z"></path>');new eSvg('arrRight',    '<path d="M14,8l12,12l-12,12l2,2l14,-14l-14,-14z"></path>');new eSvg('arrTB',       '<path d="M8,18l12,-12l12,12l2,-2l-14,-14l-14,14z"></path><path d="M8,22l12,12l12,-12l2,2l-14,14l-14,-14z"></path>');new eSvg('arrTB2',      '<path d="M6,20l12,-12l12,12l2,-2l-14,-14l-14,14z"></path><path d="M10,20l12,12l12,-12l2,2l-14,14l-14,-14z"></path>');new eSvg('mesh' , '<path d="M1,2l1,-1l-1,-1l-1,1z"></path>' , { size: '2x2'});new eSvg('meshTop'    , '<path d="M0,2l1,-1l1,1z"></path>'   , { size: '2x2'});new eSvg('meshBottom' , '<path d="M2,0l-1,1l-1,-1z"></path>' , { size: '2x2'});new eSvg('meshLeft'   , '<path d="M2,0l-1,1l1,1z"></path>'   , { size: '2x2'});new eSvg('meshRight'  , '<path d="M0,2l1,-1l-1,-1z"></path>' , { size: '2x2'});new eSvg('meshTopLeft'     , '<path d="M0,0v2l2,-2z"></path>'  , { size: '2x2'});new eSvg('meshTopRight'    , '<path d="M0,0l2,2v-2z"></path>'  , { size: '2x2'});new eSvg('meshBottomRight' , '<path d="M0,2h2v-2z"></path>'    , { size: '2x2'});new eSvg('meshBottomLeft'  , '<path d="M0,2h2l-2,-2z"></path>' , { size: '2x2'});new eSvg('meshLine'  , '<path d="M0,7l7,-7h1v1l-7,7h-1m7,0l1,-1v1m-8,-8h1l-1,1z"></path>' , { size: '8x8'});new eSvg('meshLine2' , '<path d="M0,6l3,-3l1,1l4,-4v2l-3,3l-1,-1l-4,4m7,-1l1,-1v2m-8,-8l1,1l-1,1z"></path>' , { size: '8x8'});new eSvg('meshChess' , '<path d="M1,2h-1v-1h1v-1h1v1h-1z"></path>' , { size: '2x2'});new eSvg('meshChess2' , '<path d="M1,2h-1v-1h1z"></path>' , { size: '2x2'});new eSvg('meshAbstract1' , '<path d="M0,2l2,6l3,-6l1,-2h-4l3,2l2,1l-7,3m3,2l5,-6l-2,6m2,-7l-8,3l8,2z"></path>' , { size: '8x8'});new eSvg('del',  '<path d="M4,5h5l4,26h14l4,-26h5l-5,31h-22m4,-32h14l-3,24h-8z"></path>');new eSvg('del2', '<path d="M4,5l4,-3v29h8l4,4l4,-4h8v-29l4,3v30h-12l-4,4l-4,-4h-12m8,-33h16v25h-4l-4,4l-4,-4h-4z"></path>')
new eSvg('close', '<path d="M6,6h2l12,12l12,-12h2v2l-12,12l12,12v2h-2l-12,-12l-12,12h-2v-2l12,-12l-12,-12z"></path>');new eSvg('menu',  '<path d="M4,5h32v6h-32m0,6h32v6h-32m0,6h32v6h-32z"></path>');new eSvg('menu2', '<path d="M4,5h32v6h-11l-5,5l-5,-5h-11m0,5h11l5,5l5,-5h11v6h-11l-5,5l-5,-5h-11m0,5h11l5,5l5,-5h11v6h-11l-5,5l-5,-5h-11z"></path>');new eSvg('edit',  '<path d="M31,1l8,8l-3,3l-8,-8m-2,2l8,8l-20,20l-8,-8m-2,2l8,8l-10,2z"></path>');new eSvg('edit2', '<path d="M31,1l8,8l-3,3l-2,-2h-4v-4l-2,-2m-2,2l2,2v4h4l2,2l-20,20l-2,-2h-4v-4l-2,-2m-2,2l2,2v4h4l2,2l-2,2h-8v-8z"></path>');new eSvg('search', '<path d="M363.909,181.955C363.909,81.473,282.44,0,181.956,0C81.474,0,0.001,81.473,0.001,181.955s81.473,181.951,181.955,181.951C282.44,363.906,363.909,282.437,363.909,181.955z M181.956,318.416c-75.252,0-136.465-61.208-136.465-136.46c0-75.252,61.213-136.465,136.465-136.465c75.25,0,136.468,61.213,136.468,136.465C318.424,257.208,257.206,318.416,181.956,318.416z"/><path d="M471.882,407.567L360.567,296.243c-16.586,25.795-38.536,47.734-64.331,64.321l111.324,111.324c17.772,17.768,46.587,17.768,64.321,0C489.654,454.149,489.654,425.334,471.882,407.567z"/>', {
size: '485x485',});new eSvg('profile', '<path d="M22.766,0.001C10.194,0.001,0,10.193,0,22.766s10.193,22.765,22.766,22.765c12.574,0,22.766-10.192,22.766-22.765S35.34,0.001,22.766,0.001z M22.766,6.808c4.16,0,7.531,3.372,7.531,7.53c0,4.159-3.371,7.53-7.531,7.53c-4.158,0-7.529-3.371-7.529-7.53C15.237,10.18,18.608,6.808,22.766,6.808z M22.761,39.579c-4.149,0-7.949-1.511-10.88-4.012c-0.714-0.609-1.126-1.502-1.126-2.439c0-4.217,3.413-7.592,7.631-7.592h8.762c4.219,0,7.619,3.375,7.619,7.592c0,0.938-0.41,1.829-1.125,2.438C30.712,38.068,26.911,39.579,22.761,39.579z"/>', {
size: '46x46',});new eSvg('views', '<path d="M466.075,161.525c-205.6,0-382.8,121.2-464.2,296.1c-2.5,5.3-2.5,11.5,0,16.9c81.4,174.899,258.601,296.1,464.2,296.1s382.8-121.2,464.2-296.1c2.5-5.3,2.5-11.5,0-16.9C848.875,282.725,671.675,161.525,466.075,161.525z M466.075,676.226c-116.1,0-210.1-94.101-210.1-210.101c0-116.1,94.1-210.1,210.1-210.1c116.1,0,210.1,94.1,210.1,210.1S582.075,676.226,466.075,676.226z"/><circle cx="466.075" cy="466.025" r="134.5"/>', {
size: '932x932',});new eSvg('comments', '<path d="M145.978,96.146h163.125c-1.146-15.041-13.742-26.931-29.073-26.931H29.169C13.085,69.215,0,82.301,0,98.384v129.44c0,16.084,13.085,29.17,29.169,29.17h22.029v51.382c0,3.552,2.072,6.778,5.302,8.255c1.208,0.553,2.497,0.823,3.775,0.823c2.14,0,4.255-0.755,5.938-2.21l39.048-33.74c-1.338-4.141-2.069-8.551-2.069-13.131v-129.44C103.191,115.341,122.385,96.146,145.978,96.146z"/><path d="M399.259,110.975h-250.86c-16.084,0-29.17,13.085-29.17,29.169v129.441c0,16.084,13.086,29.169,29.17,29.169h146.403l67.414,58.25c1.683,1.453,3.798,2.209,5.938,2.209c1.276,0,2.564-0.271,3.773-0.823c3.23-1.478,5.303-4.702,5.303-8.255v-51.38h22.028c16.084,0,29.169-13.085,29.169-29.169V140.145C428.428,124.061,415.343,110.975,399.259,110.975z M201.202,226.324c-12.785,0-23.15-10.365-23.15-23.15s10.365-23.149,23.15-23.149c12.785,0,23.149,10.365,23.149,23.149C224.352,215.96,213.987,226.324,201.202,226.324z M273.829,226.324c-12.785,0-23.149-10.365-23.149-23.15s10.365-23.149,23.149-23.149c12.785,0,23.148,10.365,23.148,23.149C296.979,215.96,286.614,226.324,273.829,226.324zM346.456,226.324c-12.785,0-23.15-10.365-23.15-23.15s10.365-23.149,23.15-23.149s23.147,10.365,23.147,23.149C369.604,215.96,359.24,226.324,346.456,226.324z"/>', {
size: '429x429',});new eSvg('file', '<path d="M203.424,47.001L165.372,9.224C160.076,3.966,150.455,0,142.991,0H41.581c-9.649,0-17.5,7.851-17.5,17.5v201.816c0,9.649,7.851,17.5,17.5,17.5h153.655c9.649,0,17.5-7.851,17.5-17.5V69.369C212.736,61.888,208.732,52.271,203.424,47.001z M191.479,56.278h-30.425c-1.355,0-2.5-1.145-2.5-2.5V23.591L191.479,56.278zM195.236,221.816H41.581c-1.355,0-2.5-1.145-2.5-2.5V17.5c0-1.355,1.145-2.5,2.5-2.5h101.411c0.181,0,0.371,0.011,0.562,0.023v38.756c0,9.649,7.851,17.5,17.5,17.5h36.683v148.038C197.736,220.672,196.591,221.816,195.236,221.816z"/><path d="M64.061,71.278h50c4.142,0,7.5-3.357,7.5-7.5c0-4.143-3.358-7.5-7.5-7.5h-50c-4.142,0-7.5,3.357-7.5,7.5C56.561,67.921,59.919,71.278,64.061,71.278z"/><path d="M173.392,182.115h-50c-4.142,0-7.5,3.357-7.5,7.5c0,4.143,3.358,7.5,7.5,7.5h50c4.142,0,7.5-3.357,7.5-7.5C180.892,185.473,177.534,182.115,173.392,182.115z"/><path d="M173.392,91.553H64.061c-4.142,0-7.5,3.357-7.5,7.5c0,4.143,3.358,7.5,7.5,7.5h109.331c4.142,0,7.5-3.357,7.5-7.5C180.892,94.91,177.534,91.553,173.392,91.553z"/><path d="M173.392,126.827H64.061c-4.142,0-7.5,3.357-7.5,7.5c0,4.143,3.358,7.5,7.5,7.5h109.331c4.142,0,7.5-3.357,7.5-7.5C180.892,130.185,177.534,126.827,173.392,126.827z"/>', {
size: '237x237',});new eSvg('dir', '<path d="M273.081,101.378c-3.3-4.651-8.86-7.319-15.255-7.319h-24.34v-26.47c0-10.201-8.299-18.5-18.5-18.5h-85.322c-3.63,0-9.295-2.876-11.436-5.806l-6.386-8.735c-4.982-6.814-15.104-11.954-23.546-11.954H58.731c-9.293,0-18.639,6.608-21.738,15.372l-2.033,5.752c-0.958,2.71-4.721,5.371-7.596,5.371H18.5c-10.201,0-18.5,8.299-18.5,18.5v167.07c0,0.885,0.161,1.73,0.443,2.519c0.152,3.306,1.18,6.424,3.053,9.064c3.3,4.652,8.86,7.319,15.255,7.319h188.486c11.395,0,23.27-8.424,27.035-19.179l40.677-116.188C277.061,112.159,276.381,106.03,273.081,101.378z M18.5,64.089h8.864c9.295,0,18.64-6.608,21.738-15.372l2.032-5.75c0.959-2.711,4.722-5.372,7.597-5.372h29.564c3.63,0,9.295,2.876,11.437,5.806l6.386,8.734c4.982,6.815,15.104,11.954,23.546,11.954h85.322c1.898,0,3.5,1.603,3.5,3.5v26.47H69.34c-11.395,0-23.27,8.424-27.035,19.179L15,191.231V67.589C15,65.692,16.603,64.089,18.5,64.089z M260.791,113.238l-40.677,116.188c-1.674,4.781-7.812,9.135-12.877,9.135H18.751c-1.448,0-2.577-0.373-3.02-0.998c-0.443-0.625-0.423-1.814,0.056-3.181l40.677-116.188c1.674-4.781,7.812-9.135,12.877-9.135h188.486c1.448,0,2.577,0.373,3.021,0.998C261.29,110.682,261.27,111.871,260.791,113.238z"/>', {
size: '277x277',});new eSvg('video', '<path d="M19.982,14.438l-6.24-4.536c-0.229-0.166-0.533-0.191-0.784-0.062c-0.253,0.128-0.411,0.388-0.411,0.669v9.069c0,0.284,0.158,0.543,0.411,0.671c0.107,0.054,0.224,0.081,0.342,0.081c0.154,0,0.31-0.049,0.442-0.146l6.24-4.532c0.197-0.145,0.312-0.369,0.312-0.607C20.295,14.803,20.177,14.58,19.982,14.438z"/><path d="M15.026,0.002C6.726,0.002,0,6.728,0,15.028c0,8.297,6.726,15.021,15.026,15.021c8.298,0,15.025-6.725,15.025-15.021C30.052,6.728,23.324,0.002,15.026,0.002z M15.026,27.542c-6.912,0-12.516-5.601-12.516-12.514c0-6.91,5.604-12.518,12.516-12.518c6.911,0,12.514,5.607,12.514,12.518C27.541,21.941,21.937,27.542,15.026,27.542z"/>', {
size: '30x30',});new eSvg('search', '<path d="M363.909,181.955C363.909,81.473,282.44,0,181.956,0C81.474,0,0.001,81.473,0.001,181.955s81.473,181.951,181.955,181.951C282.44,363.906,363.909,282.437,363.909,181.955z M181.956,318.416c-75.252,0-136.465-61.208-136.465-136.46c0-75.252,61.213-136.465,136.465-136.465c75.25,0,136.468,61.213,136.468,136.465C318.424,257.208,257.206,318.416,181.956,318.416z"/><path d="M471.882,407.567L360.567,296.243c-16.586,25.795-38.536,47.734-64.331,64.321l111.324,111.324c17.772,17.768,46.587,17.768,64.321,0C489.654,454.149,489.654,425.334,471.882,407.567z"/>', {
size: '485x485',});new eSvg('project', '<path d="M30.224,3.948h-1.098V2.75c0-1.516-1.197-2.75-2.67-2.75c-1.475,0-2.67,1.234-2.67,2.75v1.197h-2.74V2.75c0-1.516-1.197-2.75-2.67-2.75c-1.473,0-2.67,1.234-2.67,2.75v1.197h-2.74V2.75c0-1.516-1.197-2.75-2.67-2.75c-1.473,0-2.67,1.234-2.67,2.75v1.197H6.224c-2.343,0-4.25,1.907-4.25,4.25v24c0,2.344,1.907,4.25,4.25,4.25h24c2.344,0,4.25-1.906,4.25-4.25v-24C34.474,5.854,32.567,3.948,30.224,3.948z M25.286,2.75c0-0.689,0.524-1.25,1.17-1.25s1.17,0.561,1.17,1.25v4.895c0,0.689-0.524,1.25-1.17,1.25s-1.17-0.561-1.17-1.25V2.75z M17.206,2.75c0-0.689,0.525-1.25,1.17-1.25s1.17,0.561,1.17,1.25v4.895c0,0.689-0.525,1.25-1.17,1.25s-1.17-0.561-1.17-1.25V2.75z M9.125,2.75c0-0.689,0.525-1.25,1.17-1.25s1.17,0.561,1.17,1.25v4.895c0,0.689-0.525,1.25-1.17,1.25s-1.17-0.561-1.17-1.25V2.75z M31.974,32.199c0,0.965-0.785,1.75-1.75,1.75h-24c-0.965,0-1.75-0.785-1.75-1.75v-22h27.5V32.199z M10.706,25.578h0.166h0.91h0.909h0.91h0.91h0.909h0.911h0.909h0.91h0.91h0.909h0.909h0.91h0.91h0.909h0.909h0.91h0.908h0.91h0.91h0.354l0.321,0.15l0.192-0.416c0.002,0,0.002-0.004,0.002-0.006c0.023-0.058,0.041-0.119,0.041-0.187v-3.121c0-0.121-0.05-0.237-0.136-0.323l-9.102-9.043c-0.18-0.176-0.467-0.176-0.645,0l-9.102,9.043c-0.087,0.084-0.135,0.202-0.135,0.323v3.019l-0.15,0.324l0.828,0.385L10.706,25.578z M19.286,21.883h2.324v2.323h-2.324V21.883z M16.049,21.883h2.322v2.323h-2.322V21.883z M25.812,30.057l0.828,0.385l-0.193,0.414c-0.074,0.162-0.236,0.266-0.412,0.266h-0.459v-0.914h0.168L25.812,30.057z M18.295,30.206h0.911v0.914h-0.911V30.206zM16.477,30.206h0.909v0.914h-0.909V30.206z M12.835,30.206h0.911v0.914h-0.911V30.206z M14.658,30.206h0.909v0.914h-0.909V30.206zM9.198,30.206h0.91v0.914h-0.91V30.206z M11.018,30.206h0.909v0.914h-0.909V30.206z M23.756,30.206h0.909v0.914h-0.909V30.206zM21.936,30.206h0.91v0.914h-0.91V30.206z M20.116,30.206h0.91v0.914h-0.91V30.206z M7.446,30.91c-0.084-0.131-0.094-0.297-0.028-0.438l0.193-0.414l0.321,0.148h0.354v0.168l0.152,0.068l-0.152,0.322v0.354H7.831C7.675,31.12,7.53,31.042,7.446,30.91z M9.759,27.613l-0.828-0.385l0.438-0.943l0.828,0.385L9.759,27.613z M8.879,29.5l-0.829-0.386l0.439-0.942l0.829,0.385L8.879,29.5z M27.567,26.285l0.829,0.387l-0.438,0.943l-0.828-0.387L27.567,26.285zM26.69,28.172l0.828,0.385L27.079,29.5l-0.828-0.386L26.69,28.172z M18.371,26.035l-0.913,2.324h-2.323l0.914-2.324H18.371zM19.286,26.035h2.324l-0.914,2.324H18.37L19.286,26.035z"/>', {
size: '37x37',});new eSvg('tree', '<path d="M282.612,222.557v-49.849c0-17.342-14.058-31.402-31.398-31.402h-78.505V91.464c18.286-6.474,31.402-23.866,31.402-44.368c0-26.008-21.1-47.096-47.104-47.096c-26.008,0-47.102,21.087-47.102,47.096c0,20.502,13.117,37.894,31.4,44.368v49.842H62.803c-17.34,0-31.4,14.06-31.4,31.402v49.849C13.117,229.017,0,246.413,0,266.911c0,26.004,21.093,47.104,47.101,47.104s47.103-21.1,47.103-47.104c0-20.498-13.118-37.895-31.402-44.354v-49.849h78.503v49.849c-18.284,6.46-31.4,23.856-31.4,44.354c0,26.004,21.093,47.104,47.102,47.104c26.004,0,47.104-21.1,47.104-47.104c0-20.498-13.116-37.895-31.402-44.354v-49.849h78.505v49.849c-18.285,6.46-31.401,23.856-31.401,44.354c0,26.004,21.095,47.104,47.099,47.104c26.009,0,47.104-21.1,47.104-47.104C314.014,246.413,300.898,229.017,282.612,222.557z M47.102,282.612c-8.666,0-15.699-7.037-15.699-15.701c0-8.677,7.033-15.697,15.699-15.697c8.668,0,15.701,7.021,15.701,15.697C62.803,275.575,55.77,282.612,47.102,282.612z M157.007,282.612c-8.666,0-15.701-7.037-15.701-15.701c0-8.677,7.035-15.697,15.701-15.697c8.664,0,15.701,7.021,15.701,15.697C172.708,275.575,165.671,282.612,157.007,282.612z M157.007,62.803c-8.666,0-15.701-7.033-15.701-15.707c0-8.676,7.035-15.693,15.701-15.693c8.664,0,15.701,7.025,15.701,15.693C172.708,55.762,165.671,62.803,157.007,62.803z M266.911,282.612c-8.66,0-15.697-7.037-15.697-15.701c0-8.677,7.037-15.697,15.697-15.697c8.664,0,15.701,7.021,15.701,15.697C282.612,275.575,275.575,282.612,266.911,282.612z"/>', {
size: '315x315',});new eSvg('settings', '<path d="M17.567,15.938l-2.859-2.702c0.333-0.605,0.539-1.29,0.539-2.029c0-2.342-1.897-4.239-4.24-4.239c-2.343,0-4.243,1.896-4.243,4.239c0,2.343,1.9,4.241,4.243,4.241c0.826,0,1.59-0.246,2.242-0.654l2.855,2.699C16.536,16.922,17.023,16.399,17.567,15.938z"/><path d="M29.66,15.6l3.799-6.393c0.374,0.107,0.762,0.184,1.169,0.184c2.347,0,4.244-1.898,4.244-4.241c0-2.342-1.897-4.239-4.244-4.239c-2.343,0-4.239,1.896-4.239,4.239c0,1.163,0.469,2.214,1.227,2.981l-3.787,6.375C28.48,14.801,29.094,15.169,29.66,15.6z"/><path d="M42.762,20.952c-1.824,0-3.369,1.159-3.968,2.775l-5.278-0.521c0,0.04,0.006,0.078,0.006,0.117c0,0.688-0.076,1.36-0.213,2.009l5.276,0.521c0.319,2.024,2.062,3.576,4.177,3.576c2.342,0,4.238-1.896,4.238-4.238C47,22.85,45.104,20.952,42.762,20.952z"/><path d="M28.197,37.624l-1.18-5.156c-0.666,0.232-1.359,0.398-2.082,0.481l1.182,5.157c-1.355,0.709-2.29,2.11-2.29,3.746c0,2.342,1.896,4.237,4.243,4.237c2.342,0,4.238-1.896,4.238-4.237C32.311,39.553,30.479,37.692,28.197,37.624z"/><path d="M14.357,25.37l-6.57,2.201c-0.758-1.158-2.063-1.926-3.548-1.926C1.896,25.645,0,27.542,0,29.884c0,2.345,1.896,4.242,4.239,4.242c2.341,0,4.242-1.897,4.242-4.242c0-0.098-0.021-0.188-0.029-0.284l6.591-2.207C14.746,26.752,14.51,26.077,14.357,25.37z"/><circle cx="23.83" cy="23.323" r="7.271"/>', {
size: '47x47',});new eSvg('speed', '<path d="M175.205,239.62c0.127-1.965-0.533-3.902-1.833-5.381l-58.84-66.941c-1.3-1.479-3.135-2.381-5.102-2.508c-1.975-0.126-3.902,0.533-5.381,1.833c-27.037,23.766-49.479,51.794-66.706,83.305c-0.944,1.729-1.165,3.762-0.611,5.651c0.554,1.89,1.836,3.483,3.565,4.427l78.205,42.748c1.131,0.619,2.352,0.912,3.557,0.912c2.627,0,5.174-1.398,6.523-3.866c11.386-20.828,26.229-39.359,44.114-55.08C174.178,243.422,175.08,241.587,175.205,239.62z"/><path d="M201.462,214.829c1.334,2.515,3.907,3.948,6.568,3.948c1.174,0,2.365-0.279,3.473-0.867c20.962-11.117,43.512-18.371,67.025-21.561c4.064-0.551,6.913-4.293,6.362-8.358l-11.979-88.316c-0.551-4.064-4.304-6.909-8.358-6.362c-35.708,4.843-69.949,15.857-101.772,32.736c-3.623,1.922-5.002,6.416-3.082,10.041L201.462,214.829z"/><path d="M105.785,334.345l-86.017-23.338c-1.901-0.514-3.929-0.255-5.638,0.725s-2.958,2.598-3.475,4.499C3.586,342.295,0,369.309,0,396.523c0,4.657,0.111,9.329,0.342,14.284c0.185,3.981,3.468,7.083,7.414,7.083c0.116,0,0.234-0.002,0.35-0.008l89.031-4.113c1.967-0.09,3.82-0.96,5.145-2.415c1.327-1.455,2.022-3.38,1.93-5.347c-0.155-3.341-0.23-6.444-0.23-9.484c0-18.02,2.365-35.873,7.029-53.066C112.082,339.499,109.743,335.42,105.785,334.345z"/><path d="M438.731,120.745c-32.411-15.625-67.04-25.308-102.925-28.786c-1.972-0.198-3.918,0.408-5.439,1.659c-1.521,1.252-2.481,3.056-2.671,5.018l-8.593,88.712c-0.396,4.082,2.594,7.713,6.677,8.108c23.652,2.291,46.463,8.669,67.8,18.954c1.015,0.49,2.118,0.738,3.225,0.738c0.826,0,1.654-0.139,2.45-0.416c1.859-0.649,3.385-2.012,4.24-3.786l38.7-80.287C443.978,126.965,442.427,122.525,438.731,120.745z"/><path d="M569.642,245.337c0.48-1.911,0.184-3.932-0.828-5.624c-18.432-30.835-41.933-57.983-69.848-80.686c-1.529-1.242-3.48-1.824-5.447-1.627c-1.959,0.203-3.758,1.174-5,2.702l-56.237,69.144c-1.242,1.529-1.828,3.488-1.625,5.447c0.201,1.959,1.173,3.758,2.702,5.002c18.47,15.019,34.015,32.975,46.205,53.369c1.392,2.326,3.855,3.618,6.383,3.618c1.297,0,2.61-0.34,3.803-1.054l76.501-45.728C567.94,248.889,569.16,247.248,569.642,245.337z"/><path d="M598.044,304.939c-1.228-3.915-5.397-6.096-9.308-4.867l-85.048,26.648c-3.915,1.226-6.093,5.393-4.867,9.306c6.104,19.486,9.199,39.839,9.199,60.494c0,3.041-0.076,6.144-0.23,9.484c-0.092,1.967,0.602,3.892,1.93,5.347c1.327,1.456,3.178,2.325,5.145,2.415l89.031,4.113c0.118,0.005,0.234,0.008,0.35,0.008c3.944,0,7.228-3.103,7.414-7.083c0.229-4.955,0.342-9.627,0.342-14.284C612,365.306,607.306,334.494,598.044,304.939z"/><path d="M305.737,380.755c-1.281,0-2.555,0.042-3.824,0.11l-120.65-71.185c-2.953-1.745-6.702-1.308-9.176,1.065c-2.476,2.371-3.07,6.099-1.456,9.121l65.815,123.355c-0.242,2.376-0.371,4.775-0.371,7.195c0,18.608,7.246,36.101,20.403,49.258c13.158,13.158,30.652,20.404,49.26,20.404c18.608,0,36.101-7.248,49.258-20.404c13.158-13.157,20.403-30.65,20.403-49.258c0-18.608-7.246-36.101-20.403-49.258C341.839,388.001,324.344,380.755,305.737,380.755z"/>', {
size: '612x612',});new eSvg('diff', '<path d="M276.503,48.541V0H86.493L7.026,79.467v294.757h139.235v48.541h269.478V48.541H276.503z M82.392,23.899v51.467H30.925L82.392,23.899z M21.026,89.366h75.366V14h166.111v346.224H21.026V89.366z M401.739,408.765H160.261v-34.541h209.518v-14h-93.275v-15.38h93.275v-14h-93.275v-15.38h93.275v-14h-93.275v-15.38h93.275v-14h-93.275v-15.38h93.275v-14h-93.275v-15.38h93.275v-14h-93.275v-42.205h93.275v-14h-93.275V62.541h125.235V408.765z"/><rect x="52.986" y="104.746" width="177.558" height="14"/><rect x="52.986" y="160.951" width="177.558" height="14"/><rect x="52.986" y="190.331" width="177.558" height="14"/><rect x="52.986" y="219.711" width="177.558" height="14"/><rect x="52.986" y="249.091" width="177.558" height="14"/><rect x="52.986" y="278.471" width="177.558" height="14"/><rect x="52.986" y="307.851" width="177.558" height="14"/>', {
size: '423x423',});new eSvg('tab', '<path d="M0,153h51v-51H0V153z M0,255h51v-51H0V255z M0,51h51V0C22.95,0,0,22.95,0,51z M102,459h51v-51h-51V459z M0,357h51v-51H0V357z M51,459v-51H0C0,436.05,22.95,459,51,459z M408,0H204v153h255V51C459,22.95,436.05,0,408,0z M408,357h51v-51h-51V357zM102,51h51V0h-51V51z M408,459c28.05,0,51-22.95,51-51h-51V459z M408,255h51v-51h-51V255z M204,459h51v-51h-51V459z M306,459h51v-51h-51V459z"/>', {
size: '459x459',});new eSvg('sprite', '<rect width="35" height="9.423"/><rect x="25.578" y="12.788" width="9.422" height="9.424"/><rect x="12.789" y="12.788" width="9.422" height="9.424"/><rect y="12.788" width="9.424" height="9.424"/><rect x="25.578" y="25.577" width="9.422" height="9.423"/><rect x="12.789" y="25.577" width="9.422" height="9.423"/><rect y="25.577" width="9.424" height="9.423"/>', {
size: '35x35',});new eSvg('favicon', '<polygon points="83.155,234.108 102.504,306.111 130.978,306.111 166.979,194.202 137.708,194.202 116.353,267.542 97.629,194.202 69.048,194.202 49.742,267.542 28.775,194.202 0,194.202 35.419,306.111 64.238,306.111 			"/><polygon points="265.472,194.202 236.912,194.202 217.584,267.542 196.531,194.202 167.756,194.202 203.24,306.111 232.08,306.111 251.019,234.108 270.411,306.111 298.842,306.111 334.843,194.202 305.636,194.202 284.173,267.542 			"/><polygon points="473.392,194.202 451.973,267.542 433.292,194.202 404.668,194.202 385.34,267.542 364.395,194.202 335.577,194.202 371.082,306.111 399.879,306.111 418.818,234.108 438.146,306.111 466.662,306.111 502.664,194.202 			"/><path d="M251.321,35.764c-86.564,0-161.026,51.166-195.28,124.765h390.582C412.326,86.93,337.885,35.764,251.321,35.764z"/><path d="M251.321,466.9c86.585,0,160.961-51.144,195.28-124.765H56.084C90.338,415.734,164.758,466.9,251.321,466.9z"/>', {
size: '503x503',});new eSvg('color', '<path d="M423.257,51.829c-0.808-2.045-2.67-3.484-4.853-3.751c-2.177-0.266-4.335,0.682-5.612,2.472c-7.581,10.629-17.529,14.172-29.053,18.275c-9.292,3.31-18.901,6.73-29.286,14.186c-14.687,10.544-21.405,24.917-18.055,38.54l-0.358,0.459c-6.133-8.897-12.806-17.126-19.848-24.474c-32.947-34.378-78.984-55.046-126.311-56.703c-2.085-0.073-4.204-0.11-6.298-0.11c-52.846,0-103.428,23.624-138.775,64.813C9.646,146.512-5.939,199.853,2.051,251.882c0.668,4.349,1.504,8.743,2.487,13.063c12.996,57.202,46.189,100.717,91.069,119.383c11.063,4.602,22.222,6.934,33.163,6.934c27.183,0,50.926-14.539,65.143-39.889c5.404-9.646,8.891-19.621,10.36-29.651c0.866-5.92,0.274-11.835-0.3-17.567c-0.591-5.9-1.149-11.476-0.256-17.09c2.047-12.869,11.036-20.553,24.047-20.553c3.701,0,7.483,0.609,11.26,1.812c-4.422,8.11-8.438,15.854-11.947,23.032c-7.437,15.212-12.567,27.81-15.252,37.44c-1.655,5.939-6.052,21.722,4.67,29.164c3.405,2.363,7.722,3.197,12.215,2.361c4.049-0.752,16.369-3.041,51.378-42.896c9.396-10.695,19.521-23.072,30.104-36.794c27.168-9.15,48.31-31.921,53.903-58.087c1.4-6.541,1.984-13.541,1.735-20.812c10.172-15.72,19.094-30.388,28.072-46.156c0.172-0.304,0.342-0.628,0.51-0.96c13.031-3.569,24.254-13.71,30.842-27.891C434.872,106.028,434.163,79.428,423.257,51.829zM276.385,149.834c-4.713,7.485-12.814,11.954-21.673,11.954c-4.81,0-9.515-1.361-13.605-3.937c-5.782-3.642-9.803-9.317-11.316-15.98s-0.345-13.518,3.298-19.301c4.714-7.485,12.816-11.954,21.675-11.954c4.811,0,9.515,1.361,13.604,3.938c5.782,3.64,9.802,9.315,11.316,15.979C281.197,137.197,280.026,144.051,276.385,149.834zM309.592,196.187c12.934-19.057,26.612-38,39.604-54.85c2.106,1.902,4.461,3.76,7.012,5.53c4.227,2.933,8.648,5.201,13.164,6.754c-10.969,18.758-22.763,37.342-37.043,58.375c-23.463,34.571-47.859,66.684-68.695,90.424c-11.638,13.26-21.823,23.498-29.671,29.839c3.029-9.69,8.818-22.989,16.875-38.746C265.245,265.336,286.111,230.772,309.592,196.187z M82.506,196.023c-4.811,0-9.516-1.361-13.607-3.938c-5.782-3.641-9.801-9.314-11.315-15.979c-1.514-6.664-0.342-13.519,3.301-19.302c4.711-7.484,12.813-11.953,21.671-11.953c4.812,0,9.517,1.361,13.607,3.938c11.936,7.518,15.532,23.345,8.019,35.279C99.466,191.554,91.363,196.023,82.506,196.023zM55.688,252.358c4.713-7.486,12.814-11.955,21.673-11.955c4.81,0,9.514,1.362,13.606,3.938c5.782,3.641,9.801,9.315,11.315,15.979c1.515,6.662,0.343,13.516-3.301,19.301c-4.711,7.483-12.813,11.953-21.671,11.953c-4.811,0-9.517-1.361-13.609-3.938c-5.782-3.642-9.8-9.315-11.313-15.979C50.876,264.995,52.049,258.14,55.688,252.358z M137.62,100.414c4.713-7.485,12.815-11.954,21.673-11.954c4.809,0,9.514,1.361,13.604,3.937c11.937,7.516,15.533,23.344,8.019,35.28c-4.715,7.486-12.817,11.955-21.675,11.955c-4.81,0-9.515-1.361-13.605-3.938c-5.781-3.64-9.799-9.314-11.313-15.979C132.807,113.052,133.979,106.198,137.62,100.414z"/>', {
size: '432x432',});new eLog('auth');new eLog('ajax', 200);new eLog('ga', 200);new eLog('crud', 100);new eSubprogram('optionsMenu', function(options, name) {
var self = this;self.init = function() {
self.view  = _jO(cr('div', 'jOptionsMenu'));if ( def(name) ) {
self.title = self.view.cr('h5').VAL(name);}
self.cont  = self.view.cr('div');self.int = null;self._build();}
self._build = function() {
self.cont.innerHTML = '';map(options, function(optMap) {
var func = optMap[1]||function(){};var newNode;if ( typeof(optMap[0]) == 'string') {
newNode = self.cont.cr('div', 'fa').VAL(optMap[0]);} else {
newNode = optMap[0];self.cont.attach(newNode);}
clearEvents(newNode).onclick = function() {
func();self._close();return false;}
});}
self.open = function() {
document.body.attach(self.view);self.view.style.left = EVENT.data.cursor.x + 'px';self.view.style.top  = EVENT.data.cursor.y + 'px';EVENT.click.add(self.close);self.view.onclick = function() {
tm(function() {
clearInterval(self.int);});}
tm(function() {
clearInterval(self.int);});return false;}
self.close = function() {
self.int = tm(self._close, 10);}
self._close = function() {
self.view.detach();EVENT.click.remove(self.close);}
self.init();});window.OPT = SUBPROGRAM.optionsMenu;new eSubprogram('wysiwyg', function(onfinish) {
var self = this;var confImage = CONF.engine.articleImage;var phRe = /\<\!\-\-\%([^-:]+)\:?([^-]+)?/g;self.init = function(node, params) {
self.params = mergeObjects({
is_bb: false
}, params);self.node = _jO(node);node.__isHtml = true;self._isEditing = false;self._createPanel();self.wrapper = cr('div','wys_inside');self.wrapper.attach(self.panel);self.menuTarget = self.wrapper;self.bb_entities = {};self.fetchInt = null;self.blockElems = CONF.engine.defaultDomFilterRules.stackable.split(',');}
self.findComments = function(el) {
var arr = [];for(var i = 0; i < el.childNodes.length; i++) {
var node = el.childNodes[i];if(node.nodeType === 8) {
arr.push(node);} else {
arr.push.apply(arr, self.findComments(node));}
}
return arr;};self.filterInOut = function(html, callback) {
var t = cr('div');t.innerHTML = html;var comments = self.findComments(t);var q = new EQ(function() {
callback(t.innerHTML);});var processed = 0;map(comments, function(comment) {
var mp = comment.val.sl([1]).split(':');if ( def(self.bbMap[mp[0]]) ) {
processed += 1;q.add( function(done) {
self.bbMap[mp[0]](self, comment, mp.sl([1]), function(newNode) {
comment.insBefore(newNode);comment.detach();tm(done);}, function() {
tm(done);});});}
});if ( processed == 0 ) { q.doNext(); }
}
self.filterOutIn = function(html) {
self.bb_entities = {};var t = cr('div');t.innerHTML = html;mapO(self.bbRevMap, function(parser, selector) {
var nodeList = S(selector, t);map(nodeList, function(node) {
var presult = parser(self, node);if ( presult ) {
node.outerHTML = '<!--%'+presult.join(':')+'-->';}
});});return t.innerHTML;}
self.bbConf = CONF.project.bbRules || {in:{},out:{}};self.bbMap = self.bbConf.in;self.bbRevMap = self.bbConf.out;self.placeMenu = function(dom) {
self.menuTarget = dom;}
self.resetMenu = function() {
self.menuTarget = self.wrapper;}
self.ensureEmpty = function() {
var sel = window.getSelection();if ( sel.anchorNode && sel.anchorNode.nodeType != 1 && sel.anchorNode.parentNode == self.node.V.viewNode ) {
var node = setTag(sel.anchorNode, CONF.engine.defaultDomFilterRules.textwrap);}
}
self.focus = function() {
self.panel.addCls('active');}
self.blur  = function() {
self.panel.remCls('active');}
self.disableKeys = function(ev) {
self.ensureEmpty();if ( ev.keyCode == 9 ) {
ev.preventDefault();}
}
self.getBlockToFormat = function() {
var sel    = window.getSelection();var selObj = sel.anchorNode;if ( !selObj ) { return null; }
for ( var i = 0; !(selObj._tag && self.blockElems.contains(selObj._tag)); i++ ) {
selObj = selObj.parentNode;if ( !selObj || (selObj == self.node.V.viewNode) ) { return null; }
}
selObj.remattr('style');return selObj;}
self.formatBlock = function(tag) {
var selObj = self.getBlockToFormat();if ( !selObj ) { return null; }
selObj = setTag(selObj, tag);}
self.checkKeys = function(ev) {
if ( ev.keyCode == 9 ) {
ev.preventDefault();var selObj = self.getBlockToFormat();if ( !selObj ) { return false; }
if ( selObj._tag == 'pre' ) {
selObj = setTag(selObj, 'p');} else {
selObj = setTag(selObj, 'pre');}
} else {
self.ensureEmpty();}
}
self.edit = function() {
self.view();self.node.setView('div', 'editing', self._onupdate);self.node.V.viewNode.attr({contenteditable: 'true'});self.area = self.node.V.viewNode;insBefore(self.wrapper, self.node.V.viewNode);self.wrapper.attach(self.node.V.viewNode);self.menuTarget.attach(self.panel);EVENT.mousedown.push(self.fetchDynamics);self._isEditing = true;evt(self.node.V.viewNode, 'focus'   , self.focus);evt(self.node.V.viewNode, 'blur'    , self.blur );evt(self.node.V.viewNode, 'keydown' , self.disableKeys );evt(self.node.V.viewNode, 'keyup'   , self.checkKeys );if ( self.node.V.viewNode ) {
if ( self.params.is_bb ) {
self.filterInOut(self.node.V.viewNode.innerHTML, function(nhtml) {
self.node.V.viewNode.innerHTML = nhtml;domFilter(self.node.V.viewNode);});}
self.node.V.viewNode.onpaste = function(ev) {
tm(function() {
self.fetchDynamics();domFilter(self.node.V.viewNode);});}
domFilter(self.node.V.viewNode);}
}
self.view = function() {
if ( self._isEditing ) {
self.node.setView();insBefore(self.node, self.wrapper);self.wrapper.detach();self._isEditing = false;self.blur();evtDel(self.node.V.viewNode, 'focus'   , self.focus);evtDel(self.node.V.viewNode, 'blur'    , self.blur );evtDel(self.node.V.viewNode, 'keydown' , self.disableKeys );evtDel(self.node.V.viewNode, 'keyup'   , self.checkKeys );if ( self.node.V.viewNode ) {
self.node.V.viewNode.onpaste = function() {}
}
}
}
self._mediaById = {};self._updateImagesSrc = function(id, urlMap) {
map(self._mediaById[id], function(elem) {
self._galleryImageSetUrls(elem, urlMap);});self._onupdate();}
self._galleryImageProcessor = function(dom) {
clearEvents(_jO(dom)).__wysProc = true;dom._domFilterBlocked = true;self._mediaById[dom.D.media] = self._mediaById[dom.D.media] || [];self._mediaById[dom.D.media].add(dom);var reqThumb = {};reqThumb[confImage.thumbSize] = confImage.size[confImage.thumbSize];var reqPreview = {};reqPreview[confImage.startSize] = confImage.size[confImage.startSize];dom.onclick = function() {
_jO(dom);if ( !def(dom._selfOpt) ) {
var params = [
[PAGE.ld('crop preview'), function() {
cropImage(dom.D.media, reqPreview, function(urlMap) {
dom.attr('data-isfull', '0');delete dom._selfOpt;var rd = CO(reqThumb);var mp = rd[confImage.thumbSize].split('x');mp[2] = '2';rd[confImage.thumbSize] = mp.join('x');cropImage(dom.D.media, rd, function(urlMap) {
self._updateImagesSrc(dom.D.media, urlMap);}, {from:confImage.startSize,crop:false});});}]
];var flagNode = cr('div','flagInside');if ( dom.D.isfull == '1' ) {
cr.bool(null, flagNode).val = (true);flagNode.cr('span').VAL(PAGE.ld('basicimage'));params.splice(0,0, [flagNode, function() {
dom.attr('data-isfull', '0');delete dom._selfOpt;self._onupdate();SYS.notify(PAGE.ld('done'),'green');}]);} else {
cr.bool(null, flagNode).val = (false);flagNode.cr('span').VAL(PAGE.ld('basicimage'));params.splice(0,0, [flagNode,function() {
delete dom._selfOpt;if ( !def(dom.D[confImage.startSizeSingle]) ) {
var rd = [];rd[confImage.startSizeSingle] = confImage.size[confImage.startSizeSingle];cropImage(dom.D.media, rd, function(urlMap) {
self._updateImagesSrc(dom.D.media, urlMap);dom.attr('data-isfull', '1');self._onupdate();SYS.notify(PAGE.ld('done'),'green');}, {crop:false});} else {
dom.attr('data-isfull', '1');self._onupdate();SYS.notify(PAGE.ld('done'),'green');}
}]);}
dom._selfOpt = new OPT(params);}
dom._selfOpt.open();}
}
self._galleryImageSetUrls = function(dom, urlList) {
var size;if (_jO(dom).D.imagetype == 'image' ) {
size = confImage.size[confImage.startSize].split('x');if ( urlList[confImage.startSize] ) { dom.attr({'src': urlList[confImage.startSize]}); }
} else {
size = confImage.size[confImage.thumbSize].split('x');if ( urlList.basic )                      { dom.attr({'data-basic':urlList.basic}); }
if ( urlList[confImage.startSizeSingle] ) { dom.attr({'data-preprop':urlList[confImage.startSizeSingle]}); }
if ( urlList[confImage.startSize] )       { dom.attr({'data-preview':urlList[confImage.startSize]}); }
if ( urlList[confImage.thumbSize] )       { dom.attr({'src'         :urlList[confImage.thumbSize]}); }
}
dom.attr({
'width'   : size[0],'height'  : size[1]
});}
self.fetchDynamics = function() {
map(S('img', self.node.V.viewNode), function(node) {
if ( !node.__wysProc ) {
node.__wysProc = true;var type = node.attr('data-imagetype');if ( type == "image" ) {
var media_id = node.attr('data-media');self._mediaById[media_id] = self._mediaById[media_id] || [];self._mediaById[media_id].add(node);node.onclick = function() {
var reqD = {};reqD[confImage.startSize] = confImage.size[confImage.startSize];cropImage(media_id, reqD, function(dims) {
self._updateImagesSrc(media_id, dims);});}
} else if ( type == "gallery-image" ) {
self._galleryImageProcessor(node);}
}
});map(S('a', self.node.V.viewNode), function(node) {
if ( !node.__wysProc ) {
node.__wysProc = true;node.__eView = _jO(cr('div','dragStyle'));node.__eView.cr('p').VAL(PAGE.ld('link'));node.__eView.V.link = node.__eView.cr('input').attr({type:'text'});node.__eView.cr('p').VAL(PAGE.ld('text'));node.__eView.V.text = node.__eView.cr('input').attr({type:'text'});node.__eView.cr('p').VAL(PAGE.ld('new tab'));node.__eView.V.ntab = cr.bool(null,node.__eView).VAL(true);node.__eView.V.submit = node.__eView.cr('div', 'asBtn').VAL(PAGE.ld('save'));clearEvents(node).onclick = function() {
if ( self._isEditing ) {
node.__eView.V.link.val = node.href;node.__eView.V.text.val = node.val;node.__eView.V.ntab.val = !node.attr('data-ct');var inst = POP.drag.showNew(node.__eView, null, {isSmall:true});node.__eView.V.submit.onclick = function() {
node.href = node.__eView.V.link.val;node.val  = node.__eView.V.text.val;if ( node.__eView.V.ntab.val ) {
node.remattr('data-ct');} else {
node.attr('data-ct','this');}
inst.hide();self._onupdate();}
return false;}
}
}
});}
self._onupdate = function(val) {
if ( !def(val) ) { val = self.node.V.viewNode.val; }
self.fetchDynamics();domFilter(self.node.V.viewNode);if ( self.params.is_bb ) {
val = self.filterOutIn(val);}
self.onupdate(val);}
self.onupdate = function(val) {}
self._createPanel = function() {
var panel = _jO(cr('div', 'wys_container'));self.panel = panel;panel.V.block = panel.cr('div', 'wys_panel fa');self._createButton('SVG:bold'        , 'bold');self._createButton('SVG:italic'      , 'italic');self._createButton('T,u bigText'     , 'underline');self._createButton('T,s bigText'     , 'strikeThrough');self._createButton('SVG:alignLeft'   , 'justifyLeft');self._createButton('SVG:alignRight'  , 'justifyRight');self._createButton('SVG:alignCenter' , 'justifyCenter');self._createButton('SVG:alignFull'   , 'justifyFull');self._createNodeBtn('SVG:header,big' , function() { self.formatBlock('h3'); });self._createNodeBtn('SVG:text,big'   , function() { self.formatBlock('p'); });self._createNodeBtn('SVG:quote'      , function() { self.formatBlock('blockquote'); });var colBlock = self.panel.V.block.cr('div', 'colBlock');self._createButton(',col'     , 'foreColor,hiliteColor',   '#000' , colBlock);self._createButton(',col'     , 'foreColor,hiliteColor',   '#a20' , colBlock);self._createButton(',col'     , 'foreColor,hiliteColor',   '#EB9C14' , colBlock);self._createButton(',col'     , 'foreColor,hiliteColor',   '#E0EB14' , colBlock);self._createButton(',col'     , 'foreColor,hiliteColor',   '#2B6B0D' , colBlock);self._createButton(',col'     , 'foreColor,hiliteColor',   '#14A3EB' , colBlock);self._createButton(',col'     , 'foreColor,hiliteColor',   '#1469EB' , colBlock);self._createButton(',col'     , 'foreColor,hiliteColor',   '#5D0D6B' , colBlock);var imageCreation = function(file, func) {
createImage(confImage.type, file, confImage.size, function(urlList, media) {
var newNode = cr('img', 'pr_gallery').attr({
'data-imagetype': 'gallery-image','data-media':     media.id,'data-isfull':    '1'
});self._galleryImageProcessor(newNode);self._galleryImageSetUrls(newNode, urlList);func(newNode);});}
var imageInsertion = function(file, selName) {
imageCreation(file, function(newNode){
if ( selName ) { restoreSelection(selName); }
insToSelection(newNode);});}
self._galSelector = cr('input').attr({type:'file',multiple:'true'});self._galSelector.onchange = function(ev) {
map(ev.target.files, imageInsertion);}
self._createNodeBtn('SVG:image,big', function(ev) {
self._galSelector.click();return false;});self._createNodeBtn('SVG:imagelink,big', function(ev) {
saveSelection('sel_linkimage');SYS.input(PAGE.ld('image link'), 'center', function(url) {
var newUrl = PROTOCOL.proxy.getUrl(url);imageInsertion(newUrl,'sel_linkimage');});return false;});self._createNodeBtn('SVG:imagesync,big', function(ev) {
var images = S('img', self.node.V.viewNode);map(images, function(image) {
var url = image.src;if ( url ) {
var purl = ENGINE.getUrlData(url);if ( !purl.own ) {
if ( image.parentNode._tag == 'a' ) {
insBefore(image, image.parentNode);}
var rurl = PROTOCOL.proxy.getUrl(url);imageCreation(rurl, function(newNode) {
insBefore(newNode, image);detach(image);});}
}
})
return false;});self._createNodeBtn('SVG:link,big', function(ev) {
document.execCommand('insertHTML', false, '<a href="">link</a>');return false;});self.htmlOptsData = [];RNG(ORM.model.htmlblock).each(function(obj) {
self.htmlOptsData.push([obj.title, function() {
document.execCommand('insertHTML', false, '<img src="'+ENGINE.path.static+'/images/empty_disabled.png" data-imagetype="html" data-media="'+obj.id+'" alt=\'html "'+obj.title+'"\' />');}]);});self.htmlOpts = new OPT(self.htmlOptsData);self._createNodeBtn('SVG:html,big', function(ev) {
self.htmlOpts.open();return false;});self._createNodeBtn('#,bigText', function(ev) {
var sel = getSel();var txt = sel && sel.toString().rp('#','').replace(/[^\wа-яґєії]+/gi,'') || 'tag';txt = txt.toLowerCase();document.execCommand('insertHTML', false, '<a href="about:tag">#'+txt+'</a>');return false;});self._createButton('SVG:close,big' , 'removeFormat');return panel;}
self._createVisual = function(strMap, parent) {
strMap = parseLS(strMap);var button = self.panel.V.block.cr('div','asBtn fa '+strMap[1]||'');if ( strMap[0].indexOf('SVG:') == 0 ) {
SVG[strMap[0].sl([4])](button);} else {
button.VAL(PAGE.ld(strMap[0]));}
if ( parent ) {
parent.attach(button);}
clearEvents(button);return button
}
self._createButton = function(strMap, commMap, attr, parent) {
var button = self._createVisual(strMap, parent);commMap = parseLS(commMap);if ( attr && attr[0] == '#' ) { button.style.backgroundColor=attr; }
button.onclick = function() {
if ( EVENT.data.key.ctrl && commMap[1] ) {
document.execCommand(commMap[1], false, attr);} else {
document.execCommand(commMap[0], false, attr);}
return false;}
}
self._createNodeBtn = function(strMap, func) {
var button = self._createVisual(strMap);button.onclick = func;}
});function wysiwyg(node, menuBlock, params) {
if ( !def(node._wysiwyg) ) {
node._wysiwyg = new SUBPROGRAM.wysiwyg();node._wysiwyg.init(node, params);}
if ( def(menuBlock) ) {
node._wysiwyg.placeMenu(menuBlock);}
return node._wysiwyg;}
new eSubprogram('fbshare', function() {
var self = this;self.init = function() {
self.fbsharepassed = (glob('fbsharepassed') == 'true') && true || false;tm(self.prepDom);}
self.prepDom = function() {
self.view = self.view || VIEW.fbshare();document.body.attach(self.view);try{
FB.XFBML.parse(); 
}catch(ex){}
}
self.show = function(data) {
data = data || {};if ( glob('fbsharepassed') != 'true' && !data.hard ) {
self.view.F.setLangData();self.view.F.show();}
}
self.hide = function() {
if ( self.view ) {
self.view.F.hide();}
}
self.init();});if ( !CONF.project.disableFBShare ) {
SYS.fbshare = new SUBPROGRAM.fbshare();}
new eSubprogram('equeue', function(onfinish) {
var self = this;self.init = function() {
self.todo = [];self.working = false;self.todoLeft = 0;ENGINE._clear.add(self.clear);}
self.add = function(func) {
self.todo.push(func);self.todoLeft += 1;self.doNext();}
self.doNext = function() {
if ( !self.working ) {
if ( self.todo.length > 0 ) {
if ( !self.working ) {
var func = self.todo.splice(0, 1)[0];func(function() {
self.todoLeft -= 1;self.working = false;self.doNext();});self.working = true;}
} else if ( self.todoLeft == 0 ) {
onfinish();}
}
}
self.clear = function() {
ENGINE._clear.remove(self.clear);self.doNext = function(){};}
self.init();});window.EQ = SUBPROGRAM.equeue;new eSubprogram('tableSorter', function(onfinish) {
var self = this;self.init = function() {
self.curTable = null;self.fields = [];self.lines = [];self.sortBtns = {};self._sortTypes = {
text: [function(a,b,field) {
var af = a.__sortData[field];var bf = b.__sortData[field];return (af > bf) ? -1 : (af < bf) ? 1 : 0;},function(a,b,field) {
var af = a.__sortData[field];var bf = b.__sortData[field];return (af < bf) ? -1 : (af > bf) ? 1 : 0;}],number: [function(a,b,field) {
return b.__sortData[field] - a.__sortData[field];},function(a,b,field) {
return a.__sortData[field] - b.__sortData[field];}]
}
}
self.setTable = function(table, headerAt) {
self.curTable = table;self.headerAt = headerAt||0;self._fetchHeader();self._fetchTable();}
self.sort = function(field, state) {
if ( !self.curTable ) { return 0; }
mapO(self.sortBtns, function(btn) {
btn.state(0);});state = Math.max(Math.min(state, 3), 0);if ( state == 3 ) { state = 1; }
self.sortBtns[field].state(state);if ( state == 1) {
self.lines.sort(function(a,b) {
return self._sortTypes[a.__sortType[field]][1](a,b,field);});} else {
self.lines.sort(function(a,b) {
return self._sortTypes[a.__sortType[field]][0](a,b,field);});}
map(self.lines, function(line) {
self.curTable.attach(line);});}
self._fetchHeader = function() {
if ( !self.curTable ) { return 0; }
self.fields = [];self.sortBtns = {};var row = S('tr', self.curTable)[self.headerAt];map(S('th', row), function(btn) {
var field = btn.val;SVG.clearBg(btn);btn._state = 0;btn.state = function(val) {
val = Math.max(Math.min(val, 2), 0);if ( val == 1 ) {
SVG.arrTop.bg(btn);} else if ( val == 2 ) {
SVG.arrBottom.bg(btn);} else {
SVG.clearBg(btn);}
btn._state = val;}
clearEvents(btn).onclick = function() { self.sort(field, btn._state += 1); return false; }
self.fields.push(field);self.sortBtns[field] = btn;})
}
self._fetchTable = function() {
if ( !self.curTable ) { return 0; }
var list = S('tr', self.curTable);list.splice(0,self.headerAt+1);self.lines = list;map(self.lines, function(line) {
line.__sortData = {};line.__sortType = {};var rows = S('td', line);map(self.fields, function(field, index) {
var val = rows[index].val;line.__sortData[field] = val;if ( parseFloat(val) == val ) {
line.__sortType[field] = 'number';} else {
line.__sortType[field] = 'text';}
});});}
self.init();});function dataURItoBlob(dataURI, type) {
type = type||'image/jpeg';var binary = atob(dataURI.split(',')[1]);var ab = new ArrayBuffer(binary.length);var ia = new Uint8Array(ab);for (var i = 0; i < binary.length; i++) {
ia[i] = binary.charCodeAt(i);}
var result = new Blob([ab], { type: type });return result;}
function cropClass() {
function initCrop() {
cropBlock            = cr('div', 'jCrop noanim');cropCont.imgBlock    = cropBlock.cr('div', 'jCropImgBlock noanim');cropCont.canvasBlock = cropBlock.cr('div', 'jCropCanvasBlock noanim');cropCont.canvasBlock.cr('h3').VAL('Создание миниатюры');cropCont.canvasBlock.cr('div').VAL('Выберите область на основной фотографии, которая будет отображаться в миниатюре на сайте.');cropCont.canvas      = cropCont.canvasBlock.cr('canvas').attr({width: 200, height: 200});cropCont.submit      = cropCont.canvasBlock.cr('input').attr({type:'button'}).VAL('Сохранить');cropCont.cancel      = cropCont.canvasBlock.cr('input').attr({type:'button'}).VAL('Отмена');cropCont.img         = cropCont.imgBlock.cr('img', 'jCropImg');cropCont.posBlock    = cropCont.imgBlock.cr('div', 'jCropPosBlock noanim');cropCont.dragBlock   = cropCont.posBlock.cr('div', 'jCropDrag');cropCont.sizeBlock   = listToArray([
cropCont.posBlock.cr('div', 'jCropSize'),cropCont.posBlock.cr('div', 'jCropSize'),cropCont.posBlock.cr('div', 'jCropSize'),cropCont.posBlock.cr('div', 'jCropSize')
]);cVars.minsize = [0,0];cVars.ctx = cropCont.canvas.getContext('2d');cVars.doMove = false;cVars.doResize = false;cropCont.dragBlock.onmousedown = function(ev) {
cVars.pbPos = self.cropGetPos();cVars.doMove = true;return false;}
cropCont.sizeBlock.map(function(elem) {
elem.onmousedown = function(ev) {
cVars.pbPos = self.cropGetPos();cVars.doResize = true;return false;}
} );cropBlock.onmousemove = function(ev) {
if ( cVars.doMove ) {
var pos  = self.cropGetPos();self.cropSetPos(ev.pageX-cVars.selfPos[0]-cVars.cursize[0]/2, ev.pageY-cVars.selfPos[1]-cVars.cursize[1]/2);self.cropDrawPart();} else if ( cVars.doResize ) {
self.cropSetSize(ev.pageX-cVars.selfPos[0], ev.pageY-cVars.selfPos[1]);self.cropDrawPart();}
return false;}
cropBlock.onmouseup = function(ev) {
cVars.doMove = false;cVars.doResize = false;return false;}
cropCont.submit.onclick = function() {
if ( def(cVars.func) ) {
var file = cropCont.canvas.toDataURL("image/jpeg", 0.9);cVars.func(file, dataURItoBlob(file));}
cropBlock.detach();readerGlob.cropInProgress = false;self.cropNext();}
cropCont.cancel.onclick = self.close;}
this.close = function() {
cropBlock.detach();readerGlob.cropInProgress = false;self.cropNext();}
this.cropDrawPart = function() {
var pos = self.cropGetPos();var startX = -pos[0]*cVars.scale / cVars.imgScale;;var startY = -pos[1]*cVars.scale / cVars.imgScale;;var endX = cVars.trueSize.width / cVars.imgScale;var endY = cVars.trueSize.height / cVars.imgScale;cVars.ctx.drawImage(cropCont.img, startX, startY, endX, endY);}
this.cropGetPos = function() {
var pos = getOffsetRect(cropCont.posBlock);return [pos.left-cVars.selfPos[0]+5000, pos.top-cVars.selfPos[1]+5000];}
this.cropSetPos = function(x ,y) {
x = parseInt(x);y = parseInt(y);if ( y < 0 ) {
cropCont.posBlock.style.top = '5000;px';} else if ( y + cVars.cursize[1] > cVars.viewSize.height ) {
cropCont.posBlock.style.top = cVars.viewSize.height - cVars.cursize[1] - 5000 + 'px'
} else {
cropCont.posBlock.style.top  = y - 5000 + 'px';}
if ( x < 0 ) {
cropCont.posBlock.style.left = '5000;px';} else if ( x + cVars.cursize[0] > cVars.viewSize.width ) {
cropCont.posBlock.style.left = cVars.viewSize.width - cVars.cursize[0] - 5000 + 'px'
} else {
cropCont.posBlock.style.left  = x - 5000 + 'px';}
}
this.cropSetSize = function(x, y) {
newPos = self.calcSizeDots(x, y);if ( 1 ) {
var newX = newPos[2] - newPos[0];var newY = newPos[3] - newPos[1];self.cropSetPos(newPos[0], newPos[1]);cropCont.posBlock.style.width  = newX+'px';cropCont.posBlock.style.height = newY+'px';cVars.cursize = [newX, newY];cVars.imgScale = newX / cVars.minsize[0];}
}
this.calcSizeDots = function(x, y) {
var calcPoint = [0,0];var newPoint  = [0,0];var result    = [0,0,0,0];var pos1  = self.cropGetPos();var pos2  = [parseInt(pos1[0]+cVars.cursize[0]), parseInt(pos1[1]+cVars.cursize[1])];var diffX = 0;var diffY = 0;function _diffLimit() {
if ( newPoint[0] <= 0 ) {
newPoint[0] = 0;var temp = Math.abs(calcPoint[0] - newPoint[0]) / cVars.proportion;if ( y < calcPoint[1] ) { temp *= -1;}
newPoint[1] = calcPoint[1] + temp;}
if ( newPoint[0] >= cVars.viewSize.width ) {
newPoint[0] = parseInt(cVars.viewSize.width);var temp = Math.abs(calcPoint[0] - newPoint[0]) / cVars.proportion;if ( y < calcPoint[1] ) { temp *= -1;}
newPoint[1] = calcPoint[1] + temp;}
if ( newPoint[1] <= 0 ) {
newPoint[1] = 0;var temp = Math.abs(calcPoint[1] - newPoint[1]) * cVars.proportion;if ( x < calcPoint[0] ) { temp *= -1;}
newPoint[0] = calcPoint[0] + temp;}
if ( newPoint[1] >= cVars.viewSize.height ) {
newPoint[1] = parseInt(cVars.viewSize.height);var temp = Math.abs(calcPoint[1] - newPoint[1]) * cVars.proportion;if ( x < calcPoint[0] ) { temp *= -1;}
newPoint[0] = calcPoint[0] + temp;}
}
function _diffX() {
var temp = diffX / cVars.proportion;if ( y < calcPoint[1] ) { temp *= -1;}
newPoint[0] = x;newPoint[1] = calcPoint[1] + temp;}
function _diffY() {
var temp = diffY * cVars.proportion;if ( x < calcPoint[0] ) { temp *= -1;}
newPoint[1] = y;newPoint[0] = calcPoint[0] + temp;}
if ( Math.abs(pos1[0] - x) > Math.abs(pos2[0] - x) ) {
calcPoint[0] = pos1[0];} else {
calcPoint[0] = pos2[0];}
if ( Math.abs(pos1[1] - y) > Math.abs(pos2[1] - y) ) {
calcPoint[1] = pos1[1];} else {
calcPoint[1] = pos2[1];}
diffX = Math.abs(calcPoint[0] - x);diffY = Math.abs(calcPoint[1] - y);if ( diffX < cVars.minsize[0] && diffY < cVars.minsize[1] ) {
if ( x > calcPoint[0] ) {
newPoint[0] = calcPoint[0] + cVars.minsize[0];} else {
newPoint[0] = calcPoint[0] - cVars.minsize[0];}
if ( y > calcPoint[1] ) {
newPoint[1] = calcPoint[1] + cVars.minsize[1];} else {
newPoint[1] = calcPoint[1] - cVars.minsize[1];}
} else if ( diffX > diffY * cVars.proportion ) {
_diffX();_diffLimit();} else {
_diffY();_diffLimit();}
if ( newPoint[0] < calcPoint[0] ) {
if ( newPoint[1] < calcPoint[1] ) {
result = [newPoint[0], newPoint[1], calcPoint[0], calcPoint[1]];} else {
result = [newPoint[0], calcPoint[1], calcPoint[0], newPoint[1]];}
} else {
if ( newPoint[1] > calcPoint[1] ) {
result = [calcPoint[0], calcPoint[1], newPoint[0], newPoint[1]];} else {
result = [calcPoint[0], newPoint[1], newPoint[0], calcPoint[1]];}
}
result[0] = parseInt(result[0]);result[1] = parseInt(result[1]);result[2] = parseInt(result[2]);result[3] = parseInt(result[3]);return result;}
this.crop = function(dataUri, dims, func, additionalBtn) {
if ( def(additionalBtn) ) {
if ( def(self.addBtn) ) { self.addBtn.detach(); }
self.addBtn = additionalBtn;}
readerGlob.cropQueue.add([dataUri, dims, func]);self.cropNext();}
this.cropNext = function() {
if ( !readerGlob.cropInProgress && readerGlob.cropQueue.length > 0 ) {
readerGlob.cropInProgress = true;var data = readerGlob.cropQueue[0];self.doCrop(data[0], data[1], data[2]);readerGlob.cropQueue.splice(0, 1);}
}
this.doCrop = function(dataUri, dims, func) {
dims = dims.split('x');if ( !def(cropBlock) ) { initCrop(); }
if ( def(self.addBtn) ) {
cropCont.canvasBlock.attach(self.addBtn);}
cVars.func = func;cropCont.imgBlock.remattr('style');cropBlock.remattr('style');cropCont.canvas.remattr('style');cropCont.canvasBlock.remattr('style');cropCont.posBlock.remattr('style');var sidebarSize = 300;var previewSize = [dims[0], dims[1]];if ( previewSize[0] > 300 ) {
var ratio = previewSize[0] / previewSize[1];previewSize[0] = 300;previewSize[1] = previewSize[0] / ratio;}
cropCont.canvasBlock.style.width = sidebarSize+'px';cropCont.canvas.style.width      = previewSize[0]+'px';cropCont.canvas.style.height     = previewSize[1]+'px';cropCont.canvas.attr({
width: dims[0],height: dims[1]
});var imgNode = new Image();function imgLoadedFn() {
document.body.attach(cropBlock);setTimeout(function() {
cVars.trueSize = { width: imgNode.naturalWidth || imgNode.width, height: imgNode.naturalHeight || imgNode.height};cVars.viewSize = { width: cropCont.img.offsetWidth, height: cropCont.img.offsetHeight};if ( cVars.trueSize.width < dims[0] || cVars.trueSize.height < dims[1] ) {
dims[0] = Math.min(dims[0], cVars.trueSize.width);dims[1] = Math.min(dims[1], cVars.trueSize.height);self.crop( dataUri, dims.join('x'), func );cropBlock.detach();readerGlob.cropInProgress = false;self.cropNext();return false;}
var ratio = cVars.viewSize.width / cVars.viewSize.height;cVars.viewSize.width -= 40;var rOffset = sidebarSize + cVars.viewSize.width - cropBlock.offsetWidth;if ( rOffset > 0 ) {
cVars.viewSize.width -= rOffset;}
cVars.viewSize.height = cVars.viewSize.width / ratio;var imgBlockLeftOffset = (cropBlock.offsetWidth  - sidebarSize - cVars.viewSize.width)/2;var imgBlockTopOffset  = (cropBlock.offsetHeight - cVars.viewSize.height)/2;cropCont.imgBlock.style.width    = cVars.viewSize.width+'px';cropCont.imgBlock.style.height   = cVars.viewSize.height+'px';cropCont.imgBlock.style.left     = sidebarSize+imgBlockLeftOffset+'px';cropCont.imgBlock.style.top      = imgBlockTopOffset+'px';cropBlock.style.width  = cropBlock.offsetWidth +'px';cropBlock.style.height = cropBlock.offsetHeight+'px';cVars.selfPos = getOffsetRect(cropCont.imgBlock);cVars.selfPos = [cVars.selfPos.left, cVars.selfPos.top];cVars.imgScale   = 1;cVars.proportion = dims[0] / dims[1];cVars.scale      = cVars.trueSize.width / cVars.viewSize.width;cVars.minsize    = [dims[0]/cVars.scale, dims[1]/cVars.scale];cVars.cursize    = [dims[0]/cVars.scale, dims[1]/cVars.scale];cropCont.posBlock.style.left = (-1 * parseInt(5000)) + cVars.viewSize.width/2 - cVars.minsize[0]/2+'px';cropCont.posBlock.style.top = (-1 * parseInt(5000)) + cVars.viewSize.height/2 - cVars.minsize[1]/2+'px';cropCont.posBlock.style.width = cVars.minsize[0]+'px';cropCont.posBlock.style.height = cVars.minsize[1]+'px';self.cropDrawPart();setTimeout(imgNode.del, 100);}, 100);return false;}
imgNode.src = dataUri;imgNode.onload  = imgLoadedFn;imgNode.onerror = imgLoadedFn;cropCont.img.src = dataUri;}
var self = this;var CANVAS = cr('canvas')
var CONTEXT = CANVAS.getContext("2d");self.addBtn = null;var cropBlock = null;var cropCont = {};var cVars = {};}
var CROP = new cropClass();function imageReader() {
this.read = function(file, dims) {
FILE = file;if ( def(dims) ) { DIMS = dims; }
reader.readAsDataURL(file);}
this.readendDoFunc = function(imgMap, j, len, dataUri) {
self.createResizedImg(dataUri, DIMS[j/2], function(tempImgMap) {
imgMap[j] = tempImgMap[0];imgMap[j+1] = tempImgMap[1];if ( j == len-2 ) {
self.onready.apply(null, imgMap);}
} );}
this.readend = function(ev) {
var dataUri = reader.result;var imgMap = [];for ( var i = 0, len = parseInt(DIMS.length)*2; i < len; i += 2 ) {
self.readendDoFunc(imgMap, i, len, dataUri);}
}
this.getImageDimetions = function(node) {
var imgNode = cr('img');imgNode.src = node.src;var result = { width: imgNode.naturalWidth || imgNode.width, height: imgNode.naturalHeight || imgNode.height};imgNode.detach();delete imgNode;return result;}
this.getImageDimetionsCallback = function(node, func) {
var imgNode = cr('img');imgNode.src = node.src;imgNode.onload = function() {
var result = { width: imgNode.naturalWidth || imgNode.width, height: imgNode.naturalHeight || imgNode.height};imgNode.detach();delete imgNode;func(result);}
}
this.createResizedImg = function(dataUri, format, doFunc) {
var tempImg = cr('img');tempImg.src = dataUri;self.getImageDimetionsCallback(tempImg, function(trueSize) {
var ratio = trueSize.width / trueSize.height;var formatRatio = 0;var newWidth = null;var newHeight = null;var formatProp = 1;var cnvOffsetX = 0;var cnvOffsetY = 0;if ( def(format) && format != 'any' ) {
var formatMap = format.split('x');newWidth = parseInt(formatMap[0]);newHeight = parseInt(formatMap[1]);formatProp = parseInt(formatMap[2]);formatRatio = newWidth / newHeight;if ( newWidth <= trueSize.width || newHeight <= trueSize.height ) {
var proportion = 1;if ( trueSize.width < newWidth )   { newWidth = trueSize.width; }
if ( trueSize.height < newHeight ) { newHeight = trueSize.height; }
if ( formatProp == 1 ) {
if ( newWidth / ratio <= newHeight ) {
newHeight = newWidth / ratio;if ( newHeight > formatMap[1] ) {
proportion = newHeight / formatMap[1];}
} else {
newWidth = newHeight * ratio;if ( newWidth > formatMap[1] ) {
proportion = newWidth / formatMap[1];}
}
newWidth /= proportion;newHeight /= proportion;} else if ( formatProp == 2 ) {
if ( formatRatio > ratio ) {
proportion = trueSize.height / (trueSize.width/newWidth);cnvOffsetY = (proportion- formatMap[1])/2;} else {
proportion = trueSize.width / (trueSize.height/newHeight);cnvOffsetX = (proportion - formatMap[0])/2;}
}
} else {
newWidth = trueSize.width;newHeight = trueSize.height;}
} else {
newWidth = trueSize.width;newHeight = trueSize.height;}
CANVAS.width = newWidth;CANVAS.height = newHeight;CONTEXT.drawImage(tempImg, -cnvOffsetX, -cnvOffsetY, newWidth+cnvOffsetX*2, newHeight+cnvOffsetY*2);var file = CANVAS.toDataURL("image/jpeg", 0.9);tempImg.detach();delete tempImg;doFunc([file, dataURItoBlob(file)]);} );}
this.onready = function(dataUri, file){}
this.onerror = function(){}
var self = this;var reader = new FileReader();var FILE = null;var DIM = null;var CANVAS = cr('canvas')
var CONTEXT = CANVAS.getContext("2d");reader.onloadend = function(ev) { self.readend(ev); }
reader.onerror = function(ev) { log(['err: imageReader', ev]); self.onerror(ev); }
}
imageReader.prototype = CROP;var readerGlob = {
cropQueue: [],cropInProgress: false,ref: new imageReader()
};function fileName(file) {
var nameMap = (file.name || file.fileName || 'file').split('.');if ( nameMap.length >= 2 ) {
nameMap.splice(nameMap.length-1,1);}
nameMap.push('jpg');return nameMap.join('.');}
function resizeImage(file, dims, func) {
var resizeType = Math.max(dims.split('x')[2]||1, 1);var name = fileName(file)||(new Date()*1).toString();var reader = new imageReader();if ( T(file) == T.S ) {
if ( resizeType <= 2 ) {
reader.createResizedImg(file, dims, function(resp) {
var a = resp[0];var b = resp[1];func(a,b,name);});} else {
CROP.crop(file, dims, function(a, b) {
func(a,b,name);});}
return 0;}
if ( resizeType <= 2 ) {
reader.onready = function(a,b) {
func(a,b,name);};reader.read(file, [dims]);} else {
reader.onready = function(dataUri, file) {
CROP.crop(dataUri, dims, function(a,b) {
func(a,b,name);});};reader.read(file, ["1920x1080x1"]);}
}
function __recalcSingleSize(media_id, dims, tag, q, nFile, nName) {
q.add(function(done) {
resizeImage(nFile, dims, function(dUri, dFile) {
PROTOCOL.media.write([media_id, tag].join('_')+':upload', {file:[dFile,nName]}, function() {
SYS.notify(PAGE.ld('image '+dims+' uploaded'), 'ok');done();});});});}
function getMediaFileUrl(tag, id, ext) {
if ( typeof(tag) == 'object' ) {
ext = tag.ext;id = tag.media_id;tag = tag.tag;}
return [ENGINE.path.media_raw, (new Date()*1), '/', tag, '-', id, '.', ext].join('');}
function getImage(media_id, func) {
ORM.req('mediafile:select', function(fileList) {
var result = {};map(fileList, function(file) {
result[file.tag] = getMediaFileUrl(file);});func(result);}, {
selector: {
media_id: ['=', media_id ]
}
});}
function createImage(mediatypeName, file, dims, func) {
ORM.prep('mediatype_'+mediatypeName, function(mediatype) {
resizeImage(file, "1920x1080x1", function(buri, bfile, bName) {
ORM.req('media:insert', {mediatype_id:mediatype.id}, function(media) {
media = media[0];PROTOCOL.media.write(media.id+'_basic:upload', {file:[bfile,bName]}, function() {
SYS.notify(PAGE.ld('basic image uploaded'),'ok');var q = new EQ(function() {
ORM.req('mediafile:select', function(fileList) {
var result = {};map(fileList, function(file) {
result[file.tag] = getMediaFileUrl(file);});func(result, media);}, {
selector: {
media_id: ['=', media.id ]
}
});});mapO(dims, function(dim, tag) {
__recalcSingleSize(media.id, dim, tag, q, bfile, bName);})
});});});});}
function cropImage(media_id, dims, func, rdata) {
rdata = mergeObjects({
from: 'basic',crop: true
}, rdata);func = func || function() {};ORM.req('mediafile:select', function(fileList) {
var result = {};var resObj = {};map(fileList, function(file) {
result[file.tag] = getMediaFileUrl(file);resObj[file.tag] = file;});var q = new EQ(function() {
func(result);});mapO(dims, function(dim, tag) {
q.add(function(done) {
if ( rdata.crop ) {
CROP.crop(result[rdata.from], dim, function(newUri, newFile) {
PROTOCOL.media.write([media_id, tag].join('_')+':upload', {file:[newFile,resObj.basic.filename]}, function(mfile) {
SYS.notify(PAGE.ld('image '+dim+' uploaded'), 'ok');result[mfile.tag] = getMediaFileUrl(mfile);resObj[mfile.tag] = mfile;done();});});} else {
var reader = new imageReader();reader.createResizedImg(result[rdata.from], dim, function(resp) {
var newUri = resp[0];var newFile = resp[1];PROTOCOL.media.write([media_id, tag].join('_')+':upload', {file:[newFile,resObj.basic.filename]}, function(mfile) {
SYS.notify(PAGE.ld('image '+dim+' uploaded'), 'ok');result[mfile.tag] = getMediaFileUrl(mfile);resObj[mfile.tag] = mfile;done();});});}
});})
}, {
selector: {
media_id: ['=', media_id ]
}
});}
ENGINE.currentST = null;new eSubprogram('statusText', function(node) {
var self = this;self.init = function() {
self.block = _jO(cr('div', 'statusText'));self.addon = cr('div');self.data = {
link:    [],info:    [],warning: [],error:   [],fatal:   []
};self.title = null;if ( def(node) ) {
node.__statusText = self;}
self.rebuild();}
self.onshow = function(self) {}
self.showProc = function(tp, parent) {
self['show_'+(tp||'def')](parent);}
self.add = function(tag, data) {
if ( !data ) {
data = tag;tag = 'info';}
if ( self.data[tag] ) {
self.data[tag].add(data);}
self.rebuild();}
self.buildType = function(tag) {
var data = self.data[tag];if ( data.length == 0 ) { return 0; }
var newNode = self.block.cr('div', 'type_'+tag);newNode.cr('p').VAL(PAGE.ld(tag));var list = newNode.cr('ol');map(data, function(dt) {
var t = T(dt);var n = list.cr('li');if ( t == T.S || t == T.N ) {
n.textContent = PAGE.ld(dt);} else {
n.attach(dt);}
});return 1;}
self.rebuild = function() {
self.addon.detach();self.block.innerHTML = '';var t;if ( self.title ) { t = self.block.cr('div', 'type_title').cr('p').VAL(self.title); }
var ch = 0;var chp = 0;ch  += self.buildType('link');chp += self.buildType('fatal');chp += self.buildType('error');chp += self.buildType('warning');chp += self.buildType('info');self.block.attach(self.addon);if ( t && chp == 0 ) {
t.addCls('hidden');}
if ( ch + chp > 0 ) {
return self.block;}
return null;}
self.show_base = function(func) {
if ( ENGINE.currentST ) {
ENGINE.currentST();ENGINE.currentST = null;return 0;}
var pnode = cr('div','statusText popBlock');var node  = self.rebuild();if ( node ) {
pnode.attach(node);document.body.attach(pnode);var pos = [
Math.min(EVENT.data.cursor.x, (EVENT.data.windowSize.x - pnode.offsetWidth)),Math.min(EVENT.data.cursor.y, (EVENT.data.windowSize.y - pnode.offsetHeight))
];pnode.style.left = pos[0] + 'px';pnode.style.top  = pos[1] + 'px';func(pnode);self.onshow(self);}
}
self.show_def = function() {
self.show_base(function(pnode) {
tm(function(){
var f = function() {
pnode.detach();ENGINE.currentST = null;evtDel(document.body,'click',f);}
ENGINE.currentST = f;evt(document.body,'click',f);});});}
self.show_menu = function() {
self.show_base(function(pnode) {
tm(function() {
closeOnClick(pnode);});});}
self.init();});window.ST = SUBPROGRAM.statusText;extendPrimitive(Node, 'getST', function() {
if ( def(this.__statusText) && this.__statusText.rebuild ) {
return this.__statusText.rebuild();}
return null;});extendPrimitive(Node, 'popST', function(tp) {
if ( def(this.__statusText) && this.__statusText.rebuild ) {
this.__statusText.showProc(tp, this);return null;}
return null;});new eSubprogram('wshandler', function(url) {
var self = this;self.init = function() {
url = url||'ws://localhost:17864/websocket'
self.handler = new WebSocket(url);self._url = url;self.handler.onopen     = self._onopen;self.handler.onclose    = self._onclose;self.handler.onmessage  = self._onmessage;}
self._onopen = function() {
self.send = function(data) { self.handler.send(JSON.stringify(data)); }
self.onopen();}
self._onclose = function() { self.onclose(); }
self._onmessage = function(ev) { self.onmessage(JSON.parse(ev.data)); }
self.onopen = function() {}
self.onclose = function() {}
self.onmessage = function() {}
});SYS.WS = new SUBPROGRAM.wshandler();SYS.WS.onopen = function() {
SYS.notify('connection opened','ok');EVENT.emit('ws_opened');}
SYS.WS.onclose = function() {
SYS.notify('connection closed','error');EVENT.emit('ws_closed');setTimeout(SYS.WS.init, 3000);}
SYS.WS.onmessage = function(resp) {
log(resp);EVENT.emit('ws_'+resp.command, resp);}
SYS.WS.init();SYS.dictView = {};CONF.project.modelVisName = CONF.project.modelVisName || {};var ORM = new eStorage('orm', {
req: function(self, path, data, todo, params) {
if ( !path ) {
console.log('\nMan:');console.log("\tORM.req('target[:lang]:method'[, data, todo, params])");console.log('\nInfo:');console.log("\ttarget [String]   model_name || model_id");console.log("\tdata   [Object]");console.log("\ttodo   [Function]");console.log("\tparams [Object]   override on default req {selector:{name:['=','main']}}");console.log('\nExample:');console.log("\tORM.req('transaction:select',log);");console.log("\tORM.req('transaction:insert',{exchange_id:6192449487640739,in_sum:24000000000},log);");console.log("\tORM.req('category_news:ru:update',{title:'test news'},log);");return 0;}
params = params||{};if ( !def(data) || typeof(data) == 'function' ) {
params = todo;todo = data;data = null;}
todo = todo || function(){};var respFunc = function(resp, fullData) {
mapO(resp, function(objList, model) {
self.model[model]            = self.model[model] || {};self.data.modelByName[model] = self.data.modelByName[model] || {};map(objList, function(obj) {
if ( obj.id ) { self.storePriv(model,obj.id, obj); }
});});todo(resp[okeys(resp)[0]], resp, fullData);};PROTOCOL.api.write(path, data, respFunc, respFunc, params);},_copyDictView: function(self,name) {
var result = {};mapO(SYS.dictView[name], function(node, key) {
result[key] = node.cloneNode(true);});return result
},_viewDictQ : {},_viewDictF : {},_viewDictS : {},getViewDict: function(self, name, func, isHard) {
self.data._viewDictQ[name] = self.data._viewDictQ[name] || [];self.data._viewDictQ[name].push(func);if ( isHard ) {
self.data._viewDictF[name] = false;self.data._viewDictS[name] = false;}
if ( !self.data._viewDictS[name] ) {
tm(function(){
self.data._getViewDict(self, name, func);self.data._viewDictS[name] = true;});} else {
self.data._viewDictWorker(self, name);}
},_viewDictWorker: function(self, name) {
if ( self.data._viewDictF[name] ) {
map( (self.data._viewDictQ[name]||[]), function(func) {
func(self.data._copyDictView(self,name));});self.data._viewDictQ[name] = [];}
},_getViewDict: function(self, name, func) {
func = func || log;var url = ['/_view',PAGE.lang,name,('?v='+(new Date()*1))].join('/');getRawData(url, function(data) {
var t = cr('div');t.innerHTML = data;var result = {};var oids = [];map(S('.mk_ent', t), function(node) {
var oid = node.attr('data-eid');var ln = node.attr('data-eln');if ( oids.contains(oid) ) {
if ( ln && ln == PAGE.langObj.id) {
result[oid] = node;result[oid].lang = PAGE.lang;}
} else {
result[oid] = node;result[oid].lang = ORM.O('lang_'+ln).name;}
oids.push(oid);});SYS.dictView[name] = result;self.data._viewDictF[name] = true;self.data._viewDictWorker(self, name);},log);},normaliseForUpdate: function(self, obj) {
if ( typeof(obj) != 'object' ) { return obj; }
var result = {};mapO(obj, function(val, key) {
if ( !CONF.object.orm.ignoreFields.contains(key) ) {
result[key] = val;}
});return result;},model: {},original: {},modelByName: {},todoByModel: {},onModel: function(self, model, func) {
self.data.todoByModel[model] = self.data.todoByModel[model] || [];self.data.todoByModel[model].add(func);},remOnModel: function(self, func) {
mapO(self.data.todoByModel, function(list) {
list.remove(func);});},idStore: {},storePriv: function(self, model, id, data) {
var oid = model+'_'+id;data._model = model;data._rel = {};if ( data.lang_id ) {
var lang = ORM.model.lang['lang_'+data.lang_id].name;data._hasLang = true;data._bid   = oid;data._bname = model+'_'+data.name||id;data._oid   = oid+':'+lang;data._oname = data._bname+':'+lang;} else {
data._hasLang = false;data._oid = oid;data._oname = model+'_'+data.name||id;}
if ( data.langdata === null ) {
data.langdata = {};}
self.data.idStore[id]        = data;self.cont[data._oid]         = data;self.model[model][data._oid] = data;if ( def(data.name) ) {
self.data.modelByName[model][data._oname] = data;self.cont[data._oname]                    = data;}
if ( def(self.data.todoByModel[model]) ) {
map(self.data.todoByModel[model], function(func) { func(data); })
}
var emitAddr = ['ORM',model,id];if ( lang ) { emitAddr.push(lang) }
EVENT.emit(emitAddr.join('.'), data);return data._oid;},store: function(self, oid, data) {
var oidMap  = oid.split('_');var id      = oidMap[1][0];var model   = oidMap[0];var name    = data.name;var lang_id = data.lang_id;var lang    = null;data._model = model;if ( def(lang_id) ) {
lang = ORM.O('lang_'+lang_id);data._hasLang = true;data._bid     = oid;data._bname   = [model, name||id].join('_');data._oid     = [oid,         lang.name].join(':');data._oname   = [data._bname, lang.name].join(':');} else {
data._oid         = oid;data._oname       = [model, name||id].join('_');data._hasLang     = false;}
self.cont[data._oid]         = data;self.model[model][data._oid] = data;if ( def(name) ) {
self.data.modelByName[model][data._oname] = data;self.cont[data._oname]                    = data;}
if ( def(self.data.todoByModel[model]) ) {
map(self.data.todoByModel[model], function(func) { func(data); })
}
EVENT.emit(['ORM',model,id].join('.'));return data._oid;},toUrl: function(self, req, method) {
var reqMap = req.split(':');var oidMap = reqMap[0].split('_');method     = method||reqMap[1]||'retrieve';if ( parseInt(oidMap[1]) == oidMap[1] ) {
return [oidMap[0],'/',method,'/?id=',oidMap[1]].join('');}
return [oidMap[0],'/',method,'/?name=',oidMap[1]].join('');},diff: function(self, oid) {
var result = {};var orig   = self.data.original[oid];if ( !def(orig) ) { return {}; }
mapO(self.cont[oid], function(val, key) {
if ( parseStr(val) != parseStr(orig[key]) ) { result[key] = val; }
});return result;},lang: function(self, obj, lang, key) {
if ( !obj || !obj.langdata ) { return ''; }
lang = lang || PAGE.urlMap.lang;if ( !def(key) ) {
if ( def(obj.langdata[lang]) && (typeof(obj.langdata[lang]) != 'object' || parseStr(obj.langdata[lang]) != '{}') ) {
return obj.langdata[lang];}
return obj.langdata.en||'';}
return obj.langdata[lang][key]||obj.langdata.en[key]||'';},prepQ: {},prep: function(self, ref, func) {
func    = func   || function(){};var obj = self.O(ref);if ( def(obj) ) {
func(obj);} else {
if ( def(self.data.prepQ[ref]) ) {
self.data.prepQ[ref].push(func);} else {
self.data.prepQ[ref] = [func];ORM.req(ref+':select', function() {
map(self.data.prepQ[ref], function(func) { func(self.O(ref)); })
self.data.prepQ[ref] = null;})
}
}
},getVisName: function(self, obj) {
if ( !def(obj) ) { return ''; }
if ( obj.title ) { return obj.title; }
if ( obj.email ) { return obj.email; }
if ( obj.langdata ) {
if ( obj.langdata[PAGE.lang] ) {
var t =  obj.langdata[PAGE.lang];if ( t.title ) { return t.title; }
if ( t.displayname ) { return t.displayname; }
if ( t.name ) { return t.name; }
}
if ( obj.langdata.en ) {
var t = obj.langdata.en;if ( t.title ) { return t.title; }
if ( t.displayname ) { return t.displayname; }
if ( t.name ) { return t.name; }
}
}
if ( obj.displayname ) { return obj.displayname; }
if ( obj.name ) { return obj.name; }
return obj.id;},getFullName: function(self, obj) {
if ( CONF.project.modelVisName[obj._model] ) {
return CONF.project.modelVisName[obj._model](obj);}
return self.data.getVisName(self, obj);},rel: function(self, obj, key) {
var keyMap = (key||'').split('_');var model = keyMap[keyMap.length-1];keyMap.push('id');var rel = keyMap.join('_');if ( !obj[rel] ) { return null; }
return ORM.O([model,obj[rel]].join('_'));},getDropdownMap: function(self, model) {
var result = {};var conf = CONF.project.ormDropdownName || {};var func = conf[model] || self.data.getVisName;mapO(self.model[model], function(obj) {
result[obj.id] = func(self, obj);});return result;},O: function(self, req) {
var obj = self.cont[req];if ( !obj ) {
var to = self.cont[[req,PAGE.lang].join(':')];return to || null;}
return obj;},ID: function(self, id) {
return self.data.idStore[id]||null;}
}, ['req', 'getViewDict', 'toUrl', 'diff', 'lang', 'normaliseForUpdate','prep','getVisName','getFullName','onModel','remOnModel','_copyDictView','rel','getDropdownMap','ID']);new eStorage('settings');new eStorage('page', {
req: function(self, path, todo) {
todo = todo||log;getRawData(path, null, function(html) {
self.store(path, resp);todo(resp);});}
}, ['req']);new eLayer('main', {
dom: document,select: CONF.engine.dynamicPageSelectors,ontravel: function() {
ENGINE.apiPageWork();ENGINE.clear();SCENARIO.page.run();EVENT.emit('goPage');}
});new eLayer('pop', {
select: CONF.engine.dynamicPopSelectors,parent: 'main',fetchLang: function(){},ontravel: function(self) {
if ( self.dom._currentPop != POP.window ) {
POP.window.show(self.dom);}
ENGINE.processDom(self.dom);},hide: function() {
POP.window.hide({noOnHide:true});}
});LAYER.pop.dom._onpopclose = function() {
LAYER.main.go();}
LAYER.pop.dom.cr('div','content');new eValidator('pwdMatch',function(self, t1, t2){
function check() {
return t1.val.rp(' ', '') != '' && t1.val == t2.val;}
function match() {
self.runSingle(t1, check);return self.runSingle(t2, check);}
t1.onkeyup = match;t2.onkeyup = match;return match();}, true);new eValidator('notEmpty', /[^\s]+/);new eValidator('email', /^[-0-9a-z+_]+(?:\.[-0-9a-z+_]+)*@(?:[a-z0-9\-]+\.)+[-a-z0-9]{2,}$/i);new eAdapter('dec', {
process: function(self, dom) {
var fld = 'textContent';if ( def(dom.value) ) {
fld = 'value';}
dom.__selfVal = 0;$P(dom, 'val',function() {
this.__selfVal = (parseFloat(this[fld]) || 0).fromDec();return this.__selfVal;},function(data) {
var pd = Math.floor(data) || 0;if ( !pd && pd !== 0 ) {
this.__selfVal = null;this[fld] = 0;} else {
this.__selfVal = pd;this[fld] = pd.toDec();}
return this.__selfVal;});dom.val = dom.val;dom.onupdate(function() { this.val = this.val; });}
});new eAdapter('lang', {
process: function(self, dom) {
dom.val = PAGE.ld(dom.val);},selector: '.ad_lang'
});new eAdapter('fileSize', {
process: function(self, dom) {
dom.__fileSize = parseInt(dom.val)||0;dom.__fileConf = CONF.object.adapter_filesize;dom.__drawFileSize = function() {
var index = 0;for ( var val = dom.__fileSize; val > dom.__fileConf.limit; val /= dom.__fileConf.mult, index += 1);val = Math.round(val * dom.__fileConf.precision) / dom.__fileConf.precision;dom.textContent = [val, dom.__fileConf.strs[index]||''].join(' ');}
$P(dom, 'val', function() {
return dom.__fileSize;}, function(data) {
dom.__fileSize = parseInt(data)||0;dom.__drawFileSize();})
},selector: '.ad_filesize'
});new eAdapter('test', {
process: function(self, dom) {
evt(dom, 'focus', function() {
this.addCls('notValid');});evt(dom, 'blur', function() {
this.remCls('notValid');});}
});new eHtml('fbshare', '<div class="heading"><div class="asBtn closeBtn"></div></div>\
<div class="heading t2"></div>\
<div class="angDeco"></div>\
<div class="likeBlock"><div class="fb-like" data-href="' + (ENGINE.path.fbpage || ENGINE.path.page) + '/" data-layout="standard" data-width="300" data-action="like" data-show-faces="true" data-share="false"></div></div>\
<div class="ending"><a href="#" class="noHref asBtn"></a></div>', {
'.asBtn':'closeBtn1,closeBtn2','.likeBlock':'likeBlock','.heading':'heading,desc','.angDeco':'deco'
});new eView('fbshare', {
create: function() { return HTML.fbshare(cr('div','fbshare fa')); },init: function(self, obj) {
self.V.heading.style.backgroundImage = ['url(',ENGINE.path.static,'images/fb.png)'].join('');SVG.meshTopRight(self.V.deco);SVG.close(self.V.closeBtn1);self.F.show = function() { tm(function() { self.addCls('opened'); }, 260); }
self.F.hide = function() { self.remCls('opened'); }
self.F.setLangData = function() {
self.V.desc.val      = PAGE.ld('fbshare1');self.V.closeBtn2.val = PAGE.ld('fbshare2');}
clearEvents(self.V.closeBtn1).onclick = function() {
self.F.hide();return false;}
clearEvents(self.V.closeBtn2).onclick = function() {
self.F.hide();glob('fbsharepassed', 'true');return false;}
ENGINE.processDom(self);}
});new eHtml('gallery', '<div class="gallery-preview">\
<div class="gallery-image"></div>\
<div class="gallery-button full"></div>\
<div class="gallery-arrow fa gleft"></div>\
<div class="gallery-arrow fa gright"></div>\
</div>\
<div class="gallery-thumbs">\
<div class="gallery-arrow fa gleft"></div>\
<div class="gallery-arrow fa gright"></div>\
<div class="gallery-thumbblock">\
<div class="gallery-thumbcontainer fa"></div>\
</div>\
</div>', {
div:'preview,image,btnFull,pArrLeft,pArrRight,thumbs,tArrLeft,tArrRight,thumbBlock,thumbContainer'
});new eView('gallery', {
create: function() { return HTML.gallery(cr('div','gallery fa')); },init: function(self, objData) {
self.C.images     = objData.images;self.C.prop       = parseLS(objData.imageProp||CONF.project.imageProp);self.C.initThumbs = parseInt(objData.thumbCount||CONF.project.thumbCount);self.C.thumbCount = self.C.initThumbs;self.C.thumbHalf  = self.C.thumbCount / 2 + 0.5;self.C.thumbSize  = parseInt(objData.thumbSize||CONF.project.thumbSize);self.C.pos        = 0;self.C.shiftOn    = 0;self.C.thumbs     = [];self.C.full       = false;self.C.prop = self.C.prop[0] / self.C.prop[1];self.V.placeholder = cr('div');self.F.clear = function() {
self.C.pos = 0;map(self.C.thumbs, detach);self.C.thumbs = [];}
self.F.build = function() {
map(self.C.images, self.F.buildThumb);}
self.F.rebuild = function() {
self.F.clear();self.F.build();self.F.setImage()
self.F.doResize();}
self.F.calcSizes = function() {
self.C.width = self.offsetWidth;if ( self.C.initThumbs * self.C.thumbSize < self.C.width ) {
self.C.thumbCount = parseInt(self.C.width / self.C.thumbSize)+1;} else {
self.C.thumbCount = self.C.initThumbs;}
if ( self.C.thumbCount % 2 == 0 ) { self.C.thumbCount += 1; }
self.C.thumbHalf = self.C.thumbCount / 2 + 0.5;self.C.previewHeight    = Math.round(self.C.width / self.C.prop);self.C.thumbWidth       = Math.round(self.C.width / self.C.thumbCount);self.C.thumbHeight      = Math.round(self.C.thumbWidth / self.C.prop);self.C.totalHeight      = Math.round(self.C.previewHeight + self.C.thumbHeight);self.C.thumbsTotalWidth = self.C.thumbWidth * self.C.thumbs.length;if ( self.C.full ) {
self.C.totalHeight   = Math.round(EVENT.data.windowSize.y + CONF.project.gallery.heightOffset);self.C.previewHeight = Math.round(self.C.totalHeight - self.C.thumbHeight);}
}
self.F._doResize = function() {
self.F.calcSizes();self.style.height = self.C.totalHeight+'px'
self.V.preview.style.height = self.C.previewHeight+'px'
self.V.thumbs.style.height = self.C.thumbHeight+'px'
map(self.C.thumbs, function(thumb) {
thumb.style.width  = self.C.thumbWidth  + 'px';thumb.style.height = self.C.thumbHeight + 'px';});self.F.adjustThumbs(self.C.shiftOn);}
self.F.doResize = function() { tm(self.F._doResize, 260); }
EVENT.resize.push(CEF(self.F.doResize));self.F.setImage = function(pos) {
self.C.thumbs[self.C.pos].remCls('active');if ( def(pos) ) {
self.C.pos = pos;}
if ( self.C.pos == -1 ) {
self.C.pos = self.C.thumbs.length - 1;} else if ( self.C.pos == self.C.thumbs.length ) {
self.C.pos = 0;}
self.C.thumbs[self.C.pos].addCls('active');if ( self.C.full ) {
self.V.image.style.backgroundImage = ['url(',self.C.images[self.C.pos].full,')'].join('');} else {
self.V.image.style.backgroundImage = ['url(',self.C.images[self.C.pos].preview,')'].join('');}
self.F.adjustThumbs();}
self.F.adjustThumbs = function(shiftOn) {
var limit = self.C.thumbs.length-self.C.thumbCount;self.C.shiftOn = shiftOn || 0;var shift;self.C.shiftOn = Math.max(self.C.shiftOn, -(self.C.pos - self.C.thumbHalf + 1));self.C.shiftOn = Math.min(self.C.shiftOn,  (limit + self.C.thumbHalf - self.C.pos - 1));if ( self.C.width > self.C.thumbsTotalWidth ) {
shift = parseInt((self.C.width - self.C.thumbsTotalWidth) / -2);self.V.tArrLeft .addCls('hidden');self.V.tArrRight.addCls('hidden');} else {
shift = Math.min(Math.max(0, self.C.pos - self.C.thumbCount/2 + 0.5 + self.C.shiftOn),limit) * self.C.thumbWidth;self.V.tArrLeft .remCls('hidden');self.V.tArrRight.remCls('hidden');}
self.V.thumbContainer.style.marginLeft = -shift + 'px';}
self.F.buildThumb = function(obj, index) {
var newNode = self.V.thumbContainer.cr('div', 'fa');newNode.style.backgroundImage = ['url(',obj.thumb,')'].join('');newNode.onclick = function() {
self.F.setImage(index);}
self.C.thumbs.push(newNode);}
self.F.setFull = function(state) {
if ( self.C.full = state ) {
self.addCls('full');insBefore(self.V.placeholder, self);document.body.attach(self);} else {
self.remCls('full');insBefore(self, self.V.placeholder);self.V.placeholder.detach();}
self.C.shiftOn = 0;self.F.setImage();self.F.doResize();}
self.F.buildDom = function() {
SVG.arrLeft(self.V.pArrLeft);SVG.arrRight(self.V.pArrRight);SVG.arrLeft(self.V.tArrLeft);SVG.arrRight(self.V.tArrRight);SVG.move2(self.V.btnFull);self.V.pArrLeft.onclick = function() {
self.F.setImage(self.C.pos - 1);}
self.V.pArrRight.onclick = function() {
self.F.setImage(self.C.pos + 1);}
self.V.tArrLeft.onclick = function() {
self.F.adjustThumbs(self.C.shiftOn - self.C.thumbCount);}
self.V.tArrRight.onclick = function() {
self.F.adjustThumbs(self.C.shiftOn + self.C.thumbCount);}
self.V.btnFull.onclick = function() {
self.F.setFull(!self.C.full);}
}
self.F.buildDom();}
})
{
CONF.engine.switchedOffLangs = CONF.engine.switchedOffLangs || [];new eHtml('langMenu', '<div class="langButtons"></div><div class="cont"></div>', {
'.langButtons':'langButtons','.cont':'block'
});function processLM(node) {
node.C.onLang = function() {};node.C.setLang = function(lang) {
if ( node.C.langButtons[lang] ) {
node.C.langButtons[lang].clickOn();}
}
node.C.langButtons = {};mapO(ORM.model.lang, function(lang) {
if ( !CONF.engine.switchedOffLangs.contains(lang.name) ) {
var langBtn = node.V.langButtons.cr('div', 'lang-btn asBtn fa').VAL(lang.name);node.C.langButtons[lang.name] = langBtn;langBtn.clickOn = function() {
switchActive(node.C.langButtons, langBtn);node.C.currentLang = lang;}
langBtn.onclick = function() {
langBtn.clickOn();node.C.onLang(lang);}
}
});node.C.setLang(PAGE.lang);node.C.onLang(PAGE.lang);}
new eView('langMenu', {
create: function() {
var node = HTML.langMenu(cr('div', 'langMenu'));processLM(node);return node;}
});}
{
new eHtml('menu3col', '<div class="data-select t1"><input type="text" placeholder="filter" /><div class="cont"></div></div>\
<div class="data-select t2"><input type="text" placeholder="filter" /><div class="cont"></div></div>\
<div class="data-editarea"><div class="cont"></div></div>', {
input:'filter1,filter2','.cont':'side1,side2,cont'
});function processM3C(self) {
self.B = {
list1: [],list2: []
};self.C.doFilter = function() {
domSearch(self.B.list1, self.V.filter1.val);domSearch(self.B.list2, self.V.filter2.val);}
self.V.filter1.onkeyup = self.C.doFilter;self.V.filter2.onkeyup = self.C.doFilter;}
new eView('menu3col', {
create: function(self) {
HTML.menu3col(self.V.block);self.V.block.addCls('menu3col');self.V = mergeObjects(self.V, self.V.block.V);processM3C(self);return self;}
}, 'langMenu');}
new eHtml('auth-login', '<h1>Account SignIn</h1>\
<input type="email" placeholder="e-mail">\
<input type="password" placeholder="password">\
<div class="conditions-checkbox checked"><span>remember password</span></div>\
<a href="" class="noHref button">\
<div class="all-news big-button"><span>SignIn</span></div>\
</a>\
<a href="" class="noHref blue">forgot password</a>\
<a href="" class="noHref button">\
<div class="all-news big-button"><span>SignUp</span></div>\
</a>', {
h1: 'title',input: 'email,password',a: 'signin,forgot,signup',span: 'sremember,ssignin,ssignup'
});new eHtml('auth-register', '<h1>Account SignUp</h1>\
<input type="email" placeholder="e-mail">\
<input type="text" placeholder="Fullname">\
<input type="password" placeholder="password">\
<input type="password" placeholder="repeat password">\
<a href="" class="noHref button">\
<div class="all-news big-button"><span>SignUp</span></div>\
</a>\
<a href="" class="noHref button">\
<div class="all-news big-button"><span>SignIn</span></div>\
</a>\
<div class="progress">\
<div class="active"></div>\
<div></div>\
<div></div>\
</div>', {
h1: 'title',input: 'email,name,password,pwd2',a: 'signup,signin',span: 'ssignup,ssignin'
});new eView('auth-login', {
create: function() { return HTML['auth-login'](cr('div')); },init: function(self, obj) {
map(parseLS('title,forgot,sremember,ssignin,ssignup'), function(key) {
self.V[key].val = PAGE.ld(self.V[key].val);});self.V.password.attr({placeholder:PAGE.ld(self.V.password.attr('placeholder'))});if ( glob('email') ) {
self.V.email.val = glob('email');}
self.F.signin = function() {
if ( VALIDATOR.email(self.V.email) && VALIDATOR.notEmpty(self.V.password) ) {
ENGINE._auth.login({
email   : self.V.email.val,password: self.V.password.val
}, null, function(sd) {
if ( sd.field == 'password' ) {
self.V.password.remCls('isValid');self.V.password.addCls('notValid');}
});}
return false;}
evt(self.V.email,    'keyup', function(ev) { if ( ev.keyCode == 13 ) { self.F.signin(); } });evt(self.V.password, 'keyup', function(ev) { if ( ev.keyCode == 13 ) { self.F.signin(); } });clearEvents(self.V.signin).onclick = self.F.signin;clearEvents(self.V.signup).onclick = function() {
POP.modal.show('auth-register');return false;};}
});new eView('auth-register', {
create: function() { return HTML['auth-register'](cr('div')); },init: function(self, obj) {
map(parseLS('title,ssignin,ssignup'), function(key) {
self.V[key].val = PAGE.ld(self.V[key].val);});self.V.name.attr({placeholder:PAGE.ld(self.V.name.attr('placeholder'))});self.V.password.attr({placeholder:PAGE.ld(self.V.password.attr('placeholder'))});self.V.pwd2.attr({placeholder:PAGE.ld(self.V.pwd2.attr('placeholder'))});self.F.signup = function() {
if ( VALIDATOR.email(self.V.email) && VALIDATOR.pwdMatch(self.V.password, self.V.pwd2) ) {
var nameMap = self.V.name.val.split(/\s+/g);ENGINE._auth.register({
email     : self.V.email.val,first_name: nameMap.splice(0,1)[0],last_name : nameMap.join(' '),password  : self.V.password.val
}, null, function(sd) {});}
return false;}
evt(self.V.pwd2, 'keyup', function(ev) { if ( ev.keyCode == 13 ) { self.F.signup(); } });clearEvents(self.V.signup).onclick = self.F.signup;clearEvents(self.V.signin).onclick = function() {
POP.modal.show('auth-login');return false;};}
});new eHtml('loginMenu','\
<p>email</p><input type="text" />\
<p>pwd</p><input type="password" />\
<p></p><input type="submit" />',{
p: 'lemail,lpwd,lsubmit',input: 'email,pwd,submit'
});new eView('loginMenu', {
create: function() { return HTML.loginMenu(cr('div','loginMenu')); },init: function(self) {
self.V.email.val = glob('email') || '';self.F.sbm = function() {
if ( VALIDATOR.email(self.V.email) ) {
ENGINE._auth.login({
email : self.V.email.val,pwd   : self.V.pwd.val
}, null, function() {
self.V.email.remCls('isValid');self.V.email.addCls('notValid');});}
}
self.V.email.onkeyup = self.V.pwd.onkeyup = function(ev) {
if ( ev.keyCode == 13 ) {
self.F.sbm();}
}
self.V.submit.onclick = self.F.sbm;}
});new eHtml('dir','<div class="head"><div class="logo"></div><div class="title"></div></div><div class="conts"></div><div class="cont hidden"></div>',{
div:'head,logo,title,conts,cont'
});new eView('dir', {
create: function() { return HTML.dir(cr('div','df dir')); },init: function(self, path) {
var pathMap = path.split('/');var name = pathMap[pathMap.length-1];self.V.title.val = name;self.opened = false;self.path = path;self.open = function() {
SYS.WS.send({command:'listDir',path:self.path});SYS.openedDirs.add(self.path)
glob('openedDirs', parseStr(SYS.openedDirs));self.V.cont.remCls('hidden');self.opened = true;}
self.close = function() {
SYS.openedDirs.remove(self.path)
glob('openedDirs', parseStr(SYS.openedDirs));self.V.cont.addCls('hidden');self.opened = false;}
self.V.head.onclick = function() {
if ( self.opened ) {
self.close();} else {
self.open();}
}
self.F.setVersion = function(ver) {
self.V.title.val = [name, ver].join(' v');}
if ( SYS.engineAt.contains(self.path) ) {
self.addCls('engined');SVG.tree(self.V.logo);var syncBtn = self.V.conts.cr('div', 'asBtn');syncBtn.onclick =function(){ SYS.syncEngine(self.path); }
SVG.link(syncBtn);var runBtn = self.V.conts.cr('div', 'asBtn');runBtn.onclick = function(){
SYS.syncEngines(self.path);}
SVG.video(runBtn);EVENT.on('ws_version', function() {
self.F.setVersion(SYS.currentVersionStr[self.path+'/version']);});SYS.WS.send({command:'reqFile',path:self.path+'/version'});} else {
SVG.dir(self.V.logo);}
self.C.musicInside = false;self.F.setHasMusic = function() {
if ( !self.C.musicInside ) {
var musBtn = self.V.conts.cr('div', 'asBtn');musBtn.onclick = function(){
}
SVG.video(musBtn);self.C.musicInside = true;}
}
if ( SYS.openedDirs.contains(self.path) ) {self.open(); }
}
});new eHtml('musicplayer','<div class="title"></div><div class="controlls"></div><div class="filelist"></div>',{
div: 'title,controlls,filelist'
});new eView('musicplayer', {
create: function() { return HTML.musicplayer(cr('div', 'musicplayer')); },init: function(self, obj) {
self.C.player = cr('audio');SYS.player = self;self.curPath = null;self.curDir = null;self.C.is_playing = false;self.C.interval = null;self.C.filelinks = [];self.C.filelist = {};self.C.awaitingFor = {};self.C.player.addEventListener('loadedmetadata', function() {
self.C.player.play();SYS.notify(self.curPath);self.C.savedTimeOffset = 0;clearInterval(self.C.interval);self.C.interval = tm(self.F.playNext, (self.C.player.duration*1000));audio.play(); 
self.C.is_playing = true;});self.F.play = function(path) {
if ( !self.C.is_playing || path ) {
self.curPath = path || self.curPath;self.curDir = self.curPath.split('/').sl([0, -1]).join('/');self.F.fetchByPath();self.V.title.val = self.curPath;if ( self.curPath == self.C.savedPath && self.C.savedTimeOffset ) {
self.C.player.play();self.C.interval = tm(self.F.playNext, (self.C.player.duration*1000) - self.C.savedTimeOffset);} else {
self.C.player.src = self.curPath;}
self.C.savedPath = self.curPath;self.C.savedTime = new Date()*1;tm(function() {
EVENT.emit('highlightfile', {
cls: 'currentMusicFile',path: self.curPath
});}, 100);self.C.filelist[self.curPath].V.head.addCls('active');self.C.is_playing = true;} else {
clearInterval(self.C.interval);self.C.player.pause();if ( self.C.is_playing ) {
self.C.savedTimeOffset += new Date()*1 - self.C.savedTime;}
self.C.is_playing = false;}
}
self.F.fetchByPath = function() {
if ( !self.curDir ) { return 0; }
self.V.filelist.innerHTML = '';self.C.filelinks = [];self.C.filelist = {};self.F._drawDir(self.curDir)
var preDir = self.curDir.split('/').sl([0,-1]).join('/');if ( SYS.capturedDirs[preDir] ) {
var pos = SYS.capturedDirs[preDir].indexOf(self.curDir);if ( pos > -1 ) {
var npos = pos + 1;if ( SYS.capturedDirs[preDir][npos] ) {
self.F._drawDir(SYS.capturedDirs[preDir][npos]);}
}
}
}
self.F._drawDir = function(dirPath) {
var foldView = VIEW.dir(dirPath);self.V.filelist.attach(foldView);if ( SYS.capturedStructure[dirPath] ) {
self.F._drawDirWorker(foldView, dirPath);} else {
self.C.awaitingFor[dirPath] = foldView;foldView.open();}
}
self.F._drawDirWorker = function(foldView, dirPath) {
map(SYS.capturedStructure[dirPath], function(p) {
var fView = VIEW.file(p);foldView.V.cont.attach(fView);if ( CONF.project.musicExts.contains(fView.C.ext) ) {
self.C.filelist[p] = fView;self.C.filelinks.push(p);}
});}
EVENT.on('ws_listDir', function(resp) {
if ( self.C.awaitingFor[resp.data.path]) {
tm(function(){
self.F._drawDirWorker(self.C.awaitingFor[resp.data.path], resp.data.path);});delete self.C.awaitingFor[resp.data.path];}
});self.F.playNext = function(){
var pos = self.C.filelinks.indexOf(self.curPath);if ( pos > -1 ) {
var npos = pos + 1;if ( self.C.filelinks[npos] ) {
self.F.play(self.C.filelinks[npos]);}
}
}
self.V.btnPlay = self.V.controlls.cr('div', 'asBtn pBtn');SVG.video(self.V.btnPlay);clearEvents(self.V.btnPlay).onclick = function() { self.F.play(); return false; }
}
});new eView('timer', {
create: function() { return _jO(cr('div', 'jTimer')); },init: function(self, obj) {
var now = new Date()*1;var expiry = obj.expiry||(now+20000);var est = expiry - now;var red = obj.red || 10000;var func = obj.onexpire||log;var doCalc = function() {
est -= 1000;if ( est > 0 ) {
if ( est < red ) {
self.addCls('red');}
self.val = formatTimer(est);tm(doCalc, 1000);} else {
self.val = formatTimer(0);func();}
}
self.val = formatTimer(est);tm(doCalc, 1000);}
});new eHtml('file','<div class="head"><div class="logo"></div><div class="title"></div><div class="conts"></div></div>', {
div:'head,logo,title,conts'
});SYS.engineFileNames = ['frontGenerator.py', 'version', 'settings.cfg'];SYS.files = {};SYS.targetPath = null;new eView('file', {
create: function() { return HTML.file(cr('div','df file')); },init: function(self, path) {
var pathMap = path.split('/');var name = pathMap[pathMap.length-1];SVG.file(self.V.logo);self.V.title.val = name;self.C.ext = (name.split('.').sl([-1])[0]).toLowerCase();self.path = path;self.dirPath = pathMap.sl([0, -1]).join('/');self.V.head.onclick = function() {
(CONF.project.fileExt[self.C.ext]||CONF.project.fileExt.def)(self, path);}
tm(function(){ (CONF.project.fileListExt[self.C.ext]||CONF.project.fileListExt.def)(self, path); });if ( SYS.engineAt.contains(self.dirPath) && SYS.engineFileNames.contains(name) ) {
self.addCls('engined');SVG.file(self.V.logo);} else {
SVG.file(self.V.logo);}
EVENT.on('highlightfile', function(data) {
if ( data.path == path ) {
self.addCls(data.cls);} else {
self.remCls(data.cls);}
})
}
});new eHtml('gallery', '<div class="gallery-preview">\
<div class="gallery-image"></div>\
<div class="gallery-button full"></div>\
<div class="gallery-arrow fa gleft"></div>\
<div class="gallery-arrow fa gright"></div>\
</div>\
<div class="gallery-thumbs">\
<div class="gallery-arrow fa gleft"></div>\
<div class="gallery-arrow fa gright"></div>\
<div class="gallery-thumbblock">\
<div class="gallery-thumbcontainer fa"></div>\
</div>\
</div>', {
div:'preview,image,btnFull,pArrLeft,pArrRight,thumbs,tArrLeft,tArrRight,thumbBlock,thumbContainer'
});new eView('gallery', {
create: function() { return HTML.gallery(cr('div','gallery fa')); },init: function(self, objData) {
self.C.images     = objData.images;self.C.prop       = parseLS(objData.imageProp||CONF.project.imageProp);self.C.initThumbs = parseInt(objData.thumbCount||CONF.project.thumbCount);self.C.thumbCount = self.C.initThumbs;self.C.thumbHalf  = self.C.thumbCount / 2 + 0.5;self.C.thumbSize  = parseInt(objData.thumbSize||CONF.project.thumbSize);self.C.pos        = 0;self.C.shiftOn    = 0;self.C.thumbs     = [];self.C.full       = false;self.C.prop = self.C.prop[0] / self.C.prop[1];self.V.placeholder = cr('div');self.F.clear = function() {
self.C.pos = 0;map(self.C.thumbs, detach);self.C.thumbs = [];}
self.F.build = function() {
map(self.C.images, self.F.buildThumb);}
self.F.rebuild = function() {
self.F.clear();self.F.build();self.F.setImage()
self.F.doResize();}
self.F.calcSizes = function() {
self.C.width = self.offsetWidth;if ( self.C.initThumbs * self.C.thumbSize < self.C.width ) {
self.C.thumbCount = parseInt(self.C.width / self.C.thumbSize)+1;} else {
self.C.thumbCount = self.C.initThumbs;}
if ( self.C.thumbCount % 2 == 0 ) { self.C.thumbCount += 1; }
self.C.thumbHalf = self.C.thumbCount / 2 + 0.5;self.C.previewHeight    = Math.round(self.C.width / self.C.prop);self.C.thumbWidth       = Math.round(self.C.width / self.C.thumbCount);self.C.thumbHeight      = Math.round(self.C.thumbWidth / self.C.prop);self.C.totalHeight      = Math.round(self.C.previewHeight + self.C.thumbHeight);self.C.thumbsTotalWidth = self.C.thumbWidth * self.C.thumbs.length;if ( self.C.full ) {
self.C.totalHeight   = Math.round(EVENT.data.windowSize.y + CONF.project.gallery.heightOffset);self.C.previewHeight = Math.round(self.C.totalHeight - self.C.thumbHeight);}
}
self.F._doResize = function() {
self.F.calcSizes();self.style.height = self.C.totalHeight+'px'
self.V.preview.style.height = self.C.previewHeight+'px'
self.V.thumbs.style.height = self.C.thumbHeight+'px'
map(self.C.thumbs, function(thumb) {
thumb.style.width  = self.C.thumbWidth  + 'px';thumb.style.height = self.C.thumbHeight + 'px';});self.F.adjustThumbs(self.C.shiftOn);}
self.F.doResize = function() { tm(self.F._doResize, 260); }
EVENT.resize.push(CEF(self.F.doResize));self.F.setImage = function(pos) {
self.C.thumbs[self.C.pos].remCls('active');if ( def(pos) ) {
self.C.pos = pos;}
if ( self.C.pos == -1 ) {
self.C.pos = self.C.thumbs.length - 1;} else if ( self.C.pos == self.C.thumbs.length ) {
self.C.pos = 0;}
self.C.thumbs[self.C.pos].addCls('active');if ( self.C.full ) {
self.V.image.style.backgroundImage = ['url(',self.C.images[self.C.pos].full,')'].join('');} else {
self.V.image.style.backgroundImage = ['url(',self.C.images[self.C.pos].preview,')'].join('');}
self.F.adjustThumbs();}
self.F.adjustThumbs = function(shiftOn) {
var limit = self.C.thumbs.length-self.C.thumbCount;self.C.shiftOn = shiftOn || 0;var shift;self.C.shiftOn = Math.max(self.C.shiftOn, -(self.C.pos - self.C.thumbHalf + 1));self.C.shiftOn = Math.min(self.C.shiftOn,  (limit + self.C.thumbHalf - self.C.pos - 1));if ( self.C.width > self.C.thumbsTotalWidth ) {
shift = parseInt((self.C.width - self.C.thumbsTotalWidth) / -2);self.V.tArrLeft .addCls('hidden');self.V.tArrRight.addCls('hidden');} else {
shift = Math.min(Math.max(0, self.C.pos - self.C.thumbCount/2 + 0.5 + self.C.shiftOn),limit) * self.C.thumbWidth;self.V.tArrLeft .remCls('hidden');self.V.tArrRight.remCls('hidden');}
self.V.thumbContainer.style.marginLeft = -shift + 'px';}
self.F.buildThumb = function(obj, index) {
var newNode = self.V.thumbContainer.cr('div', 'fa');newNode.style.backgroundImage = ['url(',obj.thumb,')'].join('');newNode.onclick = function() {
self.F.setImage(index);}
self.C.thumbs.push(newNode);}
self.F.setFull = function(state) {
if ( self.C.full = state ) {
self.addCls('full');insBefore(self.V.placeholder, self);document.body.attach(self);} else {
self.remCls('full');insBefore(self, self.V.placeholder);self.V.placeholder.detach();}
self.C.shiftOn = 0;self.F.setImage();self.F.doResize();}
self.F.buildDom = function() {
SVG.arrLeft(self.V.pArrLeft);SVG.arrRight(self.V.pArrRight);SVG.arrLeft(self.V.tArrLeft);SVG.arrRight(self.V.tArrRight);SVG.move2(self.V.btnFull);self.V.pArrLeft.onclick = function() {
self.F.setImage(self.C.pos - 1);}
self.V.pArrRight.onclick = function() {
self.F.setImage(self.C.pos + 1);}
self.V.tArrLeft.onclick = function() {
self.F.adjustThumbs(self.C.shiftOn - self.C.thumbCount);}
self.V.tArrRight.onclick = function() {
self.F.adjustThumbs(self.C.shiftOn + self.C.thumbCount);}
self.V.btnFull.onclick = function() {
self.F.setFull(!self.C.full);}
}
self.F.buildDom();}
})
new eHtml('project', '<div class="logo"></div><div class="conts"></div><div class="title"></div>', {
div:'logo,conts,title'
});SYS.currentProjStr =  glob('currentProject');new eView('project', {
create: function() {
return HTML.project(cr('div', 'proj'));},init: function(self, path) {
var pathMap = path.split('/');self.V.title.val = pathMap[pathMap.length-1]
SVG.project(self.V.logo);self.C.btnStt = self.V.conts.cr('div','as_btn');SVG.settings(self.C.btnStt);SYS.projects[path] = self;self.chooseProj = function() {
if ( SYS.currentProject && SYS.projects[SYS.currentProject] ) {
SYS.projects[SYS.currentProject].remCls('active');}
SYS.currentProject = path;SYS.projects[SYS.currentProject].addCls('active');SYS.PG = {};map(SYS.tempIntervals, function(int) {
clearInterval(int);});SYS.tempIntervals = [];EVENT.emit('projectChosen', path);glob('currentProject', path);}
self.V.title.onclick = self.chooseProj;if ( SYS.currentProjStr == path ) {
tm(self.chooseProj);}
}
});new ePop('window', 'popWindow', {
createDom: function(self) {
self.block      = cr('div', self.data.parentCls);self.V.cont     = self.block.cr('div', self.pcls );self.C.contElem = cr('div');self.V.closeBtn = self.V.cont.cr('div','closeBtn fa asBtn');SVG.close(self.V.closeBtn);clearEvents(self.V.closeBtn).onclick = function() {
self.hide();return false;}
}
});new ePop('info', 'popInfo');new ePop('drag', null, {
alwaysPersist: true,createDom: function(self) {
self.block = cr('div', 'onscreenWindow');self.V.headerBlock = self.block.cr('div', 'windowHead' );self.V.cont = self.block.cr('div', 'windowBlock' );self.C.contElem = cr('div');self.V.closeBtn = SVG.close(self.V.headerBlock.cr('div', 'asBtn fa right'));self.V.moveBtn  = SVG.move2(self.V.headerBlock.cr('div', 'asBtn fa fillBack'));self.V.headStr  = self.V.headerBlock.cr('h3');self._startPos = [0,0];self._curPos   = [-20,-20];self._dragPos  = [0,0];self.stopDrag = function() {
EVENT.mousemove.remove(self.doDrag);evtDel(document,'mouseup', self.stopDrag);self._curPos[0] += self._dragPos[0];self._curPos[1] += self._dragPos[1];}
self.doDrag = function(ev) {
self._dragPos  = [EVENT.data.cursor.x - self._startPos[0], EVENT.data.cursor.y - self._startPos[1]];self.block.style.left = self._curPos[0] + self._dragPos[0] + 'px';self.block.style.top  = self._curPos[1] + self._dragPos[1] + 'px';}
clearEvents(self.V.moveBtn).onmousedown = function(ev) {
self._startPos = [EVENT.data.cursor.x, EVENT.data.cursor.y];EVENT.mousemove.add(self.doDrag);evt(document,'mouseup', self.stopDrag);return false;}
self.V.closeBtn.onclick = self.hide;},onshowstart: function(self) {
self.V.headStr.VAL(self.rdata.title||'');if ( def(self.rdata.dom) ) {
self.V.headerBlock.attach(self.rdata.dom);}
},onshow: function(self, rdata) {
self.stopDrag();if ( rdata.isSmall ) {
self.block.style.width  = parseInt(EVENT.data.windowSize.x * CONF.object.pop_drag.smallscale[0]) + 'px';self.block.style.height = parseInt(EVENT.data.windowSize.y * CONF.object.pop_drag.smallscale[1]) + 'px';self.block.addCls('smallDrag');} else {
self.block.style.width  = parseInt(EVENT.data.windowSize.x * CONF.object.pop_drag.scale[0]) + 'px';self.block.style.height = parseInt(EVENT.data.windowSize.y * CONF.object.pop_drag.scale[1]) + 'px';self.block.remCls('smallDrag');}
var diffX = self.block.offsetWidth  + EVENT.data.cursor.x - EVENT.data.windowSize.x;var diffY = self.block.offsetHeight + EVENT.data.cursor.y - EVENT.data.windowSize.y;self._startPos[0] += Math.max(0, diffX);self._startPos[1] += Math.max(0, diffY);self.doDrag();self.stopDrag();self.block.addCls('lastOpened');self.block._hovFn = function() {
self.block.remCls('lastOpened');evtDel(self.block, 'mouseover', self.block._hovFn);}
evt(self.block, 'mouseover', self.block._hovFn);}
});new ePop('modal', 'modal-form', {
createDom: function(self) {
self.block = cr('div', 'fullscreen');self.V.cont = self.block.cr('div', self.pcls );self.V.closeBtn = self.V.cont.cr('div', 'close');self.C.contElem = cr('div');self.data.initDom(self);},initDom: function(self) {
var tlink = self.V.closeBtn.cr('a').attr({href:'#'});SVG.closeModal(tlink);clearEvents(tlink).onclick = function() {
self.hide();return false;}
}
});new ePop('modalBig', 'modal-form jBigModal', {}, 'modal');new eProcessor('swipeArea', {
process: function(self, db) {
tm(function(){ db._process(self, db); });},_process: function(self, db) {
_jO(self);self.dimensions = self.D.swipedims.split('');self.block = S('.mk_swipeBlock', self)[0];self.container = S('.mk_swipeCont', self)[0];self.btnLeft  = S('.mk_swipeBtnLeft' , self);self.btnRight = S('.mk_swipeBtnRight', self);if ( def(self.D.swipesize) ) {
self.size = parseLS(self.D.swipesize);self.size[0] = parseInt(self.size[0] || 0);self.size[1] = parseInt(self.size[1] || 0);} else {
self.sizeBlock = S('.mk_swipeSize', self)[0];if ( self.sizeBlock ) {
self.size = [self.sizeBlock.offsetWidth, self.sizeBlock.offsetHeight];} else {
self.size = [2,2];}
}
self.halfSize = [parseInt(self.size[0]/2), parseInt(self.size[1]/2)];if ( def(self.D.swipelimit) ) {
self.limit = parseInt(self.D.swipelimit)*-1;} else if ( self.D.calcitemselector) {
self.calcitems = S(self.D.calcitemselector, self.block);if ( def(self.D.swipesize) ) {
self.limit = self.calcitems.length * self.size[0] * -1;} else {
self.limit = 0;map(self.calcitems, function(item) { self.limit -= item.offsetWidth });}
} else {
self.limit = self.block.offsetWidth*-1;}
if ( self.container ) {
self.containerLimit = self.container.offsetWidth;self.limit = Math.min(0, self.limit+self.containerLimit);}
self._curPos = [0,0];self._normalizePos = function() {
self._curPos[0] = Math.round(self._curPos[0] / self.size[0]) * self.size[0];self._curPos[1] = Math.round(self._curPos[1] / self.size[1]) * self.size[1];self._curPos[0] = Math.max(Math.min(self._curPos[0], 0), self.limit);self.block.addCls('fa');self.block.style.marginLeft = self._curPos[0] + 'px';self.block.style.marginTop  = self._curPos[1] + 'px';}
var swipeData = {
start: function() { self.block.remCls('fa'); },end: function(pos, rel) {
self._curPos[0] += rel[0];self._normalizePos();}
}
if ( self.dimensions.contains('x') ) {
swipeData.movex = function(pos, rel) {
self.block.style.marginLeft = self._curPos[0] + rel[0] + 'px';}
}
if ( self.dimensions.contains('y') ) {
swipeData.movex = function(pos, rel) {
self.block.style.marginTop = self._curPos[1] + rel[1] + 'px';}
}
if ( def(self.D.precision) ) {
swipeData.precision = self.D.precision;}
self._swipe = new domSwipe(self, swipeData);map(self.btnLeft , function(btn){
clearEvents(btn).onclick = function() {
self._curPos[0] += self.container.offsetWidth;self._normalizePos();}
});map(self.btnRight, function(btn){
clearEvents(btn).onclick = function() {
self._curPos[0] -= self.container.offsetWidth;self._normalizePos();}
});}
})
new eProcessor('alturl', {
process: function(self, db) {
_jO(self);var src = self.attr('src');self.D.alturl = self.D.alturl || self.D.alturl2;if ( !src || src == '' ) { self.src = self.D.alturl; }
}
})
new eProcessor('extendable', {
process: function(self, db) {
_jO(self);self.V.exts = S('.mk_ext', self);self.V.triggers = S('.mk_trigger', self);self.C.opened = false;self.F.open = function() {
if ( !self.C.opened ) {
map(self.V.exts, function(node) {
node.remCls('hide');});return self.C.opened = true;}
return false;}
self.F.close = function() {
if ( self.C.opened ) {
map(self.V.exts, function(node) {
node.addCls('hide');});self.C.opened = false;}
}
self.F.switch = function() {
if ( !self.F.open() ) {
self.F.close();}
return false;}
map(self.V.triggers, function(node) {
clearEvents(node).onclick = self.F.switch;});if ( def(self.D.staterules) && def( db[self.D.staterules])) { db[self.D.staterules](self, db); }
},article: function(self, db) {
if ( PAGE.urlMap.tpl == 'article' ) {
self.F.open();map(self.V.triggers, function(node) {
node.addCls('hidden');});}
}
})
new eProcessor('tag', {
process: function(self, db) {
var nodes = S('a', self);var cells = new T.A(db.grades);var limits = [Infinity,1];var sortData = {};map(nodes, function(node) {
_jO(node)._rank = node.D.rank||0;limits[0] = Math.min(node._rank, limits[0]);limits[1] = Math.max(node._rank, limits[1]);sortData[node.val] = node;});for ( var i = db.conf.map.length; i < nodes.length; i++ ) {
db.conf.map.push('1');}
map(nodes.sort(function(a,b) { return b._rank - a._rank; }), function(node, ind) {
node.addCls('t'+db.conf.map[ind]);})
map(okeys(sortData).sort(), function(key) {
var node = sortData[key];if ( node.className.split(/\s/g).contains('noHref') ) {
clearEvents(node).onclick = function() {
PROTOCOL.search.write(node.val);return false;}
}
self.attach(sortData[key]);});},conf: CONF.object.tag
})
new eProcessor('morph', {
process: function(self, db) {
_jO(self);dispatchOnUpdate(self);if ( self._tag == 'input' ) {
var at = self.D.type || self.attr('type');if ( db.rules[at] ) {
tm(function() {
db.ruleWrapper(self,db,at);});}
}
},ruleWrapper: function(self, db, rule) {
var newNode = db.rules[rule](self);if ( !newNode ) { return self; }
self.insBefore(newNode);self.addCls('hidden');$P(self, 'val', function() {
return newNode.val;}, function(data) {
return (newNode.val = data);});self._morphNode = newNode;return newNode;},rules: {
'checkbox': function(node) {
var newNode = cr.bool();newNode.val = node.checked;newNode.onupdate(function(val) {
node.checked = val;node.C._emitUpdated();});return newNode;},'date': function(node) {
if ( node.attr('disabled') ) {
node.attr({type:'text'});node.val = formatDate(node.val);node.remCls('hidden');return null;}
var newNode = cr.dateinput();newNode.val = node.val;newNode.onupdate(function(val) {
node.val = val;node.C._emitUpdated(node.val);});return newNode;}
}
})
new eProcessor('navbar', {
selector: '.navbar-fixed',showHeight: 260,process: function(dom, db) {
function checkNavBar() {
if ( EVENT.data.windowScroll.y > db.showHeight ) {
dom.remCls('hide');} else {
dom.addCls('hide');}
}
EVENT.global.scroll.add(checkNavBar);tm(checkNavBar);}
})
new eProcessor('userData', {
process: function(self, db) {
_jO(self);if ( def(PAGE.user) ) {
var valMap = self.val.split(' ');var newVal = [];map(valMap, function(value) {
if ( def(PAGE.profile[value]) ) {
newVal.push(PAGE.profile[value]);} else if ( def(PAGE.user[value]) ) {
newVal.push(PAGE.user[value]);}
});self.val = newVal.join(' ');} else {
self.val = '';}
}
});new eProcessor('popUrl', {
process: function(self, db) {
_jO(self).C.baseHref = self.attr('href');self.attr({
href:self.C.baseHref,target: '_blank'
});clearEvents(self).onclick = function() {
if ( SYS.window.popurl ) {
SYS.window.popurl.close();delete SYS.window.popurl;}
SYS.window.popurl = window.open(self.attr('href'), 'popurl', 'width=800,height=450');return false;}
}
});new eProcessor('private', {
selector: '.mk_private',process: function(self, db) {
if ( PAGE.level >= 100 ) {
self.remCls('mk_private');self.addCls('mk_opaque');}
}
});new eProcessor('fbshare', {
process: function(self, db) {
self._shown = false;self._onscroll = self._onscroll || function() {
var pos = getOffsetRect(self);if ( self._shown ) {
if ( pos.top > EVENT.data.windowScroll.y + EVENT.data.windowSize.y ) {
SYS.fbshare.hide();self._shown = false;}
} else {
if ( pos.top <= EVENT.data.windowScroll.y + EVENT.data.windowSize.y ) {
SYS.fbshare.show();self._shown = true;}
}
}
EVENT.scroll.add(self._onscroll);}
});new eProcessor('fullImg', {
process: function(self, db) {
_jO(self);var url = self.D.src;var trigger = S('.mk_fullImgTrig', self)[0];if ( url ) {
var target = trigger||self;var bg = cr('div', 'fullscreen fullImg zoomOut');var block = bg.cr('div','fullImg');var imgNode = block.cr('img').attr({
src:url
});target.addCls('zoomIn');clearEvents(target).onclick = function(ev) {
document.body.attach(bg);return false;}
bg.onclick = function() {
bg.detach();}
}
}
});new eProcessor('imgDS', {
process: function(self, db) {
_jO(self);if ( glob('__disableDS') == 'true' ) { return 0; }
var nodes = S('p', self);self.phs   = S('.tBg', self);self.mapping = {};map(nodes, function(node) {
_jO(node);if ( node.D.sizex ) {
self.mapping[parseInt(node.D.sizex)] = [node.val, node.D.size];node.detach();}
});self.C.idsImage = cr('img','fa').attr({
alt: self.D.alt
});if ( ENGINE.isIB ) {
self.F.idsWorker = CEF(function() {
tm(function() { db.fetchIBSize(self,db); });},260);db.fetchIBSize(self,db);} else {
self.F.idsWorker = CEF(function() {
tm(function() { db.fetchSize(self,db); });},260);db.fetchSize(self,db);}
EVENT.resize.add(self.F.idsWorker);},fetchIBSize: function(self,db) {
var csize = okeys(self.mapping)[0];var size  = self.offsetWidth;mapO(self.mapping, function(urlMap, s) {
if ( s < size ) { csize = Math.max(csize, s); }
});if ( csize > size ) {
self.C.idsImage.detach();} else {
var urlMap = self.mapping[csize];var url = urlMap[0];var newSize = urlMap[1].split('x');self.C.idsImage.attr({
src    : url,width  : newSize[0],height : newSize[1]
});db.placeNewImg(self);self.attach(self.C.idsImage);}
},fetchSize: function(self,db) {
var csize = okeys(self.mapping)[0];var size  = self.offsetWidth;mapO(self.mapping, function(urlMap, s) {
if ( s < size ) { csize = Math.max(csize, s); }
});if ( csize > size ) {
self.C.idsImage.detach();} else {
self.C.idsImage.detach();map(self.phs, function(node) { self.attachFirst(node); });var urlMap = self.mapping[csize];var url = urlMap[0];var newSize = urlMap[1].split('x');self.C.idsImage.style.height="0px";self.C.idsImage.onload = function() {
db.placeNewImg(self);}
self.attach(self.C.idsImage);self.C.idsImage.attr({
src    : url,width  : newSize[0],height : newSize[1]
});}
},placeNewImg: function(self) {
map(self.phs, detach);self.C.idsImage.remattr('style');tm(function(){ self.remCls('opaqueImg'); });}
})
new eProcessor('imgDSB', {
trigger: {
hov:'mouseover'
},process: function(self, db) {
_jO(self);var trigger = self.D.dsbon;if ( glob('__disableDS') == 'true' ) { return 0; }
self.C.dsbsize = parseInt(self.D.dsbsize)
self.F.idsbWorker = CEF(function() {
tm(function() { db.fetchSize(self,db); }, 260);});if ( trigger && db.trigger[trigger] ) {
var tf = function() {
db.dispatchFetch(self,db);evtDel(self, db.trigger[trigger], tf);}
evt(self, db.trigger[trigger], tf);} else {
db.dispatchFetch(self,db);}
},dispatchFetch: function(self,db) {
EVENT.resize.add(self.F.idsbWorker);db.fetchSize(self,db);},fetchSize: function(self,db) {
var size  = self.offsetWidth;if ( size > self.C.dsbsize ) {
self.style.backgroundImage = ['url(',')'].join(self.D.dsburl);} else {
self.style.backgroundImage = 'none';}
}
})
if ( !CONF.object.nopredots ) {
new eProcessor('predot', {
selector: 'pre',process: function(self, db) {
var textnode = self.childNodes[0];if ( textnode && textnode.nodeType == 3 && textnode.val[0] == '-' ) {
textnode.val = '•'+textnode.val.sl([1]);}
}
});}
new eProcessor('limitView', {
process: function(self, db) {
_jO(self);var limit = self.D.limit;var func = function() {
if ( self.offsetWidth < limit ) {
self.addCls('hidden');}
}
EVENT.resize.add(func);func();}
});new eProcessor('dec', {
process: function(dom, db) {
dom.val = dom.val.toDec();}
})
new eProcessor('paginator', {
selector: '.paginator',process: function(self, db) {
_jO(self);tm(function(){ db._process(self, db); });},_process: function(self, db) {
var links     = S('a', self).length;self.page     = Math.max(0, parseInt(PAGE.virtUrl[0]||0));self.basePath = self.D.burl   || PAGE.url;self.suffix   = self.D.suffix || '';self.innerHTML = '';if ( links > 1 ) {
var start = Math.max(0, self.page - 3);var end = Math.min(links, start + 7);if ( self.page != 0 ) {
db.createBtn(self, db, self.page-1, PAGE.ld('prev'), 'wide');}
if ( start != 0 ) {
db.createBtn(self, db, 0, null, 'first');}
for ( var i = start; i < end; i++) {
db.createBtn(self, db, i);}
if ( self.page != links-1 ) {
db.createBtn(self, db, self.page+1, PAGE.ld('next'), 'wide');}
if ( end != links ) {
db.createBtn(self, db, links-1, PAGE.ld('last'), 'wide');}
ENGINE.processDom(self);}
},createBtn: function(self,db, url, title, cls) {
title = title || (url + 1);var clsmap = [(cls || ''),'fa'];if ( url == self.page ) {
clsmap.push('active');}
PAGE.virtUrl[0] = url;if ( url == 0 ) { PAGE.virtUrl.splice(0,1); }
url = PAGE.virtUrl.join('/');var btn = self.cr('a', clsmap.join(' ')).VAL(title).attr({href:[self.basePath,url,self.suffix].join('')});return btn;}
});SYS.now = new Date();new eProcessor('date', {
process: function(dom, db) {
dom.selfTime = dom.val;dom.val = formatDate(dom.selfTime);}
})
new eProcessor('datetime', {
process: function(dom, db) {
_jO(dom);dom.selfTime = dom.val;dom.val = formatDate(dom.selfTime, true);dom.remCls('dateHid');if ( dom.D.dthide == 'true' && dom.val == '' ) {
dom.addCls('hidden');}
}
})
new eProcessor('polemixdate', {
process: function(dom, db) {
_jO(dom);tmp = new Date(parseInt(dom.val));var time = [tmp.getHours().toLen(),tmp.getMinutes().toLen()].join(':');if ( tmp.getFullYear() == SYS.now.getFullYear() && tmp.getMonth() == SYS.now.getMonth() && tmp.getDate() == SYS.now.getDate() ) {
dom.val = time;} else {
var date = [tmp.getDate().toLen(),(tmp.getMonth()+1).toLen()].join('/');dom.val = [date, time].join(' ');}
dom.remCls('dateHid');}
})
new eProcessor('tabs', {
process: function(self, db) {
_jO(self).V.tabs = S('.mk_tab', self);self.C.curTab = self.D.tab || 0;db.createButtons(self, db);db.switchTo(self, db, self.C.curTab);self.switchTo = function(key) {
db.switchTo(self, db, key);}
},switchTo: function(self, db, index) {
self.C.curTab = index;map(self.V.tabs, function(node, i) {
node.addCls('hidden');self.V.tabBtns[i].remCls('active');});self.V.tabs[index].remCls('hidden');self.V.tabBtns[index].addCls('active');var ifms = S('iframe', self.V.tabs[index]);map(ifms, function(node) {
var nSrc = node.attr('data-srcontab');if ( nSrc && nSrc.length > 0 ) {
node.attr({
src: nSrc,});node.remattr('data-srcontab');}
});},createButtons: function(self, db) {
map(self.V.tabBtns||[], detach);self.V.tabBtns = [];self.V.tabsBlock = self.V.tabsBlock || cr('div','tabs heading');self.attachFirst(self.V.tabsBlock);map(self.V.tabs, function(tab) {
_jO(tab);db.createButton(self, db, tab);})
},createButton: function(self, db, tab) {
var newBtn = self.V.tabsBlock.cr('div','asBtn');if ( tab.D.svg ) { SVG[tab.D.svg](newBtn.cr('div', 'ico')); }
if ( tab.D.title ) { newBtn.cr('div', 'str').VAL(tab.D.title); }
newBtn._index = self.V.tabBtns.push(newBtn)-1;clearEvents(newBtn).onclick = function() {
db.switchTo(self, db, this._index);return 0;}
}
})
new eProcessor('decPercent', {
process: function(dom, db) {
dom.val = dom.val.toDec(4)*100+(_jO(dom).D.suff||'');}
})
new eProcessor('dynamicLink', {
selector: 'a',process: function(dom, db) {
if ( dom.className.split(' ').contains('noHref') || dom.attr('download') || dom.attr('data-ct') ) { return 0; }
if ( dom.href.match(/^https?:\/\/(www\.)?youtube\.com/) ) {
var qr = getQuery(dom.href);if ( qr.v ) {
tm(function() {
var ytplayer = cr('div');ytplayer.innerHTML = [
'<iframe id="ytplayer" type="text/html" width="100%" height="360px" src="https://www.youtube.com/embed/','?autoplay=0" frameborder="0" allowfullscreen>'].join(qr.v);insBefore(ytplayer, dom);dom.addCls('hidden');});return 0;}
}
if ( dom.href.match(/^https?:\/\/(www\.)?vimeo\.com/) ) {
var id = dom.href.split('vimeo.com/')[1];id = id.split(/[\#\?]/)[0];if ( id.length > 0 ) {
tm(function() {
var viplayer = cr('div');viplayer.innerHTML = [
'<iframe src="//player.vimeo.com/video/','" width="100%" height="360px" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'].join(id);insBefore(viplayer, dom);dom.addCls('hidden');});return 0;}
}
if ( dom.href.match(/^https?:\/\/(www\.)?(fb|facebook)\.com\/\w+\/videos\//) || dom.href.match(/^https?:\/\/(www\.)?(fb|facebook)\.com\/video.php/) ) {
tm(function() {
var fbplayer = cr('div','fb-video').attr({
'data-href'  : dom.href,'data-width' : '100%','data-allowfullscreen' : 'true'
});insBefore(fbplayer, dom);dom.addCls('hidden');});return 0;}
dom.selfLink = ENGINE.getUrlData(dom.href);if ( dom.selfLink.own ) {
if ( !ENGINE.noDynamicLink ) {
clearEvents(dom).onclick = function() {
if ( (!EVENT.data.key || !EVENT.data.key.ctrl) && EVENT.data.button == 0 ) {
LM.go(dom.selfLink.url);return false;}
}
}
} else {
dom.target = '_blank';}
}
});new eProcessor('dropdown', {
process: function(dom, db) {
_jO(dom);if ( def(dom.D.target) ) {
dom.C.targets = [];dom.C.markers = S('.mk_mark', dom);dom.D.cls = dom.D.cls||'closed';map(dom.D.target.split(/\s*\,\s*/g), function(selector) {
dom.C.targets.push(S('#target_'+selector));});dom.C.closed = dom.C.targets[0].className.contains(dom.D.cls);dom.toclose = false;dom.C.int = null;dom.F.open  = function() {
db.openContent(dom);tm(function() { EVENT.click.add(dom.F.close); });}
dom.F._close = function() {
db.closeContent(dom);EVENT.click.remove(dom.F.close);}
dom.F.close = function() {
dom.C.int = tm(dom.F._close, 2);}
if ( dom.D.closeonclick != 'true' ) {
map(dom.C.targets, function(target) {
evt(target, 'click', function() {
tm(function() {
clearInterval(dom.C.int);});});});}
dom.onclick = function() {
if ( dom.C.closed ) {
dom.F.open();} else {
dom.F._close();}
};}
},openContent: function(btn) {
if ( def(btn.D.selfactive) ) {
btn.addCls(btn.D.selfactive);}
if ( def(btn.D.selfunactive) ) {
btn.remCls(btn.D.selfunactive);}
map(btn.C.markers, function(marker) {
if ( def(btn.D.markactive) ) {
marker.addCls(btn.D.markactive);}
if ( def(btn.D.markunactive) ) {
marker.remCls(btn.D.markunactive);}
});if ( btn.D.keepOpen ) {
map(btn.C.targets, function(target) {
target.remCls(btn.D.cls);target.onclick = function() {
tm(function() { btn.toclose = false; });}
})
} else {
map(btn.C.targets, function(target) {
target.remCls(btn.D.cls);})
}
btn.C.closed = false;},closeContent: function(btn) {
if ( def(btn.D.selfactive) ) {
btn.remCls(btn.D.selfactive);}
if ( def(btn.D.selfunactive) ) {
btn.addCls(btn.D.selfunactive);}
map(btn.C.markers, function(marker) {
if ( def(btn.D.markactive) ) {
marker.remCls(btn.D.markactive);}
if ( def(btn.D.markunactive) ) {
marker.addCls(btn.D.markunactive);}
});map(btn.C.targets, function(target) { target.addCls(btn.D.cls); })
btn.C.closed = true;}
});new eProcessor('gallery', {
process: function(self, db) {
if ( self._addedToGallery ) { return false; }
_jO(self)._addedToGallery = true;db.clsRaw = db.selector.sl([1]);if ( self.parentNode ) {
self.linkNodes = getChildren(self.parentNode);var pos = self.linkNodes.indexOf(self);if ( pos == -1 ) { return 0; }
self.linkNodes.splice(0, pos);pos = self.linkNodes.length;map(self.linkNodes, function(node, index) {
if ( !node.className.contains(db.clsRaw) ) { pos = index; return false; }
});self.linkNodes.splice(pos, self.linkNodes.length - pos);}
map(self.linkNodes, function(node) { _jO(node)._addedToGallery = true; })
db.images = [];var nodes = self.linkNodes;if ( nodes.length == 0 ) {
return 0;} else if ( nodes.length == 1 ) {
var img = _jO(nodes[0]);var container = _jO(cr('div', 'gallery_single'));insBefore(container, img);container.V.cont = container.cr('div','cont');container.V.overLayer = container.V.cont.cr('div','overLayer fa');container.V.ico = container.V.overLayer.cr('div','svg');SVG.search(container.V.ico);container.V.cont.attach(img);if ( img.D.isfull == '1' ) {
img.src = img.D.preprop;} else {
img.src = img.D.preview;}
container.attr('data-src', img.D.basic);img.remattr('width');img.remattr('height');PROCESSOR.fullImg.process(container);return 0;}
map(nodes, function(img) {
if ( def(img) && def(img.src) && def(img.D) ) {
var obj = {
thumb:   img.src,preview: img.D.preview,full:    img.D.basic
};db.images.push(obj);}
});db.view = VIEW.gallery({
images:db.images,thumbSize:"120",thumbCount:1,imageProp:"640,360"
});insBefore(db.view, self);map(nodes, detach);db.view.F.rebuild();}
});new eProcessor('readmore', {
process: function(self, db) {
_jO(self);self.smallHeight = parseInt(self.D.height || 100);self.fullHeight = self.offsetHeight;self.swiped = false;self.clearTm = null;self.str = {
open  : PAGE.ld(self.D.stropen  || 'Open'),close : PAGE.ld(self.D.strclose || 'Hide')
}
if ( !self.fullHeight || self.fullHeight < self.smallHeight ) { return 0; }
self.V.openBtn = cr('div','rastr');insAfter(self.V.openBtn, self);clearEvents(self.V.openBtn).onclick = function() {
if ( self.swiped ) {
db.open(self, db);return 0;}
db.swipe(self, db);return 0;}
self.remCls('fa');db.swipe(self, db);tm(function(){
self.addCls('fa');}, 260);},swipe: function(self, db) {
clearInterval(self.clearTm);self.style.height = self.fullHeight + 'px';tm(function(){
self.style.height = self.smallHeight + 'px';}, 10);self.swiped = true;self.V.openBtn.val = self.str.open;},open: function(self, db) {
clearInterval(self.clearTm);self.style.height = self.smallHeight + 'px';tm(function(){
self.style.height = self.fullHeight + 'px';}, 10);self.clearTm = tm(function(){
self.remattr('style');}, 260);self.swiped = false;self.V.openBtn.val = self.str.close;}
});new eProcessor('shuffle', {
process: function(dom, db) {
tm(function() {
db.delayedProcess(dom, db);});},delayedProcess: function(dom, db) {
var list = getChildren(dom);for( ; list.length > 0; ) {
var index = parseInt(Math.random()*list.length);var item = list.splice(index, 1)[0];dom.attach(item);}
}
});new eProcessor('svg', {
process: function(dom, db) {
var nameMap = dom.D.svg.split('.');var name = nameMap.splice(0, 1)[0];var cls = nameMap.join(' ')+' '+CONF.object.svgCls;if ( def(name) && SVG[name] ) {
var node = cr('div', cls);dom.attach(node);SVG[name](node, { fill: dom.D.fill||'#000' });}
}
})
new eProcessor('bgsvg', {
process: function(dom, db) {
var nameMap = dom.D.bgsvg.split('.');var name = nameMap.splice(0, 1)[0];var cls = nameMap.join(' ')+' '+CONF.object.svgCls;if ( def(name) && SVG[name] ) {
SVG[name].bg(dom, { fill: dom.D.fill||'#000' });}
}
})
new eProcessor('calendar', {
process: function(self, db) {
_jO(self);if ( self.D.validon ) {
if ( !PAGE.urlMap.tpl || !parseLS(self.D.validon).contains(PAGE.urlMap.tpl) ) { self.detach(); return 0; }
}
var view = cr.calendar();self.attach(view);if ( self.D.filteron ) {
if ( PAGE.virtUrl[1] && PAGE.virtUrl[1] != '' ) {
view.val = parseInt(PAGE.virtUrl[1]);}
view.onupdate(function() {
LM.go([self.D.filteron,'/'].join(endOfDay(view.val)*1));})
}
}
});new eProcessor('share', {
process: function(self, db) {
_jO(self).C.baseHref = self.attr('href');self.attr({
href: [self.C.baseHref, encodeURIComponent(SYS.globalUrlModification(self.D.url||PAGE.url))].join(''),target: '_blank'
});clearEvents(self).onclick = function() {
if ( SYS.window.share ) {
SYS.window.share.close();delete SYS.window.share;}
SYS.window.share = window.open(self.attr('href'), 'share', 'width=600,height=400');return false;}
}
});SYS.fetchVars = function() {
if ( def(editor.session.$mode.$highlightRules.getVars) ) {
SYS.savedVars = editor.session.$mode.$highlightRules.getVars(editor.getValue());var newVarsStr = parseStr(SYS.savedVars);if ( newVarsStr != SYS.lastVars) {
SYS.lastVars = newVarsStr;editor.session.$mode.$highlightRules.setVars(SYS.savedVars);editor.session.bgTokenizer.start(0);}
}
}
var snippetManager = ace.require("ace/snippets").snippetManager;var config = ace.require("ace/config");var cbCustom = [];var basickeys = 'ENGINE,SYS,PAGE,ORM';map(parseLS(basickeys), function(bk) {
cbCustom.push({content:bk,name:bk,tabTrigger:bk});mapO(window[bk], function(v,k) {
if ( T(v) == T.F ) {
cbCustom.push({content:[bk,'.',k,'($20$0)$40$0'].join(''),name:[bk,k].join('.'),tabTrigger:k});}
});});mapO(window, function(v,k) {
if ( T(v) == T.F ) {
cbCustom.push({content:[k,'($20$0)$40$0'].join(''),name:k,tabTrigger:k});}
});cbCustom.push({
content:
"var ${1:class} = function(${20}) {\n\
\tvar self = this;\n\
\tvar ENV = getEnv(self);\n\
\t\n\
\tself.init = function($30$0) {$40$0}\n\
\t$60$0\n\
\t\n\
\tself.init();\n\
\t\n\
};\n$80$0",name: "fclass",tabTrigger: "fclass"
});cbCustom.push({
content: "var ENV = getEnv(${1:this});",name: "env",tabTrigger: "env"
});ace.config.loadModule("ace/snippets/javascript", function(m) { 
if (m) { 
snippetManager.files.javascript = m;m.snippets = snippetManager.parseSnippetFile(m.snippetText);map(cbCustom, function(o) { m.snippets.push(o); });snippetManager.register(m.snippets, m.scope); 
} 
}); 
SYS.latestUrls = parseObj(glob('latestUrls') || '[]');SYS.files = SYS.files || {};new eProcessor('editor', {
process: function(self, db) {
_jO(self);var editor = ace.edit(self);editor.setTheme("ace/theme/"+(glob('sett_theme')||'katzenmilch'));editor.getSession().setMode("ace/mode/javascript");SYS.lastEditor = editor;editor.setOptions({
enableBasicAutocompletion: true,enableSnippets: true,enableLiveAutocompletion: true
});var cbCustom = [];var basickeys = 'ENGINE,SYS,PAGE,ORM,window';map(parseLS(basickeys), function(bk) {
cbCustom.add({value:bk, score:30, meta:'BASIC'});mapO(window[bk], function(v,k) {
cbCustom.add({value:k, score:20, meta:bk});cbCustom.add({value:[bk,k].join('.'), score:10, meta:'BASIC'});});})
editor.on('change', function() {
if ( SYS.currentPath && SYS.files[SYS.currentPath] ) {
SYS.files[SYS.currentPath].addCls('modified');}
})
editor.commands.addCommand({
name: 'save',bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},exec: function(editor) {
var cont = editor.getValue();SYS.WS.send({command:'saveFile',path:SYS.currentPath,content:cont});}
});editor.commands.addCommand({
name: 'tabSession',bindKey: {win: 'Ctrl-Tab',  mac: 'Command-Tab'},exec: function(editor) {
if ( SYS.latestUrls.length > 1 ) {
var pth = SYS.latestUrls[SYS.latestUrls.length-2];if ( self._sessions[pth] ) {
db.setSession(self, db, pth, self._sessions[pth]);}
}
}
});editor.commands.addCommand({
name: 'fsMenu',bindKey: {win: 'Esc',  mac: 'Esc'},exec: function(editor) {
if ( !SYS.fsMenuShown ) {
SYS.fsMenu.remCls('hidden');SYS.fsMenuShown = true;} else {
SYS.fsMenu.addCls('hidden');SYS.fsMenuShown = false;}
}
});self._editor = editor;self._sessions = {};EVENT.on('ws_reqFile', function(resp) {
if ( SYS.targetPath == resp.data.path ) {
db.editFile(self, db, resp);}
});EVENT.on('ws_saveFile', function(resp) {
var eng = null;map(SYS.engineAt, function(path) {
if ( resp.data.path.indexOf(path) == 0 ) {
eng = path;return false;}
});if ( eng ) {
SYS.WS.send({command:'iterVersion',path:eng,ind:1});}
SYS.notify(resp.data.msg, 'green');if ( SYS.files[resp.data.path] ) {
SYS.files[resp.data.path].remCls('modified');}
});EVENT.on('ws_notify', function(resp) {
SYS.notify(resp.data);});EVENT.on('selectLang', function(lang) {
var session = editor.getSession();session.__jtxtM = lang;session.setMode("ace/mode/"+lang);EVENT.emit('langSelected', lang);});EVENT.on('selectFontSize', function(size) {
editor.setFontSize(parseInt(size));})
EVENT.on('selectEditorTheme', function(theme) {
editor.setTheme('ace/theme/'+theme);});},editFile: function(self, db, resp) {
var path = resp.data.path;var ext = path.slice(path.lastIndexOf('.')+1);var textMode = ext;if ( def(db.extmap[ext]) ) { textMode = db.extmap[ext]; }
var session = self._sessions[path];if ( !def(session) ) {
session = ace.createEditSession(resp.data.content, 'ace/mode/'+textMode);session.__jtxtM = textMode;session.setUseWorker(false);self._sessions[path] = session;}
EVENT.emit('langSelected', session.__jtxtM);db.setSession(self, db, resp.data.path, session);},setSession: function(self, db, path, session) {
if ( SYS.histUrls[SYS.currentProject] ) {
EVENT.emit('editingFile', path);}
self._editor.setSession(session);if ( SYS.currentPath && SYS.files[SYS.currentPath] ) {
log(SYS.files[SYS.currentPath]);SYS.files[SYS.currentPath].remCls('current')
}
SYS.currentPath = path;SYS.latestUrls.remove(SYS.currentPath);SYS.latestUrls.add(SYS.currentPath);if ( SYS.files[SYS.currentPath] ) {
SYS.files[SYS.currentPath].addCls('current')
}
glob('latestUrls', parseStr(SYS.latestUrls));},extmap: reverseLSDict({
javascript: 'js',python: 'py',html: 'htm,tpl',c_cpp: 'c,cpp,h,hpp',csharp: 'cs'
})
});SYS.drawedDirs = {};SYS.capturedStructure = {};SYS.capturedDirs = {};new eProcessor('tree', {
process: function(self, db) {
_jO(self);SYS.openedDirs = parseObj(glob('openedDirs')||'[]');self.V = selectorMapping(self, {
div:'support,list'
});self.rootPath = null;self.dirs = {};self.F.openPath = function(path) {
self.rootPath = path;self.dirs = {};self.dirs[path] = self.V.list;var pathMap = path.split('/');var name = pathMap[pathMap.length-1];self.V.support.val = name;SYS.WS.send({command:'listDir',path:path});}
if ( self.D.local ) {
tm(self.F.openPath(self.D.local));} else {
EVENT.on('projectChosen', self.F.openPath);}
EVENT.on('ws_listDir', function(resp) {
if ( self.dirs[resp.data.path]) {
resp.data.dir.sort();resp.data.file.sort();SYS.capturedStructure[resp.data.path] = resp.data.file;SYS.capturedDirs[resp.data.path] = resp.data.dir;db.processList(self, db, resp.data);}
});},processList: function(self, db, data) {
var target = self.dirs[data.path];target.innerHTML = '';map(data.dir, function(dirPath) {
var item = VIEW.dir(dirPath);target.attach(item);self.dirs[item.path] = item.V.cont;SYS.drawedDirs[item.path] = item;});map(data.file, function(dirPath) {
var item = VIEW.file(dirPath);target.attach(item);SYS.files[dirPath] = item;});}
});new eProcessor('userData', {
process: function(self, db) {
_jO(self);if ( def(PAGE.user) ) {
var valMap = self.val.split(' ');var newVal = [];map(valMap, function(value) {
if ( def(PAGE.profile[value]) ) {
newVal.push(PAGE.profile[value]);} else if ( def(PAGE.user[value]) ) {
newVal.push(PAGE.user[value]);} else {
newVal.push(value);}
});self.val = newVal.join(' ');} else {
self.val = '';}
}
});new eProcessor('langBtn', {
process: function(self, db) {
_jO(self);var burl = self.href;var chLang = self.D.lang;clearEvents(self).onclick = function() {
var locs = S('.relLoc');var ch = map(locs, function(loc) {
if ( loc.attr('hreflang') == chLang ) {
window.location.assign(loc.attr('href'));return false;}
});if ( ch != false ) {
window.location.assign(burl);}
return false;}
}
});new eProcessor('sett', {
process: function(self, db) {
_jO(self);var name = self.D.sett;var opts = {};map(db.options[name], function(val) { opts[val] = val; })
var dd = cr.dropdown(opts, null, self);(db.parsers[name]||db.parsers.def)(self, db, dd);var val = (glob('sett_'+name));if ( val ) { dd.val = val; }
dd.onupdate(function(val) {
glob('sett_'+name, val);})
},parsers: {
def: function(){},font: function(self, db, dd) {
dd.directSelect = function(val) { EVENT.emit('selectFontSize', val); }
},theme: function(self, db, dd) {
dd.directSelect = function(val) { EVENT.emit('selectEditorTheme', val); }
},lang: function(self, db, dd) {
dd.directSelect = function(val) {
EVENT.emit('selectLang', val);}
EVENT.on('langSelected', function(lang) {
dd.val = lang;})
}
},options: {
font  : RNG(30).sl([10]),theme : ['xcode', 'chrome', 'tomorrow', 'tomorrow_darvix', 'dawn', 'katzenmilch', 'kuroir', 'idle_fingers','monokai', 'twilight', 'ambiance', 'kr_theme'],lang  : ["text", "batchfile", "c_cpp", "coffee", "csharp", "css", "django", "erlang", "haskell", "html","ini", "java", "javascript", "json", "less", "lua", "mysql", "objectivec", "paskal", "perl", "pgsql","php", "powershell", "python", "ruby", "scala", "sh", "smarty", "sql", "vbscript", "xml", "yaml","r2d3"]
}
})
new eProcessor('sourcemusic', {
process: function(self, db) {
_jO(self);SYS.musicAt = (glob('musicAt')||'').split(',');self.val = SYS.musicAt.join('\n');self.onblur = function() {
glob('musicAt', self.val.rp('\n',','));}
}
});new eProcessor('sources', {
process: function(self, db) {
_jO(self);SYS.projects = (glob('projectList')||'').split(',');self.val = SYS.projects.join('\n');self.onblur = function() {
glob('projectList', self.val.rp('\n',','));}
}
});new eProcessor('sourceengine', {
process: function(self, db) {
_jO(self);SYS.engineAt = (glob('engineAt')||'').split(',');SYS.versionAt = [];SYS.currentVersions = {};SYS.currentVersionStr = {};map(SYS.engineAt, function(path) {
if ( path.rp(/]s+/g,'').length > 0 ) {
var vpath = path+'/version';SYS.versionAt.push(vpath);(setInterval(function(){
SYS.WS.send({command:'reqFile',path:vpath});}, 30000));tm(function(){ SYS.WS.send({command:'reqFile',path:vpath}); }, 200);}
})
EVENT.on('ws_reqFile', function(resp) {
if ( SYS.versionAt.contains(resp.data.path) ) {
SYS.currentVersions[resp.data.path] = parseFloat(resp.data.content);SYS.currentVersionStr[resp.data.path] = resp.data.content;EVENT.emit('ws_version', resp.data.path);}
});EVENT.on('ws_notFound', function(resp) {
if ( SYS.versionAt.contains(resp.data.path) ) {
delete SYS.currentVersions[resp.data.path];SYS.versionAt.remove(resp.data.path);SYS.engineAt.remove(resp.data.path.sl([0, (('/version').length * -1)]));}
});EVENT.on('ws_notify', function(resp) {
SYS.notify(resp.data);});self.val = SYS.engineAt.join('\n');self.onblur = function() {
glob('engineAt', self.val.rp('\n',','));}
}
});SYS.prepVersions = function() {
var keys = okeys(SYS.currentVersions);if ( keys.length > 0 ) {
var max = SYS.currentVersions[keys[0]];var from = keys[0];mapO(SYS.currentVersions, function(ver, path) {
if ( max < ver ) {
from = path;max = ver;}
});from = from.split('/').sl([0,-1]).join('/');return { path: from, ver:max};}
return null;}
SYS.syncEngine = function(path) {
var max = SYS.prepVersions();if( !max ) { return 0; }
var ver = SYS.currentVersions[path+'/version'];if ( ver < max.ver ) {
SYS.WS.send({command:'syncTargeted',src:max.path,target:path,backOld:true,compile:true});SYS.WS.send({command:'reqFile',path:path+'/version'});}
}
SYS.syncEngines = function(path) {
var max = SYS.prepVersions();if( !max ) { return 0; }
var ver = SYS.currentVersions[path+'/version'];if ( ver < max.ver ) {
SYS.notify('not actual version!', 'red');} else {
SYS.WS.send({command:'compileTarget',path:path});SYS.WS.send({command:'iterVersion',path:path,ind:0});}
}
new eProcessor('musicplayer', {
process: function(self, db) {
_jO(self);self.dirs = {};self.view = VIEW.musicplayer();self.attach(self.view);}
});new eProcessor('timer', {
selector: '.timer',process: function(self, db) {
_jO(self);var func = function() {
self.val = formatDate(new Date()*1, true, true, true);}
self.C.timer = setInterval(func, 1000);func();}
});new eProcessor('fsMenu', {
process: function(self, db) {
_jO(self);self.children = getChildren(self);self.int = null;self.close = function() {
self.addCls('hidden');SYS.fsMenuShown = false;SYS.lastEditor.focus();}
self.onclick = function() {
self.int = tm(self.close, 4);}
map(self.children, function(node) {
node.onclick = function() {
tm(function() {
clearInterval(self.int);}, 2);}
});}
});new eProcessor('iframeblock', {
process: function(self, db) {
_jO(self);self.ind = db.getIndex(db);self.focused = false;self.addCls('browserWindow')
self.V.domain = self.cr('input', 'domainInput').attr({type:'text'});self.V.viewport = self.cr('div', 'viewport').cr('iframe');self.C.curUrl = glob('bwUrl_'+self.ind) || 'about:blank';self.goUrl = function(val) {
self.V.domain.val = val;if ( self.C.curUrl == val ) {
self.V.viewport.src = 'about:blank';}
tm(function(){ self.V.viewport.src = val; });self.C.curUrl = val;glob('bwUrl_'+self.ind, val);}
self.getUrl = function() {
try {
if ( !self.focused ) {
self.V.domain.val = self.V.viewport.contentWindow.location.href;}
} catch(err) {
self.getUrl = function(){};}
}
self.V.domain.onfocus = function() { self.focused = true; }
self.V.domain.onblur  = function() { self.focused = false; }
self.V.domain.onupdate(self.goUrl);self.V.domain.onkeyup = function(ev) {
if ( ev.keyCode == 13 ) {
self.goUrl(self.V.domain.val);}
}
self.goUrl(self.C.curUrl);setInterval(self.getUrl, 1000);},index: 0,getIndex: function(db) {
return db.index += 1;}
});SYS.histUrls = parseObj(glob('histUrls')||'{}');new eProcessor('history', {
folderCount:3,process: function(self, db) {
_jO(self);self.fileNodes = [];self.lastDirs = new T.A(db.folderCount);self.rebuild = function() {
self.innerHTML = '';map(SYS.histUrls[SYS.currentProject], function(path) {
db.drawNode(self, db, path);})
}
EVENT.on('projectChosen', function(path) {
SYS.histUrls[SYS.currentProject] = SYS.histUrls[SYS.currentProject] || [];self.fileNodes = [];self.rebuild();});EVENT.on('editingFile', function(path) {
var obj = SYS.histUrls[SYS.currentProject];obj.remove(path);obj.add(path);if ( obj.length > 100 ) {
SYS.histUrls[SYS.currentProject] = obj.sl([-100]);}
glob('histUrls', parseStr(SYS.histUrls));db.drawNode(self, db, path);})
},drawNode: function(self, db, path) {
var node = (self.fileNodes[path] || (self.fileNodes[path] = VIEW.file(path)));var names = path.split('/');var fl = names.sl([-1])[0];var names = names.sl([-db.folderCount,-1]);node.V.title.val = '';map(names, function(dir, ind) {
var nd = node.V.title.cr('span','label col').VAL(dir);if ( self.lastDirs[ind] && self.lastDirs[ind].val == dir ) {
self.lastDirs[ind].addCls('dateHid');}
self.lastDirs[ind] = nd;});node.V.title.cr('span','').VAL(fl);self.attachFirst(node);}
});SYS.projects = {};SYS.currentProject = null;SYS.PG = {};new eProcessor('projects', {
process: function(self, db) {
_jO(self);tm(db._process(self, db));},_process: function(self, db) {
map(SYS.projects, function(project) {
if ( project.rp(/\s+/g, '').length > 0 ) {
self.attach(VIEW.project(project));}
})
}
});new eProcessor('maintabs', {
process: function(self, db) {
_jO(self);EVENT.on('projectChosen', function() {
if( self.switchTo ) {
self.switchTo(1);}
})
}
});{
var calcWindowSize = function() {
EVENT.data.windowSize = {
x: window.innerWidth  || document.documentElement.clientWidth  || document.body.clientWidth,y: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
}
}
new eEvent('resize', {
initiator: window,ontrigger: calcWindowSize
}, calcWindowSize);}
{
new eEvent('mousemove', {
ontrigger: function(ev) {
EVENT.data.cursor = {
x:ev.clientX,y:ev.clientY,sx:ev.screenX,sy:ev.screenY
};}
});}
{
new eEvent('keyup', {
ontrigger: function(ev) {
if ( def(ev.ctrlKey) ) {
EVENT.data.key = {
ctrl: ev.ctrlKey,alt: ev.altKey,shift: ev.shiftKey
}
} else {
EVENT.data.key = {
ctrl: null,alt: null,shift: null
}
}
}
});}
EVENT.data.key = {
ctrl:  false,alt:   false,shift: false
}
{
var calcDocumentScroll = function() {
EVENT.data.windowScroll = {
x: window.pageXOffset || document.documentElement.scrollLeft,y: window.pageYOffset || document.documentElement.scrollTop
}
}
new eEvent('scroll', {
initiator: window,ontrigger: calcDocumentScroll
}, calcDocumentScroll);}
{
new eEvent('keydown', {
ontrigger: function(ev) {
if ( def(ev.ctrlKey) ) {
EVENT.data.key = {
ctrl: ev.ctrlKey,alt: ev.altKey,shift: ev.shiftKey
}
} else {
EVENT.data.key = {
ctrl: null,alt: null,shift: null
}
}
}
});}
{
new eEvent('mousedown', {
ontrigger: function(ev) {
if ( def(ev.button) ) {
EVENT.data.button = ev.button;} else {
EVENT.data.button = 0;}
}
});}
{
new eEvent('click', {
ontrigger: function(ev) {
if ( def(ev.button) ) {
EVENT.data.button = ev.button;} else {
EVENT.data.button = 0;}
}
});}
{
new eEvent('storage', {
initiator: window,ontrigger: function(ev) {
if ( EVENT.stor[ev.key] && ev.newValue != '' ) {
EVENT.stor[ev.key](parseObj(ev.newValue));}
}
});}
var PAGE = new eScenario('page', { autoClear: true });var INIT = new eScenario('init', { initialRun: true });var initNode = function(link, self, done) {
var cnn = S('.canonical')[0];PAGE.virtUrl = [];if ( cnn ) {
PAGE.url = ENGINE.modLink(cnn.attr('href'));if ( window.location.href.indexOf(cnn.attr('href')) == 0 ) {
PAGE.virtUrl = window.location.href.sl([cnn.attr('href').length]).split('/');}
} else {
PAGE.url = ENGINE.modLink(window.location.href);}
var urlMap = PAGE.url.split('/');PAGE.urlMap = {
data:urlMap,lang:urlMap[3]||'en',tpl:urlMap[4]
}
$P(PAGE, 'lang', function() {
return PAGE.urlMap.lang;}, function(newLang) {
var newUMap = CO(PAGE.urlMap);newUMap.lang = newLang;newUMap.data[3] = newLang;ENGINE.goPage(newUMap.data.join('/'), function() {
PAGE.urlMap = newUMap;PAGE.langObj = ORM.O('lang_'+newLang);}, null, function() {
POP.info.show(cr('div', 'alert').VAL(PAGE.ld('this page has not being translated yet')));});});done();}
INIT.addAction('init', initNode);PAGE.addAction('init', initNode);INIT.addAction('ormRules', function(link, self, done) {
done();}, { autoRun:'init' });INIT.addAction('lang', function(link, self, done) {
PAGE.langObj = {
name: PAGE.lang,strs: {}
}
PAGE.ld = function() {
for ( var i = 0; i < arguments.length; i++ ) {
var val = arguments[i];if ( PAGE.langObj.strs[val] ) { return PAGE.langObj.strs[val]; }
}
return arguments[arguments.length-1];}
done();return 0;}, { autoRun: 'ormRules' });INIT.addAction('authCheck', function(link, self, done) {
PAGE.level = 20;done();}, { autoRun: 'lang' });INIT.addAction('prep_userdata', function(link, self, done) {
PAGE.userData = {};PAGE.profiles = [];PAGE.profile  = {};done();}, { autoRun: 'authCheck' });INIT.addAction('layer_prep', function(link, self, done) {
SYS.fsMenu = S('.fsMenu')[0];SYS.fsMenuShown = false;LM.fetchPos(done);}, { autoRun: 'prep_userdata' });INIT.addAction('init_user', function(link, self, done) {
PAGE.run();done();}, { autoRun: 'layer_prep' });PAGE.addAction('dom', function(link, self, done) {
SYS.body = document.body;if ( !PAGE.level ) {
map(S('.ALF'), function(node) {
node.onclick = ENGINE._auth.askLogin;});} else {
map(S('.ALF'), function(node) {
node.onclick = function() {
ENGINE._auth.authCancel();ENGINE._auth.reload();}
});}
ENGINE.processDom();ENGINE.processDomFinish();map(S('blockquote'),   function(node) { SVG.meshChess.bg(node, {fill:'rgba(255,255,255,0.25)'});})
EVENT.resize.push(function() {
map(S('textarea'), adjustHeight);});map(S('textarea'), autoAdjust);done();}, { autoRun: 'init'});