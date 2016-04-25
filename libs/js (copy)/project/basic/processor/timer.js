

new eProcessor('timer', {
    selector: '.timer',
    process: function(self, db) {
        _jO(self);
        
        var func = function() {
            self.val = formatDate(new Date()*1, true, true, true);
        }
        
        self.C.timer = setInterval(func, 1000);
        func();
    }
});















