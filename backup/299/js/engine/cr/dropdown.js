cr.dropdown = function(data, cls, parent, params) {
    params = params || {};
    params.limit = params.limit || 0;
    
    var node = _jO(cr('div', 'jDropdown '+cls, parent));
    dispatchOnUpdate(node);
    node._data = data;
    node._ddHead = node.cr('div', 'jHead');
    node._ddBody = node.cr('div', 'jBody');
    node._ddFilt = node.cr('input', 'jFilt').attr({type:'text'});
    
    node._ddnodes    = {};
    node._ddnodeList = [];
    node._state      = null;
    
    node.C._updData = null;
    node.C._updFunc = [];
    
    node._ddOpened = false;
    node._curResults = [];
    
    node._ddHead.onclick = function() {
        node._ddFilt.focus();
    }
    
    
    node.directSelect = function() {}
    node.oneachstate = function() {}
    node._oneachstate = function() {
        node.oneachstate(node._state);
    }
    
    
    
    node.F.ddopen  = function() {
        node.addCls('active');
        node._ddHead.val = '';
        //-node._ddHead.attr({placeholder:PAGE.ld('filter')});
        //-node._ddHead.attr({contenteditable:true});
        node._ddFilt.val = '';
        
        node._curResults = domSearch(node._ddnodeList, node._ddFilt.val, null, null, {limit:params.limit,reqValue:params.limit});
        
        node._ddOpened = true;
        
        //-node._ddHead.focus();
        node._ddFilt.focus();
        
        //-closeOnClick(node,null,f() {
        //-    node.F.ddclose();
        //-    if ( node._curResults.length == 1) {
        //-        node._curResults[0].click();
        //-    }
        //-});
    }
    node.F.ddclose = function() {
        node.remCls('active');
        //-node._ddHead.remattr('contenteditable');
        
        node._ddFilt.val = '';
        if ( node._ddnodes[node._state] ) {
            node._ddHead.innerHTML = '';
            node._ddHead.attach(node._ddnodes[node._state].cloneNode(true));
        } else {
            node._ddHead.val = '';
        }
        node._ddOpened = false;
    }
    
    
    node._ddFilt.onkeyup = function(ev) {
        if ( ev.keyCode == 13 ) {
            if ( node._curResults.length > 0 ) {
                node._curResults[0].clickOn();
            }
            return false;
        } else {
            node._curResults = domSearch(node._ddnodeList, node._ddFilt.val, null, null, {limit:params.limit,reqValue:params.limit});
        }
    }
    
    
    
    node.F.ddBuild = function() {
        node._ddnodeList = [];
        node._ddnodes = {};
        node._ddBody.innerHTML = '';
        
        var iterf = mapO;
        if ( T(node._data) == T.A ) {
            iterf = map;
        }
        
        iterf(node._data, function(val, key) {
            var btn = node._ddBody.cr('div', 'asBtn fa')
            
            if ( typeof(val) == 'string' || typeof(val) == 'number' ) {
                btn.VAL(val);
            } else {
                btn.attach(val);
            }
            
            node._ddnodes[key] = btn;
            node._ddnodeList.push(btn);
            btn.selfKey = key;
            btn.clickOn = function() {
                //-node.F.ddclose();
                node._ddFilt.blur();
                
                node.val = this.selfKey;
                node.C._emitUpdated();
                node.directSelect(node.val);
            }
            btn.onmousedown = btn.clickOn;
        });
        node._oneachstate();
    }
    
    $P(node, 'val', function() { return node._state; }, function(data) {
        
        if ( data === true ) { data = 'True'; } else if ( data === false ) { data = 'False'; }
        
        if ( node._ddnodes[data] ) {
            node._ddHead.innerHTML = '';
            node._ddHead.attach(node._ddnodes[data].cloneNode(true));
            //-node._ddHead.val = node._ddnodes[data].val;
            
            if ( this.C._updData != data ) {
                node.C._updFunc.map(function(func) {
                    func(data);
                });
            }
            
            node._state = data;
            
            if ( node._state && node._state != 'None' ) { node.addCls('selected'); } else { node.remCls('selected'); }
            
            node._oneachstate();
            return node._state;
        }
        
        node._ddHead.val = '';
        node._state = null;
        node._oneachstate();
        return node._state;
    });
    
    //-evt(node._ddHead, 'click', function() {
    //-    if ( node._ddOpened ) { node.F.ddclose(); } else { node.F.ddopen(); }
    //-});
    //-evt(node._ddHead, 'blur', function() {
    //-    node.F.ddclose();
    //-    
    //-    if ( node._curResults.length == 1) {
    //-        node._curResults[0].click();
    //-    }
    //-});
    evt(node._ddFilt, 'focus', function() { node.F.ddopen(); });
    evt(node._ddFilt, 'blur', function() {
        node.F.ddclose();
        if ( node._curResults.length == 1) {
            node._curResults[0].clickOn();
        }
    });
    node.F.ddBuild();
    
    
    return node;
}
