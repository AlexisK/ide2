


new eProcessor('alturl', {
    process: function(self, db) {
        _jO(self);
        var src = self.attr('src');
        
        if ( !src || src == '' ) { self.src = self.D.alturl; }
    }
})















