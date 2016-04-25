
function $F(str, data) {
    return str.replace(/{([a-z0-9\._\-\[\]]+)}?/gi, function(match, address) {
        log(address);
        return $AD(data, address);
    });
}

