
function closeOnClick(node, ignore, hideFunc) {
    if ( !node ) { return null; }
    hideFunc = hideFunc || detach;
    var int = null;
    ignore = ignore || [];
    ignore.push(node);
    
    var close = function() {
        hideFunc(node);
        evtDel(document.body, 'click'     , closeEv);
        evtDel(document.body, 'touchstart', closeEv);
    }
    
    var closeEv = function() { int = tm(close, 10); }
    var prevent = function() { tm(function() { clearInterval(int); }); }
    
    evt(document.body, 'click'     , closeEv);
    evt(document.body, 'touchstart', closeEv);
    
    
    map(ignore, function(elem) {
        evt(elem, 'click'     , prevent);
        evt(elem, 'touchstart', prevent);
    });
    
    return node;
}


