
new eSubprogram('optionsMenu', function(options, name) {
    var self = this;
    
    self.init = function() {
        self.view  = _jO(cr('div', 'jOptionsMenu'));
        if ( def(name) ) {
            self.title = self.view.cr('h5').VAL(name);
        }
        self.cont  = self.view.cr('div');
        self.int = null;
        
        self._build();
    }
    
    self._build = function() {
        self.cont.innerHTML = '';
        
        map(options, function(optMap) {
            var func = optMap[1]||function(){};
            var newNode;
            
            if ( typeof(optMap[0]) == 'string') {
                newNode = self.cont.cr('div', 'fa').VAL(optMap[0]);
            } else {
                newNode = optMap[0];
                self.cont.attach(newNode);
            }
            
            clearEvents(newNode).onclick = function() {
                func();
                self._close();
                return false;
            }
        });
    }
    
    
    self.open = function() {
        document.body.attach(self.view);
        self.view.style.left = EVENT.data.cursor.x + 'px';
        self.view.style.top  = EVENT.data.cursor.y + 'px';
        EVENT.click.add(self.close);
        self.view.onclick = function() {
            tm(function() {
                clearInterval(self.int);
            });
        }
        tm(function() {
            clearInterval(self.int);
        });
        return false;
    }
    
    self.close = function() {
        self.int = tm(self._close, 10);
    }
    
    self._close = function() {
        self.view.detach();
        EVENT.click.remove(self.close);
    }
    
    self.init();
});

window.OPT = SUBPROGRAM.optionsMenu;


