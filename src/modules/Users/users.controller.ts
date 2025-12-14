import { Request, Response } from "express";
import { userService } from "./users.service";
import { JwtPayload } from "jsonwebtoken";

const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUser();
    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const loggedInUser = req.user as JwtPayload & { id: number; role: string };

    if (!loggedInUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (loggedInUser.role !== "admin" && req.body.role) {
      return res
        .status(403)
        .json({ success: false, message: "Only admin can change role" });
    }

    const result = await userService.updateUser(
      req.body,
      userId,
      loggedInUser.role
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const userController = {
  getAllUser,
  updateUser,
};
