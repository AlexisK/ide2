
new eEditorField('urlpart', {
    build: f(self, data) {
        var input = _jO(cr('input').attr({
            type: 'text',
            placeholder: 'a-z0-9-_'
        }));
        input.F.filterSelf = f() {
            input.value = input.value.translit('url');
        }
        evt(input, 'blur', input.F.filterSelf);
        
        return input;
    },
    autofill: f(node, data, obj, upd, lang) {
        var val = ( upd.title || (new Date()).toString() ).translit('url');
        
        $AD(upd, node.selfKey, {
            autocreate: {},
            setVal: val
        })
        
        if ( lang == node.editorRef .lang) {
            node.val = val;
            node.C._emitUpdated(val);
        }
    },
    postprocess: f(self, data, INP) { INP.fullSet.addCls('oneline wide'); }
});
