


new eProcessor('fullImg', {
    process: function(self, db) {
        _jO(self);
        
        var url = self.D.src;
        var trigger = S('.mk_fullImgTrig', self)[0];
        //-var btn = S('.mk_fullImg', self)[0];
        
        if ( url ) {
            //-SVG.move2(btn);
            var target = trigger||self;
            var bg = cr('div', 'fullscreen fullImg zoomOut');
            var block = bg.cr('div','fullImg');
            var imgNode = block.cr('img').attr({
                src:url
            });
            
            target.addCls('zoomIn');
            
            clearEvents(target).onclick = function(ev) {
                document.body.attach(bg);
                return false;
            }
            
            bg.onclick = function() {
                bg.detach();
            }
        }
        
    }
});















