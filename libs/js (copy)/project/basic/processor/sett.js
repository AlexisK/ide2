

new eProcessor('sett', {
    process: function(self, db) {
        _jO(self);
        var name = self.D.sett;
        
        var opts = {};
        map(db.options[name], function(val) { opts[val] = val; })
        
        var dd = cr.dropdown(opts, null, self);
        
        (db.parsers[name]||db.parsers.def)(self, db, dd);
        
        var val = (glob('sett_'+name));
        if ( val ) { dd.val = val; }
        
        dd.onupdate(function(val) {
            glob('sett_'+name, val);
        })
    },
    parsers: {
        def: f(){},
        font: f(self, db, dd) {
            dd.directSelect = f(val) { EVENT.emit('selectFontSize', val); }
        },
        theme: f(self, db, dd) {
            dd.directSelect = f(val) { EVENT.emit('selectEditorTheme', val); }
        },
        lang: function(self, db, dd) {
            
            dd.directSelect = f(val) {
                EVENT.emit('selectLang', val);
            }
            
            EVENT.on('langSelected', function(lang) {
                dd.val = lang;
            })
        }
    },
    options: {
        font  : RNG(30).sl([10]),
        theme : ['xcode', 'chrome', 'tomorrow', 'tomorrow_darvix', 'dawn', 'katzenmilch', 'kuroir', 'idle_fingers',
                'monokai', 'twilight', 'ambiance', 'kr_theme'],
        
        lang  : ["text", "batchfile", "c_cpp", "coffee", "csharp", "css", "django", "erlang", "haskell", "html",
                "ini", "java", "javascript", "json", "less", "lua", "mysql", "objectivec", "paskal", "perl", "pgsql",
                "php", "powershell", "python", "ruby", "scala", "sh", "smarty", "sql", "vbscript", "xml", "yaml",
                "r2d3"]
        
    }
});