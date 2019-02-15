"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultTypeNameConvertor = function (id) {
    var url = id.id;
    var ids = [];
    if (url.host) {
        ids.push(decodeURIComponent(url.host));
    }
    var addAllParts = function (path) {
        var paths = path.split('/');
        if (paths.length > 1 && paths[0] === '') {
            paths.shift();
        }
        paths.forEach(function (item) {
            ids.push(decodeURIComponent(item));
        });
    };
    if (url.pathname) {
        addAllParts(url.pathname);
    }
    if (url.hash && url.hash.length > 1) {
        addAllParts(url.hash.substr(1));
    }
    return ids.map(toTypeName);
};
function toTypeName(str) {
    if (!str) {
        return str;
    }
    str = str.trim();
    return str.split('$').map(function (s) { return s.replace(/(?:^|[^A-Za-z0-9])([A-Za-z0-9])/g, function (_, m) {
        return m.toUpperCase();
    }); }).join('$');
}
function normalizeTypeName(type) {
    type = type.replace(/[^0-9A-Za-z_$]+/g, '_');
    if (/^\d/.test(type)) {
        type = '$' + type;
    }
    return type;
}
exports.normalizeTypeName = normalizeTypeName;
//# sourceMappingURL=typeNameConvertor.js.map