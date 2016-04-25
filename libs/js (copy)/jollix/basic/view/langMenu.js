{
    CONF.engine.switchedOffLangs = CONF.engine.switchedOffLangs || [];
    
    new eHtml('langMenu', '<div class="langButtons"></div><div class="cont"></div>', {
        '.langButtons':'langButtons',
        '.cont':'block'
    });
    
    
    function processLM(node) {
        
        node.C.onLang = function() {};
        node.C.langButtons = {};
        
        mapO(ORM.model.lang, function(lang) {
            if ( !CONF.engine.switchedOffLangs.contains(lang.name) ) {
                var langBtn = node.V.langButtons.cr('div', 'lang-btn asBtn fa').VAL(lang.name);
                node.C.langButtons[lang.name] = langBtn;
                
                langBtn.clickOn = function() {
                    switchActive(node.C.langButtons, langBtn);
                    node.C.currentLang = lang;
                    node.C.onLang(lang);
                }
                langBtn.onclick = langBtn.clickOn;
            }
        });
        
        if ( node.C.langButtons[PAGE.lang] ) {
            node.C.langButtons[PAGE.lang].clickOn();
        }
        
    }
    
    
    new eView('langMenu', {
        create: function() {
            var node = HTML.langMenu(cr('div', 'langMenu'));
            
            processLM(node);
            
            return node;
        }
    });
}












