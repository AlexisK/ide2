function $AD(obj, path) {
    if ( typeof(path) == 'string' ) { path = path.split('.'); }
    if ( !def(obj) ) { return null; }
    if ( path.length > 0 ) {
        return $AD(obj[path.splice(0,1)[0]], path);
    }
    return obj;
}

var addressIt = $AD;
