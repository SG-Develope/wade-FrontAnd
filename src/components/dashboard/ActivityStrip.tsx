import { usePlaces } from '@/queries/usePlaceQuery'
import type { Station } from '@/types'

interface Props {
  stations: Station[]
}

const STATUS_PILL = {
  normal:   { cls: 'bg-[#E1F5EE] text-[#085041]', text: '이용가능' },
  caution:  { cls: 'bg-[#FEF3DC] text-[#7A4300]', text: '주의요망' },
  warning:  { cls: 'bg-[#FEEEEE] text-[#A32D2D]', text: '이용금지' },
  critical: { cls: 'bg-[#FEEEEE] text-[#7A1F1F]', text: '이용금지' },
}

export default function ActivityStrip({ stations }: Props) {
  const { data: placesData } = usePlaces()
  const places = placesData ?? []

  const getStationLevel = (stationId: string) => {
    const s = stations.find(s => s.id === stationId)
    return s?.currentLevel ?? 0
  }

  const getStatus = (safeWl: number, cautionWl: number, level: number) => {
    if (level > cautionWl) return 'warning'
    if (level > safeWl)    return 'caution'
    return 'normal'
  }

  if (places.length === 0) return null

  return (
    <div className="bg-white border-t border-pebble px-4 py-2.5 flex gap-2 items-center shrink-0 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
      <span className="text-[10px] text-moss font-semibold tracking-[0.04em] whitespace-nowrap mr-1">여가 현황</span>
      {places.map(place => {
        const level  = getStationLevel(place.stationId)
        const status = getStatus(place.safeWl, place.cautionWl, level)
        const pill   = STATUS_PILL[status as keyof typeof STATUS_PILL] ?? STATUS_PILL.normal
        return (
          <div
            key={place.id}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap ${pill.cls}`}
          >
            <span className="text-[14px]">{place.icon}</span>
            {place.name.length > 10 ? place.name.substring(0, 8) + '…' : place.name}
            <span className="text-[10px] font-bold">· {pill.text}</span>
          </div>
        )
      })}
    </div>
  )
}
