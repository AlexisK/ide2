
SYS.dictView = {};

var ORM = new eStorage('orm', {
    
    req: function(self, path, data, todo, params) {
        
        if ( !path ) {
            console.log('\nMan:');
            console.log("\tORM.req('target[:lang]:method'[, data, todo, params])");
            
            console.log('\nInfo:');
            console.log("\ttarget [String]   model_name || model_id");
            console.log("\tdata   [Object]");
            console.log("\ttodo   [Function]");
            console.log("\tparams [Object]   override on default req {selector:{name:['=','main']}}");
            
            console.log('\nExample:');
            console.log("\tORM.req('transaction:select',log);");
            console.log("\tORM.req('transaction:insert',{exchange_id:6192449487640739,in_sum:24000000000},log);");
            console.log("\tORM.req('category_news:ru:update',{title:'test news'},log);");
            return 0;
        }
        
        params = params||{};
        
        //-params.selector = mergeObjects({
        //-    lang_id
        //-}, params.selector);
        
        if ( !def(data) || typeof(data) == 'function' ) {
            params = todo;
            todo = data;
            data = null;
        }
        todo = todo || function(){};
        
        
        var respFunc = function(resp, fullData) {
            mapO(resp, function(objList, model) {
                self.model[model]            = self.model[model] || {};
                self.data.modelByName[model] = self.data.modelByName[model] || {};
                
                map(objList, function(obj) {
                    //-if ( obj.id ) { self.store([model,obj.id].join('_'), obj); }
                    if ( obj.id ) { self.storePriv(model,obj.id, obj); }
                });
                
                todo(objList, resp, fullData);
            });
            
        };
        
        PROTOCOL.api.write(path, data, respFunc, respFunc, params);
        
        
    },
    
    
    
    
    _copyDictView: function(self,name) {
        var result = {};
        mapO(SYS.dictView[name], function(node, key) {
            result[key] = node.cloneNode(true);
        });
        return result
    },
    
    _viewDictQ : {},
    _viewDictF : {},
    _viewDictS : {},
    getViewDict: function(self, name, func, isHard) {
        self.data._viewDictQ[name] = self.data._viewDictQ[name] || [];
        self.data._viewDictQ[name].push(func);
        
        if ( isHard ) {
            self.data._viewDictF[name] = false;
            self.data._viewDictS[name] = false;
        }
        
        if ( !self.data._viewDictS[name] ) {
            self.data._getViewDict(self, name, func);
            self.data._viewDictS[name] = true;
        } else {
            self.data._viewDictWorker(self, name);
        }
    },
    _viewDictWorker: function(self, name) {
        if ( self.data._viewDictF[name] ) {
            map( (self.data._viewDictQ[name]||[]), function(func) {
                func(self.data._copyDictView(self,name));
            });
            self.data._viewDictQ[name] = [];
        }
    },
    _getViewDict: function(self, name, func) {
        func = func || log;
        
        getRawData(['/_view',PAGE.lang,name,('?v='+(new Date()*1))].join('/'), function(data) {
            var t = cr('div');
            t.innerHTML = data;
            var result = {};
            var oids = [];
            
            map(S('.mk_ent', t), function(node) {
                var oid = node.attr('data-eid');
                var ln = node.attr('data-eln');
                
                if ( oids.contains(oid) ) {
                    if ( ln && ln == PAGE.langObj.id) {
                        result[oid] = node;
                        result[oid].lang = PAGE.lang;
                    }
                } else {
                    result[oid] = node;
                    result[oid].lang = ORM.O('lang_'+ln).name;
                }
                oids.push(oid);
            });
            
            SYS.dictView[name] = result;
            self.data._viewDictF[name] = true;
            self.data._viewDictWorker(self, name);
            //-func(result);
        },log);
    },
    
    
    
    
    normaliseForUpdate: function(self, obj) {
        if ( typeof(obj) != 'object' ) { return obj; }
        var result = {};
        
        mapO(obj, function(val, key) {
            if ( !CONF.object.orm.ignoreFields.contains(key) ) {
                result[key] = val;//-self.data.normaliseForUpdate(self, val);
            }
        });
        
        return result;
    },
    
    model: {},
    original: {},
    modelByName: {},
    todoByModel: {},
    onModel: function(self, model, func) {
        self.data.todoByModel[model] = self.data.todoByModel[model] || [];
        self.data.todoByModel[model].add(func);
    },
    remOnModel: function(self, func) {
        mapO(self.data.todoByModel, function(list) {
            list.remove(func);
        });
    },
    storePriv: function(self, model, id, data) {
        var oid = model+'_'+id;
        
        data._model = model;
        data._rel = {};
        
        if ( data.lang_id ) {
            var lang = ORM.model.lang['lang_'+data.lang_id].name;
            data._hasLang = true;
            data._bid   = oid;
            data._bname = model+'_'+data.name||id;
            data._oid   = oid+':'+lang;
            data._oname = data._bname+':'+lang;
        } else {
            data._hasLang = false;
            data._oid = oid;
            data._oname = model+'_'+data.name||id;
        }
        
        if ( data.langdata === null ) {
            data.langdata = {};
        }
        
        
        self.cont[data._oid]         = data;
        self.model[model][data._oid] = data;
        
        if ( def(data.name) ) {
            self.data.modelByName[model][data._oname] = data;
            self.cont[data._oname]                    = data;
        }
        
        if ( def(self.data.todoByModel[model]) ) {
            map(self.data.todoByModel[model], function(func) { func(data); })
        }
        
        return data._oid;
    },
    store: function(self, oid, data) {
        
        var oidMap  = oid.split('_');
        var id      = oidMap[1][0];
        var model   = oidMap[0];
        var name    = data.name;
        var lang_id = data.lang_id;
        var lang    = null;
        
        
        data._model = model;
        if ( def(lang_id) ) {
            lang = ORM.O('lang_'+lang_id);
            data._hasLang = true;
            data._bid     = oid;
            data._bname   = [model, name||id].join('_');
            data._oid     = [oid,         lang.name].join(':');
            data._oname   = [data._bname, lang.name].join(':');
        } else {
            data._oid         = oid;
            data._oname       = [model, name||id].join('_');
            data._hasLang     = false;
        }
        
        //-data = mergeObjects(self.cont[oid], data);
        
        self.cont[data._oid]         = data;
        self.model[model][data._oid] = data;
        
        if ( def(name) ) {
            self.data.modelByName[model][data._oname] = data;
            self.cont[data._oname]                    = data;
        }
        
        if ( def(self.data.todoByModel[model]) ) {
            map(self.data.todoByModel[model], function(func) { func(data); })
        }
        
        return data._oid;
    },
    toUrl: function(self, req, method) {
        var reqMap = req.split(':');
        var oidMap = reqMap[0].split('_');
        method     = method||reqMap[1]||'retrieve';
        
        if ( parseInt(oidMap[1]) == oidMap[1] ) {
            return [oidMap[0],'/',method,'/?id=',oidMap[1]].join('');
        }
        return [oidMap[0],'/',method,'/?name=',oidMap[1]].join('');
    },
    diff: function(self, oid) {
        var result = {};
        var orig   = self.data.original[oid];
        
        if ( !def(orig) ) { return {}; }
        
        mapO(self.cont[oid], function(val, key) {
            if ( parseStr(val) != parseStr(orig[key]) ) { result[key] = val; }
        });
        
        return result;
    },
    lang: function(self, obj, lang, key) {
        if ( !obj || !obj.langdata ) { return ''; }
        lang = lang || PAGE.urlMap.lang;
        
        if ( !def(key) ) {
            if ( def(obj.langdata[lang]) && (typeof(obj.langdata[lang]) != 'object' || parseStr(obj.langdata[lang]) != '{}') ) {
                return obj.langdata[lang];
            }
            return obj.langdata.en||'';
        }
        return obj.langdata[lang][key]||obj.langdata.en[key]||'';
    },
    prepQ: {},
    prep: function(self, ref, func) {
        func    = func   || function(){};
        
        var obj = self.O(ref);
        if ( def(obj) ) {
            func(obj);
        } else {
            if ( def(self.data.prepQ[ref]) ) {
                self.data.prepQ[ref].push(func);
            } else {
                self.data.prepQ[ref] = [func];
                ORM.req(ref+':select', function() {
                    map(self.data.prepQ[ref], function(func) { func(self.O(ref)); })
                    self.data.prepQ[ref] = null;
                })
            }
            
        }
    },
    getVisName: function(self, obj) {
        if ( !def(obj) ) { return ''; }
        if ( obj.title ) { return obj.title; }
        if ( obj.email ) { return obj.email; }
        if ( obj.langdata ) {
            if ( obj.langdata[PAGE.lang] ) {
                var t =  obj.langdata[PAGE.lang];
                if ( t.title ) { return t.title; }
                if ( t.displayname ) { return t.displayname; }
                if ( t.name ) { return t.name; }
            }
            if ( obj.langdata.en ) {
                var t = obj.langdata.en;
                if ( t.title ) { return t.title; }
                if ( t.displayname ) { return t.displayname; }
                if ( t.name ) { return t.name; }
            }
        }
        if ( obj.displayname ) { return obj.displayname; }
        if ( obj.name ) { return obj.name; }
        return obj.id;
    },
    rel: function(self, obj, key) {
        var keyMap = (key||'').split('_');
        var model = keyMap[keyMap.length-1];
        keyMap.push('id');
        var rel = keyMap.join('_');
        
        if ( !obj[rel] ) { return null; }
        
        return ORM.O([model,obj[rel]].join('_'));
        
    },
    getDropdownMap: function(self, model) {
        var result = {};
        var conf = CONF.project.ormDropdownName || {};
        var func = conf[model] || self.data.getVisName;
        
        mapO(self.model[model], function(obj) {
            result[obj.id] = func(self, obj);
        });
        return result;
    },
    O: function(self, req) {
        var obj = self.cont[req];
        if ( !obj ) {
            var to = self.cont[[req,PAGE.lang].join(':')];
            return to || null;
        }
        return obj;
    }
}, ['req', 'getViewDict', 'toUrl', 'diff', 'lang', 'normaliseForUpdate','prep','getVisName','onModel','remOnModel','_copyDictView','rel','getDropdownMap']);

























