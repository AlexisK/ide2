
new eProcessor('extendable', {
    process: function(self, db) {
        _jO(self);
        self.V.exts = S('.mk_ext', self);
        self.V.triggers = S('.mk_trigger', self);
        
        self.C.opened = false;
        
        self.F.open = function() {
            if ( !self.C.opened ) {
                map(self.V.exts, function(node) {
                    node.remCls('hide');
                });
                return self.C.opened = true;
            }
            return false;
        }
        
        self.F.close = function() {
            if ( self.C.opened ) {
                map(self.V.exts, function(node) {
                    node.addCls('hide');
                });
                self.C.opened = false;
            }
        }
        
        self.F.switch = function() {
            if ( !self.F.open() ) {
                self.F.close();
            }
            return false;
        }
        
        map(self.V.triggers, function(node) {
            clearEvents(node).onclick = self.F.switch;
        });
        
        if ( def(self.D.staterules) && def( db[self.D.staterules])) { db[self.D.staterules](self, db); }
    },
    
    article: function(self, db) {
        if ( PAGE.urlMap.tpl == 'article' ) {
            self.F.open();
            map(self.V.triggers, function(node) {
                node.addCls('hidden');
            });
        }
    }
})


