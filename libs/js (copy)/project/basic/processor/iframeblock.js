
new eProcessor('iframeblock', {
    process: function(self, db) {
        _jO(self);
        self.ind = db.getIndex(db);
        self.focused = false;
        
        self.addCls('browserWindow')
        
        self.V.domain = self.cr('input', 'domainInput').attr({type:'text'});
        self.V.viewport = self.cr('div', 'viewport').cr('iframe');
        
        self.C.curUrl = glob('bwUrl_'+self.ind) || 'about:blank';
        
        self.goUrl = function(val) {
            self.V.domain.val = val;
            if ( self.C.curUrl == val ) {
                self.V.viewport.src = 'about:blank';
            }
            
            tm(f(){ self.V.viewport.src = val; });
            
            self.C.curUrl = val;
            glob('bwUrl_'+self.ind, val);
        }
        
        self.getUrl = function() {
            try {
                if ( !self.focused ) {
                    self.V.domain.val = self.V.viewport.contentWindow.location.href;
                }
            } catch(err) {
                self.getUrl = f(){};
            }
        }
        self.V.domain.onfocus = f() { self.focused = true; }
        self.V.domain.onblur  = f() { self.focused = false; }
        
        self.V.domain.onupdate(self.goUrl);
        self.V.domain.onkeyup = function(ev) {
            if ( ev.keyCode == 13 ) {
                self.goUrl(self.V.domain.val);
            }
        }
        
        self.goUrl(self.C.curUrl);
        setInterval(self.getUrl, 1000);
    },
    index: 0,
    getIndex: function(db) {
        return db.index += 1;
    }
});











