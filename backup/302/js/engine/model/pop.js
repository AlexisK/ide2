window.POP = {};
ENGINE.popMap = [];

function ePop(popName, cls, data, parent) {
    var self = _jO(this);
    self.model = POP;
    
    self._createDom     = function(self) {
        self.block      = cr('div', self.data.parentCls);
        self.V.cont     = self.block.cr('div', self.pcls );
        self.C.contElem = cr('div');
    }
    
    self.init = function() {
        self.pcls = 'pop-cont '+(cls||'');
        var defaultData = {
            createDom:     self._createDom,
            parentCls:     'fullscreen popBg fa',
            alwaysPersist: false,
            oncreate:      function(){},
            onshowstart:   function(){},
            onshow:        function(){}
        };
        if ( def(POP[parent]) ) {
            defaultData = mergeObjects(defaultData, POP[parent].data);
        }
        
        data = mergeObjects(defaultData, data);
        self.data = data;
        
    }
    
    self.initDom = function() {
        self.data.createDom(self);
        self.data.oncreate(self);
        if ( self.data.domInit ) { self.data.domInit(self); }
        
        self.C.int = null;
        
        self.block.onclick = function() {
            if ( !self.data.alwaysPersist && !self.isBlocked ) {
                self.C.int = tm(self.hide, 10);
            }
        }
        self.V.cont.onclick = function() {
            tm(function() {
                clearInterval(self.C.int);
            });
        }
    }
    
    
    self.showNew = function(node, persistent, rdata) {
        rdata = rdata||{};
        var newInst = new ePop(null, cls, data);
        newInst.show(node, persistent, rdata);
        return newInst;
    }
    
    self.show = function(node, persistent, rdata) {
        self.isBlocked = persistent||false;
        
        if ( node._currentPop ) {
            node._currentPop.hide();
        }
        
        node._currentPop = self;
        ENGINE.popMap.add(node);
        
        self.rdata = rdata || {};
        
        if ( typeof(node) == 'string' ) {
            self.show(VIEW[node](rdata), persistent, rdata);
            return 0;
        }
        if ( !def(self.block) ) { self.initDom(); }
        
        self.data.onshowstart(self, rdata);
        
        self.C.contElem.detach();
        self.C.contElem = node;
        
        self.V.cont.attach(node);
        self.block.addCls('closed');
        document.body.attach(self.block);
        
        tm(function() {
            self.block.remCls('closed');
            
            if ( def(node.popFocusOn)) {
                node.popFocusOn.focus();
            }
        }, SYS.animDelay);
        
        self.data.onshow(self, rdata);
    }
    self.hide = function(params) {
        params = params || {};
        
        if ( self.C.contElem ) {
            self.C.contElem._currentPop = null;
            ENGINE.popMap.remove(self.C.contElem);
            if ( !params.noOnHide && self.C.contElem._onpopclose ) {
                self.C.contElem._onpopclose();
            }
        }
        if ( self.block ) {
            self.block.detach();
        }
    }
    
    if ( popName ) {
        window.POP[popName] = self;
    }
    
    self.init();
}

