

SYS.notArea = cr('div','notify-area');
tm(function() {
    document.body.attach(SYS.notArea);
});


SYS.notify = function(str, cls) {
    cls = cls || 'def';
    var conf = CONF.engine.notify.timeout;
    
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
    
    tm( newNode._close, (conf[cls]||conf.def));
    newNode.onclick = newNode._close;
    
}

