import { useQuery } from '@tanstack/react-query';
import { fetchWaterLevels, fetchWaterLevelHistory } from '@/api/waterLevel';
import { queryKeys } from './queryKeys';
import type { Station, WaterLevelHistory } from '@/types';

const TEN_MINUTES = 600_000;

export function useWaterLevels() {
  return useQuery<Station[]>({
    queryKey: queryKeys.waterLevels.current(),
    queryFn: fetchWaterLevels,
    refetchInterval: TEN_MINUTES,
    staleTime: TEN_MINUTES,
    placeholderData: (prev) => prev,
  });
}

export function useWaterLevelHistory(stationId: string, hours = 24) {
  return useQuery<WaterLevelHistory[]>({
    queryKey: queryKeys.waterLevels.history(stationId, hours),
    queryFn: () => fetchWaterLevelHistory(stationId, hours),
    refetchInterval: TEN_MINUTES,
    staleTime: TEN_MINUTES,
    enabled: !!stationId,
  });
}
