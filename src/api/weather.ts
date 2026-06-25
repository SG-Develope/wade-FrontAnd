import apiClient from './apiClient';

export async function fetchWeather(stationId: string) {
  const { data } = await apiClient.get(`/api/weather/current?stationId=${stationId}`);
  return data;
}

export async function fetchShortForecast(stationId: string) {
  const { data } = await apiClient.get(`/api/weather/forecast/short?stationId=${stationId}`);
  return data;
}

export async function fetchUltraShortForecast(stationId: string) {
  const { data } = await apiClient.get(`/api/weather/forecast/ultrashort?stationId=${stationId}`);
  return data;
}

export async function fetchWeatherAlerts() {
  const { data } = await apiClient.get("/api/weather/alerts");
  return data;
}

export async function fetchRadarComposite() {
  const { data } = await apiClient.get("/api/weather/radar/composite");
  return data;
}

export async function fetchSatelliteImage() {
  const { data } = await apiClient.get("/api/weather/satellite");
  return data;
}

export async function fetchTyphoonInfo() {
  const { data } = await apiClient.get("/api/weather/typhoon");
  return data;
}
