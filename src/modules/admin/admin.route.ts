import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { adminController } from "./admin.controller";

const router = Router();

router.get("/admin/users", auth(UserRole.ADMIN), adminController.getUsers);

router.patch(
  "/admin/users/:id",
  auth(UserRole.ADMIN),
  adminController.updateUsers,
);

router.get(
  "/admin/properties",
  auth(UserRole.ADMIN),
  adminController.getProperties,
);

router.get("/admin/rentals", auth(UserRole.ADMIN), adminController.getRentals);
export const adminRoutes = router;
