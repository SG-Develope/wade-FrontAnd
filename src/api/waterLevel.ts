import apiClient from './apiClient';

export async function fetchWaterLevels() {
  const { data } = await apiClient.get("/api/water-levels/current");
  return data;
}

export async function fetchWaterLevelHistory(stationId : Number, hours = 24) {
  const { data } = await apiClient.get(
    `/api/water-levels/history/${stationId}`,
    {
      params: { hours },
    },
  );
  return data;
}
