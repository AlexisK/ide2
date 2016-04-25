

new eProcessor('share', {
    process: function(self, db) {
        _jO(self).C.baseHref = self.attr('href');
        
        
        self.attr({
            href:[self.C.baseHref, encodeURIComponent(self.D.url||PAGE.url)].join(''),
            target: '_blank'
        });
        
        clearEvents(self).onclick = function() {
            if ( SYS.window.share ) {
                SYS.window.share.close();
                delete SYS.window.share;
            }
            
            SYS.window.share = window.open(self.attr('href'), 'share', 'width=600,height=400');
            
            return false;
        }
        
    }
});











