import type { CampingSite } from '@/api/camping'

interface Props {
  sites: CampingSite[]
  selected?: CampingSite
  isLoading: boolean
  onSelect: (id: number) => void
  onDeselect: () => void
}

/* ── 작은 표시 유닛 ─────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-3.5 border-b border-[#F5F0EA]">
      <div className="text-[10px] text-moss font-bold tracking-[0.05em] mb-2.5">{title}</div>
      {children}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value?: React.ReactNode }) {
  if (value == null || value === '' || value === '알수없음') return null
  return (
    <div className="flex gap-2 py-1 text-[11px] leading-relaxed">
      <span className="text-moss shrink-0 w-14">{label}</span>
      <span className="text-soil flex-1 break-words">{value}</span>
    </div>
  )
}

function FlagGrid({ items }: { items: { label: string; on: boolean | null }[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map(it => {
        const on = it.on === true
        return (
          <span
            key={it.label}
            className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
              on
                ? 'bg-river-light text-[#0F6E56] border-[#9FE1CB]'
                : 'bg-sand text-moss/50 border-[#EDE8E0]'
            }`}
          >
            <i className={`ti ${on ? 'ti-check' : 'ti-minus'} text-[10px]`} />
            {it.label}
          </span>
        )
      })}
    </div>
  )
}

function CountRow({ items }: { items: { label: string; n: number | null }[] }) {
  const shown = items.filter(i => i.n != null)
  if (shown.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {shown.map(i => (
        <span key={i.label} className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-pebble text-soil font-semibold">
          {i.label} <span className="text-river">{i.n}</span>
        </span>
      ))}
    </div>
  )
}

/* ── 상세 뷰 (재사용) ─────────────────────────────── */

