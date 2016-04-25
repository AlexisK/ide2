
window.EDITOR2 = {}

window.ED2Q = {
    dependancy: {},
    queue: [],
    buildQueue: f() {
        var done = 0;
        mapO(ED2Q.dependancy, f(editorList, inh) {
            map(editorList, f(editor) {
                var isOk = map(parseLS(inh), f(el) { return ED2Q.queue.contains(el); });
                if ( isOk ) {
                    ED2Q.queue.add(editor);
                    editorList.remove(editor);
                    done += 1;
                }
            });
            if ( editorList.length == 0 ) {
                delete ED2Q.dependancy[inh];
            }
            
        });
        if ( done ) {
            ED2Q.buildQueue();
        } else {
            ED2Q.runQueue();
        }
    },
    runQueue: f() {
        map(ED2Q.queue, f(model) {
            mapO(EDITOR2[model], f(editor) {
                editor.init();
            });
        });
    }
};


function eEditor2(model, type, data, is_direct) {
    var self   = _jO(this);
    self.model = EDITOR2;
    
//--- INIT --- 
    self._init_filter_rec = f(obj) {
        mapO(obj, f(v,k) {
            if ( T(v) == T.O ) {
                obj[k] = self._init_filter_rec(v);
            }
        });
        var newObj = lsMapToDict(obj);
        
        return newObj;
    }
    self._init_filter = f() {
        data = data || {};
        data.schema = self._init_filter_rec(data.schema);
        data.lschema = self._init_filter_rec(data.lschema);
        data.group = lsMapToDict(data.group);
        data.objschema = data.objschema || f(obj, data) {};
        
        mapO(data.group||{}, f(gval, key) {
            if ( T(gval) == T.S ) {
                data.group[key] = {
                    title: gval,
                    fields: gval
                }
            }
        });
    }
    self._init = function() {
        self._init_filter();
        self.type   = type;
        self.selfModel = model;
        self.editordata = {
            headoptions: cr('div','options')
        };
        self.inputs = [];
        self.upd    = {};
        self.lupd   = {};
        self.lang   = PAGE.lang;
        self.lupd[self.lang] = {};
        
        
        if ( is_direct ) {
            self.data = data;
            self.level = data.level || %levelSuper;
            self.cls   = data.cls   || '';
            self.inherit = [];
            self.init();
        } else {
            
            EDITOR2[model] = EDITOR2[model] || {};
            if ( EDITOR2[model][self.type] && EDITOR2[model][self.type].data ) {
                var baseData           = mergeObjects(EDITOR2[model][self.type].data,               data);
                baseData.schema        = mergeObjects(EDITOR2[model][self.type].data.schema,        data.schema);
                baseData.lschema       = mergeObjects(EDITOR2[model][self.type].data.lschema,       data.lschema);
                baseData.group         = mergeObjects(EDITOR2[model][self.type].data.group,         data.group);
                baseData.defaultObject = mergeObjects(EDITOR2[model][self.type].data.defaultObject, data.defaultObject);
                data = baseData;
            }
            
            EDITOR2[model][self.type] = self;
            
            self.data = data;
            self.level = data.level || %levelSuper;
            self.inherit = parseLS(data.inherit||[]);
            
            
            
            if ( data.inherit ) {
                ED2Q.dependancy[self.inherit] = ED2Q.dependancy[self.inherit] || [];
                ED2Q.dependancy[self.inherit].add(model);
            } else {
                ED2Q.queue.add(model);
            }
        }
    }
    //--- POSTINIT (in ~1ms) - queue dependant 
    self.init = f(){
        var schema  = {};
        var lschema = {};
        var group   = {};
        var order   = [];
        var defaultObject = {};
        
        map(self.inherit, f(model){
            if ( EDITOR2[model][self.type] ) {
                schema  = mergeObjects( schema, EDITOR2[model][self.type].schema);
                lschema = mergeObjects(lschema, EDITOR2[model][self.type].lschema);
                defaultObject = mergeObjects(defaultObject, EDITOR2[model][self.type].defaultObject);
                mapO(EDITOR2[model][self.type].group, f(gp, gpkey) {
                    if ( !def(group[gpkey]) ) {
                        group[gpkey] = gp;
                    } else {
                        var newFields = group[gpkey].fields.concat(gp.fields);
                        group[gpkey] = mergeObjects(group[gpkey], gp);
                        group[gpkey].fields = newFields;
                    }
                });
                map(EDITOR2[model][self.type].order, f(el) { order.add(el); });
            }
        });
        
        mapO(data.group||{}, f(gp, gpkey) {
            gp.fields = parseLS(gp.fields);
            if ( !def(group[gpkey]) ) {
                group[gpkey] = gp;
            } else {
                var newFields = group[gpkey].fields.concat(gp.fields);
                group[gpkey] = mergeObjects(group[gpkey], gp);
                group[gpkey].fields = newFields;
            }
        });
        
        schema  = mergeObjects( schema, data.schema);
        lschema = mergeObjects(lschema, data.lschema);
        defaultObject = mergeObjects(defaultObject, data.defaultObject);
        
        self.langPrefix = data.langPrefix || null;
        self.prep = parseLS(data.prep || []);
        self.schema = schema;
        self.lschema = lschema;
        self.defaultObject = defaultObject;
        self.group = group;
        self.order = parseLS(data.order || order);
    }
    
    
    
    
    
//--- UPDATING --- 
    self.updRec = f(upd, adr, obj, val) {
        if ( adr.length == 1 ) {
            upd[adr[0]] = val;
            return val;
        }
        var ad = adr.splice(0, 1)[0];
        upd[ad] = upd[ad] || CO(obj[ad]||{});
        return self.updRec(upd[ad], adr, obj[ad]||{}, val);
    }
    
    self.emitUpdated = f(isLang, ad, val) {
        var upd;
        
        if ( isLang ) {
            self.lupd[self.lang] = self.lupd[self.lang] || {};
            upd = self.lupd[self.lang];
        } else {
            upd = self.upd;
        }
        
        self.updRec(upd, ad.split('.'), self.obj, val);
        //-log(self.upd, self.lupd);
    }
    
    
    
//--- BUILD --- 
    self._buildBasis = f() {
        self.dom = VIEW.langMenu();
        self.dom.addCls('compact');
        self.dom.addCls(self.cls);
        self.V.title  = self.dom.V.block.cr('h2').VAL([model,self.type].join(' '));
        self.V.cont   = self.dom.V.block.cr('div');
        self.V.oscont = self.dom.V.block.cr('div');
        
        self.submitBtn = self.dom.V.langButtons.cr('div','asBtn final').VAL(PAGE.ld('Ok'));
        self.submitBtn.onclick = f() {
            tm(self._submit);
            return false;
        };
        
        self.dom.C.onLang = f(lang) {
            self.lang = lang.name;
            
            //-log(self.lang, self.obj);
            if ( self.obj ) {
                if ( self.langPrefix ) {
                    self.setData();
                } else if ( self.obj._hasLang ) {
                    ORM.req([self.obj._bid,self.lang,'select'].join(':'), f(list) {
                        var newObj = list[0];
                        if ( newObj ) {
                            self.obj = newObj;
                            self.setData();
                        } else {
                            //-self.obj = {};
                            var frng = RNG(self.inputs);
                            
                            self.setData(frng.filter({isLang:false}));
                            map(frng.filter({isLang:true}), f(inp) {
                                if ( inp._wysiwyg ) {
                                    inp._wysiwyg.view();
                                    inp.val = '';
                                    inp._wysiwyg.edit();
                                } else {
                                    inp.val = $AD(self.lupd[self.lang], inp.selfKey);
                                }
                                
                                inp.validate();
                            });
                        }
                    });
                } else {
                    var frng = RNG(self.inputs);
                    
                    self.setData(frng.filter({isLang:false}));
                    map(frng.filter({isLang:true}), f(inp) {
                        if ( inp._wysiwyg ) {
                            inp._wysiwyg.view();
                            inp.val = '';
                            inp._wysiwyg.edit();
                        } else {
                            inp.val = $AD(self.lupd[self.lang], inp.selfKey);
                        }
                        inp.validate();
                    });
                }
            }
            
        }
    }
    
    
    //- LINE
    self._buildLine = f(keyMap, title, schema, target, isLang){
        if ( T(title) == T.A ) { title = title.sl([-1])[0]; }
        title = title.split('.');
        title = title.sl([-1])[0];
        
        if ( T(schema) == T.S ) {
            schema = {_type:schema};
        }
        schema.wysiwyg = self.wysiwyg;
        
        if ( schema._flag ) {
            map(parseLS(schema._flag), f(flag){
                schema[flag] = true;
            });
            delete schema._flag;
        }
        
        var edField = EDITORFIELD[schema._type]||EDITORFIELD.def;
        var INP = edField.getInput(mergeObjects(self.editordata, schema));
        INP.input.onupdate(f(val) {
            if ( INP.input.validate(val) ) {
                self.emitUpdated(isLang, INP.input.selfKey, val);
            }
        });
        
        INP.input.selfKey = keyMap.join('.');
        INP.input.isLang = isLang;
        INP.input.editorRef = self;
        INP.label.VAL(PAGE.ld(title));
        
        target.attach(INP.fullSet);
        self.inputs.push(INP.input);
    }
    
    
    self._buildGroup = f(keyMap, title, schema, target, isLang){
        var newNode = _jO(target.cr('div'));
        newNode.V.title = newNode.cr('h3').VAL(title);
        newNode.V.cont  = newNode.cr('div','group');
        if ( def(keyMap) ) {
            self.recbuild(keyMap, schema, newNode.V.cont, isLang);
        }
        return newNode;
    }
    
    
    
    self.recbuildOld = f(key, schema, target, isLang) {
        mapLS(schema, f(v,k) {
            var km = CO(key); km.push(k);
            if ( T(v) == T.O && !def(v._type) ) {
                self._buildGroup(km, k, v, target, isLang);
            } else {
                self._buildLine(km, k, v, target, isLang);
            }
        });
    }
    
    
    
    self.recbuild = f(key, schema, target, isLang) {
        
        if ( T(schema) == T.O && !def(schema._type) ) {
            mapLS(schema, f(v,k) {
                var km = CO(key); km.push(k);
                self.recbuild(km, v, target, isLang);
            });
        } else {
            self._buildLine(key, key, schema, target, isLang);
        }
        
    }
    
    
    
    self.buildOld = f(func) {
        if ( !self.V.block ) {
            self._buildBasis();
        }
        self.inputs = [];
        self.wysiwyg = [];
        self.recbuild([], self.lschema, self.V.cont, true);
        self.recbuild([], self.schema,  self.V.cont, false);
    }
    
    
    
    self._buildByList = f(bckp, key, target) {
        
        var gval = bckp.group[key];
        var sval = $AD(bckp.schema,  key, { del: true });
        var lval = $AD(bckp.lschema, key, { del: true });
        
        
        if ( def(gval) ) {
            delete  bckp.group[key];
            
            if ( !gval.level || gval.level <= PAGE.level ) {
                var group = self._buildGroup(null, PAGE.ld(gval.title), null, target);
                var newCont = group.V.cont;
                
                map(gval.fields, f(field) {
                    self._buildByList(bckp, field, newCont);
                });
            } else {
                map(gval.fields, f(field) {
                    $AD(bckp.schema,  field, { del: true });
                    $AD(bckp.lschema, field, { del: true });
                });
            }
        }
        if ( def(lval) ) {
            self.recbuild(parseLS(key), lval, target, true);
        }
        if ( def(sval) ) {
            self.recbuild(parseLS(key), sval, target, false);
        }
        
    }
    
    self.build = f() {
        if ( !self.V.block ) {
            self._buildBasis();
        }
        self.V.cont.innerHTML = '';
        self.inputs = [];
        self.wysiwyg = [];
        
        
        var bckp = {
            schema: CO(self.schema),
            lschema: CO(self.lschema),
            group: CO(self.group)
        };
        
        map(self.order, f(key) {
            self._buildByList(bckp, key, self.V.cont);
        });
        
        mapO(bckp.lschema, f(v,k) { self._buildByList(bckp, k, self.V.cont); })
        mapO(bckp.schema , f(v,k) { self._buildByList(bckp, k, self.V.cont); })
    }
    
    
    
    
    
    
//--- DATA WORK --- 
    
    self.prepdata = f(func) {
        if ( self.prep.length == 0 ) {
            func();
            return 0;
        }
        var q = new EQ(func);
        map(self.prep, f(model) {
            q.add(f(done){ ORM.req(model+':select', done); });
        });
    }
    
    
    
    self.getLangObj = f() {
        if ( self.langPrefix ) {
            return self.obj[self.langPrefix][self.lang]||{};
        }
        return self.obj;
    }
    
    self.setData = f(list) {
        var q = new EQ(f(){self._setData(list);});
        
        map(self.inputs, f(input) {
            q.add(f(done) { input.onset(done); });
        });
    }
    
    self._setData = f(list) {
        list = list || self.inputs;
        var selfData = [self.upd, self.lupd[self.lang]||{}];
        var selfObj  = [self.obj, self.getLangObj()];
        
        self.onSetData(self, self.obj);
        
        map(list, f(input) {
            var chUpd = input.isLang && selfData[1] || selfData[0];
            var chObj = input.isLang && selfObj[1] || selfObj[0];
            
            if ( input.selfInfo ) { input.selfInfo.val = ''; }
            
            if (self.wysiwyg.contains(input)) {
                //-self.V.cont.attachFirst(input.selfOpts);
                var wys = input._wysiwyg;
                
                wys.view();
                var val = $AD(chUpd, input.selfKey);
                if ( !def(val) ) { val = $AD(chObj, input.selfKey); }
                if ( !def(val) ) { input.val = ''; } else { input.val = val.text; }
                wys.edit();
                
                wys.onupdate = f(val) {
                    val = {text:val};
                    val = mergeObjects(val, makeRssFromHtml(val.text));
                    input.C._emitValue(val);
                }
                
            } else {
                var val = $AD(chUpd, input.selfKey);
                if ( !def(val) ) { val = $AD(chObj, input.selfKey); }
                input.val = val;
                input.validate();
            }
        });
    }
    
    
    
//--- OUTER INTERFACE --- 
    
    self.showNew = f(obj) {
        var newData = CO(self.data);
        self.data.objschema(obj, newData);
        var neditor = new eEditor2(model, type, newData, true);
        map(self.rewritekeys, f(k) {
            neditor[k] = self[k];
        });
        neditor.show(obj);
        return neditor;
    }
    
    self.show = f(obj) {
        
        self.prepdata(f(){
            if ( obj ) {
                self._show(obj);
            } else {
                self.getobject(self._show);
            }
        });
    }
    
    self._show = f(obj) {
        if ( self.pop ) { self.hide(); }
        self.obj = obj;
        self.build();
        
        if ( obj._hasLang ) {
            var lang = ORM.O('lang_'+obj.lang_id );
            self.lang = lang.name;
            self.dom.C.setLang(lang.name);
        }
        
        self.setData();
        self.pop = POP.drag.showNew(self.dom, null, {
            dom: self.editordata.headoptions,
            isSmall: self.cls.contains('small')
        });
    }
    
    self.getButton = f() {
        var btn = self._getButton(self);
        //-btn.onclick = f() { self.show(); }
        btn.editorRef = self;
        return btn;
    }
    
    self.hide = f() { if ( self.pop ) { self.pop.hide(); delete self.pop; } }
    self.clear = f() {
        self.upd = {};
        self.lupd = {};
        
        self.hide();
    }
    
    
//- INNER INTERFACE --- 
    self._submit = f() {
        self._dovalidate(f(){
            var upd, lupd;
            if ( self.langPrefix ) {
                upd = mergeObjects({}, self.upd);
                upd[self.langPrefix] = {};
                
                mapO(ORM.model.lang, f(lang) {
                    upd[self.langPrefix][lang.name] = mergeObjects(self.obj[self.langPrefix][lang.name], self.lupd[lang.name])
                });
                lupd = {};
            } else {
                upd  = self.upd;
                lupd = self.lupd;
            }
            
            //-log(upd, lupd);
            self.submit(self.obj, upd, lupd, self.clear);
        });
    }
    self._validate = f(func) {
        var q = new EQ(func);
        
        map(self.inputs, f(input) {
            q.add(input.submitCheck);
        });
    }
    self._dovalidate = f(func) {
        if ( self.validate ) {
            self.validate(self, func);
        } else {
            self._validate(func);
        }
    }
    

//--- REWRITE FUNCTIONS --- 
    self.rewritekeys = parseLS('schema,lschema,defaultObject,group,order,_getButton,getobject,submit,validate,onSetData');
    self._getButton = f(self) {
        var node = cr('div', 'asBtn fa');
        node.attach(cr('span').VAL('editor'));
        return node;
    }
    self.getobject = f(func) { self.obj = mergeObjects({}, data.defaultObject); func({}); }
    self.submit = f(obj, data, langdata, func){ log(data, langdata); func(); }
    self.validate = null;
    
    self.onSetData = f(self, obj){}
    
    self._init();
}







