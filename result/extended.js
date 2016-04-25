window.EDITOR = {}
var notNullFileds = ['displaydate'];function eEditor(name, type, data) {
var self   = _jO(this);self.model = EDITOR;self.init = function() {
if ( typeof(name) == 'string' ) {
EDITOR[name]       = EDITOR[name] || {};EDITOR[name][type] = self.prep;} else {
data = name;name = '';type = '';}
data.lvl = data.lvl||20;self.insts         = {};}
self.initCheck = function() {
self.data = self.data || mergeObjects({
form:       function(obj) { return {} },hiddenForm: [],langPrefix: null,onsubmit:   function(data, obj) { log(data, obj); },button:     function(obj) {
var node = cr('div', 'asBtn fa');node.attach(cr('span').VAL('editor'));return node;}
}, data);}
self.prep = function(obj, todo, onfinish) {
obj =          obj || {};self._curObj = obj;todo =         todo || function(button) { button.click(); };onfinish =     onfinish || function() {}
self.initCheck();if ( PAGE.level >= data.lvl ) {
if ( typeof(obj) == 'string' ) {
ORM.prep(obj, function(data) {
self._prep(data, todo, onfinish);});} else {
self._prep(obj, todo, onfinish);}
}
}
self._prep = function(obj, todo, onfinish) {
self.obj = obj;var formDict    = self.data.form(obj);formDict.fields = parseLS(formDict.fields||[]);map(parseLS(self.data.hiddenForm), function(field) {
if ( !def(obj[field]) ) { formDict.fields.add(field); } else { formDict.fields.remove(field); }
});self.form = new SUBPROGRAM.formGenerator();self.form.setData( formDict, obj, function(data, langData) {
if ( self.data.langPrefix ) {
data[self.data.langPrefix] = self.obj[self.data.langPrefix] || {};mapO(langData, function(val, k) {
data[self.data.langPrefix][k] = mergeObjects(data[self.data.langPrefix][k], val);});langData = {};}
map(notNullFileds, function(fld) {
if ( data[fld] == null ) { delete data[fld]; }
});mapO(langData, function(ldata) {
map(notNullFileds, function(fld) {
if ( ldata[fld] == null ) { delete ldata[fld]; }
});})
self.data.onsubmit([data, langData], self.obj, onfinish);}, name);self.insts[obj._oid] = {
obj:  obj,todo: todo,form: self.form
};todo(self._getButton(obj), self);}
self._getButton = function(obj) {
if ( PAGE.level >= data.lvl ) {
var node = self.data.button(obj);clearEvents(node).onclick = function() {
var data     = self.insts[obj._oid];self.obj     = data.obj;self._curObj = data.obj;self.form    = data.form;self.form.show();return false;}
return node;}
return cr('div');}
self.init();}
ENGINE.prepEditor = function(model, data, customData) {
if ( model.contains(',') ) {
map(parseLS(model), function(nm) {
ENGINE.prepEditor(nm, data, customData);})
return 0;}
customData = customData || {};var customRules = customData.insert_form || customData.form || function(){};var editors = {};data = lsMapToDict(data);editors.create = new eEditor(model, 'create', {
lvl: data.insert_lvl || data.lvl || 200,form: function(obj) {
var dt =  {
title:      '+ '+PAGE.ld(model),submitStr:  PAGE.ld('create'),fields:     data.insert_fields     || data.fields     || [],ldfields:   data.insert_ldfields   || data.ldfields   || [],dropdown:   data.insert_dropdown   || data.dropdown   || {},cdropdown:  data.insert_cdropdown  || data.cdropdown  || {},media:      data.insert_media      || data.media      || {},schema:     data.insert_schema     || data.schema     || {},onshow:     data.insert_onshow     || data.onshow     || function() {},custom:     data.insert_custom     || data.custom     || function() {},hideLang:   data.insert_hideLang   || data.hideLang   || false,langPrefix: data.insert_langPrefix || data.langPrefix || null
}
customRules(dt, obj);return dt;},hiddenForm: data.hiddenForm||[],langPrefix: data.insert_langPrefix || data.langPrefix || null,onsubmit:   function(newDataMap, obj, onfinish) {
var q = new EQ(function() {
PROTOCOL.cache.write(function() {
SYS.notify([ORM.getVisName(obj),PAGE.ld('create'),PAGE.ld('done')].join(' '), 'ok');if ( data.oncreate ) {
data.oncreate(newDataMap, obj, onfinish);} else {
onfinish();}
});});ORM.req(model+':insert', ORM.normaliseForUpdate(mergeObjects(obj, newDataMap[0])), function(new_obj_list) {
var new_obj = new_obj_list[0];if ( new_obj._hasLang ) {
q.doNext();} else {
if ( okeys(newDataMap[1]).length == 0 ) {
q.add(function(done) {
ORM.req([new_obj._oid, PAGE.lang, 'update'].join(':'), { title: '' }, done);});} else {
mapO(newDataMap[1], function(data, lang) {
q.add(function(done) {
ORM.req([new_obj._oid, lang, 'update'].join(':'), data, function(list, resp) {
if ( resp.statusData ) {
ORM.req(new_obj._oid+':delete');POP.info.showNew(cr('div', 'alert').VAL(resp.statusData.field + ' ' + resp.statusData.exception ));log(resp.statusData);} else {
done();}
});});});}
}
});},button: function(obj) {
var node = self.cr('div', 'asBtn fa');node.attach(SVG.add().attr({class:'svg'}));node.attach(cr('span').VAL(PAGE.ld(model)));return node;}
});var customRules = customData.update_form || customData.form || function(){};editors.edit = new eEditor(model, 'edit', {
lvl: data.update_lvl || data.lvl || 200,form: function(obj) {
var dt = {
title:      (data.title||function() { return ORM.getVisName(obj); })(obj),submitStr:  PAGE.ld('save'),fields:     data.update_fields     || data.fields     || [],ldfields:   data.update_ldfields   || data.ldfields   || [],dropdown:   data.update_dropdown   || data.dropdown   || {},cdropdown:  data.update_cdropdown  || data.cdropdown  || {},media:      data.update_media      || data.media      || {},schema:     data.update_schema     || data.schema     || {},onshow:     data.update_onshow     || data.onshow     || function() {},custom:     data.update_custom     || data.custom     || function() {},hideLang:   data.update_hideLang   || data.hideLang   || false,langPrefix: data.update_langPrefix || data.langPrefix || null
}
customRules(dt, obj);return dt;},hiddenForm: data.hiddenForm||[],langPrefix: data.update_langPrefix || data.langPrefix || null,onsubmit: function(newDataMap, obj, onfinish) {
var newObj = ORM.normaliseForUpdate(newDataMap[0]);var q = new EQ(function() {
PROTOCOL.cache.write(function() {
SYS.notify([ORM.getVisName(obj),PAGE.ld('edit'),PAGE.ld('done')].join(' '), 'ok');if ( data.onupdate ) {
data.onupdate(newDataMap, obj, onfinish);} else {
onfinish();}
});});ORM.req(obj._oid+':update', newObj, function() {
if ( okeys(newDataMap[1]).length == 0 ) { q.doNext(); }
mapO(newDataMap[1], function(data, lang) {
q.add(function(done) {
if ( okeys(data).length == 0 ) {
tm(done);} else {
ORM.req([obj._bid,lang,'update'].join(':'), data, done);}
});});});},button: function(obj) {
var node = self.cr('div', 'asBtn fa');node.attach(SVG.edit2().attr({class:'svg'}));node.attach(cr('span').VAL(PAGE.ld('edit')));return node;}
});return editors;}
var TEDITOR = {
fix: function(obj, update, langUpdate, form) {
mapO(langUpdate, function(data, lang) {
if ( data.displaydate == null ) {
delete data.displaydate;}
});},tags: function(obj, update, langUpdate, form) {
var tags = obj.tags || [];if ( def(langUpdate[PAGE.lang].tags) ) { tags = langUpdate[PAGE.lang].tags; }
if ( form.wysiwygs.content.bb_entities.tags ) { tags = tags.concat(form.wysiwygs.content.bb_entities.tags); }
langUpdate[PAGE.lang].tags = [];map(tags, function(tag) { langUpdate[PAGE.lang].tags.add(tag); });},urlpart: function(obj, update, langUpdate, form) {
mapO(langUpdate, function(data, lang) {
if ( !def(data.urlpart) ) {
if ( def(obj.urlpart) ) {
data.urlpart = obj.urlpart;} else if ( def(data.title)  ) {
data.urlpart = data.title.translit('url');}
}
});},};TEDITOR.urlpart_tags = function(obj, update, langUpdate, form) {
TEDITOR.fix(obj, update, langUpdate, form);TEDITOR.tags(obj, update, langUpdate, form);TEDITOR.urlpart(obj, update, langUpdate, form);}
window.EDITORFIELD = {}
function eEditorField(name, data) {
var self = this;self.init = function(){
self.name = name;self.data = mergeObjects({
required: false,unique: false,nokey: false,validator: null,require_validator: function(val) { return def(val) && val.rp(/\s+/g,'').length > 0; },placeholder: '',build: function(self, data) {
var newNode = cr('input').attr({type:'text'});return newNode;},wrap: function(self, data) {
var fullSet = cr('div','line');var label = fullSet.cr('div','key');var info = fullSet.cr('div','info');var input = self.data.build(self, data);input.selfInfo = info;fullSet.attach(input);fullSet.cr('hr','wClear');return {
fullSet : fullSet,label   : label,info    : info,input   : input
};},onset: function(node, data, func) { tm(func); },postprocess: function(self, data, nodes) {},autofill: function(node, data, obj) {}
}, data);EDITORFIELD[name] = self;}
self.getInput = function(data) {
var newData = mergeObjects(self.data, data);var nodes = newData.wrap(self, data);var node = nodes.input;if ( newData.nokey ) {
nodes.label.addCls('hidden');}
node.selfData = newData;node.onset = function(func) {
newData.onset(node, newData, func);}
node.validate = function() {
node.is_valid = true;var validator = newData.validator;var valid = true;if ( validator ) {
return node.is_valid = (valid && validator(node));}
if ( valid && node.selfInfo ) { node.selfInfo.val = ''; }
return valid;}
node.submitSingleLang = function(obj, upd, lang, func) {
var selector = {};var curVal = $AD(upd, node.selfKey);if ( !def(curVal) ) { tm(func); return 1; }
selector[node.selfKey] = ['=', curVal];selector.lang_id       = ['=', ORM.O('lang_'+lang).id];if ( !obj._model ) { tm(func); return 1; }
ORM.req(obj._model+':select', function(list) {
if ( list.length == 0 || (list[0] && list[0].id == obj.id) ) {
tm(func);return 1;}
if ( node.selfInfo ) {
var str = PAGE.ld('not unique');if ( node.isLang ) {
str += [' (',lang,')'].join('');}
node.selfInfo.val = str;}
}, {
selector: selector
});}
node.submitSingleRequired = function(obj, upd, lang, func) {
if ( !def(upd) ) { tm(func); return 1; }
var curVal = $AD(upd, node.selfKey);if ( !def(curVal) ) { curVal = $AD(obj, node.selfKey); }
var result = newData.require_validator(curVal);if ( result ) { tm(func); return 1; }
if ( node.selfInfo ) {
var str = PAGE.ld('require');if ( node.isLang ) {
str += [' (',lang,')'].join('');}
node.selfInfo.val = str;}
}
node.submitSingleAutofill = function(obj, upd, lang, done) {
if ( !def(upd) ) { tm(done); return 1; }
var curVal = $AD(upd, node.selfKey);if ( !def(curVal) ) { curVal = $AD(obj, node.selfKey); }
try {
curVal = curVal.toString().rp(/\s+/g,'');if ( curVal.length == 0 ) { curVal = null; }
} catch(err) {}
if ( !def(curVal) ) {
newData.autofill(node, newData, obj, upd, lang);}
tm(done);}
node._submitCheckWrap = function(func, ondone) {
var obj = node.editorRef.obj;if ( node.isLang ) {
var upds = node.editorRef.lupd;var q = new EQ(ondone);mapO(upds, function(upd, lang) {
q.add(function(done) {
func(obj, upd, lang, done);});});} else {
var upd = node.editorRef.upd;func(obj, upd, node.editorRef.lang, ondone);}
}
node.submitCheck = function(func) {
if ( !node.validate() ) { return 0; }
node._submitCheckWrap(node.submitSingleAutofill, function(){
if ( newData.unique && node.editorRef && node.editorRef.obj && node.selfKey ) {
node._submitCheckWrap(node.submitSingleLang, func);return 0;}
if ( newData.required ) {
node._submitCheckWrap(node.submitSingleRequired, func);return 0;}
tm(func);});return 1;}
node.autofill = function(obj, upd, lupd) {
if ( !def(node.val) || node.val == '' ) {
newData.autofill(node, newData, obj, upd, lupd);node.validate();}
}
self.data.postprocess(self, data, nodes);return nodes;}
self.init();}
window.EDITOR2 = {}
window.ED2Q = {
dependancy: {},queue: [],buildQueue: function() {
var done = 0;mapO(ED2Q.dependancy, function(editorList, inh) {
map(editorList, function(editor) {
var isOk = map(parseLS(inh), function(el) { return ED2Q.queue.contains(el); });if ( isOk ) {
ED2Q.queue.add(editor);editorList.remove(editor);done += 1;}
});if ( editorList.length == 0 ) {
delete ED2Q.dependancy[inh];}
});if ( done ) {
ED2Q.buildQueue();} else {
ED2Q.runQueue();}
},runQueue: function() {
map(ED2Q.queue, function(model) {
mapO(EDITOR2[model], function(editor) {
editor.init();});});}
};function eEditor2(model, type, data, is_direct) {
var self   = _jO(this);self.model = EDITOR2;self._init_filter_rec = function(obj) {
mapO(obj, function(v,k) {
if ( T(v) == T.O ) {
obj[k] = self._init_filter_rec(v);}
});var newObj = lsMapToDict(obj);return newObj;}
self._init_filter = function() {
data = data || {};data.schema = self._init_filter_rec(data.schema);data.lschema = self._init_filter_rec(data.lschema);data.group = lsMapToDict(data.group);data.objschema = data.objschema || function(obj, data) {};mapO(data.group||{}, function(gval, key) {
if ( T(gval) == T.S ) {
data.group[key] = {
title: gval,fields: gval
}
}
});}
self._init = function() {
self._init_filter();self.type   = type;self.selfModel = model;self.editordata = {
headoptions: cr('div','options')
};self.inputs = [];self.upd    = {};self.lupd   = {};self.lang   = PAGE.lang;self.lupd[self.lang] = {};if ( is_direct ) {
self.data = data;self.level = data.level || 250;self.cls   = data.cls   || '';self.inherit = [];self.init();} else {
EDITOR2[model] = EDITOR2[model] || {};if ( EDITOR2[model][self.type] && EDITOR2[model][self.type].data ) {
var baseData           = mergeObjects(EDITOR2[model][self.type].data,               data);baseData.schema        = mergeObjects(EDITOR2[model][self.type].data.schema,        data.schema);baseData.lschema       = mergeObjects(EDITOR2[model][self.type].data.lschema,       data.lschema);baseData.group         = mergeObjects(EDITOR2[model][self.type].data.group,         data.group);baseData.defaultObject = mergeObjects(EDITOR2[model][self.type].data.defaultObject, data.defaultObject);data = baseData;}
EDITOR2[model][self.type] = self;self.data = data;self.level = data.level || 250;self.inherit = parseLS(data.inherit||[]);if ( data.inherit ) {
ED2Q.dependancy[self.inherit] = ED2Q.dependancy[self.inherit] || [];ED2Q.dependancy[self.inherit].add(model);} else {
ED2Q.queue.add(model);}
}
}
self.init = function(){
var schema  = {};var lschema = {};var group   = {};var order   = [];var defaultObject = {};map(self.inherit, function(model){
if ( EDITOR2[model][self.type] ) {
schema  = mergeObjects( schema, EDITOR2[model][self.type].schema);lschema = mergeObjects(lschema, EDITOR2[model][self.type].lschema);defaultObject = mergeObjects(defaultObject, EDITOR2[model][self.type].defaultObject);mapO(EDITOR2[model][self.type].group, function(gp, gpkey) {
if ( !def(group[gpkey]) ) {
group[gpkey] = gp;} else {
var newFields = group[gpkey].fields.concat(gp.fields);group[gpkey] = mergeObjects(group[gpkey], gp);group[gpkey].fields = newFields;}
});map(EDITOR2[model][self.type].order, function(el) { order.add(el); });}
});mapO(data.group||{}, function(gp, gpkey) {
gp.fields = parseLS(gp.fields);if ( !def(group[gpkey]) ) {
group[gpkey] = gp;} else {
var newFields = group[gpkey].fields.concat(gp.fields);group[gpkey] = mergeObjects(group[gpkey], gp);group[gpkey].fields = newFields;}
});schema  = mergeObjects( schema, data.schema);lschema = mergeObjects(lschema, data.lschema);defaultObject = mergeObjects(defaultObject, data.defaultObject);self.langPrefix = data.langPrefix || null;self.prep = parseLS(data.prep || []);self.schema = schema;self.lschema = lschema;self.defaultObject = defaultObject;self.group = group;self.order = parseLS(data.order || order);}
self.updRec = function(upd, adr, obj, val) {
if ( adr.length == 1 ) {
upd[adr[0]] = val;return val;}
var ad = adr.splice(0, 1)[0];upd[ad] = upd[ad] || CO(obj[ad]||{});return self.updRec(upd[ad], adr, obj[ad]||{}, val);}
self.emitUpdated = function(isLang, ad, val) {
var upd;if ( isLang ) {
self.lupd[self.lang] = self.lupd[self.lang] || {};upd = self.lupd[self.lang];} else {
upd = self.upd;}
self.updRec(upd, ad.split('.'), self.obj, val);}
self._buildBasis = function() {
self.dom = VIEW.langMenu();self.dom.addCls('compact');self.dom.addCls(self.cls);self.V.title  = self.dom.V.block.cr('h2').VAL([model,self.type].join(' '));self.V.cont   = self.dom.V.block.cr('div');self.V.oscont = self.dom.V.block.cr('div');self.submitBtn = self.dom.V.langButtons.cr('div','asBtn final').VAL(PAGE.ld('Ok'));self.submitBtn.onclick = function() {
tm(self._submit);return false;};self.dom.C.onLang = function(lang) {
self.lang = lang.name;if ( self.obj ) {
if ( self.langPrefix ) {
self.setData();} else if ( self.obj._hasLang ) {
ORM.req([self.obj._bid,self.lang,'select'].join(':'), function(list) {
var newObj = list[0];if ( newObj ) {
self.obj = newObj;self.setData();} else {
var frng = RNG(self.inputs);self.setData(frng.filter({isLang:false}));map(frng.filter({isLang:true}), function(inp) {
if ( inp._wysiwyg ) {
inp._wysiwyg.view();inp.val = '';inp._wysiwyg.edit();} else {
inp.val = $AD(self.lupd[self.lang], inp.selfKey);}
inp.validate();});}
});} else {
var frng = RNG(self.inputs);self.setData(frng.filter({isLang:false}));map(frng.filter({isLang:true}), function(inp) {
if ( inp._wysiwyg ) {
inp._wysiwyg.view();inp.val = '';inp._wysiwyg.edit();} else {
inp.val = $AD(self.lupd[self.lang], inp.selfKey);}
inp.validate();});}
}
}
}
self._buildLine = function(keyMap, title, schema, target, isLang){
if ( T(title) == T.A ) { title = title.sl([-1])[0]; }
title = title.split('.');title = title.sl([-1])[0];if ( T(schema) == T.S ) {
schema = {_type:schema};}
schema.wysiwyg = self.wysiwyg;if ( schema._flag ) {
map(parseLS(schema._flag), function(flag){
schema[flag] = true;});delete schema._flag;}
var edField = EDITORFIELD[schema._type]||EDITORFIELD.def;var INP = edField.getInput(mergeObjects(self.editordata, schema));INP.input.onupdate(function(val) {
if ( INP.input.validate(val) ) {
self.emitUpdated(isLang, INP.input.selfKey, val);}
});INP.input.selfKey = keyMap.join('.');INP.input.isLang = isLang;INP.input.editorRef = self;INP.label.VAL(PAGE.ld(title));target.attach(INP.fullSet);self.inputs.push(INP.input);}
self._buildGroup = function(keyMap, title, schema, target, isLang){
var newNode = _jO(target.cr('div'));newNode.V.title = newNode.cr('h3').VAL(title);newNode.V.cont  = newNode.cr('div','group');if ( def(keyMap) ) {
self.recbuild(keyMap, schema, newNode.V.cont, isLang);}
return newNode;}
self.recbuildOld = function(key, schema, target, isLang) {
mapLS(schema, function(v,k) {
var km = CO(key); km.push(k);if ( T(v) == T.O && !def(v._type) ) {
self._buildGroup(km, k, v, target, isLang);} else {
self._buildLine(km, k, v, target, isLang);}
});}
self.recbuild = function(key, schema, target, isLang) {
if ( T(schema) == T.O && !def(schema._type) ) {
mapLS(schema, function(v,k) {
var km = CO(key); km.push(k);self.recbuild(km, v, target, isLang);});} else {
self._buildLine(key, key, schema, target, isLang);}
}
self.buildOld = function(func) {
if ( !self.V.block ) {
self._buildBasis();}
self.inputs = [];self.wysiwyg = [];self.recbuild([], self.lschema, self.V.cont, true);self.recbuild([], self.schema,  self.V.cont, false);}
self._buildByList = function(bckp, key, target) {
var gval = bckp.group[key];var sval = $AD(bckp.schema,  key, { del: true });var lval = $AD(bckp.lschema, key, { del: true });if ( def(gval) ) {
delete  bckp.group[key];if ( !gval.level || gval.level <= PAGE.level ) {
var group = self._buildGroup(null, PAGE.ld(gval.title), null, target);var newCont = group.V.cont;map(gval.fields, function(field) {
self._buildByList(bckp, field, newCont);});} else {
map(gval.fields, function(field) {
$AD(bckp.schema,  field, { del: true });$AD(bckp.lschema, field, { del: true });});}
}
if ( def(lval) ) {
self.recbuild(parseLS(key), lval, target, true);}
if ( def(sval) ) {
self.recbuild(parseLS(key), sval, target, false);}
}
self.build = function() {
if ( !self.V.block ) {
self._buildBasis();}
self.V.cont.innerHTML = '';self.inputs = [];self.wysiwyg = [];var bckp = {
schema: CO(self.schema),lschema: CO(self.lschema),group: CO(self.group)
};map(self.order, function(key) {
self._buildByList(bckp, key, self.V.cont);});mapO(bckp.lschema, function(v,k) { self._buildByList(bckp, k, self.V.cont); })
mapO(bckp.schema , function(v,k) { self._buildByList(bckp, k, self.V.cont); })
}
self.prepdata = function(func) {
if ( self.prep.length == 0 ) {
func();return 0;}
var q = new EQ(func);map(self.prep, function(model) {
q.add(function(done){ ORM.req(model+':select', done); });});}
self.getLangObj = function() {
if ( self.langPrefix ) {
return self.obj[self.langPrefix][self.lang]||{};}
return self.obj;}
self.setData = function(list) {
var q = new EQ(function(){self._setData(list);});map(self.inputs, function(input) {
q.add(function(done) { input.onset(done); });});}
self._setData = function(list) {
list = list || self.inputs;var selfData = [self.upd, self.lupd[self.lang]||{}];var selfObj  = [self.obj, self.getLangObj()];self.onSetData(self, self.obj);map(list, function(input) {
var chUpd = input.isLang && selfData[1] || selfData[0];var chObj = input.isLang && selfObj[1] || selfObj[0];if ( input.selfInfo ) { input.selfInfo.val = ''; }
if (self.wysiwyg.contains(input)) {
var wys = input._wysiwyg;wys.view();var val = $AD(chUpd, input.selfKey);if ( !def(val) ) { val = $AD(chObj, input.selfKey); }
if ( !def(val) ) { input.val = ''; } else { input.val = val.text; }
wys.edit();wys.onupdate = function(val) {
val = {text:val};val = mergeObjects(val, makeRssFromHtml(val.text));input.C._emitValue(val);}
} else {
var val = $AD(chUpd, input.selfKey);if ( !def(val) ) { val = $AD(chObj, input.selfKey); }
input.val = val;input.validate();}
});}
self.showNew = function(obj) {
var newData = CO(self.data);self.data.objschema(obj, newData);var neditor = new eEditor2(model, type, newData, true);map(self.rewritekeys, function(k) {
neditor[k] = self[k];});neditor.show(obj);return neditor;}
self.show = function(obj) {
self.prepdata(function(){
if ( obj ) {
self._show(obj);} else {
self.getobject(self._show);}
});}
self._show = function(obj) {
if ( self.pop ) { self.hide(); }
self.obj = obj;self.build();if ( obj._hasLang ) {
var lang = ORM.O('lang_'+obj.lang_id );self.lang = lang.name;self.dom.C.setLang(lang.name);}
self.setData();self.pop = POP.drag.showNew(self.dom, null, {
dom: self.editordata.headoptions,isSmall: self.cls.contains('small')
});}
self.getButton = function() {
var btn = self._getButton(self);btn.editorRef = self;return btn;}
self.hide = function() { if ( self.pop ) { self.pop.hide(); delete self.pop; } }
self.clear = function() {
self.upd = {};self.lupd = {};self.hide();}
self._submit = function() {
self._dovalidate(function(){
var upd, lupd;if ( self.langPrefix ) {
upd = mergeObjects({}, self.upd);upd[self.langPrefix] = {};mapO(ORM.model.lang, function(lang) {
upd[self.langPrefix][lang.name] = mergeObjects(self.obj[self.langPrefix][lang.name], self.lupd[lang.name])
});lupd = {};} else {
upd  = self.upd;lupd = self.lupd;}
self.submit(self.obj, upd, lupd, self.clear);});}
self._validate = function(func) {
var q = new EQ(func);map(self.inputs, function(input) {
q.add(input.submitCheck);});}
self._dovalidate = function(func) {
if ( self.validate ) {
self.validate(self, func);} else {
self._validate(func);}
}
self.rewritekeys = parseLS('schema,lschema,defaultObject,group,order,_getButton,getobject,submit,validate,onSetData');self._getButton = function(self) {
var node = cr('div', 'asBtn fa');node.attach(cr('span').VAL('editor'));return node;}
self.getobject = function(func) { self.obj = mergeObjects({}, data.defaultObject); func({}); }
self.submit = function(obj, data, langdata, func){ log(data, langdata); func(); }
self.validate = null;self.onSetData = function(self, obj){}
self._init();}
ED2Q.processors = {
delete: function(editor, data) {
editor._getButton = function(self) {
var node = cr('div', 'asBtn fa');node.attach(SVG.del().attr({class:'svg'}));node.attach(cr('span').VAL(PAGE.ld('delete')));node.onclick = function() {
if ( node.ref ) {
ORM.req(node.ref+':select', function(list) {
if ( list[0] ) {
SYS.confirm([PAGE.ld('delete'),' ',ORM.getVisName(list[0]),'?'].join(''), 'center warning', function() {
ORM.req(node.ref+':delete', function() {
SYS.alert(PAGE.ld('success'),'center green', node.ondelete || ENGINE._auth.reload);})
});}
});}
}
return node;}
},insert: function(editor, data) {
editor.onSetData = function(self, obj) {
if ( editor.V.title ) {
editor.V.title.val = 'Insert '+editor.selfModel;}
}
editor._getButton = function(self) {
var node = cr('div', 'asBtn fa');node.attach(SVG.add2().attr({class:'svg'}));node.attach(cr('span').VAL([PAGE.ld('insert'), editor.selfModel].join(' ')));node.onclick = function() {
var o = CO(editor.defaultObject||{});editor.showNew(o);}
return node;}
editor.submit = function(obj, basedata, langdata, onfinish) {
var q = new EQ(function() {
PROTOCOL.cache.write(function() {
SYS.notify([ORM.getVisName(obj),PAGE.ld('edit'),PAGE.ld('done')].join(' '), 'ok');onfinish();});});ORM.req(editor.selfModel+':insert', basedata, function(list) {
if ( list.length == 0 ) {
SYS.alert('Creation failed!', 'center red');return 0;}
var newitem = list[0];if ( okeys(langdata).length == 0 ) { q.doNext(); }
mapO(langdata, function(data, lang) {
q.add(function(done) {
if ( okeys(data).length == 0 ) {
tm(done);} else {
ORM.req([newitem._bid||newitem._oid,lang,'update'].join(':'), data, done);}
});});});}
},update: function(editor, data) {
editor.onSetData = function(self, obj) {
self.V.title.val = ORM.getVisName(obj);}
editor._getButton = function(self) {
var node = cr('div', 'asBtn fa');node.attach(SVG.edit2().attr({class:'svg'}));node.attach(cr('span').VAL(PAGE.ld('edit')));node.onclick = function() {
if ( this.ref ) {
ORM.req(this.ref+':select', function(list) {
editor.showNew(list[0]);});}
}
return node;}
editor.submit = function(obj, basedata, langdata, onfinish) {
var q = new EQ(function() {
PROTOCOL.cache.write(function() {
SYS.notify([ORM.getVisName(obj),PAGE.ld('edit'),PAGE.ld('done')].join(' '), 'ok');onfinish();});});ORM.req(obj._oid+':update', basedata, function() {
if ( okeys(langdata).length == 0 ) { q.doNext(); }
mapO(langdata, function(data, lang) {
q.add(function(done) {
if ( okeys(data).length == 0 ) {
tm(done);} else {
ORM.req([obj._bid,lang,'update'].join(':'), data, done);}
});});});}
}
}
function prepEditor2(model, types, dataSet) {
map(parseLS(types), function(type) {
var data = CO(dataSet);data.objschema = dataSet.objschema;map(parseLS('inherit,level,schema,lschema,group,order'), function(key) {
var t = data[type+'_'+key];if ( def(t) ) {
data[key] = t;}
});var editor = new eEditor2(model, type, data);if (ED2Q.processors[type]) { ED2Q.processors[type](editor, data);  }
});}
tm(function(){
ED2Q.buildQueue();});window.TABLE2 = {}
ENGINE.tableHistory = parseObj(glob('tbl2History')||'[]');function eTable2(name, data) {
if ( name.contains(',') ) {
map(parseLS(name), function(nm) {
new eTable2(nm, data);});return 0;}
var self   = this;self.model = TABLE2;self.init = function() {
self.data = mergeObjects({
level:200,contAddon:function(self,obj,parent){},filtAddon:function(self, dict){},strs:{},fields:['id'],fieldFunc:{},colCls:{},filter:{},sorter:{},rowGen:function(obj) { return cr('tr'); },cls:'',lineHeight: 25,heightOffset: 100,timeRange: null,model: name,hidden: false
}, data);if ( def(data.prep) && data.level <= PAGE.level ) {
map(parseLS(data.prep), function(model) {
ORM.req(model+':select', new T.F(), {rng:[0,1000]});});}
self._normalise();self.block = null;self.lineNodes = [];self.node = {};self.node.sorter = [];self.node.filter = [];self._perPage = 10;self._loadData();self.edFunc = function(obj, lineManager, fn) {
self.edFuncORM(obj, fn);self.data.contAddon(self, obj, lineManager);};var editors = EDITOR2[self.data.model];if ( editors ) {
self.edFuncORM = function(obj, fn) {
if ( editors.update ) {
var edBtn = editors.update.getButton();edBtn.ref = obj._oid;fn(edBtn);}
if ( editors.delete ) {
var delBtn = editors.delete.getButton();delBtn.ref = obj._oid;delBtn.ondelete = self.rebuild;fn(delBtn);}
}
} else {
var ref = EDITOR[self.data.model];if ( ref ) {
self.edFuncORM = function(obj, fn) {
var delBtn = cr('div', 'asBtn fa');SVG.del(delBtn.cr('div','svg'));fn(delBtn);delBtn.onclick = function() {
var answer = confirm(PAGE.ld('delete')+'?');if ( answer ) {
log(obj._oid);ORM.req(obj._oid+':delete', function() {
SYS.notify(PAGE.ld('done'), 'ok');self.rebuild();});}
}
ref.edit(obj, fn);};} else {
self.edFuncORM = new T.F();}
}
self.lineHeightStr = self.data.lineHeight + 'px';TABLE2[name] = self;}
self._normalise = function() {
self.data.fieldFunc = lsMapToDict(self.data.fieldFunc);self.data.colCls    = lsMapToDict(self.data.colCls);self.data.filter    = lsMapToDict(self.data.filter);}
self._strs    = function(key) { return self.data.strs     [key] || PAGE.ld(key); }
self._colCls  = function(key) { return self.data.colCls   [key] || '';  }
self._getFunc = function(key) { return self.data.fieldFunc[key] || TVIEW.def }
self._getFilt = function(key) { return self.data.filter   [key] || function() { return null; }; }
self._saveData = function() {
if ( self.btnClearFilters ) {
self.btnClearFilters.val = (okeys(self._selectBy).length == 0) && true || false;}
glob('tbl2_'+self.data.model, parseStr({
select : self._selectBy,range  : self._rangeBy,order  : self._orderBy,page   : self._page,hide   : self._hideMap
}));}
self._loadData = function() {
var data = parseObj(glob('tbl2_'+self.data.model)||'[]')
self._selectBy = data.select || {};self._rangeBy  = data.range  || [];self._orderBy  = data.order  || [];self._page     = data.page   || 0;self._hideMap  = data.hide   || [];$P(self, 'selectBy', function()     { tm(CEF(self._saveData)); return self._selectBy; },function(data) { self._selectBy = data; self._saveData(); return self._selectBy; });$P(self, 'rangeBy' , function()     { tm(CEF(self._saveData)); return self._rangeBy;  },function(data) { self._rangeBy  = data; self._saveData(); return self._rangeBy;  });$P(self, 'orderBy' , function()     { tm(CEF(self._saveData)); return self._orderBy;  },function(data) { self._orderBy  = data; self._saveData(); return self._orderBy;  });$P(self, 'page'    , function()     { tm(CEF(self._saveData)); return self._page;     },function(data) { self._page     = data; self._saveData(); return self._page;     });$P(self, 'hideMap' , function()     { tm(CEF(self._saveData)); return self._hideMap;  },function(data) { self._hideMap  = data; self._saveData(); return self._hideMap;  });}
self._getFilter = function() {
var rng = [self._page * self._perPage, self._perPage];var ord = [];if ( self._orderBy.length == 2) { ord = [self._orderBy]; }
var resp = CO({
selector: self._selectBy,order:    ord,rng:      rng
});self.data.filtAddon(self, resp);return resp
}
self._buildFilter = function(field) {
var newNode = self.blockFilters.cr('th');newNode._sel = self._getFilt(field)(self, field);if ( newNode._sel ) {
newNode.addCls('hasSel');newNode.attach(newNode._sel);newNode._sel.chUpd = function() {
if ( def(self.selectBy[field]) ) {
newNode._sel.setVal(self.selectBy[field]);} else {
newNode._sel.resetVal();}
}
newNode._sel.chUpd();self.node.filter.push(newNode);}
}
self._buildSorter = function(field) {
var newNode = self.blockSorters.cr('th');newNode.val = self._strs(field);newNode._field = field;clearEvents(newNode).onclick = function() {
if ( newNode._field == self.orderBy[0] ) {
self.orderBy[1] = !self.orderBy[1];} else {
self.orderBy = [newNode._field, true];}
self.rebuild();}
self.node.sorter.push(newNode);}
self.buildTableZone = function() {
self.btnCols = self.zoneTable.cr('div','asBtn fa left');SVG.menu(self.btnCols.cr('div','svg'));clearEvents(self.btnCols).onclick = function() {
var strs = [];var ind = 0;map(self.data.fields, function(val) {
var newNode = cr('div');newNode.ind = ind;newNode._isActive = !self.hideMap.contains(newNode.ind);newNode.className = 'exch-table-filt-item ' + (newNode._isActive && 'on' || 'off');newNode.VAL( self._strs(val) );strs.push([newNode, function () {
if ( newNode._isActive ) {
self.hideMap.add(newNode.ind);} else {
self.hideMap.remove(newNode.ind);}
self.hideMap = self.hideMap;self.rebuild();}]);ind += 1;});var menu = new OPT(strs);menu.open();}
}
self.buildModelZone = function() {
if ( EDITOR2[self.data.model] ) {
if ( EDITOR2[self.data.model].insert ) {
var btn = EDITOR2[self.data.model].insert.getButton();self.zoneModel.attach(btn);}
} else {
if ( EDITOR[self.data.model] && EDITOR[self.data.model].create ) {
EDITOR[self.data.model].create((CONF.project.insertDefData[self.data.model] || { is_active:true }), function(btn) {
self.zoneModel.attach(btn);});}
}
}
self._buildHead = function() {
self.blockFilters = self.thead.cr('tr', 'filters');self.blockSorters = self.thead.cr('tr');self.zoneTable = self.blockFilters.cr('th', 'manage');self.zoneModel = self.blockSorters.cr('th', 'manage');self.buildTableZone();self.buildModelZone();self.node.sorter = [];self.node.filter = [];map(self.data.fields, function(field) {
self._buildFilter(field);self._buildSorter(field);});}
self._buildBody = function() {}
self._buildPaginator = function() {
self.pbPrev  = self.block.V.header.cr('div', 'asBtn arr prev').VAL(PAGE.ld('prev'));self.pbPages = self.block.V.header.cr('div', 'pageCont');self.pbNext  = self.block.V.header.cr('div', 'asBtn arr next').VAL(PAGE.ld('next'));self.pbtr    = self.block.V.header.cr('div', 'timeRange hidden');SVG.arrLeft.bg(self.pbPrev);SVG.arrRight.bg(self.pbNext);clearEvents(self.pbPrev).onclick = function() {
self.page = Math.max(self.page-1, 0);self.rebuild();return false;}
clearEvents(self.pbNext).onclick = function() {
self.page = Math.min(self.page+1, self.pageCount-1);self.rebuild();return false;}
self.trFrom = cr.calendartimeinput('small', self.pbtr);self.trTo   = cr.calendartimeinput('small', self.pbtr);var clearBlock = self.block.V.header.cr('div','clearFilter left');self.btnClearFilters = cr.bool('sel', clearBlock);clearBlock.cr('div').VAL(PAGE.ld('clear filter'));var refreshBlock = self.block.V.header.cr('div','asBtn clearFilter left').VAL(PAGE.ld('Refresh'));refreshBlock.onclick = function() {
self.rebuild();}
self.btnClearFilters.val = (okeys(self._selectBy).length == 0) && true || false;clearEvents(self.btnClearFilters).onclick = function() {
self.selectBy = {};map(self.node.filter, function(node) { node._sel.chUpd(); });self.rebuild();self.btnClearFilters.val = true;return false;}
self.backBlock = self.block.V.header.cr('a','clearFilter noHref left asBtn');self.fetchPages();}
self.buildBasis = function() {
self.block              = _jO(cr('div', 'jAdminTable'));self.block.V.header     = self.block.cr('div', 'atHead');self.block.V.tableBlock = self.block.cr('div', 'adminTableBlock');self.table              = self.block.V.tableBlock.cr('table', 'adminTable '+self.data.cls);self.thead              = self.table.cr('thead');self.tbody              = self.table.cr('tbody');self._buildPaginator();self._buildHead();self._buildBody();}
self._fetchTR = function() {
if ( self.data.timeRange ) {
self.pbtr.remCls('hidden');} else {
self.pbtr.addCls('hidden');}
}
self._fetchSorter = function() {
map(self.node.sorter, function(node) {
if ( self.orderBy[0] == node._field ) {
if (self.orderBy[1]) {
SVG.arrBottom.bg(node);} else {
SVG.arrTop.bg(node);}
} else {
SVG.clearBg(node);}
});}
self._crPageLink = function(ind) {
self.pagesNodes[ind] = self.pbPages.cr('div','pbPage').VAL((ind+1).toLen());self.pagesNodes[ind]._selfInd = ind;self.pagesNodes[ind].onclick = function() {
self.page = this._selfInd;self.rebuild();}
}
self._crPages = function() {
self.pbPages.innerHTML = '';if ( self.pbPages && self.totalElems ) {
self.pagesNodes = [];var pageCount = Math.ceil(self.totalElems / self._perPage);self.pageCount = pageCount;var pageRng = RNG(pageCount);self._crPageLink(0);if ( self.page > 101) { self._crPageLink(self.page-100); }
pageRng.sl([Math.max(self.page-4, 1),Math.min(self.page+5, pageCount-1)]).each(self._crPageLink);if ( self.page < pageCount - 101 ) { self._crPageLink(self.page+100); }
self._crPageLink(pageCount-1);}
}
self.fetchPages = function() {
self.pagesNodes = [];self._crPages();if ( self.pagesNodes[self.page] ) { self.pagesNodes[self.page].addCls('active'); }
if ( ENGINE.tableHistory.length >= 2 ) {
var mod = ENGINE.tableHistory[ENGINE.tableHistory.length-2];self.backBlock.innerHTML = '';clearEvents(self.backBlock).onclick = function() { TABLE2[mod].show(); }
self.backBlock.cr('div').VAL([PAGE.ld('Back to'),mod].join(' '));} else {
self.backBlock.addCls('hidden');}
}
self.rebuild = function() {
ORM.req([self.data.model,PAGE.lang,'select'].join(':'), function(list, t, fullData) {
self.totalElems = fullData.count;self.fetchPages();self._fetchSorter();self._fetchTR();self._build(self.tbody, list);}, self._getFilter());}
self._build = function(node, list) {
map(self.lineNodes, function(line) {
ORM.event[line._stOid].remove(line._stFunc);detach(line);});self.lineNodes = [];node.innerHTML = '';map(self.data.fields, function(field, pos) {
try {
if ( self.hideMap.contains(pos) ) {
self.node.sorter[pos].addCls('hidden');self.node.filter[pos].addCls('hidden');} else {
self.node.sorter[pos].remCls('hidden');self.node.filter[pos].remCls('hidden');}
} catch(err) {}
});map(list, function(obj) {
node.attach(self.buildLine(obj)); 
});}
self.buildLine = function(obj, noStore) {
var line = self.data.rowGen(obj);self.lineNodes.push(line);if ( !line._hasEvent ) {
self._buildLineContent(obj, line);if (  !noStore ) {
line._stOid = obj._oid;line._stFunc = function(newObj) {
var dummyLine = self.data.rowGen(newObj, true);line.className = dummyLine.className;line.__statusText = dummyLine.__statusText;self._buildLineContent(newObj, line);};ORM.onStore(obj._oid, line._stFunc);}
}
line._hasEvent = true;return line;}
self._buildLineContent = function(obj, line) {
line.innerHTML = '';var man = line.cr('td','manage');self.edFunc(obj, man, function(node) { man.attach(node); });map(self.data.fields, function(field, pos) {
var col = line.cr('td', self._colCls(field));if ( self._hideMap.contains(pos) ) { col.addCls('hidden'); }
var nd = self._getFunc(field)(obj, field);if ( T(nd) == T.S || T(nd) == T.N ) {
col.val = nd;} else {
col.attach(nd);}
if ( !nd._noST ) {
evt(col, 'click', function(ev) {
if ( line.popST() ) {
ev.preventDefault();return false;}
});}
});}
self.getBlock = function() {
if ( !self.block ) {
self.buildBasis();}
return self.block;}
self.show = function(rdata) {
rdata = rdata || {};self.selectBy = mergeObjects(self.selectBy, rdata.selector);POP.table.show(self.getBlock());ENGINE.tableHistory.remove(name);ENGINE.tableHistory.add(name);glob('tbl2History', parseStr(ENGINE.tableHistory));tm(function() {
self._perPage = Math.floor( (EVENT.data.windowSize.y - self.data.heightOffset) / self.data.lineHeight);self.rebuild();});}
self.init();}
window.TVIEW = {};window.TINP = {};window.TSTMenu = {}
TSTMenu.table = function(table, sel, text) {
var infoBlock = clearEvents(cr('a').VAL(PAGE.ld(text||table)));infoBlock.onclick = function() {
TABLE2[table].show({selector:sel});return false;}
return infoBlock;}
TSTMenu.table2 = function(sel, text) {
var txtMap = text.split(/\s*[\{\}]\s*/g);var node = TSTMenu.table(txtMap[1], sel, txtMap[1]);var nNode = cr('span');nNode.cr('span').VAL(PAGE.ld(txtMap[0])+' ');nNode.attach(node);nNode.cr('span').VAL(' '+PAGE.ld(txtMap[2]));return nNode;}
TVIEW.def      = function(       obj, key) { return $AD(obj,key)||''; }
TVIEW.time     = function(       obj, key) { return formatDate($AD(obj,key), true, true, true); }
TVIEW.entity   = function(model, obj, key) { return ORM.getVisName(ORM.O([model, $AD(obj,key)].join('_'))); }
TVIEW.mapper   = function(dict,  obj, key) {
var ans = dict[$AD(obj,key)];if ( def(ans) ) { return ans; }
return '?';}
TVIEW.rel      = function(       obj, key) { var km = key.split('_'); return ORM.getVisName(ORM.rel(obj, km.sl([0,-1]).join('_'))); }
TVIEW.boolReadonly = function(obj, key) {
var newNode = cr.bool().VAL(obj[key]||false);clearEvents(newNode);newNode.addCls('readonly');return newNode;}
TVIEW.bool = function(obj, key) {
var newNode = cr.bool().VAL(obj[key]||false);newNode._noST = true;newNode.onupdate(function(val) {
var nd = {};nd[key] = val;ORM.req(obj._oid+':update',nd, function() {
SYS.notify('updated','ok');});});return newNode;}
TVIEW.link = function(obj, key) {
var link = ['',PAGE.lang,obj._model,obj[key],''].join('/');var node = cr('a').attr({href:link}).VAL('...'+link.sl([-30]));PROCESSOR.dynamicLink.process(node);node._noST = true;return node;}
TVIEW.dec = function(obj, key) {
return (obj[key]||0).toDec();}
TINP.like = function(self, field) {
var block = cr('input').attr({type:'text',required:'true',placeholder:'filter...'});block._doFilter = function() {
var val = block.val;if ( val == '' ) {
delete self.selectBy[field];} else {
self.selectBy[field] = ['like',['%','%'].join(val)];}
self.rebuild();}
block.onkeyup = function(ev) {
if ( ev.keyCode == 13 ) {
block._doFilter();}
}
block.onupdate(block._doFilter);block.setVal = function(val) { block.val = val[1].sl([1,-1]); }
block.resetVal = function() { block.val = ''; }
return block;}
TINP.number = function(self, field) {
var block = cr('input').attr({type:'number',required:'true',placeholder:'filter...'});block._doFilter = function() {
var val = block.val;if ( val == '' ) {
delete self.selectBy[field];} else {
self.selectBy[field] = ['=',parseFloat(val)];}
self.rebuild();}
block.onkeyup = function(ev) {
if ( ev.keyCode == 13 ) {
block._doFilter();}
}
block.onupdate(block._doFilter);block.setVal = function(val) { block.val = val[1]; }
block.resetVal = function() { block.val = ''; }
return block;}
TINP.dropdown = function(self, field, dd) {
dd['None'] = '?';var block = cr.dropdown(dd);block.val = 'None';block.onupdate(function(val) {
if ( val == 'None' ) {
delete self.selectBy[field];} else {
self.selectBy[field] = ['=',val];}
self.rebuild();});block.setVal = function(val) { block.val = val[1]; }
block.resetVal = function() { block.val = 'None'; }
return block;}
TINP.modelDropdown = function(self, field, key) {
return TINP.dropdown(self, field, ORM.getDropdownMap(key));}
TINP.modelJoinDropdown = function(self, field, key, viewKey, kk, vkk) {
kk  = kk  || (key + '_id')
vkk = vkk || (viewKey + '_id');var viewDMap = ORM.getDropdownMap(viewKey);var prep1 = {};var resultDict = {};mapO(ORM.model[key], function(obj) {
prep1[obj[vkk]] = prep1[obj[vkk]] || [];prep1[obj[vkk]].add(obj.id);});mapO(prep1, function(ids, parentId) {
resultDict[ids.join(',')] = viewDMap[parentId];});resultDict['None'] = '?';var block = cr.dropdown(resultDict);block.val = 'None';block.onupdate(function(val) {
if ( val == 'None' ) {
delete self.selectBy[kk];} else {
var rds = val.split(',');var rd = [];map(rds, function(d) { rd.push(parseInt(d)); });if ( rd.length == 1 ) {
self.selectBy[kk] = ['=',rd[0]];} else {
self.selectBy[kk] = ['in',rd];}
}
self.rebuild();});block.setVal = function(val) { block.val = val[1]; }
block.resetVal = function() { block.val = 'None'; }
return block;}
TINP.bool = function(self, field) {
var block = cr.bool3();block.onupdate(function() {
if ( block.val == null ) {
delete self.selectBy[field];} else if ( block.val == true ) {
self.selectBy[field] = ['=',true];} else {
self.selectBy[field] = ['!=',true];}
self.rebuild();})
block.setVal = function(val) { block.val = val[1]; }
block.resetVal = function() { block.val = null; }
return block;}
TINP.rangeTime = function(self, field) {
var block  = cr('div', 'rng time');block.txt1 = block.cr('div');block.txt2 = block.cr('div');block.clearBtn = cr('a','noHref').VAL(PAGE.ld('clear filter'));var info = new ST(block);info.add('info',block.clearBtn);block.clearBtn.onclick = function() {
delete self.selectBy[field];block.resetVal();self.rebuild();}
block.inp1 = cr.calendartime('small', info.addon);block.inp2 = cr.calendartime('small', info.addon);block._fetchTxt = function() {
if ( block.inp1.val ) { block.txt1.val = formatDate(block.inp1.val, true, true); } else { block.txt1.val = '--/--/-- --:--'; }
if ( block.inp2.val ) { block.txt2.val = formatDate(block.inp2.val, true, true); } else { block.txt2.val = '--/--/-- --:--'; }
}
block._doFilter = function() {
var result = [];if ( block.inp1.val ) {
result.splice(0,0, '>',block.inp1.val);}
if ( block.inp2.val ) {
result.splice(0,0, '<',block.inp2.val);}
self.selectBy[field] = result;block._fetchTxt();self.rebuild();}
block.inp1.onupdate(block._doFilter);block.inp2.onupdate(block._doFilter);block.onclick = function() {
block.popST('menu');}
block._setVal = function(val, ind) {
if ( val[ind] ) {
block['inp'+((val[ind] == '>')&&'1'||'2')].val = val[ind+1]||null;}
}
block.setVal = function(val) {
block._setVal(val, 0);block._setVal(val, 2);block._fetchTxt();}
block.resetVal = function() {
block.inp1.val = null;block.inp2.val = null;block._fetchTxt();};return block;}
TINP.rangeNumber = function(self, field) {
var block = cr('div', 'rng');block.inp1 = block.cr('input').attr({type:'number',required:'true',placeholder:'<'});block.inp2 = block.cr('input').attr({type:'number',required:'true',placeholder:'>'});block._doFilter = function() {
var result = [];if ( block.inp1.val ) {
result.splice(0,0, '>',block.inp1.val);}
if ( block.inp2.val ) {
result.splice(0,0, '<',block.inp2.val);}
self.selectBy[field] = result;self.rebuild();}
block.doFilter = function(ev) {
if ( ev.keyCode == 13 ) {
block._doFilter();}
}
block.inp1.onkeyup = block.doFilter;block.inp2.onkeyup = block.doFilter;block.inp1.onupdate(function(){block._doFilter();});block.inp2.onupdate(function(){block._doFilter();});block._setVal = function(val, ind) {
if ( val[ind] ) {
block['inp'+((val[ind] == '>')&&'1'||'2')].val = val[ind+1]||'';}
}
block.setVal = function(val) {
block._setVal(val, 0);block._setVal(val, 2);}
block.resetVal = function() {
block.inp2.val = '';block.inp1.val = '';}
return block;}
TINP.rangeDec = function(self, field) {
var block = TINP.rangeNumber(self, field);block._doFilter = function() {
var result = [];if ( block.inp1.val ) {
result.splice(0,0, '>',block.inp1.val.fromDec());}
if ( block.inp2.val ) {
result.splice(0,0, '<',block.inp2.val.fromDec());}
self.selectBy[field] = result;self.rebuild();}
block._setVal = function(val, ind) {
if ( val[ind] ) {
block['inp'+((val[ind] == '>')&&'1'||'2')].val = val[ind+1].toDec();}
}
return block;}
function createPageRow(func) {
func = func || new T.F();return function(obj) {
var node = cr('tr');var info = new ST(node);info.title = ORM.getVisName(obj);node.addCls('green');if ( !obj.urlpart )     { info.add('fatal', 'no urlpart');     node.addCls('fatal'); }
if ( !obj.title )       { info.add('fatal', 'no title');       node.addCls('fatal'); }
if ( !obj.description ) { info.add('error', 'no description'); node.addCls('red'); }
if ( !obj.keywords || obj.keywords.replace(/\s+/g,'').length == 0 ) {
info.add('error', 'no keywords'); node.addCls('red');} else {
var keys = obj.keywords.split(/\,\s+/g);if ( keys.length < CONF.seo.keywordsLimit[0] ) { info.add('warning', PAGE.ld('to few keywords') +' '+keys.length+'<'+CONF.seo.keywordsLimit[0]); node.addCls('warning'); }
if ( keys.length > CONF.seo.keywordsLimit[1] ) { info.add('warning', PAGE.ld('to many keywords')+' '+keys.length+'>'+CONF.seo.keywordsLimit[1]); node.addCls('warning'); }
}
if ( !obj.views || obj.views == 0 ) { info.add('warning', 'page has no views'); node.addCls('warning'); }
func(obj, node, info);return node;};}
CONF.extend.editManagerRules = lsMapToDict({
def: function(self, func) {
_jO(self);func = func||function(){};var entity = self.D.emr;var crEntity = self.D.emc;var objRef = [entity,self.D.ref].join('_');if ( self.D.st == 'true' && def(TABLE2[entity]) ) {
ORM.prep(objRef, function(obj) {
var node = TABLE2[entity].data.rowGen(obj);if ( node.__statusText ) {
self.attach(node.__statusText.block);}
});}
if ( crEntity && EDITOR2[crEntity] && EDITOR2[crEntity].insert ) {
var ed = EDITOR2[crEntity].insert;var btn = ed.getButton();self.V.createBtn = btn;self.attach(btn);}
if ( entity && EDITOR2[entity] ) {
if ( EDITOR2[entity].update && EDITOR2[entity].update.level <= PAGE.level ) {
var ed = EDITOR2[entity].update;var btn = ed.getButton();btn.ref = objRef;self.V.editBtn = btn;self.attach(btn);}
if ( EDITOR2[entity].delete && EDITOR2[entity].delete.level <= PAGE.level ) {
var ed = EDITOR2[entity].delete;var btn = ed.getButton();btn.ref = objRef;self.V.delBtn = btn;self.attach(btn);}
} else if ( entity && EDITOR[entity] ) {
{
ORM.prep(objRef, function(obj) {
var ld = obj;if ( self.D.st == 'true' && def(TABLE2[self.D.emr]) ) {
var node = TABLE2[self.D.emr].data.rowGen(obj);if ( node.__statusText ) {
self.attach(node.__statusText.block);}
}
EDITOR[entity].edit(obj, function(button) {
self.V.editBtn = button;self.attach(button);});func(self,objRef);if ( crEntity && EDITOR[crEntity] ) {
var reqDict = mergeObjects({}, CONF.project.insertDefData[crEntity]);reqDict[entity+'_id'] = obj.id;EDITOR[crEntity].create(reqDict, function(button) {
self.V.crBtn = button;self.attach(button);})
}
});}
} else if ( crEntity && EDITOR[crEntity] && !(EDITOR2[crEntity] || EDITOR2[crEntity].insert) ) {
EDITOR[crEntity].create({}, function(button) {
self.V.crBtn = button;self.attach(button);})
}
}
});TVIEW.test = function(obj, key) {
return cr('div').VAL(obj[key]);}
CONF.project.editManagerRules = lsMapToDict({
article: function(self) {
CONF.extend.editManagerRules.def(self, function(self,objRef) {
self.V.delBtn = self.cr('div', 'asBtn fa');self.V.delBtn.attach(SVG.del().attr({class:'svg'}));self.V.delBtn.attach(cr('span').VAL(PAGE.ld('delete')));self.V.delBtn.onclick = function() {
var answer = confirm(PAGE.ld('delete')+'?');if ( answer ) {
ORM.req(objRef+':delete', function() {
PROTOCOL.cache.write(function() {
ENGINE.goPage(null, null, null, function() {
ENGINE.goPage(['/','/'].join(PAGE.lang));});});});}
}
});}
});CONF.project.insertDefData = {
user:     { lvl: 20 }
};new eProtocol('directdb', {
prefix: '_handler/directdb/'
}, 'api')
new eProtocol('proxy', {
prefix: '/_handler/proxy/',write: function(self, askUrl,funcOk,funcBad) {
var newurl = PROTOCOL.proxy.data.getUrl(askUrl);getRawData(newurl, function(html) {
self.read(html, funcOk, funcBad);}, funcBad);},read: function(self, resp, funcOk, funcBad) {
if ( resp ) { funcOk(resp); } else { funcBad(resp); }
},getUrl: function(askUrl) {
var urlMap;if ( askUrl.map ) {
urlMap = askUrl;} else {
urlMap = ENGINE.getUrlData(askUrl);}
if ( urlMap.own ) { return urlMap.url; }
var reqData = {
schema : urlMap.map[0],host   : urlMap.map[1],path   : '/'+urlMap.map.sl([2]).join('/')
};var reqStr = ['token='+glob('token')];mapO(reqData, function(v,k) {
reqStr.push([k,v].join('='));});var newurl = PROTOCOL.proxy.data.prefix+'?'+reqStr.join('&');return newurl;}
});PROTOCOL.proxy.getUrl = PROTOCOL.proxy.data.getUrl;new eSubprogram('ormView', function(onfinish) {
var self = this;self.init = function() {
self.ignoreFields   = CONF.object.orm.ignoreFields;self.models         = CONF.object.orm.storedModels;self.view = VIEW.orm();self.V = self.view.V;self.C = self.view.C;self.F = self.view.F;self.updates = {};self.currentOid = null;self.currentRef = null;self.firstRun = true;self.editSessions = {};self.editPosition = {};self.F.newTab('text', 'raw data');self.F.newTab('html');self.F.newTab('dict', 'json');self.F.newTab('src');self.F.setTab('dict');self.ideUpdFunc = function(){};self.V.reqest.onkeyup = function(ev) {
if ( ev.keyCode == 13 ) {
var reqMap = self.V.reqest.val.split(' ');self.doReq(reqMap[0], parseObj(reqMap[1]));}
}
self.V.oid.onkeyup = function(ev) {
if ( ev.keyCode == 13 ) {
self.reqByOid(self.V.oid.val);ORM.req(self.V.oid.val+':', function() {
self.drawObject(ORM.O(self.V.oid.val));})
}
}
ORM.onStore(function(obj) {
self.F.redrawObj(obj);self.C.listObjs[obj._oid].node.onclick = function() {
self.drawObject(obj);}
});self.V.commit.onclick = self.commit;}
self.reqByOid = function(oid) {
ORM.req(oid+':select', function() {
self.drawObject(ORM.O(oid));});}
self.commit = function() {
if ( def(self.currentOid) ) {
self.setUpdates( mergeObjects(self.updates, ORM.O(self.currentRef._oid)) );ORM.req(self.currentOid+':update', self.updates, function() {
self.reqByOid(self.currentOid);});}
}
self.doReq = function(str, data) {
self.V.reqest.val = str;ORM.req(str, data, self.drawObject);self.F.addHistory(str).onclick = function() {
self.doReq(str);};}
self.setUpdates = function(obj) {
map(self.ignoreFields, function(field) {
delete obj[field];})
self.updates = obj;if (Object.keys(self.updates).length > 0 ) {
self.V.commit.addCls('modified');} else {
self.V.commit.remCls('modified');}
return obj;}
self.addUpdate = function(key, val) {
self.updates[key] = val;self.V.commit.addCls('modified');return self.updates;}
self.filterTpl = function(str) {
return str.rp(/<%set.+%>\n?/g, '').rp(/<%/g, '[').rp(/%>/g, ']');}
self.drawSimpleData = function(obj) {
self.C.contItems = [];self.C.contPage.dict.innerHTML = '';self.C.contPage.dict.attach(self._drawObject(obj));self.C.contPage.text.val = parseStr(obj);if ( def(obj.src) ) {
self.C.contPage.html.innerHTML = self.filterTpl(obj.src);} else {
self.C.contPage.html.innerHTML = obj;}
self.F.doFilter();}
self.initIde = function(obj, target) {
var editor = self._editor;if ( !editor ) {
editor = ace.edit(target);editor.setTheme("ace/theme/chrome");editor.getSession().setMode("ace/mode/html");editor.getSession().setUseSoftTabs(true);editor.setFontSize(14);editor.commands.addCommand({
name: 'save',bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},exec: function(editor) {
editor.blur();self.commit();}
});editor.on('blur', function(resp) {
var val = editor.getValue();self.ideUpdFunc(val);});self._editor = editor;}
var session = self.editSessions[obj._oid];if ( !def(session) ) {
session = ace.createEditSession(obj.src, 'ace/mode/html');self.editSessions[obj._oid] = session;session.setUseWorker(false);}
editor.setSession(session);var pos = self.editPosition[obj._oid];if ( def(pos) ) {
editor.gotoLine(pos.row+1, pos.col);} else {
editor.gotoLine(0);}
self.ideUpdFunc = function(val) {
self.editPosition[obj._oid] = editor.selection.getCursor();obj.src = val;self.drawSimpleData(obj);self.addUpdate('src', val);}
self.editor = editor;}
self.drawObject = function(obj, noTabSwitch) {
self.setUpdates(ORM.diff(obj._oid));self.currentOid = obj._oid;self.currentRef = obj;self.drawSimpleData(obj);self.V.oid.val = self.currentOid;if ( def(obj.src) ) {
self.C.tab.src.remCls('hidden');self.initIde(obj, self.C.contPage.src);if ( !noTabSwitch ) {
self.F.setTab('src');}
} else {
self.C.tab.src.addCls('hidden');if ( !noTabSwitch ) {
if ( typeof(obj) == 'string' ) {
self.F.setTab('html');} else if ( typeof(obj) == 'number' ) {
self.F.setTab('text');} else {
self.F.setTab('dict');}
}
}
}
self._inputItem = function(node, obj) {
var line = node.cr('div', 'lineItem');line.inpKey = line.cr('div', 'key withBg').cr('div').attr({
placeholder: 'key',contenteditable: 'true'
});line.inpVal = line.cr('div', 'dataField').attr({
placeholder: 'value',contenteditable: 'true'
});line.inpVal.onkeyup = function(ev) {
if ( !EVENT.data.key.ctrl && ev.keyCode == 13 ) {
if ( ['[]','{}'].contains(line.inpVal.val) ) {
obj[line.inpKey.val] = parseObj(line.inpVal.val);} else {
if ( line.inpVal.val.indexOf('int:') == 0 ) {
obj[line.inpKey.val] = parseInt(line.inpVal.val.sl([4]));} else {
obj[line.inpKey.val] = line.inpVal.val;}
}
self.drawObject(self.currentRef, true);return false;}
}
return line;}
self._dictItem = function(node, data, key, parent) {
var line = node.cr('div', 'lineItem');var isIgnore = ( parent == self.currentRef && self.ignoreFields.contains(key) );var keyNode = line.cr('div', 'key').cr('div').VAL(key);keyNode.selfKey = key;var node = self._drawObject(data, key, isIgnore, parent);node.selfKey = keyNode;if ( def(node) ) {
line.attach(node);node.selfLine = line;if ( isIgnore ) {
line.addCls('ignore');} else {
keyNode.attr({contenteditable:'true'});keyNode.onupdate(function() {
line.addCls('modified');keyNode.selfVal = parent[keyNode.selfKey]||keyNode.selfVal;delete parent[keyNode.selfKey];keyNode.selfKey = keyNode.val;if ( keyNode.val.length > 0 ) {
parent[keyNode.val] = keyNode.selfVal;}
});if ( def(self.updates[key]) ) {
line.addCls('modified');}
}
}
self.C.contItems.push(line);}
self._drawObject = function(obj, key, isIgnore, parent) {
if ( !def(obj) || typeof(obj) == 'string' ) {
var newNode = cr('div', 'dataField string');newNode.VAL(obj);newNode.selfKey = key;if ( !isIgnore ) {
newNode.attr('contenteditable', 'true');newNode.onupdate(function() {
newNode.selfLine.addCls('modified');if ( newNode.val == '{}' || newNode.val == '[]' ) {
parent[key] = parseObj(newNode.val);} else {
parent[key] = newNode.val;}
});}
return newNode;} else if ( typeof(obj) == 'object' ) {
if ( T(obj) == T.A ) {
var node = cr('div', 'list');map(obj, function(data, key) { self._dictItem(node, data, key, obj); });self._inputItem(node, obj);return node;}
var node = cr('div', 'tree');if ( parent && obj._oid ) {
self._dictItem(node, obj._oid, '_oid', obj);} else {
mapO(obj, function(data, key) { self._dictItem(node, data, key, obj); });}
self._inputItem(node, obj);return node;}
var newNode = cr('div', 'dataField').VAL(obj);if ( !isIgnore ) {
newNode.attr('contenteditable', 'true');newNode.onupdate(function() {
newNode.selfLine.addCls('modified');parent[key] = newNode.val*1;});}
return newNode;}
self.prepareEntities = function() {
map(self.models, function(model) {
log(model);ORM.req(model+':select');})
}
self.show = function() {
POP.window.show(self.view);}
self.init();});SYS.fgq = {};new eSubprogram('formGenerator', function(onfinish) {
var self = this;self._buildMap = mergeObjects(lsMapToDict({
'def':          function(type) { return cr('input').attr({type:type});},'float':        function() {
var node = cr('input').attr({type:'text'});$P(node, 'val', function() { return parseFloat(this.value) || 0; }, function(data) { return parseFloat(this.value = data) || 0; });return node;},'div,textarea': function(tag) { return cr(tag); },'bool':         function() { return cr.bool(); },'datetime':     function() { var node =  cr.calendartimeinput(); node.updateOnVal = true; return node; },'esqt':        function() {
var newNode = cr('input');$P(newNode, 'val', function() { return this.value.rp('"',''); }, function(data) {
return this.value = data.rp('"','');});newNode.onupdate(function() { this.val = this.val; });return newNode;},'escq':         function() {
var newNode = cr('textarea');$P(newNode, 'val', function() { return this.value.replace(/\"([^|"]*)\"/g,'“$1”').rp('"',''); }, function(data) {
return this.value = data;});return newNode;},'taglist':      function() {
var newNode = cr('input').attr({type:'text'});newNode.__listVal = [];newNode.__listValProc = function() {
var newData = [];var data = this.value.toLowerCase().split(/[^\wа-яґєії]/g);map(data, function(value) {
var nval = value.rp(/\s+/g,'');if ( nval.length > 1 && !newData.contains(nval) ) { newData.push(nval); }
});this.__listVal = newData;this.value = newData.join(', ');return newData;}
$P(newNode, 'val', function() {
return newNode.__listValProc();}, function(data) {
if ( typeof(data) == 'string' ) {
newNode.value = data;newNode.__listValProc();} else {
newNode.__listVal = data;newNode.value = data.join(', ');}
return newNode.__listVal;});return newNode;},'dec': function() {
var node = cr('input').attr({type:'number'});dispatchOnUpdate(node);$P(node, 'val', function() { return this.value.fromDec();}, function(val) {
this.value = val.toDec();return this.value;});return node;}
}), CONF.project.formGeneratorTypes);self._wysFields  = parseLS('content');self._jsonFields = parseLS('content');self._type = mergeObjects(dlsMapToDict({
'def':          'text','title':        'esqt','image':        'file','displaydate':  'datetime','keywords':     'text','tags' :        'taglist','description':  'escq','intro,headerhtml,footerhtml,tpl_forgot,tpl_confirm,html': 'textarea','isactive,is_active,is_important,is_published,is_permanent': 'bool','id':           'div'
}), dlsMapToDict(CONF.project.formGeneratorFields));self.init = function() {
self.view = VIEW.formGenerator();self.view._jsonFields = self._jsonFields;self.wysiwygs = {};self.V = self.view.V;self.C = self.view.C;self.F = self.view.F;self.B = self.view.B;self.view.V.submit.onclick = function() {
if ( self.view._currentPop ) { self.view._currentPop.hide(); }
var ud = CO(self.view.C.currentUpdate);var ul = CO(self.view.C.currentLangUpdate);self.data.custom(self.updateObj, ud, ul, self);self.onsubmit(ud, ul, self);}
self.setData();}
self.setObj = function(obj) {
if ( typeof(obj) == 'string' ) {
ORM.prep(obj, function(obj) {
self.updateObj = obj;self.view.F.setObj(ORM.normaliseForUpdate(obj));});} else {
self.updateObj = obj;self.view.F.setObj(obj);}
}
self.setData = function(data, obj, todo, model) {
self.data = mergeObjects({
title:     'Form Builder',fields:    [],ldfields:  [],dropdown:  {},cdropdown: {},media:     {},schema:    {},submitStr: 'Submit',onshow:    function(){},custom:    function(){},dom:       cr('div','options'),includeLang: false,langPrefix: null,hideLang:  false
}, data);self.data.fields    = parseLS(self.data.fields);self.data.ldfields  = parseLS(self.data.ldfields);self.C.targetModel = model;if ( self.data.langPrefix ) {
self.data.includeLang = true;self.C.langPrefix = self.data.langPrefix;}
if ( self.data.includeLang ) {
self.C.isLangIncluded = true;}
if ( self.data.hideLang ) {
self.view.addCls('noLang');}
self.build(obj);if ( def(todo) ) {
self.onsubmit = todo;} else {
self.onsubmit = function() {}
}
}
self._buildMediaRow = function(key, node) {
var row = cr('tr');if ( typeof(key) == 'string' ) {
row._key = row.cr('td').VAL(PAGE.ld(key));} else {
row._key = row.cr('td');row._key.attach(key);}
row._val = row.cr('td');row._val.attach(node);return row;}
self.buildMedia = function(data, key) {
data = mergeObjects({
proto: 'image',type: 'image'
}, data);var node = _jO(cr('div', 'line'));node.cr('div', 'key').VAL(PAGE.ld(key));node.V.contNode = node.cr('div', 'jImgForm');node.V.table = node.V.contNode.cr('table');node.V.input = dispatchOnUpdate(cr('input'));node.C.selector = cr('input').attr({type: 'file'});node.C.tagFile = {};node.V.uploadBtn = cr('div', 'asBtn fa').VAL(PAGE.ld('upload'));node.V.uploadBtn.onclick = function() { node.C.selector.click(); }
node.V.strName = cr('div').VAL('noname');node.V.blockSize = cr('div');node.V.blockSize.cr('div').VAL('basic');node.V.strSize = node.V.blockSize.cr('a').VAL('0');ADAPTER.fileSize.process(node.V.strSize);node.V.table.attach(self._buildMediaRow('change', node.V.uploadBtn));node.V.table.attach(self._buildMediaRow(node.V.blockSize, node.V.strName));node.V.minDimsMsg = cr('strong','red right');node.V.uploadBtn.insBefore(node.V.minDimsMsg);var minDims = [0,0];if ( data.proto == 'image' ) {
node.C.tagDom = {};mapO(data.file, function(dims, tag) {
var dimMap = dims.split('x');minDims[0] = Math.max(minDims[0], dimMap[0]);minDims[1] = Math.max(minDims[1], dimMap[1]);var imgNodes = [
cr('div'),cr('img').attr({
width:  dimMap[0],height: dimMap[1]
})
];imgNodes[0].cr('div').VAL(dimMap.sl([0,2]).join('x'));imgNodes.push(imgNodes[0].cr('a'));ADAPTER.fileSize.process(imgNodes[2]);node.V.table.attach(self._buildMediaRow(imgNodes[0], imgNodes[1]));if ( !data.noclick ) {
imgNodes[1].onclick = function() {
if ( node.C.tagFile.basic ) {
var dataUrl = getMediaFileUrl(node.C.tagFile.basic);var name = node.C.tagFile.basic.filename;CROP.crop(dataUrl, dims, function(newUri, newFile) {
PROTOCOL.media.write([node.C.media_id, tag].join('_'), {
file:[newFile, name]
}, node.F.refreshImages);});}
}
}
node.C.tagDom[tag] = imgNodes;})
}
node.V.minDimsMsg.val = [PAGE.ld('min size'),' ',minDims.join('x')].join('');node.F.__recalcSingleSize = function(media_id, dims, tag, q, nFile, nName) {
q.add(function(done) {
resizeImage(nFile, dims, function(dUri, dFile) {
PROTOCOL.media.write([media_id, tag].join('_')+':upload', {file:[dFile,nName]}, function() {
SYS.notify(PAGE.ld('image uploaded'),'ok');done();});});});}
node.F.recalcImages = function(file) {
resizeImage(file, "1920x1080x1", function(nUri, nFile, nName) {
PROTOCOL.media.write(node.C.media_id+'_basic:upload', {file:[nFile,nName]}, function() {
SYS.notify(PAGE.ld('basic image uploaded'),'ok');var q = new EQ(node.F.refreshImages);mapO(data.file, function(dims, tag) {
node.F.__recalcSingleSize(node.C.media_id, dims, tag, q, nFile, nName);})
});});}
node.F.refreshImages = function() {
if (!def(node.C.media_id)) { return 0; }
var val = node.C.media_id;ORM.req('mediafile:select', function(fileList) {
map(fileList, function(mediafile) {
node.C.tagFile[mediafile.tag] = mediafile;if ( def(node.C.tagDom[mediafile.tag])) {
var nodes = node.C.tagDom[mediafile.tag];nodes[1].src = getMediaFileUrl(mediafile);nodes[2].val = mediafile.size;nodes[2].href = getMediaFileUrl(mediafile);nodes[2].attr({download: [mediafile.tag,mediafile.filename].join('_')});}
});if ( node.C.tagFile.basic ) {
node.V.strName.val = node.C.tagFile.basic.filename;node.V.strSize.val = node.C.tagFile.basic.size;node.V.strSize.href = getMediaFileUrl(node.C.tagFile.basic);node.V.strSize.attr({download: 'basic_'+node.C.tagFile.basic.filename});}
}, {
selector: {media_id:['=',val]}
});}
node.C.selector.onchange = function(ev) {
var file = ev.target.files[0];var reader = new FileReader();reader.onloadend = function(ev) {
var dataUri = reader.result;var img = cr('img').attr({src:dataUri});readerGlob.ref.getImageDimetionsCallback(img, function(dims) {
if ( !data.nosizecheck && !CONF.project.disableImageSizeCheck && ( dims.width < minDims[0] || dims.height < minDims[1] ) ) {
SYS.notify(node.V.minDimsMsg.val,'red center');return 0;}
if ( file ) {
if ( node.C.media_id ) {
node.F.recalcImages(file);} else {
ORM.prep('mediatype_'+data.type, function(mediatype) {
ORM.req('media:insert', {mediatype_id:mediatype.id}, function(media) {
node.C.media_id = media[0].id;node.V.input.C._emitUpdated();node.F.recalcImages(file);})
});}
}
});}
reader.onerror = log;reader.readAsDataURL(file);}
$P(node.V.input, 'val', function() { return node.C.media_id; }, function(val) {
if ( val ) {
node.C.media_id = val;node.F.refreshImages();}
})
return node;}
self.buildDropdown = function(field, entity) {
if ( entity.indexOf('DICTVIEW') == 0 ) {
var name = entity.split(':')[1];var node = self.__buildDropdown(field, ORM._copyDictView(name));if (EDITOR[name]) {
node.C._editorCr  = EDITOR[name].create;node.C._editorEd  = EDITOR[name].edit;node.C._editorDel = EDITOR[name].remove;node.V.edits = cr('div', 'editors');insBefore(node.V.edits, node.V.input);node.V.input.oneachstate = function(val) {
node.V.edits.innerHTML = '';var refln = SYS.dictView[name][val] || PAGE;var ref   = [[name,val].join('_'),refln.lang].join(':');if ( EDITOR[name].create ) {
EDITOR[name].create({}, function(btn) {
node.V.edits.attach(btn);}, function(data) {
ORM.getViewDict(name, function() {
node.V.input._data = ORM._copyDictView(name);node.V.input.F.ddBuild();node.V.input.val = node.V.input.val;}, true)
});}
if ( val ) {
ORM.prep(ref, function(obj) {
EDITOR[name].edit(obj, function(btn) {
node.V.edits.attach(btn);}, function(data) {
ORM.getViewDict(name, function() {
node.V.input._data = ORM._copyDictView(name);node.V.input.F.ddBuild();node.V.input.val = node.V.input.val;}, true);});});}
};node.V.input._oneachstate();}
return node;}
var data = {};mapO(ORM.model[entity], function(obj) {
var conf = CONF.project.dropdownName || {};var def = conf.def || ORM.getVisName;data[obj.id] = (conf[obj._model] || def)(obj);});data[null] = '-';return self.__buildDropdown(field, data);}
self.buildCDropdown = function(field, data) {
var fieldMap = field.split('.');field = fieldMap.splice(fieldMap.length-1, 1)[0];var dd = self.__buildDropdown(field, data);dd._prefixes = fieldMap;return dd;}
self.__buildDropdown = function(field, data) {
var node = _jO(cr('div', 'line'));node.C.key = field;node.V.label = node.cr('div','key').VAL(PAGE.ld(field));node.V.input = cr.dropdown(data, null, node);return node;}
self.buildSchema = function(dataObj) {
var node = cr('div');node.onchanged = function() {}
node.getData = function() { return node._getData(node); }
node._getData = function(dom) {
var obj = {};mapO(dom.CH, function(elem, key) {
if ( elem.V ) {
if ( elem.V.input.val ) {
if ( elem._type == 'number'||elem._type == 'money' ) {
obj[key] = parseInt(elem.V.input.val);} else {
obj[key] = elem.V.input.val;}
} else {
if ( elem._type == 'number'||elem._type == 'money'|| elem._type == 'dec' ) {
obj[key] = 0;} else {
obj[key] = '';}
}
} else {
obj[key] = node._getData(elem);}
});return obj;}
node.setData = function(obj) {
node._setData(obj, node);}
node._setData = function(obj, dom) {
obj = obj || {}
mapO(dom.CH, function(elem, key) {
if ( elem.V ) {
if ( !def(obj[key]) ) { obj[key] = ''; }
elem.V.input.val = obj[key];elem.V.input.onupdate(function() {
tm(function(){
node.onchanged(node.getData());});}, true);} else {
obj[key] = obj[key] || {};node._setData(obj[key], elem);}
});}
return self._buildSchema(dataObj, node, node);}
self._buildSchema = function(obj, parent, anchor) {
parent.CH = {};mapLS(obj, function(val, key) {
if ( T(val) == T.O ) {
var keyd = parent.cr('h5').VAL(PAGE.ld('h_'+key, key));var vald = self._buildSchema(val, parent.cr('div', 'group'), anchor);parent.CH[key] = vald;} else if ( T(val) == T.F ) {
var node = _jO(parent.cr('div', 'line'));node._key = key;node._type = 'text';node.V.label = node.cr('div','key').VAL(PAGE.ld('k_'+key,key));node.V.input = self._buildMap.def('text').attr({placeholder:key});node.attach(node.V.input);val(node);parent.CH[key] = node;} else {
var type = val;if ( T(val) == T.S ) { type = parseLS(val); }
var node = _jO(parent.cr('div', 'line'));node._key = key;node._type = type[0];node.V.label = node.cr('div','key').VAL(PAGE.ld('k_'+key,key));node.V.input = (self._buildMap[type[0]] || self._buildMap.def)(type[0], type[1]).attr({placeholder:key});node.attach(node.V.input);parent.CH[key] = node;}
});return parent;}
self._fk = function(field) {
var fieldMap = field.split('.');return fieldMap[fieldMap.length-1];}
self.build = function(obj) {
self.prepareLists(function() {self._build(obj);});}
self._build = function(obj) {
self.view.F.clear();self.view.V.title.val = self.data.title;self.view.V.submit.val = self.data.submitStr;mapDLS(self.data.dropdown, function(field, entity) {
self.view.F.addCont(field, self.buildDropdown(field, entity));});mapO(self.data.cdropdown, function(data, field) {
self.view.F.addCont(self._fk(field), self.buildCDropdown(field, data));});map(self.data.fields, function(field) {
self.view.F.addCont(field, self._buildNode(field, true));});map(self.data.ldfields, function(field) {
self.view.F.addLDCont(field, self._buildNode(field, true));});mapLS(self.data.schema, function(obj, field) {
self.view.F.addSchema(field, self.buildSchema(obj));});if ( okeys(self.data.media).length > 0 ) {
self.view.V.support.cr('h4').VAL(PAGE.ld('Media'));mapLS(self.data.media, function(obj, field) {
self.view.F.addSupport(field, self.buildMedia(obj, field));});}
obj = obj || {};self.setObj(obj);}
self.prepareLists = function(func) {
if ( Object.keys(self.data.dropdown).length == 0 ) {
func();return 0;}
var q = new EQ(func);mapLS(self.data.dropdown, function(field, entity) {
if ( entity.indexOf('DICTVIEW') == 0 ) {
var name = entity.split(':')[1];q.add(function(done) {
ORM.getViewDict(name, done);});} else {
q.add(function(done) {
var key = [entity,PAGE.lang,'select'].join(':');if ( !def(SYS.fgq[key]) ) {
SYS.fgq[key] = [done];ORM.req(key, function() {
map(SYS.fgq[key], function(func) { func(); });SYS.fgq[key] = true;});} else if ( SYS.fgq[key] == true ) {
done();} else {
SYS.fgq[key].push(done);}
});}
});}
self._buildNode = function(field, isWysPossible) {
var type = self._type[field] || self._type.def;var node = _jO(cr('div', 'line'));node.C.key = field;node.V.label = node.cr('div','key').VAL(PAGE.ld(field));if ( isWysPossible && self._wysFields.contains(field) ) {
node.V.input = cr('div');node.attach(node.V.input);wysiwyg(node.V.input, self.data.dom, {is_bb:true});self.wysiwygs[field] = node.V.input._wysiwyg;} else {
node.V.input = (self._buildMap[type[0]] || self._buildMap.def)(type[0]).attr({placeholder:field});node.attach(node.V.input);}
return node;}
self.onsubmit = function(){}
self.show = function() {
POP.drag.showNew(self.view, null, self.data);map(S('textarea', self.view), autoAdjust);self.data.onshow(self);}
self.init();});function makeRssFromHtml(html) {
html = html||'';var result = { image: [] };var t = cr('div');var nhtml = html.replace(/<br ?\/?>/g, '\n').replace(/\n[\n ]+/g, '\n');t.innerHTML = nhtml;nhtml.replace(/\<\!\-\-\%image\:(\d+)\:/g, function(regO, id) {
result.image.add(parseInt(id));});result.rss = t.val;return result;}
new eHtml('orm', '<input type="text" placeholder="oid" class="orm-oid" />\
<input type="text" placeholder="filter" class="orm-list-filter" />\
<div class="orm-list"></div>\
\
<input type="text" placeholder="request" class="orm-req" />\
<div class="orm-menu">\
<input type="text" placeholder="filter" class="orm-cont-filter" />\
<div class="asBtn fa">COMMIT</div>\
<div class="orm-tabs"></div>\
</div>\
<div class="orm-cont"></div>\
<div class="orm-hist"></div>', {
input: 'oid,list_filter,reqest,cont_filter',div: 'list,menu,commit,tabs,cont,hist'
});new eView('orm', {
create: function() {
return HTML.orm(cr('div', 'ormView'));},init: function(block, obj) {
block.C.listItems = [];block.C.contItems = [];block.C.contPage = {};block.C.tab = {};block.C.listObjs = {};block.C.currentTab = null;block.C.histBlock = {};block.F.doFilter = function() {
domSearch(block.C.listItems, block.V.list_filter.val);domSearch(block.C.contItems, block.V.cont_filter.val);}
block.F.newTab = function(key, text) {
block.C.contPage[key] = cr('div');block.C.tab[key] = cr('div', 'fa').VAL(text||key);block.C.tab[key].onclick = function() { block.F.setTab(key); }
block.F.redrawTabs();}
block.F.setTab = function(key) {
if ( def(block.C.currentTab) ) {
block.C.currentTab.remCls('active');}
block.C.currentTab = block.C.tab[key];block.C.currentTab.addCls('active');block.V.cont.innerHTML = '';block.V.cont.attach(block.C.contPage[key]);}
block.F.removeTab = function(key) {
delete block.C.contPage[key];delete block.C.tab[key];block.F.redrawTabs();}
block.F.redrawTabs = function() {
block.V.tabs.innerHTML = '';mapO(block.C.tab, function(tabNode) {
block.V.tabs.attach(tabNode);}, { sort: true });}
block.F.clearTabs = function() {
block.C.contPage = {};block.C.tab = {};block.F.redrawTabs();}
block.F.redrawObj = function(obj) {
block.C.listObjs[obj._oid] = block.C.listObjs[obj._oid]||{};block.C.listObjs[obj._oid].node = cr('div').VAL(obj._oname);block.F.redrawList();}
block.F.redrawList = CEF(function() {
block.V.list.innerHTML = '';block.C.listItems = [];mapO(block.C.listObjs, function(obj) {
block.V.list.attach(obj.node);block.C.listItems.push(obj.node);block.F.doFilter();});}, 1000);block.F.addHistory = function(str) {
var newNode = block.C.histBlock[str]||cr('div').VAL(str);block.C.histBlock[str] = newNode;block.V.hist.attachFirst(newNode);return newNode;}
block.V.list_filter.onkeyup = block.F.doFilter;block.V.cont_filter.onkeyup = block.F.doFilter;}
});new eHtml('formGenerator', '<h2></h2>\
<div></div><hr class="wClear" />\
<div></div><hr class="wClear" />\
<div class="dictCont"></div><hr class="wClear" />\
<div></div><hr class="wClear" />\
<div class="asBtn"></div><hr class="wClear" />\
', {
h2:'title',div:'cont,ldcont,sccont,support,submit'
});new eView('formGenerator', {
create: function(self) {
HTML.formGenerator(self.V.block);self.V = mergeObjects(self.V, self.V.block.V);self.addCls('compact');return self;},init: function(self, obj) {
self._jsonFields = [];self.F.clear = function() {
self.C.cont = {};self.C.ldcont = {};self.C.schema = {};self.C.support = {};self.V.cont.innerHTML = '';self.V.ldcont.innerHTML = '';self.V.sccont.innerHTML = '';}
self.F.clear();self.F.addCont = function(field, node) {
self.V.cont.attach(node);self.C.cont[field] = node;}
self.F.addSupport = function(field, node) {
self.V.support.attach(node);self.C.support[field] = node;}
self.F.addLDCont = function(field, node) {
self.V.ldcont.attach(node);self.C.ldcont[field] = node;}
self.F.addSchema = function(field, node) {
node.attachFirst(cr('h4').VAL(PAGE.ld('h_'+field, field)));self.V.sccont.attach(node);self.C.schema[field] = node;}
self.F.prefixedRetrieve = function(obj, node, key) {
if ( node._prefixes ) {
map(node._prefixes, function(prefix) {
var newobj = obj[prefix];if ( !def(newobj) ) { return false; }
obj = newobj;});}
return obj[key]||'';}
self.F.prefixedUpdate = function(obj, node, key, val) {
var orig = self.C.currentObj;if ( node._prefixes ) {
map(node._prefixes, function(prefix) {
orig[prefix] = orig[prefix] || {};obj[prefix]  = mergeObjects(orig[prefix], obj[prefix]);obj          = obj[prefix];orig         = orig[prefix];});}
obj[key] = val;}
self.F.setObj = function(obj) {
self.C.currentObj = obj;self.C.currentUpdate = {};self.C.currentLangUpdate = {};function iterCont(dataObj) {
mapO(dataObj, function(node, key) {
var curData = self.F.prefixedRetrieve(obj, node, key);if ( self._jsonFields.contains(key) ) {
if ( def(obj[key]) && def(obj[key].text) ) {
curData = curData.text;} else {
curData = '';}
node.V.input.__isJson = true;}
node.V.input.val = curData;if (node.V.input._wysiwyg ) {
node.V.input._wysiwyg.edit();node.V.input._wysiwyg.onupdate = function(val) {
if ( node.V.input.__isJson ) {
val = {text:val};val = mergeObjects(val, makeRssFromHtml(val.text));}
self.F.prefixedUpdate(self.C.currentUpdate, node, key, val);};} else {
node.V.input.onupdate(function(val) {
if ( node.V.input.__isJson ) {
val = {text:val};val = mergeObjects(val, makeRssFromHtml(val.text));}
self.F.prefixedUpdate(self.C.currentUpdate, node, key, val);}, true);}
});}
iterCont(self.C.cont);iterCont(self.C.support);mapO(self.C.schema, function(node, key) {
node.onchanged = function(val) {
var mFrom = mergeObjects(obj[key], self.C.currentUpdate[key]);self.C.currentUpdate[key] = mergeObjects(mFrom, val);};node.setData(obj[key]);});self.F.setLang();}
self.F.setLang = function() {
var obj = self.C.currentObj;var langObj = self.C.currentLang;if ( !def(obj) ) { return 0; }
if ( self.C.isLangIncluded ) {
if ( self.C.langPrefix ) {
self.F._setLang((obj[self.C.langPrefix]||{})[langObj.name]||{});return 0;}
self.F._setLang(obj[langObj.name]);return 0;}
if ( !def(obj._bid) ) {
self.F._setLang();return 0;}
ORM.prep([obj._bid, langObj.name].join(':'), self.F._setLang);}
self.C._savedObj = {};self.F._setLang = function(obj) {
var langObj = self.C.currentLang;if ( !def(obj) ) {
obj = self.C._savedObj[langObj.name]||(self.C._savedObj[langObj.name] = {});}
self.C.currentLangUpdate[langObj.name] = self.C.currentLangUpdate[langObj.name] || {};mapO(self.C.ldcont, function(node, key) {
var curData = obj[key] || '';if ( self._jsonFields.contains(key) ) {
if ( def(obj[key]) && def(obj[key].text) ) {
curData = obj[key].text;} else {
curData = '';}
node.V.input.__isJson = true;}
node.V.input.val = curData;if (node.V.input._wysiwyg ) {
node.V.input._wysiwyg.view();node.V.input.val = curData;node.V.input._wysiwyg.edit();node.V.input._wysiwyg.onupdate = function(val) {
if ( node.V.input.__isJson ) {
val = {text:val};val = mergeObjects(val, makeRssFromHtml(val.text));}
obj[key] = val;self.C.currentLangUpdate[langObj.name][key] = val;};} else {
node.V.input.onupdate(function() {
var val = node.V.input.val;if ( node.V.input.__isJson ) {
val = {text:val};val = mergeObjects(val, makeRssFromHtml(val.text));}
obj[key] = val;self.C.currentLangUpdate[langObj.name][key] = val;}, true);}
});}
self.C.onLang = self.F.setLang;}
}, 'langMenu');new eHtml('adminMenu','<div class="openBtn fBtn fa pr_svg" data-svg="arrRight"></div>\
<div class="fBtn fa pr_svg" data-svg="edit2"></div>\
<div class="fBtn fa pr_svg" data-svg="views"></div>\
<div class="amenu fa">\
<div class="menus">\
<h4>Menu</h4>\
</div>\
<div class="menus tables">\
<h4>Tables</h4>\
</div>\
<div class="menus roles hidden">\
<h4>Roles</h4>\
<div class="asBtn fa">Admin</div>\
<div class="asBtn fa">User</div>\
</div>\
</div>', {
'.fBtn':'switcher,editBtn,purgeBtn','.menu':'block','.menus':'menuBlock,tableBlock','.roles':'rolesBlock','.asBtn':'roleAdmin,roleUser','.tables':'tables'
});new eView('adminMenu', {
create: function() { return HTML.adminMenu(cr('div', 'adminMenu')); },init: function(self, obj) {
self.C.opened = false;self.C.toclose = false;self.F.open = function() {
if ( !self.C.opened ) {
self.addCls('active');self.C.opened = true;EVENT.click.add(self.F.closeEvt);}
}
self.F.closeEvt = function() {
self.C.toclose = true;tm(self.F.close, 10);}
self.F.close = function() {
if ( self.C.opened && self.C.toclose ) {
self.remCls('active');self.C.opened = false;EVENT.click.remove(self.F.closeEvt);}
}
self.V.switcher.onclick = self.F.open;self.onclick = function() {
tm(function() {
self.C.toclose = false;});}
mapO(TABLE2, function(obj, model) {
if ( !obj.data.hidden ) {
if ( PAGE.level >= obj.data.level ) {
self.V.tables.cr('div', 'asBtn fa').VAL(PAGE.ld(model)).onclick = function() { obj.show(); };}
}
}, {sort:true})
if ( okeys(ENGINE.menu).length == 0 ) {
self.V.menuBlock.detach();} else {
mapO(ENGINE.menu, function(menu, name) {
self.V.menuBlock.cr('div', 'asBtn fa').VAL(PAGE.ld(name)).onclick = function() { menu.show(); };}, {sort:true});}
self.F.btnOn = function(btn) {
self.V[btn].addCls('active');}
self.F.btnOff = function(btn) {
self.V[btn].remCls('active');}
self.V.editBtn.onclick;self.V.purgeBtn.onclick = function() {
PROTOCOL.cache.write(function() {
tm(function() {
window.location.reload();}, 100);});}
}
});new ePop('table', 'popTable');{
var rules = lsMapToDict( mergeObjects(CONF.extend.editManagerRules, CONF.project.editManagerRules) );new eProcessor('editManager', {
process: function(self, db) {
tm(function(){
db._process(self, db);}, 2);},_process: function(self, db) {
_jO(self);var lvl = self.D.l || 100;if ( PAGE.level >= lvl ) {
if ( def(rules[self.D.emr]) ) {
tm(function(){ rules[self.D.emr](self); });} else {
tm(function(){ rules.def(self); });}
} else {
self.addCls('hidden');}
}
});}
new eProcessor('langContent', {
process: function(self, db) {
SYS.langContents.add(_jO(self));self.C.staticList = S('.mk_lcstatic', self);self.C.editing = false;self.F.editStart = function() {
self.C.editing = true;ORM.req(['langcontent_',self.D.lcname,':select'].join(''), function() {
map(self.C.staticList, detach);wysiwyg(self);self._wysiwyg.onupdate = function(val) {
var obj = ORM.O('langcontent_'+self.D.lcname);obj.langdata[PAGE.lang] = val;ORM.req(obj._oid+':update', ORM.normaliseForUpdate(obj), log );};self._wysiwyg.edit();});}
self.F.editFinish = function() {
self.C.editing = false;if ( self._wysiwyg ) {
self._wysiwyg.view();}
map(self.C.staticList, function(node) {
self.attach(node);});}
}
});PROCESSOR.langContent.edit = function() {
map(SYS.langContents, function(elem) {
elem.F.editStart();});}
PROCESSOR.langContent.view = function() {
map(SYS.langContents, function(elem) {
elem.F.editFinish();});}
PROCESSOR.langContent.clear = function() {
PROCESSOR.langContent.view();SYS.langContents = [];};SYS.langContents = [];ENGINE._clear.add(PROCESSOR.langContent.clear);new eProcessor('editable', {
process: function(self, db) {
tm(function() {
db._process(self, db);});},_process: function(self, db) {
SYS.editables.push(_jO(self));self.C.edList = S('.mk_ed', self);self.C.editing = false;self.C.staticList = [];map(self.C.edList, _jO);self.F.editStart = function() {
self.C.editing = true;ORM.req(self.D.edref+':select', function() {
var obj = ORM.O(self.D.edref);map(self.C.edList, function(node) {
node._staticList = S('.mk_lcstatic', node);map(node._staticList, detach);(db[node.D.edtype]||db.plain)[0](self, db, node, obj);});});}
self.F.editFinish = function() {
self.C.editing = false;map(self.C.edList, function(node) {
(db[node.D.edtype]||db.plain)[1](self, db, node);if ( node._staticList ) {
map(node._staticList, function(st) {
node.attach(st);});}
});}
},todoonfinish: function() {
PROTOCOL.cache.write();},plain: [function(self, db, node, obj) {
node.setView('textarea', 'editing', function(val) {
obj.langdata[PAGE.lang][node.D.edfield] = val;ORM.req(self.D.edref+':update', ORM.normaliseForUpdate(obj), db.todoonfinish );});autoAdjust(node.V.viewNode);},function(self, db, node) {
if ( node.V.viewNode ) { node.setView(); }
}],rich: [function(self, db, node, obj) {
wysiwyg(node);node._wysiwyg.onupdate = function(val) {
obj.langdata[PAGE.lang][node.D.edfield] = node.V.viewNode.innerHTML;ORM.req(self.D.edref+':update', ORM.normaliseForUpdate(obj), db.todoonfinish );}
node._wysiwyg.edit();},function(self, db, node) {
if ( node._wysiwyg ) { node._wysiwyg.view(); }
}],html: [function(self, db, node, obj) {
node.setView('textarea', 'editing', function(val) {
obj.langdata[PAGE.lang][node.D.edfield] = val;ORM.req(self.D.edref+':update', ORM.normaliseForUpdate(obj), db.todoonfinish );});node.V.viewNode.val = obj.langdata[PAGE.lang][node.D.edfield]||'';autoAdjust(node.V.viewNode);},function(self, db, node) {
if ( node.V.viewNode ) {
var html = node.V.viewNode.val;node.setView();node.innerHTML = html;}
}]
});PROCESSOR.editable.edit = function() {
map(SYS.editables, function(elem) {
elem.F.editStart();});}
PROCESSOR.editable.view = function() {
map(SYS.editables, function(elem) {
elem.F.editFinish();});}
PROCESSOR.editable.clear = function() {
PROCESSOR.editable.view();SYS.editables = [];};SYS.editables = [];ENGINE._clear.add(PROCESSOR.editable.clear);var EXTP = new eScenario('extp', { initialRun: true });PAGE.run();EXTP.addAction('init_admin', function(link, self, done) {
if ( PAGE.level >= 200 ) {
ORMVIEW = new SUBPROGRAM.ormView();if ( PAGE.level >= 250 ) {
ORMVIEW.prepareEntities();}
EVENT.keyup.add(function(ev) {
if ( EVENT.data.key.alt && EVENT.data.key.shift ) {
if ( ev.keyCode == 186 ) { ORMVIEW.show(); }
}
});SYS._edit = false;SYS._editInitial = true;SYS.ADMINMENU = VIEW.adminMenu();$P(SYS, 'edit', function() { return SYS._edit; },function(data) {
if ( data ) {
if ( SYS._editInitial || !SYS._edit ) {
SYS.ADMINMENU.F.btnOn('editBtn');PROCESSOR.langContent.edit();PROCESSOR.editable.edit();SYS._edit = true;}
} else {
if ( SYS._edit ) {
SYS.ADMINMENU.F.btnOff('editBtn');PROCESSOR.langContent.view();PROCESSOR.editable.view();SYS._edit = false;}
}
SYS._editInitial = false;SYS._edit = data;});SYS.ADMINMENU.V.editBtn.onclick = function() { SYS.edit = !SYS._edit; }
SYS.edit = SYS._edit;document.body.attach(SYS.ADMINMENU);}
done();}, { autoRun: 'init' });