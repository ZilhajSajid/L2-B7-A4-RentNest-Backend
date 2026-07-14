import { RentalRequestsStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  ICreateRentalRequestPayload,
  IUpdateRentalRequestPayload,
} from "./request.interface";

const getRequestsFromDB = async (landlordId: string) => {
  const rentalRequests = await prisma.rentalRequests.findMany({
    where: { property: { landlordId } },
    include: {
      tenant: { omit: { password: true } },
      property: { include: { category: true } },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return rentalRequests;
};

const createRentalRequestToDB = async (
  payload: ICreateRentalRequestPayload,
  userId: string,
) => {
  const result = await prisma.rentalRequests.create({
    data: { ...payload, tenantId: userId },
  });
  return result;
};

const updateRentalRequestToDB = async (
  rentalRequestId: string,
  landlordId: string,
  payload: IUpdateRentalRequestPayload,
) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const request = await tx.rentalRequests.findUniqueOrThrow({
      where: { id: rentalRequestId },
      include: { property: true },
    });
    if (request.property.landlordId !== landlordId) {
      throw new Error("You are not authorized to update this rental request");
    }
    if (request.status !== RentalRequestsStatus.PENDING) {
      throw new Error("This rental request has already been processed.");
    }

    if (payload.status === RentalRequestsStatus.APPROVED) {
      const approvedStatus = await tx.rentalRequests.findFirst({
        where: {
          propertyId: request.propertyId,
          status: RentalRequestsStatus.APPROVED,
        },
      });
      if (approvedStatus) {
        throw new Error(
          "This property has already been rented to another tenant.",
        );
      }
    }
    return await tx.rentalRequests.update({
      where: { id: rentalRequestId },
      data: { status: payload.status },
      include: {
        tenant: { omit: { password: true } },
        property: true,
        payment: true,
      },
    });
  });
  return transactionResult;
};

export const requestService = {
  getRequestsFromDB,
  createRentalRequestToDB,
  updateRentalRequestToDB,
};
