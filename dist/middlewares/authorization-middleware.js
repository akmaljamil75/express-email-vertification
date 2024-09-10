"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizationMiddleware = void 0;
const jwt_util_1 = require("../utils/jwt-util");
const normal_exception_1 = require("../exception/normal-exception");
const http_status_codes_1 = require("http-status-codes");
const authorizationMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorizationHeaders = req.headers.authorization;
        if (authorizationHeaders && authorizationHeaders.startsWith("Bearer")) {
            const token = authorizationHeaders.substring(7);
            if (!token) {
                throw new normal_exception_1.NormalException("Invalid Token", http_status_codes_1.StatusCodes.UNAUTHORIZED);
            }
            const verify = (0, jwt_util_1.verifyToken)(token);
            const bodyToken = {
                email: verify === null || verify === void 0 ? void 0 : verify.payload.email,
                role: verify === null || verify === void 0 ? void 0 : verify.payload.role,
                username: verify === null || verify === void 0 ? void 0 : verify.payload.username,
                verified: verify === null || verify === void 0 ? void 0 : verify.payload.verified,
            };
            req['user'] = bodyToken;
            next();
        }
        else {
            throw new normal_exception_1.NormalException("Authorization token is missing or invalid", http_status_codes_1.StatusCodes.UNAUTHORIZED);
        }
    }
    catch (error) {
        next(error);
    }
});
exports.authorizationMiddleware = authorizationMiddleware;
