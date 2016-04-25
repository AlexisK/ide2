

new eProcessor('paginator', {
    selector: '.paginator',
    process: function(self, db) {
        _jO(self);
        var links = S('a', self).length;
        db.page = Math.max(0, parseInt(PAGE.virtUrl[0]||0));
        db.basePath = self.D.burl || PAGE.url;
        
        self.innerHTML = '';
        
        if ( links > 1 ) {
            var start = Math.max(0, db.page - 3);
            var end = Math.min(links, start + 7);
            
            
            if ( db.page != 0 ) {
                db.createBtn(self, db, db.page-1, PAGE.ld('prev'), 'wide');
            }
            
            if ( start != 0 ) {
                db.createBtn(self, db, 0, null, 'first');
            }
            
            for ( var i = start; i < end; i++) {
                db.createBtn(self, db, i);
            }
            
            if ( db.page != links-1 ) {
                db.createBtn(self, db, db.page+1, PAGE.ld('next'), 'wide');
            }
            
            
            ENGINE.processDom(self);
        }
    },
    createBtn: function(self,db, url, title, cls) {
        title = title || (url + 1);
        var clsmap = [(cls || ''),'fa'];
        if ( url == db.page ) {
            clsmap.push('active');
        }
        
        PAGE.virtUrl[0] = url;
        url = PAGE.virtUrl.join('/');
        
        var btn = self.cr('a', clsmap.join(' ')).VAL(title).attr({href:[db.basePath,url].join('')});
        
        return btn;
    }
});















