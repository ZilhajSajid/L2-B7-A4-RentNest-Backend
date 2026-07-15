import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
const createPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id;
    const { rentalRequestId } = req.body;
    const result = await paymentService.createPaymentIntoDB(
      tenantId as string,
      rentalRequestId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Checkout session created successfully.",
      data: result,
    });
  },
);

const createConfirmPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { sessionId } = req.body;
    const result = await paymentService.createConfirmPaymentIntoDB(sessionId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment confirmed successfully.",
      data: result,
    });
  },
);
const getPayments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id;
    const result = await paymentService.getPaymentsFromDB(tenantId as string);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payments retrieved successfully.",
      data: result,
    });
  },
);

const getPaymentsById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const paymentId = req.params.id;
    const tenantId = req.user?.id;
    const result = await paymentService.getPaymentsByIdFromDB(
      paymentId as string,
      tenantId as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment details retrieved successfully.",
      data: result,
    });
  },
);

export const paymentController = {
  createPayment,
  createConfirmPayment,
  getPayments,
  getPaymentsById,
};
