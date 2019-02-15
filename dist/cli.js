"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fs_1 = tslib_1.__importDefault(require("fs"));
var mkdirp_1 = tslib_1.__importDefault(require("mkdirp"));
var path_1 = tslib_1.__importDefault(require("path"));
var commandOptions_1 = tslib_1.__importStar(require("./commandOptions"));
var core_1 = tslib_1.__importDefault(require("./core"));
var utils_1 = require("./utils");
function readSchemaFromStdin() {
    process.stdin.setEncoding('utf-8');
    return new Promise(function (resolve, reject) {
        var data = '';
        process.stdin
            .on('readable', function () {
            var chunk;
            while (chunk = process.stdin.read()) {
                if (typeof chunk === 'string') {
                    data += chunk;
                }
            }
        })
            .once('end', function () {
            resolve(utils_1.parseFileContent(data));
        })
            .once('error', function (err) {
            reject(err);
        });
    });
}
function readSchemasFromFile(pattern) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var files;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, utils_1.globFiles(pattern)];
                case 1:
                    files = _a.sent();
                    return [2, Promise.all(files.map(function (file) {
                            return new Promise(function (resolve, reject) {
                                fs_1.default.readFile(file, { encoding: 'utf-8' }, function (err, content) {
                                    if (err) {
                                        reject(err);
                                    }
                                    else {
                                        try {
                                            resolve(utils_1.parseFileContent(content, file));
                                        }
                                        catch (e) {
                                            reject(e);
                                        }
                                    }
                                });
                            });
                        }))];
            }
        });
    });
}
function exec() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var e_1, _a, contents, _b, _c, _d, _e, pattern, cs, e_1_1;
        return tslib_1.__generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    commandOptions_1.initialize(process.argv);
                    contents = [];
                    if (!commandOptions_1.default.isReadFromStdin()) return [3, 2];
                    _c = (_b = contents).push;
                    return [4, readSchemaFromStdin()];
                case 1:
                    _c.apply(_b, [_f.sent()]);
                    _f.label = 2;
                case 2:
                    _f.trys.push([2, 7, 8, 9]);
                    _d = tslib_1.__values(commandOptions_1.default.files), _e = _d.next();
                    _f.label = 3;
                case 3:
                    if (!!_e.done) return [3, 6];
                    pattern = _e.value;
                    return [4, readSchemasFromFile(pattern)];
                case 4:
                    cs = _f.sent();
                    contents = contents.concat(cs);
                    _f.label = 5;
                case 5:
                    _e = _d.next();
                    return [3, 3];
                case 6: return [3, 9];
                case 7:
                    e_1_1 = _f.sent();
                    e_1 = { error: e_1_1 };
                    return [3, 9];
                case 8:
                    try {
                        if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7];
                case 9:
                    core_1.default({
                        contents: contents,
                        inputUrls: commandOptions_1.default.urls,
                        namespaceName: commandOptions_1.default.namespace,
                    }).then(function (result) {
                        if (commandOptions_1.default.out) {
                            mkdirp_1.default.sync(path_1.default.dirname(commandOptions_1.default.out));
                            fs_1.default.writeFileSync(commandOptions_1.default.out, result, { encoding: 'utf-8' });
                        }
                        else {
                            console.log(result);
                        }
                    }).catch(function (err) {
                        console.error(err.stack || err);
                    });
                    return [2];
            }
        });
    });
}
exec();
//# sourceMappingURL=cli.js.map