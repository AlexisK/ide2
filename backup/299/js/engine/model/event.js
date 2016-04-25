window.EVENT = {
    data: {}
};



window.EVENT.inst = {};
window.EVENT.global = {};
window.EVENT._on = {};

window.EVENT.on   = function(name, func, persist) {
    if ( !def(EVENT._on[name]) ) {
        EVENT._on[name] = [];
        if ( !persist ) {
            ENGINE._clear.add(function() {
                EVENT._on[name] = [];
            });
        }
    }
    EVENT._on[name].add(func);
}
window.EVENT.emit = function(name, data) {
    if ( EVENT._on[name] ) {
        map(EVENT._on[name], function(func) { func(data); });
    }
}


function eEvent(actor, data, oninit) {
    data       = data||{};
    var self   = this;
    self.model = EVENT;
    var EV     = window.EVENT;
    var EVG    = window.EVENT.global;
    
    
    
    self.init = function() {
        self.data = mergeObjects({
            initiator: document,
            ontrigger: function(){},
            onfinish:  function(){}
        }, data);
        
        self.clear();
        EVG[actor] = [];
        
        if ( def(oninit) ) { oninit(); }
        
        self.data.initiator.addEventListener(actor, function(ev) {
            self.data.ontrigger(ev);
            self.runTriggers(ev);
        });
        
        ENGINE._clear.add(self.clear);
        EVENT.inst[actor] = self
    }
    
    self.runTriggers = function(ev) {
        map(EV[actor], function(action) {
            action(ev);
        })
        map(EVG[actor], function(action) {
            action(ev);
        })
    }
    
    self.clear = function() {
        EVENT[actor] = [];
    }
    
    self.init();
}






EVENT.stor = EVENT.stor || {};





