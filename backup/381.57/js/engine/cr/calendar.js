
SYS.month = parseLS('January,February,March,April,May,June,July,August,September,October,November,December');
SYS.wDay  = parseLS('Mon,Tue,Wed,Thu,Fri,Sat,Sun');
SYS.calendarRows = 6;




cr.dateinput = function(cls, parent) {
    var self = _jO(cr('div', 'dateinput-def dateinput '+(cls||''), parent));
    dispatchOnUpdate(self);
    var n = newDate();
    
    self.F._prepData = function() {
        
        map(RNG(32).sl([1]), function(val) {
            self.C.dd[val] = val;
        });
        
        map(SYS.month, function(mStr, ind) {
            var tn = cr('span').VAL(PAGE.ld(mStr));
            tn.cr('span','hidden').VAL(ind+1);
            tn.cr('span','hidden').VAL(mStr);
            self.C.mm[ind] = tn;
        });
        
        var st = n.getFullYear();
        var en = st - 100;
        
        for ( var i = st; i > en; i-- ) {
            self.C.yy[i] = i;
        }
    }
    
    self.C.dd = {};
    self.C.mm = {};
    self.C.yy = {};
    self.F._prepData();
    
    
    map(['dd','mm','yy'], function(key) {
       self.V[key] = cr.dropdown(self.C[key], null, self, {limit:10});
       self.V[key].onupdate(function() {
           self.C._emitUpdated();
       });
    });
    
    self.V.yy.val = n.getFullYear();
    self.V.mm.val = 0;
    self.V.dd.val = 1;
    
    
    
    
    $P(self, 'val', f() {
        var dt = newDate(0);
        dt.setFullYear(self.V.yy.val);
        dt.setMonth(self.V.mm.val);
        dt.setDate(self.V.dd.val);
        return dt*1;
    }, f(data) {
        var dt = newDate(data);
        self.V.yy.val = dt.getFullYear();
        self.V.mm.val = dt.getMonth();
        self.V.dd.val = dt.getDate();
    });
    
    return self;
}



cr.calendar = function(cls, parent) {
    var self = _jO(cr('div', 'calendar-def calendar '+cls, parent));
    dispatchOnUpdate(self);
    
    self.updateOnVal = false;
    self.hasValue = false;
    
    self.V.head  = self.cr('div','calendar-head');
    self.V.table = self.cr('table');
    self.V.left  = self.V.head.cr('div','asBtn');
    self.V.right = self.V.head.cr('div','asBtn');
    self.V.month = self.V.head.cr('div','month');
    
    var now  = clearTime(new Date());
    var virtualTime = new Date(now);
    
    var iter;
    var table = self.V.table;
    self.curDate = now * 1;
    
    self.now = now;
    self.virtualTime = virtualTime;
    self.iter = iter;
    
    
    self.F.drawMonth = function() {
        self.V.month.val = [
            PAGE.ld(SYS.month[virtualTime.getMonth()]),
            virtualTime.getFullYear()
        ].join(' ');
    }
    
    self.F.prepTable = function() {
        table.innerHTML = '';
        var row = table.cr('tr','wDay');
        map(SYS.wDay, function(wdStr) {
            row.cr('td').VAL(PAGE.ld(wdStr));
        });
    }
    
    
    self.F.onDraw = function(){};
    self.F.setDraw = function() {
        iter = new Date(virtualTime);
        
        iter.setDate(1);
        iter.setDate(iter.getDay() * -1 + 2);
        
        self.F.drawMonth();
        self.F.prepTable();
        
        for ( var rInd = 0; rInd < SYS.calendarRows; rInd++ ) {
            var row = table.cr('tr', 'cTime');
            
            map(SYS.wDay, function(wdStr) {
                var col = row.cr('td','fa');
                col.val = iter.getDate();
                
                
                if ( iter.getMonth() == virtualTime.getMonth() ) {
                    col.addCls('curMonth');
                }
                
                if ( self.hasValue && iter.getMonth() == now.getMonth() && iter.getDate() == now.getDate() ) { col.addCls('curDate'); }
                
                col._val = iter * 1;
                col.onclick = function() {
                    self.curDate = this._val;
                    now = new Date(self.curDate);
                    self.hasValue = true;
                    self.F.setDraw();
                    self.C._emitUpdated();
                }
                
                iter.setDate(iter.getDate()+1);
            });
        }
        self.F.onDraw();
    }
    
    
    
    
    SVG.arrLeft (self.V.left );
    SVG.arrRight(self.V.right);
    SVG.meshChess.bg(self.V.head, {fill:'rgba(0,0,0,0.1)'});
    
    
    clearEvents(self.V.left).onclick  = function() {
        virtualTime.setMonth(virtualTime.getMonth()-1);
        self.F.setDraw();
        return false;
    }
    clearEvents(self.V.right).onclick = function() {
        virtualTime.setMonth(virtualTime.getMonth()+1);
        self.F.setDraw();
        return false;
    }
    
    
    self.F.setDraw();
    
    $P(self, 'val', function() {
        if ( self.hasValue ) {
            return self.curDate;
        }
        return null;
    }, function(val) {
        now = new Date(val);
        self.hasValue = true;
        if ( !def(val) || now == 'Invalid Date' ) { now = new Date(); self.hasValue = false; }
        self.curDate = now*1;
        virtualTime = new Date(now);
        self.F.setDraw();
        
        if ( self.updateOnVal ) {
            self.C._emitUpdated();
        }
        
        return self.curDate;
    });
    
    return self;
}




