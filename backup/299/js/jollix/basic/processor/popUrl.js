

new eProcessor('popUrl', {
    process: function(self, db) {
        _jO(self).C.baseHref = self.attr('href');
        
        
        self.attr({
            href:self.C.baseHref,
            target: '_blank'
        });
        
        clearEvents(self).onclick = function() {
            if ( SYS.window.popurl ) {
                SYS.window.popurl.close();
                delete SYS.window.popurl;
            }
            
            SYS.window.popurl = window.open(self.attr('href'), 'popurl', 'width=800,height=450');
            
            return false;
        }
        
    }
});















