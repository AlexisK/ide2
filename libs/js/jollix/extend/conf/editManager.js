
CONF.extend.editManagerRules = lsMapToDict({
    def: function(self, func) {
        _jO(self);
        func = func||function(){};

        var entity = self.D.emr;
        var crEntity = self.D.emc;
        var objRef = [entity,self.D.ref].join('_');
        
        
        if ( self.D.st == 'true' && def(TABLE2[entity]) ) {
            ORM.prep(objRef, function(obj) {
                var node = TABLE2[entity].data.rowGen(obj);
                
                if ( node.__statusText ) {
                    self.attach(node.__statusText.block);
                }
            });
        }
        
        
        if ( crEntity && EDITOR2[crEntity] && EDITOR2[crEntity].insert ) {
            var ed = EDITOR2[crEntity].insert;
            var btn = ed.getButton();
            
            self.V.createBtn = btn;
            self.attach(btn);
        }
        
        if ( entity && EDITOR2[entity] ) {
            if ( EDITOR2[entity].update && EDITOR2[entity].update.level <= PAGE.level ) {
                var ed = EDITOR2[entity].update;
                var btn = ed.getButton();
                btn.ref = objRef;
                
                self.V.editBtn = btn;
                self.attach(btn);
            }
            if ( EDITOR2[entity].delete && EDITOR2[entity].delete.level <= PAGE.level ) {
                var ed = EDITOR2[entity].delete;
                var btn = ed.getButton();
                btn.ref = objRef;
                
                self.V.delBtn = btn;
                self.attach(btn);
            }
        } else if ( entity && EDITOR[entity] ) {
            {
                //- Depricated 
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
                    
                    
                    
                    if ( crEntity && EDITOR[crEntity] ) {
                        var reqDict = mergeObjects({}, CONF.project.insertDefData[crEntity]);
                        reqDict[entity+'_id'] = obj.id;
                        
                        EDITOR[crEntity].create(reqDict, function(button) {
                            self.V.crBtn = button;
                            self.attach(button);
                        })
                    }
                    
                });
            }
        } else if ( crEntity && EDITOR[crEntity] && !(EDITOR2[crEntity] || EDITOR2[crEntity].insert) ) {
            EDITOR[crEntity].create({}, function(button) {
                self.V.crBtn = button;
                self.attach(button);
            })
        }
        
    }
});
