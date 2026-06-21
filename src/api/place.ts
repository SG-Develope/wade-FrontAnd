import apiClient from './apiClient'

export interface PlaceApiItem {
  id: string
  name: string
  type: string
  icon: string
  lat: number
  lng: number
  stationId: string
  safeWl: number
  cautionWl: number
  amenities: string[]
}

export async function fetchPlaces(): Promise<PlaceApiItem[]> {
  const { data } = await apiClient.get('/api/places')
  return data
}
