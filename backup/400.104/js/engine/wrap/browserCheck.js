ENGINE.isIE = (window.navigator.userAgent.contains('MSIE ') || window.navigator.userAgent.contains('Trident/'));
ENGINE.isFF = (window.navigator.userAgent.contains('Firefox/'));
ENGINE.isOP = (window.navigator.userAgent.contains('Opera'));
ENGINE.isIB = (/iPhone|iPad/i.test(window.navigator.userAgent));
ENGINE.isAN = (window.navigator.userAgent.contains('Android'));
ENGINE.isMOB = ENGINE.isIB || ENGINE.isAN;

ENGINE.IEver = 0;
if ( ENGINE.isIE && window.navigator.userAgent.contains('MSIE ') ) {
    ENGINE.IEver = window.navigator.userAgent.indexOf('MSIE');
    ENGINE.IEver = parseInt(window.navigator.userAgent.substring(ENGINE.IEver+5, ENGINE.IEver+6));
    if ( ENGINE.IEver == 0 ) { ENGINE.IEver = 11; }
}

ENGINE.isIframe = window != window.top;

