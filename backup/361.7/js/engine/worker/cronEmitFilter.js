
function CEF(func, tm) {
    tm = Math.max(tm||0, 0);
    
    var int = null;
    var args = [];
    var fl = false;
    
    var newFunc = function() {
        args = arguments;
        if ( fl ) { return 0; }
        //-log(args, func);
        clearInterval(int);
        int = setTimeout(function() { func.apply(func,args); fl = false; }, tm);
        fl = true;
    }
    return newFunc;
}

