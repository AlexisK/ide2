
new eStorage('page', {
    req: function(self, path, todo) {
        todo = todo||log;
        
        getRawData(path, null, function(html) {
            self.store(path, resp);
            todo(resp);
        });
    }
}, ['req']);
