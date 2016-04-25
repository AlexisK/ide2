
new eEditorField('textarea', {
    build: f(self, data) {
        return cr('textarea');
    },
    postprocess: f(self, data, INP) {
        autoAdjust(INP.input);
    }
});
