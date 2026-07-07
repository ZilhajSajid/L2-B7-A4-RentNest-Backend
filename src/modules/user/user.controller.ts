import { Request, Response, Router } from "express";

import httpStatus from "http-status";
import { userService } from "./user.service";

const registerUser = async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await userService.registerUserToDB(payload);
  res.status(httpStatus.CREATED).json({
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    data: result,
  });
};

export const userController = {
  registerUser,
};
