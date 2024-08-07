"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokenVerifyEmail = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const generateToken = (payload) => {
    const secretKey = config_1.Config.getJwtSecret();
    return jsonwebtoken_1.default.sign({ payload }, secretKey, { expiresIn: '1h' });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    const secretKey = config_1.Config.getJwtSecret();
    return jsonwebtoken_1.default.verify(token, secretKey);
};
exports.verifyToken = verifyToken;
const generateTokenVerifyEmail = (payload) => {
    const secretKey = config_1.Config.getJwtSecret();
    return jsonwebtoken_1.default.sign({ payload }, secretKey, { expiresIn: '15m' });
};
exports.generateTokenVerifyEmail = generateTokenVerifyEmail;
