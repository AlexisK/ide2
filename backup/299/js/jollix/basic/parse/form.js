new eParse('form', {
    parse: function(obj) {
        var form = new FormData();
        
        mapO(obj, function(val, key) {
            if ( typeof(val) == 'object' && val.constructor == Array ) {
                form.append(key, val[0], val[1]);
            } else {
                form.append(key, val);
            }
        });
        
        return form;
    }
});

window.parseForm = PARSE.form;
