
new eProtocol('tab', {
    lsName: 'tabCon',
    write: function(self, method, data, runSelf) {
        glob(self.data.lsName, parseStr([method, data]));
        tm(function() { glob(self.data.lsName, ''); }, 2);
        if ( runSelf ) {
            tm(function() { self.read(method, data); }, 3);
        }
        
    },
    read: function(self, method, data) {
        if ( !method ) { return 0; }
        if ( def(data) ) {
            var methodMap = method.split('.');
            method = addressIt(window, methodMap);
            
            if ( def(method) ) {
                method.apply(null, data);
            }
        } else {
            eval(method);
        }
    },
    addressIt: function(obj, path) {
        if ( !obj ) { return null; }
        if ( path.length > 0 ) {
            return addressIt(obj[path.splice(0,1)[0]], path);
        }
        return obj;
    }
});

EVENT.stor[PROTOCOL.tab.data.lsName] = function(val) {
    PROTOCOL.tab.read(val[0],val[1]);
}








