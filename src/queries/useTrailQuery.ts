import { useQuery, useQueries } from '@tanstack/react-query'
import { fetchTrails, fetchTrailPath } from '@/api/trail'
import { queryKeys } from './queryKeys'
import type { Trail, TrailPath } from '@/api/trail'

export type { Trail, TrailPath }

/** 산책로 코스 목록 (전국) */
export function useTrails() {
  return useQuery<Trail[]>({
    queryKey: queryKeys.trails.list(),
    queryFn: fetchTrails,
    staleTime: Infinity,
  })
}

/**
 * 여러 코스의 GPX 경로를 병렬로 로드.
 * 선택 지역의 코스들만 넘기면 그만큼만 요청한다(캐시됨).
 * 반환: courseId → TrailPath 맵 + 로딩 상태
 */
export function useTrailPaths(courseIds: string[]) {
  const results = useQueries({
    queries: courseIds.map(id => ({
      queryKey: queryKeys.trails.path(id),
      queryFn: () => fetchTrailPath(id),
      staleTime: Infinity,
    })),
  })

  const paths: Record<string, TrailPath> = {}
  courseIds.forEach((id, i) => {
    const d = results[i]?.data
    if (d && d.length > 0) paths[id] = d
  })

  return {
    paths,
    isLoading: results.some(r => r.isLoading),
    loadedCount: Object.keys(paths).length,
  }
}

/** 단일 코스 경로 */
export function useTrailPath(courseId: string | null) {
  return useQuery<TrailPath>({
    queryKey: queryKeys.trails.path(courseId ?? ''),
    queryFn: () => fetchTrailPath(courseId as string),
    enabled: !!courseId,
    staleTime: Infinity,
  })
}
