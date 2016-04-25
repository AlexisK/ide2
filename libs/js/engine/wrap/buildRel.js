
ENGINE.rels = {
    parent: {},
    child: {},
    available: []
};

ENGINE.addRel = function(from, to) {
    ENGINE.rels.parent[from] = ENGINE.rels.parent[from] || [];
    ENGINE.rels.parent[from].add(to);
    ENGINE.rels.child[to] = ENGINE.rels.child[to] || [];
    ENGINE.rels.child[to].add(from);
    ENGINE.rels.available.add(from);
    ENGINE.rels.available.add(to);
}





ENGINE.buildRels = function() {
    map(ENGINE.rels.available, f(model) {
        var parent_list = ENGINE.rels.parent[model]||[];
        var child_list  = ENGINE.rels.child[model] ||[];
        
        ORM.onModel(model, f(obj) {
            map(parent_list, f(m2) {
                
                $P(obj._rel, m2, f() { return ORM.O(m2+'_'+obj[m2+'_id']); });
            });
            map(child_list, f(m2) {
                var r = {}; r[model+'_id'] = obj.id;
                $P(obj._rel, m2,  f() { return RNG(ORM.model[m2]).filter(r); });
            })
        });
    });
}
