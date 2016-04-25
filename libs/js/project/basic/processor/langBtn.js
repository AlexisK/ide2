

new eProcessor('langBtn', {
    process: function(self, db) {
        _jO(self);
        var burl = self.href;
        var chLang = self.D.lang;
        
        clearEvents(self).onclick = function() {
            var locs = S('.relLoc');
            
            var ch = map(locs, function(loc) {
                if ( loc.attr('hreflang') == chLang ) {
                    //-ENGINE.goPage(loc.attr('href'));
                    window.location.assign(loc.attr('href'));
                    return false;
                }
            });
            
            if ( ch != false ) {
                //-ENGINE.goPage(burl);
                window.location.assign(burl);
            }
            
            return false;
        }
        
    }
});















