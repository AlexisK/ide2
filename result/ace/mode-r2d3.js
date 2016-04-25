define("ace/mode/r2d3", function(require, exports, module) {
    "use strict";
    
    var oop = require("../lib/oop");
    // defines the parent mode
    var TextMode = require("./text").Mode;
    var Tokenizer = require("../tokenizer").Tokenizer;
    var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;
    
    // defines the language specific highlighters and folding rules
    var R2D3HighlightRules = require("./r2d3_highlight_rules").R2D3HighlightRules;
    var R2D3FoldMode = require("./folding/cstyle").FoldMode;
    
    var Mode = function() {
        // set everything up
        this.HighlightRules = R2D3HighlightRules;
        this.$outdent = new MatchingBraceOutdent();
        this.foldingRules = new R2D3FoldMode();
    };
    oop.inherits(Mode, TextMode);
    
    (function() {
        // configure comment start/end characters
        this.lineCommentStart = "//";
        this.blockComment = {start: "/*", end: "*/"};
        
        // special logic for indent/outdent. 
        // By default ace keeps indentation of previous line
        this.getNextLineIndent = function(state, line, tab) {
            var indent = this.$getIndent(line);
            return indent;
        };
    
        this.checkOutdent = function(state, line, input) {
            return this.$outdent.checkOutdent(line, input);
        };
    
        this.autoOutdent = function(state, doc, row) {
            this.$outdent.autoOutdent(doc, row);
        };
        
        // create worker for live syntax checking
        // this.createWorker = function(session) {
        //     var worker = new WorkerClient(["ace"], "ace/mode/r2d3_worker", "R2D3Worker");
        //     worker.attachToDocument(session.getDocument());
        //     worker.on("errors", function(e) {
        //         session.setAnnotations(e.data);
        //     });
        //     return worker;
        // };
        
    }).call(Mode.prototype);
    
    exports.Mode = Mode;
});



define("ace/mode/r2d3_highlight_rules", function(require, exports, module) {
    "use strict";
    
    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
    
    var R2D3HighlightRules = function() {
        
        var keywordControls  = ("else|for|if|return");
        var storageType      = ("int|char|struct");
        var storageModifiers = ("const");
        var keywordOperators = ("and|not|or");
        var langVars         = ("this|write|intScan|charScan|parseInt|parseChar|scan|scanf|printf");
        var builtinConstants = ("null|true|false");
        
        
        
        this.getVars = function(str) {
            var result = {
                'variable.userdefined.basic': ['this'],
                'variable.userdefined.pointer': [''],
                'storage.type': ['']
            };
            
            if ( !str ) { return result; }
            
            var reg = new RegExp('('+storageType+')(\\s+[^;(){}]+)', 'g');
            var resMap;
            
            while ( resMap = reg.exec(str) ) {
                var type   = resMap[1];
                var varMap = resMap[2];
                
                if ( varMap ) {
                    varMap = varMap.split(',');
                    for ( var i = 0; i < varMap.length; i++ ) {
                        var variable = varMap[i].split('=')[0].replace(/\s+/g, '');
                        if ( type == 'struct' ) {
                            result['storage.type'].push(variable);
                        } else if( variable[0] == '*') {
                            result['variable.userdefined.pointer'].push(variable.slice(1));
                        } else {
                            result['variable.userdefined.basic'].push(variable);
                        }
                    }
                }
            }
            
            for ( var i in result ) {
                result[i] = result[i].join('|');
            }
            
            return result;
        }
        
        
        var defVars = {
            "keyword.control"       : keywordControls,
            "storage.type.language" : storageType,
            "storage.modifier"      : storageModifiers,
            "keyword.operator"      : keywordOperators,
            "variable.language"     : langVars,
            "constant.language"     : builtinConstants
        }
        
        this.setVars = function(data) {
            data = data||{
                'variable.userdefined.basic': 'this',
                'variable.userdefined.pointer': '',
                'storage.type.userdefined': ''
            };
            
            var sdata = {};
            for ( var i in defVars ) { sdata[i] = defVars[i]; }
            for ( var i in data ) { sdata[i] = data[i]; }
            
            this.keywordRule.onMatch = this.$keywords = this.createKeywordMapper(sdata, "identifier");
        }
        
        
        
        this.keywordRule = {
            onMatch : null,
            regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
        }
        
        this.setVars();
        
        
        var operators = "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|==|=|!=|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(?:in|new|delete|typeof|void)"
        
        var jErrSymbAll = '\\+|\\-|\\/|%|=|<|>|\\||{|}';
        var jErrSymbStt = '('+jErrSymbAll+'|,|;)';
        var jErrSymbEnd = '('+jErrSymbAll+'|\\*|&|!)';
        
        this.$rules = {
            "start" : [
                {
                    token : "comment",
                    regex : "//",
                    next : "singleLineComment"
                }, {
                    token : "string", // single line
                    regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
                }, {
                    token : "string", // multi line string start
                    regex : '["].*\\\\$',
                    next : "qqstring"
                }, {
                    token : "string", // single char
                    regex : "[']\\\\?[^'][']"
                },
                
                
                
                
                {
                    token : ["text","invalid.syntax.spaces","text"],
                    regex: '([^\\ :]+)(\ {2,})([^\\n])'
                }, {
                    token : ["text","invalid.syntax.spaces"],
                    regex: '([^\\ ])(\\ +$)'
                }, {
                    token : ["text","invalid.syntax.spaces"],
                    regex: '((?:\\ {4})*)(\\ {1,3}$)'
                }, {
                    token : ["text","invalid.syntax.spaces"],
                    regex: '([a-zA-Z0-9_$\\)]+)'+jErrSymbEnd
                }, {
                    token : ["invalid.syntax.spaces","text"],
                    regex: jErrSymbStt+'([a-zA-Z0-9_$\\(]+)'
                },
                
                
                this.keywordRule,
                
                
                
                {
                    token : "constant.numeric", // hex
                    regex : "0[xX][0-9a-fA-F]+(L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b"
                }, {
                    token : "constant.numeric", // float
                    regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?(L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b"
                }, {
                    token : "keyword.operator",
                    regex : operators
                }, {
                  token : "punctuation.operator",
                  regex : "\\?|\\:|\\,|\\;|\\."
                }, {
                    token : "paren.lparen",
                    regex : "[[({]"
                }, {
                    token : "paren.rparen",
                    regex : "[\\])}]"
                }, {
                    token : "text",
                    regex : "\\s+"
                }
            ],
                "singleLineComment" : [
                {
                    token : "comment",
                    regex : /\\$/,
                    next : "singleLineComment"
                }, {
                    token : "comment",
                    regex : /$/,
                    next : "start"
                }, {
                    defaultToken: "comment"
                }
            ],
                "qqstring" : [
                {
                    token : "string",
                    regex : '(?:(?:\\\\.)|(?:[^"\\\\]))*?"',
                    next : "start"
                }, {
                    defaultToken : "string"
                }
            ],
            "qstring" : [
                {
                    token : "string",
                    regex : "(?:(?:\\\\.)|(?:[^'\\\\]))*?'",
                    next : "start"
                }, {
                    defaultToken : "string"
                }
            ],
        };
        
    };
    
    
    oop.inherits(R2D3HighlightRules, TextHighlightRules);
    
    exports.R2D3HighlightRules = R2D3HighlightRules;

});

