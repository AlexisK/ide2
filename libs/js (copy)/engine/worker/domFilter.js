
ENGINE.domFilter = function() {
    var self = _jO(this);
    
    self.init = function() {
        self.rules       = CO(CONF.engine.defaultDomFilterRules);
        
        self.C.available = parseLS(self.rules.available);
        self.C.stackable = parseLS(self.rules.stackable);
        self.C.plain     = parseLS(self.rules.plain);
        self.C.empty     = parseLS(self.rules.empty);
        self.C.attrs     = lsMapToDict(self.rules.attrs);
        self.C.morph     = reverseLSDict(self.rules.morph);
        self.C.styles    = lsMapToDict(self.rules.styles);
        self.C.textwrap  = self.rules.textwrap;
        
    }
    
    
    self.process = function(dom) {
        self.doProcess(dom);
        var c = 6;
        
        for ( ; c > 0; c-- ) {
            //-if (dom.innerHTML.contains('style=')) { self.doProcess(dom); } else { c = 0; }
            self.doProcess(dom);
        }
        
    }
    self.doProcess = function(dom) {
        if ( dom._domFilterBlocked ) { return 0; }
        
        map(dom.childNodes, function(node) {
            if ( def(node) && !node._domFilterBlocked ) {
                if ( node.nodeType == 3 ) {
                    setTag(node, self.C.textwrap, {
                        cls:  false,
                        attr: false
                    });
                } else {
                    self._process(node);
                }
            }
        });
        
        map(getChildren(dom), function(node) {
            self._optimise(node, true);
        });
        
    }
    
    self._optimise = function(dom) {
        if ( dom._domFilterBlocked ) { return 0; }
        
        if ( !self.C.empty.contains(dom._tag) ) {
            
            map(getChildren(dom), function(node) {
                
                if ( self.C.stackable.contains(node._tag) ) {
                    insBefore(node, dom);
                }
                self._optimise(node);
            });
            
            if ( !self.C.empty.contains(dom._tag) && getChildren(dom).length == 0 && dom.textContent.rp(/\s+/g,'').length == 0 ) {
                detach(dom);
            }
        }
    }
    
    self._process = function(dom) {
        if ( dom._domFilterBlocked ) { return 0; }
        
        if ( self.C.plain.contains(dom._tag) ) {
            dom = setTag(dom);
        } else if ( def(self.C.morph[dom._tag]) ) {
            dom = setTag(dom, self.C.morph[dom._tag]);
        } else if ( !self.C.available.contains(dom._tag) ) {
            detach(dom);
            return null;
        }
        
        var avAttrs = self.C.attrs[dom._tag]||[];
        
        if ( dom.attributes ) {
            mapO(dom.attributes, function(attr) {
                if ( attr && attr.name && !avAttrs.contains(attr.name) ) {
                    dom.removeAttribute(attr.name);
                }
            });
        }
        
        if ( self.C.styles[dom._tag] ) {
            var list = parseLS(self.C.styles[dom._tag]);
            var result = [];
            var attrs = dom.attr('style');
            
            map(list, function(stl) {
                var reg = new RegExp(["(;| |^)",":([^\\;]+)\\;"].join(stl));
                var val = reg.exec(attrs);
                if ( val && val[2] ) {
                    result.push([stl,val[2]].join(':'));
                }
            });
            
            if ( result.length > 0 ) {
                dom.attr({style:result.join(';')+';'});
            } else {
                dom.removeAttribute('style');
            }
        }
        
        map(listToArray(dom.childNodes), function(node) {
            if ( node._tag ) {
                self._process(node);
            } else {
                node.val = node.val.rp(/\u00a0/g,' ');
            }
        });
    }
    
    self.init();
    
}
window.domFilter = new ENGINE.domFilter().process;

















