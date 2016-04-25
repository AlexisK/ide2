
new eView('timer', {
    create: function() { return _jO(cr('div', 'jTimer')); },
    init: function(self, obj) {
        var now = new Date()*1;
        var expiry = obj.expiry||(now+20000);
        var est = expiry - now;
        
        var red = obj.red || 10000;
        var func = obj.onexpire||log;
        
        var doCalc = function() {
            est -= 1000;
            
            if ( est > 0 ) {
                if ( est < red ) {
                    self.addCls('red');
                }
                self.val = formatTimer(est);
                tm(doCalc, 1000);
            } else {
                self.val = formatTimer(0);
                func();
            }
        }
        
        self.val = formatTimer(est);
        tm(doCalc, 1000);
    }
});






