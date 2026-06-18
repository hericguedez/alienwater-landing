export interface Machine {
  id: string;
  name: string;
  city: string;
  location: string;
  status: 'online' | 'maintenance' | 'offline';
  waterLevel: number; // percentage
  filterLife: number; // percentage
  tdsLevel: number; // ppm (purity)
  litersToday: number;
  totalEarnings: number;
}

export interface IoTEvent {
  id: string;
  timestamp: string;
  machineName: string;
  type: 'sale' | 'system' | 'warning' | 'error';
  message: string;
}

export interface CityData {
  name: string;
  id: string;
  coordinates: { x: number; y: number }; // Percentage coordinate on SVG map
  machinesCount: number;
  litersToday: number;
  activeStatus: string;
  statusColor: string;
  revenueToday: number;
}
