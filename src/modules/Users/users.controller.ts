import { Request, Response } from "express";
import { userService } from "./users.service";

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

export const userController = {
  getAllUser,
};
