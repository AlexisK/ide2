
new eProtocol('media', {
    prefix: '/_handler/media/',
    
    write: function(self,reqStr,data,funcOk,funcBad, table) {
        table = table || 'media';
        data = data || {};
        
        reqStr     = reqStr.split(':');
        reqStr[0]  = reqStr[0].split('_');
        var oid    = reqStr[0][0];
        var tag    = reqStr[0][1]||'notag';
        var method = reqStr[1]||'upload';
        
        var reqDict = mergeObjects({
            table: table,
            id: oid,
            tag: tag,
            method: method
        }, data);
        
        log(reqDict);
        
        var tokenStr = '';
        if ( def(glob('token')) ) {
            tokenStr = ['?token', glob('token')].join('=');
        }
        
        self.doReq(self.data.prefix+tokenStr, parseForm(reqDict), function(resp, respObj) { self.read(resp, respObj, funcOk, funcBad); });
    },
    
    
    read: function(self, resp, respObj, funcOk, funcBad) {
        funcOk = funcOk||log;
        funcBad = funcBad || funcOk;
        
        SYS.notify(PAGE.ld('file uploaded'),'ok');
        
        PROTOCOL.api.read(resp, respObj, funcOk, funcBad);
    }
});










