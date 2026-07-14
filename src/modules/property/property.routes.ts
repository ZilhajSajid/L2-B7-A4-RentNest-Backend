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
router.get("/properties", propertyController.getProperties);
router.get("/properties/:id", propertyController.getPropertiesById);
router.put(
  "/properties/:id",
  auth(UserRole.ADMIN, UserRole.LANDLORD),
  propertyController.updatePropertiesById,
);
router.delete(
  "/properties/:id",
  auth(UserRole.ADMIN, UserRole.LANDLORD),
  propertyController.deletePropertyById,
);

export const propertyRoutes = router;
