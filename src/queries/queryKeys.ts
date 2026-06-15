export const queryKeys = {
  waterLevels: {
    all: ['waterLevels'] as const,
    current: () => [...queryKeys.waterLevels.all, 'current'] as const,
    history: (stationId: string, hours?: number) =>
      [...queryKeys.waterLevels.all, 'history', stationId, hours] as const,
  },
  weather: {
    all: ['weather'] as const,
    current: () => [...queryKeys.weather.all, 'current'] as const,
  },
  aiGuide: {
    all: ['aiGuide'] as const,
    safety: (stationLevels: Record<string, number>) =>
      [...queryKeys.aiGuide.all, 'safety', stationLevels] as const,
  },
};
