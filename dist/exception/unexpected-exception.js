"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnexpectedError = void 0;
const http_status_codes_1 = require("http-status-codes");
class UnexpectedError extends Error {
    constructor(message) {
        super(message);
        this.httpStatusCode = http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    }
}
exports.UnexpectedError = UnexpectedError;
