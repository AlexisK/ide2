window.PROCESSOR = {};
window.ENGINE.processorPrefix = 'pr_';


function eProcessor(actor, data) {
    var self   = this;
    self.model = PROCESSOR;
    
    self.init = function() {
        self.data = mergeObjects({
            process:       function(){},
            selector:      '.'+ENGINE.processorPrefix+actor,
            onreleace:     function(){},
            onprocessed:   function(){},
            singleProcess: true
        }, data);
        
        window.PROCESSOR[actor] = self;
    }
    
    self.process = function(dom) {
        _jO(dom);
        dom.C.processors = dom.C.processors||{};
        if ( !dom.C.processors[actor] || !dom.C.processors[actor].data.singleProcess ) {
            dom.C.processors[actor] = self;
            
            self.data.process(dom, self.data);
        }
    }
    
    self.onDone = function() {
        self.data.onprocessed(self.data);
    }
    
    self.init();
}



