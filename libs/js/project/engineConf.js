
ENGINE.path.fbpage = null;

CONF.engine.dynamicPageSelectors = ".menu,.wrapper:class,.content,footer,.dynb,.canonical:href".split(',');
CONF.engine.dynamicPopSelectors  = ".content,.dynb".split(',');
CONF.engine.mainContentSelector = ".content";
CONF.engine.switchedOffLangs = ['en'];



CONF.engine.dynamicPageRetarget = {
    exchange: {
        pop      : "window",
        urlMap   : "/pop/".split('/'),
        selector : [".container"]
    }
}


CONF.engine.layer = {
    pop: ["/pop/".split('/')]
}



CONF.engine.defaultDomFilterRules = {
        available   : 'a,table,tr,td,th,font,ins,img,br,h3,h4,code,blockquote,pre,p,strong,i',
        stackable   : 'p',
        textwrap    : 'p',
        plain       : 'span,nobr',
        empty       : 'td,img,br',
        
        morph       : {
            h3      : 'h1,h2',
            h4      : 'h5,h6',
            p       : 'div,label,article,body,html,header,footer,li',
            strong  : 'b',
            i       : 'em'
        },
        
        attrs       : {
            'p,blockquote' : 'style',
            a       : 'href',
            font    : 'color',
            img     : 'src,alt,width,height,data-imagetype,data-media,data-preview,data-full',
            'td,th' : 'colspan,rowspan'
        },
        
        styles      : {
            'p,blockquote' : 'text-align'
        }
        
    }

CONF.engine.articleImage = {
    size: {
        thumb:   '40x40x2',
        thumb2:  '120x80x2',
        preview: '640x360x2'
    },
    type: 'ogimage',
    startSize: 'preview',
    thumbSize: 'thumb2'
};

CONF.engine.swipeEvents = 'touchstart,touchend,touchcancel,touchleave,touchmove,mousedown,mousemove';

CONF.engine.table = {
    entitiesPerPage: 30,
    offsetTop: 65
};

CONF.engine.notify = {
    timeout: {
        def: 3000,
        red: 6000
    }
}

