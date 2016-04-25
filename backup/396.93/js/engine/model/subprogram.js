window.SUBPROGRAM = {};


function eSubprogram(name, func) {
    var self   = this;
    self.model = SUBPROGRAM;
    
    self.init = function() {
        self.program = func||function(){};
        
        SUBPROGRAM[name] = func;
    }
    
    self.init();
}


