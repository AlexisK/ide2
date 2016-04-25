
new eSubprogram('fbshare', function() {
    var self = this;
    
    self.init = function() {
        self.fbsharepassed = (glob('fbsharepassed') == 'true') && true || false;
        
        tm(self.prepDom);
        
    }
    
    self.prepDom = function() {
        self.view = self.view || VIEW.fbshare();
        document.body.attach(self.view);
        try{
            FB.XFBML.parse(); 
        }catch(ex){}
    }
    
    self.show = function(data) {
        data = data || {};
        
        if ( glob('fbsharepassed') != 'true' && !data.hard ) {
            self.view.F.setLangData();
            self.view.F.show();
        }
    }
    
    self.hide = function() {
        if ( self.view ) {
            self.view.F.hide();
        }
    }
    
    self.init();
});

if ( !CONF.project.disableFBShare ) {
    SYS.fbshare = new SUBPROGRAM.fbshare();
}