export function CampingDetailView({ site }: { site: CampingSite }) {
  const tags = (site.category3 ?? '').split(',').map(s => s.trim()).filter(Boolean)
  const address = site.roadAddress || site.jibunAddress || ''
  const seasons = [
    { label: '봄', on: site.openSpring },
    { label: '여름', on: site.openSummer },
    { label: '가을', on: site.openFall },
    { label: '겨울', on: site.openWinter },
    { label: '평일', on: site.openWeekday },
    { label: '주말', on: site.openWeekend },
  ]
  const amenities = [
    { label: '전기', on: site.amenityElectricity },
    { label: '온수', on: site.amenityHotWater },
    { label: '무선인터넷', on: site.amenityWifi },
    { label: '장작판매', on: site.amenityFirewoodSale },
    { label: '산책로', on: site.amenityWalkingTrail },
    { label: '물놀이장', on: site.amenityWaterPlay },
    { label: '놀이터', on: site.amenityPlayground },
    { label: '마트', on: site.amenityMart },
  ]
  const counts = [
    { label: '화장실', n: site.restroomCount },
    { label: '샤워실', n: site.showerCount },
    { label: '씽크대', n: site.sinkCount },
    { label: '소화기', n: site.extinguisherCount },
  ]
  const nearby = [
    { label: '낚시', on: site.nearbyFishing },
    { label: '산책로', on: site.nearbyWalkingTrail },
    { label: '해수욕', on: site.nearbyWaterBeach },
    { label: '수상레저', on: site.nearbyWaterLeisure },
    { label: '계곡', on: site.nearbyWaterValley },
    { label: '강', on: site.nearbyWaterRiver },
    { label: '수영장', on: site.nearbyWaterPool },
    { label: '청소년체험', on: site.nearbyYouthFacility },
    { label: '농어촌체험', on: site.nearbyRuralExperience },
    { label: '어린이놀이', on: site.nearbyChildrenPlay },
  ]
  const glamping = [
    { label: '침대', on: site.glampingBed },
    { label: 'TV', on: site.glampingTv },
    { label: '냉장고', on: site.glampingFridge },
    { label: '인터넷', on: site.glampingInternet },
    { label: '내부화장실', on: site.glampingInternalRestroom },
    { label: '에어컨', on: site.glampingAircon },
    { label: '난방기구', on: site.glampingHeater },
    { label: '취사도구', on: site.glampingCookingTools },
  ]
  const hasGlamping = tags.some(t => t.includes('글램핑')) || glamping.some(g => g.on === true)

  return (
    <div>
      <div className="px-4 pt-4 pb-3 border-b border-[#F5F0EA]">
        <div className="flex flex-wrap gap-1 mb-1.5">
          {tags.map(t => (
            <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full bg-river-light text-river font-bold border border-[#9FE1CB]">{t}</span>
          ))}
        </div>
        <div className="text-[15px] font-bold text-soil leading-snug">{site.facilityName}</div>
        <div className="text-[11px] text-moss mt-0.5">{site.sido} {site.sigungu}</div>
      </div>

      <Section title="기본 정보">
        <InfoRow label="주소" value={address} />
        {site.roadAddress && site.jibunAddress && site.jibunAddress !== site.roadAddress && (
          <InfoRow label="지번" value={site.jibunAddress} />
        )}
        <InfoRow
          label="전화"
          value={site.phone ? <a href={`tel:${site.phone}`} className="text-river hover:underline">{site.phone}</a> : undefined}
        />
        <InfoRow
          label="홈페이지"
          value={site.homepage
            ? <a href={site.homepage} target="_blank" rel="noreferrer" className="text-river hover:underline break-all">{site.homepage}</a>
            : undefined}
        />
        <InfoRow label="운영주체" value={site.operator} />
        <InfoRow label="우편번호" value={site.zipcode} />
      </Section>

      <Section title="운영"><FlagGrid items={seasons} /></Section>

      <Section title="부대시설">
        <FlagGrid items={amenities} />
        <CountRow items={counts} />
      </Section>

      <Section title="주변 시설"><FlagGrid items={nearby} /></Section>

      {hasGlamping && (<Section title="글램핑 옵션"><FlagGrid items={glamping} /></Section>)}

      {(site.features && site.features !== '알수없음') && (
        <Section title="시설 특징">
          <div className="text-[11px] text-[#4A5A3A] leading-[1.7]">{site.features}</div>
        </Section>
      )}
      {(site.description && site.description !== '알수없음') && (
        <Section title="시설 소개">
          <div className="text-[11px] text-[#4A5A3A] leading-[1.7]">{site.description}</div>
        </Section>
      )}

      {site.lastUpdated && (
        <div className="px-4 py-3 text-[10px] text-moss/70">최종 작성일 · {site.lastUpdated}</div>
      )}
    </div>
  )
}

/* ── 목록 뷰 (재사용) ─────────────────────────────── */

export function CampingListView({ sites, onSelect }: { sites: CampingSite[]; onSelect: (id: number) => void }) {
  return (
    <div>
      {sites.map(site => {
        const tags = (site.category3 ?? '').split(',').map(s => s.trim()).filter(Boolean)
        return (
          <div
            key={site.id}
            onClick={() => onSelect(site.id)}
            className="flex items-center gap-2.5 px-4 py-2.5 border-b border-[#F5F0EA] cursor-pointer hover:bg-sand transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-river-light flex items-center justify-center shrink-0">
              <i className="ti ti-tent text-river text-[16px]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-bold text-soil truncate">{site.facilityName}</div>
              <div className="text-[10px] text-moss truncate">{site.sigungu} · {tags[0] ?? '캠핑장'}</div>
            </div>
            <i className="ti ti-chevron-right text-moss/50 text-[14px] shrink-0" />
          </div>
        )
      })}
    </div>
  )
}

/* ── 단독 패널 (구버전 호환용, 현재는 통합 패널 사용) ─────────── */

export default function CampingDetailPanel({ sites, selected, isLoading, onSelect, onDeselect }: Props) {
  return (
    <aside className="shrink-0 flex flex-col bg-white border-t lg:border-t-0 lg:border-l border-pebble w-full lg:w-[360px] overflow-y-auto">
      {selected && (
        <button
          onClick={onDeselect}
          className="flex items-center gap-1.5 px-4 py-2.5 text-[11px] text-moss border-b border-[#F5F0EA] cursor-pointer hover:bg-sand transition-colors sticky top-0 bg-white z-10"
        >
          <i className="ti ti-chevron-left text-[13px]" />
          목록으로
        </button>
      )}

      {isLoading ? (
        <div className="p-4 flex flex-col gap-2">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-14 bg-sand rounded-xl animate-pulse" />)}
        </div>
      ) : selected ? (
        <CampingDetailView site={selected} />
      ) : (
        <CampingListView sites={sites} onSelect={onSelect} />
      )}
    </aside>
  )
}
