import { Router } from "express";
import { userController } from "./users.controller";
import verify from "../../middleware/verify";


const route = Router();

route.get('/users', verify('admin') ,userController.getAllUser)

export const userRoute = route