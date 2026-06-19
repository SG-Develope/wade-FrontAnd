import apiClient from './apiClient'

export async function fetchWaterLevels() {
  const { data } = await apiClient.get('/api/water-levels/current')
  return data.stations
}

export async function fetchWaterLevelHistory(stationId: string, hours = 24) {
  const { data } = await apiClient.get(
    `/api/water-levels/history/${stationId}`,
    { params: { hours } },
  )
  return data.history
}
