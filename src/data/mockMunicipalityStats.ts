export interface MunicipalityKPIs {
  totalBeds: number;
  occupancyRate: number; // Percentage
  patientsOnWaitingList: number;
  averageWaitingTime: string; // e.g., "15 days"
}

export interface HistoricalDataPoint {
  date: string; // e.g., "2023-01-01"
  value: number;
}

export interface OrganizationStats {
  id: string;
  name: string;
  totalBeds: number;
  occupancyRate: number;
  patientsOnWaitingList: number;
  // Potentially more details like address, contact, specific services
}

export const mockMunicipalityKPIs: MunicipalityKPIs = {
  totalBeds: 450,
  occupancyRate: 88,
  patientsOnWaitingList: 73, // This could also be derived from waitingList.json length
  averageWaitingTime: "22 days",
};

export const mockHistoricalWaitingTimeSeries: HistoricalDataPoint[] = [
  { date: "2024-11-01", value: 18 },
  { date: "2024-12-01", value: 20 },
  { date: "2025-01-01", value: 25 },
  { date: "2025-02-01", value: 23 },
  { date: "2025-03-01", value: 20 },
  { date: "2025-04-01", value: 22 },
  { date: "2025-05-01", value: 22 },
];

export const mockHistoricalOccupancySeries: HistoricalDataPoint[] = [
  { date: "2024-11-01", value: 85 },
  { date: "2024-12-01", value: 87 },
  { date: "2025-01-01", value: 90 },
  { date: "2025-02-01", value: 89 },
  { date: "2025-03-01", value: 86 },
  { date: "2025-04-01", value: 88 },
  { date: "2025-05-01", value: 88 },
];

export const mockOrganizations: OrganizationStats[] = [
  {
    id: "org1",
    name: "Solbakken Nursing Home",
    totalBeds: 120,
    occupancyRate: 92,
    patientsOnWaitingList: 15,
  },
  {
    id: "org2",
    name: "Åse Living and Activity Center",
    totalBeds: 80,
    occupancyRate: 85,
    patientsOnWaitingList: 10,
  },
  {
    id: "org3",
    name: "Haugåstunet Nursing Home",
    totalBeds: 150,
    occupancyRate: 80,
    patientsOnWaitingList: 25,
  },
  {
    id: "org4",
    name: "Riska Living and Care Center",
    totalBeds: 100,
    occupancyRate: 95,
    patientsOnWaitingList: 5,
  },
];
