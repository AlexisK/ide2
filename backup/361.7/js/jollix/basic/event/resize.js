{
    var calcWindowSize = function() {
        EVENT.data.windowSize = {
            x: window.innerWidth  || document.documentElement.clientWidth  || document.body.clientWidth,
            y: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        }
    }
    
    new eEvent('resize', {
        initiator: window,
        ontrigger: calcWindowSize
    }, calcWindowSize);
    
}
