

SYS.histUrls = parseObj(glob('histUrls')||'{}');

new eProcessor('history', {
    folderCount:3,
    process: function(self, db) {
        _jO(self);
        
        self.fileNodes = [];
        self.lastDirs = new T.A(db.folderCount);
        
        self.rebuild = function() {
            self.innerHTML = '';
            
            map(SYS.histUrls[SYS.currentProject], function(path) {
                db.drawNode(self, db, path);
            })
        }
        
        
        EVENT.on('projectChosen', function(path) {
            SYS.histUrls[SYS.currentProject] = SYS.histUrls[SYS.currentProject] || [];
            self.fileNodes = [];
            self.rebuild();
        });
        
        EVENT.on('editingFile', function(path) {
            var obj = SYS.histUrls[SYS.currentProject];
            obj.remove(path);
            obj.add(path);
            
            if ( obj.length > 100 ) {
                SYS.histUrls[SYS.currentProject] = obj.sl([-100]);
            }
            
            glob('histUrls', parseStr(SYS.histUrls));
            
            db.drawNode(self, db, path);
        })
    },
    drawNode: f(self, db, path) {
        var node = (self.fileNodes[path] || (self.fileNodes[path] = VIEW.file(path)));
        var names = path.split('/');
        var fl = names.sl([-1])[0];
        var names = names.sl([-db.folderCount,-1]);
        
        node.V.title.val = '';
        
        map(names, f(dir, ind) {
            var nd = node.V.title.cr('span','label col').VAL(dir);
            if ( self.lastDirs[ind] && self.lastDirs[ind].val == dir ) {
                self.lastDirs[ind].addCls('dateHid');
            }
            self.lastDirs[ind] = nd;
        });
        
        node.V.title.cr('span','').VAL(fl);
        
        //-node.V.title.val = path.split('/').sl([-3]).join('/');
        self.attachFirst(node);
    }
});















