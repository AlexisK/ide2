

SYS.projects = {};
SYS.currentProject = null;
SYS.PG = {};


new eProcessor('projects', {
    process: function(self, db) {
        _jO(self);
        
        tm(db._process(self, db));
    },
    _process: function(self, db) {
        map(SYS.projects, function(project) {
            if ( project.rp(/\s+/g, '').length > 0 ) {
                self.attach(VIEW.project(project));
            }
        })
    }
});















