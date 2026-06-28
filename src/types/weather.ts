export interface Weather {
  temperature: number;
  rainProbability: number;
  skyCondition: string;
  precipitationType: number;
  windSpeed: number;
  windDirection: string;
  humidity: number;
  fcstDate: string;
  fcstTime: string;
  measuredAt: string;
  message?: string; // 값이 있으면 오류 메시지 (예: 429 한도 초과)
}
