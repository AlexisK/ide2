
window.TABLE2 = {}

ENGINE.tableHistory = parseObj(glob('tbl2History')||'[]');


function eTable2(name, data) {
    
    if ( name.contains(',') ) {
        map(parseLS(name), f(nm) {
            new eTable2(nm, data);
        });
        return 0;
    }
    //- multiple models table
    
    
    var self   = this;
    self.model = TABLE2;
    
    
    //- INITIALISATION
    self.init = function() {
        self.data = mergeObjects({
            level:%levelAdmin,
            contAddon:f(self,obj,parent){},
            filtAddon:f(self, dict){},
            strs:{},
            fields:['id'],
            fieldFunc:{},
            colCls:{},
            filter:{},
            sorter:{},
            rowGen:function(obj) { return cr('tr'); },
            cls:'',
            lineHeight: 25,
            heightOffset: 100,
            timeRange: null,
            model: name
        }, data);
        
        model = data.model || name;
        
        if ( def(data.prep) ) {
            map(parseLS(data.prep), function(model) {
                ORM.req(model+':select', new T.F(), {rng:[0,1000]});
            });
        }
        
        self._normalise();
        
        self.block = null;
        self.lineNodes = [];
        self.node = {};
        self.node.sorter = [];
        self.node.filter = [];
        
        self._perPage = 10;
        self._loadData();
        
        
        
        self.edFunc = function(obj, lineManager, fn) {
            self.edFuncORM(obj, fn);
            self.data.contAddon(self, obj, lineManager);
        };
        
        var ref = EDITOR[model];
        if ( ref ) {
            self.edFuncORM = function(obj, fn) {
                var delBtn = cr('div', 'asBtn fa');
                SVG.del(delBtn.cr('div','svg'));
                fn(delBtn);
                
                delBtn.onclick = function() {
                    var answer = confirm(PAGE.ld('delete')+'?');
                    
                    if ( answer ) {
                        log(obj._oid);
                        ORM.req(obj._oid+':delete', function() {
                            SYS.notify(PAGE.ld('done'), 'ok');
                            self.rebuild();
                        });
                    }
                }
                
                ref.edit(obj, fn);
            };
        } else {
            self.edFuncORM = new T.F();
        }
        
        self.lineHeightStr = self.data.lineHeight + 'px';
        
        TABLE2[name] = self;
    }
    
    
    
    
    self._normalise = function() {
        self.data.fieldFunc = lsMapToDict(self.data.fieldFunc);
        self.data.colCls    = lsMapToDict(self.data.colCls);
        self.data.filter    = lsMapToDict(self.data.filter);
    }
    
    self._strs    = function(key) { return self.data.strs     [key] || key; }
    self._colCls  = function(key) { return self.data.colCls   [key] || '';  }
    self._getFunc = function(key) { return self.data.fieldFunc[key] || TVIEW.def }
    self._getFilt = function(key) { return self.data.filter   [key] || function() { return null; }; }
    
    
    self._saveData = function() {
        if ( self.btnClearFilters ) {
            self.btnClearFilters.val = (okeys(self._selectBy).length == 0) && true || false;
        }
        
        glob('tbl2_'+model, parseStr({
            select : self._selectBy,
            range  : self._rangeBy,
            order  : self._orderBy,
            page   : self._page,
            hide   : self._hideMap
        }));
    }
    
    self._loadData = function() {
        var data = parseObj(glob('tbl2_'+model)||'[]')
        self._selectBy = data.select || {};
        self._rangeBy  = data.range  || [];
        self._orderBy  = data.order  || [];
        self._page     = data.page   || 0;
        self._hideMap  = data.hide   || [];
        
        $P(self, 'selectBy', function()     { tm(CEF(self._saveData)); return self._selectBy; },
                             function(data) { self._selectBy = data; self._saveData(); return self._selectBy; });
        $P(self, 'rangeBy' , function()     { tm(CEF(self._saveData)); return self._rangeBy;  },
                             function(data) { self._rangeBy  = data; self._saveData(); return self._rangeBy;  });
        $P(self, 'orderBy' , function()     { tm(CEF(self._saveData)); return self._orderBy;  },
                             function(data) { self._orderBy  = data; self._saveData(); return self._orderBy;  });
        $P(self, 'page'    , function()     { tm(CEF(self._saveData)); return self._page;     },
                             function(data) { self._page     = data; self._saveData(); return self._page;     });
        $P(self, 'hideMap' , function()     { tm(CEF(self._saveData)); return self._hideMap;  },
                             function(data) { self._hideMap  = data; self._saveData(); return self._hideMap;  });
    }
    
    
    
    
    
    
    
    //- FILTER
    self._getFilter = function() {
        var rng = [self._page * self._perPage, self._perPage];
        var ord = [];
        
        if ( self._orderBy.length == 2) { ord = [self._orderBy]; }
        
        var resp = CO({
            selector: self._selectBy,
            order:    ord,
            rng:      rng
        });
        
        self.data.filtAddon(self, resp);
        
        return resp
    }
    
    
    
    
    
    
    
    //- BUILDER
    self._buildFilter = function(field) {
        var newNode = self.blockFilters.cr('th');
        newNode._sel = self._getFilt(field)(self, field);
        if ( newNode._sel ) {
            newNode.addCls('hasSel');
            newNode.attach(newNode._sel);
            
            newNode._sel.chUpd = function() {
                if ( def(self.selectBy[field]) ) {
                    newNode._sel.setVal(self.selectBy[field]);
                } else {
                    newNode._sel.resetVal();
                }
            }
            newNode._sel.chUpd();
            
            self.node.filter.push(newNode);
        }
        
        
    }
    
    
    
    self._buildSorter = function(field) {
        var newNode = self.blockSorters.cr('th');
        
        newNode.val = self._strs(field);
        newNode._field = field;
        
        clearEvents(newNode).onclick = function() {
            if ( newNode._field == self.orderBy[0] ) {
                self.orderBy[1] = !self.orderBy[1];
            } else {
                self.orderBy = [newNode._field, true];
            }
            self.rebuild();
        }
        
        self.node.sorter.push(newNode);
    }
    
    
    self.buildTableZone = function() {
        
        self.btnCols = self.zoneTable.cr('div','asBtn fa left');
        SVG.menu(self.btnCols.cr('div','svg'));
        
        
        clearEvents(self.btnCols).onclick = function() {
            var strs = [];
            
            var ind = 0;
            map(self.data.fields, function(val) {
                var newNode = cr('div');
                newNode.ind = ind;
                newNode._isActive = !self.hideMap.contains(newNode.ind);
                newNode.className = 'exch-table-filt-item ' + (newNode._isActive && 'on' || 'off');
                newNode.VAL( self._strs(val) );
                
                strs.push([newNode, function () {
                    if ( newNode._isActive ) {
                        self.hideMap.add(newNode.ind);
                    } else {
                        self.hideMap.remove(newNode.ind);
                    }
                    self.hideMap = self.hideMap;
                    self.rebuild();
                }]);
                
                ind += 1;
            });
            
            var menu = new OPT(strs);
            menu.open();
        }
        
    }
    
    
    self.buildModelZone = function() {
        if ( EDITOR[model] && EDITOR[model].create ) {
            EDITOR[model].create((CONF.project.insertDefData[model] || { is_active:true }), function(btn) {
                self.zoneModel.attach(btn);
            });
        }
    }
    
    
    
    self._buildHead = function() {
        self.blockFilters = self.thead.cr('tr', 'filters');
        self.blockSorters = self.thead.cr('tr');
        
        self.zoneTable = self.blockFilters.cr('th', 'manage');
        self.zoneModel = self.blockSorters.cr('th', 'manage');
        
        self.buildTableZone();
        self.buildModelZone();
        
        self.node.sorter = [];
        self.node.filter = [];
        
        map(self.data.fields, function(field) {
            self._buildFilter(field);
            self._buildSorter(field);
            
        });
    }
    self._buildBody = function() {}
    
    
    self._buildPaginator = function() {
        self.pbPrev  = self.block.V.header.cr('div', 'asBtn arr prev').VAL('prev');
        self.pbPages = self.block.V.header.cr('div', 'pageCont');
        self.pbNext  = self.block.V.header.cr('div', 'asBtn arr next').VAL('next');
        self.pbtr    = self.block.V.header.cr('div', 'timeRange hidden');
        
        SVG.arrLeft.bg(self.pbPrev);
        SVG.arrRight.bg(self.pbNext);
        
        clearEvents(self.pbPrev).onclick = function() {
            self.page = Math.max(self.page-1, 0);
            self.rebuild();
            return false;
        }
        clearEvents(self.pbNext).onclick = function() {
            self.page = Math.min(self.page+1, self.pageCount-1);
            self.rebuild();
            return false;
        }
        
        self.trFrom = cr.calendartimeinput('small', self.pbtr);
        self.trTo   = cr.calendartimeinput('small', self.pbtr);
        
        
        var clearBlock = self.block.V.header.cr('div','clearFilter left');
        self.btnClearFilters = cr.bool('sel', clearBlock);
        clearBlock.cr('div').VAL(PAGE.ld('clear filter'));
        
        var refreshBlock = self.block.V.header.cr('div','asBtn clearFilter left').VAL(PAGE.ld('Refresh'));
        refreshBlock.onclick = f() {
            self.rebuild();
        }
        
        //-self.btnClearFilters = self.zoneTable.cr('div','asBtn fa left');
        //-SVG.close(self.btnClearFilters.cr('div','svg'));
        
        self.btnClearFilters.val = (okeys(self._selectBy).length == 0) && true || false;
        clearEvents(self.btnClearFilters).onclick = function() {
            
            self.selectBy = {};
            map(self.node.filter, function(node) { node._sel.chUpd(); });
            self.rebuild();
            
            self.btnClearFilters.val = true;
            
            return false;
        }
        
        
        
        self.backBlock = self.block.V.header.cr('a','clearFilter noHref left asBtn');
        
        
        self.fetchPages();
    }
    
    self.buildBasis = function() {
        self.block              = _jO(cr('div', 'jAdminTable'));
        self.block.V.header     = self.block.cr('div', 'atHead');
        self.block.V.tableBlock = self.block.cr('div', 'adminTableBlock');
        self.table              = self.block.V.tableBlock.cr('table', 'adminTable '+self.data.cls);
        self.thead              = self.table.cr('thead');
        self.tbody              = self.table.cr('tbody');
        
        self._buildPaginator();
        self._buildHead();
        self._buildBody();
    }
    
    
    
    
    
    
    //- FETCH STATE
    
    self._fetchTR = function() {
        if ( self.data.timeRange ) {
            self.pbtr.remCls('hidden');
        } else {
            self.pbtr.addCls('hidden');
        }
    }
    
    self._fetchSorter = function() {
        map(self.node.sorter, function(node) {
            if ( self.orderBy[0] == node._field ) {
                if (self.orderBy[1]) {
                    SVG.arrBottom.bg(node);
                } else {
                    SVG.arrTop.bg(node);
                }
            } else {
                SVG.clearBg(node);
            }
            
        });
    }
    
    self._crPageLink = function(ind) {
        self.pagesNodes[ind] = self.pbPages.cr('div','pbPage').VAL((ind+1).toLen());
        self.pagesNodes[ind]._selfInd = ind;
        
        self.pagesNodes[ind].onclick = function() {
            self.page = this._selfInd;
            self.rebuild();
        }
    }
    
    self._crPages = function() {
        self.pbPages.innerHTML = '';
        
        if ( self.pbPages && self.totalElems ) {
            self.pagesNodes = [];
            
            var pageCount = Math.ceil(self.totalElems / self._perPage);
            self.pageCount = pageCount;
            var pageRng = RNG(pageCount);
            
            
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
        
        if ( ENGINE.tableHistory.length >= 2 ) {
            var mod = ENGINE.tableHistory[ENGINE.tableHistory.length-2];
            self.backBlock.innerHTML = '';
            
            clearEvents(self.backBlock).onclick = function() { TABLE2[mod].show(); }
            self.backBlock.cr('div').VAL([PAGE.ld('Back to'),mod].join(' '));
        } else {
            self.backBlock.addCls('hidden');
        }
        
    }
    
    
    
    
    
    
    
    //-  REBUILD - content BUILDER
    self.rebuild = function() {
        ORM.req([model,PAGE.lang,'select'].join(':'), function(list, t, fullData) {
            self.totalElems = fullData.count;
            self.fetchPages();
            self._fetchSorter();
            self._fetchTR();
            //-self.lastCall[0] = list;
            self._build(self.tbody, list);
        }, self._getFilter());
    }
    
    self._build = function(node, list) {
        map(self.lineNodes, function(line) {
            ORM.event[line._stOid].remove(line._stFunc);
            detach(line);
        });
        
        self.lineNodes = [];
        node.innerHTML = '';
        
        map(self.data.fields, function(field, pos) {
            try {
                if ( self.hideMap.contains(pos) ) {
                    self.node.sorter[pos].addCls('hidden');
                    self.node.filter[pos].addCls('hidden');
                } else {
                    self.node.sorter[pos].remCls('hidden');
                    self.node.filter[pos].remCls('hidden');
                }
            } catch(err) {}
        });
        
        
        map(list, function(obj) {
           node.attach(self.buildLine(obj)); 
        });
        
    }
    
    
    
    self.buildLine = function(obj, noStore) {
        var line = self.data.rowGen(obj);
        
        self.lineNodes.push(line);
        
        if ( !line._hasEvent ) {
            self._buildLineContent(obj, line);
            
            if (  !noStore ) {
                line._stOid = obj._oid;
                line._stFunc = function(newObj) {
                    var dummyLine = self.data.rowGen(newObj, true);
                    line.className = dummyLine.className;
                    line.__statusText = dummyLine.__statusText;
                    
                    self._buildLineContent(newObj, line);
                };
                ORM.onStore(obj._oid, line._stFunc);
            }
        }
        line._hasEvent = true;
        
        return line;
    }
    
    
    self._buildLineContent = function(obj, line) {
        line.innerHTML = '';
        
        var man = line.cr('td','manage');
        self.edFunc(obj, man, function(node) { man.attach(node); });
        
        
        map(self.data.fields, function(field, pos) {
            var col = line.cr('td', self._colCls(field));
            
            if ( self._hideMap.contains(pos) ) { col.addCls('hidden'); }
            
            var nd = self._getFunc(field)(obj, field);
            
            if ( T(nd) == T.S || T(nd) == T.N ) {
                col.val = nd;
            } else {
                col.attach(nd);
            }
            
            if ( !nd._noST ) {
                evt(col, 'click', function(ev) {
                    if ( line.popST() ) {
                        ev.preventDefault();
                        return false;
                    }
                });
            }
            
        });
    }
    
    
    
    
    
    
    
    
    
    
    //- SUPPORT
    self.getBlock = function() {
        if ( !self.block ) {
            self.buildBasis();
        }
        return self.block;
    }
    
    self.show = function(rdata) {
        rdata = rdata || {};
        self.selectBy = mergeObjects(self.selectBy, rdata.selector);
        POP.table.show(self.getBlock());
        
        ENGINE.tableHistory.remove(model);
        ENGINE.tableHistory.add(model);
        glob('tbl2History', parseStr(ENGINE.tableHistory));
        
        tm(function() {
            self._perPage = Math.floor( (EVENT.data.windowSize.y - self.data.heightOffset) / self.data.lineHeight);
            self.rebuild();
        });
        
    }
    
    
    self.init();
}



















window.TVIEW = {};
window.TINP = {};
window.TSTMenu = {}




TSTMenu.table = function(table, sel, text) {
    var infoBlock = clearEvents(cr('a').VAL(PAGE.ld(text||table)));
    
    infoBlock.onclick = function() {
        TABLE2[table].show({selector:sel});
        return false;
    }
    return infoBlock;
}
TSTMenu.table2 = function(sel, text) {
    var txtMap = text.split(/\s*[\{\}]\s*/g);
    var node = TSTMenu.table(txtMap[1], sel, txtMap[1]);
    var nNode = cr('span');
    nNode.cr('span').VAL(PAGE.ld(txtMap[0])+' ');
    nNode.attach(node);
    nNode.cr('span').VAL(' '+PAGE.ld(txtMap[2]));
    return nNode;
}




TVIEW.def      = function(       obj, key) { return $AD(obj,key)||''; }
TVIEW.time     = function(       obj, key) { return formatDate($AD(obj,key), true, true, true); }
TVIEW.entity   = function(model, obj, key) { return ORM.getVisName(ORM.O([model, $AD(obj,key)].join('_'))); }
TVIEW.mapper   = function(dict,  obj, key) {
    var ans = dict[$AD(obj,key)];
    if ( def(ans) ) { return ans; }
    return '?';
}
TVIEW.rel      = function(       obj, key) { var km = key.split('_'); return ORM.getVisName(ORM.rel(obj, km.sl([0,-1]).join('_'))); }
//- project/conf/tableTypes


TVIEW.bool = function(obj, key) {
    var newNode = cr.bool().VAL(obj[key]||false);
    
    newNode._noST = true;
    
    newNode.onupdate(function(val) {
        var nd = {};
        nd[key] = val;
        ORM.req(obj._oid+':update',nd, function() {
            SYS.notify('updated','ok');
        });
        
    });
    
    return newNode;
}


TVIEW.link = function(obj, key) {
    var link = ['',PAGE.lang,obj._model,obj[key],''].join('/');
    
    var node = cr('a').attr({href:link}).VAL('...'+link.sl([-30]));
    PROCESSOR.dynamicLink.process(node);
    node._noST = true;
    
    return node;
}




TINP.like = function(self, field) {
    var block = cr('input').attr({type:'text',required:'true',placeholder:'filter...'});
    
    block._doFilter = function() {
        var val = block.val;
        
        if ( val == '' ) {
            delete self.selectBy[field];
        } else {
            self.selectBy[field] = ['like',['%','%'].join(val)];
        }
        self.rebuild();
    }
    
    block.onkeyup = function(ev) {
        if ( ev.keyCode == 13 ) {
            block._doFilter();
        }
    }
    block.onupdate(block._doFilter);
    
    block.setVal = function(val) { block.val = val[1].sl([1,-1]); }
    block.resetVal = function() { block.val = ''; }
    
    return block;
}


TINP.number = function(self, field) {
    var block = cr('input').attr({type:'number',required:'true',placeholder:'filter...'});
    
    block._doFilter = function() {
        var val = block.val;
        
        if ( val == '' ) {
            delete self.selectBy[field];
        } else {
            self.selectBy[field] = ['=',parseFloat(val)];
        }
        self.rebuild();
    }
    
    block.onkeyup = function(ev) {
        if ( ev.keyCode == 13 ) {
            block._doFilter();
        }
    }
    block.onupdate(block._doFilter);
    
    block.setVal = function(val) { block.val = val[1]; }
    block.resetVal = function() { block.val = ''; }
    
    return block;
}


TINP.dropdown = function(self, field, dd) {
    dd['None'] = '?';
    var block = cr.dropdown(dd);
    block.val = 'None';
    
    block.onupdate(function(val) {
        if ( val == 'None' ) {
            delete self.selectBy[field];
        } else {
            self.selectBy[field] = ['=',val];
        }
        self.rebuild();
    });
    
    block.setVal = function(val) { block.val = val[1]; }
    block.resetVal = function() { block.val = 'None'; }
    
    return block;
}

TINP.modelDropdown = function(self, field, key) {
    return TINP.dropdown(self, field, ORM.getDropdownMap(key));
}

TINP.bool = function(self, field) {
    var block = cr.bool3();
    block.onupdate(function() {
        if ( block.val == null ) {
            delete self.selectBy[field];
        } else if ( block.val == true ) {
            self.selectBy[field] = ['=',true];
        } else {
            self.selectBy[field] = ['!=',true];
        }
        self.rebuild();
    })
    
    block.setVal = function(val) { block.val = val[1]; }
    block.resetVal = function() { block.val = null; }
    
    return block;
}



TINP.rangeTime = function(self, field) {
    var block  = cr('div', 'rng time');
    block.txt1 = block.cr('div');
    block.txt2 = block.cr('div');
    block.clearBtn = cr('a','noHref').VAL(PAGE.ld('clear filter'));
    
    var info = new ST(block);
    info.add('info',block.clearBtn);
    block.clearBtn.onclick = function() {
        delete self.selectBy[field];
        block.resetVal();
        self.rebuild();
    }
    
    block.inp1 = cr.calendartime('small', info.addon);
    block.inp2 = cr.calendartime('small', info.addon);
    
    block._fetchTxt = function() {
        if ( block.inp1.val ) { block.txt1.val = formatDate(block.inp1.val, true, true); } else { block.txt1.val = '--/--/-- --:--'; }
        if ( block.inp2.val ) { block.txt2.val = formatDate(block.inp2.val, true, true); } else { block.txt2.val = '--/--/-- --:--'; }
    }
    
    block._doFilter = function() {
        var result = [];
        
        if ( block.inp1.val ) {
            result.splice(0,0, '>',block.inp1.val);
        }
        
        if ( block.inp2.val ) {
            result.splice(0,0, '<',block.inp2.val);
        }
        
        self.selectBy[field] = result;
        block._fetchTxt();
        self.rebuild();
    }
    block.inp1.onupdate(block._doFilter);
    block.inp2.onupdate(block._doFilter);
    
    
    block.onclick = function() {
        block.popST('menu');
    }
    
    
    block._setVal = function(val, ind) {
        if ( val[ind] ) {
            block['inp'+((val[ind] == '>')&&'1'||'2')].val = val[ind+1]||null;
        }
    }
    
    block.setVal = function(val) {
        block._setVal(val, 0);
        block._setVal(val, 2);
        block._fetchTxt();
    }
    block.resetVal = function() {
        block.inp1.val = null;
        block.inp2.val = null;
        block._fetchTxt();
    };
    
    return block;
}




TINP.rangeNumber = function(self, field) {
    var block = cr('div', 'rng');
    block.inp1 = block.cr('input').attr({type:'number',required:'true',placeholder:'<'});
    block.inp2 = block.cr('input').attr({type:'number',required:'true',placeholder:'>'});
    
    block._doFilter = function() {
        var result = [];
        
        if ( block.inp1.val ) {
            result.splice(0,0, '>',block.inp1.val);
        }
        
        if ( block.inp2.val ) {
            result.splice(0,0, '<',block.inp2.val);
        }
        
        self.selectBy[field] = result;
        self.rebuild();
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
    
    block._setVal = function(val, ind) {
        if ( val[ind] ) {
            block['inp'+((val[ind] == '>')&&'1'||'2')].val = val[ind+1]||'';
        }
    }
    
    block.setVal = function(val) {
        block._setVal(val, 0);
        block._setVal(val, 2);
    }
    block.resetVal = function() {
        block.inp2.val = '';
        block.inp1.val = '';
    }
    
    return block;
}

TINP.rangeDec = function(self, field) {
    var block = TINP.rangeNumber(self, field);
    
    block._doFilter = function() {
        var result = [];
        
        if ( block.inp1.val ) {
            result.splice(0,0, '>',block.inp1.val.fromDec());
        }
        
        if ( block.inp2.val ) {
            result.splice(0,0, '<',block.inp2.val.fromDec());
        }
        
        self.selectBy[field] = result;
        self.rebuild();
    }
    
    block._setVal = function(val, ind) {
        if ( val[ind] ) {
            block['inp'+((val[ind] == '>')&&'1'||'2')].val = val[ind+1].toDec();
        }
    }
    
    
    return block;
}








function createPageRow(func) {
    func = func || new T.F();
    
    return function(obj) {
        var node = cr('tr');
        var info = new ST(node);
        info.title = ORM.getVisName(obj);
        
        node.addCls('green');
        if ( !obj.urlpart )     { info.add('fatal', 'no urlpart');     node.addCls('fatal'); }
        if ( !obj.title )       { info.add('fatal', 'no title');       node.addCls('fatal'); }
        if ( !obj.description ) { info.add('error', 'no description'); node.addCls('red'); }
        
        if ( !obj.keywords || obj.keywords.replace(/\s+/g,'').length == 0 ) {
            info.add('error', 'no keywords'); node.addCls('red');
        } else {
            var keys = obj.keywords.split(/\,\s+/g);
            if ( keys.length < CONF.seo.keywordsLimit[0] ) { info.add('warning', PAGE.ld('to few keywords') +' '+keys.length+'<'+CONF.seo.keywordsLimit[0]); node.addCls('warning'); }
            if ( keys.length > CONF.seo.keywordsLimit[1] ) { info.add('warning', PAGE.ld('to many keywords')+' '+keys.length+'>'+CONF.seo.keywordsLimit[1]); node.addCls('warning'); }
        }
        if ( !obj.views || obj.views == 0 ) { info.add('warning', 'page has no views'); node.addCls('warning'); }
        
        func(obj, node, info);
        
        return node;
    };
}

























