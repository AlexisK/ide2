
new eEditorField('bool', {
    build: f(self, data) {
        return cr.bool();
    },
    postprocess: f(self, data, INP) { INP.fullSet.addCls('oneline'); }
});
