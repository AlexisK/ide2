
new eHtml('gallery', '<div class="gallery-preview">\
        <div class="gallery-image"></div>\
        <div class="gallery-button full"></div>\
        <div class="gallery-arrow fa gleft"></div>\
        <div class="gallery-arrow fa gright"></div>\
    </div>\
    <div class="gallery-thumbs">\
        <div class="gallery-arrow fa gleft"></div>\
        <div class="gallery-arrow fa gright"></div>\
        <div class="gallery-thumbblock">\
            <div class="gallery-thumbcontainer fa"></div>\
        </div>\
    </div>', {
        div:'preview,image,btnFull,pArrLeft,pArrRight,thumbs,tArrLeft,tArrRight,thumbBlock,thumbContainer'
    });


new eView('gallery', {
    create: function() { return HTML.gallery(cr('div','gallery fa')); },
    init: function(self, objData) {
        
        self.C.images     = objData.images;
        self.C.prop       = parseLS(objData.imageProp||CONF.project.imageProp);
        self.C.initThumbs = parseInt(objData.thumbCount||CONF.project.thumbCount);
        self.C.thumbCount = self.C.initThumbs;
        self.C.thumbHalf  = self.C.thumbCount / 2 + 0.5;
        self.C.thumbSize  = parseInt(objData.thumbSize||CONF.project.thumbSize);
        self.C.pos        = 0;
        self.C.shiftOn    = 0;
        self.C.thumbs     = [];
        self.C.full       = false;
        
        self.C.prop = self.C.prop[0] / self.C.prop[1];
        
        
        self.V.placeholder = cr('div');
        
        
        self.F.clear = function() {
            self.C.pos = 0;
            map(self.C.thumbs, detach);
            self.C.thumbs = [];
        }
        
        self.F.build = function() {
            map(self.C.images, self.F.buildThumb);
        }
        
        self.F.rebuild = function() {
            self.F.clear();
            self.F.build();
            self.F.setImage()
            self.F.doResize();
        }
        
        
        
        self.F.calcSizes = function() {
            self.C.width = self.offsetWidth;
            
            if ( self.C.initThumbs * self.C.thumbSize < self.C.width ) {
                self.C.thumbCount = parseInt(self.C.width / self.C.thumbSize)+1;
            } else {
                self.C.thumbCount = self.C.initThumbs;
            }
            if ( self.C.thumbCount % 2 == 0 ) { self.C.thumbCount += 1; }
            self.C.thumbHalf = self.C.thumbCount / 2 + 0.5;
            
            self.C.previewHeight    = Math.round(self.C.width / self.C.prop);
            self.C.thumbWidth       = Math.round(self.C.width / self.C.thumbCount);
            self.C.thumbHeight      = Math.round(self.C.thumbWidth / self.C.prop);
            self.C.totalHeight      = Math.round(self.C.previewHeight + self.C.thumbHeight);
            self.C.thumbsTotalWidth = self.C.thumbWidth * self.C.thumbs.length;
            
            
            if ( self.C.full ) {
                self.C.totalHeight   = Math.round(EVENT.data.windowSize.y + CONF.project.gallery.heightOffset);
                self.C.previewHeight = Math.round(self.C.totalHeight - self.C.thumbHeight);
            }
        }
        
        
        
        self.F._doResize = function() {
            self.F.calcSizes();
            
            self.style.height = self.C.totalHeight+'px'
            self.V.preview.style.height = self.C.previewHeight+'px'
            self.V.thumbs.style.height = self.C.thumbHeight+'px'
            
            map(self.C.thumbs, function(thumb) {
                thumb.style.width  = self.C.thumbWidth  + 'px';
                thumb.style.height = self.C.thumbHeight + 'px';
            });
            
            self.F.adjustThumbs(self.C.shiftOn);
        }
        
        self.F.doResize = function() { tm(self.F._doResize, %animationCss); }
        EVENT.resize.push(CEF(self.F.doResize));
        
        
        
        
        self.F.setImage = function(pos) {
            self.C.thumbs[self.C.pos].remCls('active');
            if ( def(pos) ) {
                self.C.pos = pos;
            }
            if ( self.C.pos == -1 ) {
                self.C.pos = self.C.thumbs.length - 1;
                
            } else if ( self.C.pos == self.C.thumbs.length ) {
                self.C.pos = 0;
                
            }
            
            self.C.thumbs[self.C.pos].addCls('active');
            if ( self.C.full ) {
                self.V.image.style.backgroundImage = ['url(',self.C.images[self.C.pos].full,')'].join('');
            } else {
                self.V.image.style.backgroundImage = ['url(',self.C.images[self.C.pos].preview,')'].join('');
            }
            
            self.F.adjustThumbs();
        }
        
        
        self.F.adjustThumbs = function(shiftOn) {
            var limit = self.C.thumbs.length-self.C.thumbCount;
            
            self.C.shiftOn = shiftOn || 0;
            var shift;
            
            self.C.shiftOn = Math.max(self.C.shiftOn, -(self.C.pos - self.C.thumbHalf + 1));
            self.C.shiftOn = Math.min(self.C.shiftOn,  (limit + self.C.thumbHalf - self.C.pos - 1));
            
            
            if ( self.C.width > self.C.thumbsTotalWidth ) {
                shift = parseInt((self.C.width - self.C.thumbsTotalWidth) / -2);
                self.V.tArrLeft .addCls('hidden');
                self.V.tArrRight.addCls('hidden');
            } else {
                shift = Math.min(Math.max(0, self.C.pos - self.C.thumbCount/2 + 0.5 + self.C.shiftOn),limit) * self.C.thumbWidth;
                self.V.tArrLeft .remCls('hidden');
                self.V.tArrRight.remCls('hidden');
            }
            
            self.V.thumbContainer.style.marginLeft = -shift + 'px';
        }
        
        
        self.F.buildThumb = function(obj, index) {
            var newNode = self.V.thumbContainer.cr('div', 'fa');
            newNode.style.backgroundImage = ['url(',obj.thumb,')'].join('');
            
            newNode.onclick = function() {
                self.F.setImage(index);
            }
            
            self.C.thumbs.push(newNode);
        }
        
        
        
        self.F.setFull = function(state) {
            if ( self.C.full = state ) {
                self.addCls('full');
                insBefore(self.V.placeholder, self);
                document.body.attach(self);
            } else {
                self.remCls('full');
                insBefore(self, self.V.placeholder);
                self.V.placeholder.detach();
            }
            self.C.shiftOn = 0;
            self.F.setImage();
            
            self.F.doResize();
        }
        
        self.F.buildDom = function() {
            SVG.arrLeft(self.V.pArrLeft);
            SVG.arrRight(self.V.pArrRight);
            SVG.arrLeft(self.V.tArrLeft);
            SVG.arrRight(self.V.tArrRight);
            SVG.move2(self.V.btnFull);
            
            self.V.pArrLeft.onclick = function() {
                self.F.setImage(self.C.pos - 1);
            }
            self.V.pArrRight.onclick = function() {
                self.F.setImage(self.C.pos + 1);
            }
            
            self.V.tArrLeft.onclick = function() {
                self.F.adjustThumbs(self.C.shiftOn - self.C.thumbCount);
            }
            self.V.tArrRight.onclick = function() {
                self.F.adjustThumbs(self.C.shiftOn + self.C.thumbCount);
            }
            
            self.V.btnFull.onclick = function() {
                self.F.setFull(!self.C.full);
            }
        }
        
        self.F.buildDom();
    }
})

























