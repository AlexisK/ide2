
new eProtocol('proxy', {
    prefix: '/_handler/proxy/',
    write: function(self, askUrl,funcOk,funcBad) {
        var newurl = PROTOCOL.proxy.data.getUrl(askUrl);
        
        getRawData(newurl, f(html) {
            self.read(html, funcOk, funcBad);
        }, funcBad);
        
    },
    read: function(self, resp, funcOk, funcBad) {
        if ( resp ) { funcOk(resp); } else { funcBad(resp); }
    },
    getUrl: function(askUrl) {
        var urlMap;
        if ( askUrl.map ) {
            urlMap = askUrl;
        } else {
            urlMap = ENGINE.getUrlData(askUrl);
        }
        
        if ( urlMap.own ) { return urlMap.url; }
        
        var reqData = {
            schema : urlMap.map[0],
            host   : urlMap.map[1],
            path   : '/'+urlMap.map.sl([2]).join('/')
        };
        
        var reqStr = ['token='+glob('token')];
        mapO(reqData, function(v,k) {
            reqStr.push([k,v].join('='));
        });
        
        var newurl = PROTOCOL.proxy.data.prefix+'?'+reqStr.join('&');
        return newurl;
    }
});

PROTOCOL.proxy.getUrl = PROTOCOL.proxy.data.getUrl;
