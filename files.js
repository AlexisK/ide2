


new eHtml('Jfile', '<p class="title"></p><div class="add"></div>', { p:'title',div:'add'});
new eView('Jfile', {
    create: function() { return HTML.Jfile(cr('div','Jfile')); },
    init: function(self, obj) {
        self.V.title = obj.name;
        self.F.main = new T.F();
        clearEvent(self.V.title).onclick = function() {
            self.F.main();
        }
    }
});

new eView('Jdir', {
    create: function(block) {
        block.V.cont = block.cr('div','cont');
        return block;
    },
    init: function(self, obj) {
        self.V.title = obj.name;
        self.F.main = new T.F();
        clearEvent(self.V.title).onclick = function() {
            self.F.main();
        }
        self.F.open = function() { self.addCls('opened'); }
        self.F.close = function() { self.remCls('opened'); }
    }
},'Jfile');

new eView('Jproject', {
    create: function(block) {
        block.className = 'jProject';
        return block;
    }
},'Jfile');











var CLASSES = {};
function newClass(name, params, func) {
    var args = filterArgs('OF', [params,func]);
    params   = args[0];
    func     = args[1];
    
    CLASSES[name] = function(self, args) {
        if ( params.extends ) {
            map(parseLS(params.extends), function(pName) {
                CLASSES[pName](self, args);
            });
        }
        
        args = listToArray(args);
        args.splice(0,0,self);
        
        
        func.apply(self,args);
        self.__class = name;
        
        return self;
    }
    
    window[name] = function() {
        var obj = _jO({});
        
        obj.__extendFrom = function(pName, args) {
            CLASSES[pName](obj, args);
        }
        
        return CLASSES[name](obj, arguments);
    }
}







var URL = {};

newClass('bUrl', function(self, url) {
    self.init = function() {
        self.url = url;
        self._getName();
        
        self.views = [];
        URL[url] = self;
    }
    
    self._getName = function() {
        var urlMap      = self.url.split('/');
        self.name       = urlMap.splice(urlMap.length-1,1)[0];
        self.parentPath = urlMap.join('/');
    }
    
    self.F.main = new T.F();
    
    self.getView = function() {
        var view = VIEW[self.__class](self);
        
        view.F.main = function() {
            self.F.main();
            return false;
        }
        
        self.views.push(view);
        return view;
    }
    
    self.init();
});




newClass('Jfile', { extends: 'bUrl'}, function(self, url) {
    self.init = function() {
        self.session = null;
    }
    
    self.edit = function() {
        if ( self.session ) {
            return false;
        }
        return true;
    }
    
    self.F.main = function() { self.edit(); }
    
    self.init();
});


newClass('Jdir', { extends: 'bUrl'}, function(self, url) {
    self.init = function() {
        self._opened = false;
    }
    
    self.F.main = function() { self.switch(); }
    
    
    self.open = function() {
        if ( self._opened ) { return false; }
            map(self.views, function(view) { view.F.open(); });
        return true;
    }
    
    self.close = function() {
        if ( !self._opened ) { return false; }
            map(self.views, function(view) { view.F.close(); })
        return true;
    }
    
    
    self.switch = function() {
        if ( !self.open() ) { self.close() };
    }
    
    self.init();
});


newClass('Jproject', { extends: 'bUrl'}, function(self, url, title) {
    self.init = function() {
        self.title = title || self.name;
        self.settings = {
            tabsin: []
        }
    }
    
    self.setSettings = function(newStt) {
        self.settings = mergeObjects(self.settings, newStt);
    }
    
    self.init();
});










