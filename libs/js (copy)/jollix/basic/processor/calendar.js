

new eProcessor('calendar', {
    process: function(self, db) {
        _jO(self);
        
        if ( self.D.validon ) {
            if ( !PAGE.urlMap.tpl || !parseLS(self.D.validon).contains(PAGE.urlMap.tpl) ) { self.detach(); return 0; }
        }
        
        var view = cr.calendar();
        self.attach(view);
        
        if ( self.D.filteron ) {
            if ( PAGE.virtUrl[1] && PAGE.virtUrl[1] != '' ) {
                view.val = parseInt(PAGE.virtUrl[1]);
            }
            view.onupdate(function() {
                LM.go([self.D.filteron,'/'].join(endOfDay(view.val)*1));
            })
        }
    }
});















