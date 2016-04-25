
new eProcessor('dropdown', {
    process: function(dom, db) {
        _jO(dom);
        
        if ( def(dom.D.target) ) {
            dom.C.targets = [];
            dom.C.markers = S('.mk_mark', dom);
            dom.D.cls = dom.D.cls||'closed';
            
            map(dom.D.target.split(/\s*\,\s*/g), function(selector) {
                dom.C.targets.push(S('#target_'+selector));
            });
            
            dom.C.closed = dom.C.targets[0].className.contains(dom.D.cls);
            dom.toclose = false;
            dom.C.int = null;
            
            dom.F.open  = function() {
                db.openContent(dom);
                tm(f() { EVENT.click.add(dom.F.close); });
            }
            dom.F._close = function() {
                db.closeContent(dom);
                EVENT.click.remove(dom.F.close);
            }
            dom.F.close = function() {
                dom.C.int = tm(dom.F._close, 2);
            }
            
            map(dom.C.targets, function(target) {
                evt(target, 'click', f() {
                    tm(f() {
                        clearInterval(dom.C.int);
                    });
                });
            })
            
            dom.onclick = function() {
                if ( dom.C.closed ) {
                    dom.F.open();
                } else {
                    dom.F._close();
                }
            };
        }
    },
    openContent: function(btn) {
        
        if ( def(btn.D.selfactive) ) {
            btn.addCls(btn.D.selfactive);
        }
        if ( def(btn.D.selfunactive) ) {
            btn.remCls(btn.D.selfunactive);
        }
        
        
        map(btn.C.markers, function(marker) {
            if ( def(btn.D.markactive) ) {
                marker.addCls(btn.D.markactive);
            }
            if ( def(btn.D.markunactive) ) {
                marker.remCls(btn.D.markunactive);
            }
        });
        
        if ( btn.D.keepOpen ) {
            map(btn.C.targets, function(target) {
                target.remCls(btn.D.cls);
                target.onclick = function() {
                    tm(function() { btn.toclose = false; });
                }
            })
        } else {
            map(btn.C.targets, function(target) {
                target.remCls(btn.D.cls);
            })
        }
        
        
        btn.C.closed = false;
    },
    closeContent: function(btn) {
        
        if ( def(btn.D.selfactive) ) {
            btn.remCls(btn.D.selfactive);
        }
        if ( def(btn.D.selfunactive) ) {
            btn.addCls(btn.D.selfunactive);
        }
        
        map(btn.C.markers, function(marker) {
            if ( def(btn.D.markactive) ) {
                marker.remCls(btn.D.markactive);
            }
            if ( def(btn.D.markunactive) ) {
                marker.addCls(btn.D.markunactive);
            }
        });
        
        map(btn.C.targets, function(target) { target.addCls(btn.D.cls); })
        
        btn.C.closed = true;
    }
});

