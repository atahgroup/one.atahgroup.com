type Address = {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  region?: string;
  postalCode: string;
  countryCode: string;
};

export function formatAddress(address: Address): string {
  let formatted = address.addressLine1;
  if (address.addressLine2) {
    formatted += ", " + address.addressLine2;
  }
  formatted += ", " + address.city;
  if (address.region) {
    formatted += ", " + address.region;
  }
  formatted += ", " + address.postalCode + ", " + address.countryCode;
  return formatted;
}

export type VendingMachine = {
  id: string;
  address: Address;
  spot_description?: string;
  latitude: number;
  longitude: number;
  photo_url?: string;
  model?: string;
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
    },
    latitude: 38.9869,
    longitude: -76.9426,
    spot_description: "Next to the main entrance.",
    photo_url:
      "https://fastly.picsum.photos/id/444/200/200.jpg?hmac=j2rJG0CKjM3Pmd7gDrCI5-1pYZIh4tjiScLDa5xS_KU",
    model: "SnackMaster 3000",
    weight_kg: 150,
    height_cm: 180,
    width_cm: 80,
    depth_cm: 70,
    installation_date: new Date("2022-01-15"),
    last_maintenance_date: new Date("2024-05-10"),
    status: "operational",
  },
  {
    id: "2",
    address: {
      addressLine1: "456 Market St",
      city: "San Francisco",
      region: "CA",
      postalCode: "94102",
      countryCode: "US",
    },
    latitude: 37.7749,
    longitude: -122.4194,
    spot_description: "Inside the shopping mall corridor.",
    photo_url:
      "https://fastly.picsum.photos/id/444/200/200.jpg?hmac=j2rJG0CKjM3Pmd7gDrCI5-1pYZIh4tjiScLDa5xS_KU",
    model: "VendPro Plus",
    weight_kg: 165,
    height_cm: 185,
    width_cm: 85,
    depth_cm: 75,
    installation_date: new Date("2021-06-20"),
    last_maintenance_date: new Date("2024-11-15"),
    status: "operational",
  },
  {
    id: "3",
    address: {
      addressLine1: "789 Broadway",
      city: "New York",
      region: "NY",
      postalCode: "10003",
      countryCode: "US",
    },
    latitude: 40.7308,
    longitude: -73.9872,
    spot_description: "Theater lobby area.",
    photo_url:
      "https://fastly.picsum.photos/id/444/200/200.jpg?hmac=j2rJG0CKjM3Pmd7gDrCI5-1pYZIh4tjiScLDa5xS_KU",
    model: "SnackMaster 3000",
    weight_kg: 155,
    height_cm: 180,
    width_cm: 80,
    depth_cm: 70,
    installation_date: new Date("2023-02-10"),
    last_maintenance_date: new Date("2024-09-22"),
    status: "operational",
  },
  {
    id: "4",
    address: {
      addressLine1: "321 Michigan Ave",
      city: "Chicago",
      region: "IL",
      postalCode: "60611",
      countryCode: "US",
    },
    latitude: 41.8781,
    longitude: -87.6298,
    spot_description: "Office building lobby.",
    photo_url:
      "https://fastly.picsum.photos/id/444/200/200.jpg?hmac=j2rJG0CKjM3Pmd7gDrCI5-1pYZIh4tjiScLDa5xS_KU",
    model: "VendPro Elite",
    weight_kg: 160,
    height_cm: 182,
    width_cm: 82,
    depth_cm: 72,
    installation_date: new Date("2020-08-05"),
    last_maintenance_date: new Date("2024-10-18"),
    status: "operational",
  },
  {
    id: "5",
    address: {
      addressLine1: "654 Peachtree St",
      city: "Atlanta",
      region: "GA",
      postalCode: "30308",
      countryCode: "US",
    },
    latitude: 33.749,
    longitude: -84.388,
    spot_description: "Near the reception desk.",
    photo_url:
      "https://fastly.picsum.photos/id/444/200/200.jpg?hmac=j2rJG0CKjM3Pmd7gDrCI5-1pYZIh4tjiScLDa5xS_KU",
    model: "SnackMaster 2000",
    weight_kg: 145,
    height_cm: 178,
    width_cm: 78,
    depth_cm: 68,
    installation_date: new Date("2022-03-12"),
    last_maintenance_date: new Date("2024-08-30"),
    status: "maintenance_required",
  },
  {
    id: "6",
    address: {
      addressLine1: "987 Pine Rd",
      city: "Seattle",
      region: "WA",
      postalCode: "98101",
      countryCode: "US",
    },
    latitude: 47.6062,
    longitude: -122.3321,
    spot_description: "Coffee shop entrance.",
    photo_url:
      "https://fastly.picsum.photos/id/444/200/200.jpg?hmac=j2rJG0CKjM3Pmd7gDrCI5-1pYZIh4tjiScLDa5xS_KU",
    model: "VendPro Plus",
    weight_kg: 158,
    height_cm: 181,
    width_cm: 81,
    depth_cm: 71,
    installation_date: new Date("2021-11-08"),
    last_maintenance_date: new Date("2024-12-01"),
    status: "operational",
  },
  {
    id: "7",
    address: {
      addressLine1: "222 5th Ave",
      city: "Denver",
      region: "CO",
      postalCode: "80202",
      countryCode: "US",
    },
    latitude: 39.7392,
    longitude: -104.9903,
    spot_description: "Underground parking level 2.",
    photo_url:
      "https://fastly.picsum.photos/id/444/200/200.jpg?hmac=j2rJG0CKjM3Pmd7gDrCI5-1pYZIh4tjiScLDa5xS_KU",
    model: "SnackMaster 3000",
    weight_kg: 152,
    height_cm: 179,
    width_cm: 79,
    depth_cm: 69,
    installation_date: new Date("2023-05-19"),
    last_maintenance_date: new Date("2024-11-05"),
    status: "operational",
  },
  {
    id: "8",
    address: {
      addressLine1: "333 Austin Blvd",
      city: "Austin",
      region: "TX",
      postalCode: "78701",
      countryCode: "US",
    },
    latitude: 30.2672,
    longitude: -97.7431,
    spot_description: "Tech campus break room.",
    photo_url:
      "https://fastly.picsum.photos/id/444/200/200.jpg?hmac=j2rJG0CKjM3Pmd7gDrCI5-1pYZIh4tjiScLDa5xS_KU",
    model: "VendPro Elite",
    weight_kg: 162,
    height_cm: 183,
    width_cm: 83,
    depth_cm: 73,
    installation_date: new Date("2022-07-22"),
    last_maintenance_date: new Date("2024-10-12"),
    status: "operational",
  },
  {
    id: "9",
    address: {
      addressLine1: "444 Spring St",
      city: "Boston",
      region: "MA",
      postalCode: "02108",
      countryCode: "US",
    },
    latitude: 42.3601,
    longitude: -71.0589,
    spot_description: "Downtown street level.",
    photo_url:
      "https://fastly.picsum.photos/id/444/200/200.jpg?hmac=j2rJG0CKjM3Pmd7gDrCI5-1pYZIh4tjiScLDa5xS_KU",
    model: "SnackMaster 2000",
    weight_kg: 148,
    height_cm: 177,
    width_cm: 77,
    depth_cm: 67,
    installation_date: new Date("2021-09-14"),
    last_maintenance_date: new Date("2024-09-08"),
    status: "operational",
  },
  {
    id: "10",
    address: {
      addressLine1: "555 Ocean Blvd",
      city: "Miami",
      region: "FL",
      postalCode: "33101",
      countryCode: "US",
    },
    latitude: 25.7617,
    longitude: -80.1918,
    spot_description: "Beachfront promenade.",
    photo_url:
      "https://fastly.picsum.photos/id/444/200/200.jpg?hmac=j2rJG0CKjM3Pmd7gDrCI5-1pYZIh4tjiScLDa5xS_KU",
    model: "VendPro Plus",
    weight_kg: 159,
    height_cm: 182,
    width_cm: 81,
    depth_cm: 71,
    installation_date: new Date("2023-01-28"),
    last_maintenance_date: new Date("2024-11-20"),
    status: "operational",
  },
  {
    id: "11",
    address: {
      addressLine1: "666 Harbor Way",
      city: "Portland",
      region: "OR",
      postalCode: "97201",
      countryCode: "US",
    },
    latitude: 45.5152,
    longitude: -122.6784,
    spot_description: "Waterfront district.",
    photo_url:
      "https://fastly.picsum.photos/id/444/200/200.jpg?hmac=j2rJG0CKjM3Pmd7gDrCI5-1pYZIh4tjiScLDa5xS_KU",
    model: "SnackMaster 3000",
    weight_kg: 151,
    height_cm: 179,
    width_cm: 79,
    depth_cm: 69,
    installation_date: new Date("2020-10-06"),
    last_maintenance_date: new Date("2024-12-10"),
    status: "operational",
  },
  {
    id: "12",
    address: {
      addressLine1: "777 Commerce St",
      city: "Dallas",
      region: "TX",
      postalCode: "75202",
      countryCode: "US",
    },
    latitude: 32.7767,
    longitude: -96.797,
    spot_description: "Corporate headquarters lobby.",
    photo_url:
      "https://fastly.picsum.photos/id/444/200/200.jpg?hmac=j2rJG0CKjM3Pmd7gDrCI5-1pYZIh4tjiScLDa5xS_KU",
    model: "VendPro Elite",
    weight_kg: 164,
    height_cm: 184,
    width_cm: 84,
    depth_cm: 74,
    installation_date: new Date("2022-04-17"),
    last_maintenance_date: new Date("2024-08-25"),
    status: "out_of_service",
  },
  {
    id: "13",
    address: {
      addressLine1: "888 Valley Dr",
      city: "Phoenix",
      region: "AZ",
      postalCode: "85001",
      countryCode: "US",
    },
    latitude: 33.4484,
    longitude: -112.0742,
    spot_description: "Shopping center entrance.",
    photo_url:
      "https://fastly.picsum.photos/id/444/200/200.jpg?hmac=j2rJG0CKjM3Pmd7gDrCI5-1pYZIh4tjiScLDa5xS_KU",
    model: "SnackMaster 2000",
    weight_kg: 146,
    height_cm: 176,
    width_cm: 76,
    depth_cm: 66,
    installation_date: new Date("2023-09-03"),
    last_maintenance_date: new Date("2024-07-14"),
    status: "operational",
  },
  {
    id: "14",
    address: {
      addressLine1: "999 Riverside Ave",
      city: "San Diego",
      region: "CA",
      postalCode: "92101",
      countryCode: "US",
    },
    latitude: 32.7157,
    longitude: -117.1611,
    spot_description: "Museum lobby.",
    photo_url:
      "https://fastly.picsum.photos/id/444/200/200.jpg?hmac=j2rJG0CKjM3Pmd7gDrCI5-1pYZIh4tjiScLDa5xS_KU",
    model: "VendPro Plus",
    weight_kg: 157,
    height_cm: 181,
    width_cm: 80,
    depth_cm: 70,
    installation_date: new Date("2021-12-15"),
    last_maintenance_date: new Date("2024-10-29"),
    status: "operational",
  },
  {
    id: "15",
    address: {
      addressLine1: "1111 Main St",
      city: "Houston",
      region: "TX",
      postalCode: "77002",
      countryCode: "US",
    },
    latitude: 29.7604,
    longitude: -95.3698,
    spot_description: "Hospital cafeteria hallway.",
    photo_url:
      "https://fastly.picsum.photos/id/444/200/200.jpg?hmac=j2rJG0CKjM3Pmd7gDrCI5-1pYZIh4tjiScLDa5xS_KU",
    model: "SnackMaster 3000",
    weight_kg: 154,
    height_cm: 180,
    width_cm: 80,
    depth_cm: 70,
    installation_date: new Date("2022-02-26"),
    last_maintenance_date: new Date("2024-11-11"),
    status: "operational",
  },
  {
    id: "16",
    address: {
      addressLine1: "2222 Park Ave",
      city: "Philadelphia",
      region: "PA",
      postalCode: "19103",
      countryCode: "US",
    },
    latitude: 39.9526,
    longitude: -75.1652,
    spot_description: "University dormitory common area.",
    photo_url:
      "https://fastly.picsum.photos/id/444/200/200.jpg?hmac=j2rJG0CKjM3Pmd7gDrCI5-1pYZIh4tjiScLDa5xS_KU",
    model: "VendPro Elite",
    weight_kg: 161,
    height_cm: 182,
    width_cm: 82,
    depth_cm: 72,
    installation_date: new Date("2020-05-09"),
    last_maintenance_date: new Date("2024-09-16"),
    status: "operational",
  },
  {
    id: "17",
    address: {
      addressLine1: "3333 Central Blvd",
      city: "Las Vegas",
      region: "NV",
      postalCode: "89101",
      countryCode: "US",
    },
    latitude: 36.1699,
    longitude: -115.1398,
    spot_description: "Casino floor entrance.",
    photo_url:
      "https://fastly.picsum.photos/id/444/200/200.jpg?hmac=j2rJG0CKjM3Pmd7gDrCI5-1pYZIh4tjiScLDa5xS_KU",
    model: "SnackMaster 2000",
    weight_kg: 149,
    height_cm: 178,
    width_cm: 78,
    depth_cm: 68,
    installation_date: new Date("2023-04-07"),
    last_maintenance_date: new Date("2024-10-03"),
    status: "operational",
  },
  {
    id: "18",
    address: {
      addressLine1: "4444 Sunset Blvd",
      city: "Los Angeles",
      region: "CA",
      postalCode: "90028",
      countryCode: "US",
    },
    latitude: 34.0995,
    longitude: -118.3287,
    spot_description: "Entertainment venue hallway.",
    photo_url:
      "https://fastly.picsum.photos/id/444/200/200.jpg?hmac=j2rJG0CKjM3Pmd7gDrCI5-1pYZIh4tjiScLDa5xS_KU",
    model: "VendPro Plus",
    weight_kg: 156,
    height_cm: 181,
    width_cm: 81,
    depth_cm: 71,
    installation_date: new Date("2021-08-20"),
    last_maintenance_date: new Date("2024-12-05"),
    status: "maintenance_required",
  },
  {
    id: "19",
    address: {
      addressLine1: "5555 Trade St",
      city: "Charlotte",
      region: "NC",
      postalCode: "28202",
      countryCode: "US",
    },
    latitude: 35.2271,
    longitude: -80.8431,
    spot_description: "Financial district building.",
    photo_url:
      "https://fastly.picsum.photos/id/444/200/200.jpg?hmac=j2rJG0CKjM3Pmd7gDrCI5-1pYZIh4tjiScLDa5xS_KU",
    model: "SnackMaster 3000",
    weight_kg: 153,
    height_cm: 179,
    width_cm: 79,
    depth_cm: 69,
    installation_date: new Date("2022-06-11"),
    last_maintenance_date: new Date("2024-11-22"),
    status: "operational",
  },
  {
    id: "20",
    address: {
      addressLine1: "6666 Tech Drive",
      city: "San Jose",
      region: "CA",
      postalCode: "95110",
      countryCode: "US",
    },
    latitude: 37.3382,
    longitude: -121.8863,
    spot_description: "Technology park building 5.",
    photo_url:
      "https://fastly.picsum.photos/id/444/200/200.jpg?hmac=j2rJG0CKjM3Pmd7gDrCI5-1pYZIh4tjiScLDa5xS_KU",
    model: "VendPro Elite",
    weight_kg: 163,
    height_cm: 183,
    width_cm: 83,
    depth_cm: 73,
    installation_date: new Date("2023-03-30"),
    last_maintenance_date: new Date("2024-09-29"),
    status: "operational",
  },
  {
    id: "21",
    address: {
      addressLine1: "7777 Broadway",
      city: "Nashville",
      region: "TN",
      postalCode: "37201",
      countryCode: "US",
    },
    latitude: 36.1627,
    longitude: -86.7816,
    spot_description: "Music venue entrance.",
    photo_url:
      "https://fastly.picsum.photos/id/444/200/200.jpg?hmac=j2rJG0CKjM3Pmd7gDrCI5-1pYZIh4tjiScLDa5xS_KU",
    model: "SnackMaster 2000",
    weight_kg: 147,
    height_cm: 177,
    width_cm: 77,
    depth_cm: 67,
    installation_date: new Date("2020-11-18"),
    last_maintenance_date: new Date("2024-08-14"),
    status: "operational",
  },
];
