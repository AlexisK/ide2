
new eSubprogram('wysiwyg', function(onfinish) {
    var self = this;
    var confImage = CONF.engine.articleImage;
    
    self.init = function(node) {
        self.node = _jO(node);
        node.__isHtml = true;
        self._isEditing = false;
        
        self._createPanel();
        self.wrapper = cr('div','wys_inside');
        self.wrapper.attach(self.panel);
        self.menuTarget = self.wrapper;
        
        self.fetchInt = null;
    }
    
    
    
    self.placeMenu = function(dom) {
        self.menuTarget = dom;
    }
    self.resetMenu = function() {
        self.menuTarget = self.wrapper;
    }
    
    
    
    self.focus = function() {
        self.panel.addCls('active');
    }
    self.blur  = function() {
        self.panel.remCls('active');
    }
    
    self.disableKeys = function(ev) {
        if ( ev.keyCode == 9 ) {
            ev.preventDefault();
        }
    }
    
    self.checkKeys = function(ev) {
        if ( ev.keyCode == 9 ) {
            ev.preventDefault();
            
            var selObj = window.getSelection().anchorNode;
            
            for ( var i = 0; selObj._tag != 'pre' && selObj._tag != 'p' && i < 2; i++ ) {
                selObj = selObj.parentNode;
            }
            
            selObj.remattr('style');
            
            if ( selObj._tag == 'pre' ) {
                document.execCommand('formatBlock', false, 'p');
            } else {
                document.execCommand('formatBlock', false, 'pre');
            }
            
        }
    }
    
    
    self.edit = function() {
        self.view();
        self.node.setView('div', 'editing', self._onupdate);
        self.node.V.viewNode.attr({contenteditable: 'true'});
        self.area = self.node.V.viewNode;
        
        insBefore(self.wrapper, self.node.V.viewNode);
        self.wrapper.attach(self.node.V.viewNode);
        self.menuTarget.attach(self.panel);
        EVENT.mousedown.push(self.fetchDynamics);
        self._isEditing = true;
        
        evt(self.node.V.viewNode, 'focus'   , self.focus);
        evt(self.node.V.viewNode, 'blur'    , self.blur );
        evt(self.node.V.viewNode, 'keydown' , self.disableKeys );
        evt(self.node.V.viewNode, 'keyup'   , self.checkKeys );
        
        if ( self.node.V.viewNode ) {
            self.node.V.viewNode.onpaste = function() {
                tm(function() {
                    self.fetchDynamics();
                    domFilter(self.node.V.viewNode);
                });
            }
        }
    }
    
    self.view = function() {
        if ( self._isEditing ) {
            self.node.setView();
            insBefore(self.node, self.wrapper);
            self.wrapper.detach();
            self._isEditing = false;
            
            self.blur();
            evtDel(self.node.V.viewNode, 'focus'   , self.focus);
            evtDel(self.node.V.viewNode, 'blur'    , self.blur );
            evtDel(self.node.V.viewNode, 'keydown' , self.disableKeys );
            evtDel(self.node.V.viewNode, 'keyup'   , self.checkKeys );
            if ( self.node.V.viewNode ) {
                self.node.V.viewNode.onpaste = function() {}
            }
        }
    }
    
    
    
    self._mediaById = {};
    
    self._updateImagesSrc = function(id, urlMap) {
        map(self._mediaById[id], function(elem) {
            self._galleryImageSetUrls(elem, urlMap);
        });
        self._onupdate();
    }
    
    self._galleryImageProcessor = function(dom) {
        clearEvents(_jO(dom)).__wysProc = true;
        dom._domFilterBlocked = true;
        
        self._mediaById[dom.D.media] = self._mediaById[dom.D.media] || [];
        self._mediaById[dom.D.media].add(dom);
        
        var reqThumb = {};
        reqThumb[confImage.thumbSize] = confImage.size[confImage.thumbSize];
        var reqPreview = {};
        reqPreview[confImage.startSize] = confImage.size[confImage.startSize];
        
        dom.onclick = function() {
            dom._selfOpt = dom._selfOpt || new OPT([
                [PAGE.ld('crop thumb'),   function() {
                    cropImage(dom.D.media, reqThumb, function(resp) {
                        self._updateImagesSrc(dom.D.media, resp);
                    });
                }],
                [PAGE.ld('crop preview'), function() {
                    cropImage(dom.D.media, reqPreview, function(resp) {
                        self._updateImagesSrc(dom.D.media, resp);
                    });
                }]
            ]);
            dom._selfOpt.open();
        }
    }
    
    self._galleryImageSetUrls = function(dom, urlList) {
        var size;
        
        if (_jO(dom).D.imagetype == 'image' ) {
            size = confImage.size[confImage.startSize].split('x');
            
            if ( urlList[confImage.startSize] ) { dom.attr({'src': urlList[confImage.startSize]}); }
            
        } else {
            size = confImage.size[confImage.thumbSize].split('x');
            
            if ( urlList.basic ) { dom.attr({'data-basic':urlList.basic}); }
            if ( urlList[confImage.startSize] ) { dom.attr({'data-preview':urlList[confImage.startSize]}); }
            if ( urlList[confImage.thumbSize] ) { dom.attr({'src'         :urlList[confImage.thumbSize]}); }
        }
        
        dom.attr({
            'width'   : size[0],
            'height'  : size[1]
        });
    }
    
    
    self.fetchDynamics = function() {
        
        map(S('.pr_gallery', self.node.V.viewNode), function(node) {
            
            if ( !node.__wysProc ) {
                node.__wysProc = true;
                
                self._galleryImageProcessor(node);
            }
            
        });
        
        map(S('img', self.node.V.viewNode), function(node) {
            
            if ( !node.__wysProc ) {
                node.__wysProc = true;
                
                
                var type = node.attr('data-imagetype');
                
                if ( type == "image" ) {
                    var media_id = node.attr('data-media');
                    
                    self._mediaById[media_id] = self._mediaById[media_id] || [];
                    self._mediaById[media_id].add(node);
                    
                    node.onclick = function() {
                        var reqD = {};
                        reqD[confImage.startSize] = confImage.size[confImage.startSize];
                        
                        cropImage(media_id, reqD, function(dims) {
                            self._updateImagesSrc(media_id, dims);
                        });
                    }
                }
            }
        });
        map(S('a', self.node.V.viewNode), function(node) {
            if ( !node.__wysProc ) {
                node.__wysProc = true;
                
                node.__eView = _jO(cr('div','dragStyle'));
                node.__eView.cr('p').VAL(PAGE.ld('link'));
                node.__eView.V.link = node.__eView.cr('input').attr({type:'text'});
                node.__eView.cr('p').VAL(PAGE.ld('text'));
                node.__eView.V.text = node.__eView.cr('input').attr({type:'text'});
                node.__eView.V.submit = node.__eView.cr('div', 'asBtn').VAL(PAGE.ld('save'));
                
                
                
                clearEvents(node).onclick = function() {
                    if ( self._isEditing ) {
                        node.__eView.V.link.val = node.href;
                        node.__eView.V.text.val = node.val;
                        var inst = POP.drag.showNew(node.__eView, null, {isSmall:true});
                        
                        node.__eView.V.submit.onclick = function() {
                            node.href = node.__eView.V.link.val;
                            node.val  = node.__eView.V.text.val;
                            inst.hide();
                            self._onupdate();
                        }
                        return false;
                    }
                }
            }
        });
        
    }
    
    
    
    
    
    self._onupdate = function(val) {
        if ( !def(val) ) { val = self.node.V.viewNode.val; }
        self.fetchDynamics();
        domFilter(self.node.V.viewNode);
        self.onupdate(val);
    }
    self.onupdate = function(val) {}
    
    
    self._createPanel = function() {
        var panel = _jO(cr('div', 'wys_container'));
        self.panel = panel;
        panel.V.block = panel.cr('div', 'wys_panel fa');
        
        
        
        self._createButton('SVG:bold'        , 'bold');
        self._createButton('SVG:italic'      , 'italic');
        
        self._createButton('SVG:alignLeft'   , 'justifyLeft');
        self._createButton('SVG:alignRight'  , 'justifyRight');
        self._createButton('SVG:alignCenter' , 'justifyCenter');
        self._createButton('SVG:alignFull'   , 'justifyFull');
        
        self._createButton('SVG:header,big'  , 'formatBlock', 'h3');
        self._createButton('SVG:text,big'    , 'formatBlock', 'p');
        self._createButton('SVG:quote'       , 'formatBlock', 'blockquote');
        
        
        var colBlock = self.panel.V.block.cr('div', 'colBlock');
        self._createButton(',col'     , 'foreColor,hiliteColor',   '%wys1' , colBlock);
        self._createButton(',col'     , 'foreColor,hiliteColor',   '%wys2' , colBlock);
        self._createButton(',col'     , 'foreColor,hiliteColor',   '%wys3' , colBlock);
        self._createButton(',col'     , 'foreColor,hiliteColor',   '%wys4' , colBlock);
        self._createButton(',col'     , 'foreColor,hiliteColor',   '%wys5' , colBlock);
        self._createButton(',col'     , 'foreColor,hiliteColor',   '%wys6' , colBlock);
        self._createButton(',col'     , 'foreColor,hiliteColor',   '%wys7' , colBlock);
        self._createButton(',col'     , 'foreColor,hiliteColor',   '%wys8' , colBlock);
        
        //-self._createButton('List'     , 'insertUnorderedList');
        //-self._createButton('Clear'    , 'removeFormat');
        
        
        
        //-self._imgSelector = cr('input').attr({type:'file',multiple:'true'});
        //-self._imgSelector.onchange = function(ev) {
        //-    
        //-    map(ev.target.files, function(file) {
        //-        createImage(confImage.type, file, confImage.size, function(urlList, media) {
        //-            
        //-            var newNode = cr('img').attr({
        //-                'data-imagetype':'image',
        //-                'data-media':     media.id
        //-            });
        //-            self._galleryImageSetUrls(newNode, urlList);
        //-            
        //-            insToSelection(newNode);
        //-        });
        //-        
        //-    });
        //-    
        //-}
        //-self._createNodeBtn('Img', function(ev) {
        //-    self._imgSelector.click();
        //-    return false;
        //-});
        
        
        
        self._galSelector = cr('input').attr({type:'file',multiple:'true'});
        self._galSelector.onchange = function(ev) {
            
            map(ev.target.files, function(file) {
                createImage(confImage.type, file, confImage.size, function(urlList, media) {
                    
                    var newNode = cr('img', 'pr_gallery').attr({
                        'data-imagetype':'gallery-image',
                        'data-media':     media.id
                    });
                    
                    self._galleryImageProcessor(newNode);
                    self._galleryImageSetUrls(newNode, urlList);
                    
                    insToSelection(newNode);
                });
                
            });
            
        }
        self._createNodeBtn('SVG:image,big', function(ev) {
            self._galSelector.click();
            return false;
            
        });
        
        
        
        self._createNodeBtn('SVG:link,big', function(ev) {
            document.execCommand('insertHTML', false, '<a href="">link</a>');
            
            return false;
        });
        
        
        return panel;
    }
    
    
    
    self._createVisual = function(strMap, parent) {
        strMap = parseLS(strMap);
        var button = self.panel.V.block.cr('div','asBtn fa '+strMap[1]||'');
        
        if ( strMap[0].indexOf('SVG:') == 0 ) {
            SVG[strMap[0].sl([4])](button);
        } else {
            button.VAL(PAGE.ld(strMap[0]));
        }
        
        if ( parent ) {
            parent.attach(button);
        }
        
        clearEvents(button);
        return button
    }
    
    
    self._createButton = function(strMap, commMap, attr, parent) {
        var button = self._createVisual(strMap, parent);
        commMap = parseLS(commMap);
       
        if ( attr && attr[0] == '#' ) { button.style.backgroundColor=attr; }
        
        button.onclick = function() {
            if ( EVENT.data.key.ctrl && commMap[1] ) {
                document.execCommand(commMap[1], false, attr);
            } else {
                document.execCommand(commMap[0], false, attr);
            }
            
            return false;
        }
        
    }
    
    self._createNodeBtn = function(strMap, func) {
        var button = self._createVisual(strMap);
        button.onclick = func;
    }
    
    
});

function wysiwyg(node, menuBlock) {
    if ( !def(node._wysiwyg) ) {
        node._wysiwyg = new SUBPROGRAM.wysiwyg();
        node._wysiwyg.init(node);
    }
    if ( def(menuBlock) ) {
        node._wysiwyg.placeMenu(menuBlock);
    }
    return node._wysiwyg;
}

