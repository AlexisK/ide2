

new eProcessor('gallery', {
    process: function(self, db) {
        if ( self._addedToGallery ) { return false; }
        _jO(self)._addedToGallery = true;
        
        
        db.clsRaw = db.selector.sl([1]);
        
        if ( self.parentNode ) {
            self.linkNodes = getChildren(self.parentNode);
            var pos = self.linkNodes.indexOf(self);
            
            if ( pos == -1 ) { return 0; }
            self.linkNodes.splice(0, pos);
            
            pos = self.linkNodes.length;
            map(self.linkNodes, function(node, index) {
                if ( !node.className.contains(db.clsRaw) ) { pos = index; return false; }
            });
            self.linkNodes.splice(pos, self.linkNodes.length - pos);
        }
        
        //-log(self.linkNodes);
        
        map(self.linkNodes, function(node) { _jO(node)._addedToGallery = true; })
        
        
        
        
        db.images = [];
        var nodes = self.linkNodes;
        
        if ( nodes.length == 0 ) {
            return 0;
        } else if ( nodes.length == 1 ) {
            var img = _jO(nodes[0]);
            var container = _jO(cr('div', 'gallery_single'));
            insBefore(container, img);
            
            container.V.cont = container.cr('div','cont');
            container.V.overLayer = container.V.cont.cr('div','overLayer fa');
            container.V.ico = container.V.overLayer.cr('div','svg');
            SVG.search(container.V.ico);
            container.V.cont.attach(img);
            
            if ( img.D.isfull == '1' ) {
                img.src = img.D.preprop;
            } else {
                img.src = img.D.preview;
            }
            
            container.attr('data-src', img.D.basic);
            img.remattr('width');
            img.remattr('height');
            
            PROCESSOR.fullImg.process(container);
            
            return 0;
        }
        
        map(nodes, function(img) {
            
            if ( def(img) && def(img.src) && def(img.D) ) {
                
                var obj = {
                    thumb:   img.src,
                    preview: img.D.preview,
                    full:    img.D.basic
                };
                db.images.push(obj);
            }
        });
        
        
        
        
        db.view = VIEW.gallery({
            images:db.images,
            thumbSize:"120",
            thumbCount:1,
            imageProp:"640,360"
        });
        
        //-if ( nodes.length == 1 ) {
        //-    db.view.V.thumbs.addCls('hidden');
        //-    db.view.V.pArrLeft.addCls('hidden');
        //-    db.view.V.pArrRight.addCls('hidden');
        //-}
        
        insBefore(db.view, self);
        map(nodes, detach);
        //-self.detach();
        
        db.view.F.rebuild();
    }
});















