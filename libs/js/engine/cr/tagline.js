cr.tagline = function(cls, parent) {
    var node = dispatchOnUpdate(_jO(cr('div', 'jTagline '+(cls||''), parent)));
    node.V.inp = node.cr('div','inp').attr({contenteditable: true});
    node.cr('hr','wClear');
    node.C.tagb = [];
    node.__listVal = [];
    node.clickInt = null;
    node.state = '';
    
    node.F.upd = CEF(f(){ node.C._emitUpdated(node.val); });
    
    node.F.newtag = f(name) {
        node.__listVal.add(name);
        var newNode = cr('div','tagb').VAL(name);
        newNode.cbtn = newNode.cr('div','cbtn');
        SVG.close(newNode.cbtn);
        newNode.cbtn.selfName = name;
        newNode.onclick = f() {
            tm(f(){
                clearInterval(node.clickInt);
            });
        }
        newNode.cbtn.onclick = f() {
            node.__listVal.remove(this.selfName);
            node.__listValProc();
        }
        node.C.tagb.push(newNode);
        insBefore(newNode,node.V.inp);
        node.F.upd();
    }
    
    
    node.__listValProc = function() {
        var newData = CO(node.__listVal);
        var data = node.V.inp.textContent.toLowerCase().split(/[^\wа-яґєії]/g);
        map(data, function(value) {
            var nval = value.rp(/\s+/g,'');
            if ( nval.length > 1 && !newData.contains(nval) ) { newData.push(nval); }
        });
        node.__listVal = newData;
        node.V.inp.textContent = '';
        
        var testState = parseStr(newData);
        if ( testState != node.state ) {
            map(node.C.tagb, detach);
            map(newData, node.F.newtag);
            node.state = testState
        }
        
        return newData;
    }
    
    $P(node, 'val', function() {
        return node.__listValProc();
    }, function(data) {
        if ( !def(data) ) { data = ''; }
        
        if ( typeof(data) == 'string' ) {
            node.__listVal = [];
            node.V.inp.textContent = data;
            node.__listValProc();
        } else {
            node.__listVal = data;
            node.__listValProc();
        }
        
        return node.__listVal;
    });
    
    node.onclick = f() {
        node.clickInt = tm(f() {
            node.V.inp.focus();
        }, 5);
    }
    
    node.C.keys = [13,32];
    node.dellocked = false;
    node.V.inp.onkeydown = f(ev) {
        if ( ev.keyCode == 8 ) {
            if ( !node.dellocked && node.V.inp.textContent.length == 0 && node.__listVal.length > 0 ) {
                node.__listVal.pop();
                node.__listValProc();
            } else {
                node.dellocked = true;
            }
        } else if ( node.C.keys.contains(ev.keyCode) ) {
            node.__listValProc();
        }
    }
    node.V.inp.onkeyup = f(ev) {
        node.dellocked = false;
    }
    
    evt(node.V.inp, 'blur', node.__listValProc);
    
    return node;
}


