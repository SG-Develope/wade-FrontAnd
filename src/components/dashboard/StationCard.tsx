import type { Station } from '@/types'
import { STATUS_COLORS, STATIONS } from '@/constants/stations'
import StatusDot from '@/components/common/StatusDot'
import StatusBadge from '@/components/common/StatusBadge'
import useAppStore from '@/stores/appStore'

interface Props {
  station: Station
}

export default function StationCard({ station }: Props) {
  const { setSelectedStation } = useAppStore()
  const colors = STATUS_COLORS[station.status] ?? STATUS_COLORS.normal
  const stationInfo = Object.values(STATIONS).find(s => s.id === station.id)

  const designFlood = station.designFloodLevel ?? stationInfo?.thresholds.designFlood ?? 10
  const fillPct = Math.min((station.currentLevel / designFlood) * 100, 100)

  return (
    <div
      onClick={() => setSelectedStation(station)}
      className="flex items-center gap-2 px-1 py-2 border-b border-[#F5F0EA] cursor-pointer rounded-lg hover:bg-sand transition-colors"
    >
      <StatusDot status={station.status} />
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-semibold text-soil">{station.name}</div>
        <div className="text-[10px] text-moss mt-0.5">{stationInfo?.location ?? '낙동강'}</div>
        {/* 미니 수위 바 */}
        <div className="h-1 bg-pebble rounded-full mt-1 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${fillPct}%`, background: colors.marker }}
          />
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-[14px] font-bold" style={{ color: colors.text }}>
          {station.currentLevel?.toFixed(1) ?? '-'}m
        </div>
        <div className="mt-0.5">
          <StatusBadge status={station.status} size="sm" />
        </div>
      </div>
    </div>
  )
}
