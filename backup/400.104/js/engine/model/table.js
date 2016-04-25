
window.TABLE = {}

ENGINE.tableProcessors = lsMapToDict({
    'displaydate,created_at,updated_at,expiry,mtime':'datetime'
});

ENGINE.tableAdapters = lsMapToDict({
    'amount,amount_in,amount_out':'money',
    'status':'tstatus'
});


function eTable(model, data) {
    var self   = this;
    self.model = TABLE;
    self.storKey = 'tbl_'+model;
    
    var proc   = ENGINE.tableProcessors;
    var adapt  = ENGINE.tableAdapters;
    
    self.init = function() {
        self.data = mergeObjects({
            fields: 'id',
            models: {},
            customFields: {},
            hasRange: false,
            cls: '',
            clsCols: [],
            customRangeFilter: {},
            customTranslate: {},
            customRangeSorter: [],
            lineCls: function(obj) { return ''; },
            lineHeight: 0
        }, data);
        self.data.fields = parseLS(self.data.fields);
        self.data.models = lsMapToDict(self.data.models);
        
        self.hideMap = parseObj(glob(self.storKey)||[]);
        
        
        
        self.conf = CO(CONF.engine.table);
        self.page = 0;
        self.sort = ['id', true];
        self.selector = {};
        
        self.lineNodes  = [];
        self.sorter     = new SUBPROGRAM.tableSorter();
        
        self.nodes      = {}
        self.head       = null;
        self.tableBlock = null;
        
        self.cHeadNodes = {
            filter:[],
            sorter:[]
        };
        
        self.edFunc = self._edFuncPh;
        
        if(def(EDITOR[model])) { self.edFunc = self._edFunc; }
        
        TABLE[model] = self.prep;
        TABLE[model].adjAndShow = function(list,todo) {
            self.recalcHeight(EVENT.data.windowSize.y - (CONF.engine.table.offsetTop || 0));
            self.prep(list,todo);
        }
    }
    
    
    self.recalcHeight = function(y) {
        self.sizeY = y;//- block.offsetHeight - self.conf.offsetTop;
        
        if ( self.sizeY > 0 && self.data.lineHeight > 0 ) {
            self.conf.entitiesPerPage = Math.floor(self.sizeY / self.data.lineHeight);
        } else {
            self.conf.entitiesPerPage = CONF.engine.table.entitiesPerPage;
        }
        log(self.sizeY, self.data.lineHeight, self.conf);
    }
    
    
    self._getFilter = function() {
        if ( !self.data.hasRange ) { return null; }
        return {
            selector: self.selector,
            order: [self.sort],
            rng:   [self.conf.entitiesPerPage*self.page, self.conf.entitiesPerPage]
        };
    }
    
    self.prep = function(list, todo) {
        todo = todo || POP.table.show;
        self.lastCall = [list, todo];
        
        var table = self.build(list);
        todo(table);
    }
    
    
    
    self.buildBasis = function() {
        self.basicBlock              = _jO(cr('div', 'jAdminTable'));
        self.basicBlock.V.header     = self.basicBlock.cr('div', 'atHead');
        self.basicBlock.V.tableBlock = self.basicBlock.cr('div', 'adminTableBlock');
        
        if ( self.data.hasRange ) {
            self.pbPrev  = self.basicBlock.V.header.cr('div', 'asBtn arr prev').VAL('prev');
            self.pbPages = self.basicBlock.V.header.cr('div', 'pageCont');
            self.pbNext  = self.basicBlock.V.header.cr('div', 'asBtn arr next').VAL('next');
            
            SVG.arrLeft.bg(self.pbPrev);
            SVG.arrRight.bg(self.pbNext);
            
            clearEvents(self.pbPrev).onclick = function() {
                self.page = Math.max(self.page-1, 0);
                self.build();
                return false;
            }
            clearEvents(self.pbNext).onclick = function() {
                self.page = Math.min(self.page+1, self.pageCount-1);
                self.build();
                return false;
            }
            
            self.fetchPages();
        }
    }
    
    
    self._crPageLink = function(ind) {
        self.pagesNodes[ind] = self.pbPages.cr('div','pbPage').VAL((ind+1).toLen());
        self.pagesNodes[ind]._selfInd = ind;
        
        self.pagesNodes[ind].onclick = function() {
            self.page = this._selfInd;
            self.build();
        }
    }
    
    self._crPages = function() {
        if ( self.pbPages && self.totalElems ) {
            self.pagesNodes = [];
            
            var pageCount = Math.ceil(self.totalElems / self.conf.entitiesPerPage);
            self.pageCount = pageCount;
            var pageRng = RNG(pageCount);
            self.pbPages.innerHTML = '';
            
            self._crPageLink(0);
            if ( self.page > 101) { self._crPageLink(self.page-100); }
            pageRng.sl([Math.max(self.page-4, 1),Math.min(self.page+5, pageCount-1)]).each(self._crPageLink);
            if ( self.page < pageCount - 101 ) { self._crPageLink(self.page+100); }
            self._crPageLink(pageCount-1);
        }
    }
    
    self.fetchPages = function() {
        self.pagesNodes = [];
        self._crPages();
        if ( self.pagesNodes[self.page] ) { self.pagesNodes[self.page].addCls('active'); }
    }
    
    
    self.build = function(list) {
        if ( !def(self.basicBlock) ) { self.buildBasis(); }
        
        self.tableBlock = self.tableBlock || self.basicBlock.V.tableBlock.cr('table', 'adminTable '+self.data.cls);
        self.tableHead  = self.tableHead  || self.tableBlock.cr('thead');
        self.tableBody  = self.tableBody  || self.tableBlock.cr('tbody');
        
        var node = self.tableBlock
        
        self.tableHead.attach(self._buildFilter());
        self.tableHead.attach(self._buildHeader());
        if ( self.data.hasRange ) {
            self._fetchHeader();
        }
        
        map(self.cHeadNodes.filter, function(node, ind) {
            if ( self.hideMap.contains(ind) ) {
                self.cHeadNodes.filter[ind].addCls('hidden');
                self.cHeadNodes.sorter[ind].addCls('hidden');
            } else {
                self.cHeadNodes.filter[ind].remCls('hidden');
                self.cHeadNodes.sorter[ind].remCls('hidden');
            }
        });
        
        
        if ( !def(list) ) {
            ORM.req([model,PAGE.lang,'select'].join(':'), function(list, t, fullData) {
                self.totalElems = fullData.count;
                self.fetchPages();
                self.lastCall[0] = list;
                self._build(self.tableBody, list);
            }, self._getFilter());
        } else {
            self._build(self.tableBody, list);
        }
        
        return self.basicBlock;
    }
    
    self._build = function(node, list) {
        map(self.lineNodes, detach);
        self.lineNodes = [];
        
        map(list, function(obj) {
           node.attach(self._buildLine(obj)); 
        });
        
        if ( !self.data.hasRange ) { tm(function() { self.sorter.setTable(node, 1); }, 100); }
    }
    
    
    
    
    self._doFilter = function() {
        var rules = {};
        map(self.filterHead._nodes, function(node) {
            if ( node._filter.val.rp(/\s/g,'').length > 0 ) {
                rules[node._field] = node._filter.val.toLowerCase();
            }
        });
        
        map(self.lineNodes, function(node) {
            var test = mapO(rules, function(val, key) {
                return node._filterData[key].contains(val)
            })
            
           if ( test ) {
               node.remCls('hidden');
           } else {
               node.addCls('hidden');
           }
        });
    }
    
    
    
    
    
    
    self._buildFilter = function() {
        if ( self.filterHead ) { return self.filterHead; }
        
        var line  = cr('tr');
        self.filterHead = line;
        self.filterHead._nodes = [];
        
        
        
        
        var sttBlock = line.cr('th', 'manage');
        self.btnCols = sttBlock.cr('div','asBtn fa left');
        SVG.menu(self.btnCols.cr('div','svg'));
        self.btnClearFilters = sttBlock.cr('div','asBtn fa left');
        SVG.close(self.btnClearFilters.cr('div','svg'));
        
        self.btnCols.onclick = function() {
            var strs = [];
            //-self.hideMap = glob(self.storKey)||[];
            
            
            var ind = 0;
            mapO(self.data.customFields, function(func, fields) {
                map(parseLS(fields), function(val) {
                    var newNode = cr('div');
                    newNode.ind = ind;
                    newNode._isActive = !self.hideMap.contains(newNode.ind);
                    newNode.className = 'exch-table-filt-item ' + (newNode._isActive && 'on' || 'off');
                    newNode.VAL( self.data.customTranslate[val] || val);
                    
                    strs.push([newNode, function () {
                        if ( newNode._isActive ) {
                            self.hideMap.add(newNode.ind);
                        } else {
                            self.hideMap.remove(newNode.ind);
                        }
                        glob(self.storKey, parseStr(self.hideMap));
                        self.build();
                    }]);
                    
                    ind += 1;
                });
            });
            
            log(self.hideMap);
            var menu = new OPT(strs);
            menu.open();
        }
        
        
        self.btnClearFilters.onclick = function() {
            self.selector = {};
            var t = self.filterHead;
            self.filterHead = null;
            t.insBefore(self._buildFilter());
            t.detach();
            
            self.build();
        }
        
        
        
        
        
        
        map(self.data.fields, function(field) {
            
            var col = line.cr('th', 'f_'+field);
            col._field = field;
            col._filter = col.cr('input').attr({
                type:'text',
                placeholder:'filter'
            });
            
            col._filter.onkeyup = function() {
                self._doFilter()
            }
            
            line._nodes.push(col);
            
        });
        
        self.cHeadNodes.filter = [];
        
        if ( self.data.hasRange ) {
            mapO(self.data.customFields, function(func, fields) {
                map(parseLS(fields), function(val) {
                    var col = line.cr('th');
                    
                    if ( self.data.customRangeFilter[val] ) {
                        col.attach(self.data.customRangeFilter[val](self,val));
                    }
                    self.cHeadNodes.filter.push(col);
                });
            });
        } else {
            mapO(self.data.customFields, function(func, fields) {
                map(parseLS(fields), function(val) {
                    var col = line.cr('th');
                    col._field = val;
                    col._filter = col.cr('input').attr({
                        type:'text',
                        placeholder:'filter...'
                    });
                    
                    col._filter.onkeyup = function() {
                        self._doFilter()
                    }
                    
                    line._nodes.push(col);
                    self.cHeadNodes.filter.push(col);
                });
            });
        }
        
        
        return line;
    }
    
    self._buildHeader = function() {
        if ( self.head ) { return self.head; }
        
        var line  = cr('tr');
        self.head = line;
        self.head._nodes = [];
        
        
        
        if ( def(EDITOR[model]) ) {
            EDITOR[model].create({}, function(button) {
               line.cr('th', 'manage').attach(button); 
            });
        } else {
            line.cr('th', 'manage').VAL(PAGE.ld('man'));
        }
        
        
        map(self.data.fields, function(field) {
            
            var col = line.cr('th').VAL(PAGE.ld(field));
            col._field = field;
            
            col.onclick = function() {
                if ( col._field == self.sort[0] ) {
                    self.sort[1] = !self.sort[1];
                } else {
                    self.sort = [col._field, true];
                }
                self.build();
            }
            
            self.head._nodes.push(col);
        });
        
        
        self.cHeadNodes.sorter = [];
        
        if ( self.data.hasRange ) {
            
            mapO(self.data.customFields, function(func, fields) {
                map(parseLS(fields), function(val) {
                    var str = self.data.customTranslate[val] || val;
                    var col = line.cr('th').VAL(PAGE.ld(str));
                    
                    if ( self.data.customRangeSorter.contains(val) ) {
                        col._field = val;
                        
                        col.onclick = function() {
                            if ( col._field == self.sort[0] ) {
                                self.sort[1] = !self.sort[1];
                            } else {
                                self.sort = [col._field, true];
                            }
                            self.build();
                        }
                        
                        self.head._nodes.push(col);
                    }
                    
                    self.cHeadNodes.sorter.push(col);
                });
            });
        } else {
            var ind = 0;
            mapO(self.data.customFields, function(func, fields) {
                map(parseLS(fields), function(val) {
                    val = self.data.customTranslate[val] || val;
                    var col = line.cr('th').VAL(PAGE.ld(val));
                    
                    self.cHeadNodes.sorter.push(col);
                });
            });
        }
        
        return line;
    }
    
    self._fetchHeader = function() {
        map(self.head._nodes, function(node) {
            if ( self.sort[0] == node._field ) {
                if (self.sort[1]) {
                    SVG.arrBottom.bg(node);
                } else {
                    SVG.arrTop.bg(node);
                }
            } else {
                SVG.clearBg(node);
            }
            
            node.onclick = function() {
                if ( node._field == self.sort[0] ) {
                    self.sort[1] = !self.sort[1];
                } else {
                    self.sort = [node._field, true];
                }
                self.build();
            }
        })
    }
    
    
    
    self._buildLine = function(obj, line) {
        
        line = self.nodes[obj._oid]||line||cr('tr', self.data.lineCls(obj) );
        line._filterData = {};
        self.nodes[obj._oid] = line;
        self.lineNodes.push(line);
        
        if ( !line._hasEvent ) {
            self._buildLineContent(obj, line);
            ORM.onStore(obj._oid, function(newObj) {
                self._buildLineContent(newObj, line);
            });
        }
        line._hasEvent = true;
        
        return line;
    }
    
    self._buildLineContent = function(obj, line) {
        line.innerHTML = '';
        
        self.edFunc(obj, line);
        
        map(self.data.fields, function(field) {
            if ( !def(obj[field]) ) {
                line.cr('td');
            } else if ( def(self.data.models[field]) ) {
                self._addVis(line.cr('td'), obj, field, line);
            } else {
                var node = line.cr('td').VAL(obj[field]||'');
                
                if ( def(adapt[field]) ) {
                    ADAPTER[adapt[field]].process(node);
                }
                if ( def(proc[field]) ) {
                    PROCESSOR[proc[field]].process(node);
                }
                
                line._filterData[field] = node.textContent.toLowerCase();
            }
        });
        
        var i = 0;
        mapO(self.data.customFields, function(func, field) {
            var fMap = parseLS(field);
            map(func(obj), function(val, key) {
                var node = line.cr('td', [self.data.clsCols[i]||'',(self.hideMap.contains(i) && 'hidden' || '')].join(' '));
                
                if ( typeof(val) == 'object') {
                    node.attach(val);
                } else {
                    node.VAL(val);
                }
                
                line._filterData[fMap[key]] = node.textContent.toLowerCase();
                i += 1;
            });
        });
        
        return line;
    }
    
    
    
    self._addVis = function(node, obj, field, line) {
        var structMap = parseLS(self.data.models[field]);
        var results = [];
        
        map(structMap, function(pathMap) {
            var newNode = node.cr('span');
            self._addVisEntity(newNode, obj, pathMap.split('.'), field, function() {
                line._filterData[field] = node.textContent.toLowerCase();
            });
        });
        
        return node;
    }
    
    self._addVisEntity = function(node, obj, pathMap, field, func) {
        
        var ent = pathMap.splice(0, 1)[0];
        if ( !def(field) ) {
            field = ent;
            ent   = self.data.models[field];
        }
        if ( def(obj[field]) ) {
            var name = [ent,obj[field]].join('_');
            ORM.prep(name, function(rObj) {
                if(pathMap.length == 0) {
                    node.val = ORM.getVisName(rObj)+' ';
                    func();
                } else {
                    self._addVisEntity(node, rObj, pathMap, null, func);
                }
            })
        }
    }
    
    
    self._edFunc = function(obj, line) {
        EDITOR[model].edit(obj, function(button) {
           line.cr('td', 'manage').attach(button); 
        });
    }
    
    self._edFuncPh = function(obj, line) {
        line.cr('td', 'manage'); 
    }
    
    
    self.init();
}




