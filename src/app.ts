import express,{ Request, Response } from 'express'
import { initDb } from './database/db';

import { authRoute } from './modules/auth/auth.route';
import { userRoute } from './modules/Users/users.route';
import { vehicleRoute } from './modules/Vehicles/vehicles.route';
import { bookingRoute } from './modules/Bookings/bookings.route';

const app = express();
app.use(express.json())

initDb();

app.use('/api/v1' , authRoute)
app.use('/api/v1' , userRoute)
app.use('/api/v1' , vehicleRoute)
app.use('/api/v1' , bookingRoute)



app.get('/',(req :Request  , res : Response) =>{
   res.status(200).send('Vehicle Rental System Running...')
})

// not found route
app.use((req : Request , res : Response) => {
    res.status(404).send('Route not found')
})
export default app