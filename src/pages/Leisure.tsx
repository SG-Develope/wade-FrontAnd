import { useMemo, useState } from 'react'
import { useCampingSites } from '@/queries/useCampingQuery'
import { useTrails, useTrailPaths } from '@/queries/useTrailQuery'
import LeisureMapView from '@/components/leisure/LeisureMapView'
import LeisurePanel from '@/components/leisure/LeisurePanel'
import Seo from '@/components/common/Seo'

export default function Leisure() {
  // 레이어 on/off
  const [campingOn, setCampingOn] = useState(true)
  const [trailOn, setTrailOn] = useState(false)

  // 선택(캠핑/산책로 상호 배타)
  const [selectedCampingId, setSelectedCampingId] = useState<number | null>(null)
  const [selectedTrailId, setSelectedTrailId] = useState<string | null>(null)
  const [trailSido, setTrailSido] = useState<string | null>('경북')

  // 데이터
  const { data: campingData, isLoading: campingLoading } = useCampingSites()
  const { data: trailData, isLoading: trailLoading } = useTrails()
  const sites = campingData ?? []
  const trails = trailData ?? []

  const filtered = useMemo(
    () => (trailSido ? trails.filter(t => t.sido === trailSido) : trails),
    [trails, trailSido],
  )
  // 산책로 레이어가 켜져 있을 때만 경로 로드
  const courseIds = useMemo(
    () => (trailOn ? filtered.map(t => t.courseId) : []),
    [trailOn, filtered],
  )
  const { paths } = useTrailPaths(courseIds)

  const selectedCamping = selectedCampingId != null ? sites.find(s => s.id === selectedCampingId) : undefined
  const selectedTrail = selectedTrailId != null ? trails.find(t => t.courseId === selectedTrailId) : undefined

  /* ── 핸들러 ── */
  const selectCamping = (id: number) => { setSelectedCampingId(id); setSelectedTrailId(null) }
  const selectTrail = (cid: string) => { setSelectedTrailId(cid); setSelectedCampingId(null) }
  const deselect = () => { setSelectedCampingId(null); setSelectedTrailId(null) }
  const handleSido = (s: string | null) => { setTrailSido(s); setSelectedTrailId(null) }

  const toggleCamping = () => {
    setCampingOn(v => {
      if (v) setSelectedCampingId(null) // 끄면 선택 해제
      return !v
    })
  }
  const toggleTrail = () => {
    setTrailOn(v => {
      if (v) setSelectedTrailId(null)
      return !v
    })
  }

  const isLoading = (campingOn && campingLoading) || (trailOn && trailLoading)

  return (
    <div className="flex flex-col h-full">
      <Seo
        title="여가 지도"
        description="구미·칠곡 낙동강 주변 캠핑장과 전국 코리아둘레길 산책로 코스를 한 지도에서 켜고 끄며 확인하세요."
        path="/leisure"
      />

      {/* 레이어 토글 (on/off) */}
      <div className="shrink-0 flex items-center gap-1.5 px-4 py-2 border-b border-pebble bg-white">
        <ToggleButton icon="ti-campfire" label="캠핑장" on={campingOn} onClick={toggleCamping} />
        <ToggleButton icon="ti-walk" label="산책로" on={trailOn} onClick={toggleTrail} />
        <span className="ml-1 text-[10px] text-moss/70">버튼으로 지도 레이어를 켜고 끕니다</span>
      </div>

      {/* 단일 지도 + 통합 패널 */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-y-auto lg:overflow-hidden">
        <div className="h-[55vh] shrink-0 lg:h-auto lg:flex-1 overflow-hidden">
          <LeisureMapView
            sites={sites}
            campingOn={campingOn}
            selectedCampingId={selectedCampingId}
            onSelectCamping={selectCamping}
            trails={filtered}
            paths={paths}
            trailOn={trailOn}
            selectedTrailId={selectedTrailId}
            onSelectTrail={selectTrail}
          />
        </div>

        <LeisurePanel
          sites={sites}
          campingOn={campingOn}
          selectedCamping={selectedCamping}
          onSelectCamping={selectCamping}
          trails={trails}
          filtered={filtered}
          sido={trailSido}
          trailOn={trailOn}
          selectedTrail={selectedTrail}
          onSido={handleSido}
          onSelectTrail={selectTrail}
          isLoading={isLoading}
          onDeselect={deselect}
        />
      </div>
    </div>
  )
}

function ToggleButton({ icon, label, on, onClick }: { icon: string; label: string; on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      aria-pressed={on}
      className={`inline-flex items-center gap-1.5 text-[12px] font-bold px-3.5 py-1.5 rounded-full border transition-colors ${
        on ? 'bg-river text-white border-river shadow-sm'
           : 'bg-white text-moss/70 border-pebble hover:bg-sand'
      }`}>
      <i className={`ti ${icon} text-[15px]`} />
      {label}
      <i className={`ti ${on ? 'ti-eye' : 'ti-eye-off'} text-[13px] ${on ? 'text-white/80' : 'text-moss/50'}`} />
    </button>
  )
}
