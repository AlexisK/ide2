
SYS.fetchVars = function() {
    if ( def(editor.session.$mode.$highlightRules.getVars) ) {
        SYS.savedVars = editor.session.$mode.$highlightRules.getVars(editor.getValue());
        var newVarsStr = parseStr(SYS.savedVars);
        
        if ( newVarsStr != SYS.lastVars) {
            SYS.lastVars = newVarsStr;
            editor.session.$mode.$highlightRules.setVars(SYS.savedVars);
            editor.session.bgTokenizer.start(0);
        }
    }
}

var snippetManager = ace.require("ace/snippets").snippetManager;
var config = ace.require("ace/config");

var cbCustom = [];
var basickeys = 'ENGINE,SYS,PAGE,ORM';

map(parseLS(basickeys), function(bk) {
    cbCustom.push({content:bk,name:bk,tabTrigger:bk});
    
    mapO(window[bk], function(v,k) {
        if ( T(v) == T.F ) {
            cbCustom.push({content:[bk,'.',k,'($20$0)$40$0'].join(''),name:[bk,k].join('.'),tabTrigger:k});
        }
    });
});

mapO(window, function(v,k) {
    if ( T(v) == T.F ) {
        cbCustom.push({content:[k,'($20$0)$40$0'].join(''),name:k,tabTrigger:k});
    }
});

cbCustom.push({
            content:
"var ${1:class} = function(${20}) {\n\
\tvar self = this;\n\
\tvar ENV = getEnv(self);\n\
\t\n\
\tself.init = function($30$0) {$40$0}\n\
\t$60$0\n\
\t\n\
\tself.init();\n\
\t\n\
};\n$80$0",
    name: "fclass",
    tabTrigger: "fclass"
});
cbCustom.push({
    content: "var ENV = getEnv(${1:this});",
    name: "env",
    tabTrigger: "env"
});

ace.config.loadModule("ace/snippets/javascript", function(m) { 
    if (m) { 
        snippetManager.files.javascript = m;
        m.snippets = snippetManager.parseSnippetFile(m.snippetText);
        map(cbCustom, f(o) { m.snippets.push(o); });
        
        snippetManager.register(m.snippets, m.scope); 
    } 
}); 


SYS.latestUrls = parseObj(glob('latestUrls') || '[]');


SYS.files = SYS.files || {};

