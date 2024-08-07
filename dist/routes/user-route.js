"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user-controller");
const router = (0, express_1.Router)();
router.post("/user/register", user_controller_1.create);
router.get("/user/verify-email/:token", user_controller_1.verifyEmailRegister);
router.post("/user/login", user_controller_1.requestLogin);
exports.default = router;
