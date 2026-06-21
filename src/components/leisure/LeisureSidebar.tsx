import { STATUS_COLORS } from '@/constants/stations'
import type { PlaceApiItem } from '@/api/place'
import type { WaterStatus } from '@/types'

const STATUS_TEXT: Record<string, { label: string; bgCls: string; textCls: string }> = {
  normal:   { label: '이용 가능', bgCls: 'bg-[#E1F5EE]', textCls: 'text-[#0F6E56]' },
  caution:  { label: '주의 요망', bgCls: 'bg-[#FEF3DC]', textCls: 'text-[#7A4300]' },
  warning:  { label: '이용 금지', bgCls: 'bg-[#FEEEEE]', textCls: 'text-[#A32D2D]' },
  critical: { label: '이용 금지', bgCls: 'bg-[#FEEEEE]', textCls: 'text-[#7A1F1F]' },
}

function getPlaceStatus(place: PlaceApiItem, level: number): WaterStatus {
  if (level > place.cautionWl) return 'warning'
  if (level > place.safeWl)    return 'caution'
  return 'normal'
}

interface Props {
  places: PlaceApiItem[]
  selectedPlace?: PlaceApiItem
  getLevel: (stationId: string) => number | null
  onSelect: (id: string) => void
  onDeselect: () => void
}

function PlaceDetail({ place, getLevel }: { place: PlaceApiItem; getLevel: (id: string) => number | null }) {
  const level  = getLevel(place.stationId)
  const status = (level != null ? getPlaceStatus(place, level) : 'normal') as WaterStatus
  const colors = STATUS_COLORS[status]
  const st     = STATUS_TEXT[status]
  const stationName = place.stationId === 'yangpo' ? '양포교' : '호국의다리'

  return (
    <>
      <div className={`rounded-[10px] px-3 py-2.5 mb-2.5 border ${st.bgCls} ${st.textCls}`} style={{ borderColor: colors.marker }}>
        <div className="text-[12px] font-bold">{st.label}</div>
        <div className="text-[10px] mt-0.5 opacity-80">
          {stationName} 수위 {level != null ? level.toFixed(1) + 'm' : '-'} 기준
        </div>
      </div>

      <div className="mb-2.5">
        <div className="text-[10px] text-moss font-bold tracking-[0.04em] mb-2">안전 기준</div>
        {[
          { label: '안전', range: `${place.safeWl}m 이하`,                              color: '#1D9E75' },
          { label: '주의', range: `${place.safeWl}m ~ ${place.cautionWl}m`,             color: '#EF9F27' },
          { label: '위험', range: `${place.cautionWl}m 초과`,                           color: '#E24B4A' },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-[#F5F0EA] text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: item.color }} />
              <span className="text-soil">{item.label}</span>
            </div>
            <span className="font-semibold" style={{ color: item.color }}>{item.range}</span>
          </div>
        ))}
      </div>

      <div>
        <div className="text-[10px] text-moss font-bold tracking-[0.04em] mb-2">편의시설</div>
        <div className="flex flex-wrap gap-1.5">
          {place.amenities.map(a => (
            <span key={a} className="text-[10px] px-2 py-0.5 rounded-full bg-river-light text-[#0F6E56] font-semibold border border-[#9FE1CB]">{a}</span>
          ))}
        </div>
      </div>
    </>
  )
}

function SidebarDefault({ places, getLevel, onSelect }: { places: PlaceApiItem[]; getLevel: (id: string) => number | null; onSelect: (id: string) => void }) {
  return (
    <div>
      <div className="px-4 py-3.5 border-b border-[#F5F0EA]">
        <div className="text-[10px] text-moss font-bold tracking-[0.05em] mb-2.5">여가 장소 현황</div>
        {places.map(place => {
          const level  = getLevel(place.stationId)
          const status = (level != null ? getPlaceStatus(place, level) : 'normal') as WaterStatus
          const st     = STATUS_TEXT[status]
          return (
            <div
              key={place.id}
              onClick={() => onSelect(place.id)}
              className="flex items-center gap-2 py-1.5 border-b border-[#F5F0EA] cursor-pointer"
            >
              <span className="text-[14px]">{place.icon}</span>
              <div className="flex-1">
                <div className="text-[12px] font-semibold text-soil">{place.name}</div>
                <div className="text-[10px] text-moss">{level != null ? level.toFixed(1) + 'm' : '-'}</div>
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-lg font-bold ${st.bgCls} ${st.textCls}`}>{st.label}</span>
            </div>
          )
        })}
      </div>
      <div className="px-4 py-3.5">
        <div className="text-[10px] text-moss font-bold mb-2">이용 안내</div>
        <div className="text-[11px] text-[#4A5A3A] leading-[1.7]">
          장소를 클릭하면 상세 안전 기준과 편의시설 정보를 확인할 수 있습니다. 수위는 10분 주기로 자동 갱신됩니다.
        </div>
      </div>
    </div>
  )
}

const DEV_CHECKLIST = [
  { label: '실시간 수위 연동', done: true  },
  { label: '장소 안전 기준 DB', done: true  },
  { label: '지도 마커 시각화',  done: false },
  { label: '상세 정보 패널',    done: false },
]

export default function LeisureSidebar({ places, selectedPlace, getLevel, onSelect, onDeselect }: Props) {
  return (
    <div className="w-[308px] bg-white border-l border-pebble overflow-y-auto shrink-0 relative">
      {selectedPlace ? (
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[13px] font-bold text-soil flex items-center gap-1.5">
              {selectedPlace.icon} {selectedPlace.name}
            </div>
            <button
              onClick={onDeselect}
              className="w-6 h-6 bg-sand border border-pebble rounded-md flex items-center justify-center cursor-pointer text-moss"
            >
              <i className="ti ti-x text-[13px]" />
            </button>
          </div>
          <PlaceDetail place={selectedPlace} getLevel={getLevel} />
        </div>
      ) : (
        <SidebarDefault places={places} getLevel={getLevel} onSelect={onSelect} />
      )}

      {/* 개발 계획 오버레이 */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6"
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(2px)' }}
      >
        <div className="w-10 h-10 rounded-full bg-river-light flex items-center justify-center">
          <i className="ti ti-map-2 text-river" style={{ fontSize: 20 }} />
        </div>
        <div className="text-center">
          <div className="text-[13px] font-bold text-soil mb-1">여가 지도 개발 진행중</div>
          <div className="text-[11px] text-moss leading-[1.6]">장소별 실시간 수위 연동 · 안전 기준 시각화 · 편의시설 안내 기능을 준비하고 있습니다</div>
        </div>
        <div className="flex flex-col gap-1.5 w-full mt-1">
          {DEV_CHECKLIST.map(item => (
            <div key={item.label} className="flex items-center gap-2 text-[11px]">
              <i className={`ti ${item.done ? 'ti-circle-check text-river' : 'ti-circle-dashed text-moss opacity-50'}`} style={{ fontSize: 14 }} />
              <span className={item.done ? 'text-soil font-semibold' : 'text-moss opacity-60'}>{item.label}</span>
              {item.done && <span className="ml-auto text-[9px] bg-river-light text-river px-1.5 py-0.5 rounded-full font-bold">완료</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
