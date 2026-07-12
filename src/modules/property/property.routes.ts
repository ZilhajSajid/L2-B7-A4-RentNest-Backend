import { Router } from "express";
import { propertyController } from "./property.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/properties",
  auth(UserRole.LANDLORD),
  propertyController.createProperties,
);
router.get("/", propertyController.getProperties);
router.get("/:id", propertyController.getPropertiesById);

export const propertyRoutes = router;
