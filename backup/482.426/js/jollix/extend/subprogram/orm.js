
new eSubprogram('ormView', function(onfinish) {
    var self = this;
    
    self.init = function() {
        self.ignoreFields   = CONF.object.orm.ignoreFields;
        self.models         = CONF.object.orm.storedModels;
        self.view = VIEW.orm();
        self.V = self.view.V;
        self.C = self.view.C;
        self.F = self.view.F;
        
        self.updates = {};
        self.currentOid = null;
        self.currentRef = null;
        self.firstRun = true;
        self.editSessions = {};
        self.editPosition = {};
        
        self.F.newTab('text', 'raw data');
        self.F.newTab('html');
        self.F.newTab('dict', 'json');
        self.F.newTab('src');
        
        self.F.setTab('dict');
        
        self.ideUpdFunc = function(){};
        
        self.V.reqest.onkeyup = function(ev) {
            if ( ev.keyCode == 13 ) {
                var reqMap = self.V.reqest.val.split(' ');
                self.doReq(reqMap[0], parseObj(reqMap[1]));
            }
        }
        self.V.oid.onkeyup = function(ev) {
            if ( ev.keyCode == 13 ) {
                self.reqByOid(self.V.oid.val);
                ORM.req(self.V.oid.val+':', function() {
                    self.drawObject(ORM.O(self.V.oid.val));
                })
            }
        }
        
        ORM.onStore(function(obj) {
            self.F.redrawObj(obj);
            self.C.listObjs[obj._oid].node.onclick = function() {
                self.drawObject(obj);
            }
        });
        
        self.V.commit.onclick = self.commit;
    }
    
    
    self.reqByOid = function(oid) {
        ORM.req(oid+':select', function() {
            self.drawObject(ORM.O(oid));
        });
    }
    
    
    self.commit = function() {
        if ( def(self.currentOid) ) {
            
            self.setUpdates( mergeObjects(self.updates, ORM.O(self.currentRef._oid)) );
            
            ORM.req(self.currentOid+':update', self.updates, function() {
                self.reqByOid(self.currentOid);
            });
        }
    }
    
    
    self.doReq = function(str, data) {
        self.V.reqest.val = str;
        ORM.req(str, data, self.drawObject);
        self.F.addHistory(str).onclick = function() {
            self.doReq(str);
        };
    }
    
    self.setUpdates = function(obj) {
        map(self.ignoreFields, function(field) {
            delete obj[field];
        })
        self.updates = obj;
        
        if (Object.keys(self.updates).length > 0 ) {
            self.V.commit.addCls('modified');
        } else {
            self.V.commit.remCls('modified');
        }
        
        return obj;
    }
    self.addUpdate = function(key, val) {
        self.updates[key] = val;
        self.V.commit.addCls('modified');
        return self.updates;
    }
    
    
    
    
    
    //- opening object
    
    self.filterTpl = function(str) {
        return str.rp(/<%set.+%>\n?/g, '').rp(/<%/g, '[').rp(/%>/g, ']');
    }
    
    self.drawSimpleData = function(obj) {
        self.C.contItems = [];
        self.C.contPage.dict.innerHTML = '';
        self.C.contPage.dict.attach(self._drawObject(obj));
        self.C.contPage.text.val = parseStr(obj);
        
        if ( def(obj.src) ) {
            self.C.contPage.html.innerHTML = self.filterTpl(obj.src);
        } else {
            self.C.contPage.html.innerHTML = obj;
        }
        self.F.doFilter();
    }
    
    self.initIde = function(obj, target) {
        var editor = self._editor;
        
        if ( !editor ) {
            editor = ace.edit(target);
            editor.setTheme("ace/theme/chrome");
            editor.getSession().setMode("ace/mode/html");
            editor.getSession().setUseSoftTabs(true);
            editor.setFontSize(14);
            
            editor.commands.addCommand({
                name: 'save',
                bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
                exec: function(editor) {
                    editor.blur();
                    self.commit();
                }
            });
            
            editor.on('blur', function(resp) {
                var val = editor.getValue();
                self.ideUpdFunc(val);
            });
            
            self._editor = editor;
        }
        
        
        var session = self.editSessions[obj._oid];
        if ( !def(session) ) {
            session = ace.createEditSession(obj.src, 'ace/mode/html');
            self.editSessions[obj._oid] = session;
            
            session.setUseWorker(false);
        }
        editor.setSession(session);
        
        var pos = self.editPosition[obj._oid];
        if ( def(pos) ) {
            editor.gotoLine(pos.row+1, pos.col);
        } else {
            editor.gotoLine(0);
        }
        
        
        self.ideUpdFunc = function(val) {
            self.editPosition[obj._oid] = editor.selection.getCursor();
            obj.src = val;
            self.drawSimpleData(obj);
            self.addUpdate('src', val);
        }
        
        
        self.editor = editor;
    }
    
    self.drawObject = function(obj, noTabSwitch) {
        
        self.setUpdates(ORM.diff(obj._oid));
        
        self.currentOid = obj._oid;
        self.currentRef = obj;
        self.drawSimpleData(obj);
        self.V.oid.val = self.currentOid;
        
        if ( def(obj.src) ) {
            self.C.tab.src.remCls('hidden');
            //-self.F.newTab('src');
            self.initIde(obj, self.C.contPage.src);
            if ( !noTabSwitch ) {
                self.F.setTab('src');
            }
        } else {
            //-self.F.removeTab('src');
            self.C.tab.src.addCls('hidden');
            
            if ( !noTabSwitch ) {
                if ( typeof(obj) == 'string' ) {
                    self.F.setTab('html');
                } else if ( typeof(obj) == 'number' ) {
                    self.F.setTab('text');
                } else {
                    self.F.setTab('dict');
                }
            }
        }
        
    }
    
    
    
    
    
    
    
    
    
    self._inputItem = function(node, obj) {
        var line = node.cr('div', 'lineItem');
        
        line.inpKey = line.cr('div', 'key withBg').cr('div').attr({
            placeholder: 'key',
            contenteditable: 'true'
        });
        
        line.inpVal = line.cr('div', 'dataField').attr({
            placeholder: 'value',
            contenteditable: 'true'
        });
        
        line.inpVal.onkeyup = function(ev) {
            if ( !EVENT.data.key.ctrl && ev.keyCode == 13 ) {
                if ( ['[]','{}'].contains(line.inpVal.val) ) {
                    obj[line.inpKey.val] = parseObj(line.inpVal.val);
                } else {
                    
                    if ( line.inpVal.val.indexOf('int:') == 0 ) {
                        obj[line.inpKey.val] = parseInt(line.inpVal.val.sl([4]));
                    } else {
                        obj[line.inpKey.val] = line.inpVal.val;
                    }
                }
                self.drawObject(self.currentRef, true);
                
                return false;
            }
        }
        
        return line;
    }
    
    self._dictItem = function(node, data, key, parent) {
        var line = node.cr('div', 'lineItem');
        var isIgnore = ( parent == self.currentRef && self.ignoreFields.contains(key) );
        
        var keyNode = line.cr('div', 'key').cr('div').VAL(key);
        keyNode.selfKey = key;
        
        var node = self._drawObject(data, key, isIgnore, parent);
        node.selfKey = keyNode;
        if ( def(node) ) {
            line.attach(node);
            node.selfLine = line;
            
            if ( isIgnore ) {
                line.addCls('ignore');
            } else {
                keyNode.attr({contenteditable:'true'});
                
                keyNode.onupdate(function() {
                    line.addCls('modified');
                    keyNode.selfVal = parent[keyNode.selfKey]||keyNode.selfVal;
                    delete parent[keyNode.selfKey];
                    keyNode.selfKey = keyNode.val;
                    if ( keyNode.val.length > 0 ) {
                        parent[keyNode.val] = keyNode.selfVal;
                    }
                });
                
                if ( def(self.updates[key]) ) {
                    line.addCls('modified');
                }
            }
        }
        self.C.contItems.push(line);
    }
    
    self._drawObject = function(obj, key, isIgnore, parent) {
        
        if ( !def(obj) || typeof(obj) == 'string' ) {
            var newNode = cr('div', 'dataField string');
            newNode.VAL(obj);
            newNode.selfKey = key;
            
            if ( !isIgnore ) {
                newNode.attr('contenteditable', 'true');
                
                newNode.onupdate(function() {
                    newNode.selfLine.addCls('modified');
                    if ( newNode.val == '{}' || newNode.val == '[]' ) {
                        parent[key] = parseObj(newNode.val);
                    } else {
                        parent[key] = newNode.val;
                    }
                });
                
            }
            
            return newNode;
            
        } else if ( typeof(obj) == 'object' ) {
            
            if ( T(obj) == T.A ) {
                var node = cr('div', 'list');
                map(obj, function(data, key) { self._dictItem(node, data, key, obj); });
                self._inputItem(node, obj);
                return node;
            }
            
            var node = cr('div', 'tree');
            if ( parent && obj._oid ) {
                self._dictItem(node, obj._oid, '_oid', obj);
            } else {
                mapO(obj, function(data, key) { self._dictItem(node, data, key, obj); });
            }
            
            self._inputItem(node, obj);
            
            return node;
            
        }
        
        var newNode = cr('div', 'dataField').VAL(obj);
        if ( !isIgnore ) {
            newNode.attr('contenteditable', 'true');
            
            newNode.onupdate(function() {
                newNode.selfLine.addCls('modified');
                parent[key] = newNode.val*1;
            });
        }
        
        return newNode;
    }
    
    
    
    self.prepareEntities = function() {
        map(self.models, function(model) {
            log(model);
            ORM.req(model+':select');
        })
    }
    
    
    
    
    
    
    
    self.show = function() {
        POP.window.show(self.view);
    }
    
    self.init();
});

