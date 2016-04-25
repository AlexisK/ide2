
new eHtml('formGenerator', '<h2></h2>\
<div></div><hr class="wClear" />\
<div></div><hr class="wClear" />\
<div class="dictCont"></div><hr class="wClear" />\
<div></div><hr class="wClear" />\
<div class="asBtn"></div><hr class="wClear" />\
', {
    h2:'title',
    div:'cont,ldcont,sccont,support,submit'
});


new eView('formGenerator', {
    create: function(self) {
        HTML.formGenerator(self.V.block);
        self.V = mergeObjects(self.V, self.V.block.V);
        self.addCls('compact');
        return self;
    },
    init: function(self, obj) {
        self._jsonFields = [];
        
        self.F.clear = function() {
            self.C.cont = {};
            self.C.ldcont = {};
            self.C.schema = {};
            self.C.support = {};
            self.V.cont.innerHTML = '';
            self.V.ldcont.innerHTML = '';
            self.V.sccont.innerHTML = '';
        }
        self.F.clear();
        
        
        self.F.addCont = function(field, node) {
            self.V.cont.attach(node);
            self.C.cont[field] = node;
        }
        
        self.F.addSupport = function(field, node) {
            self.V.support.attach(node);
            self.C.support[field] = node;
        }
        
        self.F.addLDCont = function(field, node) {
            self.V.ldcont.attach(node);
            self.C.ldcont[field] = node;
        }
        
        self.F.addSchema = function(field, node) {
            node.attachFirst(cr('h4').VAL(PAGE.ld('h_'+field, field)));
            self.V.sccont.attach(node);
            self.C.schema[field] = node;
        }
        
        
        
        self.F.prefixedRetrieve = function(obj, node, key) {
            
            if ( node._prefixes ) {
                map(node._prefixes, function(prefix) {
                    var newobj = obj[prefix];
                    if ( !def(newobj) ) { return false; }
                    obj = newobj;
                });
            }
            return obj[key]||'';
        }
        
        
        self.F.prefixedUpdate = function(obj, node, key, val) {
            var orig = self.C.currentObj;
            
            if ( node._prefixes ) {
                map(node._prefixes, function(prefix) {
                    orig[prefix] = orig[prefix] || {};
                    obj[prefix]  = mergeObjects(orig[prefix], obj[prefix]);
                    obj          = obj[prefix];
                    orig         = orig[prefix];
                });
            }
            obj[key] = val;
        }
        
        
        self.F.setObj = function(obj) {
            self.C.currentObj = obj;
            self.C.currentUpdate = {};
            self.C.currentLangUpdate = {};
            
            
            function iterCont(dataObj) {
                mapO(dataObj, function(node, key) {
                    
                    var curData = self.F.prefixedRetrieve(obj, node, key);
                    
                    if ( self._jsonFields.contains(key) ) {
                        if ( def(obj[key]) && def(obj[key].text) ) {
                            
                            curData = curData.text;
                        } else {
                            curData = '';
                        }
                        node.V.input.__isJson = true;
                    }
                    
                    node.V.input.val = curData;
                    
                    
                    if (node.V.input._wysiwyg ) {
                        node.V.input._wysiwyg.edit();
                        node.V.input._wysiwyg.onupdate = function(val) {
                            if ( node.V.input.__isJson ) {
                                val = {text:val};
                                val = mergeObjects(val, makeRssFromHtml(val.text));
                            }
                            
                            self.F.prefixedUpdate(self.C.currentUpdate, node, key, val);
                        };
                    } else {
                        node.V.input.onupdate(function(val) {
                            if ( node.V.input.__isJson ) {
                                val = {text:val};
                                val = mergeObjects(val, makeRssFromHtml(val.text));
                            }
                            self.F.prefixedUpdate(self.C.currentUpdate, node, key, val);
                        }, true);
                    }
                });
            }
            
            iterCont(self.C.cont);
            iterCont(self.C.support);
            
            
            mapO(self.C.schema, function(node, key) {
                
                node.onchanged = function(val) {
                    var mFrom = mergeObjects(obj[key], self.C.currentUpdate[key]);
                    self.C.currentUpdate[key] = mergeObjects(mFrom, val);
                };
                node.setData(obj[key]);
            });
            self.F.setLang();
        }
        
        self.F.setLang = function() {
            var obj = self.C.currentObj;
            var langObj = self.C.currentLang;
            
            if ( !def(obj) ) { return 0; }
            //-if ( !self.C._savedObj[langObj.name] ) { self.C._savedObj[langObj.name] = CO(obj); }
            
            
            if ( self.C.isLangIncluded ) {
                if ( self.C.langPrefix ) {
                    self.F._setLang((obj[self.C.langPrefix]||{})[langObj.name]||{});
                    return 0;
                }
                self.F._setLang(obj[langObj.name]);
                return 0;
            }
            
            if ( !def(obj._bid) ) {
                self.F._setLang();
                return 0;
            }
            
            ORM.prep([obj._bid, langObj.name].join(':'), self.F._setLang);
            
        }
        
        
        self.C._savedObj = {};
        
        self.F._setLang = function(obj) {
            var langObj = self.C.currentLang;
            
            if ( !def(obj) ) {
                obj = self.C._savedObj[langObj.name]||(self.C._savedObj[langObj.name] = {});
                
                //-if ( self.C.targetModel && CONF.project.insertDefData[self.C.targetModel] ) {
                //-    obj = mergeObjects( CO(CONF.project.insertDefData[self.C.targetModel]), obj );
                //-}
            }
            
            
            self.C.currentLangUpdate[langObj.name] = self.C.currentLangUpdate[langObj.name] || {};
            
            mapO(self.C.ldcont, function(node, key) {
                var curData = obj[key] || '';
                
                if ( self._jsonFields.contains(key) ) {
                    if ( def(obj[key]) && def(obj[key].text) ) {
                        curData = obj[key].text;
                    } else {
                        curData = '';
                    }
                    node.V.input.__isJson = true;
                }
                
                node.V.input.val = curData;
                
                if (node.V.input._wysiwyg ) {
                    node.V.input._wysiwyg.view();
                    node.V.input.val = curData;
                    node.V.input._wysiwyg.edit();
                    node.V.input._wysiwyg.onupdate = function(val) {
                        if ( node.V.input.__isJson ) {
                            val = {text:val};
                            val = mergeObjects(val, makeRssFromHtml(val.text));
                        }
                        obj[key] = val;
                        self.C.currentLangUpdate[langObj.name][key] = val;
                    };
                } else {
                    node.V.input.onupdate(function() {
                        var val = node.V.input.val;
                        if ( node.V.input.__isJson ) {
                            val = {text:val};
                            val = mergeObjects(val, makeRssFromHtml(val.text));
                        }
                        obj[key] = val;
                        self.C.currentLangUpdate[langObj.name][key] = val;
                    }, true);
                }
            });
        }
        
        
        
        self.C.onLang = self.F.setLang;
        
    }
}, 'langMenu');












