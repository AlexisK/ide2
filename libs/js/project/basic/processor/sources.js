

new eProcessor('sourcemusic', {
    process: function(self, db) {
        _jO(self);
        
        SYS.musicAt = (glob('musicAt')||'').split(',');
        
        self.val = SYS.musicAt.join('\n');
        
        self.onblur = function() {
            glob('musicAt', self.val.rp('\n',','));
        }
        
    }
});

new eProcessor('sources', {
    process: function(self, db) {
        _jO(self);
        
        SYS.projects = (glob('projectList')||'').split(',');
        
        self.val = SYS.projects.join('\n');
        
        self.onblur = function() {
            glob('projectList', self.val.rp('\n',','));
        }
        
    }
});

new eProcessor('sourceengine', {
    process: function(self, db) {
        _jO(self);
        
        SYS.engineAt = (glob('engineAt')||'').split(',');
        SYS.versionAt = [];
        SYS.currentVersions = {};
        SYS.currentVersionStr = {};
        
        map(SYS.engineAt, function(path) {
            if ( path.rp(/]s+/g,'').length > 0 ) {
                var vpath = path+'/version';
                SYS.versionAt.push(vpath);
                
                (setInterval(f(){
                    SYS.WS.send({command:'reqFile',path:vpath});
                }, 30000));
                tm(f(){ SYS.WS.send({command:'reqFile',path:vpath}); }, 200);
            }
        })
        
        EVENT.on('ws_reqFile', function(resp) {
            if ( SYS.versionAt.contains(resp.data.path) ) {
                SYS.currentVersions[resp.data.path] = parseFloat(resp.data.content);
                SYS.currentVersionStr[resp.data.path] = resp.data.content;
                EVENT.emit('ws_version', resp.data.path);
            }
        });
        
        EVENT.on('ws_notFound', function(resp) {
            if ( SYS.versionAt.contains(resp.data.path) ) {
                delete SYS.currentVersions[resp.data.path];
                SYS.versionAt.remove(resp.data.path);
                SYS.engineAt.remove(resp.data.path.sl([0, (('/version').length * -1)]));
            }
        });
        
        EVENT.on('ws_notify', function(resp) {
            SYS.notify(resp.data);
        });
        
        self.val = SYS.engineAt.join('\n');
        
        self.onblur = function() {
            glob('engineAt', self.val.rp('\n',','));
        }
        
    }
});







SYS.prepVersions = function() {
    var keys = okeys(SYS.currentVersions);
    if ( keys.length > 0 ) {
        var max = SYS.currentVersions[keys[0]];
        var from = keys[0];
        
        mapO(SYS.currentVersions, function(ver, path) {
            if ( max < ver ) {
                from = path;
                max = ver;
            }
        });
        
        
        from = from.split('/').sl([0,-1]).join('/');
        
        return { path: from, ver:max};
        
    }
    return null;
}

SYS.syncEngine = function(path) {
    var max = SYS.prepVersions();
    if( !max ) { return 0; }
    var ver = SYS.currentVersions[path+'/version'];
    
    if ( ver < max.ver ) {
        SYS.WS.send({command:'syncTargeted',src:max.path,target:path,backOld:true,compile:true});
        SYS.WS.send({command:'reqFile',path:path+'/version'});
    }
}

SYS.syncEngines = function(path) {
    var max = SYS.prepVersions();
    if( !max ) { return 0; }
    var ver = SYS.currentVersions[path+'/version'];
    
    if ( ver < max.ver ) {
        SYS.notify('not actual version!', 'red');
    } else {
        
        SYS.WS.send({command:'compileTarget',path:path});
        SYS.WS.send({command:'iterVersion',path:path,ind:0});
        
        //-tm(f() {
        //-    mapO(SYS.currentVersions, function(pver, ppath) {
        //-        if ( pver == ver ) {
        //-            ppath = ppath.sl([0, (('/version').length*-1)]);
        //-            
        //-            if ( ppath != path ) {
        //-                SYS.WS.send({command:'syncTargeted',src:path,target:ppath,backOld:false,compile:true});
        //-                SYS.WS.send({command:'reqFile',path:ppath+'/version'});
        //-            }
        //-        }
        //-    });
        //-});
       
    }
}










