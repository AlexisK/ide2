
function nf(){}

function log() { for ( var key in arguments) { console.log(key+':', arguments[key]); } }

function def(val) { return typeof(val) != 'undefined' && val !== null; }

function okeys(obj) { try { return Object.keys(obj); } catch(err) { return []; }}


function extendPrimitive(base, key, f) {
    base.prototype[key] = f;
    Object.defineProperty(base.prototype, key, {
        enumerable: false
    });
}


var T = function(ref,tMap) {
    if ( !def(ref) ) { return null; }
    if ( tMap ) {
        var C = ref.constructor;
        
        for ( var i = 0; i < tMap.length; i++ ) {
            if ( C == T[tMap[i]] ) {
                return true;
            }
        }
        return false;
    }
    
    return ref.constructor;
}
T.B = Boolean;
T.R = RegExp;
T.E = Error;
T.S = String;
T.D = Date;
T.O = Object;
T.F = Function;
T.A = Array;
T.N = Number;

function getEnv(obj) {
    return obj.__ENV || {};
}

extendPrimitive(T.F,'ENV',f(env) {
    var fn = this;
    
    return f() {
        var args = arguments,
            context = Object.create(this);
        context.__ENV = env;
        return fn.apply(context,args);
    };
});

function tm(func, timer) {
    timer = timer||1;
    return setTimeout(func, timer);
}
extendPrimitive(T.F, 'tm', f() {
    var ENV = getEnv(this);
    var tm = ENV.delay || 1;
    var fn = this;
    var args = arguments;
    
    setTimeout(function() { fn.apply(fn, args); }, tm);
});









