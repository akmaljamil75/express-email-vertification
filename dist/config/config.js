"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class Config {
    static getPort() {
        return parseInt(process.env.PORT);
    }
    static getUriMongo() {
        return String(process.env.MONGO_URI);
    }
    static getJwtSecret() {
        return String(process.env.SECRET_KEY);
    }
    static getEmailUser() {
        return String(process.env.EMAIL_USER);
    }
    static getEmailPassword() {
        return String(process.env.EMAIL_PASSWORD);
    }
}
exports.Config = Config;
