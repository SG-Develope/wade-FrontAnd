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
        scrollwheel: false,
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
      const pulse = station.status !== 'normal'
        ? `<div style="position:absolute;inset:0;border-radius:50%;border:2px solid ${colors.marker};animation:ping 1.4s cubic-bezier(0,0,0.2,1) infinite;opacity:0.5;"></div>
           <div style="position:absolute;inset:-6px;border-radius:50%;border:1.5px solid ${colors.marker};animation:ping 1.4s cubic-bezier(0,0,0.2,1) 0.4s infinite;opacity:0.3;"></div>`
        : ''
      const statusLabel: Record<string, string> = { normal: '정상', caution: '주의', warning: '위험', critical: '심각' }
      const content = `
        <style>@keyframes ping{0%{transform:scale(1);opacity:0.6}100%{transform:scale(2.2);opacity:0}}</style>
        <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;">
          <div style="background:#fff;border-radius:14px;padding:7px 13px;border:2px solid ${colors.marker};box-shadow:0 3px 12px ${colors.marker}40;text-align:center;position:relative;">
            <div style="font-size:12px;font-weight:800;color:#2D3A1F;letter-spacing:-0.3px;">${station.name}</div>
            <div style="font-size:13px;font-weight:800;color:${colors.marker};margin-top:1px;">${station.currentLevel?.toFixed(1) ?? '-'}m</div>
            <div style="font-size:9px;color:${colors.text};background:${colors.bg};border-radius:6px;padding:1px 6px;margin-top:3px;font-weight:700;">${statusLabel[station.status] ?? '정상'}</div>
          </div>
          <div style="position:relative;width:16px;height:20px;margin-top:-2px;">
            ${pulse}
            <div style="width:16px;height:16px;border-radius:50%;background:${colors.marker};box-shadow:0 2px 6px ${colors.marker}60;position:relative;z-index:1;"></div>
            <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:8px solid ${colors.marker};margin:0 auto;margin-top:-2px;"></div>
          </div>
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
    </div>
  )
}
