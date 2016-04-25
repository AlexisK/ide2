
new eProcessor('tabs', {
    process: function(self, db) {
        _jO(self).V.tabs = S('.mk_tab', self);
        self.C.curTab = self.D.tab || 0;
        
        db.createButtons(self, db);
        db.switchTo(self, db, self.C.curTab);
        
        self.switchTo = function(key) {
            db.switchTo(self, db, key);
        }
        
    },
    switchTo: function(self, db, index) {
        self.C.curTab = index;
        map(self.V.tabs, function(node, i) {
            node.addCls('hidden');
            self.V.tabBtns[i].remCls('active');
        });
        self.V.tabs[index].remCls('hidden');
        self.V.tabBtns[index].addCls('active');
        
        var ifms = S('iframe', self.V.tabs[index]);
        
        map(ifms, function(node) {
            var nSrc = node.attr('data-srcontab');
            if ( nSrc && nSrc.length > 0 ) {
                node.attr({
                    src: nSrc,
                });
                node.remattr('data-srcontab');
            }
        });
    },
    createButtons: function(self, db) {
        map(self.V.tabBtns||[], detach);
        self.V.tabBtns = [];
        self.V.tabsBlock = self.V.tabsBlock || cr('div','tabs heading');
        self.attachFirst(self.V.tabsBlock);
        
        map(self.V.tabs, function(tab) {
            _jO(tab);
            db.createButton(self, db, tab);
        })
    },
    createButton: function(self, db, tab) {
        var newBtn = self.V.tabsBlock.cr('div','asBtn');
        if ( tab.D.svg ) { SVG[tab.D.svg](newBtn.cr('div', 'ico')); }
        if ( tab.D.title ) { newBtn.cr('div', 'str').VAL(tab.D.title); }
        
        newBtn._index = self.V.tabBtns.push(newBtn)-1;
        clearEvents(newBtn).onclick = function() {
            db.switchTo(self, db, this._index);
            return 0;
        }
    }
})












