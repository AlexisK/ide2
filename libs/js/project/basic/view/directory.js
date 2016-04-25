

new eHtml('dir','<div class="head"><div class="logo"></div><div class="title"></div></div><div class="conts"></div><div class="cont hidden"></div>',{
    div:'head,logo,title,conts,cont'
});

new eView('dir', {
    create: function() { return HTML.dir(cr('div','df dir')); },
    init: function(self, path) {
        var pathMap = path.split('/');
        var name = pathMap[pathMap.length-1];
        
        
        self.V.title.val = name;
        
        self.opened = false;
        self.path = path;
        
        self.open = function() {
            SYS.WS.send({command:'listDir',path:self.path});
            SYS.openedDirs.add(self.path)
            glob('openedDirs', parseStr(SYS.openedDirs));
            self.V.cont.remCls('hidden');
            self.opened = true;
        }
        
        self.close = function() {
            SYS.openedDirs.remove(self.path)
            glob('openedDirs', parseStr(SYS.openedDirs));
            self.V.cont.addCls('hidden');
            self.opened = false;
        }
        
        self.V.head.onclick = function() {
            if ( self.opened ) {
                self.close();
            } else {
                self.open();
            }
        }
        
        
        self.F.setVersion = function(ver) {
            self.V.title.val = [name, ver].join(' v');
        }
        
        
        if ( SYS.engineAt.contains(self.path) ) {
            
            self.addCls('engined');
            SVG.tree(self.V.logo);
            
            var syncBtn = self.V.conts.cr('div', 'asBtn');
            syncBtn.onclick =f(){ SYS.syncEngine(self.path); }
            SVG.link(syncBtn);
            
            var runBtn = self.V.conts.cr('div', 'asBtn');
            runBtn.onclick = f(){
                SYS.syncEngines(self.path);
            }
            SVG.video(runBtn);
            
            //-tm(f(){ SYS.WS.send({command:'reqFile',path:self.path+'/version'}); });
            
            
            EVENT.on('ws_version', function() {
                self.F.setVersion(SYS.currentVersionStr[self.path+'/version']);
            });
            
            SYS.WS.send({command:'reqFile',path:self.path+'/version'});
            
        } else {
            SVG.dir(self.V.logo);
        }
        
        
        self.C.musicInside = false;
        self.F.setHasMusic = f() {
            if ( !self.C.musicInside ) {
                var musBtn = self.V.conts.cr('div', 'asBtn');
                musBtn.onclick = f(){
                    
                }
                SVG.video(musBtn);
                self.C.musicInside = true;
            }
        }
        
        
        if ( SYS.openedDirs.contains(self.path) ) {self.open(); }
    }
});

















