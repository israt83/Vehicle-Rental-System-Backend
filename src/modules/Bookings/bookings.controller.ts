import { Request, Response } from "express";
import { bookingService } from "./bookings.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const bookingData = await bookingService.createBooking(req.body);

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: bookingData,
    });
  } catch (error: any) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const { id, role } = req.user!;
    const result = await bookingService.getAllBookings(role, id);

    const message =
      role === "admin"
        ? "Bookings retrieved successfully"
        : "Your bookings retrieved successfully";

    if (result.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No bookings found",
        data: result,
      });
    }

    return res.status(200).json({
      success: true,
      message: message,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const bookingController = {
  createBooking,
  getAllBookings,
};
