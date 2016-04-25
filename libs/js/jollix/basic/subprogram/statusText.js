

ENGINE.currentST = null;

new eSubprogram('statusText', function(node) {
    var self = this;
    
    self.init = function() {
        self.block = _jO(cr('div', 'statusText'));
        self.addon = cr('div');
        self.data = {
            link:    [],
            info:    [],
            warning: [],
            error:   [],
            fatal:   []
        };
        self.title = null;
        
        if ( def(node) ) {
            node.__statusText = self;
        }
        
        
        self.rebuild();
    }
    
    self.onshow = f(self) {}
    
    
    self.showProc = function(tp, parent) {
        self['show_'+(tp||'def')](parent);
    }
    
    
    self.add = function(tag, data) {
        if ( !data ) {
            data = tag;
            tag = 'info';
        }
        
        if ( self.data[tag] ) {
            self.data[tag].add(data);
        }
        self.rebuild();
    }
    
    
    self.buildType = function(tag) {
        var data = self.data[tag];
        
        if ( data.length == 0 ) { return 0; }
        
        var newNode = self.block.cr('div', 'type_'+tag);
        newNode.cr('p').VAL(PAGE.ld(tag));
        var list = newNode.cr('ol');
        map(data, function(dt) {
            var t = T(dt);
            var n = list.cr('li');
            
            if ( t == T.S || t == T.N ) {
                n.textContent = PAGE.ld(dt);
            } else {
                n.attach(dt);
            }
        });
        
        return 1;
    }
    
    
    self.rebuild = function() {
        self.addon.detach();
        self.block.innerHTML = '';
        
        var t;
        if ( self.title ) { t = self.block.cr('div', 'type_title').cr('p').VAL(self.title); }
        
        var ch = 0;
        var chp = 0;
        ch  += self.buildType('link');
        chp += self.buildType('fatal');
        chp += self.buildType('error');
        chp += self.buildType('warning');
        chp += self.buildType('info');
        
        self.block.attach(self.addon);
        
        if ( t && chp == 0 ) {
            t.addCls('hidden');
        }
        if ( ch + chp > 0 ) {
            return self.block;
        }
        
        return null;
    }
    
    
    
    
    
    
    
    self.show_base = function(func) {
        if ( ENGINE.currentST ) {
            ENGINE.currentST();
            ENGINE.currentST = null;
            return 0;
        }
        
        var pnode = cr('div','statusText popBlock');
        var node  = self.rebuild();
        
        if ( node ) {
            
            pnode.attach(node);
            document.body.attach(pnode);
            
            var pos = [
                    Math.min(EVENT.data.cursor.x, (EVENT.data.windowSize.x - pnode.offsetWidth)),
                    Math.min(EVENT.data.cursor.y, (EVENT.data.windowSize.y - pnode.offsetHeight))
                ];
            
            pnode.style.left = pos[0] + 'px';
            pnode.style.top  = pos[1] + 'px';
            
            func(pnode);
            self.onshow(self);
        }
    }
    
    self.show_def = function() {
        self.show_base(function(pnode) {
            tm(function(){
                var f = function() {
                    pnode.detach();
                    ENGINE.currentST = null;
                    evtDel(document.body,'click',f);
                }
                ENGINE.currentST = f;
                evt(document.body,'click',f);
            });
        });
    }
    
    self.show_menu = function() {
        self.show_base(function(pnode) {
            tm(function() {
                closeOnClick(pnode);
            });
            
        });
    }
    
    self.init();
});

window.ST = SUBPROGRAM.statusText;





extendPrimitive(Node, 'getST', f() {
    if ( def(this.__statusText) && this.__statusText.rebuild ) {
        return this.__statusText.rebuild();
    }
    return null;
});

extendPrimitive(Node, 'popST', f(tp) {
    if ( def(this.__statusText) && this.__statusText.rebuild ) {
        this.__statusText.showProc(tp, this);
        return null;
    }
    return null;
});
















