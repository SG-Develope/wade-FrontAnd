import { useQuery } from '@tanstack/react-query'
import { fetchCctvList } from '@/api/cctv'
import { queryKeys } from './queryKeys'
import type { CctvApiItem } from '@/api/cctv'

export type { CctvApiItem }

export function useCctvList() {
  return useQuery<CctvApiItem[]>({
    queryKey: queryKeys.cctv.list(),
    queryFn: fetchCctvList,
    staleTime: 25 * 60 * 1000,
    refetchInterval: 30 * 60 * 1000,  // 30분마다 URL 갱신
  })
}
