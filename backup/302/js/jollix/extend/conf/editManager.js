
CONF.extend.editManagerRules = lsMapToDict({
    def: function(self, func) {
        func = func||function(){};
        var entity = self.D.emr;
        var crEntity = self.D.emc;
        
        var objRef = [entity,self.D.ref].join('_');
        
        if ( entity ) {
            ORM.prep(objRef, function(obj) {
                var ld = obj;
                
                if ( self.D.st == 'true' && def(TABLE2[self.D.emr]) ) {
                    var node = TABLE2[self.D.emr].data.rowGen(obj);
                    
                    if ( node.__statusText ) {
                        self.attach(node.__statusText.block);
                    }
                }
                
                
                EDITOR[entity].edit(obj, function(button) {
                    self.V.editBtn = button;
                    self.attach(button);
                });
                
                
                func(self,objRef);
                
                
                
                if ( crEntity ) {
                    var reqDict = {};
                    reqDict[entity+'_id'] = obj.id;
                    
                    EDITOR[crEntity].create(reqDict, function(button) {
                        self.V.crBtn = button;
                        self.attach(button);
                    })
                }
            });
        } else if ( crEntity ) {
            EDITOR[crEntity].create({}, function(button) {
                self.V.crBtn = button;
                self.attach(button);
            })
        }
        
    }
});
