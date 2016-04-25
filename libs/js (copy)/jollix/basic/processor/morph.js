

new eProcessor('morph', {
    process: f(self, db) {
        
        _jO(self);
        
        if ( self._tag == 'input' ) {
            var at = self.attr('type');
            if ( db.rules[at] ) {
                db.ruleWrapper(self,db,at);
            }
        }
        
    },
    ruleWrapper: f(self, db, rule) {
        var newNode = db.rules[rule](self);
        
        self.insBefore(newNode);
        self.addCls('hidden');
        
        return newNode;
    },
    rules: {
        'checkbox': f(node) {
            var newNode = cr.bool();
            newNode.val = node.checked;
            newNode.onupdate(function(val) {
                node.checked = val;
            });
            return newNode;
        },
        'date': f(node) {
            var newNode = cr.dateinput();
            newNode.val = node.val;
            newNode.onupdate(function(val) {
                node.val = val;
            });
            return newNode;
        }
    }
})


















