import { useEffect, useRef } from 'react'
import type { CampingSite } from '@/api/camping'
import type { Trail, TrailPath } from '@/api/trail'

interface Props {
  // 캠핑장 레이어
  sites: CampingSite[]
  campingOn: boolean
  selectedCampingId: number | null
  onSelectCamping: (id: number) => void
  // 산책로 레이어
  trails: Trail[]                        // 선택 지역으로 필터된 코스
  paths: Record<string, TrailPath>       // courseId → GPX 좌표
  trailOn: boolean
  selectedTrailId: string | null
  onSelectTrail: (courseId: string) => void
}

const CAMP_COLOR        = '#1D9E75'
const CAMP_COLOR_ACTIVE = '#E24B4A'

const DIFF_COLOR: Record<number, string> = { 1: '#2FA36B', 2: '#2B8AC6', 3: '#E08A2B' }
const TRAIL_ACTIVE = '#E24B4A'
const TRAIL_DEFAULT = '#4A6A3A'
const trailColor = (t: Trail) => (t.difficulty && DIFF_COLOR[t.difficulty]) || TRAIL_DEFAULT

/** 캠핑장 마커(원형 텐트 뱃지 + 라벨) */
function campMarkerEl(site: CampingSite, active: boolean, onClick: () => void): HTMLElement {
  const color = active ? CAMP_COLOR_ACTIVE : CAMP_COLOR
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

/** 산책로 시작점 마커(원형 걷기 뱃지). 선택 시 이름 라벨 */
function trailMarkerEl(trail: Trail, active: boolean, onClick: () => void): HTMLElement {
  const color = active ? TRAIL_ACTIVE : trailColor(trail)
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

export default function LeisureMap({
  sites, campingOn, selectedCampingId, onSelectCamping,
  trails, paths, trailOn, selectedTrailId, onSelectTrail,
}: Props) {
  const mapRef       = useRef<HTMLDivElement>(null)
  const mapInstance  = useRef<any>(null)
  const overlaysRef  = useRef<any[]>([])
  const polylinesRef = useRef<any[]>([])

  const clearAll = () => {
    overlaysRef.current.forEach(o => o.setMap(null))
    polylinesRef.current.forEach(p => p.setMap(null))
    overlaysRef.current = []
    polylinesRef.current = []
  }

  /** 두 레이어 모두 다시 그림 */
  const render = () => {
    const kakao = window.kakao
    if (!mapInstance.current || !kakao?.maps) return
    clearAll()

    // ── 산책로 레이어
    if (trailOn) {
      const hasTrailSel = selectedTrailId != null
      trails.forEach(trail => {
        const pts = paths[trail.courseId]
        if (!pts || pts.length === 0) return
        const active = trail.courseId === selectedTrailId

        const polyline = new kakao.maps.Polyline({
          path: pts.map(([lat, lng]) => new kakao.maps.LatLng(lat, lng)),
          strokeWeight: active ? 6 : 4,
          strokeColor:  active ? TRAIL_ACTIVE : trailColor(trail),
          strokeOpacity: active ? 0.95 : (hasTrailSel ? 0.35 : 0.7),
          strokeStyle: 'solid',
        })
        polyline.setMap(mapInstance.current)
        kakao.maps.event.addListener(polyline, 'click', () => onSelectTrail(trail.courseId))
        polylinesRef.current.push(polyline)

        const [sLat, sLng] = pts[0]
        const ov = new kakao.maps.CustomOverlay({
          position: new kakao.maps.LatLng(sLat, sLng),
          content:  trailMarkerEl(trail, active, () => onSelectTrail(trail.courseId)),
          map:      mapInstance.current,
          yAnchor:  1.0,
          zIndex:   active ? 20 : 5,
        })
        overlaysRef.current.push(ov)
      })
    }

    // ── 캠핑장 레이어
    if (campingOn) {
      sites.forEach(site => {
        if (site.latitude == null || site.longitude == null) return
        const active = site.id === selectedCampingId
        const ov = new kakao.maps.CustomOverlay({
          position: new kakao.maps.LatLng(site.latitude, site.longitude),
          content:  campMarkerEl(site, active, () => onSelectCamping(site.id)),
          map:      mapInstance.current,
          yAnchor:  1.0,
          zIndex:   active ? 25 : 8,
        })
        overlaysRef.current.push(ov)
      })
    }
  }

  const fitToTrail = (courseId: string) => {
    const kakao = window.kakao
    const pts = paths[courseId]
    if (!pts || !pts.length) return
    const b = new kakao.maps.LatLngBounds()
    pts.forEach(([lat, lng]) => b.extend(new kakao.maps.LatLng(lat, lng)))
    mapInstance.current.setBounds(b, 40, 40, 40, 40)
  }

  const fitRegion = () => {
    const kakao = window.kakao
    const b = new kakao.maps.LatLngBounds()
    let has = false
    trails.forEach(t => {
      const pts = paths[t.courseId]
      if (pts?.length) { pts.forEach(([lat, lng]) => b.extend(new kakao.maps.LatLng(lat, lng))); has = true }
    })
    if (has) mapInstance.current.setBounds(b, 40, 40, 40, 40)
  }

  // 최초 1회 초기화 (기본: 구미·칠곡 권역)
  useEffect(() => {
    if (!mapRef.current) return
    const init = () => {
      if (!window.kakao?.maps || mapInstance.current) return
      mapInstance.current = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(36.09, 128.42),
        level: 9, scrollwheel: true,
      })
      render()
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

  // 지역 바뀌면 "지역 자동 줌" 리셋
  const trailKey = trails.map(t => t.courseId).join(',')
  const fittedRegionRef = useRef<string>('')
  useEffect(() => { fittedRegionRef.current = '' }, [trailKey, trailOn])

  // 레이어/선택/로딩 변화 반영 + 카메라 이동
  const loadedInRegion = trails.filter(t => paths[t.courseId]?.length).length
  useEffect(() => {
    if (!mapInstance.current) return
    render()

    if (trailOn && selectedTrailId) {
      fitToTrail(selectedTrailId)
    } else if (campingOn && selectedCampingId != null) {
      const s = sites.find(x => x.id === selectedCampingId)
      if (s?.latitude != null && s?.longitude != null) {
        mapInstance.current.panTo(new window.kakao.maps.LatLng(s.latitude, s.longitude))
      }
    } else if (trailOn && trails.length > 0 && loadedInRegion >= trails.length && fittedRegionRef.current !== trailKey) {
      fitRegion()
      fittedRegionRef.current = trailKey
    }
  }, [campingOn, trailOn, selectedCampingId, selectedTrailId, trailKey, loadedInRegion, sites])

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
