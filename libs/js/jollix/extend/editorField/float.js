
new eEditorField('float', {
    build: f(self, data) {
        var node = cr('input').attr({type:'text'});
        
        $P(node, 'val', function() { return parseFloat(this.value) || 0; }, function(data) { return parseFloat(this.value = data) || 0; });
        
        return node;
    },
    postprocess: f(self, data, INP) { INP.fullSet.addCls('oneline'); }
});
