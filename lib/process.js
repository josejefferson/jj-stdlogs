"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("./logger");
var processStdout = process.stdout.write.bind(process.stdout);
var processStderr = process.stderr.write.bind(process.stderr);
var logToLogger = function (str) {
    logger_1.logger.append(str);
};
process.stdout.write = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    logToLogger(args[0]);
    return processStdout.apply(void 0, args);
};
process.stderr.write = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    logToLogger(args[0]);
    return processStderr.apply(void 0, args);
};
