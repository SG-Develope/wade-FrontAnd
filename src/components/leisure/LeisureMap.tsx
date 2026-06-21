import { useEffect, useRef } from 'react'
import { STATUS_COLORS, STATIONS } from '@/constants/stations'
import type { PlaceApiItem } from '@/api/place'
import type { Station, WaterStatus } from '@/types'

function getPlaceStatus(place: PlaceApiItem, level: number): WaterStatus {
  if (level > place.cautionWl) return 'warning'
  if (level > place.safeWl)    return 'caution'
  return 'normal'
}

interface Props {
  places: PlaceApiItem[]
  stations: Station[]
  onPlaceSelect: (id: string) => void
}

export default function LeisureMap({ places, stations, onPlaceSelect }: Props) {
  const mapRef      = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markersRef  = useRef<any[]>([])

  const getLevel = (stationId: string): number | null => {
    const s = stations.find(s => s.id === stationId)
    return s?.currentLevel ?? null
  }

  const renderMarkers = () => {
    if (!mapInstance.current || !window.kakao?.maps) return
    markersRef.current.forEach(m => m.setMap(null))
    markersRef.current = []

    places.forEach(place => {
      const level  = getLevel(place.stationId)
      const status = level != null ? getPlaceStatus(place, level) : 'normal'
      const colors = STATUS_COLORS[status as WaterStatus] ?? STATUS_COLORS.normal
      const statusLabel = status === 'normal' ? '이용가능' : status === 'caution' ? '주의' : '이용금지'

      const content = `
        <div style="background:#fff;border-radius:10px;padding:7px 10px;border:1.5px solid ${colors.marker};box-shadow:0 2px 8px rgba(0,0,0,0.12);cursor:pointer;min-width:80px;text-align:center;">
          <div style="font-size:16px;margin-bottom:2px;">${place.icon}</div>
          <div style="font-size:11px;font-weight:700;color:#2D3A1F;">${place.name.length > 8 ? place.name.substring(0,7) + '…' : place.name}</div>
          <div style="font-size:10px;color:${colors.text};font-weight:600;">${statusLabel}</div>
        </div>
      `
      const overlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(place.lat, place.lng),
        content, map: mapInstance.current, yAnchor: 1.1,
      })
      setTimeout(() => {
        const el = overlay.getContent() as HTMLElement
        if (typeof el !== 'string') el.addEventListener('click', () => onPlaceSelect(place.id))
      }, 100)
      markersRef.current.push(overlay)
    })

    Object.values(STATIONS).forEach(station => {
      const stationData = stations.find(s => s.id === station.id)
      const level = stationData?.currentLevel ?? station.thresholds.normal
      const content = `
        <div style="background:rgba(29,158,117,0.9);color:#fff;border-radius:8px;padding:4px 8px;font-size:10px;font-weight:700;white-space:nowrap;">
          📍 ${station.name} ${level.toFixed(1)}m
        </div>
      `
      new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(station.lat, station.lng),
        content, map: mapInstance.current, yAnchor: 1.2,
      })
    })
  }

  useEffect(() => {
    if (!mapRef.current) return
    const init = () => {
      if (!window.kakao?.maps) return
      const center = new window.kakao.maps.LatLng(36.065, 128.38)
      mapInstance.current = new window.kakao.maps.Map(mapRef.current, { center, level: 9, scrollwheel: false })
      renderMarkers()
    }
    if (window.kakao?.maps) {
      init()
    } else {
      const t = setInterval(() => { if (window.kakao?.maps) { clearInterval(t); init() } }, 300)
      return () => clearInterval(t)
    }
  }, [])

  useEffect(() => { if (mapInstance.current) renderMarkers() }, [stations, places])

  return (
    <div className="h-[280px] shrink-0 relative">
      <div ref={mapRef} className="w-full h-full bg-[#D6EBC8]" />
      {/* 추후 개발 오버레이 */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-2"
        style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(2px)' }}
      >
        <i className="ti ti-map-2 text-moss" style={{ fontSize: 28 }} />
        <span className="text-[13px] font-bold text-soil">여가 지도</span>
        <span className="text-[11px] text-moss">추후 개발 예정 기능입니다</span>
        <span className="text-[10px] text-moss opacity-60">장소별 실시간 수위 연동 지도 서비스</span>
      </div>
    </div>
  )
}
