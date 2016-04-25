
function insToSelection(dom) {
    var sel = window.getSelection();
    if (sel.rangeCount) {
        var range = sel.getRangeAt(0);
        range.insertNode(dom);
    }
}


function S(query, node, direct) {
    var marker = query[0];
    var str    = query.substring(1, query.length);
    var result = null;
    
    if ( marker == '#' ) {
        return document.getElementById(str);
    }
    
    node = node||document;
    if ( marker == '.' ) {
        result = listToArray(node.getElementsByClassName(str));
    } else {
        result = listToArray(node.getElementsByTagName(query));
    }
    
    if ( def(direct) && direct ) {
        var newResult = [];
        map(result, function(elem) {
            if ( elem.parentNode == node ) { newResult.push(elem); }
        });
    }
    
    return result;
}



addCls = function(node, cls) {
    if ( node.className.split(/\s+/g).indexOf(cls) == -1 ) {
        node.className += ' '+cls;
    }
}
Node.prototype.addCls = function(cls) { addCls(this, cls); }

remCls = function(node, cls) {
    node.className = node.className.split(cls).join('');
    node.className = node.className.split('  ').join(' ');
}
Node.prototype.remCls = function(cls) { remCls(this, cls); }

swCls = function(node, cls) {
    if ( node.className.indexOf(cls) == -1 ) {
        addCls(node, cls);
        return true;
    }
    remCls(node, cls);
    return false;
}
Node.prototype.swCls = function(cls) { return swCls(this, cls); }



function attach(node, target) { target.appendChild(node); }
Node.prototype.attach = function(node) { attach(node, this); }


function attachFirst(node, target) {
    if( target.childNodes ) {
        target.insertBefore(node, target.firstChild);
    } else {
        target.attach(node);
    }
}
Node.prototype.attachFirst = function(node) { attachFirst(node, this); }


function detach(node) {
    if ( node && node.parentNode ) {
        node.parentNode.removeChild(node);
    }
}
Node.prototype.detach = function() { detach(this); }



function getChildren(node) {
    var children = [];

    for( var i in node.childNodes ) {
        if( node.childNodes[i].nodeType === 1 ) {
            children.push(node.childNodes[i]);
        }
    }

    return children;
}
Node.prototype.getChildren = function() { return getChildren(this); }



function insBefore(node, target) {
    if ( !def(target.parentNode) ) { return 0; }
    target.parentNode.insertBefore(node, target);
}
Node.prototype.insBefore = function(node) { insBefore(node, this); }

function insAfter(node, target) {
    var parent = target.parentNode;
    var next   = target.nextSibling;
    if ( !def(parent) ) { return 0; }
    
    if ( def(next) ) {
        insBefore(node, next);
    } else {
        parent.attach(node);
    }
}
Node.prototype.insAfter = function(node) { insAfter(node, this); }




function setTag(node, data, params) {
    params = mergeObjects({
        cls: true,
        attr: true
    },params);
    
    if ( !def(data) ) {
        var newNode = document.createTextNode(node.val);
    } else {
        var cls = data.split('.');
        var tag = cls.splice(0, 1)[0];
        
        if ( !params.cls ) {
            cls = null;
        } else if ( cls.length == 0 ) {
            cls = node.className;
        } else {
            cls = cls.join(' ');
        }
        var newNode = cr(tag, cls);
        
        if ( node.nodeType == 3 ) {
            newNode.val = node.val;
        } else {
            while (node.firstChild) {
                newNode.appendChild(node.firstChild);
            }
            if ( params.attr ) {
                var attrs = {};
                mapO(node.attributes, function(attr) {
                    if ( attr.name ) { attrs[attr.name] = attr.value; }
                });
                newNode.attr(attrs);
            }
        }
    }
    
    if ( node.C ) { _jO(newNode, node); }
    
    if ( node.parentNode ) {
        insBefore(newNode, node);
        detach(node);
    }
    
    return newNode;
}


$P(Node.prototype, '_tag',
    function() {
        if ( this.tagName ) {
            return this.tagName.toLowerCase();
        }
        return null;
    },
    function(data) {
        return setTag(this, data);
    }
);





$P(Node.prototype, 'val',
function() {
    if ( this.__isHtml ) { return this.innerHTML; }
    if ( def(this.value) ) { return this.value; }
    return this.textContent;
},
function(data) {
    if ( this.__isHtml ) { return this.innerHTML = data; }
    if ( def(this.value) ) { return this.value = data; }
    return this.textContent = data;
});



