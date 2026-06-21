import { useQuery } from '@tanstack/react-query';
import { fetchAiSafetyGuide } from '@/api/aiGuide';
import { queryKeys } from './queryKeys';
import type { AiGuide } from '@/types';

const TEN_MINUTES = 600_000;

export function useAiGuide(stationLevels: Record<string, number>) {
  return useQuery<AiGuide>({
    queryKey: queryKeys.aiGuide.safety(stationLevels),
    queryFn: () => fetchAiSafetyGuide(stationLevels),
    staleTime: TEN_MINUTES,
    refetchInterval: TEN_MINUTES,
    enabled: Object.keys(stationLevels).length > 0,
    retry: 1,
  });
}
