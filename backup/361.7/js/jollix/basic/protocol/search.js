
new eProtocol('search', {
    prefix: '/_handler/search/',
    write: function(self, keywords) {
        var newKeywords = [];
        
        if ( typeof(keywords) == 'string' ) {
            keywords = keywords.split(/\s*\,\s*/g);
            map(keywords, function(word) {
                if ( word.rp(/\s/g,'').length > 1 ) { newKeywords.push(word.trim().rp(/\s+/g, ' ').toLowerCase())}
            });
        } else {
            map(keywords, function(word) {
                if ( word.rp(/\s/g,'').length > 1 ) { newKeywords.push(word.trim().rp(/\s+/g, ' ').toLowerCase())}
            });
        }
        
        if ( newKeywords.length > 0 ) {
            self.doReq(self.data.prefix, parseStr({
                keywords:newKeywords,
                lang_id: PAGE.langObj.id
            }), function(resp) { self.read(resp); }, log);
        }
    },
    
    
    read: function(self, resp) {
        var tmp = cr('div');
        tmp.innerHTML = resp;
        var target = S(CONF.engine.mainContentSelector)[0];
        
        var thDef = S('.defineTheme', tmp)[0];
        
        if ( thDef ) {
            S('.theme')[0].className = thDef.val;
            thDef.detach();
        }
        
        var bCls = S('.defineBlockCls', tmp)[0];
        
        if ( bCls ) {
            target.className = bCls.val;
            bCls.detach();
        }
        
        
        target.innerHTML = tmp.innerHTML;
        
        ENGINE.processDom(target);
        EVENT.emit('resize');
    }
    
});










