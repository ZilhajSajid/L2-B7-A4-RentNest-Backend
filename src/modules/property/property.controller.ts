import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { propertyService } from "./property.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id as string;
    const payload = req.body;
    const result = await propertyService.createPropertiesToDB(
      payload,
      landlordId,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Property Created Successfully",
      data: result,
    });
  },
);

const getProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await propertyService.getPropertiesFromDB(req.query);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Properties Fetched Successfully",
      data: result,
    });
  },
);

const getPropertiesById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const params = req.params.id;
    if (!params) {
      throw new Error("Invalid parameter!");
    }
    const result = await propertyService.getPropertiesByIdFromDB(
      params as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Single Property fetched successfully",
      data: result,
    });
  },
);

const updatePropertiesById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.id;
    if (!propertyId) {
      throw new Error("Property Id required");
    }
    const payload = req.body;
    const landlordId = req.user?.id;
    const role = req.user?.role!;
    const result = await propertyService.updatePropertiesByIdIntoDB(
      propertyId as string,
      payload,
      landlordId as string,
      role,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property Updated Successfully",
      data: result,
    });
  },
);

const deletePropertyById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.id;
    if (!propertyId) {
      throw new Error("Property Id required");
    }
    const landlordId = req.user?.id;
    const role = req.user?.role!;

    await propertyService.deletePropertyByIdFromDB(
      propertyId as string,
      landlordId as string,
      role,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property deleted successfully",
      data: null,
    });
  },
);

export const propertyController = {
  createProperties,
  getProperties,
  getPropertiesById,
  updatePropertiesById,
  deletePropertyById,
};
