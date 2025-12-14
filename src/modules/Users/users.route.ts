import { Router } from "express";
import { userController } from "./users.controller";
import verify from "../../middleware/verify";


const route = Router();

route.get('/users', verify('admin') ,userController.getAllUser)

route.put('/users/:userId' ,verify('admin' , 'customer'), userController.updateUser)

export const userRoute = route