{
    new eHtml('menu3col', '<div class="data-select t1"><input type="text" placeholder="filter" /><div class="cont"></div></div>\
    <div class="data-select t2"><input type="text" placeholder="filter" /><div class="cont"></div></div>\
    <div class="data-editarea"><div class="cont"></div></div>', {
        input:'filter1,filter2',
        '.cont':'side1,side2,cont'
    });
    
    
    function processM3C(self) {
        self.B = {
            list1: [],
            list2: []
        };
        
        self.C.doFilter = function() {
            domSearch(self.B.list1, self.V.filter1.val);
            domSearch(self.B.list2, self.V.filter2.val);
        }
        self.V.filter1.onkeyup = self.C.doFilter;
        self.V.filter2.onkeyup = self.C.doFilter;
        
    }
    
    
    new eView('menu3col', {
        create: function(self) {
            HTML.menu3col(self.V.block);
            self.V.block.addCls('menu3col');
            self.V = mergeObjects(self.V, self.V.block.V);
            
            processM3C(self);
            
            return self;
        }
    }, 'langMenu');
    
}



















