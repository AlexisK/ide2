
new eProcessor('svg', {
    process: function(dom, db) {
        var nameMap = dom.D.svg.split('.');
        var name = nameMap.splice(0, 1)[0];
        var cls = nameMap.join(' ')+' '+CONF.object.svgCls;
        
        if ( def(name) && SVG[name] ) {
            var node = cr('div', cls);
            dom.attach(node);
            SVG[name](node, { fill: dom.D.fill||'#000' });
        }
    }
})

new eProcessor('bgsvg', {
    process: function(dom, db) {
        var nameMap = dom.D.bgsvg.split('.');
        var name = nameMap.splice(0, 1)[0];
        var cls = nameMap.join(' ')+' '+CONF.object.svgCls;
        
        if ( def(name) && SVG[name] ) {
            SVG[name].bg(dom, { fill: dom.D.fill||'#000' });
        }
    }
})


