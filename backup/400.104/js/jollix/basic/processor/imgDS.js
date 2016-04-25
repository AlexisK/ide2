

new eProcessor('imgDS', {
    process: function(self, db) {
        _jO(self);
        
        if ( glob('__disableDS') == 'true' ) { return 0; }
        
        var nodes = S('p', self);
        self.phs   = S('.tBg', self);
        self.mapping = {};
        
        map(nodes, function(node) {
            _jO(node);
            if ( node.D.sizex ) {
                self.mapping[parseInt(node.D.sizex)] = [node.val, node.D.size];
                node.detach();
            }
        });
        
        self.C.idsImage = cr('img','fa').attr({
            alt: self.D.alt
        });
        
        if ( ENGINE.isIB ) {
            self.F.idsWorker = CEF(function() {
                tm(function() { db.fetchIBSize(self,db); });
            },%animationCss);
            db.fetchIBSize(self,db);
            
        } else {
            self.F.idsWorker = CEF(function() {
                tm(function() { db.fetchSize(self,db); });
            },%animationCss);
            db.fetchSize(self,db);
            
        }
        EVENT.resize.add(self.F.idsWorker);
        
        
        
    },
    fetchIBSize: function(self,db) {
        var csize = okeys(self.mapping)[0];
        var size  = self.offsetWidth;
        
        mapO(self.mapping, function(urlMap, s) {
            if ( s < size ) { csize = Math.max(csize, s); }
        });
        
        if ( csize > size ) {
            self.C.idsImage.detach();
        } else {
            
            var urlMap = self.mapping[csize];
            var url = urlMap[0];
            var newSize = urlMap[1].split('x');
            self.C.idsImage.attr({
                src    : url,
                width  : newSize[0],
                height : newSize[1]
            });
            
            db.placeNewImg(self);
            
            self.attach(self.C.idsImage);
            
        }
    },
    fetchSize: function(self,db) {
        var csize = okeys(self.mapping)[0];
        var size  = self.offsetWidth;
        
        mapO(self.mapping, function(urlMap, s) {
            if ( s < size ) { csize = Math.max(csize, s); }
        });
        
        if ( csize > size ) {
            self.C.idsImage.detach();
        } else {
            
            self.C.idsImage.detach();
            map(self.phs, function(node) { self.attachFirst(node); });
            
            var urlMap = self.mapping[csize];
            var url = urlMap[0];
            var newSize = urlMap[1].split('x');
            
            self.C.idsImage.style.height="0px";
            
            self.C.idsImage.onload = function() {
                db.placeNewImg(self);
            }
            
            self.attach(self.C.idsImage);
            
            self.C.idsImage.attr({
                src    : url,
                width  : newSize[0],
                height : newSize[1]
            });
            
        }
    },
    placeNewImg: function(self) {
        map(self.phs, detach);
        self.C.idsImage.remattr('style');
        tm(f(){ self.remCls('opaqueImg'); });
    }
})






new eProcessor('imgDSB', {
    trigger: {
        hov:'mouseover'
    },
    process: function(self, db) {
        _jO(self);
        
        var trigger = self.D.dsbon;
        
        if ( glob('__disableDS') == 'true' ) { return 0; }
        
        self.C.dsbsize = parseInt(self.D.dsbsize)
        
        self.F.idsbWorker = CEF(function() {
            tm(function() { db.fetchSize(self,db); }, %animationCss);
        });
        
        if ( trigger && db.trigger[trigger] ) {
            var tf = function() {
                db.dispatchFetch(self,db);
                evtDel(self, db.trigger[trigger], tf);
            }
            evt(self, db.trigger[trigger], tf);
        } else {
            db.dispatchFetch(self,db);
        }
    },
    dispatchFetch: function(self,db) {
        EVENT.resize.add(self.F.idsbWorker);
        db.fetchSize(self,db);
        
    },
    fetchSize: function(self,db) {
        var size  = self.offsetWidth;
        
        if ( size > self.C.dsbsize ) {
            self.style.backgroundImage = ['url(',')'].join(self.D.dsburl);
        } else {
            self.style.backgroundImage = 'none';
        }
    }
})













