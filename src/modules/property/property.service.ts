import { prisma } from "../../lib/prisma";
import { ICreatePropertiesPayload } from "./property.interface";

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

export const propertyService = {
  createPropertiesToDB,
  getPropertiesFromDB,
  getPropertiesByIdFromDB,
};
