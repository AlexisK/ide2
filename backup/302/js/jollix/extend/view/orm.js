
new eHtml('orm', '<input type="text" placeholder="oid" class="orm-oid" />\
<input type="text" placeholder="filter" class="orm-list-filter" />\
<div class="orm-list"></div>\
\
<input type="text" placeholder="request" class="orm-req" />\
<div class="orm-menu">\
    <input type="text" placeholder="filter" class="orm-cont-filter" />\
    <div class="asBtn fa">COMMIT</div>\
    <div class="orm-tabs"></div>\
</div>\
<div class="orm-cont"></div>\
<div class="orm-hist"></div>', {
    input: 'oid,list_filter,reqest,cont_filter',
    div: 'list,menu,commit,tabs,cont,hist'
});

new eView('orm', {
    create: function() {
        return HTML.orm(cr('div', 'ormView'));
    },
    init: function(block, obj) {
        block.C.listItems = [];
        block.C.contItems = [];
        block.C.contPage = {};
        block.C.tab = {};
        block.C.listObjs = {};
        block.C.currentTab = null;
        block.C.histBlock = {};
        
        block.F.doFilter = function() {
            domSearch(block.C.listItems, block.V.list_filter.val);
            domSearch(block.C.contItems, block.V.cont_filter.val);
        }
        
        block.F.newTab = function(key, text) {
            block.C.contPage[key] = cr('div');
            block.C.tab[key] = cr('div', 'fa').VAL(text||key);
            
            block.C.tab[key].onclick = function() { block.F.setTab(key); }
            block.F.redrawTabs();
        }
        
        block.F.setTab = function(key) {
            if ( def(block.C.currentTab) ) {
                block.C.currentTab.remCls('active');
            }
            block.C.currentTab = block.C.tab[key];
            block.C.currentTab.addCls('active');
            block.V.cont.innerHTML = '';
            block.V.cont.attach(block.C.contPage[key]);
        }
        
        block.F.removeTab = function(key) {
            delete block.C.contPage[key];
            delete block.C.tab[key];
            block.F.redrawTabs();
        }
        
        block.F.redrawTabs = function() {
            block.V.tabs.innerHTML = '';
            mapO(block.C.tab, function(tabNode) {
                block.V.tabs.attach(tabNode);
            }, { sort: true });
        }
        
        block.F.clearTabs = function() {
            block.C.contPage = {};
            block.C.tab = {};
            block.F.redrawTabs();
        }
        
        block.F.redrawObj = function(obj) {
            block.C.listObjs[obj._oid] = block.C.listObjs[obj._oid]||{};
            block.C.listObjs[obj._oid].node = cr('div').VAL(obj._oname);
            block.F.redrawList();
        }
        
        block.F.redrawList = CEF(function() {
            block.V.list.innerHTML = '';
            block.C.listItems = [];
            
            mapO(block.C.listObjs, function(obj) {
                block.V.list.attach(obj.node);
                block.C.listItems.push(obj.node);
                block.F.doFilter();
            });
        }, 1000);
        
        block.F.addHistory = function(str) {
            var newNode = block.C.histBlock[str]||cr('div').VAL(str);
            block.C.histBlock[str] = newNode;
            block.V.hist.attachFirst(newNode);
            return newNode;
        }
        
        
        block.V.list_filter.onkeyup = block.F.doFilter;
        block.V.cont_filter.onkeyup = block.F.doFilter;
        
    }
});























