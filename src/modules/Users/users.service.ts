import { pool } from "../../database/db";

const getAllUser = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users`
  );

  return result;
};

const updateUser = async (
  payload: Record<string, any>,
  userId: number,
  tokenRole: string
) => {
  if (Object.keys(payload).length === 0) {
    throw new Error("No data update");
  }
  const { name, email, phone, role } = payload;
  if (tokenRole !== "admin" && role) {
    throw new Error("Unauthorized: Only admin can change role");
  }

  if (tokenRole === "admin") {
    return await pool.query(
      `UPDATE users SET name = $1 , email = $2 , phone = $3 , role = $4 WHERE id = $5 RETURNING id name , email , phone , role `,
      [name, email, phone, role, userId]
    );
  } else {
    return await pool.query(
      `UPDATE users SET name = $1 , email = $2 , phone = $3 WHERE id = $4 RETURNING id, name , email, phone , role `,
      [name, email, phone, userId]
    );
  }
};

export const userService = {
  getAllUser,
  updateUser,
};
