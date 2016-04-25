
function RNG(data) {
    var self;
    var t = T(data);
    if ( t == null ) {
        self = new T.A();
    } else if ( t == T.A ) {
        self = new T.A(data.length);
        map(data, function(val,k) { self[k] = val; });
    } else if ( t == T.O ) {
        self = objToArray(data);
    } else if ( t == T.N ) {
        self = new T.A(data);
        for ( var i = 0; i < data; i++) { self[i] = i; }
    } else {
        self = parseLS(data);
    }
    
    
    self.each = function(func) {
        return map(self, func);
    }
    
    self.sl   = function(q) { return RNG(sl(self,q,false)); }
    self.SORT = function(q) { return RNG(self.sort(q)); }
    self.spl  = function(q) { return RNG(self.splice(q)); }
    self.getRandom = function() {
        return self[Math.round(Math.random()*self.length)];
    }
    
    
    self.filter = function(fd) {
        var result = [];
        map(self, function(val, key) {
            var ch = mapO(fd, function(cv,ck) {
                if ( val[ck] != cv ) { return false; }
            });
            if ( ch ) {
                result.push(val);
            }
        });
        return RNG(result);
    }
    
    return self;
}

