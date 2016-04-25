
new eEditorField('dropdown', {
    build: f(self, data) {
        
        if ( data.model ) {
            var rng = RNG(ORM.model[data.model]);
            return cr.ormdropdown(rng);
        }
        
        return cr.dropdown(data.data);
    },
    onset: f(node, data, func) {
        if ( data.model ) {
            ORM.req(data.model+':select',f(list){
                var reqD = {};
                map(list, f(obj) {
                    reqD[obj.id] = ORM.getFullName(obj);
                });
                node._data = reqD;
                node.F.ddBuild();
                func();
            });
        } else {
            tm(func);
        }
    },
    require_validator: def,
    postprocess: f(self, data, INP) { INP.fullSet.addCls('oneline'); }
});
