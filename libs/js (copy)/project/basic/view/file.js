

new eHtml('file','<div class="head"><div class="logo"></div><div class="title"></div><div class="conts"></div></div>', {
    div:'head,logo,title,conts'
});

SYS.engineFileNames = ['frontGenerator.py', 'version', 'settings.cfg'];
SYS.files = {};
SYS.targetPath = null;

new eView('file', {
    create: function() { return HTML.file(cr('div','df file')); },
    init: function(self, path) {
        var pathMap = path.split('/');
        var name = pathMap[pathMap.length-1];
        
        SVG.file(self.V.logo);
        self.V.title.val = name;
        self.C.ext = (name.split('.').sl([-1])[0]).toLowerCase();
        self.path = path;
        self.dirPath = pathMap.sl([0, -1]).join('/');
        
        
        self.V.head.onclick = function() {
            (CONF.project.fileExt[self.C.ext]||CONF.project.fileExt.def)(self, path);
        }
        
        tm(f(){ (CONF.project.fileListExt[self.C.ext]||CONF.project.fileListExt.def)(self, path); });
        
        
        if ( SYS.engineAt.contains(self.dirPath) && SYS.engineFileNames.contains(name) ) {
            self.addCls('engined');
            SVG.file(self.V.logo);
        } else {
            SVG.file(self.V.logo);
        }
        
        EVENT.on('highlightfile', f(data) {
            if ( data.path == path ) {
                self.addCls(data.cls);
            } else {
                self.remCls(data.cls);
            }
        })
    }
});




