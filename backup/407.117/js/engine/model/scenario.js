window.SCENARIO = {};



function eScenario(name, data) {
    var self   = this;
    self.model = SCENARIO;
    
    self.init = function() {
        self.data = mergeObjects({
            initialRun: false,
            autoClear: false
        }, data);
        
        self.rules     = {};
        self.links     = {};
        self.onDone    = {};
        self.processed = [];
        self.toRun     = [];
        
        SCENARIO[name] = self;
        
        self.addAction('init');
        if ( self.data.initialRun ) { tm(self.run); }
        
        ENGINE._clear.push(function() { self.processed = []; });
    }
    
    self._emit = function(key) {
        var ch = true;
        
        map(self.rules[key][1].require, function(key) {
            return ch = self.processed.contains(key);
        });
        if ( ch ) {
            //-log([name,key].join(' emit '));
            self.rules[key][0]();
        }
    }
    
    self.emit = function(key){
        if ( !def(self.rules[key]) ) {
            self.addAction(key);
        }
        
        self._emit(key);
    }
    
    self.addOnDone = function(key, target) {
        self.onDone[key] = self.onDone[key] || [];
        if ( def(target) ) { self.onDone[key].add(target); }
    }
    
    self.addAction = function(key, todo, data) {
        data = mergeObjects({
            require: [],
            autoRun: false
        }, data);
        data.require = parseLS(data.require);
        todo = todo || function(link, self, done){ done(); }
        
        if ( data.autoRun ) {
            data.autoRun = parseLS(data.autoRun);
            data.require = data.require.concat(data.autoRun);
            
            map(data.autoRun, function(runKey) {
                self.addOnDone(runKey, key);
            });
        }
        
        self.addOnDone(key);
        var evDone = function(){
            self.processed.add(key);
            map(self.onDone[key], self.emit);
        };
        
        self.rules[key] = [function() {
            todo(self.links, self, evDone);
        }, data];
    }
    
    
    
    self.clear = function() {
        if (self.data.autoClear) {
            self.processed = [];
        }
    }
    
    self.run = function() {
        self._emit('init');
    }
    
    self.init();
}

