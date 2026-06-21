import { STATUS_COLORS } from '@/constants/stations'
import type { PlaceApiItem } from '@/api/place'
import type { WaterStatus } from '@/types'

const STATUS_TEXT: Record<string, { label: string; bgCls: string; textCls: string }> = {
  normal:   { label: '이용 가능', bgCls: 'bg-[#E1F5EE]', textCls: 'text-[#0F6E56]' },
  caution:  { label: '주의 요망', bgCls: 'bg-[#FEF3DC]', textCls: 'text-[#7A4300]' },
  warning:  { label: '이용 금지', bgCls: 'bg-[#FEEEEE]', textCls: 'text-[#A32D2D]' },
  critical: { label: '이용 금지', bgCls: 'bg-[#FEEEEE]', textCls: 'text-[#7A1F1F]' },
}

const ICON_BG: Record<string, string> = {
  camping: 'bg-[#E8F5E9]',
  fishing: 'bg-sky',
  cycling: 'bg-river-light',
  walking: 'bg-[#FEF3DC]',
}

function getPlaceStatus(place: PlaceApiItem, level: number): WaterStatus {
  if (level > place.cautionWl) return 'warning'
  if (level > place.safeWl)    return 'caution'
  return 'normal'
}

interface Props {
  places: PlaceApiItem[]
  isLoading: boolean
  selected: string | null
  getLevel: (stationId: string) => number | null
  onSelect: (id: string | null) => void
}

export default function PlaceList({ places, isLoading, selected, getLevel, onSelect }: Props) {
  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-3 bg-sand">
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map(i => <div key={i} className="h-[72px] bg-white rounded-xl animate-pulse" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-3 bg-sand">
      <div className="flex flex-col gap-2">
        {places.map(place => {
          const level  = getLevel(place.stationId)
          const status = (level != null ? getPlaceStatus(place, level) : 'normal') as WaterStatus
          const colors = STATUS_COLORS[status]
          const st     = STATUS_TEXT[status]
          const isSelected = selected === place.id
          return (
            <div
              key={place.id}
              onClick={() => onSelect(isSelected ? null : place.id)}
              className="bg-white rounded-xl px-3.5 py-3 flex items-center gap-3 cursor-pointer transition-all duration-150"
              style={{
                border: `0.5px solid ${isSelected ? colors.marker : '#EDE8E0'}`,
                boxShadow: isSelected ? `0 3px 12px ${colors.marker}30` : 'none',
              }}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[18px] shrink-0 ${ICON_BG[place.type] ?? 'bg-sand'}`}>
                {place.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-bold text-soil">{place.name}</div>
                <div className="text-[10px] text-moss mt-0.5">
                  연결 관측소: {place.stationId === 'yangpo' ? '양포교' : '호국의다리'} · 수위 {level != null ? level.toFixed(1) + 'm' : '-'}
                </div>
                <div className="flex gap-1 mt-1.5 flex-wrap">
                  {place.amenities.slice(0, 3).map(a => (
                    <span key={a} className="text-[9px] px-1.5 py-0.5 rounded-lg bg-sand text-moss font-semibold">{a}</span>
                  ))}
                </div>
              </div>
              <div className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${st.bgCls} ${st.textCls}`}>{st.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
