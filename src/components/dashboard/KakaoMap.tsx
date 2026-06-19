import { useEffect, useRef } from 'react'
import { STATIONS, STATUS_COLORS } from '@/constants/stations'
import type { Station } from '@/types'
import useAppStore from '@/stores/appStore'

declare global {
  interface Window { kakao: any }
}

interface Props {
  stations: Station[]
}

export default function KakaoMap({ stations }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const { setSelectedStation } = useAppStore()

  useEffect(() => {
    if (!mapRef.current) return
    const initMap = () => {
      if (!window.kakao?.maps) return
      const center = new window.kakao.maps.LatLng(36.065, 128.38)
      mapInstance.current = new window.kakao.maps.Map(mapRef.current, {
        center,
        level: 9,
        scrollwheel: false,  // 마우스 휠 줌 비활성화
        disableDoubleClickZoom: false,
      })
      renderMarkers()
    }
    if (window.kakao?.maps) {
      initMap()
    } else {
      const interval = setInterval(() => {
        if (window.kakao?.maps) { clearInterval(interval); initMap() }
      }, 300)
      return () => clearInterval(interval)
    }
  }, [])

  const renderMarkers = () => {
    if (!mapInstance.current || !window.kakao?.maps) return
    markersRef.current.forEach(m => m.setMap(null))
    markersRef.current = []

    const stationsToRender = stations.length > 0
      ? stations
      : Object.values(STATIONS).map(s => ({
          id: s.id, name: s.name, lat: s.lat, lng: s.lng,
          currentLevel: s.thresholds.normal, status: 'normal' as const,
          location: s.location, normalLevel: s.thresholds.normal,
          cautionLevel: s.thresholds.caution, warningLevel: s.thresholds.warning,
          criticalLevel: s.thresholds.critical, designFloodLevel: s.thresholds.designFlood,
          measuredAt: '',
        }))

    stationsToRender.forEach(station => {
      const colors = STATUS_COLORS[station.status as keyof typeof STATUS_COLORS] ?? STATUS_COLORS.normal
      const stationMeta = STATIONS[station.id.toUpperCase() as keyof typeof STATIONS]
      const content = `
        <div style="background:#fff;border-radius:12px;padding:8px 12px;border:1.5px solid ${colors.marker};box-shadow:0 2px 8px rgba(0,0,0,0.12);cursor:pointer;min-width:90px;text-align:center;">
          <div style="width:8px;height:8px;border-radius:50%;background:${colors.marker};margin:0 auto 4px;"></div>
          <div style="font-size:12px;font-weight:700;color:#2D3A1F;">${station.name}</div>
          <div style="font-size:11px;color:${colors.marker};font-weight:600;">${station.currentLevel?.toFixed(1) ?? '-'}m</div>
        </div>
      `
      const overlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(stationMeta?.lat ?? 36.065, stationMeta?.lng ?? 128.38),
        content, map: mapInstance.current, yAnchor: 1.1,
      })
      setTimeout(() => {
        const el = overlay.getContent() as HTMLElement
        if (typeof el !== 'string') el.addEventListener('click', () => setSelectedStation(station))
      }, 100)
      markersRef.current.push(overlay)
    })
  }

  useEffect(() => { if (mapInstance.current) renderMarkers() }, [stations])

  return (
    <div ref={mapRef} className="w-full h-full bg-[#D6EBC8]">
      {!window.kakao?.maps && (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#D6EBC8] to-[#C4DFB0]">
          <div className="text-[13px] text-[#4A6A3A] font-semibold">카카오맵 로딩 중...</div>
        </div>
      )}
 