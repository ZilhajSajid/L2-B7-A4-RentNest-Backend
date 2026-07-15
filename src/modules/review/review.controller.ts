import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { reviewService } from "./review.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const tenantId = req.user?.id;
    const result = await reviewService.createReviewTpDB(
      payload,
      tenantId as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Review submitted successfully",
      data: result,
    });
  },
);

export const reviewController = {
  createReview,
};
