import { useMemo, useState } from 'react'
import { useTrails, useTrailPaths } from '@/queries/useTrailQuery'
import TrailMap from './TrailMap'
import TrailDetailPanel from './TrailDetailPanel'

export default function TrailView() {
  const { data, isLoading } = useTrails()
  const trails = data ?? []

  const [sido, setSido] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // 선택 지역 코스만
  const filtered = useMemo(
    () => (sido ? trails.filter(t => t.sido === sido) : []),
    [trails, sido],
  )

  // 선택 지역 코스들의 GPX 경로만 병렬 로드(캐시됨)
  const courseIds = useMemo(() => filtered.map(t => t.courseId), [filtered])
  const { paths, loadedCount } = useTrailPaths(courseIds)

  const selected = filtered.find(t => t.courseId === selectedId)

  const handleSido = (s: string | null) => {
    setSido(s)
    setSelectedId(null)
  }

  return (
    <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-y-auto lg:overflow-hidden">
      {/* 지도 */}
      <div className="relative h-[55vh] shrink-0 lg:h-auto lg:flex-1 overflow-hidden">
        <TrailMap
          trails={filtered}
          paths={paths}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        {/* 경로 로딩 표시 */}
        {sido && courseIds.length > 0 && loadedCount < courseIds.length && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-white/95 border border-pebble rounded-full px-3 py-1 text-[11px] text-moss font-semibold shadow">
            경로 불러오는 중 {loadedCount}/{courseIds.length}
          </div>
        )}
        {/* 지역 미선택 안내 */}
        {!sido && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-white/95 border border-pebble rounded-full px-3 py-1 text-[11px] text-moss font-semibold shadow">
            오른쪽에서 지역을 선택하세요
          </div>
        )}
      </div>

      {/* 상세 패널 */}
      <TrailDetailPanel
        trails={trails}
        filtered={filtered}
        sido={sido}
        selected={selected}
        isLoading={isLoading}
        onSido={handleSido}
        onSelect={setSelectedId}
        onDeselect={() => setSelectedId(null)}
      />
    </div>
  )
}
