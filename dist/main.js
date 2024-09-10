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
const express_1 = __importDefault(require("express"));
const config_1 = require("./config/config");
const database_connection_1 = require("./database/database-connection");
const process_1 = require("process");
const body_parser_1 = __importDefault(require("body-parser"));
const user_route_1 = __importDefault(require("../src/routes/user-route"));
const handling_exception_middleware_1 = require("./middlewares/handling-exception-middleware");
const authorization_middleware_1 = require("./middlewares/authorization-middleware");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    const port = config_1.Config.getPort();
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    // Unatheticated endpoints
    app.use(user_route_1.default);
    //authenticated endpoints
    app.use(authorization_middleware_1.authorizationMiddleware);
    app.use("/", (req, res) => {
        res.send("Welcome To Sarabih");
    });
    try {
        (0, database_connection_1.databaseConnection)();
    }
    catch (error) {
        console.log(error);
        (0, process_1.exit)(1);
    }
    app.listen(port, () => {
        console.log("app listen port : " + port);
    });
    // handling middlewares error
    app.use(handling_exception_middleware_1.middlewareHandlingException);
});
main();
