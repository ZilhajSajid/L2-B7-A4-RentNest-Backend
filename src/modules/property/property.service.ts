import { UserRole } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  ICreatePropertiesPayload,
  IUpdateProperty,
} from "./property.interface";

const createPropertiesToDB = async (
  payload: ICreatePropertiesPayload,
  landlordId: string,
) => {
  await prisma.category.findUniqueOrThrow({
    where: { id: payload.categoryId },
  });

  const result = await prisma.property.create({
    data: {
      ...payload,
      landlordId,
    },
  });
  return result;
};

const getPropertiesFromDB = async () => {
  const result = await prisma.property.findMany({
    include: {
      landlord: { omit: { password: true } },
    },
  });
  return result;
};

const getPropertiesByIdFromDB = async (params: string) => {
  const result = await prisma.property.findUniqueOrThrow({
    where: { id: params },
  });

  return result;
};

const updatePropertiesByIdIntoDB = async (
  propertyId: string,
  payload: IUpdateProperty,
  landlordId: string,
  role: UserRole,
) => {
  const property = await prisma.property.findUniqueOrThrow({
    where: { id: propertyId },
  });
  if (role !== UserRole.ADMIN && property.landlordId !== landlordId) {
    throw new Error("You are not authorized to update this property.");
  }
  const result = await prisma.property.update({
    where: { id: propertyId },
    data: payload,
    include: {
      landlord: {
        omit: { password: true },
      },
      // reviews: true,
    },
  });
  return result;
};
const deletePropertyByIdFromDB = async (
  propertyId: string,
  landlordId: string,
  role: UserRole,
) => {
  const property = await prisma.property.findFirstOrThrow({
    where: { id: propertyId },
  });
  if (role !== UserRole.ADMIN && property.landlordId !== landlordId) {
    throw new Error("You are not authorized to delete this property.");
  }
  await prisma.property.delete({
    where: { id: propertyId },
  });
};

export const propertyService = {
  createPropertiesToDB,
  getPropertiesFromDB,
  getPropertiesByIdFromDB,
  updatePropertiesByIdIntoDB,
  deletePropertyByIdFromDB,
};
