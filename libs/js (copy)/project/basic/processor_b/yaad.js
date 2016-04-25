


new eProcessor('yaad', {
    process: function(self, db) {
        _jO(self);
        var ind = self.D.yaind;
        var data = parseObj(self.val);
        
        if ( !data && !ind ) { return 0; }
        data = parseObj(data.replace(/(\w+):/g,'"$1":'));
        if ( typeof(data) != 'object' ) { return 0; }
        
        
        self.remCls('hidden');
        self._buffer  = [ind,data];
        db._process(self,db);
    },
    _process: function(self,db) {
        
        var ind  = self._buffer[0];
        var data = self._buffer[1];
        
        if ( self.D.w || self.D.h ) {
            data.width  = parseInt(self.D.w || self.offsetWidth || data.width);
            data.height = parseInt(self.D.h || data.height);
            
            if ( self.D.mh ) {
                var sizes = parseLS(self.D.mh);
                map(sizes, function(size) {
                    size = size.split(':');
                    if ( data.width < size[0] ) {
                        data.height = parseInt(size[1]||data.height);
                        data.limit  = parseInt(size[2]||data.limit)
                    }
                })
                
            }
        }
        
        
        
        self.val = '';
        
        
        
        if ( data.width > 0 ) {
            var id = 'yandex_ad_'+db.gid;
            self.attr('id', id);
            db.gid += 1;
            
            window.yandex_context_callbacks = window.yandex_context_callbacks || [];
            window.yandex_context_callbacks.push(function() { Ya.Direct.insertInto(ind, id, data); });
        }
        
    },
    gid: 1,
    onprocessed: function(db) {
        
        var s = S('#ya_script');
        if ( s ) { detach(s); }
        
        
        s = cr(['sc','pt'].join('ri'));
        s.id = 'ya_script';
        //-s.async = true;
        s.attr({
            type: 'text/javascript',
            //-src: '//an.yandex.ru/system/context.js?v='+(new Date()*1)
            src: '//an.yandex.ru/system/context.js'
        });
        
        var loaded = false;
        var loadFunc = function() {
            if ( loaded ) { return 0; }
            loaded = true;
            log('ya loaded');
        }
        s.onload = loadFunc;
        s.onreadystatechange = loadFunc;
        
        document.body.attach(s);
        
    }
});


EVENT.on('goPage', function() {
    PROCESSOR.yaad.data.gid = 1;
}, true);













