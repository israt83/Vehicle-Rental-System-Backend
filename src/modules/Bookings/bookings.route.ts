import { Router } from "express";
import { bookingController } from "./bookings.controller";
import verify from "../../middleware/verify";


const router = Router();

router.post('/bookings',verify('customer','admin'),bookingController.createBooking);
router.get('/bookings', bookingController.getAllBookings)


export const bookingRoute = router