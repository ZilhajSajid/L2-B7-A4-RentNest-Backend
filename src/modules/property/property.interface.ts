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
export interface IUpdateProperty {
  title?: string;
  rent?: number;
  location?: string;
  images?: string[];
  description?: string;
  bedrooms?: number;
  amenities?: string[];
  categoryId?: string;
}
