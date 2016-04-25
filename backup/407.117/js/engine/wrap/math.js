
ENGINE.decPrecision = 9;
ENGINE.decMult = Math.pow(10,ENGINE.decPrecision);
ENGINE.decDisplay = 5;
ENGINE._decDiff = Math.pow(10,ENGINE.decPrecision-ENGINE.decDisplay);



function toDec(val, nums) {
    nums = nums || ENGINE.decDisplay;
    var decDiff = Math.pow(10,ENGINE.decPrecision-nums);
    var val = Math.floor(val);
    var n = Math.floor(val / ENGINE.decMult);
    var d = val % ENGINE.decMult;
    var str = [n,Math.abs(Math.floor(d/decDiff)).toLen(nums)].join('.');
    return str;
}

Number.prototype.toDec = String.prototype.toDec = function(nums) { return toDec(this, nums); };


function fromDec(val) {
    var val = val.toString();
    var pos = val.indexOf('.');
    var precd = ENGINE.decPrecision;
    if ( pos != -1 ) {
        var tp = val.length - pos - 1;
        precd -= tp;
        val = val.rp('.','');
    }
    val = Math.floor(val);
    return Math.floor(val * Math.pow(10,precd));
}
Number.prototype.fromDec = String.prototype.fromDec = function() { return fromDec(this); };


function GCD(a, b) {
    if ( ! b) { return a; }
    return GCD(b, a % b);
};

function optDelims(a,b) {
    var del = GCD(a,b);
    if ( del % 1 == 0 ) {
        return [a/del, b/del];
    }
    return [a,b];
}






function jN(a,b, noopt) {
    b = b || 1;
    if ( !noopt ) {
        return findNat(a/b);
    }
    var obj = new T.A(a,b);
    
    obj.valueOf = function() {
        return this[0]/this[1];
    }
    
    return obj;
}




function parseJN(val, add) {
    if ( T(val) == T.N ) {
        if ( !def(add) ) { add = 1; }
        return jN(val, add);
    }
    return val;
}



function findNat(fl) {
    for ( var i = 1; i < 1000; i += 1 ) {
        var t = fl * i;
        if ( t % 1 == 0 ) { return jN(t, i, true); }
    }
    return jN(fl, 1, true);
}


