
new eHtml('adminMenu','<div class="openBtn fBtn fa pr_svg" data-svg="arrRight"></div>\
<div class="fBtn fa pr_svg" data-svg="edit2"></div>\
<div class="fBtn fa pr_svg" data-svg="views"></div>\
<div class="amenu fa">\
    <div class="menus">\
        <h4>Menu</h4>\
    </div>\
    <div class="menus tables">\
        <h4>Tables</h4>\
    </div>\
    <div class="menus roles hidden">\
        <h4>Roles</h4>\
        <div class="asBtn fa">Admin</div>\
        <div class="asBtn fa">User</div>\
    </div>\
</div>', {
    '.fBtn':'switcher,editBtn,purgeBtn',
    '.menu':'block',
    '.menus':'menuBlock,tableBlock',
    '.roles':'rolesBlock',
    '.asBtn':'roleAdmin,roleUser',
    '.tables':'tables'
});


new eView('adminMenu', {
    create: function() { return HTML.adminMenu(cr('div', 'adminMenu')); },
    init: function(self, obj) {
        self.C.opened = false;
        self.C.toclose = false;
        
        self.F.open = function() {
            if ( !self.C.opened ) {
                self.addCls('active');
                self.C.opened = true;
                EVENT.click.add(self.F.closeEvt);
                //-evt(S('.wrapper')[0], 'click', self.F.close);
            }
        }
        
        self.F.closeEvt = function() {
            self.C.toclose = true;
            tm(self.F.close, 10);
        }
        
        self.F.close = function() {
            if ( self.C.opened && self.C.toclose ) {
                self.remCls('active');
                self.C.opened = false;
                EVENT.click.remove(self.F.closeEvt);
                //-evtDel(S('.wrapper')[0], 'click', self.F.close);
            }
        }
        
        self.V.switcher.onclick = self.F.open;
        self.onclick = function() {
            tm(function() {
                self.C.toclose = false;
            });
        }
        
        //-mapO(TABLE, function(func, model) {
        //-    self.V.tables.cr('div', 'asBtn fa').VAL(model).onclick = function() { TABLE[model].adjAndShow(); };
        //-}, {sort:true})
        
        mapO(TABLE2, function(obj, model) {
            if ( !obj.data.hidden ) {
                if ( PAGE.level >= obj.data.level ) {
                    self.V.tables.cr('div', 'asBtn fa').VAL(PAGE.ld(model)).onclick = function() { obj.show(); };
                }
            }
        }, {sort:true})
        
        if ( okeys(ENGINE.menu).length == 0 ) {
            self.V.menuBlock.detach();
        } else {
            mapO(ENGINE.menu, function(menu, name) {
                self.V.menuBlock.cr('div', 'asBtn fa').VAL(PAGE.ld(name)).onclick = function() { menu.show(); };
            }, {sort:true});
        }
        
        
        
        self.F.btnOn = function(btn) {
            self.V[btn].addCls('active');
        }
        self.F.btnOff = function(btn) {
            self.V[btn].remCls('active');
        }
        
        
        self.V.editBtn.onclick;
        
        
        self.V.purgeBtn.onclick = function() {
            PROTOCOL.cache.write(function() {
                tm(function() {
                    window.location.reload();
                }, 100);
            });
        }
        
        
    }
});