eTable.bool = function(obj, key) {
    var newNode = cr.bool().VAL(obj[key]||false);
    
    
    newNode.onupdate(function(val) {
        var nd = {};
        nd[key] = val;
        ORM.req(obj._oid+':update',nd);
        
    });
    
    return newNode;
}




eTable.INP = {};

eTable.INP.like = function(self, field) {
    var block = cr('input').attr({type:'text',placeholder:'filter...'});
    
    block._doFilter = function() {
        var val = block.val;
        
        if ( val == '' ) {
            delete self.selector[field];
        } else {
            self.selector[field] = ['like',['%','%'].join(val)];
        }
        self.build();
    }
    
    block.onkeyup = function(ev) {
        if ( ev.keyCode == 13 ) {
            block._doFilter();
        }
    }
    block.onupdate(block._doFilter);
    
    return block;
}


eTable.INP.number = function(self, field) {
    var block = cr('input').attr({type:'number',placeholder:'filter...'});
    
    block._doFilter = function() {
        var val = block.val;
        
        if ( val == '' ) {
            delete self.selector[field];
        } else {
            self.selector[field] = ['=',parseFloat(val)];
        }
        self.build();
    }
    
    block.onkeyup = function(ev) {
        if ( ev.keyCode == 13 ) {
            block._doFilter();
        }
    }
    block.onupdate(block._doFilter);
    
    return block;
}


