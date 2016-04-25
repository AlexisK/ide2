


var PAGE = new eScenario('page', { autoClear: true });
var INIT = new eScenario('init', { initialRun: true });




var initNode = function(link, self, done) {
    var cnn = S('.canonical')[0];
    
    PAGE.virtUrl = [];
    
    if ( cnn ) {
        PAGE.url = ENGINE.modLink(cnn.attr('href'));
        if ( window.location.href.indexOf(cnn.attr('href')) == 0 ) {
            PAGE.virtUrl = window.location.href.sl([cnn.attr('href').length]).split('/');
        }
    } else {
        PAGE.url = ENGINE.modLink(window.location.href);
    }
    
    var urlMap = PAGE.url.split('/');
    PAGE.urlMap = {
        data:urlMap,
        lang:urlMap[3]||'en',
        tpl:urlMap[4]
    }
    
    $P(PAGE, 'lang', function() {
        return PAGE.urlMap.lang;
    }, function(newLang) {
        var newUMap = CO(PAGE.urlMap);
        newUMap.lang = newLang;
        newUMap.data[3] = newLang;
        
        ENGINE.goPage(newUMap.data.join('/'), function() {
            PAGE.urlMap = newUMap;
            PAGE.langObj = ORM.O('lang_'+newLang);
        }, null, function() {
            POP.info.show(cr('div', 'alert').VAL(PAGE.ld('this page has not being translated yet')));
        });
    });
    
    
    
    //-document.onkeyup = document.onkeydown = document.onkeypress = function(ev) {
    //-    if ( EVENT.data.key.ctrl && ev.keyCode == 9 ) {
    //-        ev.preventDefault();
    //-        return false;
    //-    }
    //-}
    
    
    
    done();
    
}

INIT.addAction('init', initNode);
PAGE.addAction('init', initNode);










INIT.addAction('ormRules', function(link, self, done) {
    done();
    
}, { autoRun:'init' });



INIT.addAction('lang', function(link, self, done) {
    
    PAGE.langObj = {
        name: PAGE.lang,
        strs: {}
    }
    
    PAGE.ld = function() {
        for ( var i = 0; i < arguments.length; i++ ) {
            var val = arguments[i];
            if ( PAGE.langObj.strs[val] ) { return PAGE.langObj.strs[val]; }
        }
        return arguments[arguments.length-1];
    }
    done();
    return 0;
}, { autoRun: 'ormRules' });







INIT.addAction('authCheck', function(link, self, done) {
    PAGE.level = 20;
    done();
}, { autoRun: 'lang' });







INIT.addAction('prep_userdata', function(link, self, done) {
    PAGE.userData = {};
    PAGE.profiles = [];
    PAGE.profile  = {};
    
    done();
    
}, { autoRun: 'authCheck' });










INIT.addAction('layer_prep', function(link, self, done) {
    
    SYS.fsMenu = S('.fsMenu')[0];
    SYS.fsMenuShown = false;
    
    LM.fetchPos(done);
}, { autoRun: 'prep_userdata' });




INIT.addAction('init_user', function(link, self, done) {
    
    PAGE.run();
    done();
    
}, { autoRun: 'layer_prep' });




PAGE.addAction('dom', function(link, self, done) {
    
    SYS.body = document.body;
    
    //- @
    if ( !PAGE.level ) {
        map(S('.ALF'), function(node) {
            node.onclick = ENGINE._auth.askLogin;
        });
    } else {
        map(S('.ALF'), function(node) {
            node.onclick = function() {
                ENGINE._auth.authCancel();
                ENGINE._auth.reload();
            }
        });
    }
    
    
    
    ENGINE.processDom();
    ENGINE.processDomFinish();
    
    map(S('blockquote'),   function(node) { SVG.meshChess.bg(node, {fill:'rgba(255,255,255,0.25)'});})
    
    EVENT.resize.push(function() {
        map(S('textarea'), adjustHeight);
    });
    map(S('textarea'), autoAdjust);
    
    done();
}, { autoRun: 'init'});
























