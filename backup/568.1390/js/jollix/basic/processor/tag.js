
new eProcessor('tag', {
    process: function(self, db) {
        var nodes = S('a', self);
        var cells = new T.A(db.grades);
        var limits = [Infinity,1];
        var sortData = {};
        
        map(nodes, function(node) {
            _jO(node)._rank = node.D.rank||0;
            
            limits[0] = Math.min(node._rank, limits[0]);
            limits[1] = Math.max(node._rank, limits[1]);
            
            sortData[node.val] = node;
        });
        
        
        for ( var i = db.conf.map.length; i < nodes.length; i++ ) {
            db.conf.map.push('1');
        }
        
        map(nodes.sort(f(a,b) { return b._rank - a._rank; }), function(node, ind) {
            node.addCls('t'+db.conf.map[ind]);
        })
        
        
        map(okeys(sortData).sort(), function(key) {
            var node = sortData[key];
            if ( node.className.split(/\s/g).contains('noHref') ) {
                clearEvents(node).onclick = function() {
                    PROTOCOL.search.write(node.val);
                    return false;
                }
            }
            self.attach(sortData[key]);
        });
    },
    conf: CONF.object.tag
})












