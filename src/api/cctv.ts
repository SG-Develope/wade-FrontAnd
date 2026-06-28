import apiClient from './apiClient'
import axios from 'axios'

export interface CctvApiItem {
  id: string
  name: string
  location: string
  stationId: string
  stationName: string
  lat: number
  lng: number
  streamUrl: string | null
}

const ITS_API_KEY = import.meta.env.VITE_ITS_API_KEY as string

export async function fetchCctvList(): Promise<CctvApiItem[]> {
  const { data } = await apiClient.get('/api/cctv')
  const list: CctvApiItem[] = data

  if (!list.length || !ITS_API_KEY) return list

  try {
    const minX = (Math.min(...list.map(c => c.lng)) - 0.01).toFixed(6)
    const maxX = (Math.max(...list.map(c => c.lng)) + 0.01).toFixed(6)
    const minY = (Math.min(...list.map(c => c.lat)) - 0.01).toFixed(6)
    const maxY = (Math.max(...list.map(c => c.lat)) + 0.01).toFixed(6)

    const url = `https://openapi.its.go.kr:9443/cctvInfo?apiKey=${ITS_API_KEY}&type=its&cctvType=1&minX=${minX}&maxX=${maxX}&minY=${minY}&maxY=${maxY}&getType=json`
    const { data: itsData } = await axios.get(url)
    const items: any[] = itsData?.response?.data ?? []

    return list.map(cctv => {
      const match = items.find((item: any) => item.cctvname === cctv.name)
      return { ...cctv, streamUrl: match?.cctvurl ?? cctv.streamUrl }
    })
  } catch (e) {
    console.warn('ITS CCTV 전체 URL 조회 실패:', e)
    return list
  }
}

export async function fetchItsStreamUrl(cctv: Pick<CctvApiItem, 'name' | 'lat' | 'lng'>): Promise<string | null> {
  try {
    const minX = (cctv.lng - 0.01).toFixed(6)
    const maxX = (cctv.lng + 0.01).toFixed(6)
    const minY = (cctv.lat - 0.01).toFixed(6)
    const maxY = (cctv.lat + 0.01).toFixed(6)

    const url = `https://openapi.its.go.kr:9443/cctvInfo?apiKey=${ITS_API_KEY}&type=its&cctvType=1&minX=${minX}&maxX=${maxX}&minY=${minY}&maxY=${maxY}&getType=json`
    const { data } = await axios.get(url)

    const items: any[] = data?.response?.data ?? []
    const match = items.find((item: any) => item.cctvname === cctv.name)
    return match?.cctvurl ?? null
  } catch (e) {
    console.warn('ITS CCTV URL 조회 실패:', e)
    return null
  }
}
