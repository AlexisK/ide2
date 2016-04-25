
new eEditorField('taglist', {
    build: f(self, data) {
        var newNode = cr.tagline();
        
        return newNode;
    },
    postprocess: f(self, data, INP) { INP.fullSet.addCls('oneline wide'); }
});










new eEditorField('taglist2', {
    build: f(self, data) {
        var newNode = cr('input').attr({type:'text'});
        newNode.__listVal = [];
        
        newNode.__listValProc = function() {
            var newData = [];
            var data = this.value.toLowerCase().split(/[^\wа-яґєії]/g);
            map(data, function(value) {
                var nval = value.rp(/\s+/g,'');
                if ( nval.length > 1 && !newData.contains(nval) ) { newData.push(nval); }
            });
            this.__listVal = newData;
            this.value = newData.join(', ');
            return newData;
        }
        
        $P(newNode, 'val', function() {
            return newNode.__listValProc();
        }, function(data) {
            if ( !def(data) ) { data = ''; }
            
            if ( typeof(data) == 'string' ) {
                newNode.value = data;
                newNode.__listValProc();
            } else {
                newNode.__listVal = data;
                newNode.value = data.join(', ');
            }
            
            return newNode.__listVal;
        });
        
        return newNode;
    },
    postprocess: f(self, data, INP) { INP.fullSet.addCls('oneline wide'); }
});












