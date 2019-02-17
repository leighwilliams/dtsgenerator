"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var debug_1 = tslib_1.__importDefault(require("debug"));
var debug = debug_1.default('dtsgen');
function toTSType(type, debugSource) {
    switch (type) {
        case 'integer':
            return 'number';
        case 'any':
        case 'null':
        case 'undefined':
        case 'number':
        case 'boolean':
            return type;
        case 'string':
            if (debugSource.format && debugSource.format === 'date') {
                return 'Date';
            }
            return type;
        case 'object':
        case 'array':
            return undefined;
        case 'date':
        case 'Date':
            return 'Date';
        default:
            if (debugSource) {
                debug("toTSType: unknown type: " + JSON.stringify(debugSource, null, 2));
            }
            throw new Error('unknown type: ' + type);
    }
}
exports.toTSType = toTSType;
function reduceTypes(types) {
    if (types.length < 2) {
        return types;
    }
    var set = new Set(types);
    if (set.delete('integer')) {
        set.add('number');
    }
    return Array.from(set.values());
}
exports.reduceTypes = reduceTypes;
function mergeSchema(a, b) {
    Object.keys(b).forEach(function (key) {
        var value = b[key];
        if (a[key] != null && typeof value !== typeof a[key]) {
            debug("mergeSchema warning: type is mismatched, key=" + key);
        }
        if (Array.isArray(value)) {
            a[key] = (a[key] || []).concat(value);
        }
        else if (typeof value === 'object') {
            a[key] = Object.assign(a[key] || {}, value);
        }
        else {
            a[key] = value;
        }
    });
    return a;
}
exports.mergeSchema = mergeSchema;
//# sourceMappingURL=utils.js.map