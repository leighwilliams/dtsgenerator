"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function get(obj, path, isCreateOnNotExists) {
    if (isCreateOnNotExists === void 0) { isCreateOnNotExists = false; }
    if (path.length === 0) {
        return obj;
    }
    var o = obj;
    var lastKey = path[path.length - 1];
    for (var i = 0; i < path.length - 1; i++) {
        var key = path[i];
        var next = o[key];
        if (next == null) {
            if (isCreateOnNotExists) {
                next = {};
                o[key] = next;
            }
            else {
                return undefined;
            }
        }
        o = next;
    }
    return o[lastKey];
}
exports.get = get;
function set(obj, path, value) {
    if (path.length === 0) {
        return;
    }
    var o = obj;
    var lastKey = path[path.length - 1];
    for (var i = 0; i < path.length - 1; i++) {
        var key = path[i];
        var next = o[key];
        if (next == null) {
            next = {};
            o[key] = next;
        }
        o = next;
    }
    o[lastKey] = value;
}
exports.set = set;
function parse(s) {
    if (/^#/.test(s)) {
        s = s.substring(1);
    }
    var path = s.split('/');
    if (path.shift() !== '') {
        throw new Error('Invalid JSON-Pointer format: ' + s);
    }
    return path.map(function (key) { return untilde(key); });
}
exports.parse = parse;
function untilde(key) {
    return key.replace(/~(0|1)/g, function (match) {
        switch (match) {
            case '~0': return '~';
            case '~1': return '/';
            default: throw new Error('Unsupported tilded number.');
        }
    });
}
//# sourceMappingURL=jsonPointer.js.map