

window.EDITORFIELD = {}

function eEditorField(name, data) {
    var self = this;
    
    self.init = f(){
        self.name = name;
        self.data = mergeObjects({
            required: false,
            unique: false,
            nokey: false,
            validator: null,
            require_validator: f(val) { return def(val) && val.rp(/\s+/g,'').length > 0; },
            placeholder: '',
            build: f(self, data) {
                var newNode = cr('input').attr({type:'text'});
                return newNode;
            },
            wrap: f(self, data) {
                var fullSet = cr('div','line');
                var label = fullSet.cr('div','key');
                var info = fullSet.cr('div','info');
                var input = self.data.build(self, data);
                input.selfInfo = info;
                fullSet.attach(input);
                fullSet.cr('hr','wClear');
                return {
                    fullSet : fullSet,
                    label   : label,
                    info    : info,
                    input   : input
                };
            },
            onset: f(node, data, func) { tm(func); },
            postprocess: f(self, data, nodes) {},
            autofill: f(node, data, obj) {}
        }, data);
        EDITORFIELD[name] = self;
    }
    
    self.getInput = f(data) {
        var newData = mergeObjects(self.data, data);
        var nodes = newData.wrap(self, data);
        var node = nodes.input;
        
        if ( newData.nokey ) {
            nodes.label.addCls('hidden');
        }
        
        node.selfData = newData;
        
        node.onset = f(func) {
            newData.onset(node, newData, func);
        }
        
        node.validate = f() {
            node.is_valid = true;
            var validator = newData.validator;
            var valid = true;
            if ( validator ) {
                return node.is_valid = (valid && validator(node));
            }
            if ( valid && node.selfInfo ) { node.selfInfo.val = ''; }
            return valid;
        }
        
        
        
        node.submitSingleLang = f(obj, upd, lang, func) {
            var selector = {};
            var curVal = $AD(upd, node.selfKey);
            if ( !def(curVal) ) { tm(func); return 1; }
            
            
            selector[node.selfKey] = ['=', curVal];
            selector.lang_id       = ['=', ORM.O('lang_'+lang).id];
            
            if ( !obj._model ) { tm(func); return 1; }
            
            ORM.req(obj._model+':select', f(list) {
                if ( list.length == 0 || (list[0] && list[0].id == obj.id) ) {
                    tm(func);
                    return 1;
                }
                if ( node.selfInfo ) {
                    var str = PAGE.ld('not unique');
                    if ( node.isLang ) {
                        str += [' (',lang,')'].join('');
                    }
                    node.selfInfo.val = str;
                }
            }, {
                selector: selector
            });
        }
        
        
        node.submitSingleRequired = f(obj, upd, lang, func) {
            if ( !def(upd) ) { tm(func); return 1; }
            var curVal = $AD(upd, node.selfKey);
            if ( !def(curVal) ) { curVal = $AD(obj, node.selfKey); }
            
            var result = newData.require_validator(curVal);
            if ( result ) { tm(func); return 1; }
            if ( node.selfInfo ) {
                var str = PAGE.ld('require');
                if ( node.isLang ) {
                    str += [' (',lang,')'].join('');
                }
                node.selfInfo.val = str;
            }
        }
        
        node.submitSingleAutofill = f(obj, upd, lang, done) {
            
            if ( !def(upd) ) { tm(done); return 1; }
            var curVal = $AD(upd, node.selfKey);
            if ( !def(curVal) ) { curVal = $AD(obj, node.selfKey); }
            
            try {
                curVal = curVal.toString().rp(/\s+/g,'');
                if ( curVal.length == 0 ) { curVal = null; }
            } catch(err) {}
            if ( !def(curVal) ) {
                newData.autofill(node, newData, obj, upd, lang);
            }
            tm(done);
        }
        
        
        node._submitCheckWrap = f(func, ondone) {
            var obj = node.editorRef.obj;
            
            if ( node.isLang ) {
                var upds = node.editorRef.lupd;
                var q = new EQ(ondone);
                
                mapO(upds, f(upd, lang) {
                    
                    q.add(f(done) {
                        //-log([lang, node.isLang, node.selfKey, upd]);
                        func(obj, upd, lang, done);
                    });
                    
                });
            } else {
                var upd = node.editorRef.upd;
                func(obj, upd, node.editorRef.lang, ondone);
            }
        }
        
        node.submitCheck = f(func) {
            if ( !node.validate() ) { return 0; }
            
            node._submitCheckWrap(node.submitSingleAutofill, f(){
                if ( newData.unique && node.editorRef && node.editorRef.obj && node.selfKey ) {
                    node._submitCheckWrap(node.submitSingleLang, func);
                    return 0;
                }
                if ( newData.required ) {
                    node._submitCheckWrap(node.submitSingleRequired, func);
                    return 0;
                }
                tm(func);
            });
            
            
            return 1;
        }
        
        node.autofill = f(obj, upd, lupd) {
            
            if ( !def(node.val) || node.val == '' ) {
                newData.autofill(node, newData, obj, upd, lupd);
                node.validate();
            }
        }
        
        
        self.data.postprocess(self, data, nodes);
        return nodes;
    }
    
    self.init();
}












