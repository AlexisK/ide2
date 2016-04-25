{
    new eEvent('storage', {
        initiator: window,
        ontrigger: function(ev) {
            if ( EVENT.stor[ev.key] && ev.newValue != '' ) {
                EVENT.stor[ev.key](parseObj(ev.newValue));
            }
        }
    });
}
