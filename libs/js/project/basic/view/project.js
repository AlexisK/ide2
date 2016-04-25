
new eHtml('project', '<div class="logo"></div><div class="conts"></div><div class="title"></div>', {
    div:'logo,conts,title'
});


SYS.currentProjStr =  glob('currentProject');

new eView('project', {
    create: function() {
        return HTML.project(cr('div', 'proj'));
    },
    init: function(self, path) {
        var pathMap = path.split('/');
        
        self.V.title.val = pathMap[pathMap.length-1]
        
        SVG.project(self.V.logo);
        
        
        self.C.btnStt = self.V.conts.cr('div','as_btn');
        SVG.settings(self.C.btnStt);
        
        SYS.projects[path] = self;
        
        self.chooseProj = function() {
            if ( SYS.currentProject && SYS.projects[SYS.currentProject] ) {
                SYS.projects[SYS.currentProject].remCls('active');
            }
            SYS.currentProject = path;
            SYS.projects[SYS.currentProject].addCls('active');
            SYS.PG = {};
            map(SYS.tempIntervals, function(int) {
                clearInterval(int);
            });
            SYS.tempIntervals = [];
            EVENT.emit('projectChosen', path);
            glob('currentProject', path);
        }
        
        self.V.title.onclick = self.chooseProj;
        
        if ( SYS.currentProjStr == path ) {
            tm(self.chooseProj);
        }
    }
});







