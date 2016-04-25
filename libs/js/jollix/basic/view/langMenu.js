{
    CONF.engine.switchedOffLangs = CONF.engine.switchedOffLangs || [];
    
    new eHtml('langMenu', '<div class="langButtons"></div><div class="cont"></div>', {
        '.langButtons':'langButtons',
        '.cont':'block'
    });
    
    
    function processLM(node) {
        
        node.C.onLang = function() {};
        node.C.setLang = f(lang) {
            if ( node.C.langButtons[lang] ) {
                node.C.langButtons[lang].clickOn();
            }
        }
        node.C.langButtons = {};
        
        mapO(ORM.model.lang, function(lang) {
            if ( !CONF.engine.switchedOffLangs.contains(lang.name) ) {
                var langBtn = node.V.langButtons.cr('div', 'lang-btn asBtn fa').VAL(lang.name);
                node.C.langButtons[lang.name] = langBtn;
                
                langBtn.clickOn = function() {
                    switchActive(node.C.langButtons, langBtn);
                    node.C.currentLang = lang;
                }
                langBtn.onclick = f() {
                    langBtn.clickOn();
                    node.C.onLang(lang);
                }
            }
        });
        
        node.C.setLang(PAGE.lang);
        node.C.onLang(PAGE.lang);
    }
    
    
    new eView('langMenu', {
        create: function() {
            var node = HTML.langMenu(cr('div', 'langMenu'));
            
            processLM(node);
            
            return node;
        }
    });
}












