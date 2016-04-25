
CONF.project.musicExts = parseLS('mp3,flac');

CONF.project.fileExt = lsMapToDict({
    'def': f(self, path) {
        SYS.targetPath = self.path;
        SYS.WS.send({command:'reqFile',path:self.path});
    },
    'jpg,jpeg,png,gif,svg': f(self,path) {
        var node = cr('img', 'previewImg').attr({src:'file://'+path});
        POP.drag.showNew(node);
    },
    'mp3,flac': f(self,path) {
        SYS.player.F.play(path);
    }
});





CONF.project.fileListExt = lsMapToDict({
    def: f(){},
    'mp3,flac': f(self, path) {
        if ( SYS.drawedDirs[self.dirPath] ) {
            SYS.drawedDirs[self.dirPath].F.setHasMusic();
        }
    }
});


