import { useEffect, useRef } from 'react'
import type { Trail, TrailPath } from '@/api/trail'

interface Props {
  trails: Trail[]                       // 선택 지역으로 필터된 코스
  paths: Record<string, TrailPath>      // courseId → GPX 좌표
  selectedId: string | null
  onSelect: (courseId: string) => void
}

/** 난이도별 색상 (1=쉬움, 2=보통, 3=어려움) */
const DIFF_COLOR: Record<number, string> = {
  1: '#2FA36B', // green
  2: '#2B8AC6', // blue
  3: '#E08A2B', // orange
}
const COLOR_ACTIVE = '#E24B4A' // 선택 강조(빨강)
const COLOR_DEFAULT = '#4A6A3A'

function colorOf(t: Trail) {
  return (t.difficulty && DIFF_COLOR[t.difficulty]) || COLOR_DEFAULT
}

/** 코스 시작점 산책 아이콘 마커 (원형 뱃지 + 걷기 SVG). 선택 시 이름 라벨 표시 */
function markerEl(trail: Trail, active: boolean, onClick: () => void): HTMLElement {
  const color = active ? COLOR_ACTIVE : colorOf(trail)
  const el = document.createElement('div')
  el.style.cssText = 'display:flex;flex-direction:column;align-items:center;cursor:pointer;user-select:none;'
  const label = active
    ? `<div style="background:#fff;border:1.5px solid ${color};border-radius:8px;padding:3px 7px;font-size:10px;font-weight:700;color:#2D3A1F;white-space:nowrap;max-width:150px;overflow:hidden;text-overflow:ellipsis;box-shadow:0 2px 6px rgba(0,0,0,0.18);margin-bottom:3px;text-align:center;">${trail.name}</div>`
    : ''
  el.innerHTML = `
    ${label}
    <div style="width:26px;height:26px;border-radius:50%;background:${color};border:2px solid #fff;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="13" cy="4" r="1"/><path d="M7 21l3-4l2 1l2-4"/><path d="M11.5 11.5l1.5-4.5l3 3l2 0"/><path d="M7 12l1-4"/>
      </svg>
    </div>
  `
  el.addEventListener('click', onClick)
  return el
}

export default function TrailMap({ trails, paths, selectedId, onSelect }: Props) {
  const mapRef       = useRef<HTMLDivElement>(null)
  const mapInstance  = useRef<any>(null)
  const overlaysRef  = useRef<any[]>([])
  const polylinesRef = useRef<any[]>([])

  const clearOverlays = () => {
    overlaysRef.current.forEach(o => o.setMap(null))
    polylinesRef.current.forEach(p => p.setMap(null))
    overlaysRef.current = []
    polylinesRef.current = []
  }

  const render = (fit: boolean) => {
    const kakao = window.kakao
    if (!mapInstance.current || !kakao?.maps) return
    clearOverlays()

    const hasSelection = selectedId != null
    const bounds = new kakao.maps.LatLngBounds()
    let hasPoint = false

    trails.forEach(trail => {
      const pts = paths[trail.courseId]
      if (!pts || pts.length === 0) return
      const active = trail.courseId === selectedId

      // 폴리라인
      const path = pts.map(([lat, lng]) => new kakao.maps.LatLng(lat, lng))
      const polyline = new kakao.maps.Polyline({
        path,
        strokeWeight: active ? 6 : 4,
        strokeColor:  active ? COLOR_ACTIVE : colorOf(trail),
        strokeOpacity: active ? 0.95 : (hasSelection ? 0.35 : 0.7),
        strokeStyle: 'solid',
      })
      polyline.setMap(mapInstance.current)
      kakao.maps.event.addListener(polyline, 'click', () => onSelect(trail.courseId))
      polylinesRef.current.push(polyline)

      // 시작점 산책 아이콘 마커
      const [sLat, sLng] = pts[0]
      const overlay = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(sLat, sLng),
        content:  markerEl(trail, active, () => onSelect(trail.courseId)),
        map:      mapInstance.current,
        yAnchor:  1.0,
        zIndex:   active ? 20 : 5,
      })
      overlaysRef.current.push(overlay)

      // bounds 대상: 선택이 있으면 선택 코스만, 없으면 전체
      if (!hasSelection || active) {
        pts.forEach(([lat, lng]) => bounds.extend(new kakao.maps.LatLng(lat, lng)))
        hasPoint = true
      }
    })

    if (fit && hasPoint) {
      mapInstance.current.setBounds(bounds, 40, 40, 40, 40)
    }
  }

  // 최초 1회 초기화
  useEffect(() => {
    if (!mapRef.current) return
    const init = () => {
      if (!window.kakao?.maps || mapInstance.current) return
      mapInstance.current = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(36.2, 127.9), // 대한민국 중심
        level: 12,
        scrollwheel: true,
      })
      render(true)
      const observer = new ResizeObserver(() => mapInstance.current?.relayout())
      observer.observe(mapRef.current!)
      return () => observer.disconnect()
    }
    if (window.kakao?.maps) init()
    else {
      const t = setInterval(() => { if (window.kakao?.maps) { clearInterval(t); init() } }, 300)
      return () => clearInterval(t)
    }
  }, [])

  // 지역이 바뀌면 "그 지역으로 자동 줌"을 아직 안 한 상태로 리셋
  const trailKey = trails.map(t => t.courseId).join(',')
  const fittedRegionRef = useRef<string>('')
  useEffect(() => { fittedRegionRef.current = '' }, [trailKey])

  // 경로 로딩분/선택 변경 시 다시 그림. bounds 맞춤 시점:
  //  - 코스 선택 시: 선택 코스로 맞춤
  //  - 미선택 시: 해당 지역 경로가 모두 로드되면 딱 1회 지역 전체로 맞춤(로딩 중 잦은 줌 방지)
  const loadedInRegion = trails.filter(t => paths[t.courseId]?.length).length
  useEffect(() => {
    if (!mapInstance.current) return
    if (selectedId != null) {
      render(true)
      return
    }
    const allLoaded = trails.length > 0 && loadedInRegion >= trails.length
    const fitNow = allLoaded && fittedRegionRef.current !== trailKey
    render(fitNow)
    if (fitNow) fittedRegionRef.current = trailKey
  }, [loadedInRegion, selectedId, trailKey])

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
