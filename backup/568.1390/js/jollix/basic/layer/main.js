

new eLayer('main', {
    dom: document,
    select: CONF.engine.dynamicPageSelectors,
    ontravel: function() {
        
        ENGINE.apiPageWork();
        
        ENGINE.clear();
        SCENARIO.page.run();
        
        EVENT.emit('goPage');
    }
});


