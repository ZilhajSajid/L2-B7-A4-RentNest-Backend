import { Router } from "express";
import { requestController } from "./request.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();
router.get(
  "/landlord/requests",
  auth(UserRole.LANDLORD),
  requestController.getRequests,
);
router.post(
  "/rentals",
  auth(UserRole.TENANT),
  requestController.createRentalRequest,
);

router.patch(
  "/landlord/requests/:id",
  auth(UserRole.LANDLORD),
  requestController.updateRentalRequest,
);
export const requestRoutes = router;
