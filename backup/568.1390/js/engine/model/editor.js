
window.EDITOR = {}


function eEditor(name, type, data) {
    var self   = _jO(this);
    self.model = EDITOR;
    
    self.init = function() {
        if ( typeof(name) == 'string' ) {
            EDITOR[name]       = EDITOR[name] || {};
            EDITOR[name][type] = self.prep;
        } else {
            data = name;
            name = '';
            type = '';
        }
        
        data.lvl = data.lvl||%levelUser;
        
        self.insts         = {};
    }
    
    
    self.initCheck = function() {
        self.data = self.data || mergeObjects({
            form:       function(obj) { return {} },
            hiddenForm: [],
            langPrefix: null,
            onsubmit:   function(data, obj) { log(data, obj); },
            button:     function(obj) {
                var node = cr('div', 'asBtn fa');
                node.attach(cr('span').VAL('editor'));
                return node;
            }
        }, data);
    }
    
    
    self.prep = function(obj, todo, onfinish) {
        
        obj =          obj || {};
        self._curObj = obj;
        todo =         todo || function(button) { button.click(); };
        onfinish =     onfinish || function() {}
        
        self.initCheck();
        if ( PAGE.level >= data.lvl ) {
            if ( typeof(obj) == 'string' ) {
                ORM.prep(obj, function(data) {
                    self._prep(data, todo, onfinish);
                });
            } else {
                self._prep(obj, todo, onfinish);
            }
        }
    }
    
    self._prep = function(obj, todo, onfinish) {
        self.obj = obj;
        
        var formDict    = self.data.form(obj);
        formDict.fields = parseLS(formDict.fields||[]);
        
        map(parseLS(self.data.hiddenForm), function(field) {
            if ( !def(obj[field]) ) { formDict.fields.add(field); } else { formDict.fields.remove(field); }
        });
        
        self.form = new SUBPROGRAM.formGenerator();
        self.form.setData( formDict, obj, function(data, langData) {
            
            if ( self.data.langPrefix ) {
                data[self.data.langPrefix] = self.obj[self.data.langPrefix] || {};
                mapO(langData, f(val, k) {
                    data[self.data.langPrefix][k] = mergeObjects(data[self.data.langPrefix][k], val);
                });
                langData = {};
            }
            
            self.data.onsubmit([data, langData], self.obj, onfinish);
            
        }, name);
        
        
        self.insts[obj._oid] = {
            obj:  obj,
            todo: todo,
            form: self.form
        };
        
        todo(self._getButton(obj), self);
    }
    
    self._getButton = function(obj) {
        if ( PAGE.level >= data.lvl ) {
            var node = self.data.button(obj);
            
            clearEvents(node).onclick = function() {
                var data     = self.insts[obj._oid];
                self.obj     = data.obj;
                self._curObj = data.obj;
                self.form    = data.form;
                
                self.form.show();
                return false;
            }
            return node;
        }
        return cr('div');
    }
    
    self.init();
}







