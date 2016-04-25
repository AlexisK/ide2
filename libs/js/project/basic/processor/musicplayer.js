


new eProcessor('musicplayer', {
    process: function(self, db) {
        _jO(self);
        self.dirs = {};
        
        self.view = VIEW.musicplayer();
        self.attach(self.view);
        
    }
});















