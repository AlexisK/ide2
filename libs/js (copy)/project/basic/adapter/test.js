
new eAdapter('test', {
    process: function(self, dom) {
        
        evt(dom, 'focus', function() {
            this.addCls('notValid');
        });
        
        evt(dom, 'blur', function() {
            this.remCls('notValid');
        });
        
    }
});









