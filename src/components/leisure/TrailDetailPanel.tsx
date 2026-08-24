import type { Trail } from '@/api/trail'

interface Props {
  trails: Trail[]
  filtered: Trail[]
  sido: string | null
  selected?: Trail
  isLoading: boolean
  onSido: (sido: string | null) => void
  onSelect: (courseId: string) => void
  onDeselect: () => void
}

const DIFF = ['', '쉬움', '보통', '어려움']
const DIFF_STYLE: Record<number, string> = {
  1: 'bg-[#E3F5EC] text-[#1E8A5A] border-[#A9E3C6]',
  2: 'bg-[#E4F1FA] text-[#1E6FA8] border-[#AcD7EE]',
  3: 'bg-[#FBEEDD] text-[#B9701A] border-[#F0CFA0]',
}

function fmtDuration(min: number | null): string {
  if (min == null) return '-'
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h === 0) return `${m}분`
  return m === 0 ? `${h}시간` : `${h}시간 ${m}분`
}

function MultiLine({ text }: { text: string }) {
  const lines = text.split(/<br\s*\/?>/i).map(s => s.trim()).filter(Boolean)
  return (
    <div className="text-[11px] text-[#4A5A3A] leading-[1.75] flex flex-col gap-1">
      {lines.map((ln, i) => <div key={i}>{ln}</div>)}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-3.5 border-b border-[#F5F0EA]">
      <div className="text-[10px] text-moss font-bold tracking-[0.05em] mb-2.5">{title}</div>
      {children}
    </div>
  )
}

function DiffBadge({ d }: { d: number | null }) {
  if (!d) return null
  return (
    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold border ${DIFF_STYLE[d] ?? ''}`}>
      난이도 {DIFF[d] ?? d}
    </span>
  )
}

/* ── 상세 뷰 (재사용) ─────────────────────────────── */

export function TrailDetailView({ trail }: { trail: Trail }) {
  return (
    <div>
      <div className="px-4 pt-4 pb-3 border-b border-[#F5F0EA]">
        <div className="flex flex-wrap items-center gap-1 mb-1.5">
          <DiffBadge d={trail.difficulty} />
          {trail.cycleType && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-river-light text-river font-bold border border-[#9FE1CB]">{trail.cycleType}</span>
          )}
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-sand text-moss font-bold border border-[#EDE8E0]">걷기</span>
        </div>
        <div className="text-[15px] font-bold text-soil leading-snug">{trail.name}</div>
        <div className="text-[11px] text-moss mt-0.5">{trail.region}</div>

        <div className="flex gap-2 mt-3">
          <div className="flex-1 bg-sand rounded-lg py-2 text-center">
            <div className="text-[9px] text-moss font-semibold">거리</div>
            <div className="text-[13px] font-bold text-soil">{trail.distanceKm ?? '-'}<span className="text-[10px] font-medium"> km</span></div>
          </div>
          <div className="flex-1 bg-sand rounded-lg py-2 text-center">
            <div className="text-[9px] text-moss font-semibold">소요시간</div>
            <div className="text-[13px] font-bold text-soil">{fmtDuration(trail.durationMin)}</div>
          </div>
        </div>
      </div>

      {trail.summary && (<Section title="코스 개요"><MultiLine text={trail.summary} /></Section>)}
      {trail.description && (<Section title="코스 설명"><MultiLine text={trail.description} /></Section>)}
      {trail.tourPoint && (<Section title="관광 포인트"><MultiLine text={trail.tourPoint} /></Section>)}
      {trail.travelerInfo && (<Section title="여행자 정보"><MultiLine text={trail.travelerInfo} /></Section>)}
      {trail.updatedAt && (
        <div className="px-4 pb-3 text-[10px] text-moss/70">최종 수정 · {String(trail.updatedAt).slice(0, 10)}</div>
      )}
    </div>
  )
}

/* ── 지역 선택 + 목록 뷰 (재사용) ─────────────────────────────── */

export function TrailListView({ trails, filtered, sido, onSido, onSelect }: {
  trails: Trail[]; filtered: Trail[]; sido: string | null
  onSido: (s: string | null) => void; onSelect: (id: string) => void
}) {
  const counts = trails.reduce<Record<string, number>>((acc, t) => {
    const s = t.sido || '기타'
    acc[s] = (acc[s] ?? 0) + 1
    return acc
  }, {})
  const sidos = Object.entries(counts).sort((a, b) => b[1] - a[1])

  return (
    <div>
      <div className="px-4 py-3 border-b border-[#F5F0EA]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] font-bold text-soil">산책로 지역</span>
          <span className="text-[10px] bg-river-light text-river px-2 py-0.5 rounded-full font-bold">{trails.length}개</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {sidos.map(([s, n]) => {
            const on = s === sido
            return (
              <button key={s} onClick={() => onSido(on ? null : s)}
                className={`text-[10px] px-2.5 py-1 rounded-full font-bold border transition-colors ${
                  on ? 'bg-river text-white border-river'
                     : 'bg-white text-soil border-pebble hover:bg-sand'
                }`}>
                {s} <span className={on ? 'text-white/80' : 'text-river'}>{n}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        {filtered.map(trail => (
          <div key={trail.courseId} onClick={() => onSelect(trail.courseId)}
            className="flex items-center gap-2.5 px-4 py-2.5 border-b border-[#F5F0EA] cursor-pointer hover:bg-sand transition-colors">
            <div className="w-8 h-8 rounded-lg bg-river-light flex items-center justify-center shrink-0">
              <i className="ti ti-walk text-river text-[16px]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-bold text-soil truncate">{trail.name}</div>
              <div className="text-[10px] text-moss truncate">
                {trail.region} · {trail.distanceKm ?? '-'}km · {fmtDuration(trail.durationMin)}
              </div>
            </div>
            <DiffBadge d={trail.difficulty} />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── 단독 패널 (구버전 호환용, 현재는 통합 패널 사용) ─────────── */

export default function TrailDetailPanel({
  trails, filtered, sido, selected, isLoading, onSido, onSelect, onDeselect,
}: Props) {
  return (
    <aside className="shrink-0 flex flex-col bg-white border-t lg:border-t-0 lg:border-l border-pebble w-full lg:w-[360px] overflow-y-auto">
      {selected && (
        <button onClick={onDeselect}
          className="flex items-center gap-1.5 px-4 py-2.5 text-[11px] text-moss border-b border-[#F5F0EA] cursor-pointer hover:bg-sand transition-colors sticky top-0 bg-white z-10">
          <i className="ti ti-chevron-left text-[13px]" /> 목록으로
        </button>
      )}
      {isLoading ? (
        <div className="p-4 flex flex-col gap-2">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-14 bg-sand rounded-xl animate-pulse" />)}
        </div>
      ) : selected ? (
        <TrailDetailView trail={selected} />
      ) : (
        <TrailListView trails={trails} filtered={filtered} sido={sido} onSido={onSido} onSelect={onSelect} />
      )}
    </aside>
  )
}