eTable.INP.dropdown = function(self, field, dd) {
    dd['None'] = '?';
    var block = cr.dropdown(dd);
    block.val = 'None';
    
    block.onupdate(function(val) {
        if ( val == 'None' ) {
            delete self.selector[field];
        } else {
            self.selector[field] = ['=',val];
        }
        self.build();
    });
    
    return block;
}

eTable.INP.modelDropdown = function(self, field, key) {
    return eTable.INP.dropdown(self, field, ORM.getDropdownMap(key));
}

eTable.INP.bool = function(self, field) {
    var block = cr.bool3();
    block.onupdate(function() {
        if ( block.val == null ) {
            delete self.selector[field];
        } else {
            self.selector[field] = ['=',block.val];
        }
        self.build();
    })
    return block;
}


eTable.INP.rangeNumber = function(self, field) {
    var block = cr('div', 'rng');
    block.inp1 = block.cr('input').attr({type:'number',placeholder:'<'});
    block.inp2 = block.cr('input').attr({type:'number',placeholder:'>'});
    
    block._doFilter = function() {
        var result = [];
        
        if ( block.inp2.val ) {
            result.splice(0,0, '<',block.inp2.val.fromDec());
        }
        
        if ( block.inp1.val ) {
            result.splice(0,0, '>',block.inp1.val.fromDec());
        }
        
        self.selector[field] = result;
        self.build();
    }
    
    block.doFilter = function(ev) {
        if ( ev.keyCode == 13 ) {
            block._doFilter();
        }
    }
    
    block.inp1.onkeyup = block.doFilter;
    block.inp2.onkeyup = block.doFilter;
    block.inp1.onupdate(block._doFilter);
    block.inp2.onupdate(block._doFilter);
    
    return block;
}
























