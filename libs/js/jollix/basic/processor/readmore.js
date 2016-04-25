

new eProcessor('readmore', {
    process: function(self, db) {
        _jO(self);
        
        self.smallHeight = parseInt(self.D.height || 100);
        self.fullHeight = self.offsetHeight;
        self.swiped = false;
        self.clearTm = null;
        
        self.str = {
            open  : PAGE.ld(self.D.stropen  || 'Open'),
            close : PAGE.ld(self.D.strclose || 'Hide')
        }
        
        if ( !self.fullHeight || self.fullHeight < self.smallHeight ) { return 0; }
        
        self.V.openBtn = cr('div','rastr');
        insAfter(self.V.openBtn, self);
        
        clearEvents(self.V.openBtn).onclick = f() {
            if ( self.swiped ) {
                db.open(self, db);
                return 0;
            }
            db.swipe(self, db);
            return 0;
        }
        
        self.remCls('fa');
        db.swipe(self, db);
        tm(f(){
            self.addCls('fa');
        }, %animationCss);
        
    },
    swipe: f(self, db) {
        clearInterval(self.clearTm);
        self.style.height = self.fullHeight + 'px';
        tm(f(){
            self.style.height = self.smallHeight + 'px';
        }, 10);
        self.swiped = true;
        self.V.openBtn.val = self.str.open;
    },
    open: f(self, db) {
        clearInterval(self.clearTm);
        self.style.height = self.smallHeight + 'px';
        tm(f(){
            self.style.height = self.fullHeight + 'px';
        }, 10);
        self.clearTm = tm(f(){
            self.remattr('style');
        }, %animationCss);
        
        self.swiped = false;
        self.V.openBtn.val = self.str.close;
    }
});















