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

const deleteUser = async (userId: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [
    userId,
  ]);
  if (result.rows.length === 0) {
    const error = new Error("This user does not exist");
    throw error;
  }

  const bookingResult = await pool.query(
    `SELECT * FROM bookings WHERE customer_id = $1`,
    [userId]
  );

  if (bookingResult.rows.length > 0) {
    const hasActiveBooking = bookingResult.rows.some(
      (booking) => booking.status === "active"
    );
    if (hasActiveBooking) {
      const error = new Error(
        "This user cannot be deleted because this user has an active booking"
      );
      throw error;

    }
    
     await pool.query(
      `DELETE FROM users WHERE id = $1 `,
      [userId]
    );

  }
};

export const userService = {
  getAllUser,
  updateUser,
  deleteUser,
};
