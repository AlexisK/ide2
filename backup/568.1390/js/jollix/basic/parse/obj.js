new eParse('object', {
    parse: function(data) {
        try {
            return JSON.parse(data);
        } catch(err) {
            return data;
        }
    }
});

window.parseObj = PARSE.object;
