import StatusBadge from '@/components/common/StatusBadge'
import { TableRowSkeleton } from '@/components/common/Skeleton'
import type { Station, WaterStatus } from '@/types'

interface HistoryPoint {
  measuredAt: string
  level: number
  status: WaterStatus
}

interface Props {
  history: HistoryPoint[]
  isLoading: boolean
  selectedStationData?: Station
}

export default function HistoryTable({ history, isLoading, selectedStationData }: Props) {
  return (
    <div className="border border-pebble rounded-[14px] px-4 py-3.5 min-h-82">
      <div className="text-[10px] text-moss font-bold tracking-[0.04em] mb-2.5">최근 관측 이력</div>
      <table className="w-full border-collapse text-[12px]">
        <thead>
          <tr>
            {['시각', '수위', '상태', '관심 대비'].map(h => (
              <th key={h} className="text-[10px] text-moss font-bold px-2 py-1.5 border-b border-pebble text-left tracking-[0.03em]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading && <TableRowSkeleton cols={4} rows={8} />}
          {!isLoading && history.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-8 text-[11px] text-moss opacity-60">
                관측 이력이 없습니다
              </td>
            </tr>
          )}
          {!isLoading && history.slice(-12).reverse().map((point, i) => {
            const normal = selectedStationData?.normalLevel ?? 1.6
            const diff = point.level - normal
            const diffColor = diff > 0.5 ? '#E24B4A' : diff > 0 ? '#EF9F27' : '#1D9E75'
            return (
              <tr key={i}>
                <td className="px-2 py-1.5 border-b border-[#F5F0EA] text-moss">
                  {new Date(point.measuredAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-2 py-1.5 border-b border-[#F5F0EA] font-semibold">{point.level.toFixed(2)}m</td>
                <td className="px-2 py-1.5 border-b border-[#F5F0EA]">
                  <StatusBadge status={point.status} size="sm" />
                </td>
                <td className="px-2 py-1.5 border-b border-[#F5F0EA] font-semibold" style={{ color: diffColor }}>
                  {diff > 0 ? '+' : ''}{diff.toFixed(2)}m
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
