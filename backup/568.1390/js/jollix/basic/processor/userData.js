

new eProcessor('userData', {
    process: function(self, db) {
        _jO(self);
        
        if ( def(PAGE.user) ) {
            var valMap = self.val.split(' ');
            var newVal = [];
            map(valMap, function(value) {
                if ( def(PAGE.profile[value]) ) {
                    newVal.push(PAGE.profile[value]);
                } else if ( def(PAGE.user[value]) ) {
                    newVal.push(PAGE.user[value]);
                } else {
                    newVal.push(value);
                }
            });
            
            self.val = newVal.join(' ');
        } else {
            self.val = '';
        }
    }
});















