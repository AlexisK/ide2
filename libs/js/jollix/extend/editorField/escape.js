
new eEditorField('esqt', {
    build: f(self, data) {
        var newNode = cr('input');
        
        $P(newNode, 'val', function() { return this.value.rp('"',''); }, function(data) {
            return this.value = data.rp('"','');
        });
        
        newNode.onupdate(function() { this.val = this.val; });
        
        return newNode;
    }
});



new eEditorField('escq', {
    build: f(self, data) {
        var newNode = cr('textarea');
        
        $P(newNode, 'val', function() { return this.value.replace(/\"([^|"]*)\"/g,'“$1”').rp('"',''); }, function(data) {
            return this.value = data;
        });
        
        return newNode;
    }
});





