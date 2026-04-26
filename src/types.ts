export interface TripRecord {
  id: string;
  date: string;
  vehicleNumber: string;
  plant: "Plant 1" | "Plant 2";
  poNumber: string;
  siteName: string;
  location: string;
  purpose: string;
  customPurpose?: string;
  trips: number;
  amountPerTrip: number;
  totalAmount: number;
}

export type Plant = "Plant 1" | "Plant 2";

export interface PlantSummary {
  plant: Plant;
  totalTrips: number;
  totalAmount: number;
  entryCount: number;
  records: TripRecord[];
}
