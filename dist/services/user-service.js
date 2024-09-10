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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.verifyEmail = exports.sendVerifyEmail = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = require("http-status-codes");
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config/config");
const normal_exception_1 = require("../exception/normal-exception");
const user_model_1 = __importDefault(require("../models/user-model"));
const jwt_util_1 = require("../utils/jwt-util");
const util_1 = require("util");
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const readFile = (0, util_1.promisify)(fs_1.default.readFile);
const register = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = yield bcryptjs_1.default.hash(payload.password, 12);
    const body = {
        email: payload.email,
        password: hash,
        role: payload.role,
        verified: false,
        username: payload.username
    };
    const insert = yield user_model_1.default.create(body);
    const bodyToken = {
        email: payload.email,
        role: payload.role,
        verified: false,
        username: payload.username
    };
    const token = (0, jwt_util_1.generateTokenVerifyEmail)(bodyToken);
    yield (0, exports.sendVerifyEmail)(body.email, token, body.username);
    delete insert._id;
    return insert;
});
exports.register = register;
const sendVerifyEmail = (email, token, username) => __awaiter(void 0, void 0, void 0, function* () {
    let html = yield readFile('src/index.html', 'utf8');
    let template = handlebars_1.default.compile(html);
    let data = {
        username: username,
        url: `Please verify your email by clicking the following link: http://localhost:3000/user/verify-email/${token}`
    };
    let htmlToSend = template(data);
    const transporter = nodemailer_1.default.createTransport({
        service: "Gmail",
        host: config_1.Config.getEmailUser(),
        port: 465,
        secure: true,
        auth: {
            user: config_1.Config.getEmailUser(),
            pass: config_1.Config.getEmailPassword(),
        },
    });
    return yield transporter.sendMail({
        from: config_1.Config.getEmailUser(),
        to: email,
        subject: 'Email Verification',
        html: htmlToSend
    });
});
exports.sendVerifyEmail = sendVerifyEmail;
const verifyEmail = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const verify = (0, jwt_util_1.verifyToken)(token);
    const bodyToken = {
        email: verify === null || verify === void 0 ? void 0 : verify.payload.email,
        role: verify === null || verify === void 0 ? void 0 : verify.payload.role,
        username: verify === null || verify === void 0 ? void 0 : verify.payload.username,
        verified: verify === null || verify === void 0 ? void 0 : verify.payload.verified,
    };
    if (verify.payload.verified) {
        throw new normal_exception_1.NormalException("Email Sudah DiVertifikasi", http_status_codes_1.StatusCodes.TOO_MANY_REQUESTS);
    }
    const bodyUpdate = {
        verified: true
    };
    const findEmail = yield user_model_1.default.findOneAndUpdate(bodyToken, bodyUpdate);
    if (!findEmail) {
        throw new normal_exception_1.NormalException("Email Not Found!!!", http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    return findEmail;
});
exports.verifyEmail = verifyEmail;
const login = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const findUser = yield user_model_1.default.findOne({ email: body.email });
    if (!findUser) {
        throw new normal_exception_1.NormalException("Username Tidak Ditemukan", http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    const compare = yield bcryptjs_1.default.compare(body.password, findUser.password);
    if (!compare) {
        throw new normal_exception_1.NormalException("Password Yang Dimasukan Salah", http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    if (!findUser.verified) {
        throw new normal_exception_1.NormalException("Email Belum DiVertifikasi, Silahkan Melakukan Permintaan Vertifikasi", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
    const bodyToken = {
        email: findUser.email,
        role: findUser.role,
        username: findUser.username,
        verified: findUser.verified,
    };
    const token = (0, jwt_util_1.generateToken)(bodyToken);
    return token;
});
exports.login = login;
