import { Router } from "express";
import { authController } from "./auth.controller";


const router = Router();

router.post('/auth/signup', authController.signupUser);
router.post('/auth/login', authController.loginUser);

export const authRoute = router