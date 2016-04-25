window.VALIDATOR = {};


function eValidator(name, data, isCustom) {
    var self = this;
    self.model = VALIDATOR;
    
    self.init = function() {
        if ( isCustom ) {
            VALIDATOR[name] = function() {
                return data.apply(self, [self].concat(listToArray(arguments)));
            }
            
        } else if ( typeof(data) == 'function' ) {
            VALIDATOR[name] = function(node) {
                return self.run(node, data);
            }
            
        } else if ( typeof(data) == 'object' && data.constructor == RegExp ) {
            VALIDATOR[name] = function(node) {
                return self.run(node, function(val) { return data.test(val); });
            }
            
        }
    }
    
    self.runSingle = function(elem, func) {
        if ( func(elem.val) ) {
            remCls(elem, 'notValid');
            addCls(elem, 'isValid');
            return true;
        } else {
            remCls(elem, 'isValid');
            addCls(elem, 'notValid');
            return false;
        }
    }
    
    self.run = function(target, func) {
        target.onkeyup = function() { self.runSingle(this, func); }
        return self.runSingle(target, func);
    }
    
    self.init();
}



