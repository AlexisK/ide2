new eParse('string', {
    parse: function(data) {
        try {
            return JSON.stringify(data);
        } catch(err) {
            return data;
        }
    }
});

window.parseStr = PARSE.string;
