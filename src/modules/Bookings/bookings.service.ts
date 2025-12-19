import { pool } from "../../database/db";
import { formatDate } from "../../utils/formateDate";

const createBooking = async (payload: Record<string, any>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  // vehicle info
  const vehicleInfo = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [
    vehicle_id,
  ]);

  if (vehicleInfo.rows.length === 0) {
    throw new Error("This vehicle does not exists.");
  }

  // check status
  if (vehicleInfo.rows[0].availability_status === "booked") {
    const error: any = new Error(
      "This vehicle is already booked. Please select another vehicle."
    );

    error.status = 409;
    throw error;
  }



  // price calculation
  const startDate = new Date(rent_start_date);
  const endDate = new Date(rent_end_date);

  const numberOfDays = Math.round(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const total_price = Number(
    vehicleInfo.rows[0].daily_rent_price * numberOfDays
  );

  // create booking

  const bookingResult = await pool.query(
    `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price , status) VALUES ($1, $2, $3, $4, $5 ,$6 ) RETURNING *`,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      "active",
    ]
  );

  // update vehicle
  const updateVehicle = await pool.query(
    `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1 RETURNING vehicle_name , daily_rent_price`,
    [vehicle_id]
  );

  const vehicle_name = updateVehicle.rows[0].vehicle_name;
  const daily_rent_price = Number(updateVehicle.rows[0].daily_rent_price);

  const bookingData = {
    ...bookingResult.rows[0],
    rent_start_date: formatDate(bookingResult.rows[0].rent_start_date),
    rent_end_date: formatDate(bookingResult.rows[0].rent_end_date),
    total_price: Number(bookingResult.rows[0].total_price),
    vehicle: {
      vehicle_name,
      daily_rent_price,
    },
  };

  return bookingData;
};
const getAllBookings = async (role : string , id : number) =>{
    if(role === 'admin'){
        const result = await pool.query(`SELECT * FROM bookings`)
        return result.rows;
    }else if (role == 'customer'){
        const result = await pool.query(`SELECT * FROM bookings WHERE customer_id = $1`,[id])
        return result.rows;
    }else{
        throw new Error('Unauthorized access')
    }
}

export const bookingService = {
  createBooking,
  getAllBookings
};
