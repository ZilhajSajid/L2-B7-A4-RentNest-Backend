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

router.get("/rentals", auth(UserRole.TENANT), requestController.getRentals);
router.get("/rentals/:id", auth(UserRole.TENANT), requestController.getRentalsById);
export const requestRoutes = router;
