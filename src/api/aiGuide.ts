import apiClient from './apiClient';
import type { AiGuide } from '@/types';

export async function fetchAiSafetyGuide(stationLevels: Record<string, number>): Promise<AiGuide> {
  const { data } = await apiClient.post('/api/ai/safety-guide', { stationLevels });
  return data;
}
