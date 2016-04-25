
var EXTP = new eScenario('extp', { initialRun: true });

PAGE.run();


EXTP.addAction('init_admin', function(link, self, done) {
    
    if ( PAGE.level >= %levelAdmin ) {
        ENGINE.menu['курсы обмена'] = new SUBPROGRAM.exchangeView();
        ENGINE.menu['калькуляция обмена'] = VIEW['exchange-calc']({});
        ORMVIEW = new SUBPROGRAM.ormView();
        ORMVIEW.prepareEntities();
        
        EVENT.keyup.add(function(ev) {
            if ( EVENT.data.key.alt && EVENT.data.key.shift ) {
                if ( ev.keyCode == 186 ) { ORMVIEW.show(); }
            }
        });
        
        
        SYS._edit = false;
        SYS._editInitial = true;
        SYS.ADMINMENU = VIEW.adminMenu();
        
        $P(SYS, 'edit', function() { return SYS._edit; },
        function(data) {
            if ( data ) {
                if ( SYS._editInitial || !SYS._edit ) {
                    SYS.ADMINMENU.F.btnOn('editBtn');
                    PROCESSOR.langContent.edit();
                    PROCESSOR.editable.edit();
                    SYS._edit = true;
                }
            } else {
                if ( SYS._edit ) {
                    SYS.ADMINMENU.F.btnOff('editBtn');
                    PROCESSOR.langContent.view();
                    PROCESSOR.editable.view();
                    SYS._edit = false;
                }
            }
            SYS._editInitial = false;
            SYS._edit = data;
        });
        SYS.ADMINMENU.V.editBtn.onclick = function() { SYS.edit = !SYS._edit; }
        SYS.edit = SYS._edit;
        
        document.body.attach(SYS.ADMINMENU);
        
    }
    
    done();
    
}, { autoRun: 'init' });












