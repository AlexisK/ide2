self.buildSchema = function(dataObj) {
    var node = cr('div');
    
    node.onchanged = function() {}
    
    node.getData = function() { return node._getData(node); }
    node._getData = function(dom) {
        var obj = {};
        
        mapO(dom.CH, function(elem, key) {
            if ( elem.V ) {
                if ( elem.V.input.val ) {
                    if ( elem._type == 'number'||elem._type == 'money' ) {
                        obj[key] = parseInt(elem.V.input.val);
                    } else {
                        obj[key] = elem.V.input.val;
                    }
                } else {
                    if ( elem._type == 'number'||elem._type == 'money'|| elem._type == 'dec' ) {
                        obj[key] = 0;
                    } else {
                        obj[key] = '';
                    }
                }
            } else {
                obj[key] = node._getData(elem);
            }
        });
        return obj;
    }
    
    node.setData = function(obj) {
        node._setData(obj, node);
    }
    node._setData = function(obj, dom) {
        obj = obj || {}
        mapO(dom.CH, function(elem, key) {
            
            if ( elem.V ) {
                if ( !def(obj[key]) ) { obj[key] = ''; }
                elem.V.input.val = obj[key];
                elem.V.input.onupdate(function() { node.onchanged(node.getData()); }, true);
            } else {
                obj[key] = obj[key] || {};
                node._setData(obj[key], elem);
            }
            
        });
    }
    
    return self._buildSchema(dataObj, node, node);
}

self._buildSchema = function(obj, parent, anchor) {
    parent.CH = {};
    
    mapLS(obj, function(val, key) {
        if ( T(val) == T.O ) {
            var keyd = parent.cr('h5').VAL(PAGE.ld('h_'+key, key));
            var vald = self._buildSchema(val, parent.cr('div', 'group'), anchor);
            parent.CH[key] = vald;
        } else if ( T(val) == T.F ) {
            var node = _jO(parent.cr('div', 'line'));
            node._key = key;
            node._type = 'text';
            node.V.label = node.cr('div','key').VAL(PAGE.ld('k_'+key,key));
            node.V.input = self._buildMap.def('text').attr({placeholder:key});
            node.attach(node.V.input);
            
            val(node);
            
            parent.CH[key] = node;
        } else {
            var type = val;
            
            if ( T(val) == T.S ) { type = parseLS(val); }
            
            var node = _jO(parent.cr('div', 'line'));
            node._key = key;
            node._type = type[0];
            node.V.label = node.cr('div','key').VAL(PAGE.ld('k_'+key,key));
            node.V.input = (self._buildMap[type[0]] || self._buildMap.def)(type[0], type[1]).attr({placeholder:key});
            node.attach(node.V.input);
            
            parent.CH[key] = node;
        }
    });
    
    return parent;
}















