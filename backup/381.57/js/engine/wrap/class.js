var CLASSES = {};
function newClass(name, params, func) {
    var args = filterArgs('OF', [params,func]);
    params   = args[0];
    func     = args[1];
    
    CLASSES[name] = function(self, args) {
        if ( params.extends ) {
            map(parseLS(params.extends), function(pName) {
                CLASSES[pName](self, args);
            });
        }
        
        args = listToArray(args);
        args.splice(0,0,self);
        
        
        func.apply(self,args);
        self.__class = name;
        
        return self;
    }
    
    window[name] = function() {
        var obj = _jO({});
        
        obj.__extendFrom = function(pName, args) {
            CLASSES[pName](obj, args);
        }
        
        return CLASSES[name](obj, arguments);
    }
}
