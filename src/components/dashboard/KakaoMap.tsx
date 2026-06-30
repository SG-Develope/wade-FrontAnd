import { useEffect, useRef } from 'react'
import { STATIONS } from '@/constants/stations'
import type { Station } from '@/types'
import type { CctvInfo } from './CctvCard'
import useAppStore from '@/stores/appStore'

declare global {
  interface Window { kakao: any }
}

interface Props {
  stations: Station[]
  cctvList?: CctvInfo[]
  onCctvClick?: (cctv: CctvInfo) => void
}

const STATUS_MARKER: Record<string, string> = {
  normal:   '/markers/m_icon002_4.png',
  caution:  '/markers/m_icon002_6.png',
  warning:  '/markers/m_icon002_1.png',
  critical: '/markers/m_icon002_2.png',
}
const DEFAULT_MARKER = '/markers/m_icon002_3.png'

const STATUS_LABEL: Record<string, string> = {
  normal: '정상', caution: '주의', warning: '경계', critical: '심각',
}

const STATUS_COLOR: Record<string, string> = {
  normal: '#1D9E75', caution: '#EF9F27', warning: '#E24B4A', critical: '#7A1F1F',
}

export default function KakaoMap({ stations, cctvList = [], onCctvClick }: Props) {
  const mapRef         = useRef<HTMLDivElement>(null)
  const mapInstance    = useRef<any>(null)
  const overlaysRef    = useRef<any[]>([])
  const cctvOverlaysRef = useRef<any[]>([])
  const { setSelectedStation } = useAppStore()

  useEffect(() => {
    if (!mapRef.current) return
    const initMap = () => {
      if (!window.kakao?.maps) return
      if (mapInstance.current) return  // 이미 초기화됨 (StrictMode 이중 실행 방지)
      const center = new window.kakao.maps.LatLng(36.065, 128.38)
      mapInstance.current = new window.kakao.maps.Map(mapRef.current, {
        center, level: 9, scrollwheel: true, disableDoubleClickZoom: false,
      })
      renderMarkers()

      const observer = new ResizeObserver(() => {
        mapInstance.current?.relayout()
      })
      observer.observe(mapRef.current!)
      return () => observer.disconnect()
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
    overlaysRef.current.forEach(o => o.setMap(null))
    overlaysRef.current = []

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
      const markerSrc = STATUS_MARKER[station.status] ?? DEFAULT_MARKER
      const color     = STATUS_COLOR[station.status] ?? STATUS_COLOR.normal
      const label     = STATUS_LABEL[station.status] ?? '정상'
      const stationMeta = STATIONS[station.id.toUpperCase() as keyof typeof STATIONS]
      const lat = stationMeta?.lat ?? 36.065
      const lng = stationMeta?.lng ?? 128.38

      const content = `
        <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;user-select:none;">
          <div style="
            background:#fff;
            border-radius:12px;
            padding:6px 12px;
            border:1.5px solid ${color};
            box-shadow:0 2px 10px rgba(0,0,0,0.15);
            text-align:center;
            margin-bottom:4px;
            white-space:nowrap;
          ">
            <div style="font-size:12px;font-weight:800;color:#2D3A1F;letter-spacing:-0.3px;">${station.name}</div>
            <div style="font-size:13px;font-weight:800;color:${color};margin-top:1px;">${station.currentLevel?.toFixed(1) ?? '-'}m</div>
            <div style="font-size:9px;color:${color};font-weight:700;margin-top:2px;">${label}</div>
          </div>
          <img src="${markerSrc}" style="width:36px;height:44px;display:block;" />
        </div>
      `

      const overlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(lat, lng),
        content,
        map: mapInstance.current,
        yAnchor: 1.0,
      })

      setTimeout(() => {
        const el = overlay.getContent() as HTMLElement
        if (typeof el !== 'string') {
          el.addEventListener('click', () => setSelectedStation(station))
        }
      }, 100)

      overlaysRef.current.push(overlay)
    })
  }

  const renderCctvMarkers = () => {
    if (!mapInstance.current || !window.kakao?.maps) return
    cctvOverlaysRef.current.forEach(o => o.setMap(null))
    cctvOverlaysRef.current = []

    cctvList.forEach(cctv => {
      if (!cctv.lat || !cctv.lng) return

      const el = document.createElement('div')
      el.style.cssText = 'display:flex;flex-direction:column;align-items:center;cursor:pointer;user-select:none;'
      el.innerHTML = `
        <div style="background:#1a2e1a;border-radius:8px;padding:3px 7px;font-size:9px;color:#fff;font-weight:700;white-space:nowrap;max-width:90px;overflow:hidden;text-overflow:ellipsis;box-shadow:0 2px 6px rgba(0,0,0,0.25);margin-bottom:3px;text-align:center;">${cctv.name}</div>
        <div style="width:26px;height:26px;border-radius:50%;background:#1a2e1a;border:2px solid #4CAF78;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4CAF78" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
          </svg>
        </div>
        <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid #1a2e1a;margin-top:-1px;"></div>
      `

      if (onCctvClick) {
        el.addEventListener('click', () => onCctvClick(cctv))
      }

      const overlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(cctv.lat, cctv.lng),
        content: el,
        map: mapInstance.current,
        yAnchor: 1.0,
        zIndex: 5,
      })

      cctvOverlaysRef.current.push(overlay)
    })
  }

  useEffect(() => { if (mapInstance.current) renderMarkers() }, [stations])
  useEffect(() => { if (mapInstance.current) renderCctvMarkers() }, [cctvList])

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