ENGINE.prepEditor = function(model, data, customData) {
    
    if ( model.contains(',') ) {
        map(parseLS(model), f(nm) {
            ENGINE.prepEditor(nm, data, customData);
        })
        return 0;
    }
    
    customData = customData || {};
    
    var customRules = customData.insert_form || customData.form || f(){};
    
    var editors = {};
    
    data = lsMapToDict(data);
    
    editors.create = new eEditor(model, 'create', {
        lvl: data.insert_lvl || data.lvl || %levelAdmin,
        form: function(obj) {
            var dt =  {
                title:      '+ '+PAGE.ld(model),
                submitStr:  PAGE.ld('create'),
                fields:     data.insert_fields     || data.fields     || [],
                ldfields:   data.insert_ldfields   || data.ldfields   || [],
                dropdown:   data.insert_dropdown   || data.dropdown   || {},
                cdropdown:  data.insert_cdropdown  || data.cdropdown  || {},
                media:      data.insert_media      || data.media      || {},
                schema:     data.insert_schema     || data.schema     || {},
                onshow:     data.insert_onshow     || data.onshow     || function() {},
                custom:     data.insert_custom     || data.custom     || function() {},
                hideLang:   data.insert_hideLang   || data.hideLang   || false,
                langPrefix: data.insert_langPrefix || data.langPrefix || null
            }
            customRules(dt, obj);
            return dt;
        },
        hiddenForm: data.hiddenForm||[],
        langPrefix: data.insert_langPrefix || data.langPrefix || null,
        
        onsubmit:   function(newDataMap, obj, onfinish) {
            
            
            var q = new EQ(function() {
                PROTOCOL.cache.write(function() {
                    SYS.notify([ORM.getVisName(obj),PAGE.ld('create'),PAGE.ld('done')].join(' '), 'ok');
                    if ( data.oncreate ) {
                        data.oncreate(newDataMap, obj, onfinish);
                    } else {
                        onfinish();
                    }
                });
            });
            
            
            ORM.req(model+':insert', ORM.normaliseForUpdate(mergeObjects(obj, newDataMap[0])), function(new_obj_list) {
                var new_obj = new_obj_list[0];
                
                if ( new_obj._hasLang ) {
                    q.doNext();//- case lang_id in non-composite model
                } else {
                    if ( okeys(newDataMap[1]).length == 0 ) {
                        //-q.doNext();
                        q.add(function(done) {
                            ORM.req([new_obj._oid, PAGE.lang, 'update'].join(':'), { title: '' }, done);
                        });
                    } else {
                        mapO(newDataMap[1], function(data, lang) {
                            q.add(function(done) {
                                ORM.req([new_obj._oid, lang, 'update'].join(':'), data, f(list, resp) {
                                    if ( resp.statusData ) {
                                        ORM.req(new_obj._oid+':delete');
                                        POP.info.showNew(cr('div', 'alert').VAL(resp.statusData.field + ' ' + resp.statusData.exception ));
                                        log(resp.statusData);
                                    } else {
                                        done();
                                    }
                                });
                            });
                        });
                    }
                }
                
            });
            
            
        },
        button: function(obj) {
            var node = self.cr('div', 'asBtn fa');
            node.attach(SVG.add().attr({class:'svg'}));
            node.attach(cr('span').VAL(PAGE.ld(model)));
            return node;
        }
    });
    
    
    var customRules = customData.update_form || customData.form || f(){};
    
    editors.edit = new eEditor(model, 'edit', {
        lvl: data.update_lvl || data.lvl || %levelAdmin,
        form: function(obj) {
            var dt = {
                title:      (data.title||function() { return ORM.getVisName(obj); })(obj),
                submitStr:  PAGE.ld('save'),
                fields:     data.update_fields     || data.fields     || [],
                ldfields:   data.update_ldfields   || data.ldfields   || [],
                dropdown:   data.update_dropdown   || data.dropdown   || {},
                cdropdown:  data.update_cdropdown  || data.cdropdown  || {},
                media:      data.update_media      || data.media      || {},
                schema:     data.update_schema     || data.schema     || {},
                onshow:     data.update_onshow     || data.onshow     || function() {},
                custom:     data.update_custom     || data.custom     || function() {},
                hideLang:   data.update_hideLang   || data.hideLang   || false,
                langPrefix: data.update_langPrefix || data.langPrefix || null
            }
            
            customRules(dt, obj);
            return dt;
        },
        hiddenForm: data.hiddenForm||[],
        langPrefix: data.update_langPrefix || data.langPrefix || null,
        
        onsubmit: function(newDataMap, obj, onfinish) {
            var newObj = ORM.normaliseForUpdate(newDataMap[0]);
            
            
            var q = new EQ(function() {
                PROTOCOL.cache.write(function() {
                    SYS.notify([ORM.getVisName(obj),PAGE.ld('edit'),PAGE.ld('done')].join(' '), 'ok');
                    if ( data.onupdate ) {
                        data.onupdate(newDataMap, obj, onfinish);
                    } else {
                        onfinish();
                    }
                });
            });
            
            ORM.req(obj._oid+':update', newObj, function() {
                if ( okeys(newDataMap[1]).length == 0 ) { q.doNext(); }
                
                mapO(newDataMap[1], function(data, lang) {
                    q.add(function(done) {
                        if ( okeys(data).length == 0 ) {
                            tm(done);
                        } else {
                            ORM.req([obj._bid,lang,'update'].join(':'), data, done);
                        }
                    });
                    
                });
                
            });
            
            
        },
        button: function(obj) {
            
            var node = self.cr('div', 'asBtn fa');
            node.attach(SVG.edit2().attr({class:'svg'}));
            node.attach(cr('span').VAL(PAGE.ld('edit')));
            return node;
        }
    });
    
    return editors;
}























var TEDITOR = {
    fix: f(obj, update, langUpdate, form) {
        mapO(langUpdate, function(data, lang) {
            if ( data.displaydate == null ) {
                delete data.displaydate;
            }
        });
    },
    tags: f(obj, update, langUpdate, form) {
        
        var tags = obj.tags || [];
        if ( def(langUpdate[PAGE.lang].tags) ) { tags = langUpdate[PAGE.lang].tags; }
        if ( form.wysiwygs.content.bb_entities.tags ) { tags = tags.concat(form.wysiwygs.content.bb_entities.tags); }
        
        
        langUpdate[PAGE.lang].tags = [];
        
        map(tags, function(tag) { langUpdate[PAGE.lang].tags.add(tag); });
        
    },
    urlpart: f(obj, update, langUpdate, form) {
        
        mapO(langUpdate, function(data, lang) {
            if ( !def(data.urlpart) && def(data.title) ) {
                data.urlpart = data.title.translit('url');
            }
        });
        
    },
};

TEDITOR.urlpart_tags = f(obj, update, langUpdate, form) {
    TEDITOR.fix(obj, update, langUpdate, form);
    TEDITOR.tags(obj, update, langUpdate, form);
    TEDITOR.urlpart(obj, update, langUpdate, form);
}













