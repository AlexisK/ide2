
SYS.view_select = SYS.view_select || [];
new eProtocol('api', {
    
    prefix: '/_handler/api/',
    dataHasLang:  parseLS('insert,update'),
    
    
    write: function(self, reqMap,reqData,funcOk,funcBad,options) {
        
        if ( typeof(reqData) == 'function' ) {
            options = funcBad;
            funcBad = funcOk;
            funcOk  = reqData;
            reqData = {};
        }
        reqData = reqData || {};
        funcOk  = funcOk || log;
        funcBad = funcBad || f(){};
        options = options || {};
        
        reqMap     = reqMap.split(':');
        reqMap[0]  = reqMap[0].split('_');
        var model  = reqMap[0].splice(0,1)[0];
        var oid    = reqMap[0].join('_');
        var lang   = null;
        var method = null;
        
        if ( reqMap.length == 2 ) {
            method = reqMap[1];
        } else {
            lang   = reqMap[1];
            method = reqMap[2];
        }
        
        
        var reqDict      = CO(options);
        reqDict.table    = model;
        reqDict.method   = method;
        reqDict.selector = reqDict.selector || {};
        reqDict.data     = reqData;
        
        
        if ( def(oid) && oid != '' ) {
            if ( parseInt(oid) == oid ) {
                reqDict.selector.id   = ['=', Math.floor(oid)];
            } else {
                reqDict.selector.name = ['=', oid];
            }
        }
        
        if ( def(lang) && model != 'user' ) {
            if ( parseInt(lang) == lang ) {
                reqDict.selector.lang_id = ['=', Math.floor(lang)];
            } else {
                reqDict.selector.lang_id = ['=', Math.floor(ORM.O('lang_'+lang).id)];
            }
            if ( self.data.dataHasLang.contains(method) ) {
                reqDict.data.lang_id = reqDict.selector.lang_id[1];
            }
        }
        
        
        var tokenStr = '';
        if ( options.token ) {
            tokenStr = ['?token', options.token].join('=');
        } else if ( def(glob('token')) ) {
            tokenStr = ['?token', glob('token')].join('=');
        }
        
        if ( reqDict.method == 'select' && SYS.view_select.contains(reqDict.table) && okeys(reqDict.selector).length == 0 ) {
            getRawData(['/_view/',PAGE.lang,'/select_',reqDict.table].join(''),function(dt) {
                //-log(parseObj(dt));
                self.read(parseObj(dt),null, funcOk, funcBad);
            })
        } else {
            self.doReq(self.data.prefix+tokenStr, parseStr(reqDict), function(resp, respObj) { self.read(resp, respObj, funcOk, funcBad); });
        }
    },
    
    
    read: function(self, resp, respObj, funcOk, funcBad) {
        
        var numFix = resp;//-.replace(/([\,\[]\s*[^\"])(\d{16,})([^\"])/g, '$1"$2"$3');
        try { 
            resp = JSON.parse(numFix);
        } catch(err) {
            resp = parseObj(resp);
        }
        
        var status;
        
        if ( respObj ) { status = respObj.getResponseHeader('X-jlx-status'); } else { status = 'OK'; }
        
        if ( status == 'OK' ) {
            
            var result = {};
            
            if ( resp.fields ) {
                map(resp.fields, function(fieldSet) {
                    result[fieldSet[0]] = [];
                });
                
                
                map(resp.data, function(obj) {
                    var index = 0;
                    
                    map(resp.fields, function(fieldSet) {
                        var writeTo = {};
                        result[fieldSet[0]].push(writeTo);
                        
                        for ( var i = 1; i < fieldSet.length; i++ ) {
                            writeTo[fieldSet[i]] = obj[index];
                            index += 1;
                        }
                    });
                    
                });
            }
            
            
            funcOk(result, resp);
            
            
        } else if ( status == 'exception' ) {
            if ( resp.statusData && resp.statusData.exception == 'Unauth') {
                var msg = cr('div','alert').VAL(PAGE.ld('Session expired'));
                msg._onpopclose = function() {
                    ENGINE._auth.authCancel();
                    ENGINE._auth.reload();
                }
                POP.info.show(msg);
            }
            SYS.notify([resp.statusData.field, resp.statusData.exception].join(' '), 'center red');
            funcBad(resp);
        }
    }
    
});










