
new eEditorField('def', {
    build: f(self, data) {
        return cr('input').attr('type', data._type||'text');
    },
    postprocess: f(self, data, INP) { INP.fullSet.addCls('oneline'); }
});



new eEditorField('text', {
    postprocess: f(self, data, INP) { INP.fullSet.addCls('oneline wide'); }
});

new eEditorField('div', {
    build: f(self, data) {
        return cr('div','asInp');
    },
    postprocess: f(self, data, INP) { INP.fullSet.addCls('oneline wide'); }
});


