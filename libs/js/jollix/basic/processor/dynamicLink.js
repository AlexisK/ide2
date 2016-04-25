

new eProcessor('dynamicLink', {
    selector: 'a',
    process: function(dom, db) {
        
        if ( dom.className.split(' ').contains('noHref') || dom.attr('download') || dom.attr('data-ct') ) { return 0; }
        
        if ( dom.href.match(/^https?:\/\/(www\.)?youtube\.com/) ) {
            var qr = getQuery(dom.href);
            
            if ( qr.v ) {
                tm(f() {
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
        
        if ( dom.href.match(/^https?:\/\/(www\.)?vimeo\.com/) ) {
            var id = dom.href.split('vimeo.com/')[1];
            id = id.split(/[\#\?]/)[0];
            
            if ( id.length > 0 ) {
                tm(f() {
                    var viplayer = cr('div');
                    viplayer.innerHTML = [
                        '<iframe src="//player.vimeo.com/video/',
                        '" width="100%" height="360px" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'].join(id);
                    insBefore(viplayer, dom);
                    dom.addCls('hidden');
                });
                
                return 0;
            }
        }
        
        if ( dom.href.match(/^https?:\/\/(www\.)?(fb|facebook)\.com\/\w+\/videos\//) || dom.href.match(/^https?:\/\/(www\.)?(fb|facebook)\.com\/video.php/) ) {
            
            tm(f() {
                var fbplayer = cr('div','fb-video').attr({
                    'data-href'  : dom.href,
                    'data-width' : '100%',
                    'data-allowfullscreen' : 'true'
                });
                insBefore(fbplayer, dom);
                dom.addCls('hidden');
            });
            
            return 0;
        }
        
        dom.selfLink = ENGINE.getUrlData(dom.href);
        
        if ( dom.selfLink.own ) {
            if ( !ENGINE.noDynamicLink ) {
                clearEvents(dom).onclick = function() {
                    if ( (!EVENT.data.key || !EVENT.data.key.ctrl) && EVENT.data.button == 0 ) {
                        //-ENGINE.goPage(dom.selfLink.url);
                        LM.go(dom.selfLink.url);
                        return false;
                    }
                }
            }
        } else {
            dom.target = '_blank';
        }
    }
});

