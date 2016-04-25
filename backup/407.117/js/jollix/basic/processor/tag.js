
new eProcessor('tag', {
    process: function(self, db) {
        var nodes = S('a', self);
        var limits = [Infinity,1];
        var sortData = {};
        
        map(nodes, function(node) {
            _jO(node)._rank = node.D.rank||0;
            
            limits[0] = Math.min(node._rank, limits[0]);
            limits[1] = Math.max(node._rank, limits[1]);
            
            sortData[node.val] = node;
        });
        
        limits[1] -= limits[0];
        
        map(nodes, function(node) {
            node._rank = node._rank - limits[0];
            node.style.fontSize = db.conf.fontSize + parseInt(db.conf.fontAddon * (node._rank / limits[1])) + 'px';
            clearEvents(node).onclick = function() {
                 PROTOCOL.search.write(node.val);
                return false;
            }
        });
        
        map(okeys(sortData).sort(), function(key) {
            self.attach(sortData[key]);
        })
    },
    conf: CONF.object.tag
})












