

SYS.fgq = {};


new eSubprogram('formGenerator', function(onfinish) {
    var self = this;
    
    self._buildMap = lsMapToDict({
        'def':          function(type) { return cr('input').attr({type:type});},
        'float':        function() {
            var node = cr('input').attr({type:'text'});
            
            $P(node, 'val', function() { return parseFloat(this.value) || 0; }, function(data) { return parseFloat(this.value = data) || 0; });
            
            return node;
        },
        'div,textarea': function(tag) { return cr(tag); },
        'bool':         function() { return cr.bool(); },
        'datetime':     function() { var node =  cr.calendartimeinput(); node.updateOnVal = true; return node; },
        'esqt':        function() {
            var newNode = cr('input');
            
            $P(newNode, 'val', function() { return this.value.rp('"',''); }, function(data) {
                return this.value = data.rp('"','');
            });
            
            newNode.onupdate(function() { this.val = this.val; });
            
            return newNode;
        },
        'escq':         function() {
            var newNode = cr('textarea');
            
            $P(newNode, 'val', function() { return this.value.replace(/\"([^|"]*)\"/g,'“$1”').rp('"',''); }, function(data) {
                return this.value = data;
            });
            
            return newNode;
        },
        'taglist':      function() {
            var newNode = cr('input').attr({type:'text'});
            newNode.__listVal = [];
            
            newNode.__listValProc = function() {
                var newData = [];
                var data = this.value.split(/\s*\,\s*/g);
                map(data, function(value) {
                    if ( value.rp(/\s/g,'').length > 1 ) { newData.push(value.rp('"','').rp(/\s+/g, ' ').toLowerCase()); }
                });
                this.__listVal = newData;
                this.value = newData.join(', ');
                return newData;
            }
            
            $P(newNode, 'val', function() {
                return newNode.__listValProc();
            }, function(data) {
                
                if ( typeof(data) == 'string' ) {
                    newNode.value = data;
                    newNode.__listValProc();
                } else {
                    newNode.__listVal = data;
                    newNode.value = data.join(', ');
                }
                
                return newNode.__listVal;
            });
            
            return newNode;
        },
        'dec': function() {
            var node = cr('input').attr({type:'number'});
            dispatchOnUpdate(node);
            
            $P(node, 'val', function() { return this.value.fromDec();}, function(val) {
                this.value = val.toDec();
                //-this.C._emitUpdated
                return this.value;
            });
            
            return node;
        },
        'fee_type': function() {
            return cr.dropdown(calcObj.fee_types);
        }
    });
    
    self._wysFields  = parseLS('content');
    self._jsonFields = parseLS('content');
    self._type = dlsMapToDict({
        'def':          'text',
        'title':        'esqt',
        'image':        'file',
        'displaydate':  'datetime',
        'keywords':     'taglist',
        'description':  'escq',
        'intro,headerhtml,footerhtml,tpl_forgot,tpl_confirm': 'textarea',
        'isactive,is_active,is_important': 'bool',
        'id':           'div'
    });
    
    self.init = function() {
        self.view = VIEW.formGenerator();
        self.view._jsonFields = self._jsonFields;
        
        self.V = self.view.V;
        self.C = self.view.C;
        self.F = self.view.F;
        self.B = self.view.B;
        
        self.view.V.submit.onclick = function() {
            if ( self.view._currentPop ) { self.view._currentPop.hide(); }
            
            self.data.custom(self.updateObj, self.view.C.currentUpdate, self.view.C.currentLangUpdate);
            
            //-log('!', self.view.C.currentUpdate, self.view.C.currentLangUpdate);
            
            self.onsubmit(self.view.C.currentUpdate, self.view.C.currentLangUpdate);
        }
        
        self.setData();
    }
    
    self.setObj = function(obj) {
        if ( typeof(obj) == 'string' ) {
            ORM.prep(obj, function(obj) {
                self.updateObj = obj;
                self.view.F.setObj(ORM.normaliseForUpdate(obj));
            });
        } else {
            self.updateObj = obj;
            self.view.F.setObj(obj);
        }
    }
    
    self.setData = function(data, obj, todo) {
        self.data = mergeObjects({
            title:     'Form Builder',
            fields:    [],
            ldfields:  [],
            dropdown:  {},
            cdropdown: {},
            media:     {},
            schema:    {},
            submitStr: 'Submit',
            onshow:    function(){},
            custom:    function(){},
            dom:       cr('div','options'),
            includeLang: false,
            langPrefix: null,
            hideLang:  false
        }, data);
        self.data.fields    = parseLS(self.data.fields);
        self.data.ldfields  = parseLS(self.data.ldfields);
        
        if ( self.data.langPrefix ) {
            self.data.includeLang = true;
            self.C.langPrefix = self.data.langPrefix;
        }
        if ( self.data.includeLang ) {
            self.C.isLangIncluded = true;
        }
        if ( self.data.hideLang ) {
            self.view.addCls('noLang');
        }
        
        
        self.build(obj);
        
        
        if ( def(todo) ) {
            self.onsubmit = todo;
        } else {
            self.onsubmit = function() {}
        }
    }
    
    
    
    #import jollix/extend/subprogram/formGeneratorType
    
    
    
    self._fk = function(field) {
        var fieldMap = field.split('.');
        return fieldMap[fieldMap.length-1];
    }
    
    self.build = function(obj) {
        self.prepareLists(function() {self._build(obj);});
    }
    self._build = function(obj) {
        self.view.F.clear();
        
        self.view.V.title.val = self.data.title;
        self.view.V.submit.val = self.data.submitStr;
        
        mapDLS(self.data.dropdown, function(field, entity) {
            self.view.F.addCont(field, self.buildDropdown(field, entity));
        });
        mapO(self.data.cdropdown, function(data, field) {
            self.view.F.addCont(self._fk(field), self.buildCDropdown(field, data));
        });
        map(self.data.fields, function(field) {
            self.view.F.addCont(field, self._buildNode(field, true));
        });
        map(self.data.ldfields, function(field) {
            self.view.F.addLDCont(field, self._buildNode(field, true));
        });
        mapLS(self.data.schema, function(obj, field) {
            self.view.F.addSchema(field, self.buildSchema(obj));
        });
        
        if ( okeys(self.data.media).length > 0 ) {
            self.view.V.support.cr('h4').VAL(PAGE.ld('Media'));
            
            mapLS(self.data.media, function(obj, field) {
                self.view.F.addSupport(field, self.buildMedia(obj, field));
            });
            
        }
        
        obj = obj || {};
        self.setObj(obj);
        //-if(def(obj)) { self.setObj(obj); }
    }
    
    
    self.prepareLists = function(func) {
        if ( Object.keys(self.data.dropdown).length == 0 ) {
            func();
            return 0;
        }
        var q = new EQ(func);
        
        mapLS(self.data.dropdown, function(field, entity) {
            if ( entity.indexOf('DICTVIEW') == 0 ) {
                var name = entity.split(':')[1];
                q.add(function(done) {
                    ORM.getViewDict(name, done);
                });
            } else {
                q.add(function(done) {
                    var key = [entity,PAGE.lang,'select'].join(':');
                    if ( !def(SYS.fgq[key]) ) {
                        SYS.fgq[key] = [done];
                        ORM.req(key, function() {
                            map(SYS.fgq[key], function(func) { func(); });
                            SYS.fgq[key] = true;
                        });
                    } else if ( SYS.fgq[key] == true ) {
                        done();
                    } else {
                        SYS.fgq[key].push(done);
                    }
                });
            }
            
        });
    }
    
    self._buildNode = function(field, isWysPossible) {
        var type = self._type[field] || self._type.def;
        var node = _jO(cr('div', 'line'));
        node.C.key = field;
        node.V.label = node.cr('div','key').VAL(PAGE.ld(field));
        
        if ( isWysPossible && self._wysFields.contains(field) ) {
            node.V.input = cr('div');
            node.attach(node.V.input);
            wysiwyg(node.V.input, self.data.dom);
        } else {
            node.V.input = (self._buildMap[type[0]] || self._buildMap.def)(type[0]).attr({placeholder:field});
            node.attach(node.V.input);
        }
        
        
        return node;
    }
    
    
    self.onsubmit = function(){}
    
    
    
    self.show = function() {
        POP.drag.showNew(self.view, null, self.data);
        map(S('textarea', self.view), autoAdjust);
        self.data.onshow(self);
    }
    
    self.init();
});





function makeRssFromHtml(html) {
    html = html||'';
    var result = { image: [] };
    var t = cr('div');
    t.innerHTML = html.replace(/<br ?\/?>/g, '\n').replace(/\n[\n ]+/g, '\n');
    
    map(S('.pr_gallery', t), function(node) {
        var src = node.attr('data-basic');
        if ( src.length > 0 ) {
            result.image.push(ENGINE.getUrlData(src).url);
        }
    });
    
    result.rss = t.val;
    
    return result;
}




















