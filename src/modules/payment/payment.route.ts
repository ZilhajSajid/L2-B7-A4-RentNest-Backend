import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/payments/create",
  auth(UserRole.TENANT),
  paymentController.createPayment,
);

router.post(
  "/payments/confirm",
  auth(UserRole.TENANT),
  paymentController.createConfirmPayment,
);

router.get("/payments", auth(UserRole.TENANT), paymentController.getPayments);
router.get("/payments/:id", auth(UserRole.TENANT), paymentController.getPaymentsById);
export const paymentRoutes = router;
