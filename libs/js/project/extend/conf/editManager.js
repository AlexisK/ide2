

CONF.project.editManagerRules = lsMapToDict({
    article: function(self) {
        CONF.extend.editManagerRules.def(self, function(self,objRef) {
            self.V.delBtn = self.cr('div', 'asBtn fa');
            self.V.delBtn.attach(SVG.del().attr({class:'svg'}));
            self.V.delBtn.attach(cr('span').VAL(PAGE.ld('delete')));
            
            self.V.delBtn.onclick = function() {
                var answer = confirm(PAGE.ld('delete')+'?');
                
                if ( answer ) {
                    ORM.req(objRef+':delete', function() {
                        PROTOCOL.cache.write(function() {
                            ENGINE.goPage(null, null, null, function() {
                                ENGINE.goPage(['/','/'].join(PAGE.lang));
                            });
                        });
                        
                        
                    });
                }
            }
        });
    }
});

