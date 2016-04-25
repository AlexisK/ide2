
new eProcessor('swipeArea', {
    process: function(self, db) {
        tm(f(){ db._process(self, db); });
    },
    _process: function(self, db) {
        _jO(self);
        
        self.dimensions = self.D.swipedims.split('');
        
        self.block = S('.mk_swipeBlock', self)[0];
        self.container = S('.mk_swipeCont', self)[0];
        
        if ( def(self.D.swipesize) ) {
            self.size = parseLS(self.D.swipesize);
            self.size[0] = parseInt(self.size[0] || 0);
            self.size[1] = parseInt(self.size[1] || 0);
        } else {
            self.sizeBlock = S('.mk_swipeSize', self)[0];
            if ( self.sizeBlock ) {
                self.size = [self.sizeBlock.offsetWidth, self.sizeBlock.offsetHeight];
            } else {
                self.size = [2,2];
            }
        }
        self.halfSize = [parseInt(self.size[0]/2), parseInt(self.size[1]/2)];
        
        if ( def(self.D.swipelimit) ) {
            self.limit = parseInt(self.D.swipelimit)*-1;
        } else if ( self.D.calcitemselector) {
            self.calcitems = S(self.D.calcitemselector, self.block);
            if ( def(self.D.swipesize) ) {
                self.limit = self.calcitems.length * self.size[0] * -1;
            } else {
                self.limit = 0;
                
                map(self.calcitems, function(item) { self.limit -= item.offsetWidth });
            }
        } else {
            self.limit = self.block.offsetWidth*-1;
        }
        
        if ( self.container ) {
            self.containerLimit = self.container.offsetWidth;
            self.limit = Math.min(0, self.limit+self.containerLimit);
        }
        
        
        
        
        self._curPos = [0,0];
        
        self._normalizePos = function() {
            self._curPos[0] = Math.round(self._curPos[0] / self.size[0]) * self.size[0];
            self._curPos[1] = Math.round(self._curPos[1] / self.size[1]) * self.size[1];
            
            self._curPos[0] = Math.max(Math.min(self._curPos[0], 0), self.limit);
            
            self.block.addCls('fa');
            self.block.style.marginLeft = self._curPos[0] + 'px';
            self.block.style.marginTop  = self._curPos[1] + 'px';
        }
        
        
        
        
        var swipeData = {
            start: function() { self.block.remCls('fa'); },
            end: function(pos, rel) {
                self._curPos[0] += rel[0];
                self._normalizePos();
            }
        }
        
        if ( self.dimensions.contains('x') ) {
            swipeData.movex = function(pos, rel) {
                self.block.style.marginLeft = self._curPos[0] + rel[0] + 'px';
            }
        }
        if ( self.dimensions.contains('y') ) {
            swipeData.movex = function(pos, rel) {
                self.block.style.marginTop = self._curPos[1] + rel[1] + 'px';
            }
        }
        if ( def(self.D.precision) ) {
            swipeData.precision = self.D.precision;
        }
        
        self._swipe = new domSwipe(self, swipeData);
        
    }
})




















