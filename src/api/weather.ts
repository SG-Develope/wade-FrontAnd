import apiClient from './apiClient';

export async function fetchWeather(nx: number, ny: number) {
  const { data } = await apiClient.get(`/api/weather/current?nx=${nx}&ny=${ny}`);
  return data;
}

export async function fetchShortForecast(nx: number, ny: number) {
  const { data } = await apiClient.get(`/api/weather/forecast/short?nx=${nx}&ny=${ny}`);
  return data;
}

export async function fetchUltraShortForecast() {
  const { data } = await apiClient.get("/api/weather/forecast/ultrashort");
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
