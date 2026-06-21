import axios from 'axios'
import apiClient from './apiClient'
import type { Station, WaterLevelHistory, WaterStatus } from '@/types'

const HRFCO_KEY = import.meta.env.VITE_HRFCO_API_KEY || '03CD66AD-B30E-4E4F-A72D-9922B257ECCC'
const HRFCO_BASE = 'https://api.hrfco.go.kr'

interface StationMeta {
  id: string
  wlobscd: string
  name: string
  location: string
  attwl: number
  wrnwl: number
  almwl: number
  srswl: number
  pfh: number
}

function calcStatus(level: number, meta: StationMeta): WaterStatus {
  if (level >= meta.srswl) return 'critical'
  if (level >= meta.almwl) return 'warning'
  if (level >= meta.wrnwl) return 'caution'
  return 'normal'
}

// 관측소 좌표 (DB에 없어서 별도 관리)
const STATION_COORDS: Record<string, { lat: number; lng: number }> = {
  yangpo: { lat: 36.1195, lng: 128.3444 },
  hoguk:  { lat: 36.0191, lng: 128.4012 },
}

export async function fetchWaterLevels(): Promise<Station[]> {
  // 1. 백엔드에서 메타데이터(임계값) 가져오기
  const { data: metaList } = await apiClient.get<StationMeta[]>('/api/water-levels/meta')

  // 2. HRFCO에서 각 관측소 현재 수위 직접 호출
  const stations = await Promise.all(
    metaList.map(async (meta) => {
      let level = -1
      try {
        const url = `${HRFCO_BASE}/${HRFCO_KEY}/waterlevel/list/10M/${meta.wlobscd}.json`
        const { data } = await axios.get(url)
        const wl = data?.content?.[0]?.wl?.trim()
        if (wl && wl !== 'null') level = parseFloat(wl)
      } catch {
        // 수위 못 받아도 메타데이터는 표시
      }
      const coords = STATION_COORDS[meta.id] ?? { lat: 0, lng: 0 }
      return {
        id: meta.id,
        name: meta.name,
        location: meta.location,
        lat: coords.lat,
        lng: coords.lng,
        currentLevel: Math.max(level, 0),
        status: level < 0 ? 'normal' as WaterStatus : calcStatus(level, meta),
        normalLevel: meta.attwl,
        cautionLevel: meta.wrnwl,
        warningLevel: meta.almwl,
        criticalLevel: meta.srswl,
        designFloodLevel: meta.pfh,
        measuredAt: new Date().toISOString(),
      } satisfies Station
    })
  )
  return stations
}

export async function fetchWaterLevelHistory(stationId: string, hours = 24): Promise<WaterLevelHistory[]> {
  // 메타데이터에서 wlobscd 가져오기
  const { data: metaList } = await apiClient.get<StationMeta[]>('/api/water-levels/meta')
  const meta = metaList.find(m => m.id === stationId)
  if (!meta) return []

  const now = new Date()
  const start = new Date(now.getTime() - hours * 60 * 60 * 1000)

  const pad = (n: number) => String(n).padStart(2, '0')
  const fmt = (d: Date, tenMin = false) => {
    const min = tenMin ? pad(Math.floor(d.getMinutes() / 10) * 10) : '00'
    return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}${pad(d.getHours())}${min}`
  }

  const interval = hours <= 6 ? '10M' : '1H'
  const url = `${HRFCO_BASE}/${HRFCO_KEY}/waterlevel/list/${interval}/${meta.wlobscd}/${fmt(start, hours <= 6)}/${fmt(now, hours <= 6)}.json`

  try {
    const { data } = await axios.get(url)
    const content: any[] = data?.content ?? []

    return content
      .filter(item => item?.wl && item.wl.trim() !== 'null')
      .map(item => {
        const level = parseFloat(item.wl)
        const ymdhm: string = item.ymdhm ?? ''
        let measuredAt = ''
        if (ymdhm.length === 12) {
          measuredAt = `${ymdhm.slice(0,4)}-${ymdhm.slice(4,6)}-${ymdhm.slice(6,8)}T${ymdhm.slice(8,10)}:${ymdhm.slice(10,12)}:00`
        } else if (ymdhm.length === 10) {
          measuredAt = `${ymdhm.slice(0,4)}-${ymdhm.slice(4,6)}-${ymdhm.slice(6,8)}T${ymdhm.slice(8,10)}:00:00`
        }
        return { stationId, level, status: calcStatus(level, meta), measuredAt } satisfies WaterLevelHistory
      })
      .reverse()
  } catch {
    return []
  }
}
