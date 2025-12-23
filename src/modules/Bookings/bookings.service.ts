import { pool } from "../../database/db";
import getNumberOfDays, { formatDate } from "../../utils/getNumberOfDays";

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

  //check future date

  if (
    new Date(rent_end_date as string).getTime() <
    new Date(rent_start_date as string).getTime()
  ) {
    throw new Error("Please select a future date");
  }
  // price calculation

  const numberOfDays = getNumberOfDays(
    rent_start_date as Date,
    rent_end_date as Date
  );

  const total_price =
    Number(vehicleInfo.rows[0].daily_rent_price) * numberOfDays;

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
const getAllBookings = async (role: string, id: number) => {
  if (role === "admin") {
    const result = await pool.query(`
      SELECT * FROM bookings
    `);
    return result.rows;
  }

  if (role === "customer") {
    const result = await pool.query(
      `
      SELECT * FROM bookings WHERE customer_id = $1
      `,
      [id]
    );
    return result.rows;
  }

  throw new Error("Unauthorized access");
};

const updateBooking = async (
  bookingId: number,
  role: string,
  status: string
) => {
  const bookingResult = await pool.query(
    `SELECT * FROM bookings WHERE id = $1`,
    [bookingId]
  );
  if (bookingResult.rows.length === 0)
    throw new Error("This booking does not exist");

  const booking = bookingResult.rows[0];
  const vehicleId = booking.vehicle_id;

  const now = new Date();
  const startDate = new Date(booking.rent_start_date);
  const endDate = new Date(booking.rent_end_date);


  if (now > endDate) {
    const updatedBooking = await pool.query(
      `UPDATE bookings SET status = 'returned' WHERE id = $1 RETURNING *`,
      [bookingId]
    );
    const updatedVehicle = await pool.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = $1 RETURNING availability_status`,
      [vehicleId]
    );
    return {
      action: "auto",
      data: updatedBooking.rows[0],
      vehicle: updatedVehicle.rows[0],
    };
  }

  // CUSTOMER CANCEL
  if (role === "customer") {
    if (status !== "cancelled")
      throw new Error("Customer can only cancel booking");
    if (now >= startDate)
      throw new Error("Booking cannot be cancelled after start date");

    const cancelledBooking = await pool.query(
      `UPDATE bookings SET status = 'cancelled' WHERE id = $1 RETURNING *`,
      [bookingId]
    );
    return { action: "cancelled", data: cancelledBooking.rows[0] };
  }

  // ADMIN RETURN
  if (role === "admin") {
    if (status !== "returned")
      throw new Error("Admin can only mark booking as returned");

    const returnedBooking = await pool.query(
      `UPDATE bookings SET status = 'returned' WHERE id = $1 RETURNING *`,
      [bookingId]
    );
    const updatedVehicle = await pool.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = $1 RETURNING availability_status`,
      [vehicleId]
    );
    return {
      action: "returned",
      data: returnedBooking.rows[0],
      vehicle: updatedVehicle.rows[0],
    };
  }

  throw new Error("Unauthorized action");
};

export const bookingService = {
  createBooking,
  getAllBookings,
  updateBooking,
};
