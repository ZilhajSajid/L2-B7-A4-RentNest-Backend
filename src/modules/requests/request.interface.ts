import { RentalRequestsStatus } from "../../../generated/prisma/enums";

export interface ICreateRentalRequestPayload {
  propertyId: string;
  message: string;
  moveInDate: Date;
}

export interface IUpdateRentalRequestPayload {
  status: RentalRequestsStatus;
}
