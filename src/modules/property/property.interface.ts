export interface ICreatePropertiesPayload {
  title: string;
  rent: number;
  location: string;
  images?: string[];
  description: string;
  bedrooms: number;
  amenities: string[];
  categoryId: string;
}
