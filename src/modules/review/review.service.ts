import { RentalRequestsStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreateReviewPayload } from "./review.interface";

const createReviewTpDB = async (
  payload: ICreateReviewPayload,
  tenantId: string,
) => {
  await prisma.property.findUniqueOrThrow({
    where: { id: payload.propertyId },
  });
  const rentalRequest = await prisma.rentalRequests.findFirst({
    where: {
      tenantId,
      propertyId: payload.propertyId,
      status: RentalRequestsStatus.COMPLETED,
    },
  });
  if (!rentalRequest) {
    throw new Error(
      "You can only review a property after completing the rental.",
    );
  }
  const existingReview = await prisma.reviews.findFirst({
    where: { tenantId, propertyId: payload.propertyId },
  });
  if (existingReview) {
    throw new Error("You have already reviewed this property.");
  }
  const result = await prisma.reviews.create({
    data: {
      rating: payload.rating,
      comment: payload.comment,
      propertyId: payload.propertyId,
      tenantId,
    },
    include: {
      tenant: {
        omit: {
          password: true,
        },
      },
      property: true,
    },
  });

  return result;
};

export const reviewService = {
  createReviewTpDB,
};
