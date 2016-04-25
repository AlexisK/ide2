window.PARSE = {};


function eParse(name, data) {
    var self   = this;
    self.model = PARSE;
    
    self.init = function() {
        self.data = mergeObjects({
            parse: function(data){ return data; }
        }, data);
        
        PARSE[name] = self.data.parse;
    }
    
    self.init();
}


