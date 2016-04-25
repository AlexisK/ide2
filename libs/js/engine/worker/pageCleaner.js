
ENGINE._clear     = [];
ENGINE._clearOnce = [];

ENGINE.clear = function() {
    map(ENGINE._clear, function(func, index) {
        if ( !def(func) ) {
            ENGINE._clear.splice(index,1);
            return ENGINE.clear();
        }
        func();
    });
    map(ENGINE._clearOnce, function(func) {
        func();
    });
    ENGINE._clearOnce = [];
};
