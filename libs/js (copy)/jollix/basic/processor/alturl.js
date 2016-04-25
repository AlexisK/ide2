


new eProcessor('alturl', {
    process: function(self, db) {
        _jO(self);
        var src = self.attr('src');
        
        self.D.alturl = self.D.alturl || self.D.alturl2;
        
        if ( !src || src == '' ) { self.src = self.D.alturl; }
    }
})















