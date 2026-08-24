import apiClient from './apiClient'

/** trail 테이블 — 백엔드 Trail 과 1:1 대응 (두루누비 산책로 코스) */
export interface Trail {
  courseId: string
  routeId: string
  name: string
  distanceKm: number | null
  durationMin: number | null
  difficulty: number | null      // 1=쉬움, 2=보통, 3=어려움
  cycleType: string | null       // 순환형/비순환형
  description: string | null
  summary: string | null
  tourPoint: string | null
  travelerInfo: string | null
  region: string | null          // 행정구역 (예: 부산 중구)
  sido: string | null            // 시/도 (지역 필터용)
  travelType: string | null      // DNWW = 걷기
  createdAt: string | null
  updatedAt: string | null
}

/** GPX 파싱 좌표 — [위도, 경도] 쌍의 배열 */
export type TrailPath = [number, number][]

export async function fetchTrails(): Promise<Trail[]> {
  const { data } = await apiClient.get<Trail[]>('/api/trails')
  return data
}

/** 코스 GPX 경로 좌표 (백엔드 프록시 + 파싱 + 캐시) */
export async function fetchTrailPath(courseId: string): Promise<TrailPath> {
  const { data } = await apiClient.get<TrailPath>(`/api/trails/${encodeURIComponent(courseId)}/path`)
  return data
}
