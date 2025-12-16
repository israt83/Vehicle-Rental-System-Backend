import express,{ Request, Response } from 'express'
import { initDb } from './database/db';

import { authRoute } from './modules/auth/auth.route';
import { userRoute } from './modules/Users/users.route';
import { vehicleRoute } from './modules/Vehicles/vehicles.route';

const app = express();
app.use(express.json())

initDb();

app.use('/api/v1' , authRoute)
app.use('/api/v1' , userRoute)
app.use('/api/v1' , vehicleRoute)

app.get('/',(req :Request  , res : Response) =>{
   res.status(200).json({
     message : " This is root route!!",
     path : req.path
   })
})

app.listen(3000, () => {
    console.log('Server started on port 3000');
});