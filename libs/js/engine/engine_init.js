var NOW = new Date()*1;

window.ENGINE = {
    path: {
        page:      '%baseUrl',
        handler:   '%baseUrl/_handler/',
        static:    '%baseUrl/static/',
        media_raw: '%baseUrl/_media/',
        media:     ['%baseUrl/_media/',NOW,'/'].join(''),
        compiled:  ['%baseUrl/_compiled/',NOW,'/'].join('')
    },
    menu: {},
    goAnimation: false
};

#include engine/wrap/basic
#include engine/wrap/browserCheck
#include engine/wrap/dom
#import engine/cr
#include engine/wrap/ajax

#include engine/wrap/math
#include engine/wrap/class
#include engine/wrap/range
#include engine/wrap/buildRel


window.CONF = {
    engine:  {},
    object:  {},
    extend:  {},
    project: {}
};





#include project/engineConf


#include engine/worker/address
#include engine/worker/translitter
#include engine/worker/format
#include engine/worker/pageCleaner
#include engine/worker/dynamicPageRequest
#include engine/worker/domFilter
#include engine/worker/swipeManager
#include engine/worker/cronEmitFilter
#include engine/worker/closeOnClick
#include engine/worker/notify

#include engine/model/parse
#include engine/model/protocol
#include engine/model/svg
#include engine/model/log
#include engine/model/subprogram
#include engine/model/storage
#include engine/model/layer
#include engine/model/validator
#include engine/model/view
#include engine/model/pop

#include engine/model/adapter
#include engine/model/processor
#include engine/worker/processDom

#include engine/model/event
#include engine/model/scenario
