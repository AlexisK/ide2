
new eHtml('fbshare', '<div class="heading"><div class="asBtn closeBtn"></div></div>\
<div class="heading t2"></div>\
<div class="angDeco"></div>\
<div class="likeBlock"><div class="fb-like" data-href="' + (ENGINE.path.fbpage || ENGINE.path.page) + '/" data-layout="standard" data-width="300" data-action="like" data-show-faces="true" data-share="false"></div></div>\
<div class="ending"><a href="#" class="noHref asBtn"></a></div>', {
    '.asBtn':'closeBtn1,closeBtn2',
    '.likeBlock':'likeBlock',
    '.heading':'heading,desc',
    '.angDeco':'deco'
});

new eView('fbshare', {
    create: function() { return HTML.fbshare(cr('div','fbshare fa')); },
    init: function(self, obj) {
        
        self.V.heading.style.backgroundImage = ['url(',ENGINE.path.static,'images/fb.png)'].join('');
        
        SVG.meshTopRight(self.V.deco);
        SVG.close(self.V.closeBtn1);
        
        
        self.F.show = function() { tm(function() { self.addCls('opened'); }, %animationCss); }
        self.F.hide = function() { self.remCls('opened'); }
        self.F.setLangData = function() {
            self.V.desc.val      = PAGE.ld('fbshare1');
            self.V.closeBtn2.val = PAGE.ld('fbshare2');
        }
        
        clearEvents(self.V.closeBtn1).onclick = function() {
            self.F.hide();
            return false;
        }
        clearEvents(self.V.closeBtn2).onclick = function() {
            self.F.hide();
            glob('fbsharepassed', 'true');
            return false;
        }
        
        ENGINE.processDom(self);
    }
});

