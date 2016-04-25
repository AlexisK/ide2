
new eEditorField('rich', {
    build: f(self, data) {
        var input = cr('div');
        wysiwyg(input, data.headoptions, {is_bb:true});
        
        data.wysiwyg.push(input);
        
        return input;
    },
    postprocess: f(self, data, INP) {
        INP.fullSet.style.marginBottom = '2em';
    }
});
