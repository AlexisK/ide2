

if ( !CONF.object.nopredots ) {
    new eProcessor('predot', {
        selector: 'pre',
        process: function(self, db) {
            
            var textnode = self.childNodes[0];
            
            if ( textnode && textnode.nodeType == 3 && textnode.val[0] == '-' ) {
                textnode.val = '•'+textnode.val.sl([1]);
            }
            
        }
    });
}














