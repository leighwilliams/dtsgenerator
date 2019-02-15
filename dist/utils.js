"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var glob_1 = tslib_1.__importDefault(require("glob"));
var js_yaml_1 = tslib_1.__importDefault(require("js-yaml"));
var path_1 = tslib_1.__importDefault(require("path"));
function parseFileContent(content, filename) {
    var ext = filename ? path_1.default.extname(filename).toLowerCase() : '';
    var maybeYaml = ext === '.yaml' || ext === '.yml';
    try {
        if (maybeYaml) {
            return js_yaml_1.default.safeLoad(content);
        }
        else {
            return JSON.parse(content);
        }
    }
    catch (e) {
        if (maybeYaml) {
            return JSON.parse(content);
        }
        else {
            return js_yaml_1.default.safeLoad(content);
        }
    }
}
exports.parseFileContent = parseFileContent;
function globFiles(pattern, options) {
    return new Promise(function (resolve, reject) {
        glob_1.default(pattern, options || {}, function (err, matches) {
            if (err) {
                reject(err);
            }
            else {
                resolve(matches);
            }
        });
    });
}
exports.globFiles = globFiles;
//# sourceMappingURL=utils.js.map