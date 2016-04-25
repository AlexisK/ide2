{
    var calcDocumentScroll = function() {
        EVENT.data.windowScroll = {
            x: window.pageXOffset || document.documentElement.scrollLeft,
            y: window.pageYOffset || document.documentElement.scrollTop
        }
    }
    
    new eEvent('scroll', {
        initiator: window,
        ontrigger: calcDocumentScroll
    }, calcDocumentScroll);
}
