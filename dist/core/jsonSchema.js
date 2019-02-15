"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var JsonPointer = tslib_1.__importStar(require("../jsonPointer"));
var schemaId_1 = tslib_1.__importDefault(require("./schemaId"));
function parseSchema(content, url) {
    var _a = selectSchemaType(content), type = _a.type, openApiVersion = _a.openApiVersion;
    if (url != null) {
        setId(type, content, url);
    }
    var id = getId(type, content);
    return {
        type: type,
        openApiVersion: openApiVersion,
        id: id ? new schemaId_1.default(id) : schemaId_1.default.empty,
        content: content,
    };
}
exports.parseSchema = parseSchema;
function getSubSchema(rootSchema, pointer, id) {
    var content = JsonPointer.get(rootSchema.content, JsonPointer.parse(pointer));
    if (id == null) {
        var subId = getId(rootSchema.type, content);
        var getParentIds_1 = function (s, result) {
            result.push(s.id.getAbsoluteId());
            return s.rootSchema == null ? result : getParentIds_1(s.rootSchema, result);
        };
        if (subId) {
            id = new schemaId_1.default(subId, getParentIds_1(rootSchema, []));
        }
        else {
            id = new schemaId_1.default(pointer, getParentIds_1(rootSchema, []));
        }
    }
    return {
        type: rootSchema.type,
        id: id,
        content: content,
        rootSchema: rootSchema,
    };
}
exports.getSubSchema = getSubSchema;
function getId(type, content) {
    return content[getIdPropertyName(type)];
}
exports.getId = getId;
function setId(type, content, id) {
    var key = getIdPropertyName(type);
    if (content[key] == null) {
        content[key] = id;
    }
}
function getIdPropertyName(type) {
    switch (type) {
        case 'Draft04': return 'id';
        case 'Draft07': return '$id';
    }
}
function searchAllSubSchema(schema, onFoundSchema, onFoundReference) {
    var walkArray = function (array, paths, parentIds) {
        if (array == null) {
            return;
        }
        array.forEach(function (item, index) {
            walk(item, paths.concat(index.toString()), parentIds);
        });
    };
    var walkObject = function (obj, paths, parentIds) {
        if (obj == null) {
            return;
        }
        Object.keys(obj).forEach(function (key) {
            var sub = obj[key];
            if (sub != null) {
                walk(sub, paths.concat(key), parentIds);
            }
        });
    };
    var walkMaybeArray = function (item, paths, parentIds) {
        if (Array.isArray(item)) {
            walkArray(item, paths, parentIds);
        }
        else {
            walk(item, paths, parentIds);
        }
    };
    var walk = function (s, paths, parentIds) {
        if (s == null || typeof s !== 'object') {
            return;
        }
        var id = getId(schema.type, s);
        if (id && typeof id === 'string') {
            var schemaId = new schemaId_1.default(id, parentIds);
            var subSchema = {
                type: schema.type,
                id: schemaId,
                content: s,
                rootSchema: schema,
            };
            onFoundSchema(subSchema);
            parentIds = parentIds.concat([schemaId.getAbsoluteId()]);
        }
        if (typeof s.$ref === 'string') {
            var schemaId = new schemaId_1.default(s.$ref, parentIds);
            s.$ref = schemaId.getAbsoluteId();
            onFoundReference(schemaId);
        }
        walkArray(s.allOf, paths.concat('allOf'), parentIds);
        walkArray(s.anyOf, paths.concat('anyOf'), parentIds);
        walkArray(s.oneOf, paths.concat('oneOf'), parentIds);
        walk(s.not, paths.concat('not'), parentIds);
        walkMaybeArray(s.items, paths.concat('items'), parentIds);
        walk(s.additionalItems, paths.concat('additionalItems'), parentIds);
        walk(s.additionalProperties, paths.concat('additionalProperties'), parentIds);
        walkObject(s.definitions, paths.concat('definitions'), parentIds);
        walkObject(s.properties, paths.concat('properties'), parentIds);
        walkObject(s.patternProperties, paths.concat('patternProperties'), parentIds);
        walkMaybeArray(s.dependencies, paths.concat('dependencies'), parentIds);
        if (schema.type === 'Draft07') {
            if ('propertyNames' in s) {
                walk(s.propertyNames, paths.concat('propertyNames'), parentIds);
                walk(s.contains, paths.concat('contains'), parentIds);
                walk(s.if, paths.concat('if'), parentIds);
                walk(s.then, paths.concat('then'), parentIds);
                walk(s.else, paths.concat('else'), parentIds);
            }
        }
        if (schema.openApiVersion === 3) {
            var obj = s;
            if (obj.components && obj.components.schemas) {
                walkObject(obj.components.schemas, paths.concat('components', 'schemas'), parentIds);
            }
        }
    };
    walk(schema.content, ['#'], []);
}
exports.searchAllSubSchema = searchAllSubSchema;
function selectSchemaType(content) {
    if (content.$schema) {
        var schema = content.$schema;
        var match = schema.match(/http\:\/\/json-schema\.org\/draft-(\d+)\/schema#?/);
        if (match) {
            var version = Number(match[1]);
            if (version <= 4) {
                return { type: 'Draft04' };
            }
            else {
                return { type: 'Draft07' };
            }
        }
    }
    if (content.swagger === '2.0') {
        if (content.definitions) {
            setSubIds(content.definitions, 'Draft04', 'definitions');
        }
        return {
            type: 'Draft04',
            openApiVersion: 2,
        };
    }
    if (content.openapi) {
        var openapi = content.openapi;
        if (/^3\.\d+\.\d+$/.test(openapi)) {
            if (content.components && content.components.schemas) {
                setSubIds(content.components.schemas, 'Draft07', 'components/schemas');
            }
            return {
                type: 'Draft07',
                openApiVersion: 3,
            };
        }
    }
    return { type: 'Draft04' };
}
function setSubIds(obj, type, prefix) {
    Object.keys(obj).forEach(function (key) {
        var sub = obj[key];
        if (sub != null) {
            setId(type, sub, "#/" + prefix + "/" + key);
        }
    });
}
//# sourceMappingURL=jsonSchema.js.map