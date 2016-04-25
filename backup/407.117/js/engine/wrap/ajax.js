var createRequest = function(method, url, f200, fFalse) {
    var ajaxRequest = new XMLHttpRequest();
    f200   = f200   || log;
    fFalse = fFalse || f200;
    
    ajaxRequest.open(method, url, true);
    
    ajaxRequest.onreadystatechange = function() {
        if (ajaxRequest.readyState == 4) {
            
            LOG.ajax.write(method + ': ' + ajaxRequest.status, url);
            
            if ( ajaxRequest.status >= 200 && ajaxRequest.status <= 203 ) {
                f200(ajaxRequest.responseText, ajaxRequest);
            } else {
                fFalse(ajaxRequest.responseText, ajaxRequest);
            }
        }
    }

    return ajaxRequest;
}


var postRawData = function(url, data, f200, fFalse, headers) {
    
    var req = createRequest('POST', url, f200, fFalse);
    
    if ( def(headers) ) {
        mapO(headers, function(val, key) {
            req.setRequestHeader(key, val);
        });
    }
    req.send(data);
}

var getRawData = function(url, f200, fFalse) {
    var req = createRequest('GET', url, f200, fFalse);
    req.send();
}

var getData = function(url, f200, fFalse) {
    f200 = f200||log;
    fFalse = fFalse||f200;
    
    url = ENGINE.path.handler + url;
    
    var token = glob('token');
    
    if ( def(token) ) {
        if ( url.indexOf('?') >= 0 ) {
            url += '&token='+token;
        } else {
            url += '?token='+token;
        }
    }
    
    getRawData(url, function(data, resp) {
        f200(parseObj(data), resp);
    }, fFalse);
}

var postData = function(url, data, f200, fFalse, headers) {
    f200 = f200||log;
    fFalse = fFalse||f200;
    data = data||{};
    if ( typeof(data) == 'object') { data = parseStr(data); }
    headers = mergeObjects({
        "Content-Type": "application/json"
    }, headers);
    
    url = ENGINE.path.handler + url;
    
    var token = glob('token');
    
    if ( def(token) ) {
        if ( url.indexOf('?') >= 0 ) {
            url += '&token='+token;
        } else {
            url += '?token='+token;
        }
    }
    
    postRawData(url, data, function(data, resp) {
        f200(parseObj(data), resp);
    }, fFalse, headers);
}

var getString = function(url, data) {
    if ( !data ) { return url; }
    var qStr = [];
    
    mapO(data, function(val, key) { qStr.push(key+'='+val); })
    
    return url+'?'+qStr.join('&');
}





var _createBlankFormPage = function(url, method, data, params) {
    params = mergeObjects({
        displayParams: 'width=500,height=300'
    }, params);
    var name = params.name || (new Date()*1).toString();
    
    var wind = window.open('about:blank', name, params.displayParams)
    
    var formNode = cr('form').attr({
        action: url,
        method: (method||'GET').toUpperCase()
    })
    attach(formNode, wind.document.body);
    
    formNode.insertFields = function(data) {
        mapO(data, function(val, key) {
            var newString = cr('input', null, formNode).attr({
                name: key,
                value: val
            });
        });
    }
    formNode.insertFields(data);
    
    
    return {window: wind, form: formNode};
}

var getPageForm  = function(url, data, params) { return _createBlankFormPage(url, 'GET',  data, params); }
var postPageForm = function(url, data, params) { return _createBlankFormPage(url, 'POST', data, params); }

























