
new eProtocol('cache', {
    prefix: '/_handler/cache/',
    write: function(self, dataMap, url, todo) {
        if ( typeof(url) == 'function' ) {
            todo = url;
            url = null;
        } else if ( typeof(dataMap) == 'function' ) {
            todo = dataMap;
            dataMap = null;
            url = null;
        }
        todo = todo || function() {};
        
        dataMap = (dataMap||'').split(':');
        
        var req = { method: 'purge' };
        if ( dataMap[0] ) { req.table  = dataMap[0]; }
        if ( dataMap[1] ) { req.method = dataMap[1]; }
        if ( url )        { req.url    = url; }
        
        var tokenStr = '';
        if ( def(glob('token')) ) {
            tokenStr = ['?token', glob('token')].join('=');
        }
        
        self.doReq(self.data.prefix+tokenStr, parseStr(req), function(resp) { self.read(resp, todo); }, log);
    },
    
    
    read: function(self, resp, todo) {
        log('cache purged');
        todo();
    }
    
});