ED2Q.processors = {
    delete: f(editor, data) {
        
        editor._getButton = f(self) {
            var node = cr('div', 'asBtn fa');
            node.attach(SVG.del().attr({class:'svg'}));
            node.attach(cr('span').VAL(PAGE.ld('delete')));
            
            node.onclick = f() {
                if ( node.ref ) {
                    ORM.req(node.ref+':select', f(list) {
                        if ( list[0] ) {
                            SYS.confirm([PAGE.ld('delete'),' ',ORM.getVisName(list[0]),'?'].join(''), 'center warning', f() {
                                ORM.req(node.ref+':delete', f() {
                                    SYS.alert(PAGE.ld('success'),'center green', node.ondelete || ENGINE._auth.reload);
                                })
                            });
                        }
                    });
                    
                }
            }
            
            return node;
        }
        
    },
    insert: f(editor, data) {
        editor.onSetData = f(self, obj) {
            if ( editor.V.title ) {
                editor.V.title.val = 'Insert '+editor.selfModel;
            }
        }
        
        editor._getButton = f(self) {
            var node = cr('div', 'asBtn fa');
            node.attach(SVG.add2().attr({class:'svg'}));
            node.attach(cr('span').VAL([PAGE.ld('insert'), editor.selfModel].join(' ')));
            
            node.onclick = f() {
                var o = CO(editor.defaultObject||{});
                //-log(o);
                editor.showNew(o);
            }
            
            return node;
        }
        
        editor.submit = f(obj, basedata, langdata, onfinish) {
            
            var q = new EQ(function() {
                PROTOCOL.cache.write(function() {
                    SYS.notify([ORM.getVisName(obj),PAGE.ld('edit'),PAGE.ld('done')].join(' '), 'ok');
                    onfinish();
                });
            });
            
            ORM.req(editor.selfModel+':insert', basedata, function(list) {
                if ( list.length == 0 ) {
                    SYS.alert('Creation failed!', 'center red');
                    return 0;
                }
                var newitem = list[0];
                
                if ( okeys(langdata).length == 0 ) { q.doNext(); }
                
                mapO(langdata, function(data, lang) {
                    q.add(function(done) {
                        if ( okeys(data).length == 0 ) {
                            tm(done);
                        } else {
                            ORM.req([newitem._bid||newitem._oid,lang,'update'].join(':'), data, done);
                        }
                    });
                    
                });
                
            });
            
        }
    },
    update: f(editor, data) {
        
        editor.onSetData = f(self, obj) {
            self.V.title.val = ORM.getVisName(obj);
        }
        
        editor._getButton = f(self) {
            var node = cr('div', 'asBtn fa');
            node.attach(SVG.edit2().attr({class:'svg'}));
            node.attach(cr('span').VAL(PAGE.ld('edit')));
            
            node.onclick = f() {
                if ( this.ref ) {
                    ORM.req(this.ref+':select', f(list) {
                        editor.showNew(list[0]);
                    });
                }
            }
            
            return node;
        }
        
        editor.submit = f(obj, basedata, langdata, onfinish) {
            
            var q = new EQ(function() {
                PROTOCOL.cache.write(function() {
                    SYS.notify([ORM.getVisName(obj),PAGE.ld('edit'),PAGE.ld('done')].join(' '), 'ok');
                    onfinish();
                });
            });
            
            ORM.req(obj._oid+':update', basedata, function() {
                if ( okeys(langdata).length == 0 ) { q.doNext(); }
                
                mapO(langdata, function(data, lang) {
                    q.add(function(done) {
                        if ( okeys(data).length == 0 ) {
                            tm(done);
                        } else {
                            ORM.req([obj._bid,lang,'update'].join(':'), data, done);
                        }
                    });
                    
                });
                
            });
            
        }
    }
}


function prepEditor2(model, types, dataSet) {
    map(parseLS(types), f(type) {
        var data = CO(dataSet);
        data.objschema = dataSet.objschema;
        
        map(parseLS('inherit,level,schema,lschema,group,order'), f(key) {
            var t = data[type+'_'+key];
            if ( def(t) ) {
                data[key] = t;
            }
        });
        
        //-if ( !def(data.lschema) && !def(data.langPrefix) && !def(data.cls) ) { data.cls = 'noLang'; }
        
        var editor = new eEditor2(model, type, data);
        if (ED2Q.processors[type]) { ED2Q.processors[type](editor, data);  }
    });
}



















