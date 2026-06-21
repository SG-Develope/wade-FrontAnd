import apiClient from './apiClient'

export interface CctvApiItem {
  id: string
  name: string
  location: string
  stationId: string
  streamUrl: string | null
}

export async function fetchCctvList(): Promise<CctvApiItem[]> {
  const { data } = await apiClient.get('/api/cctv')
  return data
}
