import type { CampingSite } from '@/api/camping'
import type { Trail } from '@/api/trail'
import { CampingDetailView, CampingListView } from './CampingDetailPanel'
import { TrailDetailView, TrailListView } from './TrailDetailPanel'

interface Props {
  // 캠핑장
  sites: CampingSite[]
  campingOn: boolean
  selectedCamping?: CampingSite
  onSelectCamping: (id: number) => void
  // 산책로
  trails: Trail[]
  filtered: Trail[]
  sido: string | null
  trailOn: boolean
  selectedTrail?: Trail
  onSido: (s: string | null) => void
  onSelectTrail: (courseId: string) => void
  // 공통
  isLoading: boolean
  onDeselect: () => void
}

export default function LeisurePanel({
  sites, campingOn, selectedCamping, onSelectCamping,
  trails, filtered, sido, trailOn, selectedTrail, onSido, onSelectTrail,
  isLoading, onDeselect,
}: Props) {
  const hasSelection = !!selectedTrail || !!selectedCamping

  return (
    <aside className="shrink-0 flex flex-col bg-white border-t lg:border-t-0 lg:border-l border-pebble w-full lg:w-[360px] overflow-y-auto">
      {hasSelection && (
        <button onClick={onDeselect}
          className="flex items-center gap-1.5 px-4 py-2.5 text-[11px] text-moss border-b border-[#F5F0EA] cursor-pointer hover:bg-sand transition-colors sticky top-0 bg-white z-10">
          <i className="ti ti-chevron-left text-[13px]" /> 목록으로
        </button>
      )}

      {isLoading ? (
        <div className="p-4 flex flex-col gap-2">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-14 bg-sand rounded-xl animate-pulse" />)}
        </div>
      ) : selectedTrail ? (
        <TrailDetailView trail={selectedTrail} />
      ) : selectedCamping ? (
        <CampingDetailView site={selectedCamping} />
      ) : (
        <div>
          {!campingOn && !trailOn && (
            <div className="px-4 py-10 text-center text-[11px] text-moss">
              <i className="ti ti-stack-2 text-[24px] text-moss/40 block mb-2" />
              위의 <b>캠핑장</b> · <b>산책로</b> 버튼으로<br />지도에 표시할 레이어를 켜세요
            </div>
          )}

          {/* 산책로 섹션 */}
          {trailOn && (
            <TrailListView trails={trails} filtered={filtered} sido={sido} onSido={onSido} onSelect={onSelectTrail} />
          )}

          {/* 캠핑장 섹션 */}
          {campingOn && (
            <div>
              <div className="px-4 py-3 border-b border-[#F5F0EA] flex items-center justify-between">
                <span className="text-[12px] font-bold text-soil">구미·칠곡 캠핑장</span>
                <span className="text-[10px] bg-river-light text-river px-2 py-0.5 rounded-full font-bold">{sites.length}곳</span>
              </div>
              <CampingListView sites={sites} onSelect={onSelectCamping} />
            </div>
          )}
        </div>
      )}
    </aside>
  )
}
