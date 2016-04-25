

new eProcessor('fsMenu', {
    process: function(self, db) {
        _jO(self);
        
        self.children = getChildren(self);
        
        self.int = null;
        self.close = f() {
            self.addCls('hidden');
            SYS.fsMenuShown = false;
            SYS.lastEditor.focus();
        }
        
        self.onclick = f() {
            self.int = tm(self.close, 4);
        }
        
        map(self.children, f(node) {
            node.onclick = f() {
                tm(f() {
                    clearInterval(self.int);
                }, 2);
            }
        });
    }
});











