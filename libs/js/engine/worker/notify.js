

SYS.notArea = cr('div','notify-area');
tm(function() {
    document.body.attach(SYS.notArea);
});


SYS.bareNotifyObj = f(str, cls) {
    var newNode = SYS.notArea.cr('div','notify fa closed '+cls);
    var t = T(str);
    
    if ( t == T.S || t == T.N ) {
        newNode.val = str;
    } else {
        newNode.attach(str);
    }
    
    newNode._close = function() {
        newNode.addCls('closed');
        tm(function() {
            newNode.detach();
        }, %animationCss)
    }
    tm(function() { newNode.remCls('closed'); }, 10);
    
    return newNode;
}

SYS.notify = function(str, cls) {
    cls = cls || 'def';
    var conf = CONF.engine.notify.timeout;
    
    var newNode = SYS.bareNotifyObj(str, cls);
    
    tm( newNode._close, (conf[cls]||conf.def));
    newNode.onclick = newNode._close;
    
}
SYS.success = f(str) { SYS.notify([PAGE.ld('Success'),PAGE.ld(str)].join(' '),'center green'); }
SYS.fail    = f(str) { SYS.notify([PAGE.ld('Fail'),   PAGE.ld(str)].join(' '),'center red'); }
SYS.error   = f(str) { SYS.notify([PAGE.ld('Error'),  PAGE.ld(str)].join(' '),'center red'); }


SYS.confirm = function(str, cls, func) {
    if ( T(cls) == T.F ) {
        func = cls;
        cls = 'def';
    }
    cls = cls || 'def';
    func = func || f(){};
    
    var newNode = SYS.bareNotifyObj(str, cls);
    
    var optsNode = newNode.cr('div','opts');
    var bPos = optsNode.cr('div','asBtn half first' ).VAL(PAGE.ld('Ok'));
    var bNeg = optsNode.cr('div','asBtn half second').VAL(PAGE.ld('Cancel'));
    
    bPos.onclick = f() { func(); newNode._close(); }
    bNeg.onclick = newNode._close;
}

SYS.alert = function(str, cls, func) {
    if ( T(cls) == T.F ) {
        func = cls;
        cls = 'def';
    }
    cls = cls || 'def';
    func = func || f(){};
    
    var newNode = SYS.bareNotifyObj(str, cls);
    
    var optsNode = newNode.cr('div','opts');
    var bPos = optsNode.cr('div','asBtn').VAL(PAGE.ld('Ok'));
    
    bPos.onclick = f() { func(); newNode._close(); }
}


SYS.input = function(str, cls, func, params) {
    params = mergeObjects(getEnv(this), params);
    if ( T(cls) == T.F ) {
        func = cls;
        cls = 'def';
    }
    cls = cls || 'def';
    func = func || f(){};
    params = mergeObjects({
        validator: f(){return true;},
        init:f(){},
        val: ''
    }, params);
    
    var newNode = SYS.bareNotifyObj(str, cls);
    
    var optsNode = newNode.cr('div','opts');
    var inp = optsNode.cr('input').attr('type','text').VAL(params.val);
    var bPos = optsNode.cr('div','asBtn half first' ).VAL(PAGE.ld('Ok'));
    var bNeg = optsNode.cr('div','asBtn half second').VAL(PAGE.ld('Cancel'));
    
    params.init(newNode, inp, bPos);
    
    bPos.onclick = f() {
        if ( params.validator(inp) ) {
            func(inp.val); newNode._close();
        }
    }
    bNeg.onclick = newNode._close;
}








