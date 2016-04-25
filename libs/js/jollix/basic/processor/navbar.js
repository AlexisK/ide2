
new eProcessor('navbar', {
    selector: '.navbar-fixed',
    showHeight: 260,
    process: function(dom, db) {
        
        function checkNavBar() {
            if ( EVENT.data.windowScroll.y > db.showHeight ) {
                dom.remCls('hide');
            } else {
                dom.addCls('hide');
            }
        }
        
        EVENT.global.scroll.add(checkNavBar);
        tm(checkNavBar);
    }
})


















