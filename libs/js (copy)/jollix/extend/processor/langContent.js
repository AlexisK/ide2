
new eProcessor('langContent', {
    process: function(self, db) {
        SYS.langContents.add(_jO(self));
        
        self.C.staticList = S('.mk_lcstatic', self);
        self.C.editing = false;
        
        self.F.editStart = function() {
            self.C.editing = true;
            ORM.req(['langcontent_',self.D.lcname,':select'].join(''), function() {
                map(self.C.staticList, detach);
                wysiwyg(self);
                self._wysiwyg.onupdate = function(val) {
                    var obj = ORM.O('langcontent_'+self.D.lcname);
                    
                    obj.langdata[PAGE.lang] = val;
                    ORM.req(obj._oid+':update', ORM.normaliseForUpdate(obj), log );
                };
                self._wysiwyg.edit();
            });
        }
        
        self.F.editFinish = function() {
            self.C.editing = false;
            if ( self._wysiwyg ) {
                self._wysiwyg.view();
            }
            map(self.C.staticList, function(node) {
                self.attach(node);
            });
        }
        
        
    }
});





PROCESSOR.langContent.edit = function() {
    map(SYS.langContents, function(elem) {
        elem.F.editStart();
    });
}
PROCESSOR.langContent.view = function() {
    map(SYS.langContents, function(elem) {
        elem.F.editFinish();
    });
}

PROCESSOR.langContent.clear = function() {
    PROCESSOR.langContent.view();
    SYS.langContents = [];
};
SYS.langContents = [];

ENGINE._clear.add(PROCESSOR.langContent.clear);





















