
new ePop('modal', 'modal-form', {
    createDom: function(self) {
        self.block = cr('div', 'fullscreen');
        self.V.cont = self.block.cr('div', self.pcls );
        self.V.closeBtn = self.V.cont.cr('div', 'close');
        self.C.contElem = cr('div');
        
        self.data.initDom(self);
    },
    initDom: function(self) {
        var tlink = self.V.closeBtn.cr('a').attr({href:'#'});
        SVG.closeModal(tlink);
        
        
        clearEvents(tlink).onclick = function() {
            self.hide();
            return false;
        }
    }
});

new ePop('modalBig', 'modal-form jBigModal', {}, 'modal');
