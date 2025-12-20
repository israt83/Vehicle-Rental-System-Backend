import { Router } from "express";
import { bookingController } from "./bookings.controller";
import verify from "../../middleware/verify";


const router = Router();

router.post('/bookings',verify('customer','admin'),bookingController.createBooking);
router.get('/bookings',verify('admin' , 'customer'), bookingController.getAllBookings);

router.put('/bookings/:bookingId',verify('admin','customer'), bookingController.updateBooking)


export const bookingRoute = router