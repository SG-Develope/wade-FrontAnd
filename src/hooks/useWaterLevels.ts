import { useQuery } from '@tanstack/react-query';
import { fetchWaterLevels, fetchWaterLevelHistory, fetchWeather, fetchAiSafetyGuide } from '../api/waterLevel';

// 10분 폴링 (PRD 4.7)
const TEN_MINUTES = 600_000;

export function useWaterLevels() {
  return useQuery({
    queryKey: ['waterLevels'],
    queryFn: fetchWaterLevels,
    refetchInterval: TEN_MINUTES,
    staleTime: TEN_MINUTES,
    // 실패 시 마지막 성공 데이터 유지
    placeholderData: (prev) => prev,
  });
}

export function useWaterLevelHistory(stationId, hours = 24) {
  return useQuery({
    queryKey: ['waterLevelHistory', stationId, hours],
    queryFn: () => fetchWaterLevelHistory(stationId, hours),
    refetchInterval: TEN_MINUTES,
    staleTime: TEN_MINUTES,
    enabled: !!stationId,
  });
}

export function useWeather() {
  return useQuery({
    queryKey: ['weather'],
    queryFn: fetchWeather,
    refetchInterval: TEN_MINUTES,
    staleTime: TEN_MINUTES,
    placeholderData: (prev) => prev,
  });
}

export function useAiSafetyGuide(stationLevels) {
  return useQuery({
    queryKey: ['aiSafetyGuide', stationLevels],
    queryFn: () => fetchAiSafetyGuide(stationLevels),
    staleTime: TEN_MINUTES,
    enabled: !!stationLevels && Object.keys(stationLevels).length > 0,
    retry: 1,
  });
}
