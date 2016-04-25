

new eProcessor('paginator', {
    selector: '.paginator',
    process: function(self, db) {
        _jO(self);
        tm(f(){ db._process(self, db); });
    },
    _process: function(self, db) {
        
        var links     = S('a', self).length;
        self.page     = Math.max(0, parseInt(PAGE.virtUrl[0]||0));
        self.basePath = self.D.burl   || PAGE.url;
        self.suffix   = self.D.suffix || '';
        
        self.innerHTML = '';
        
        if ( links > 1 ) {
            var start = Math.max(0, self.page - 3);
            var end = Math.min(links, start + 7);
            
            
            if ( self.page != 0 ) {
                db.createBtn(self, db, self.page-1, PAGE.ld('prev'), 'wide');
            }
            
            if ( start != 0 ) {
                db.createBtn(self, db, 0, null, 'first');
            }
            
            for ( var i = start; i < end; i++) {
                db.createBtn(self, db, i);
            }
            
            if ( self.page != links-1 ) {
                db.createBtn(self, db, self.page+1, PAGE.ld('next'), 'wide');
            }
            
            if ( end != links ) {
                db.createBtn(self, db, links-1, PAGE.ld('last'), 'wide');
            }
            
            
            ENGINE.processDom(self);
        }
    },
    createBtn: function(self,db, url, title, cls) {
        title = title || (url + 1);
        var clsmap = [(cls || ''),'fa'];
        if ( url == self.page ) {
            clsmap.push('active');
        }
        
        PAGE.virtUrl[0] = url;
        url = PAGE.virtUrl.join('/');
        
        var btn = self.cr('a', clsmap.join(' ')).VAL(title).attr({href:[self.basePath,url,self.suffix].join('')});
        
        return btn;
    }
});















