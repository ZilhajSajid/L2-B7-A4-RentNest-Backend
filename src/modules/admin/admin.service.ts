import { UserRole } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IUpdateUserStatusPayload } from "./admin.interface";

const getUsersFromDB = async () => {
  const result = await prisma.user.findMany({
    omit: { password: true },
    orderBy: { createdAt: "desc" },
  });
  return result;
};

const updateUsersIntoDB = async (
  userId: string,
  payload: IUpdateUserStatusPayload,
) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
  });
  if (user.status === payload.status) {
    throw new Error(`User is already ${payload.status.toLowerCase()}`);
  }
  if (user.role === UserRole.ADMIN) {
    throw new Error("You cannot change your own account status");
  }
  const result = await prisma.user.update({
    where: { id: userId },
    data: { status: payload.status },
    omit: { password: true },
  });
  return result;
};

const getPropertiesFromDB = async () => {
  const result = await prisma.property.findMany({
    include: {
      landlord: { omit: { password: true } },
      category: true,
      reviews: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return result;
};

const getRentalsFromDB = async () => {
  const result = await prisma.rentalRequests.findMany({
    include: {
      tenant: { omit: { password: true } },
      property: {
        include: { category: true, landlord: { omit: { password: true } } },
      },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return result;
};

export const adminService = {
  getUsersFromDB,
  updateUsersIntoDB,
  getPropertiesFromDB,
  getRentalsFromDB,
};
