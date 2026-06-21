import { useQuery } from '@tanstack/react-query';
import { fetchWeather, fetchShortForecast, fetchUltraShortForecast, fetchWeatherAlerts, fetchRadarComposite, fetchSatelliteImage, fetchTyphoonInfo } from '@/api/weather';
import { queryKeys } from './queryKeys';
import type { Weather } from '@/types';

const TEN_MINUTES = 600_000;
const ONE_HOUR    = 3_600_000;

export interface ShortForecastItem {
  fcstDate: string
  fcstTime: string
  temperature: number
  skyCondition: string
  rainProbability: number
  precipType: string
}

export interface UltraShortForecastItem {
  fcstDate: string
  fcstTime: string
  temperature: number
  skyCondition: string
  precipType: string
  precipAmount: string
}

export interface WeatherAlertItem {
  warnVar: string
  warnLevel: string
  area: string
  title: string
  content: string
  issuedAt: string
}

export function useWeather(nx: number, ny: number) {
  return useQuery<Weather>({
    queryKey: [...queryKeys.weather.current(), nx, ny],
    queryFn: () => fetchWeather(nx, ny),
    refetchInterval: TEN_MINUTES,
    staleTime: TEN_MINUTES,
    placeholderData: (prev) => prev,
  });
}

export function useShortForecast(nx: number, ny: number) {
  return useQuery<ShortForecastItem[]>({
    queryKey: [...queryKeys.weather.shortForecast(), nx, ny],
    queryFn: () => fetchShortForecast(nx, ny),
    refetchInterval: ONE_HOUR,
    staleTime: ONE_HOUR,
    placeholderData: (prev) => prev,
  });
}

export function useUltraShortForecast() {
  return useQuery<UltraShortForecastItem[]>({
    queryKey: queryKeys.weather.ultraShortForecast(),
    queryFn: fetchUltraShortForecast,
    refetchInterval: TEN_MINUTES,
    staleTime: TEN_MINUTES,
    placeholderData: (prev) => prev,
  });
}

export function useWeatherAlerts() {
  return useQuery<WeatherAlertItem[]>({
    queryKey: queryKeys.weather.alerts(),
    queryFn: fetchWeatherAlerts,
    refetchInterval: ONE_HOUR,
    staleTime: ONE_HOUR,
    placeholderData: (prev) => prev,
  });
}

export interface RadarImageData {
  imageUrl: string | null
  measuredAt: string
}

export interface SatelliteImageData {
  imageUrl: string | null
  measuredAt: string
}

export interface TyphoonData {
  active: boolean
  imageUrl?: string
  name?: string
  nameEn?: string
  location?: string
  maxWindSpeed?: number
  pressure?: number
  direction?: string
  moveSpeed?: number
  measuredAt?: string
}

export function useRadarComposite() {
  return useQuery<RadarImageData>({
    queryKey: [...queryKeys.weather.all, 'radar'],
    queryFn: fetchRadarComposite,
    refetchInterval: 5 * 60_000,
    staleTime: 5 * 60_000,
    placeholderData: (prev) => prev,
  });
}

export function useSatelliteImage() {
  return useQuery<SatelliteImageData>({
    queryKey: [...queryKeys.weather.all, 'satellite'],
    queryFn: fetchSatelliteImage,
    refetchInterval: 10 * 60_000,
    staleTime: 10 * 60_000,
    placeholderData: (prev) => prev,
  });
}

export function useTyphoonInfo() {
  return useQuery<TyphoonData>({
    queryKey: [...queryKeys.weather.all, 'typhoon'],
    queryFn: fetchTyphoonInfo,
    refetchInterval: 30 * 60_000,
    staleTime: 30 * 60_000,
    placeholderData: (prev) => prev,
  });
}
