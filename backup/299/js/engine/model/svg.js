
window.SVG = {
    _static: {
        part1: '<svg version="1.1" viewBox="0 0 ',
        part2: '>',
        part3: '</svg>',
        part1Bg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ',
        part0Bg: 'data:image/svg+xml;base64,'
    },
    _obj: {},
    clear: function(node) {
        node.innerHTML = '';
    },
    clearBg: function(node) {
        node.style.backgroundImage = '';
    }
};


function eSvg(name, content, data) {
    var self   = this;
    self.model = SVG;
    
    self.init = function() {
        self.data = mergeObjects({
            size: '40x40',
            params: {}
        }, data);
        self.size = self.data.size.split('x');
        
        var dataMap = self.build(self.data.params);
        
        self.paramsString = dataMap[0];
        
        self.svgHtml   = dataMap[1];
        self.svgCss    = dataMap[2];
        
        SVG[name]      = self.clone;
        SVG[name].bg   = self.bgClone;
        SVG._obj[name] = self;
    }
    
    self.build = function(params) {
        var pString = [];
        mapO(params, function(val, key) {
            pString.push([' ',key,'="',val,'"'].join(''));
        });
        pString = pString.join('');
        
        var html = [SVG._static.part1,  self.size[0],' ',self.size[1],'"',pString,SVG._static.part2,content,SVG._static.part3].join('');
        var css  = [SVG._static.part1Bg,self.size[0],' ',self.size[1],'"',pString,SVG._static.part2,content,SVG._static.part3].join('');
        css = ['url(',SVG._static.part0Bg, btoa(css),')'].join('');
        
        return [pString, html, css];
    }
    
    self.clone = function(target, params) {
        target = target || cr('div');
        if ( def(params) ) {
            var dataMap = self.build(params);
            target.innerHTML = dataMap[1];
        } else {
            target.innerHTML = self.svgHtml;
        }
        
        return target;
    }
    self.bgClone = function(target, params) {
        target = target || cr('div');
        if ( def(params) ) {
            var dataMap = self.build(params);
            target.style.backgroundImage = dataMap[2];
        } else {
            target.style.backgroundImage = self.svgCss;
        }
        
        return target;
    }
    
    self.init();
}







