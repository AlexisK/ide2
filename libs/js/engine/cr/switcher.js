cr.switcher = function(data, cls, parent) {
    data = data || {true:'Yes',false:'No'};
    var node = cr('div', 'jSwitch fa '+cls||'', parent);
    dispatchOnUpdate(node);
    
    node._swNode = node.cr('div', 'vfa');
    node.states = {};
    
    mapO(data, f(str,val) {
        var newNode = node._swNode.cr('div').VAL(str);
        newNode._selfVal = val;
        node.states[val] = newNode;
    });
    
    node._keys = okeys(node.states);
    node._state = node._keys[0];
    
    node.F.setVal = f(val) {
        val = val || node._state;
        if ( node.states[val] ) {
            node._state = val;
            node._swNode.style.marginLeft = node._keys.indexOf(val) * -node.offsetWidth + 'px';
        }
        return node._state;
    }
    
    $P(node, 'val', function() { return node._state; }, function(data) {
        return node.F.setVal(data);
    });
    
    
    clearEvents(node).onclick = function() {
        var nInd = node._keys.indexOf(node._state)+1;
        
        if ( !node._keys[nInd] ) { nInd = 0; }
        
        node._state = node._keys[nInd];
        node.F.setVal();
        node.C._emitUpdated();
        return false;
    }
    
    return node;
}


