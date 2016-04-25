
new eProcessor('dropdown', {
    process: function(dom, db) {
        _jO(dom);
        
        if ( def(dom.D.target) ) {
            dom.C.targets = [];
            dom.D.cls = dom.D.cls||'closed';
            
            map(dom.D.target.split(/\s*\,\s*/g), function(selector) {
                dom.C.targets.push(S('#target_'+selector));
            });
            
            dom.C.closed = dom.C.targets[0].className.contains(dom.D.cls);
            dom.toclose = false;
            
            dom.C.open  = function() {
                db.openContent(dom);
                EVENT.click.add(dom.C.close);
            }
            dom.C.close = function() {
                dom.toclose = true;
                tm(function() {
                    if ( dom.toclose ) {
                        db.closeContent(dom);
                        EVENT.click.remove(dom.C.close);
                    }
                }, 2);
            }
            
            dom.onclick = function() {
                dom.C.open();
                tm(function() { dom.toclose = false; });
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
        
        map(btn.C.targets, function(target) { target.addCls(btn.D.cls); })
        
        btn.C.closed = true;
    }
});

