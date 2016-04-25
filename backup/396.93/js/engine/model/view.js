window.VIEW = {};
window.HTML = {};


function eView(name, params, parent) {
    var self = this;
    self.model = VIEW;
    params = params||{};
    
    params.create = params.create||function(block){ return block; }
    
    
    
    self._generate = function(block) {
        if ( def(parent) ) {
            block = VIEW[parent]._generate(block);
        }
        return params.create(block);
    }
    
    self.generate = function(func) {
        var block = self._generate();
        
        if ( def(params.init) ) { func(block); }
        
        return _jO(block);
    }
    
    
    
    self.req = function(oid, hard) {
        return self.generate(function(block) {
            ORM.O(oid, function(obj) {
                params.init(block, obj);
                ENGINE.processDom(block);
                
            }, hard);
        });
    }
    
    self.build = function(obj) {
        return self.generate(function(block) {
            block.C.reinit = function(data) {
                params.init(block, data);
                ENGINE.processDom(block);
            }
            block.C.reinit(obj);
            
        });
    }
    
    self.clone           = self.build;
    self.clone._generate = self._generate;
    self.clone.req       = self.req;
    
    VIEW[name] = self.clone;
}


function eHtml(name, html, data) {
    var self = this;
    self.model = HTML;
    html = html||'';
    data = data||{};
    
	self.generate = function(block) {
		_jO(block).innerHTML = html;
		block.V = mergeObjects(block.V, selectorMapping(block, data));
		return block;
	}
	
	HTML[name] = self.generate;
}










