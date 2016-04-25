
new eProcessor('shuffle', {
    process: function(dom, db) {
        tm(function() {
            db.delayedProcess(dom, db);
        });
    },
    delayedProcess: function(dom, db) {
        var list = getChildren(dom);
        
        for( ; list.length > 0; ) {
            var index = parseInt(Math.random()*list.length);
            var item = list.splice(index, 1)[0];
            dom.attach(item);
        }
    }
});











