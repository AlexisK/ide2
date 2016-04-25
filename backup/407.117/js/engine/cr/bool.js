cr.bool = function(cls, parent) {
    var node = cr('div', 'jBool fa '+cls||'', parent);
    node._txt = node.cr('span','hidden').VAL('0 No Fail');
    dispatchOnUpdate(node);
    
    node._swNode = node.cr('div', 'vfa');
    node._state = false;
    $P(node, 'val', function() { return node._state; }, function(data) {
        if ( data ) {
            node.addCls('active');
            node._txt.VAL('1 Yes Ok');
        } else {
            node.remCls('active');
            node._txt.VAL('0 No Fail');
        }
        node._state = data;
        node.C._emitUpdated();
        return node._state;
    });
    
    
    clearEvents(node).onclick = function() {
        node.val = !node.val;
        return false;
    }
    
    return node;
}














cr.bool3 = function(cls,parent) {
    var node = cr('div', 'jBool 3pos inactive fa '+cls||'', parent);
    node._txt = node.cr('span','hidden').VAL('0 No Fail');
    dispatchOnUpdate(node);
    
    node._swNode = node.cr('div', 'vfa');
    node._state = null;
    $P(node, 'val', function() { return node._state; }, function(data) {
        if ( data == true ) {
            node.addCls('active');
            node.remCls('inactive');
            node._txt.VAL('1 Yes Ok');
        } else if ( data == false ) {
            node.remCls('active');
            node.remCls('inactive');
            node._txt.VAL('0 No Fail');
        } else {
            node.remCls('active');
            node.addCls('inactive');
            node._txt.VAL('');
        }
        node._state = data;
        node.C._emitUpdated();
        return node._state;
    });
    
    clearEvents(node).onclick = function() {
        if ( node._state == true ) {
            node.val = false;
        } else if ( node._state == false ) {
            node.val = null;
        } else {
            node.val = true;
        }
        return false;
    }
    
    return node;
}


