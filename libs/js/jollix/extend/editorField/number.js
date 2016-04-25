
new eEditorField('number', {
    build: f(self, data) {
        return cr('input').attr('type', 'number');
    },
    postprocess: f(self, data, INP) { INP.fullSet.addCls('oneline'); }
});
