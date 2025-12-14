import { pool } from "../../database/db";

const getAllUser = async () => {
  const result = await pool.query(`SELECT id, name, email, phone, role FROM users`);

  return result;
};

export const userService = {
  getAllUser,
};
