{
    new eEvent('keydown', {
        ontrigger: function(ev) {
            if ( def(ev.ctrlKey) ) {
                EVENT.data.key = {
                    ctrl: ev.ctrlKey,
                    alt: ev.altKey,
                    shift: ev.shiftKey
                }
            } else {
                EVENT.data.key = {
                    ctrl: null,
                    alt: null,
                    shift: null
                }
            }
        }
    });
}
