import { Router } from "express";
import { create, requestLogin, verifyEmailRegister } from '../controllers/user-controller';

const router = Router();

router.post("/user/register", create);
router.get("/user/verify-email/:token", verifyEmailRegister);
router.post("/user/login", requestLogin);

export default router;