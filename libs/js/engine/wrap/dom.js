

function getSel() {
    var sel = window.getSelection();
    try {
        return sel.getRangeAt(0);
    } catch(err) {
        return null;
    }
}


function restoreSelectionAfter(func) {
    try {
        var sel = window.getSelection();
        var rng = sel.getRangeAt(0);
        var rngBounds = [rng.startContainer,rng.startOffset,rng.endContainer,rng.endOffset];
        func();
        rng.setStart(rngBounds[0],rngBounds[1]);
        rng.setEnd(rngBounds[2],rngBounds[3]);
        sel.removeAllRanges();
        sel.addRange(rng);
        return true;
    } catch(err) {
        func();
        return false;
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
extendPrimitive(Node, 'addCls', f(cls) { addCls(this, cls); });

remCls = function(node, cls) {
    node.className = node.className.split(cls).join('');
    node.className = node.className.split('  ').join(' ');
}
extendPrimitive(Node, 'remCls', f(cls) { remCls(this, cls); });

swCls = function(node, cls) {
    if ( node.className.indexOf(cls) == -1 ) {
        addCls(node, cls);
        return true;
    }
    remCls(node, cls);
    return false;
}
extendPrimitive(Node, 'swCls', f(cls) { swCls(this, cls); });



function attach(node, target) { target.appendChild(node); }
extendPrimitive(Node, 'attach', f(node) { attach(node, this); });


function attachFirst(node, target) {
    if( target.childNodes ) {
        target.insertBefore(node, target.firstChild);
    } else {
        target.attach(node);
    }
}
extendPrimitive(Node, 'attachFirst', f(node) { attachFirst(node, this); });


function detach(node) {
    if ( node && node.parentNode ) {
        node.parentNode.removeChild(node);
    }
}
extendPrimitive(Node, 'detach', f() { detach(this); });



function getChildren(node) {
    var children = [];

    for( var i in node.childNodes ) {
        if( node.childNodes[i].nodeType === 1 ) {
            children.push(node.childNodes[i]);
        }
    }

    return children;
}
extendPrimitive(Node, 'getChildren', f() { getChildren(this); });



function insBefore(node, target) {
    if ( !def(target.parentNode) ) { return 0; }
    target.parentNode.insertBefore(node, target);
}
extendPrimitive(Node, 'insBefore', f(node) { insBefore(node, this); });

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
extendPrimitive(Node, 'insAfter', f(node) { insAfter(node, this); });




function setTag(node, data, params) {
    params = mergeObjects({
        cls  : true,
        attr : true
    },params);
    
    var newNode, rngData;
    
    var selObj = getSel()
    if ( !selObj || selObj.startContainer != node ) {
        selObj = null;
    } else {
        rngData = [selObj.startOffset, selObj.endOffset, selObj.startContainer.nodeType];
    }
    
    restoreSelectionAfter(f(){
        if ( !def(data) ) {
            newNode = document.createTextNode(node.val);
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
            newNode = cr(tag, cls);
            
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
            
            if ( selObj ) {
                var sel = window.getSelection();
                sel.removeAllRanges();
                
                
                try {
                    if ( rngData[2] == 3 ) {
                        selObj.setStartAfter(newNode);
                        selObj.setEndAfter(newNode);
                    } else {
                        selObj.setStart(newNode,rngData[0]);
                        selObj.setEnd(newNode,rngData[1]);
                    }
                } catch(err) {
                    selObj.setStart(newNode,0);
                    selObj.setEnd(newNode,0);
                }
                sel.addRange(selObj);
            }
        }
    });
    
    
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



function insToSelection(dom) {
    var sel = getSel();
    if (sel) {
        
        sel.insertNode(dom);
        
        var parent = dom.parentNode;
        
        if ( parent._tag == 'p' ) {
            var sibs = parent.getChildren();
            
            if ( sibs.length == 2 && dom == sibs[0] && sibs[1]._tag == 'br' ) {
                detach(sibs[1]);
            } 
        }
    }
}


ENGINE.selections = {};
function saveSelection(name) {
    var sel = getSel();
    if ( sel ) {
        ENGINE.selections[name] = [sel.startContainer, sel.startOffset, sel.endContainer, sel.endOffset];
    }
    
}

function restoreSelection(name) {
    var rdata = ENGINE.selections[name];
    
    if ( rdata && rdata[0] && rdata[2] ) {
        var sel = window.getSelection();
        var range = document.createRange();
        
        range.setStart(rdata[0], rdata[1]);
        range.setEnd(rdata[2], rdata[3]);
        
        sel.removeAllRanges();
        sel.addRange(range);
    }
    
}




$P(Node.prototype, 'val',
function() {
    if ( this.__isHtml ) { return this.innerHTML; }
    if ( def(this.value) ) {
        if ( this.type == 'checkbox' ) {
            return this.checked;
        }
        return this.value;
    }
    return this.textContent;
},
function(data) {
    if ( this.__isHtml ) { return this.innerHTML = data; }
    if ( def(this.value) ) {
        if ( this.type == 'checkbox' ) {
            return this.checked = data;
        }
        return this.value = data;
    }
    return this.textContent = data;
});


extendPrimitive(Node,'VAL', f(value) {
    if ( def(value) ) {
        this.val = value;
        return this;
    }
    return this.val;
});


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
extendPrimitive(Node, 'attr', f(key, value) { return attr(this, key, value); });

function remattr(node, keys) {
    keys = parseLS(keys);
    map(keys, function(key) {
        node.removeAttribute(key);
    });
    
    return node;
}
extendPrimitive(Node, 'remattr', f(keys) { return remattr(this, keys); });
extendPrimitive(Node, 'remAttr', Node.prototype.remattr);





function cr(tag, cls, parent) {
    var node = document.createElement(tag);
    if ( def(cls) ) { node.className = cls; }
    if ( def(parent) ) { parent.appendChild(node); node.parent = parent; }
    
    return node;
}

extendPrimitive(Node, 'cr', f(tag, cls) { return cr(tag, cls, this); });






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
    node.C._emitValue = f(val) {
        node.C._updFunc.map(function(func) {
            func(val);
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

extendPrimitive(Node, 'onupdate', f(func, eraseOld) {
    if ( !def(this.C) || !def(this.C._updData) ) { dispatchOnUpdate(this); }
    if ( eraseOld ) { this.C._updFunc = []; }
    this.C._updFunc.add(func);
});





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
extendPrimitive(Node, 'setView', f(tag, cls, func) {
    if ( def(tag) ) { return setNodeView(this, tag, cls, func); }
    return remNodeView(this);
});

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
extendPrimitive(Node, 'adjustHeight', f() { return adjustHeight(this);});


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
extendPrimitive(Node, 'clearEvents', f() { return clearEvents(this); });




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



extendPrimitive(Node, 'isValid', f(){ return true; })




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
extendPrimitive(Node, 'getOffsetRect', f() { return getOffsetRect(this); });







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
















