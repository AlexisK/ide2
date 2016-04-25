CONF.project.auth = {
    askLogin: function() {
        ENGINE._auth.authCancel();
        
        var node = VIEW['auth-login']();
        node._onpopclose = function() {
            ENGINE._auth.authCancel();
            PROTOCOL.tab.write('window.location.reload()', null, true);
        }
        
        POP.modal.show(node);
    }
};









