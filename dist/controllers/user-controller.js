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
exports.requestLogin = exports.verifyEmailRegister = exports.create = void 0;
const http_status_codes_1 = require("http-status-codes");
const user_service_1 = require("../services/user-service");
const jsonwebtoken_1 = require("jsonwebtoken");
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const insert = yield (0, user_service_1.register)(body);
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "Berhasil Membuat Data User, Silahkan konfirmaasi email",
            status: "success",
            code: "00",
            data: insert
        });
    }
    catch (error) {
        next(error);
    }
});
exports.create = create;
const verifyEmailRegister = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        yield (0, user_service_1.verifyEmail)(String(token));
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "Berhasil Memvertifikasi Email User",
            status: "success",
            code: "00",
        });
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send("Link Expired Harap Minta Vertifikasi Ulang");
        }
        next(error);
    }
});
exports.verifyEmailRegister = verifyEmailRegister;
const requestLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const auth = yield (0, user_service_1.login)(body);
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "Berhasil Login",
            status: "success",
            code: "00",
            token: auth
        });
    }
    catch (error) {
        next(error);
    }
});
exports.requestLogin = requestLogin;
