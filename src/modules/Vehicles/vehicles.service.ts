import { pool } from "../../database/db";

const addVehicles = async (payload: Record<string, any>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;
  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );
  return result;
};

const getVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result;
};

const getSingleVehicle = async (vehicleId: number) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [
    vehicleId,
  ]);
  return result;
};

const updateVehicle = async (payload: Record<string, any>, id: number) => {
  const { vehicle_name, type, daily_rent_price, availability_status } = payload;
  const result = await pool.query(
    `UPDATE vehicles SET vehicle_name = $1, type = $2, daily_rent_price = $3, availability_status = $4 WHERE id = $5 RETURNING *`,
    [vehicle_name, type, daily_rent_price, availability_status, id]
  );
  return result;
};
const deleteVehicle = async (vehicleId: number) => {
  const vehicle = await pool.query(
    `SELECT id , availability_status FROM vehicles WHERE id = $1`,
    [vehicleId]
  );

  if (vehicle.rows.length === 0) {
    throw new Error("Vehicle not found");
  }
//   status check
  if (vehicle.rows[0].availability_status === "active") {
    throw new Error("Vehicle is already active");
  }

  const result = await pool.query(
    `DELETE FROM vehicles WHERE id = $1 RETURNING *`,
    [vehicleId]
  );
  return result;
};

export const vehicleService = {
  addVehicles,
  getVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
