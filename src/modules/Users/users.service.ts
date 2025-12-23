import { pool } from "../../database/db";

const getAllUser = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users`
  );

  return result;
};

// const updateUser = async (
//   payload: Record<string, any>,
//   userId: number,
//   tokenRole: string
// ) => {
//   if (Object.keys(payload).length === 0) {
//     throw new Error("No data update");
//   }
//   const { name, email, phone, role } = payload;
//   if (tokenRole !== "admin" && role) {
//     throw new Error("Unauthorized: Only admin can change role");
//   }

//   if (tokenRole === "admin") {
//     return await pool.query(
//       `UPDATE users SET name = $1 , email = $2 , phone = $3 , role = $4 WHERE id = $5 RETURNING id name , email , phone , role `,
//       [name, email, phone, role, userId]
//     );
//   } else {
//     return await pool.query(
//       `UPDATE users SET name = $1 , email = $2 , phone = $3 WHERE id = $4 RETURNING id, name , email, phone , role `,
//       [name, email, phone, userId]
//     );
//   }
// };

const updateUser = async (
  payload: Record<string, any>,
  userId: number,
  tokenRole: string
) => {
  if (Object.keys(payload).length === 0) {
    throw new Error("No data to update");
  }

  // role permission check
  if (payload.role && tokenRole !== "admin") {
    throw new Error("Unauthorized: Only admin can change role");
  }

  const allowedFields =
    tokenRole === "admin"
      ? ["name", "email", "phone", "role"]
      : ["name", "email", "phone"];

  const fields: string[] = [];
  const values: any[] = [];
  let index = 1;

  for (const key of allowedFields) {
    if (payload[key] !== undefined) {
      fields.push(`${key} = $${index}`);
      values.push(payload[key]);
      index++;
    }
  }

  if (fields.length === 0) {
    throw new Error("No valid fields to update");
  }

  values.push(userId);

  const query = `
    UPDATE users
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING id, name, email, phone, role
  `;

  return await pool.query(query, values);
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
