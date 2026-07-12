import { prisma } from "../../lib/prisma";
import { ICreateCategoryPayload } from "./category.interface";

const createCategoryToDB = async (payload: ICreateCategoryPayload) => {
  const result = await prisma.category.create({
    data: {
      ...payload,
    },
  });
  return result;
};

const getCategoriesFromDB = async () => {
  const result = await prisma.category.findMany();
  return result;
};
export const categoryService = {
  createCategoryToDB,
  getCategoriesFromDB,
};
