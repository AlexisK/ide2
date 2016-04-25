
new eProtocol('regview', {
    prefix: '/_handler/regview/',
    lastId: '',
    write: function(self, id) {
        id = id || g_id;
        if ( id != self.data.lastId ) {
            self.data.lastId = id;
            
            self.doReq(self.data.prefix, parseStr({
                id:id,
                lang_id: PAGE.langObj.id
            }), function(resp) { self.read(resp); });
        }
    },
    
    
    read: function(self) {}
    
});










