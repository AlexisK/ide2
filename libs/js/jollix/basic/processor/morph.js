

new eProcessor('morph', {
    process: f(self, db) {
        
        _jO(self);
        
        dispatchOnUpdate(self);
        
        if ( self._tag == 'input' ) {
            var at = self.D.type || self.attr('type');
            if ( db.rules[at] ) {
                tm(f() {
                    db.ruleWrapper(self,db,at);
                });
                
            }
        }
        
    },
    ruleWrapper: f(self, db, rule) {
        var newNode = db.rules[rule](self);
        if ( !newNode ) { return self; }
        
        self.insBefore(newNode);
        self.addCls('hidden');
        
        $P(self, 'val', f() {
            return newNode.val;
        }, f(data) {
            return (newNode.val = data);
        });
        
        self._morphNode = newNode;
        
        return newNode;
    },
    rules: {
        'checkbox': f(node) {
            var newNode = cr.bool();
            newNode.val = node.checked;
            newNode.onupdate(function(val) {
                node.checked = val;
                node.C._emitUpdated();
            });
            return newNode;
        },
        'date': f(node) {
            if ( node.attr('disabled') ) {
                node.attr({type:'text'});
                node.val = formatDate(node.val);
                node.remCls('hidden');
                return null;
            }
            
            var newNode = cr.dateinput();
            newNode.val = node.val;
            
            newNode.onupdate(function(val) {
                node.val = val;
                node.C._emitUpdated(node.val);
            });
            return newNode;
        }
    }
})


















