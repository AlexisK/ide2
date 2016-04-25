ENGINE.processDomQueue = [];
ENGINE.processDom = function(dom) {
    dom = dom||document;
    
    map(ENGINE.processDomQueue, f(func) { func(); });
    
    mapO(PROCESSOR, function(processor) {
        map(S(processor.data.selector, dom), processor.process);
    })
    
    mapO(ADAPTER.selectable, function(list, selector) {
        map(S(selector, dom), function(node) {
            map(list, function(item) {
                item.process(node);
            });
        });
        
    })
}



ENGINE.processDomFinish = function(dom) {
    mapO(PROCESSOR, function(processor) {
        processor.onDone();
    })
}
