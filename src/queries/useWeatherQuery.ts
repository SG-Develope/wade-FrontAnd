import { useQuery } from '@tanstack/react-query';
import { fetchWeather } from '@/api/weather';
import { queryKeys } from './queryKeys';
import type { Weather } from '@/types';

const TEN_MINUTES = 600_000;

export function useWeather() {
  return useQuery<Weather>({
    queryKey: queryKeys.weather.current(),
    queryFn: fetchWeather,
    refetchInterval: TEN_MINUTES,
    staleTime: TEN_MINUTES,
    placeholderData: (prev) => prev,
  });
}
