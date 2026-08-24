import { useQuery } from '@tanstack/react-query'
import { fetchCampingSites } from '@/api/camping'
import { queryKeys } from './queryKeys'
import type { CampingSite } from '@/api/camping'

export type { CampingSite }

export function useCampingSites() {
  return useQuery<CampingSite[]>({
    queryKey: queryKeys.camping.list(),
    queryFn: fetchCampingSites,
    staleTime: Infinity,
  })
}
