

new eHtml('musicplayer','<div class="title"></div><div class="controlls"></div><div class="filelist"></div>',{
    div: 'title,controlls,filelist'
});



new eView('musicplayer', {
    create: f() { return HTML.musicplayer(cr('div', 'musicplayer')); },
    init: f(self, obj) {
        
        self.C.player = cr('audio');
        SYS.player = self;
        self.curPath = null;
        self.curDir = null;
        self.C.is_playing = false;
        self.C.interval = null;
        
        self.C.filelinks = [];
        self.C.filelist = {};
        self.C.awaitingFor = {};
        
        
        self.C.player.addEventListener('loadedmetadata', f() {
            
            self.C.player.play();
            SYS.notify(self.curPath);
            
            self.C.savedTimeOffset = 0;
            
            clearInterval(self.C.interval);
            self.C.interval = tm(self.F.playNext, (self.C.player.duration*1000));
            
            audio.play(); 
            
            self.C.is_playing = true;
        });
        
        
        self.F.play = f(path) {
            if ( !self.C.is_playing || path ) {
                self.curPath = path || self.curPath;
                self.curDir = self.curPath.split('/').sl([0, -1]).join('/');
                self.F.fetchByPath();
                
                self.V.title.val = self.curPath;
                
                
                if ( self.curPath == self.C.savedPath && self.C.savedTimeOffset ) {
                    self.C.player.play();
                    self.C.interval = tm(self.F.playNext, (self.C.player.duration*1000) - self.C.savedTimeOffset);
                } else {
                    self.C.player.src = self.curPath;
                }
                
                self.C.savedPath = self.curPath;
                self.C.savedTime = new Date()*1;
                tm(f() {
                    EVENT.emit('highlightfile', {
                        cls: 'currentMusicFile',
                        path: self.curPath
                    });
                }, 100);
                
                
                self.C.filelist[self.curPath].V.head.addCls('active');
                
                self.C.is_playing = true;
                
            } else {
                clearInterval(self.C.interval);
                self.C.player.pause();
                if ( self.C.is_playing ) {
                    self.C.savedTimeOffset += new Date()*1 - self.C.savedTime;
                }
                self.C.is_playing = false;
            }
        }
        
        
        self.F.fetchByPath = f() {
            if ( !self.curDir ) { return 0; }
            
            self.V.filelist.innerHTML = '';
            self.C.filelinks = [];
            self.C.filelist = {};
            
            self.F._drawDir(self.curDir)
            
            
            var preDir = self.curDir.split('/').sl([0,-1]).join('/');
            
            if ( SYS.capturedDirs[preDir] ) {
                var pos = SYS.capturedDirs[preDir].indexOf(self.curDir);
                if ( pos > -1 ) {
                    var npos = pos + 1;
                    if ( SYS.capturedDirs[preDir][npos] ) {
                        self.F._drawDir(SYS.capturedDirs[preDir][npos]);
                    }
                }
            }
        }
        
        self.F._drawDir = f(dirPath) {
            var foldView = VIEW.dir(dirPath);
            self.V.filelist.attach(foldView);
            
            if ( SYS.capturedStructure[dirPath] ) {
                self.F._drawDirWorker(foldView, dirPath);
            } else {
                self.C.awaitingFor[dirPath] = foldView;
                foldView.open();
            }
            
        }
        
        self.F._drawDirWorker = f(foldView, dirPath) {
            map(SYS.capturedStructure[dirPath], f(p) {
                var fView = VIEW.file(p);
                foldView.V.cont.attach(fView);
                
                if ( CONF.project.musicExts.contains(fView.C.ext) ) {
                    self.C.filelist[p] = fView;
                    self.C.filelinks.push(p);
                }
            });
        }
        
        EVENT.on('ws_listDir', function(resp) {
            if ( self.C.awaitingFor[resp.data.path]) {
                tm(f(){
                    self.F._drawDirWorker(self.C.awaitingFor[resp.data.path], resp.data.path);
                });
                delete self.C.awaitingFor[resp.data.path];
            }
        });
        
        
        
        self.F.playNext = f(){
            var pos = self.C.filelinks.indexOf(self.curPath);
            if ( pos > -1 ) {
                var npos = pos + 1;
                if ( self.C.filelinks[npos] ) {
                    self.F.play(self.C.filelinks[npos]);
                }
            }
        }
        
        
        self.V.btnPlay = self.V.controlls.cr('div', 'asBtn pBtn');
        SVG.video(self.V.btnPlay);
        clearEvents(self.V.btnPlay).onclick = f() { self.F.play(); return false; }
        
    }
});