Node.prototype.VAL = function(value) {
    if ( def(value) ) {
        this.val = value;
        return this;
    }
    return this.val;
}


function attr(node, key, value) {
    if ( typeof(key) == 'object' ) {
        mapO(key, function(value, key) {
            node.setAttribute(key, value);
        });
        return node;
    }
    if ( def(value) ) {
        node.setAttribute(key, value);
        return node;
    }
    return node.getAttribute(key);
}
Node.prototype.attr = function(key, value) { return attr(this, key, value); }

function remattr(node, keys) {
    keys = parseLS(keys);
    map(keys, function(key) {
        node.removeAttribute(key);
    });
    
    return node;
}
Node.prototype.remattr = function(keys) { return remattr(this, keys); }





function cr(tag, cls, parent) {
    var node = document.createElement(tag);
    if ( def(cls) ) { node.className = cls; }
    if ( def(parent) ) { parent.appendChild(node); node.parent = parent; }
    
    return node;
}

Node.prototype.cr = function(tag, cls) {
    return cr(tag, cls, this);
}






function formatDate(date, withTime, includeYear, includeSeconds) {
    if ( !def(date) || date.length == 0 ) { return ''; }
    var dateInt = parseInt(date);
    if ( date == dateInt ) { date = dateInt; }
    var fDate = new Date(date);
    var today = new Date();
    
    if ( fDate == 'Invalid Date' ) {
        try {
            var dtMap = obj.created_at.split(' ')
            var fDate = new Date(dtMap[0]);
            dtMap     = dtMap[1].split(':');
            fDate.setHours(dtMap[0]);
            fDate.setMinutes(dtMap[1]);
        } catch(err) { fDate = today; }
    }
    
    var dateString = [fDate.getDate().toLen(), (fDate.getMonth()+1).toLen() ];
    
    if ( fDate.getFullYear() != today.getFullYear() || includeYear) {
        dateString.push(fDate.getFullYear().toLen(4));
    } else if ( fDate.getDate() == today.getDate() && fDate.getMonth() == today.getMonth() ) {
        dateString = [];
    }
    
    dateString = dateString.join('/');
    if ( withTime ) {
        dateString += [' ', fDate.getHours().toLen(), ':', fDate.getMinutes().toLen()].join('');
        if ( includeSeconds ) {
            dateString += ':'+fDate.getSeconds().toLen();
        }
    }
    return dateString;
}

function formatDateBackwards(str) {
    var date = str.split(' ')[0];
    var date = date.split('/');
    if ( date.length != 3 ) { return str; }
    return date[2]+'-'+date[1]+'-'+date[0];
}



function formatTimer(est) {
    est /= 1000;
    var mins = parseInt(est/60);
    var secs = parseInt(est-(mins*60));
    return [mins.toLen(),secs.toLen()].join(':');
}











function dispatchOnUpdate(node) {
    _jO(node).C._updData = null;
    node.C._updFunc = [];
    node.C._emitUpdated = function() {
        node.C._updFunc.map(function(func) {
            func(node.val);
        });
    }
    node.addEventListener('focus', function(ev){ this.C._updData = this.val; });
    node.addEventListener('blur', function(ev){
        if ( this.C._updData != this.val ) {
            node.C._emitUpdated();
        }
        
    });
    return node;
}

Node.prototype.onupdate = function(func, eraseOld) {
    if ( !def(this.C) || !def(this.C._updData) ) { dispatchOnUpdate(this); }
    if ( eraseOld ) { this.C._updFunc = []; }
    this.C._updFunc.add(func);
}






function setNodeView(node, viewTag, cls, func) {
    _jO(node).V.viewNode = _jO(cr(viewTag, node.className));
    if ( def(cls) ) { node.V.viewNode.addCls(cls); }
    insBefore(node.V.viewNode, node);
    detach(node);
    
    node.V.viewNode.__isHtml = node.__isHtml;
    node.V.viewNode.val      = node.val;
    
    if ( def(func) ) {
        node.V.viewNode.onupdate(func);
    }
}

function remNodeView(node) {
    if ( def(_jO(node).V.viewNode) ) {
        insBefore(node, node.V.viewNode);
        node.V.viewNode.detach();
        
        node.val = node.V.viewNode.val;
        delete node.V.viewNode;
        return true;
    }
    return false;
}

Node.prototype.setView = function(tag, cls, func) {
    if ( def(tag) ) { return setNodeView(this, tag, cls, func); }
    return remNodeView(this);
}

