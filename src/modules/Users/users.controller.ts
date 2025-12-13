// import { Request, Response } from "express";
// import { userService } from "./users.service";

// const createUser = async (req: Request, res: Response) => {
     
//   try {
//     const payload = req.body
//     const result = await userService.createUserIntodb(payload);
//     return res.status(200).json({
//         success : true,
//       message: "User Created Successfully!!",
//       data : result.rows[0]
//     });
//   } catch (error : any) {
//     return res.status(500).json({
//       success : false,
//       message: error.message
//     });
//   }
// };

// export const userController = {
//   createUser,
// };
