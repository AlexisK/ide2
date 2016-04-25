new eProcessor('decPercent', {
    process: function(dom, db) {
        dom.val = dom.val.toDec(4)*100+(_jO(dom).D.suff||'');
    }
})

