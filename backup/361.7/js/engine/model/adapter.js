window.ADAPTER = {
    selectable: {}
};



function eAdapter(name, data) {
    var self   = this;
    self.model = ADAPTER;
    
    self.init = function() {
        self.data = mergeObjects({
            process: function(){},
            selector: null
        }, data);
        
        if ( def(self.data.selector) ) {
            ADAPTER.selectable[self.data.selector] = ADAPTER.selectable[self.data.selector] || [];
            ADAPTER.selectable[self.data.selector].push(self);
        }
        
        ADAPTER[name] = self;
    }
    
    self.process = function(node) {
        _jO(node);
        node.__adapted = node.__adapted || [];
        if ( !node.__adapted.contains(name) ) {
            self.data.process.apply(self, [self].concat(listToArray(arguments)) );
            node.__adapted.push(name);
        }
        return node;
    }
    
    self.init();
}






