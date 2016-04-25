
function domSwipe(dom, data) {
    var self = this;
    
    self.init = function() {
        self.data = mergeObjects({
            start   : function(x,y){},
            move    : function(x,y){},
            end     : function(x,y){},
            cancel  : function(x,y){},
            leave   : function(x,y){},
            
            startx  : function(x,y){},
            movex   : function(x,y){},
            endx    : function(x,y){},
            cancelx : function(x,y){},
            leavex  : function(x,y){},
            
            starty  : function(x,y){},
            movey   : function(x,y){},
            endy    : function(x,y){},
            cancely : function(x,y){},
            leavey  : function(x,y){},
            
            precision: null
        }, data);
        
        self.has = {
            x: (data.startx || data.movex || data.endx || data.cancelx || data.leavex) && true || false,
            y: (data.starty || data.movey || data.endy || data.cancely || data.leavey) && true || false
        }
        
        self.dimData = mergeObjects({
            startx  : null,
            movex   : null,
            endx    : null,
            cancelx : null,
            leavex  : null,
            
            starty  : null,
            movey   : null,
            endy    : null,
            cancely : null,
            leavey  : null
        }, data);
        
        self.precision  = self.data.precision || (ENGINE.isMOB && 20 || 50);
        self._initPos   = [0,0];
        self._startPos  = [0,0];
        self._curPos    = [0,0];
        self._relPos    = [0,0];
        self._touches   = [];
        self._dragging  = false;
        self._dragMouse = false;
        self.swipeInd   = 0;
        
        $P(self, 'swipeDirection', function() { return self.swipeInd && 'y' || 'x'; });
        
        self.dispatchEvents();
        ENGINE._clearOnce.add(self.clearEvents);
    }
    
    self.dispatchEvents = function() {
        map(parseLS(CONF.engine.swipeEvents), self._registerDefaultEvent);
        evt(document, 'mouseup', self.domouseup);
    }
    self.clearEvents = function() {
        map(parseLS(CONF.engine.swipeEvents), self._clearDefaultEvent);
        evtDel(document, 'mouseup', self.domouseup);
    }
    
    self._registerDefaultEvent = function(event) { evt   (dom, event, self['do'+event]); }
    self._clearDefaultEvent    = function(event) { evtDel(dom, event, self['do'+event]); }
    
    
    
    self._evParser = function(ev, func) {
        if ( SYS._edit ) { return false; }
        if ( self._dragging && self.has[self.swipeInd] ) { ev.preventDefault(); }
        self._touches = ev.changedTouches;
        if ( self._touches.length == 1 ) {
            func(self._touches[0]);
        }
    }
    
    self.dotouchstart  = function(ev) { self._evParser(ev, self._touchstart); }
    self.dotouchmove   = function(ev) { self._evParser(ev, self._touchmove); }
    self.dotouchend    = function(ev) { self._evParser(ev, self._touchend); }
    self.dotouchcancel = function(ev) {}
    self.dotouchleave  = function(ev) {}
    
    
    
    self._descEvParser = function(ev, func) {
        if ( SYS._edit ) { return false; }
        ev.preventDefault();
        func({pageX:ev.clientX,pageY:ev.clientY});
    }
    
    self.domousedown = function(ev) {
        self._dragMouse = true;
        self._descEvParser(ev, self._touchstart);
    }
    self.domousemove = function(ev) {
        if ( self._dragMouse ) {
            self._descEvParser(ev, self._touchmove);
        }
    }
    self.domouseup = function(ev) {
        if ( self._dragMouse ) {
            self._descEvParser(ev, self._touchend);
            self._dragMouse = false;
        }
    }
    
    
    
    self._touchstart = function(touch) {
        self._initPos  = [touch.pageX, touch.pageY];
        self._startPos = [touch.pageX, touch.pageY];
        self._curPos   = [touch.pageX, touch.pageY];
    }
    
    
    self._touchmove = function(touch) {
        self._curPos   = [touch.pageX, touch.pageY];
        if ( self._dragging ) {
            self._relPos   = [self._curPos[0] - self._startPos[0], self._curPos[1] - self._startPos[1]];
            self.data['move'+self.swipeDirection](self._curPos, self._relPos);
            self.data.move(self._curPos, self._relPos);
        } else {
            if (        Math.abs(self._curPos[0] - self._initPos[0]) >= self.precision ) {
                self.swipeInd = 0;
                self._startPos = [touch.pageX, touch.pageY];
                self._relPos   = [0,0];
                self._dragging = true;
                self.data.startx(self._curPos, self._relPos);
                self.data.start(self._curPos, self._relPos);
            } else if ( Math.abs(self._curPos[1] - self._initPos[1]) >= self.precision ) {
                self.swipeInd = 1;
                self._startPos = [touch.pageX, touch.pageY];
                self._relPos   = [0,0];
                self._dragging = true;
                self.data.starty(self._curPos, self._relPos);
                self.data.start(self._curPos, self._relPos);
            }
        }
        
    }
    
    self._touchend = function(touch) {
        self._curPos   = [touch.pageX, touch.pageY];
        self._relPos   = [self._curPos[0] - self._startPos[0], self._curPos[1] - self._startPos[1]];
        self.data['end'+self.swipeDirection](self._curPos, self._relPos);
        self.data.end(self._curPos, self._relPos);
        self._dragging = false;
    }
    self._touchcancel = function(touch) {}
    self._touchleave  = function(touch) {}
    
    self.init();
}






































