
new ePop('drag', null, {
    alwaysPersist: true,
    createDom: function(self) {
        self.block = cr('div', 'onscreenWindow');
        self.V.headerBlock = self.block.cr('div', 'windowHead' );
        self.V.cont = self.block.cr('div', 'windowBlock' );
        self.C.contElem = cr('div');
        
        self.V.closeBtn = SVG.close(self.V.headerBlock.cr('div', 'asBtn fa right'));
        self.V.moveBtn  = SVG.move2(self.V.headerBlock.cr('div', 'asBtn fa fillBack'));
        self.V.headStr  = self.V.headerBlock.cr('h3');
        
        
        self._startPos = [0,0];
        self._curPos   = [-20,-20];
        self._dragPos  = [0,0];
        
        self.stopDrag = function() {
            EVENT.mousemove.remove(self.doDrag);
            evtDel(document,'mouseup', self.stopDrag);
            self._curPos[0] += self._dragPos[0];
            self._curPos[1] += self._dragPos[1];
        }
        
        self.doDrag = function(ev) {
            self._dragPos  = [EVENT.data.cursor.x - self._startPos[0], EVENT.data.cursor.y - self._startPos[1]];
            self.block.style.left = self._curPos[0] + self._dragPos[0] + 'px';
            self.block.style.top  = self._curPos[1] + self._dragPos[1] + 'px';
            
        }
        
        clearEvents(self.V.moveBtn).onmousedown = function(ev) {
            self._startPos = [EVENT.data.cursor.x, EVENT.data.cursor.y];
            EVENT.mousemove.add(self.doDrag);
            evt(document,'mouseup', self.stopDrag);
            return false;
        }
        
        self.V.closeBtn.onclick = self.hide;
    },
    onshowstart: function(self) {
        self.V.headStr.VAL(self.rdata.title||'');
        if ( def(self.rdata.dom) ) {
            self.V.headerBlock.attach(self.rdata.dom);
        }
        
    },
    onshow: function(self, rdata) {
        self.stopDrag();
        
        if ( rdata.isSmall ) {
            self.block.style.width  = parseInt(EVENT.data.windowSize.x * CONF.object.pop_drag.smallscale[0]) + 'px';
            self.block.style.height = parseInt(EVENT.data.windowSize.y * CONF.object.pop_drag.smallscale[1]) + 'px';
            self.block.addCls('smallDrag');
        } else {
            self.block.style.width  = parseInt(EVENT.data.windowSize.x * CONF.object.pop_drag.scale[0]) + 'px';
            self.block.style.height = parseInt(EVENT.data.windowSize.y * CONF.object.pop_drag.scale[1]) + 'px';
            self.block.remCls('smallDrag');
        }
        
        var diffX = self.block.offsetWidth  + EVENT.data.cursor.x - EVENT.data.windowSize.x;
        var diffY = self.block.offsetHeight + EVENT.data.cursor.y - EVENT.data.windowSize.y;
        
        self._startPos[0] += Math.max(0, diffX);
        self._startPos[1] += Math.max(0, diffY);
        
        self.doDrag();
        self.stopDrag();
        
        self.block.addCls('lastOpened');
        
        self.block._hovFn = function() {
            self.block.remCls('lastOpened');
            evtDel(self.block, 'mouseover', self.block._hovFn);
        }
        evt(self.block, 'mouseover', self.block._hovFn);
    }
});












