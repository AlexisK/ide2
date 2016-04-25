
new ePop('window', 'popWindow', {
    createDom: function(self) {
        self.block      = cr('div', self.data.parentCls);
        self.V.cont     = self.block.cr('div', self.pcls );
        self.C.contElem = cr('div');
        
        self.V.closeBtn = self.V.cont.cr('div','closeBtn fa asBtn');
        SVG.close(self.V.closeBtn);
        clearEvents(self.V.closeBtn).onclick = function() {
            self.hide();
            return false;
        }
    }
});
