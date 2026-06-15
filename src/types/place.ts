import type { WaterStatus } from './station';

export type PlaceType = 'camping' | 'fishing' | 'cycling' | 'walking';

export interface PlaceThresholds {
  safe: number;
  caution: number;
}

export interface Place {
  id: string;
  name: string;
  type: PlaceType;
  icon: string;
  stationId: string;
  lat: number;
  lng: number;
  thresholds: PlaceThresholds;
  amenities: string[];
  description?: string;
  status?: WaterStatus;
}
