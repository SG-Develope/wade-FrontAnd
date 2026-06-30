import apiClient from './apiClient'
import axios from 'axios'

// ITS API 응답 형태
interface ItsStation {
  id: string
  name: string
  minX: number | null
  maxX: number | null
  minY: number | null
  maxY: number | null
}

export interface CctvApiItem {
  id: string          // cctvname (ITS 고유 식별자로 사용)
  name: string
  location: string
  stationId: string
  stationName: string
  lat: number
  lng: number
  streamUrl: string | null
}

const ITS_API_KEY = import.meta.env.VITE_ITS_API_KEY as string

/**
 * /api/stations에서 bounding box를 받아 ITS API를 station별로 호출,
 * 필터링 없이 모든 CCTV를 반환합니다.
 */
export async function fetchCctvList(): Promise<CctvApiItem[]> {
  if (!ITS_API_KEY) return []

  // 1. 백엔드에서 station 목록 (bounding box 포함)
  const { data: stations } = await apiClient.get<ItsStation[]>('/api/stations')

  const results: CctvApiItem[] = []

  // 2. bounding box가 있는 station마다 ITS API 호출
  console.log('[CCTV] stations:', stations)

  for (const station of stations) {
    if (
      station.minX == null || station.maxX == null ||
      station.minY == null || station.maxY == null
    ) {
      console.warn('[CCTV] bounding box 없음, skip:', station.id)
      continue
    }

    try {
      const url =
        `https://openapi.its.go.kr:9443/cctvInfo` +
        `?apiKey=${ITS_API_KEY}&type=its&cctvType=1` +
        `&minX=${station.minX}&maxX=${station.maxX}` +
        `&minY=${station.minY}&maxY=${station.maxY}` +
        `&getType=json`

      console.log('[CCTV] ITS API 호출:', url)
      const { data: itsData } = await axios.get(url)
      const raw = itsData?.response?.data ?? []
      const items: any[] = Array.isArray(raw) ? raw : [raw]

      for (const item of items) {
        results.push({
          id:          item.cctvname,
          name:        item.cctvname,
          location:    item.cctvname,
          stationId:   station.id,
          stationName: station.name,
          lat:         parseFloat(item.coordy),
          lng:         parseFloat(item.coordx),
          streamUrl:   item.cctvurl ? (item.cctvurl as string).replace('http://', 'https://') : null,
        })
      }
    } catch (e) {
      console.warn(`ITS CCTV 조회 실패 (${station.name}):`, e)
    }
  }

  return results
}

/**
 * 모달에서 호출: 해당 CCTV의 최신 스트림 URL을 ITS API에서 다시 받아옴
 */
export async function fetchItsStreamUrl(
  cctv: Pick<CctvApiItem, 'name' | 'lat' | 'lng'>,
): Promise<string | null> {
  if (!ITS_API_KEY) return null
  try {
    const minX = (cctv.lng - 0.01).toFixed(6)
    const maxX = (cctv.lng + 0.01).toFixed(6)
    const minY = (cctv.lat - 0.01).toFixed(6)
    const maxY = (cctv.lat + 0.01).toFixed(6)

    const url =
      `https://openapi.its.go.kr:9443/cctvInfo` +
      `?apiKey=${ITS_API_KEY}&type=its&cctvType=1` +
      `&minX=${minX}&maxX=${maxX}&minY=${minY}&maxY=${maxY}` +
      `&getType=json`

    const { data } = await axios.get(url)
    const raw = data?.response?.data ?? []
    const items: any[] = Array.isArray(raw) ? raw : [raw]
    const match = items.find((item: any) => item.cctvname === cctv.name)
    console.log('[Modal] match:', match)
    return match?.cctvurl ? (match.cctvurl as string).replace('http://', 'https://') : null
  } catch (e) {
    console.warn('ITS CCTV URL 재조회 실패:', e)
    return null
  }
}
