
new eSubprogram('equeue', function(onfinish) {
    var self = this;
    
    self.init = function() {
        self.todo = [];
        self.working = false;
        self.todoLeft = 0;
        
        ENGINE._clear.add(self.clear);
    }
    
    self.add = function(func) {
        self.todo.push(func);
        self.todoLeft += 1;
        self.doNext();
    }
    
    self.doNext = function() {
        if ( !self.working ) {
            if ( self.todo.length > 0 ) {
                if ( !self.working ) {
                    var func = self.todo.splice(0, 1)[0];
                    
                    func(function() {
                        self.todoLeft -= 1;
                        self.working = false;
                        self.doNext();
                    });
                    
                    self.working = true;
                }
            } else if ( self.todoLeft == 0 ) {
                onfinish();
            }
        }
    }
    
    self.clear = function() {
        ENGINE._clear.remove(self.clear);
        self.doNext = function(){};
    }
    
    self.init();
});

window.EQ = SUBPROGRAM.equeue;


