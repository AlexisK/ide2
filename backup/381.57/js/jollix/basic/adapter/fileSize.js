
new eAdapter('fileSize', {
    process: function(self, dom) {
        dom.__fileSize = parseInt(dom.val)||0;
        dom.__fileConf = CONF.object.adapter_filesize;
        
        dom.__drawFileSize = function() {
            var index = 0;
            for ( var val = dom.__fileSize; val > dom.__fileConf.limit; val /= dom.__fileConf.mult, index += 1);
            
            val = Math.round(val * dom.__fileConf.precision) / dom.__fileConf.precision;
            
            dom.textContent = [val, dom.__fileConf.strs[index]||''].join(' ');
        }
        
        $P(dom, 'val', function() {
            return dom.__fileSize;
        }, function(data) {
            dom.__fileSize = parseInt(data)||0;
            dom.__drawFileSize();
        })
    },
    selector: '.ad_filesize'
});









