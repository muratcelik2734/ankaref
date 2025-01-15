export interface Widget {
  id: number;
  name: string;
  temperature: number;
  humidity: number;
  batteryLevel: number;
  lastUpdate: Date;
  coordinates: [number, number];
  isHighlighted?: boolean;
} 