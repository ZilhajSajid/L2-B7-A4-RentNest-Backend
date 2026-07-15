import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { reviewController } from "./review.controller";

const router = Router();
router.post("/reviews", auth(UserRole.TENANT), reviewController.createReview);

export const reviewsRoutes = router;
