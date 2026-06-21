import { useQuery } from '@tanstack/react-query'
import { fetchCctvList } from '@/api/cctv'
import { queryKeys } from './queryKeys'
import type { CctvApiItem } from '@/api/cctv'

export type { CctvApiItem }

export function useCctvList() {
  return useQuery<CctvApiItem[]>({
    queryKey: queryKeys.cctv.list(),
    queryFn: fetchCctvList,
    staleTime: Infinity,   // CCTV 메타는 거의 안 바뀜
  })
}
