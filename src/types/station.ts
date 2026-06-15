export type WaterStatus = 'normal' | 'caution' | 'warning' | 'critical';

export interface StationThresholds {
  normal: number;
  caution: number;
  warning: number;
  critical: number;
  designFlood: number;
}

export interface Station {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  currentLevel: number;
  status: WaterStatus;
  normalLevel: number;
  cautionLevel: number;
  warningLevel: number;
  criticalLevel: number;
  designFloodLevel: number;
  measuredAt: string;
}

export interface WaterLevelHistory {
  stationId: string;
  level: number;
  status: WaterStatus;
  measuredAt: string;
}
