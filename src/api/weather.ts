import apiClient from './apiClient';

export async function fetchWeather() {
  const { data } = await apiClient.get("/api/weather/current");
  return data;
}
