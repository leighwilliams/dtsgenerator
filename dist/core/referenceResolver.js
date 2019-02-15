"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
require("cross-fetch/polyfill");
var debug_1 = tslib_1.__importDefault(require("debug"));
var utils_1 = require("../utils");
var jsonSchema_1 = require("./jsonSchema");
var schemaId_1 = tslib_1.__importDefault(require("./schemaId"));
var debug = debug_1.default('dtsgen');
var ReferenceResolver = (function () {
    function ReferenceResolver() {
        this.schemaCache = new Map();
        this.referenceCache = new Map();
    }
    ReferenceResolver.prototype.dereference = function (refId) {
        var result = this.referenceCache.get(refId);
        if (result == null) {
            throw new Error('Target reference is not found: ' + refId);
        }
        return result;
    };
    ReferenceResolver.prototype.getAllRegisteredSchema = function () {
        return this.schemaCache.values();
    };
    ReferenceResolver.prototype.resolve = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var e_1, _a, error, _b, _c, _d, key, schema, id, fileId, result, refSchema, e_2, rootSchema, targetSchema, e_1_1;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        debug("resolve reference: reference schema count=" + this.referenceCache.size + ".");
                        error = [];
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 10, 11, 12]);
                        _b = tslib_1.__values(this.referenceCache.entries()), _c = _b.next();
                        _e.label = 2;
                    case 2:
                        if (!!_c.done) return [3, 9];
                        _d = tslib_1.__read(_c.value, 2), key = _d[0], schema = _d[1];
                        if (schema != null) {
                            return [3, 8];
                        }
                        id = new schemaId_1.default(key);
                        fileId = id.getFileId();
                        result = this.schemaCache.get(id.getAbsoluteId());
                        if (!(result == null)) return [3, 7];
                        refSchema = this.schemaCache.get(fileId);
                        if (!(refSchema == null)) return [3, 6];
                        if (!id.isFetchable()) {
                            error.push("The $ref target is not exists: " + id.getAbsoluteId());
                            return [3, 8];
                        }
                        _e.label = 3;
                    case 3:
                        _e.trys.push([3, 5, , 6]);
                        debug("fetch remote schema: id=[" + fileId + "].");
                        return [4, this.registerRemoteSchema(fileId)];
                    case 4:
                        _e.sent();
                        return [3, 6];
                    case 5:
                        e_2 = _e.sent();
                        error.push("Fail to fetch the $ref target: " + id.getAbsoluteId() + ", " + e_2);
                        return [3, 8];
                    case 6:
                        result = this.schemaCache.get(id.getAbsoluteId());
                        _e.label = 7;
                    case 7:
                        debug("resolve reference: ref=[" + id.getAbsoluteId() + "]");
                        if (result != null) {
                            this.referenceCache.set(id.getAbsoluteId(), result);
                        }
                        else {
                            if (id.existsJsonPointerHash()) {
                                rootSchema = this.schemaCache.get(fileId);
                                if (rootSchema == null) {
                                    error.push("The $ref targets root is not found: " + id.getAbsoluteId());
                                    return [3, 8];
                                }
                                targetSchema = jsonSchema_1.getSubSchema(rootSchema, id.getJsonPointerHash(), id);
                                this.addSchema(targetSchema);
                                this.registerSchema(targetSchema);
                                this.referenceCache.set(id.getAbsoluteId(), targetSchema);
                            }
                            else {
                                error.push("The $ref target is not found: " + id.getAbsoluteId());
                                return [3, 8];
                            }
                        }
                        _e.label = 8;
                    case 8:
                        _c = _b.next();
                        return [3, 2];
                    case 9: return [3, 12];
                    case 10:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3, 12];
                    case 11:
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7];
                    case 12:
                        if (error.length > 0) {
                            throw new Error(error.join('\n'));
                        }
                        return [2];
                }
            });
        });
    };
    ReferenceResolver.prototype.registerRemoteSchema = function (url) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res, body, content, schema;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, fetch(url)];
                    case 1:
                        res = _a.sent();
                        return [4, res.text()];
                    case 2:
                        body = _a.sent();
                        if (!res.ok) {
                            throw new Error("Error on fetch from url(" + url + "): " + res.status + ", " + body);
                        }
                        content = utils_1.parseFileContent(body, url);
                        schema = jsonSchema_1.parseSchema(content, url);
                        this.registerSchema(schema);
                        return [2];
                }
            });
        });
    };
    ReferenceResolver.prototype.registerSchema = function (schema) {
        var _this = this;
        debug("register schema: schemaId=[" + schema.id.getAbsoluteId() + "].");
        jsonSchema_1.searchAllSubSchema(schema, function (subSchema) {
            _this.addSchema(subSchema);
        }, function (refId) {
            _this.addReference(refId);
        });
    };
    ReferenceResolver.prototype.addSchema = function (schema) {
        var id = schema.id;
        var key = id.getAbsoluteId();
        if (!this.schemaCache.has(key)) {
            debug(" add schema: id=" + key);
            this.schemaCache.set(key, schema);
            if (schema.rootSchema == null) {
                var fileId = id.getFileId();
                if (!this.schemaCache.has(fileId)) {
                    this.schemaCache.set(fileId, schema);
                }
            }
        }
    };
    ReferenceResolver.prototype.addReference = function (refId) {
        if (!this.referenceCache.has(refId.getAbsoluteId())) {
            debug(" add reference: id=" + refId.getAbsoluteId());
            this.referenceCache.set(refId.getAbsoluteId(), undefined);
        }
    };
    ReferenceResolver.prototype.clear = function () {
        debug('clear resolver cache.');
        this.schemaCache.clear();
        this.referenceCache.clear();
    };
    return ReferenceResolver;
}());
exports.default = ReferenceResolver;
//# sourceMappingURL=referenceResolver.js.map