cr.calendartime = function(cls, parent) {
    var self = cr.calendar(cls, parent);
    
    self.V.timeBlock = self.cr('div','time-block');
    self.V.hours = self.V.timeBlock.cr('input').attr({
        type:'text', min:0, max:23
    }).VAL('00');
    
    self.V.timeBlock.cr('div').VAL(':');
    
    self.V.minutes = self.V.timeBlock.cr('input').attr({
        type:'text', min:0, max:59
    }).VAL('00');
    
    
    
    
    self.F.fetchTimeItem = function(node, max) {
        var val = parseInt(node.val);
        if ( val == NaN ) {
            val = 0;
        }
        val = Math.min(Math.max(val, 0), max);
        node.val = val.toLen();
        return val;
    }
    
    self.F.fetchTime = function() {
        var date = new Date(self.curDate);
        
        date.setHours(self.F.fetchTimeItem(self.V.hours, 23));
        date.setMinutes(self.F.fetchTimeItem(self.V.minutes, 59));
        
        self.curDate = date * 1;
        self.now = new Date(self.curDate);
        self.F.setDraw();
        self.C._emitUpdated();
    }
    
    
    self.F.onDraw = function() {
        var date = new Date(self.curDate);
        self.V.hours.val   = (date.getHours()).toLen();
        self.V.minutes.val = (date.getMinutes()).toLen();
    }
    
    
    self.V.hours.onupdate(self.F.fetchTime);
    self.V.minutes.onupdate(self.F.fetchTime);
    
    return self;
}



cr.calendartimeinput = function(cls, parent) {
    var self = cr('div', 'calendar-def calendar-input '+cls, parent);
    
    self.repr = self.cr('div','calendar-represent');
    SVG.meshChess.bg(self.repr, {fill:'rgba(0,0,0,0.1)'});
    
    
    self.calendar = cr.calendartime(cls, self);
    
    self.fetchVal = function() {
        self.repr.val = formatDate(self.calendar.val, true, true, true);
    }
    
    $P(self, 'val', function() {
        return self.calendar.val;
    }, function(val) {
        var t = self.calendar.val = val;
        self.fetchVal();
        return t;
    });
    
    $P(self, 'updateOnVal', function() {
        return self.calendar.updateOnVal;
    }, function(data) {
        return self.calendar.updateOnVal = data;
    })
    
    
    
    dispatchOnUpdate(self);
    self.C._updFunc = self.calendar.C._updFunc;
    self.calendar.onupdate(function() {
        self.fetchVal();
        self.C._emitUpdated();
    });
    self.fetchVal();
    
    
    self.repr.onclick = function() {
        self.swCls('active');
    }
    
    return self;
}










