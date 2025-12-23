type Address = {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  region?: string;
  postalCode: string;
  countryCode: string;
  latitude: number;
  longitude: number;
};

type VendingMachine = {
  id: string;
  address: Address;
  spot_description?: string;
  photo_url?: string;
  model?: string;
  overall_color?: string;
  weight_kg?: number;
  height_cm?: number;
  width_cm?: number;
  depth_cm?: number;
  installation_date?: Date;
  last_maintenance_date?: Date;
  status?: "operational" | "out_of_service" | "maintenance_required";
};

export const VENDING_MACHINE_LOCATIONS: VendingMachine[] = [
  {
    id: "1",
    address: {
      addressLine1: "123 University Ave",
      city: "Indianapolis",
      region: "IN",
      postalCode: "46268",
      countryCode: "US",
      latitude: 38.9869,
      longitude: -76.9426,
    },
    spot_description: "Next to the main entrance.",
    photo_url: "https://example.com/photos/vm1.jpg",
    model: "SnackMaster 3000",
    overall_color: "Red",
    weight_kg: 150,
    height_cm: 180,
    width_cm: 80,
    depth_cm: 70,
    installation_date: new Date("2022-01-15"),
    last_maintenance_date: new Date("2024-05-10"),
    status: "operational",
  },
];
