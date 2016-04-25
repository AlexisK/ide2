
new eAdapter('dec', {
    process: function(self, dom) {
        var fld = 'textContent';
        if ( def(dom.value) ) {
            fld = 'value';
        }
        
        dom.__selfVal = 0;
        
        $P(dom, 'val',
        function() {
            this.__selfVal = (parseFloat(this[fld]) || 0).fromDec();
            return this.__selfVal;
        },
        function(data) {
            var pd = Math.floor(data) || 0;
            if ( !pd && pd !== 0 ) {
                this.__selfVal = null;
                this[fld] = 0;
            } else {
                this.__selfVal = pd;
                this[fld] = pd.toDec();
            }
           
            return this.__selfVal;
        });
        
        dom.val = dom.val;
        dom.onupdate(function() { this.val = this.val; });
    }
});









