import { useQuery } from '@tanstack/react-query'
import { fetchPlaces } from '@/api/place'
import { queryKeys } from './queryKeys'
import type { PlaceApiItem } from '@/api/place'

export type { PlaceApiItem }

export function usePlaces() {
  return useQuery<PlaceApiItem[]>({
    queryKey: queryKeys.places.list(),
    queryFn: fetchPlaces,
    staleTime: Infinity,
  })
}
