import { Router } from "express";
import { vehicleController } from "./vehicles.controller";
import verify from "../../middleware/verify";

const router = Router();

router.post('/vehicles',verify('admin'),vehicleController.addVehicles)
router.get('/vehicles' , vehicleController.getVehicles)
router.get('/vehicles/:vehicleId' , vehicleController.getSingleVehicle)
router.put('/vehicles/:vehicleId' ,verify('admin'), vehicleController.updateVehicle)
router.delete('/vehicles/:vehicleId',verify('admin'), vehicleController.deleteVehicle)
export const vehicleRoute = router