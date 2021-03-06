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
            try {
                self.data = JSON.parse(glob(self.fullName));
            } catch(err) {
                self.data = {
                    cont: [],
                    tail: false
                };
            }
        } else {
            self.data = {
                cont: [],
                tail: false
            };
        }
        self.cont = self.data.cont;
    }
    self.write = function(key, data, params) {
        params = params||{};
        var line = [new Date()*1, key, data, params];
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
        if ( line[3].format == 'obj' ) {
            console.log(formatDate(line[0], true), line[1], parseObj(line[2]));
        } else {
            console.log(formatDate(line[0], true), line[1], line[2]);
        }
        
    }
    
    self.setTail = function(data) {
        self.data.tail = data;
        self.save();
    }
    
    self.init();
}



