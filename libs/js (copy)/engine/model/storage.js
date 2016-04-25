window.STORAGE = {}

function eStorage(name, data, links) {
    var self   = this;
    self.model = STORAGE;
    
    self.init = function() {
        self.data = mergeObjects({
            cache:   false,
            store: function(self, key, data) {
                self.cont[key] = data;
                return key;
            },
            sharedWith: self
        }, data);
        
        links = parseLS(links);
        
        map(links, function(link) {
            var ref = self.data[link];
            self[link] = function() {
                return ref.apply(self, [self].concat(listToArray(arguments)));
            }
        })
        
        
        self.cont   = self.data.sharedWith.cont||{};
        self.event  = self.data.sharedWith.event||{};
        self.gevent = self.data.sharedWith.gevent||[];
        self.cache  = self.data.sharedWith.cache||{};
        
        STORAGE[name] = self;
        
        ENGINE._clear.add(self.clear);
    }
    
    self.clear = function() {
        self.event  = {};
        self.gevent = [];
        self.cache  = {};
    }
    
    self.storePriv = function(model, id, data, isDynamic) {
        var oid = self.data.storePriv(self, model, id, data);
        self._store(oid, oid, data, isDynamic);
    }
    
    self.store = function(key, data, isDynamic) {
        var oid = self.data.store(self, key, data);
        self._store(oid, key, data, isDynamic);
    }
    
    self._store = function(oid, key, data, isDynamic) {
        //-if ( !isDynamic ) {
        //-    PROTOCOL.tab.write('ORM.store', [key, data, true]);
        //-}
        
        if ( def(self.event[oid]) ) {
            map(self.event[oid], function(func) {
                func(self.cont[oid]);
            });
        }
        map(self.gevent, function(func) {
            func(self.cont[oid]);
        });
        
        return 0;
        
        var strData = parseStr(data);
        if ( self.cache[key] != strData ) {
            if ( def(self.event[oid]) ) {
                
                map(self.event[oid], function(func) {
                    func(self.cont[oid]);
                });
            }
            map(self.gevent, function(func) {
                func(self.cont[oid]);
            });
        }
        self.cache[key] = strData;
    }
    
    self.O = function(reqst) {
        if ( self.data.O ) { return self.data.O(self, reqst); }
        return self.cont[reqst];
    }
    
    self.onStore = function(key, func) {
        if ( def(func) ) {
            self.event[key] = self.event[key]||[];
            self.event[key].push(func);
        } else {
            func = key;
            self.gevent.push(func);
        }
    }
    
    self.setView = function(key, view) {
        if ( def(view.C.reinit) ) {
            self.event[key] = self.event[key]||[];
            self.event[key].push(function(data) {
                view.C.reinit(data);
            });
        }
    }
    
    self.init();
}


//- universal storage for data ( like orm )
//- attaches data to view





