import { useEffect, useRef } from 'react'
import type { CampingSite } from '@/api/camping'

interface Props {
  sites: CampingSite[]
  selectedId: number | null
  onSelect: (id: number) => void
}

const COLOR        = '#1D9E75' // river
const COLOR_ACTIVE = '#E24B4A' // danger (선택 강조)

/** 임시 캠핑 마커 — 대시보드 CCTV 마커와 동일한 스타일(원형 뱃지 + 텐트 SVG + 라벨 + 꼬리) */
function markerEl(site: CampingSite, active: boolean, onClick: () => void): HTMLElement {
  const color = active ? COLOR_ACTIVE : COLOR
  const el = document.createElement('div')
  el.style.cssText = 'display:flex;flex-direction:column;align-items:center;cursor:pointer;user-select:none;'
  el.innerHTML = `
    <div style="background:#fff;border:1.5px solid ${color};border-radius:8px;padding:3px 7px;font-size:10px;font-weight:700;color:#2D3A1F;white-space:nowrap;max-width:120px;overflow:hidden;text-overflow:ellipsis;box-shadow:0 2px 6px rgba(0,0,0,0.18);margin-bottom:3px;text-align:center;">${site.facilityName}</div>
    <div style="width:30px;height:30px;border-radius:50%;background:${color};border:2px solid #fff;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 20l8-16 8 16H4z"/><path d="M8.5 20l3.5-7 3.5 7"/><line x1="12" y1="15" x2="12" y2="20"/>
      </svg>
    </div>
    <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid ${color};margin-top:-1px;"></div>
  `
  el.addEventListener('click', onClick)
  return el
}

export default function CampingMap({ sites, selectedId, onSelect }: Props) {
  const mapRef      = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const overlaysRef = useRef<any[]>([])

  const renderMarkers = () => {
    if (!mapInstance.current || !window.kakao?.maps) return
    overlaysRef.current.forEach(o => o.setMap(null))
    overlaysRef.current = []

    sites.forEach(site => {
      if (site.latitude == null || site.longitude == null) return
      const active  = site.id === selectedId
      const overlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(site.latitude, site.longitude),
        content:  markerEl(site, active, () => onSelect(site.id)),
        map:      mapInstance.current,
        yAnchor:  1.0,
        zIndex:   active ? 10 : 3,
      })
      overlaysRef.current.push(overlay)
    })
  }

  // 최초 1회 초기화
  useEffect(() => {
    if (!mapRef.current) return
    const init = () => {
      if (!window.kakao?.maps || mapInstance.current) return
      const center = new window.kakao.maps.LatLng(36.09, 128.42) // 구미·칠곡 권역
      mapInstance.current = new window.kakao.maps.Map(mapRef.current, {
        center, level: 9, scrollwheel: true,
      })
      renderMarkers()
      const observer = new ResizeObserver(() => mapInstance.current?.relayout())
      observer.observe(mapRef.current!)
      return () => observer.disconnect()
    }
    if (window.kakao?.maps) {
      init()
    } else {
      const t = setInterval(() => { if (window.kakao?.maps) { clearInterval(t); init() } }, 300)
      return () => clearInterval(t)
    }
  }, [])

  // 데이터/선택 변경 시 마커 갱신
  useEffect(() => { if (mapInstance.current) renderMarkers() }, [sites, selectedId])

  // 선택된 캠핑장으로 지도 이동
  useEffect(() => {
    if (!mapInstance.current || selectedId == null || !window.kakao?.maps) return
    const site = sites.find(s => s.id === selectedId)
    if (site?.latitude != null && site?.longitude != null) {
      mapInstance.current.panTo(new window.kakao.maps.LatLng(site.latitude, site.longitude))
    }
  }, [selectedId])

  return (
    <div ref={mapRef} className="w-full h-full bg-[#D6EBC8]">
      {!window.kakao?.maps && (
        <div className="w-full h-full flex items-center justify-center text-[13px] text-[#4A6A3A] font-semibold">
          카카오맵 로딩 중...
        </div>
      )}
    </div>
  )
}