var docCookies = {
  getItem: function (sKey) {
    if (!sKey) { return null; }
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function (sKey, sPath, sDomain) {
    if (!this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    if (!sKey) { return false; }
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
  keys: function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
    return aKeys;
  }
};



function testStorage() {
    try {
        localStorage.setItem('test',1);
        localStorage.removeItem('test');
        window.___glob = localStorage;
    } catch(err) {
        window.___glob = docCookies;
    }
    
    window.glob = function(key, val) {
        if ( def(val) ) {
            return window.___glob.setItem(key, val);
        }
        return window.___glob.getItem(key);
    }
    window.glob.removeItem = function(key) {
        window.___glob.removeItem(key)
    }
}

testStorage();


extendPrimitive(T.N, 'toLen', f(len) {
    len     = len || 2;
    var str = this.toString();
    var res = '';
    for ( var i = str.length; i < len; i++ ) { res += '0'; }
    return res+str;
});

extendPrimitive(String, 'toLen', T.N.prototype.toLen);


function listToArray(list) {
    var result = [];
    
    for ( var i = 0, len = parseInt(list.length); i < len; i++ ) {
        result.push(list[i]);
    }
    
    return result;
}

function objToArray(obj) {
    if ( obj.constructor && obj.constructor == Array ) { return obj; }
    var result = [];
    mapO(obj, function(data) {
        if ( data ) { result.push(data); }
    });
    return result;
}


function map(list, func, data) {
    data          = data || this;
    data.returnOn = data.returnOn || false;
    
    for ( var i = 0, len = parseInt(list.length); i < len; i++ ) {
        if ( data.returnOn == func(list[i], i) ) {
            return 0;
        }
    }
    if ( list.length == 0 && data.else ) {
        data.else();
    }
    return !data.returnOn;
}

function mapO(obj, func, data) {
    var ENV = getEnv(this);
    data          = data || this;
    data.returnOn = data.returnOn || ENV.returnOn || false;
    data.sort = data.sort || ENV.sort;
    obj           = obj||ENV.obj||{};
    
    var keys = ENV.keys || Object.keys(obj);
    
    if ( data.sort ) {
        keys.sort(data.sort);
    }
    
    for ( var i = 0, len = parseInt(keys.length); i < len; i++ ) {
        if ( data.returnOn == func(obj[keys[i]], keys[i]) ) {
            return data.returnOn;
        }
    }
    
    if ( keys.length == 0 && data.else ) {
        data.else();
    }
    return !data.returnOn;
}


function parseLS(obj) {
    if ( !def(obj) ) { return []; }
    if ( typeof(obj) == 'string' ) { return obj.split(','); }
    return objToArray(obj);
}


function mapLS(obj, func) {
    mapO(obj, function(val, keys) {
        map(parseLS(keys), function(key) {
            func(val, key);
        });
    });
}

function mapDLS(obj, func) {
    mapO(obj, function(vals, keys) {
        map(parseLS(keys), function(key) {
            map(parseLS(vals), function(val) {
                func(val, key);
            });
        });
    });
}

function lsMapToDict(obj) {
    var result = {};
    mapLS(obj, function(val, key) {
        result[key] = val;
    });
    return result;
}
function dlsMapToDict(obj) {
    var result = {};
    mapLS(obj, function(val, key) {
        result[key] = result[key] || [];
        result[key].push(val);
    });
    return result;
}


function reverseDict(obj) {
    var result = {};
    
    mapO(obj, function(val, key) {
        result[val] = key;
    });
    return result;
}
function reverseLSDict(obj) {
    var result = {};
    
    mapO(obj, function(vals, key) {
        map(parseLS(vals), function(val) {
            result[val] = key;
        });
    });
    return result;
}




window._jOInd = 1;
window.O = {};

function _jO(obj, parent) {
    obj.C = obj.C||{}; 
    obj.V = obj.V||{};
    obj.F = obj.F||{};
    obj.A = obj.A||{};
    obj.D = obj.D||{};
    
    obj.___id = obj.___id || ['[object ',']'].join(window._jOInd += 1);
    window.O[obj.___id] = obj;
    obj.toString = function() { return obj.___id; }
    
    if ( def(parent) ) { obj.parent = _jO(parent); }
    
    if ( def(obj.attributes) ) {
        map(obj.attributes, function(attr) {
            obj.A[attr.name] = attr.value;
            var map = attr.name.split('data-');
            if ( def(map[1]) ) {
                obj.D[map[1]] = attr.value;
            }
        })
    }
    
    
    
    return obj;
}


function CO(obj) { return JSON.parse(JSON.stringify(obj)); }



extendPrimitive(T.A, 'add', f(val) {
    var pos = this.indexOf(val);
    
    if ( pos == -1 ) {
        this.push(val);
    }
    return this;
});

extendPrimitive(T.A, 'remove', f(val) {
    var pos = this.indexOf(val);
    
    if ( pos >= 0 ) {
        this.splice(pos, 1);
    }
    return this;
});

extendPrimitive(T.S, 'rp', f(from,to) { return this.split(from).join(to); });
if ( !T.S.repeat ) {
    extendPrimitive(T.S, 'repeat', f(val) { val = val || 0; return new T.A(val+1).join(this); });
}







function generateDetailedMap(obj) {
    var result = {};
    mapO(obj, function(data, str) {
        data.str = str;
        var newStr = '';
        map(str, function(symb) {
            newStr += symb;
            result[newStr] = result[newStr]||[];
            result[newStr].add(data);
        });
    });
    return result;
}




function getQuery (str, splitBy,ignoreAfter) {
    str = str||window.location.href;
    splitBy = splitBy||'?';
    ignoreAfter = ignoreAfter || '#';
    
    var data = str.split(splitBy)[1];
    
    if ( !def(data) ) { return {} }
    data = data.split(ignoreAfter)[0];
    
    var result = {};
    data.split('&').map(function(pair) {
        var str = pair.split('=');
        if ( str[0].length > 0 ) {
            if ( def(str[1]) ) {
                result[str[0]] = str[1];
            } else {
                result[str[0]] = true;
            }
        }
    });
    return result;
}


extendPrimitive(T.S, 'contains', f(val) { return this.indexOf(val) >= 0; });
extendPrimitive(T.A, 'contains', f(val) { return this.indexOf(val) >= 0; });






function mergeObjects(basic, extend) {
    var result = {};
    
    mapO(basic,  function(val, key) { result[key] = val; })
    mapO(extend, function(val, key) { result[key] = val; })
    
    return result;
}


function evt(obj, event, todo) {
    if ( !def(obj) ) { return null; }
    obj.addEventListener(event, todo);
}

function evtDel(obj, event, todo) {
    if ( !def(obj) ) { return null; }
    obj.removeEventListener(event, todo);
}




function sl(obj, query, isStr) {
    query   = query||'';
    isStr   = isStr||false;
    var req = query;
    
    if ( typeof(req) == 'string' ) {
        req = req.split(':');
    }
    
    var start   = parseInt(req[0]||0);
    if ( start < 0 ) { start += obj.length; }
    
    var end     = parseInt(req[1]||obj.length);
    if ( end < 0 ) { end += obj.length; }
    
    var step    = parseInt(req[2]||1);
    var len     = parseInt((end-start)/Math.abs(step));
    var result  = new Array(Math.max(len, 0));
    
    var j = 0;
    if ( step < 0 ) {
        for ( var i = end-1; i >= start; i += step ) { if ( def(obj[i]) ) {result[j] = obj[i]; j += 1; } }
    } else {
        for ( var i = start; i < end;    i += step ) { if ( def(obj[i]) ) {result[j] = obj[i]; j += 1; } }
    }
    result = result.splice(0, j);
    
    if ( isStr ) { return result.join(''); }
    return result;
}

extendPrimitive(T.S, 'sl', f(query) { return sl(this, query, true); });
extendPrimitive(T.A, 'sl', f(query) { return sl(this, query); });


function filterObjects(list, data, func) {
    if ( list.constructor != Array ) { list = objToArray(list); }
    var result = [];
    map(list, function(obj) {
        if (mapO(data, function(val, key) {
            return obj[key] == val;
        }) ) {
            result.push(obj);
            if ( func ) { func(obj); }
        };
    });
    return result;
}


function $P(obj, key, getter, setter) {
    if ( Object.__defineGetter__ ) {
        if ( def(getter) ) { obj.__defineGetter__(key, getter); }
        if ( def(setter) ) { obj.__defineSetter__(key, setter); }
    } else {
        var DO = {
            enumerable: true,
            configurable: true
        }
        
        if ( def(getter) ) { DO['get'] = getter; }
        if ( def(setter) ) { DO['set'] = setter; }
        
        Object.defineProperty(obj, key, DO);
    }
}

function filterArgs(mapData, args) {
    
    if ( typeof(mapData) == 'string') {
        var t = mapData.rp(',','');
        mapData = [];
        map(t,function(k) { mapData.push(T[k]); });
    }
    
    
    var result = new Array(mapData.length);
    map(args, function(arg) {
        if ( arg && arg.constructor ) {
            var pos = mapData.indexOf(arg.constructor);
            result[pos] = arg;
            mapData[pos] = null;
        }
    });
    map(mapData, function(type, pos) {
        if ( type ) {
            result[pos] = new type();
        }
    });
    return result;
}


function newDate(data) {
    var idt = parseInt(data);
    if ( idt == data ) { data = idt; }
    var dt = new Date(data);
    if ( dt == 'Invalid Date' ) { dt = new Date(); }
    return dt;
}


function clearSeconds(dateObj) {
    dateObj.setMilliseconds(0);
    dateObj.setSeconds(0);
    
    return dateObj;
}
function clearMinutes(dateObj) {
    dateObj.setMinutes(0);
    dateObj.setHours(0);
    
    return dateObj;
}
function clearTime(dateObj) {
    return clearMinutes(clearSeconds(dateObj));
}
function endOfDay(time) {
    var dateObj = new Date(time);
    dateObj.setMinutes(59);
    dateObj.setHours(23);
    return dateObj;
}