new eProcessor('editor', {
    process: function(self, db) {
        _jO(self);
        
        
        var editor = ace.edit(self);
            editor.setTheme("ace/theme/"+(glob('sett_theme')||'katzenmilch'));
            editor.getSession().setMode("ace/mode/javascript");
        
        SYS.lastEditor = editor;
        
        
        
        editor.setOptions({
//-            enableTern: {
//-                defs: ['browser', 'ecma5'],
//-                plugins: {
//-                    doc_comment: {
//-                        fullDocs: true
//-                    }
//-                },
//-                useWorker: useWebWorker,
//-                switchToDoc: function (name, start) {
//-                    console.log('switchToDoc called but not defined. name=' + name + '; start=', start);
//-                },
//-                startedCb: function () {
//-                    console.log('editor.ternServer:', editor.ternServer);
//-                },
//-            },
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        });
        
        var cbCustom = [];
        var basickeys = 'ENGINE,SYS,PAGE,ORM,window';
        
        map(parseLS(basickeys), function(bk) {
            cbCustom.add({value:bk, score:30, meta:'BASIC'});
            
            mapO(window[bk], function(v,k) {
                cbCustom.add({value:k, score:20, meta:bk});
                cbCustom.add({value:[bk,k].join('.'), score:10, meta:'BASIC'});
            });
        })
        
        //-editor.completers.push({
        //-    getCompletions: function(editor, session, pos, prefix, callback) {
        //-        callback(null, cbCustom);
        //-    }
        //-});
        
        
        editor.on('change', function() {
            if ( SYS.currentPath && SYS.files[SYS.currentPath] ) {
                SYS.files[SYS.currentPath].addCls('modified');
            }
        })
        
        
        
        
        editor.commands.addCommand({
            name: 'save',
            bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
            exec: function(editor) {
                var cont = editor.getValue();
                SYS.WS.send({command:'saveFile',path:SYS.currentPath,content:cont});
            }
        });
        
        editor.commands.addCommand({
            name: 'tabSession',
            bindKey: {win: 'Ctrl-Tab',  mac: 'Command-Tab'},
            exec: function(editor) {
                
                if ( SYS.latestUrls.length > 1 ) {
                    var pth = SYS.latestUrls[SYS.latestUrls.length-2];
                    if ( self._sessions[pth] ) {
                        db.setSession(self, db, pth, self._sessions[pth]);
                    }
                }
            }
        });
        
        editor.commands.addCommand({
            name: 'fsMenu',
            bindKey: {win: 'Esc',  mac: 'Esc'},
            exec: function(editor) {
                if ( !SYS.fsMenuShown ) {
                    SYS.fsMenu.remCls('hidden');
                    SYS.fsMenuShown = true;
                } else {
                    SYS.fsMenu.addCls('hidden');
                    SYS.fsMenuShown = false;
                }
            }
        });
        
        
        
        self._editor = editor;
        self._sessions = {};
        
        
        EVENT.on('ws_reqFile', function(resp) {
            if ( SYS.targetPath == resp.data.path ) {
                db.editFile(self, db, resp);
            }
        });
        
        
        EVENT.on('ws_saveFile', function(resp) {
            var eng = null;
            map(SYS.engineAt, function(path) {
                if ( resp.data.path.indexOf(path) == 0 ) {
                    eng = path;
                    return false;
                }
            });
            
            if ( eng ) {
                SYS.WS.send({command:'iterVersion',path:eng,ind:1});
            }
            
            SYS.notify(resp.data.msg, 'green');
            if ( SYS.files[resp.data.path] ) {
                SYS.files[resp.data.path].remCls('modified');
            }
        });
        EVENT.on('ws_notify', function(resp) {
            SYS.notify(resp.data);
        });
        
        
        
        EVENT.on('selectLang', function(lang) {
            var session = editor.getSession();
            session.__jtxtM = lang;
            session.setMode("ace/mode/"+lang);
            EVENT.emit('langSelected', lang);
        });
        
        EVENT.on('selectFontSize', f(size) {
            editor.setFontSize(parseInt(size));
        })
        
        EVENT.on('selectEditorTheme', function(theme) {
            editor.setTheme('ace/theme/'+theme);
        });
        
    },
    editFile: function(self, db, resp) {
        var path = resp.data.path;
        var ext = path.slice(path.lastIndexOf('.')+1);
        var textMode = ext;
        if ( def(db.extmap[ext]) ) { textMode = db.extmap[ext]; }
        
        var session = self._sessions[path];
        if ( !def(session) ) {
            session = ace.createEditSession(resp.data.content, 'ace/mode/'+textMode);
            session.__jtxtM = textMode;
            session.setUseWorker(false);
            self._sessions[path] = session;
            
        }
        EVENT.emit('langSelected', session.__jtxtM);
        
        db.setSession(self, db, resp.data.path, session);
        
    },
    setSession: function(self, db, path, session) {
        
        if ( SYS.histUrls[SYS.currentProject] ) {
            EVENT.emit('editingFile', path);
        }
        
        self._editor.setSession(session);
        
        if ( SYS.currentPath && SYS.files[SYS.currentPath] ) {
            log(SYS.files[SYS.currentPath]);
            SYS.files[SYS.currentPath].remCls('current')
        }
        SYS.currentPath = path;
        SYS.latestUrls.remove(SYS.currentPath);
        SYS.latestUrls.add(SYS.currentPath);
        if ( SYS.files[SYS.currentPath] ) {
            SYS.files[SYS.currentPath].addCls('current')
        }
        glob('latestUrls', parseStr(SYS.latestUrls));
    },
    extmap: reverseLSDict({
        javascript: 'js',
        python: 'py',
        html: 'htm,tpl',
        c_cpp: 'c,cpp,h,hpp',
        csharp: 'cs'
    })
});















