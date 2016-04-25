
new eSubprogram('wysiwyg', function(onfinish) {
    var self = this;
    var confImage = CONF.engine.articleImage;
    
    var phRe = /\<\!\-\-\%([^-:]+)\:?([^-]+)?/g;
    
    self.init = function(node, params) {
        self.params = mergeObjects({
            is_bb: false
        }, params);
        
        self.node = _jO(node);
        node.__isHtml = true;
        self._isEditing = false;
        
        self._createPanel();
        self.wrapper = cr('div','wys_inside');
        self.wrapper.attach(self.panel);
        self.menuTarget = self.wrapper;
        self.bb_entities = {};
        
        self.fetchInt = null;
        
        self.blockElems = CONF.engine.defaultDomFilterRules.stackable.split(',');
    }
    
    self.findComments = function(el) {
        var arr = [];
        for(var i = 0; i < el.childNodes.length; i++) {
            var node = el.childNodes[i];
            if(node.nodeType === 8) {
                arr.push(node);
            } else {
                arr.push.apply(arr, self.findComments(node));
            }
        }
        return arr;
    };
    
    
    self.filterInOut = f(html, callback) {
        var t = cr('div');
        t.innerHTML = html;
        var comments = self.findComments(t);
        
        var q = new EQ(f() {
            callback(t.innerHTML);
        });
        
        var processed = 0;
        map(comments, function(comment) {
            var mp = comment.val.sl([1]).split(':');
            
            if ( def(self.bbMap[mp[0]]) ) {
                processed += 1;
                q.add( f(done) {
                    self.bbMap[mp[0]](self, comment, mp.sl([1]), f(newNode) {
                        //-log(newNode);
                        comment.insBefore(newNode);
                        comment.detach();
                        tm(done);
                    }, f() {
                        tm(done);
                    });
                });
                
            }
        });
        
        if ( processed == 0 ) { q.doNext(); }
        
    }
    self.filterOutIn = f(html) {
        self.bb_entities = {};
        var t = cr('div');
        t.innerHTML = html;
        
        mapO(self.bbRevMap, function(parser, selector) {
            var nodeList = S(selector, t);
            map(nodeList, function(node) {
                var presult = parser(self, node);
                
                if ( presult ) {
                    node.outerHTML = '<!--%'+presult.join(':')+'-->';
                }
            });
        });
        
        return t.innerHTML;
    }
    
    
    self.bbConf = CONF.project.bbRules || {in:{},out:{}};
    self.bbMap = self.bbConf.in;
    self.bbRevMap = self.bbConf.out;
    
    
    
    
    
    self.placeMenu = function(dom) {
        self.menuTarget = dom;
    }
    self.resetMenu = function() {
        self.menuTarget = self.wrapper;
    }
    
    
    self.ensureEmpty = f() {
        var sel = window.getSelection();
        
        if ( sel.anchorNode && sel.anchorNode.nodeType != 1 && sel.anchorNode.parentNode == self.node.V.viewNode ) {
            var node = setTag(sel.anchorNode, CONF.engine.defaultDomFilterRules.textwrap);
        }
    }
    
    
    self.focus = function() {
        self.panel.addCls('active');
        
    }
    self.blur  = function() {
        self.panel.remCls('active');
    }
    
    self.disableKeys = function(ev) {
        self.ensureEmpty();
        if ( ev.keyCode == 9 ) {
            ev.preventDefault();
        }
    }
    
    self.getBlockToFormat = function() {
        var sel    = window.getSelection();
        var selObj = sel.anchorNode;
        if ( !selObj ) { return null; }
        
        for ( var i = 0; !(selObj._tag && self.blockElems.contains(selObj._tag)); i++ ) {
            selObj = selObj.parentNode;
            if ( !selObj || (selObj == self.node.V.viewNode) ) { return null; }
        }
        
        selObj.remattr('style');
        return selObj;
    }
    
    self.formatBlock = function(tag) {
        var selObj = self.getBlockToFormat();
        if ( !selObj ) { return null; }
        selObj = setTag(selObj, tag);
    }
    
    self.checkKeys = function(ev) {
        if ( ev.keyCode == 9 ) {
            ev.preventDefault();
            var selObj = self.getBlockToFormat();
            if ( !selObj ) { return false; }
            
            if ( selObj._tag == 'pre' ) {
                selObj = setTag(selObj, 'p');
                //-document.execCommand('formatBlock', false, 'p');
            } else {
                selObj = setTag(selObj, 'pre');
                //-document.execCommand('formatBlock', false, 'pre');
            }
            
        } else {
            self.ensureEmpty();
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
            
            if ( self.params.is_bb ) {
                self.filterInOut(self.node.V.viewNode.innerHTML, f(nhtml) {
                    self.node.V.viewNode.innerHTML = nhtml;
                    domFilter(self.node.V.viewNode);
                });
            }
            
            self.node.V.viewNode.onpaste = function(ev) {
                //-log({html:self.node.V.viewNode.innerHTML,ev:ev});
                tm(function() {
                    self.fetchDynamics();
                    domFilter(self.node.V.viewNode);
                });
            }
            
            domFilter(self.node.V.viewNode);
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
            _jO(dom);
            
            if ( !def(dom._selfOpt) ) {
                
                var params = [
                    [PAGE.ld('crop preview'), function() {
                        cropImage(dom.D.media, reqPreview, function(urlMap) {
                            
                            dom.attr('data-isfull', '0');
                            delete dom._selfOpt;
                            
                            var rd = CO(reqThumb);
                            var mp = rd[confImage.thumbSize].split('x');
                            mp[2] = '2';
                            rd[confImage.thumbSize] = mp.join('x');
                            
                            cropImage(dom.D.media, rd, function(urlMap) {
                                self._updateImagesSrc(dom.D.media, urlMap);
                            }, {from:confImage.startSize,crop:false});
                            
                            //-log(reqPreview,urlMap);
                            
                        });
                    }]
                ];
                
                var flagNode = cr('div','flagInside');
                
                
                if ( dom.D.isfull == '1' ) {
                    cr.bool(null, flagNode).val = (true);
                    flagNode.cr('span').VAL(PAGE.ld('basicimage'));
                    
                    params.splice(0,0, [flagNode, function() {
                        dom.attr('data-isfull', '0');
                        delete dom._selfOpt;
                        
                        self._onupdate();
                        SYS.notify(PAGE.ld('done'),'green');
                    }]);
                } else {
                    cr.bool(null, flagNode).val = (false);
                    flagNode.cr('span').VAL(PAGE.ld('basicimage'));
                    
                    params.splice(0,0, [flagNode,function() {
                        
                        delete dom._selfOpt;
                        
                        if ( !def(dom.D[confImage.startSizeSingle]) ) {
                            var rd = [];
                            rd[confImage.startSizeSingle] = confImage.size[confImage.startSizeSingle];
                            cropImage(dom.D.media, rd, function(urlMap) {
                                self._updateImagesSrc(dom.D.media, urlMap);
                                dom.attr('data-isfull', '1');
                                self._onupdate();
                                SYS.notify(PAGE.ld('done'),'green');
                            }, {crop:false});
                        } else {
                            dom.attr('data-isfull', '1');
                            self._onupdate();
                            SYS.notify(PAGE.ld('done'),'green');
                        }
                        
                    }]);
                }
                
                
                dom._selfOpt = new OPT(params);
                
            }
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
            
            if ( urlList.basic )                      { dom.attr({'data-basic':urlList.basic}); }
            if ( urlList[confImage.startSizeSingle] ) { dom.attr({'data-preprop':urlList[confImage.startSizeSingle]}); }
            if ( urlList[confImage.startSize] )       { dom.attr({'data-preview':urlList[confImage.startSize]}); }
            if ( urlList[confImage.thumbSize] )       { dom.attr({'src'         :urlList[confImage.thumbSize]}); }
        }
        
        dom.attr({
            'width'   : size[0],
            'height'  : size[1]
        });
    }
    
    
    self.fetchDynamics = function() {
        
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
                } else if ( type == "gallery-image" ) {
                    self._galleryImageProcessor(node);
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
                node.__eView.cr('p').VAL(PAGE.ld('new tab'));
                node.__eView.V.ntab = cr.bool(null,node.__eView).VAL(true);
                node.__eView.V.submit = node.__eView.cr('div', 'asBtn').VAL(PAGE.ld('save'));
                
                
                clearEvents(node).onclick = function() {
                    if ( self._isEditing ) {
                        node.__eView.V.link.val = node.href;
                        node.__eView.V.text.val = node.val;
                        node.__eView.V.ntab.val = !node.attr('data-ct');
                        var inst = POP.drag.showNew(node.__eView, null, {isSmall:true});
                        
                        node.__eView.V.submit.onclick = function() {
                            node.href = node.__eView.V.link.val;
                            node.val  = node.__eView.V.text.val;
                            
                            if ( node.__eView.V.ntab.val ) {
                                node.remattr('data-ct');
                            } else {
                                node.attr('data-ct','this');
                            }
                            
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
        
        if ( self.params.is_bb ) {
            val = self.filterOutIn(val);
        }
        
        self.onupdate(val);
    }
    self.onupdate = function(val) {}
    
    
    self._createPanel = function() {
        var panel = _jO(cr('div', 'wys_container'));
        self.panel = panel;
        panel.V.block = panel.cr('div', 'wys_panel fa');
        
        
        self._createButton('SVG:bold'        , 'bold');
        self._createButton('SVG:italic'      , 'italic');
        //-self._createButton('T,b bigText'     , 'bold');
        //-self._createButton('T,i bigText'     , 'italic');
        self._createButton('T,u bigText'     , 'underline');
        self._createButton('T,s bigText'     , 'strikeThrough');
        
        self._createButton('SVG:alignLeft'   , 'justifyLeft');
        self._createButton('SVG:alignRight'  , 'justifyRight');
        self._createButton('SVG:alignCenter' , 'justifyCenter');
        self._createButton('SVG:alignFull'   , 'justifyFull');
        
        self._createNodeBtn('SVG:header,big' , f() { self.formatBlock('h3'); });
        self._createNodeBtn('SVG:text,big'   , f() { self.formatBlock('p'); });
        self._createNodeBtn('SVG:quote'      , f() { self.formatBlock('blockquote'); });
        
        
        
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
        
        
        
        var imageCreation = f(file, func) {
            createImage(confImage.type, file, confImage.size, function(urlList, media) {
                
                var newNode = cr('img', 'pr_gallery').attr({
                    'data-imagetype': 'gallery-image',
                    'data-media':     media.id,
                    'data-isfull':    '1'
                });
                
                self._galleryImageProcessor(newNode);
                self._galleryImageSetUrls(newNode, urlList);
                
                
                func(newNode);
            });
        }
        
        
        var imageInsertion = f(file, selName) {
            imageCreation(file, f(newNode){
                if ( selName ) { restoreSelection(selName); }
                
                insToSelection(newNode);
            });
        }
        
        self._galSelector = cr('input').attr({type:'file',multiple:'true'});
        self._galSelector.onchange = function(ev) {
            map(ev.target.files, imageInsertion);
        }
        self._createNodeBtn('SVG:image,big', function(ev) {
            self._galSelector.click();
            return false;
            
        });
        
        
        self._createNodeBtn('SVG:imagelink,big', function(ev) {
            saveSelection('sel_linkimage');
            
            SYS.input(PAGE.ld('image link'), 'center', f(url) {
                var newUrl = PROTOCOL.proxy.getUrl(url);
                
                imageInsertion(newUrl,'sel_linkimage');
                
            });
            
            return false;
            
        });
        
        
        
        self._createNodeBtn('SVG:imagesync,big', function(ev) {
            
            var images = S('img', self.node.V.viewNode);
            
            map(images, f(image) {
                
                var url = image.src;
                if ( url ) {
                    var purl = ENGINE.getUrlData(url);
                    if ( !purl.own ) {
                        if ( image.parentNode._tag == 'a' ) {
                            insBefore(image, image.parentNode);
                        }
                        var rurl = PROTOCOL.proxy.getUrl(url);
                        imageCreation(rurl, f(newNode) {
                            insBefore(newNode, image);
                            detach(image);
                        });
                    }
                    
                }
                
            })
            
            return false;
        });
        
        
        
        
        self._createNodeBtn('SVG:link,big', function(ev) {
            document.execCommand('insertHTML', false, '<a href="">link</a>');
            
            return false;
        });
        
        
        self.htmlOptsData = [];
        RNG(ORM.model.htmlblock).each(f(obj) {
            self.htmlOptsData.push([obj.title, f() {
                document.execCommand('insertHTML', false, '<img src="'+ENGINE.path.static+'/images/empty_disabled.png" data-imagetype="html" data-media="'+obj.id+'" alt=\'html "'+obj.title+'"\' />');
            }]);
        });
        self.htmlOpts = new OPT(self.htmlOptsData);
        self._createNodeBtn('SVG:html,big', function(ev) {
            self.htmlOpts.open();
            return false;
        });
        
        
        self._createNodeBtn('#,bigText', function(ev) {
            var sel = getSel();
            var txt = sel && sel.toString().rp('#','').replace(/[^\wа-яґєії]+/gi,'') || 'tag';
            txt = txt.toLowerCase();
            document.execCommand('insertHTML', false, '<a href="about:tag">#'+txt+'</a>');
            
            return false;
        });
        
        self._createButton('SVG:close,big' , 'removeFormat');
        
        
        
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

function wysiwyg(node, menuBlock, params) {
    
    if ( !def(node._wysiwyg) ) {
        node._wysiwyg = new SUBPROGRAM.wysiwyg();
        node._wysiwyg.init(node, params);
    }
    if ( def(menuBlock) ) {
        node._wysiwyg.placeMenu(menuBlock);
    }
    return node._wysiwyg;
}

