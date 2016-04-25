

new eProcessor('private', {
    selector: '.mk_private',
    process: function(self, db) {
        if ( PAGE.level >= %levelManager ) {
            self.remCls('mk_private');
            self.addCls('mk_opaque');
        }
    }
});















