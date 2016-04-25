


new eProcessor('fbshare', {
    process: function(self, db) {
        self._shown = false;
        self._onscroll = self._onscroll || function() {
            var pos = getOffsetRect(self);
            
            if ( self._shown ) {
                if ( pos.top > EVENT.data.windowScroll.y + EVENT.data.windowSize.y ) {
                    SYS.fbshare.hide();
                    self._shown = false;
                }
            } else {
                if ( pos.top <= EVENT.data.windowScroll.y + EVENT.data.windowSize.y ) {
                    SYS.fbshare.show();
                    self._shown = true;
                }
            }
            
            
            
        }
        EVENT.scroll.add(self._onscroll);
    }
});















