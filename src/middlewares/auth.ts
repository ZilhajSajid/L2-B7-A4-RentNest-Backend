import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";
declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        name: string;
        id: string;
        role: UserRole;
      };
    }
  }
}
export const auth = (...requiredRoles: UserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization?.split(" ")[1]
        : null;

    if (!token) {
      throw new Error(
        "You are not logged in. Please login to access this resource",
      );
    }
    const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);
    if (!verifiedToken.success) {
      throw new Error(verifiedToken.error);
    }
    const { id, name, email, role } = verifiedToken.data as JwtPayload;
    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new Error(
        "Forbidden. You don't have permissions to access this resource",
      );
    }
    const user = await prisma.user.findUnique({
      where: { id, email, name, role },
    });
    if (!user) {
      throw new Error("User not found");
    }
    if (user.status === "BLOCKED") {
      throw new Error("Your Account has been blocked.Please contact support");
    }
    req.user = {
      id,
      name,
      email,
      role,
    };
    next();
  });
};
