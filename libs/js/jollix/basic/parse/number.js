new eParse('number', {
    parse: function(val) {
        
        val = (val || 0).toString();
        var mp = val.split(/\D+/g);
        var numberMap = mp.splice((( mp[0].length == 0 ) && 1 || 0), 2);
        
        return (numberMap.length == 1) && parseInt(numberMap[0]) || parseFloat(numberMap.join('.'));
        
    }
});

window.parseNum = PARSE.number;
