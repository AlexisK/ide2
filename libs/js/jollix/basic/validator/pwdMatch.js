
new eValidator('pwdMatch',function(self, t1, t2){
    function check() {
        return t1.val.rp(' ', '') != '' && t1.val == t2.val;
    }
    function match() {
        self.runSingle(t1, check);
        return self.runSingle(t2, check);
    }
    t1.onkeyup = match;
    t2.onkeyup = match;
    return match();
}, true);
