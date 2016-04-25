

SYS.drawedDirs = {};
SYS.capturedStructure = {};
SYS.capturedDirs = {};

new eProcessor('tree', {
    process: function(self, db) {
        _jO(self);
        
        SYS.openedDirs = parseObj(glob('openedDirs')||'[]');
        
        self.V = selectorMapping(self, {
            div:'support,list'
        });
        
        self.rootPath = null;
        
        self.dirs = {};
        
        
        self.F.openPath = f(path) {
            self.rootPath = path;
            self.dirs = {};
            self.dirs[path] = self.V.list;
            
            var pathMap = path.split('/');
            var name = pathMap[pathMap.length-1];
            
            self.V.support.val = name;
            SYS.WS.send({command:'listDir',path:path});
        }
        
        if ( self.D.local ) {
            tm(self.F.openPath(self.D.local));
        } else {
            EVENT.on('projectChosen', self.F.openPath);
        }
        
        
        EVENT.on('ws_listDir', function(resp) {
            if ( self.dirs[resp.data.path]) {
                resp.data.dir.sort();
                resp.data.file.sort();
                
                SYS.capturedStructure[resp.data.path] = resp.data.file;
                SYS.capturedDirs[resp.data.path] = resp.data.dir;
                db.processList(self, db, resp.data);
            }
        });
        
        
    },
    processList: function(self, db, data) {
        var target = self.dirs[data.path];
        
        target.innerHTML = '';
        
        map(data.dir, function(dirPath) {
            var item = VIEW.dir(dirPath);
            target.attach(item);
            self.dirs[item.path] = item.V.cont;
            SYS.drawedDirs[item.path] = item;
        });
        map(data.file, function(dirPath) {
            var item = VIEW.file(dirPath);
            target.attach(item);
            SYS.files[dirPath] = item;
        });
        
    }
});















