import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({
  connectionString: `${config.connectionString}`,
});

export const initDb = async () => {
  // user table create query
  await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE CHECK (email = lower(email)) NOT NULL,
                password TEXT CHECK (char_length(password) >= 6) NOT NULL,
                phone VARCHAR(255) NOT NULL,
                role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'customer'))
            )
    `);
  // vehicle table query
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
    registration_number VARCHAR(100) NOT NULL UNIQUE,
    daily_rent_price NUMERIC(10, 2) NOT NULL CHECK (daily_rent_price > 0),
    availability_status VARCHAR(20) NOT NULL CHECK (availability_status IN ('available', 'booked'))
    )

    `);
  // bookings table
  await pool.query(`
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    rent_start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    rent_end_date DATE NOT NULL CHECK (rent_end_date > rent_start_date),
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price > 0),
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'cancelled', 'returned')));


    `);

  console.log("Connected Database");
};
