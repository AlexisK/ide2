window.LOG          = {};
ENGINE.logPrefix    = 'log_';
ENGINE.logMaxLength = 50;


function eLog(name, maxLength) {
    var self   = this;
    self.model = LOG;
    
    self.init = function() {
        self.fullName = ENGINE.logPrefix+name;
        maxLength     = maxLength || ENGINE.logMaxLength;
        
        self.load();
        
        LOG[name] = self;
    }
    
    self.save = function() {
        self.cont.splice(0, Math.max(self.cont.length - maxLength, 0) );
        glob(self.fullName, parseStr(self.data));
    }
    self.load = function() {
        if ( def(glob(self.fullName)) ) {
            self.data = parseObj(glob(self.fullName));
        } else {
            self.data = {
                cont: [],
                tail: false
            };
        }
        self.cont = self.data.cont;
    }
    self.write = function(key, data) {
        var line = [new Date()*1, key, data];
        self.cont.push(line);
        self.save();
        if ( self.data.tail ) { self._printLine(line); }
    }
    self.read = function(lines) {
        var logList = self.cont;
        if ( def(lines) ) {
            logList = self.cont.slice(self.cont.length-lines);
        }
        map(logList, self._printLine);
        
    }
    
    self._printLine = function(line) {
        line[2] = line[2]||'';
        console.log(formatDate(line[0], true), line[1], line[2]);
    }
    
    self.setTail = function(data) {
        self.data.tail = data;
        self.save();
    }
    
    self.init();
}



