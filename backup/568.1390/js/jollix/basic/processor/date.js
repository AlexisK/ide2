SYS.now = new Date();



new eProcessor('date', {
    process: function(dom, db) {
        dom.selfTime = dom.val;
        dom.val = formatDate(dom.selfTime);
    }
})

new eProcessor('datetime', {
    process: function(dom, db) {
        _jO(dom);
        dom.selfTime = dom.val;
        
        dom.val = formatDate(dom.selfTime, true);
        dom.remCls('dateHid');
        
        if ( dom.D.dthide == 'true' && dom.val == '' ) {
            dom.addCls('hidden');
        }
    }
})


new eProcessor('polemixdate', {
    process: function(dom, db) {
        _jO(dom);
        tmp = new Date(parseInt(dom.val));
        var time = [tmp.getHours().toLen(),tmp.getMinutes().toLen()].join(':');
        
        if ( tmp.getFullYear() == SYS.now.getFullYear() && tmp.getMonth() == SYS.now.getMonth() && tmp.getDate() == SYS.now.getDate() ) {
            dom.val = time;
        } else {
            var date = [tmp.getDate().toLen(),(tmp.getMonth()+1).toLen()].join('/');
            dom.val = [date, time].join(' ');
        }
        
        dom.remCls('dateHid');
    }
})
