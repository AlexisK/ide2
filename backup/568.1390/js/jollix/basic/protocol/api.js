
new eProtocol('api', {
    
    prefix: '/_handler/api/',
    fieldMap: {
        select:   parseLS('table,method,selector,fieldlist,order,rng'),
        insert:   parseLS('table,method,data,fieldlist'),
        update:   parseLS('table,method,selector,data,mod,fieldlist'),
        upsert:   parseLS('table,method,selector,data,mod,fieldlist'),
        delete:   parseLS('table,method,selector'),
        renew :   parseLS('table,method,selector,data'),
        def   :   parseLS('table,method')
    },
    dataHasLang:  parseLS('insert,update'),
    
    
    write: function(self, reqMap,reqData,funcOk,funcBad,options) {
        
        var fieldMap = mergeObjects(self.data.fieldMap, CONF.project.apiFieldMap);
        
        if ( typeof(reqData) == 'function' ) {
            options = funcBad;
            funcBad = funcOk;
            funcOk  = reqData;
            reqData = {};
        }
        reqData = reqData || {};
        funcOk  = funcOk || log;
        funcBad = funcBad || funcOk;
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
                reqDict.selector.id   = ['=', oid];
            } else {
                reqDict.selector.name = ['=', oid];
            }
        }
        
        if ( def(lang) && model != 'user' ) {
            if ( parseInt(lang) == lang ) {
                reqDict.selector.lang_id = ['=', lang];
            } else {
                reqDict.selector.lang_id = ['=', ORM.O('lang_'+lang).id];
            }
            if ( self.data.dataHasLang.contains(method) ) {
                reqDict.data.lang_id = reqDict.selector.lang_id[1];
            }
        }
        
        var fieldList = fieldMap[method] || fieldMap.def;
        
        map(listToArray(Object.keys(reqDict)), function(key) {
            if ( !fieldList.contains(key) ) {
                delete reqDict[key];
            }
        });
        
        
        var tokenStr = '';
        if ( options.token ) {
            tokenStr = ['?token', options.token].join('=');
        } else if ( def(glob('token')) ) {
            tokenStr = ['?token', glob('token')].join('=');
        }
        
        self.doReq(self.data.prefix+tokenStr, parseStr(reqDict), function(resp, respObj) { self.read(resp, respObj, funcOk, funcBad); });
    },
    
    
    read: function(self, resp, respObj, funcOk, funcBad) {
        
        var numFix = resp.replace(/([\,\[]\s*[^\"])(\d{16,})([^\"])/g, '$1"$2"$3');
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
            funcBad(resp);
        }
    }
    
});










