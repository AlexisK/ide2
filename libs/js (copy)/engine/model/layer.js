window.LAYER = {};

ENGINE.lastLayerUrl = null;

function eLayer(name, data) {
    var self   = this;
    self.model = LAYER;
    
    self.init = function() {
        self.data = mergeObjects({
            
            
            dom: cr('div'),
            select: ['.dynamicBlock'],
            parent: null,
            parentUrl: function() { return '/'; },
            hide: function() {},
            
            
            getData   : function(self, url, func, params) {
                getRawData(url, function(html) {
                    var domFilter = cr('div');
                    domFilter.innerHTML = html;
                    
                    self.data.parseDom(self, domFilter, url, func, params);
                });
            },
            
            parseDom : function(self, domFilter, url, func, params) {
                self.data.fetchLang(self, domFilter);
                self.data.fetchSelection(self, domFilter);
                
                if ( !params.noHistory ) {
                    self.data.fetchHistory(self, url);
                }
                
                if ( func ) { func(); }
            },
            
            
            fetchLang : function(self, dom) {
                var locsFrom = S('.relLoc', dom);
                var locsTo   = S('.relLoc', self.dom);
                
                if ( locsTo.length > 0 ) {
                    map(locsFrom, function(node) {
                        insBefore(node, locsTo[0]);
                    });
                } else {
                    map(locsFrom, function(node) {
                        self.attachHead.attach(node);
                    });
                }
                map(locsTo, detach);
            },
            
            
            fetchSelection: function(self, domFilter) {
                self.title = S('title', domFilter)[0].val;
                
                map(self.data.select, function(selector) {
                    
                    //-log(selector);
                    
                    var selMap = selector.split(':');
                    selector = selMap.splice(0,1)[0];
                    var attrs = selMap;
                    
                    var list_from = S(selector, domFilter);
                    var list_to   = S(selector, self.data.dom);
                    
                    //-log([selector, attrs, list_from,list_to]);
                    
                        
                    map(list_to, function(to, index) {
                        var from = list_from[index];
                        
                        if ( from ) {
                            var from_ver = from.attr('data-version');
                            var to_ver   = to.attr('data-version');
                            
                            if ( selector == '.canonical' && from._tag == 'link' && to._tag == 'meta' ) {
                                var newNode = cr('link', 'canonical').attr({rel:'canonical'});
                                to.insBefore(newNode);
                                to.detach();
                                to = newNode;
                            }
                            
                            
                            if ( !def(from_ver) || !def(to_ver) || from_ver != to_ver ) {
                                if ( def(attrs) && attrs.length > 0 ) {
                                    map(attrs, function(attrb) {
                                        
                                        to.attr(attrb, from.attr(attrb));
                                    });
                                    
                                } else {
                                    to.innerHTML = from.innerHTML;
                                    to.className = from.className + ' fa';
                                }
                                
                                
                                to.attr('data-version', from_ver);
                                if ( def(to.C) && def(to.C.processors) ) {
                                    to.C.processors = {};
                                }
                            }
                        } else {
                            to.innerHTML = '';
                            
                        }
                    });
                    
                });
            },
            
            fetchHistory: function(self, url) {
                //-log('history',url);
                document.title = self.title;
                setDocumentScroll();
                PAGE.url = url;
                ENGINE.lastLayerUrl = url;
                
                history.pushState({
                    selfUrl: url
                }, document.title, url);
                
            },
            
            
            ontravel: function(){}
            
            
        }, data);
        self.name = name;
        self.dom = self.data.dom;
        self.attachHead = self.dom;
        self.attachBody = self.dom;
        if ( self.attachHead == document || self.attachHead == window ) {
            self.attachHead = document.head;
            self.attachBody = document.body;
        }
        
        self._setUrl();
        
        LAYER[name] = self;
    }
    
    self._setUrl = function(url) {
        self.url = ENGINE.getUrlData(url||window.location.href)
    }
    
    self.fetchHistory = function() {
        if ( ENGINE.lastLayerUrl != self.url.url ) {
            ENGINE.lastLayerUrl = self.url.url;
            self.data.fetchHistory(self, self.url.url);
        }
    }
    
    self.rememberHistory = function() {
        self.title = S('title')[0].val;
        self._setUrl();
    }
    
    
    
    
    self.go = function(url, func, params) {
        params = mergeObjects({
            noHistory : false
        },params);
        
        if ( !url ) {
            self.fetchHistory();
        } else {
            
            self.urlData = ENGINE.getUrlData(url);
            self.data.getData(self, self.urlData.url, function() {
                self.url = self.urlData;
                self.data.ontravel(self);
                
                if ( def(func) ) { func(); }
                
                EVENT.emit('go', {
                    path: url,
                    layer: self,
                    params: params
                });
                EVENT.emit('insert');
                
            }, params);
        }
        
    }
    
    
    self.init();
}







CONF.engine.layer = CONF.engine.layer || {};
function layerManager() {
    var self = this;
    
    self.init = function() {
        //- ???
    }
    
    
    self._getLayer = function(url) {
        var layer = LAYER.main;
        var urlMap = ENGINE.getUrlData(url).map;
        
        mapO(CONF.engine.layer, function(patterns, key) {
            map(patterns, function(pattern) {
                var isPat = map(pattern, function(urlPart, i) {
                    if ( urlPart.length > 0 && urlPart != urlMap[i] ) { return false; }
                });
                
                if ( isPat ) {
                    layer = LAYER[key];
                    return false;
                }
            });
        })
        
        return layer;
    }
    
    
    self.go = function(url, func, params) {
        
        params = params||{};
        var layer = self._getLayer(url);
        //-log(url, layer);
        layer.go(url, func, params);
        
        if ( !params.noHide ) {
            mapO(LAYER, function(l) {
                if ( l != layer ) { l.data.hide({type:'go'}); }
            });
        }
    }
    
    self.recognisePos = function() {
        var layer = self._getLayer(window.location.href);
        layer.rememberHistory();
        layer.data.parseDom(layer, document, layer.url.url, function() {
            
            //- TBD!!!
            
        }, {noHistory:true});
        
        return layer;
    }
    
    self.fetchPos = function(func) {
        func = func || new T.F();
        var layer = self.recognisePos();
        
        
        
        if ( layer.data.parent ) {
            var parent = LAYER[layer.data.parent];
            var parentUrl = layer.data.parentUrl(window.location.href);
            parent.go(parentUrl, function() {
                layer.data.ontravel(layer);
                func();
            }, {noHistory:true,noHide:true})
        } else {
            func();
        }
        
    }
    
    self.init();
}

window.LM = new layerManager();















