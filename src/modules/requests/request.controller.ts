import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { requestService } from "./request.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
const getRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id;
    const result = await requestService.getRequestsFromDB(landlordId as string);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental requests retrieved Successfully",
      data: result,
    });
  },
);
const createRentalRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const id = req.user?.id;
    const result = await requestService.createRentalRequestToDB(
      payload,
      id as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Your rental request has been submitted successfully.",
      data: result,
    });
  },
);

const updateRentalRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rentalRequestId = req.params.id;
    const landlordId = req.user?.id;
    const payload = req.body;
    const result = await requestService.updateRentalRequestToDB(
      rentalRequestId as string,
      landlordId as string,
      payload,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental request status updated successfully.",
      data: result,
    });
  },
);
export const requestController = {
  getRequests,
  createRentalRequest,
  updateRentalRequest,
};
