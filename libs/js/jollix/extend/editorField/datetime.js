
new eEditorField('datetime', {
    build: f(self, data) {
        var node =  cr.calendartimeinput();
        node.updateOnVal = true;
        return node;
    },
    postprocess: f(self, data, INP) { INP.fullSet.addCls('oneline'); }
});
