import { Router } from "express";
import { authController } from "./auth.controller";
import verify from "../../middleware/verify";


const router = Router();

router.post('/auth/signup', authController.signupUser);
router.post('/auth/signin', authController.loginUser);

export const authRoute = router