function adjustHeight(node, fetch) {
    if ( node.scrollHeight ) {
        if ( fetch ) {
            node.style.height = '0px';
        }
        if ( node.scrollHeight + 2 - node.offsetHeight > 2 ) {
            node.style.height = node.scrollHeight+2+'px';
        }
    }
    return node;
}
Node.prototype.adjustHeight = function() { return adjustHeight(this);}


function autoAdjust(node) {
    evt(node, 'keydown', node.adjustHeight);
    evt(node, 'keyup',   node.adjustHeight);
    evt(node, 'focus',   node.adjustHeight);
    evt(node, 'blur',    node.adjustHeight);
    node.adjustHeight();
    return node;
}










function clearEvents(node) {
    node.onclick =     function() { return false; }
    node.onmouseup =   function() { return false; }
    node.onmousedown = function() { return false; }
    node.onmousemove = function() { return false; }
    return node;    
}
Node.prototype.clearEvents = function() { return clearEvents(this); }




function selectorMapping(node, data) {
    node = node||document;
    var result = {};
    
    mapO(data, function(keys, selector) {
        if ( typeof(keys) == 'string' ) { keys = keys.split(','); }
        
        var list = S(selector, node);
        
        map(keys, function(key, index) {
            result[key] = list[index];
        })
    });
    
    return result;
}




function domSearch(list, pattern, funcOk, funcBad, params) {
    params  = params || {};
    funcOk  = funcOk ||function(node) { node.remCls('hidden'); }
    funcBad = funcBad||function(node) { node.addCls('hidden'); }
    pattern = pattern.toLowerCase();
    
    
    var result = [];
    
    params.limit = params.limit || list.length;
    if ( params.reqValue && pattern.length == 0 ) { params.limit = 0; }
    var i = 0;
    var j = 0;
    
    for ( ; i < list.length && j < params.limit; i++ ) {
        var node = list[i];
        if ( node.val.toLowerCase().contains(pattern) ) {
            funcOk(node);
            result.push(node);
            j += 1;
        } else {
            funcBad(node);
        }
    }
    
    for ( ; i < list.length; i++ ) { funcBad(list[i]); }
    
    return result;
}



function switchActive(list, node, cls) {
    list = objToArray(list);
    cls  = cls||'active';
    
    mapO(list, function(node) {
        node.remCls(cls);
    });
    node.addCls(cls);
}






function getOffsetRect(elem) {
    var box        = elem.getBoundingClientRect();
    var body       = document.body;
    var docElem    = document.documentElement;
    var clientTop  = docElem.clientTop  || body.clientTop  || 0;
    var clientLeft = docElem.clientLeft || body.clientLeft || 0;
    var top        = 0;
    var left       = 0;
    
    if ( 0 && isMOB ) {
        top  = box.top  - clientTop;
        left = box.left - clientLeft;
    } else {
        var scrollTop  = window.pageYOffset || docElem.scrollTop  || body.scrollTop;
        var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
        
        top  = box.top  + scrollTop  - clientTop;
        left = box.left + scrollLeft - clientLeft;
    }
    
    return { top: Math.round(top), left: Math.round(left) }
}
Node.prototype.getOffsetRect = function() { return getOffsetRect(this); }










//- SCROLL
function getDocumentScroll() {
    if ( ENGINE.isFF ) {
        var temp = S('html')[0];
        return [temp.scrollLeft, temp.scrollTop, temp.scrollWidth, temp.scrollHeight];
    }
    return [document.body.scrollLeft, document.body.scrollTop, document.body.scrollWidth, document.body.scrollHeight];
}






if ( window.scrollTo ) {
    window.__scrollFunction = window.scrollTo;
} else if ( window.scroll ) {
    window.__scrollFunction = window.scroll;
} else {
    window.__scrollFunction = function(x, y) {
        document.body.scrollLeft = x;
        document.body.scrollTop  = y;
    }
}



var __scrollAnimationInterval = null;

function setDocumentScroll(val) {
    val = val||[0,0];
    clearInterval(__scrollAnimationInterval);
    
    var pos = getDocumentScroll();
    var steps = %animationTimeout / %animationStep;
    var step = (val[1] - pos[1]) / steps;
    
    if ( 1 || ENGINE.isMOB ) {
        window.__scrollFunction(val[0],val[1]);
    } else {
        __scrollAnimationInterval = setInterval(function() {
            pos[1] += step;
            window.__scrollFunction(val[0],pos[1]);
            
            steps -= 1;
            if ( steps == 0 ) { clearInterval(__scrollAnimationInterval); }
            
        }, %animationStep);
    }
    
    
}
















