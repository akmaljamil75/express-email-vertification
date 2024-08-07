"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NormalException = void 0;
class NormalException extends Error {
    constructor(message, http) {
        super(message);
        this.httpStatusCode = http;
    }
}
exports.NormalException = NormalException;
