import {
  PaymentProvider,
  PaymentStatus,
  PropertyAvailability,
  RentalRequestsStatus,
} from "../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

const createPaymentIntoDB = async (
  tenantId: string,
  rentalRequestId: string,
) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const rentalRequest = await tx.rentalRequests.findUniqueOrThrow({
      where: { id: rentalRequestId },
      include: { property: true },
    });
    if (rentalRequest.tenantId !== tenantId) {
      throw new Error("You are not authorized to pay for this rental request.");
    }
    if (rentalRequest.status !== RentalRequestsStatus.APPROVED) {
      throw new Error("This rental request has not been approved yet.");
    }
    const existingPayment = await tx.payment.findUnique({
      where: { rentalRequestId },
    });
    if (existingPayment) {
      throw new Error(
        "Payment has already been completed for this rental request.",
      );
    }
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "bdt",
            product_data: {
              name: rentalRequest.property.title,
              description: rentalRequest.property.description,
            },
            unit_amount: Number(rentalRequest.property.rent) * 100,
          },
        },
      ],
      metadata: {
        rentalRequestId,
        tenantId,
      },
      success_url: `${config.app_url}/payment/success`,
      cancel_url: `${config.app_url}/payment/cancel`,
    });
    await tx.payment.create({
      data: {
        transactionId: session.id,
        stripeSessionId: session.id,
        amount: rentalRequest.property.rent,
        status: PaymentStatus.PENDING,
        provider: PaymentProvider.STRIPE,
        rentalRequestId,
      },
    });
    return {
      sessionId: session.id,
      checkoutUrl: session.url,
    };
  });
  return transactionResult;
};

const createConfirmPaymentIntoDB = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") {
    throw new Error("Payment has not been completed.");
  }
  const payment = await prisma.payment.findUniqueOrThrow({
    where: { stripeSessionId: sessionId },
    include: { rentalRequest: { include: { property: true } } },
  });
  if (payment.status === PaymentStatus.SUCCESS) {
    throw new Error("Payment has already been confirmed.");
  }

  const transactionResult = await prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.SUCCESS,
        paidAt: new Date(),
        stripePaymentIntentId: session.payment_intent as string,
      },
    });
    await tx.rentalRequests.update({
      where: { id: payment.rentalRequestId },
      data: { status: RentalRequestsStatus.COMPLETED },
    });
    await tx.property.update({
      where: { id: payment.rentalRequest.propertyId },
      data: { availability: PropertyAvailability.RENTED },
    });
    await tx.rentalRequests.updateMany({
      where: {
        propertyId: payment.rentalRequest.propertyId,
        id: {
          not: payment.rentalRequestId,
        },
        status: {
          in: [RentalRequestsStatus.PENDING, RentalRequestsStatus.APPROVED],
        },
      },
      data: {
        status: RentalRequestsStatus.REJECTED,
      },
    });
    return updatedPayment;
  });
  return transactionResult;
};

const getPaymentsFromDB = async (tenantId: string) => {
  const result = await prisma.payment.findMany({
    where: { rentalRequest: { tenantId } },
    include: { rentalRequest: { include: { property: true } } },
    orderBy: { createdAt: "desc" },
  });
  return result;
};
const getPaymentsByIdFromDB = async (paymentId: string, tenantId: string) => {
  const result = await prisma.payment.findUniqueOrThrow({
    where: { id: paymentId },
    include: {
      rentalRequest: {
        include: {
          property: {
            include: {
              category: true,
              landlord: {
                omit: { password: true },
              },
            },
          },
        },
      },
    },
  });
  if (result.rentalRequest.tenantId !== tenantId) {
    throw new Error("You are not authorized to access this payment.");
  }
  return result;
};

export const paymentService = {
  createPaymentIntoDB,
  createConfirmPaymentIntoDB,
  getPaymentsFromDB,
  getPaymentsByIdFromDB,
};
