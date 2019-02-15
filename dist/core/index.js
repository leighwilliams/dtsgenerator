"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dtsGenerator_1 = tslib_1.__importDefault(require("./dtsGenerator"));
var jsonSchema_1 = require("./jsonSchema");
var referenceResolver_1 = tslib_1.__importDefault(require("./referenceResolver"));
var schemaConvertor_1 = tslib_1.__importDefault(require("./schemaConvertor"));
var writeProcessor_1 = tslib_1.__importDefault(require("./writeProcessor"));
var schemaId_1 = require("./schemaId");
exports.SchemaId = schemaId_1.default;
var typeNameConvertor_1 = require("./typeNameConvertor");
exports.DefaultTypeNameConvertor = typeNameConvertor_1.DefaultTypeNameConvertor;
function dtsGenerator(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var processor, resolver, convertor, generator;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    processor = new writeProcessor_1.default(options);
                    resolver = new referenceResolver_1.default();
                    convertor = new schemaConvertor_1.default(processor, options.typeNameConvertor);
                    if (options.contents != null) {
                        options.contents
                            .map(function (content) { return jsonSchema_1.parseSchema(content); })
                            .forEach(function (schema) { return resolver.registerSchema(schema); });
                    }
                    if (!(options.inputUrls != null)) return [3, 2];
                    return [4, Promise.all(options.inputUrls.map(function (url) { return resolver.registerRemoteSchema(url); }))];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    generator = new dtsGenerator_1.default(resolver, convertor, options.namespaceName);
                    return [4, generator.generate()];
                case 3: return [2, _a.sent()];
            }
        });
    });
}
exports.default = dtsGenerator;
//# sourceMappingURL=index.js.map