{
    new eEvent('mousemove', {
        ontrigger: function(ev) {
            EVENT.data.cursor = {
                x:ev.clientX,
                y:ev.clientY,
                sx:ev.screenX,
                sy:ev.screenY
            };
        }
    });
}
