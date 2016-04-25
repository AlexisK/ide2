

new eLayer('pop', {
    select: CONF.engine.dynamicPopSelectors,
    parent: 'main',
    fetchLang: function(){},
    ontravel: function(self) {
        if ( self.dom._currentPop != POP.window ) {
            POP.window.show(self.dom);
        }
        ENGINE.processDom(self.dom);
    },
    hide: function() {
        POP.window.hide({noOnHide:true});
    }
});

LAYER.pop.dom._onpopclose = function() {
    LAYER.main.go();
}

LAYER.pop.dom.cr('div','content');

