import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import config from "../../config";
import { RegisterUserPayload } from "./user.interface";
const registerUserToDB = async (payload: RegisterUserPayload) => {
  const { name, email, password, phone, role } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  const hashPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
      phone,
      role,
    },
    omit: { password: true },
  });
  return user;
};

export const userService = {
  registerUserToDB,
};
