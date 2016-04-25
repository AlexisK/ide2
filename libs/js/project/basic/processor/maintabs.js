


new eProcessor('maintabs', {
    process: function(self, db) {
        _jO(self);
        
        EVENT.on('projectChosen', function() {
            if( self.switchTo ) {
                self.switchTo(1);
            }
        })
        
    }
});















