
new eProcessor('dynamicLink', {
    selector: 'a',
    process: function(dom, db) {
        
        if ( dom.className.split(' ').contains('noHref') ) { return 0; }
        
        if ( dom.href.match(/^https?:\/\/(www\.)?youtube\.com/) ) {
            var qr = getQuery(dom.href);
            
            if ( qr.v ) {
                tm(function() {
                    var ytplayer = cr('div');
                    ytplayer.innerHTML = [
                        '<iframe id="ytplayer" type="text/html" width="100%" height="360px" src="https://www.youtube.com/embed/',
                        '?autoplay=0" frameborder="0" allowfullscreen>'].join(qr.v);
                    insBefore(ytplayer, dom);
                    dom.addCls('hidden');
                });
                
                return 0;
            }
        }
        
        dom.selfLink = ENGINE.getUrlData(dom.href);
        
        if ( dom.selfLink.own ) {
            clearEvents(dom).onclick = function() {
                if ( (!EVENT.data.key || !EVENT.data.key.ctrl) && EVENT.data.button == 0 ) {
                    //-ENGINE.goPage(dom.selfLink.url);
                    LM.go(dom.selfLink.url);
                    return false;
                }
            }
        } else {
            dom.target = '_blank';
        }
    }
});

