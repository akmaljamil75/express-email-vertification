"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middlewareHandlingException = void 0;
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = require("mongoose");
const middlewareHandlingException = (err, req, res, next) => {
    let customError = {
        status: "failed",
        message: err.message || 'Something went wrong try again later',
        code: err.httpStatusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR
    };
    if (err instanceof mongoose_1.Error) {
        if (err instanceof mongoose_1.Error.ValidationError) {
            customError.code = http_status_codes_1.StatusCodes.BAD_REQUEST;
            customError.message = Object.values(err.errors).map((item) => item.message).join(', ');
        }
    }
    if (err.code) {
        if (err.code === 11000) {
            customError.message = `Duplicate value entered for ${Object.keys(err.keyValue)} `;
            customError.code = http_status_codes_1.StatusCodes.BAD_REQUEST;
        }
    }
    console.log(err.stack);
    return res.status(Number(customError.code)).json(customError);
};
exports.middlewareHandlingException = middlewareHandlingException;
