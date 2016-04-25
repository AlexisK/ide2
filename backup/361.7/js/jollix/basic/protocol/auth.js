
new eProtocol('auth', {
    prefix: '/_handler/auth/',
    fieldMap: {
        login:    parseLS('method,data'),
        confirm:  parseLS('method,data'),
        forgot:   parseLS('method,data'),
        getuser:  parseLS('method,data'),
        register: parseLS('method,data'),
        renew:    parseLS('method')
    }
}, 'api');


ENGINE._auth = mergeObjects(CONF.project.auth, {
    reload: function() {
        PROTOCOL.tab.write('window.location.href = window.location.href.split("#")[0];', null, true);
    },
    initLoggedMenu: function(func) {
        map(S('.authOnly'),    function(node) { node.remCls('hidden'); });
        map(S('.unauthOnly'),  function(node) { node.addCls('hidden'); });
        
        func();
    },
    renewMaybe: function(func) {
        var now = new Date()*1;
        
        func = func||function(){};
        
        if ( now > parseInt(glob('expiry')||0) ) {
            PROTOCOL.tab.write('ENGINE._auth.askLogin', [], true);
            ENGINE._auth.authCancel();
            func();
        } else if ( now > parseInt(glob('renew')||0) ) {
            ENGINE._auth.renew(function() { ENGINE._auth.initLoggedMenu(func); });
        } else {
            ENGINE._auth.initLoggedMenu(func);
        }
    },
    forgot: function(data, func, funcBad) {
        func = func||function(){};
        funcBad = funcBad||func;
        
        PROTOCOL.auth.write(':forgot', data, function(resp) {
            POP.info.show(cr('div').VAL([PAGE.ld('check mail'), data.email].join(' ')));
        }, log);
    },
    register: function(data, func, funcBad){
        func = func||function(){};
        funcBad = funcBad||func;
        
        PROTOCOL.auth.write(':register', data, function(resp) {
            POP.info.show(cr('div').VAL([PAGE.ld('check mail'), data.email].join(' ')));
        }, function(resp) {
            LOG.auth.write('register:', ['Fail',parseStr(resp.statusData)].join(' '));
            ENGINE._auth.authFail(data, resp.statusData);
            funcBad(resp.statusData);
        });
    },
    login: function(data, func, funcBad) {
        func = func||function(){};
        funcBad = funcBad||func;
        
        PROTOCOL.auth.write(':login', data, function(resp) {
            ENGINE._auth.authOk(data, resp.user[0], resp.session[0], function() {
                LOG.auth.write('login:', ['OK expiry',formatDate(resp.session[0].expiry, true, true),resp.session[0].token].join(' '));
                func();
                ENGINE._auth.reload();
            });
        }, function(resp) {
            LOG.auth.write('login:', ['Fail',parseStr(resp.statusData)].join(' '));
            ENGINE._auth.authFail(data, resp.statusData);
            funcBad(resp.statusData);
        });
    },
    renew: function(func) {
        var now = new Date()*1;
        
        if ( now > parseInt(glob('renew')||0) ) {
            PROTOCOL.auth.write(':renew', {}, function(resp) {
                log(resp);
                
                var user;
                if ( resp.user ) {
                    user = resp.user[0];
                } else {
                    user = PAGE.user||parseObj(glob('user'));
                }
                
                ENGINE._auth.authOk({}, user, resp.session[0], function() {
                    LOG.auth.write('renew:', ['OK expiry',formatDate(resp.session[0].expiry, true, true),resp.session[0].token].join(' '));
                    func();
                    ENGINE._auth.renewDelayed();
                });
            }, function(resp) {
                LOG.auth.write('renew:', ['Fail',parseStr(resp.statusData)].join(' '));
                ENGINE._auth.authFail({}, resp.statusData);
            });
        }
    },
    delayInt: null,
    renewDelayed: function() {
        var now = new Date()*1;
        ENGINE._auth.delayInt = tm(ENGINE._auth.renewMaybe, now-parseInt(glob('renew'))+parseInt(Math.random()*30000));
    },
    authOk: function(data, user, session, func) {
        func = func||function(){};
        var now = new Date()*1;
        glob('token'  , session.token);
        glob('expiry' , session.expiry);
        glob('renew'  , now + (session.expiry - now) / 2);
        glob('user'   , parseStr(user));
        glob('email'  , user.email);
        ENGINE._auth.renewDelayed();
        func();
    },
    authFail: function(data, resp) {
        
    },
    authCancel: function(data, resp) {
        clearInterval(ENGINE._auth.delayInt);
        glob.removeItem('token');
        glob.removeItem('expiry');
        glob.removeItem('renew');
        glob.removeItem('user');
    }
});



ENGINE._auth.oauth2Success = function(key) {
    var data = glob(key);
    glob.removeItem(key);
    log(data);
    
    PROTOCOL.auth.data.read({}, data, null, function(resp) {
        log(resp);
        ENGINE._auth.authOk(data, resp.user[0], resp.session[0], function() {
            LOG.auth.write('login:', ['OK oauth2 expiry',formatDate(resp.session[0].expiry, true, true),resp.session[0].token].join(' '));
            ENGINE._auth.reload();
        });
    }, function(resp) {
        log(resp);
        LOG.auth.write('login:', ['Fail oauth2',parseStr(resp.statusData)].join(' '));
        ENGINE._auth.authFail(data, resp.statusData);
        funcBad(resp.statusData);
    })
}





ENGINE._auth.askLogin = function() {
    POP.info.show(VIEW.loginMenu());
}




