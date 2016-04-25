
CONF.engine.dynamicPageRetarget = CONF.engine.dynamicPageRetarget || {};

ENGINE.getUrlData = function(url) {
    var urlMap = url.split('/');
    var result = {
        url: '',
        own: false
    };
    
    if ( url.indexOf('http') == 0 ) {
        if ( url.indexOf(ENGINE.path.page) == 0 ) { result.own = true; }
        result.url = url;
    } else if( urlMap.length > 1 && !urlMap[0].contains('.') ) {
        result.own = true;
        if ( url[0] != '/' ) { url = '/'+url; }
        result.url = ENGINE.path.page+url;
    } else {
        result.url = 'http://'+url;
    }
    
    result.map = result.url.split('/');
    result.map[0] = result.map[0].rp(':','');
    result.map.splice(1,1);
    var t = result.map[result.map.length-1];
    t = t.split('?')[0];
    result.map[result.map.length-1] = t.split('#')[0];
    
    
    mapO(CONF.engine.dynamicPageRetarget, function(rules, key) {
        if ( map(rules.urlMap, function(urlPart, i) {
            if ( urlPart.length > 0 && urlPart != result.map[i] ) { return false; }
        }) ) {
            result.retarget = key;
        }
        
        
    });
    
    result.query  = getQuery(result.url);
    result.anchor = getQuery(result.url, '#', null);
    
    return result;
}
ENGINE.modLink = function(url) { return ENGINE.getUrlData(url).url; }










//-ENGINE._pageSelectors = CO(CONF.engine.dynamicPageSelectors);
//-
//-
//-ENGINE.goPage = function(url, func, noHistory, onfail) {
//-    onfail = onfail || log;
//-    url = url || window.location.href;
//-    
//-    var urlData = ENGINE.getUrlData(url);
//-    
//-    
//-    
//-    var wrapStl = S('.wrap-style')[0];
//-    if ( ENGINE.goAnimation && PAGE.level && wrapStl ) {
//-        wrapStl.addCls('opaque');
//-    }
//-    
//-    
//-    
//-    
//-    var rules, virtualBlock;
//-    if ( urlData.retarget ) {
//-        rules   = CONF.engine.dynamicPageRetarget[urlData.retarget];
//-        virtualBlock = cr('div');
//-    } else {
//-        rules = {selector:ENGINE._pageSelectors}
//-    }
//-    rules.parent = rules.parent || '/';
//-    
//-    
//-    getRawData(url, function(html) {
//-        var domFilter = cr('div');
//-        domFilter.innerHTML = html;
//-        
//-        var locsFrom = S('.relLoc', domFilter);
//-        var locsTo   = S('.relLoc');
//-        map(locsFrom, function(node) {
//-            insBefore(node, locsTo[0]);
//-        });
//-        map(locsTo, detach);
//-        
//-        
//-        map(rules.selector, function(selector) {
//-            
//-            var selMap = selector.split(':');
//-            selector = selMap.splice(0,1)[0];
//-            var attrs = selMap;
//-            
//-            var list_from = S(selector, domFilter);
//-            var list_to   = S(selector);
//-            if ( rules.pop ) {
//-                list_to = [];
//-                RNG(list_from.length).each(function() { list_to.push(virtualBlock.cr('div')); })
//-            }
//-            
//-            
//-            
//-            map(list_to, function(to, index) {
//-                var from = list_from[index]||cr('div');
//-                
//-                var from_ver = from.attr('data-version');
//-                var to_ver   = to.attr('data-version');
//-                
//-                
//-                if ( !def(from_ver) || from_ver != to_ver ) {
//-                    if ( def(attrs) && attrs.length > 0 ) {
//-                        map(attrs, function(attr) {
//-                            to.attr(attr, from.attr(attr));
//-                        });
//-                        
//-                    } else {
//-                        to.innerHTML = from.innerHTML;
//-                        to.className = from.className + ' fa';
//-                    }
//-                    
//-                    
//-                    to.attr('data-version', from_ver);
//-                    if ( def(to.C) && def(to.C.processors) ) {
//-                        to.C.processors = {};
//-                    }
//-                }
//-            });
//-            
//-            if ( rules.pop ) {
//-                POP[popName].show(virtualBlock);
//-            }
//-        });
//-        
//-        
//-        if ( ENGINE.goAnimation && PAGE.level && wrapStl ) {
//-            tm(function() {
//-                wrapStl.remCls('opaque');
//-            }, %animationCss);
//-        }
//-        
//-        
//-        document.title = S('title', domFilter)[0].val;
//-        setDocumentScroll();
//-        PAGE.url = url;
//-        
//-        if ( !noHistory ) {
//-            
//-            history.pushState({
//-                selfUrl: url
//-            }, document.title, url);
//-            
//-        }   
//-        
//-        
//-        ENGINE.apiPageWork();
//-        
//-        
//-        ENGINE.clear();
//-        SCENARIO.page.run();
//-        
//-        EVENT.emit('goPage');
//-        if ( def(func) ) { func(); }
//-        
//-    }, onfail);
//-}

window.onpopstate = function(ev) {
    var newUrl = ENGINE.modLink(window.location.pathname)+(window.location.hash||'');
    //-log(ev, newUrl);
    
    LM.go(newUrl, null, {noHistory:true});
    //-if ( def(ev.state) && def(ev.state.selfUrl)) {
    //-    //-ENGINE.goPage(ev.state.selfUrl, null, true);
    //-    //-log(ev.state.selfUrl);
    //-    LM.go(ev.state.selfUrl, null, {noHistory:true});
    //-}
}















ENGINE.gaBlocked = false;

ENGINE.apiPageWork = function() {
    if ( !ENGINE.gaBlocked && window.ga ) {
        
        map(S('script'), function(scr) {
            var att = scr.attr('src');
            if ( att && (att.contains('pagead2.googlesyndication.com') || att.contains('an.yandex.ru')) ) {
                scr.detach();
            }
        });
        
        for ( var key in window ) {
            var pkey = key.toLowerCase();
            if ( pkey.indexOf('google') >= 0 || pkey.indexOf('yandex') >= 0 ) { delete window[key]; }
        }
        
        delete window.yandex_context_callbacks;
        
        gss = cr('script').attr({
            async : 'true'
        });
        gss.className = 'gss';
        gss.src = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        document.body.attach(gss);
        
        
        
        
        window.ga.l = new Date()*1;
        window.ga.q = [];
        ga('send', 'pageview', {
            'page': PAGE.url,
            'title': document.title
        });
        LOG.ga.write('pageview',PAGE.url);
        
        ENGINE.gaBlocked = true;
        tm(function() { ENGINE.gaBlocked = false; }, 1000);
    }
    
    try {
        FB.XFBML.parse(null, function() {
            EVENT.emit('resize');
        });
    } catch(err) {}
}











