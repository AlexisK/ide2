self.buildDropdown = function(field, entity) {
    
    if ( entity.indexOf('DICTVIEW') == 0 ) {
        var name = entity.split(':')[1];
        var node = self.__buildDropdown(field, ORM._copyDictView(name));
        
        if (EDITOR[name]) {
            node.C._editorCr  = EDITOR[name].create;
            node.C._editorEd  = EDITOR[name].edit;
            node.C._editorDel = EDITOR[name].remove;
            
            node.V.edits = cr('div', 'editors');
            insBefore(node.V.edits, node.V.input);
            
            
            
            node.V.input.oneachstate = function(val) {
                node.V.edits.innerHTML = '';
                var refln = SYS.dictView[name][val] || PAGE;
                var ref   = [[name,val].join('_'),refln.lang].join(':');
                
                
                if ( EDITOR[name].create ) {
                    EDITOR[name].create({}, function(btn) {
                        node.V.edits.attach(btn);
                    }, function(data) {
                        ORM.getViewDict(name, function() {
                            node.V.input._data = ORM._copyDictView(name);
                            node.V.input.F.ddBuild();
                            node.V.input.val = node.V.input.val;
                        })
                    });
                }
                
                if ( val ) {
                    ORM.prep(ref, function(obj) {
                        
                        //-log(ref);
                        
                        EDITOR[name].edit(obj, function(btn) {
                            node.V.edits.attach(btn);
                        }, function(data) {
                            ORM.getViewDict(name, function() {
                                node.V.input._data = ORM._copyDictView(name);
                                node.V.input.F.ddBuild();
                                node.V.input.val = node.V.input.val;
                            })
                        });
                    })
                }
                
            };
            
            node.V.input._oneachstate();
        }
        
        return node;
    }
    
    var data = {};
    mapO(ORM.model[entity], function(obj) {
        var conf = CONF.project.dropdownName || {};
        var def = conf.def || ORM.getVisName;
        data[obj.id] = (conf[obj._model] || def)(obj);
    });
    
    return self.__buildDropdown(field, data);
}

self.buildCDropdown = function(field, data) {
    var fieldMap = field.split('.');
    field = fieldMap.splice(fieldMap.length-1, 1)[0];
    
    var dd = self.__buildDropdown(field, data);
    
    dd._prefixes = fieldMap;
    
    return dd;
}

self.__buildDropdown = function(field, data) {
    
    var node = _jO(cr('div', 'line'));
    node.C.key = field;
    node.V.label = node.cr('div','key').VAL(PAGE.ld(field));
    node.V.input = cr.dropdown(data, null, node);
    
    return node;
}


















