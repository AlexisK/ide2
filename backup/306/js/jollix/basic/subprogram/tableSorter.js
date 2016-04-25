
new eSubprogram('tableSorter', function(onfinish) {
    var self = this;
    
    self.init = function() {
        self.curTable = null;
        self.fields = [];
        self.lines = [];
        self.sortBtns = {};
        
        self._sortTypes = {
            text: [function(a,b,field) {
                    var af = a.__sortData[field];
                    var bf = b.__sortData[field];
                    return (af > bf) ? -1 : (af < bf) ? 1 : 0;
                },function(a,b,field) {
                    var af = a.__sortData[field];
                    var bf = b.__sortData[field];
                    return (af < bf) ? -1 : (af > bf) ? 1 : 0;
                }],
            number: [function(a,b,field) {
                    return b.__sortData[field] - a.__sortData[field];
                },function(a,b,field) {
                    return a.__sortData[field] - b.__sortData[field];
                }]
        }
    }
    
    self.setTable = function(table, headerAt) {
        self.curTable = table;
        self.headerAt = headerAt||0;
        self._fetchHeader();
        self._fetchTable();
    }
    
    
    
    self.sort = function(field, state) {
        if ( !self.curTable ) { return 0; }
        
        mapO(self.sortBtns, function(btn) {
            btn.state(0);
        });
        state = Math.max(Math.min(state, 3), 0);
        if ( state == 3 ) { state = 1; }
        self.sortBtns[field].state(state);
        
        if ( state == 1) {
            self.lines.sort(function(a,b) {
                return self._sortTypes[a.__sortType[field]][1](a,b,field);
            });
        } else {
            self.lines.sort(function(a,b) {
                return self._sortTypes[a.__sortType[field]][0](a,b,field);
            });
        }
        
        map(self.lines, function(line) {
            self.curTable.attach(line);
        });
    }
    
    
    
    self._fetchHeader = function() {
        if ( !self.curTable ) { return 0; }
        
        self.fields = [];
        self.sortBtns = {};
        
        var row = S('tr', self.curTable)[self.headerAt];
        
        map(S('th', row), function(btn) {
            var field = btn.val;
            SVG.clearBg(btn);
            btn._state = 0;
            
            btn.state = function(val) {
                val = Math.max(Math.min(val, 2), 0);
                
                if ( val == 1 ) {
                    SVG.arrTop.bg(btn);
                } else if ( val == 2 ) {
                    SVG.arrBottom.bg(btn);
                } else {
                    SVG.clearBg(btn);
                }
                btn._state = val;
            }
            
            clearEvents(btn).onclick = function() { self.sort(field, btn._state += 1); return false; }
            self.fields.push(field);
            self.sortBtns[field] = btn;
            
        })
    }
    
    self._fetchTable = function() {
        if ( !self.curTable ) { return 0; }
        
        var list = S('tr', self.curTable);
        list.splice(0,self.headerAt+1);
        self.lines = list;
        
        map(self.lines, function(line) {
            line.__sortData = {};
            line.__sortType = {};
            var rows = S('td', line);
            
            map(self.fields, function(field, index) {
                var val = rows[index].val;
                line.__sortData[field] = val;
                if ( parseFloat(val) == val ) {
                    line.__sortType[field] = 'number';
                } else {
                    line.__sortType[field] = 'text';
                }
            });
            
        });
        
    }
    
    
    
    self.init();
});



