
new eSubprogram('wshandler', function(url) {
    var self = this;
    
    self.init = function() {
        url = url||'ws://localhost:17864/websocket'
        self.handler = new WebSocket(url);
        self._url = url;
        
        self.handler.onopen     = self._onopen;
        self.handler.onclose    = self._onclose;
        self.handler.onmessage  = self._onmessage;
    }
    
    
    self._onopen = function() {
        self.send = function(data) { self.handler.send(JSON.stringify(data)); }
        self.onopen();
    }
    self._onclose = function() { self.onclose(); }
    self._onmessage = function(ev) { self.onmessage(JSON.parse(ev.data)); }
    
    self.onopen = function() {}
    self.onclose = function() {}
    self.onmessage = function() {}
    
});

SYS.WS = new SUBPROGRAM.wshandler();



SYS.WS.onopen = function() {
    SYS.notify('connection opened','ok');
    EVENT.emit('ws_opened');
}

SYS.WS.onclose = function() {
    SYS.notify('connection closed','error');
    EVENT.emit('ws_closed');
    setTimeout(SYS.WS.init, 3000);
}


SYS.WS.onmessage = function(resp) {
    log(resp);
    EVENT.emit('ws_'+resp.command, resp);
}

SYS.WS.init();



