

new eProcessor('editable', {
    process: function(self, db) {
        tm(function() {
            db._process(self, db);
        });
    },
    
    _process: function(self, db) {
        SYS.editables.push(_jO(self));
        
        self.C.edList = S('.mk_ed', self);
        self.C.editing = false;
        self.C.staticList = [];
        
        map(self.C.edList, _jO);
        
        self.F.editStart = function() {
            self.C.editing = true;
            
            
            ORM.req(self.D.edref+':select', function() {
                var obj = ORM.O(self.D.edref);
                
                map(self.C.edList, function(node) {
                    node._staticList = S('.mk_lcstatic', node);
                    map(node._staticList, detach);
                    (db[node.D.edtype]||db.plain)[0](self, db, node, obj);
                });
                
            });
            
        }
        
        self.F.editFinish = function() {
            self.C.editing = false;
            map(self.C.edList, function(node) {
                (db[node.D.edtype]||db.plain)[1](self, db, node);
                if ( node._staticList ) {
                    map(node._staticList, function(st) {
                        node.attach(st);
                    });
                }
            });
        }
        
        
    },
    
    todoonfinish: function() {
        PROTOCOL.cache.write();
    },
    
    
    plain: [function(self, db, node, obj) {
        
        node.setView('textarea', 'editing', function(val) {
            obj.langdata[PAGE.lang][node.D.edfield] = val;
            ORM.req(self.D.edref+':update', ORM.normaliseForUpdate(obj), db.todoonfinish );
        });
        autoAdjust(node.V.viewNode);
        
    },function(self, db, node) {
        if ( node.V.viewNode ) { node.setView(); }
    }],
    
    
    rich: [function(self, db, node, obj) {
        wysiwyg(node);
        node._wysiwyg.onupdate = function(val) {
            obj.langdata[PAGE.lang][node.D.edfield] = node.V.viewNode.innerHTML;
            ORM.req(self.D.edref+':update', ORM.normaliseForUpdate(obj), db.todoonfinish );
        }
        node._wysiwyg.edit();
        
    },function(self, db, node) {
        if ( node._wysiwyg ) { node._wysiwyg.view(); }
    }],
    
    
    html: [function(self, db, node, obj) {
        
        
        node.setView('textarea', 'editing', function(val) {
            obj.langdata[PAGE.lang][node.D.edfield] = val;
            ORM.req(self.D.edref+':update', ORM.normaliseForUpdate(obj), db.todoonfinish );
        });
        node.V.viewNode.val = obj.langdata[PAGE.lang][node.D.edfield]||'';
        autoAdjust(node.V.viewNode);
        
    },function(self, db, node) {
        if ( node.V.viewNode ) {
            var html = node.V.viewNode.val;
            node.setView();
            node.innerHTML = html;
        }
    }]
    
    
});



PROCESSOR.editable.edit = function() {
    map(SYS.editables, function(elem) {
        elem.F.editStart();
    });
}
PROCESSOR.editable.view = function() {
    map(SYS.editables, function(elem) {
        elem.F.editFinish();
    });
}

PROCESSOR.editable.clear = function() {
    PROCESSOR.editable.view();
    SYS.editables = [];
};
SYS.editables = [];

ENGINE._clear.add(PROCESSOR.editable.clear);















