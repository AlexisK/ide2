new eParse('number', {
    parse: function(obj) {
        obj = (obj||0).toString().rp(',','.');
        if ( obj.contains('.') ) {
            return parseFloat(obj)||0;
        }
        return parseInt(obj)||0;
    }
});

window.parseNum = PARSE.number;
