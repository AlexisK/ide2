


new eProcessor('limitView', {
    process: function(self, db) {
        _jO(self);
        
        var limit = self.D.limit;
        
        var func = function() {
            if ( self.offsetWidth < limit ) {
                self.addCls('hidden');
            }
        }
        
        EVENT.resize.add(func);
        func();
    }
});


























