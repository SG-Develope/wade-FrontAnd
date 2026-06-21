import TubeVisualization from '@/components/trends/TubeVisualization'
import Skeleton from '@/components/common/Skeleton'
import type { Station } from '@/types'

const STATUS_COLOR: Record<string, string> = {
  normal:   '#1D9E75',
  caution:  '#EF9F27',
  warning:  '#E24B4A',
  critical: '#7A1F1F',
}

interface Props {
  stations: Station[]
  isLoading: boolean
}

export default function TrendsSidebar({ stations, isLoading }: Props) {
  return (
    <div className="w-[30%] bg-white border-l border-pebble overflow-y-auto flex flex-col shrink-0">

      {/* 튜브 시각화 */}
      <div className="px-4 py-3.5 border-b border-[#F5F0EA]">
        <div className="text-[10px] text-moss font-bold tracking-[0.05em] mb-1">수위 주의 단계 직관 시각화</div>
        <div className="text-[9px] text-moss opacity-60 mb-3">주의수위 기준 현재 수위 단계 확인</div>
        {isLoading
          ? <div className="h-[200px] bg-sand rounded-lg animate-pulse" />
          : (
            <div className="flex justify-around py-2">
              {stations.map(s => (
                <TubeVisualization
                  key={s.id}
                  level={s.currentLevel}
                  normalLevel={s.normalLevel}
                  cautionLevel={s.cautionLevel}
                  warningLevel={s.warningLevel}
                  criticalLevel={s.criticalLevel ?? s.warningLevel * 1.2}
                  label={s.name}
                />
              ))}
            </div>
          )
        }
      </div>

      {/* 현재 수위 바 */}
      <div className="px-4 py-3.5 border-b border-[#F5F0EA]">
        <div className="text-[10px] text-moss font-bold tracking-[0.05em] mb-2.5">현재 수위</div>
        {isLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton height={40} />
            <Skeleton height={40} />
          </div>
        ) : stations.map(s => {
          const design = s.designFloodLevel ?? 8
          const pct = Math.min((s.currentLevel / design) * 100, 100)
          const c = STATUS_COLOR[s.status] ?? STATUS_COLOR.normal
          return (
            <div key={s.id} className="mb-2.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-soil">{s.name}</span>
                <span className="text-[11px] font-bold" style={{ color: c }}>{s.currentLevel.toFixed(2)}m</span>
              </div>
              <div className="h-2 bg-pebble rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: c }} />
              </div>
              <div className="flex justify-between mt-0.5 text-[9px] text-moss">
                <span>0m</span>
                <span>{design}m (홍수위)</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* 경보 기준 */}
      <div className="px-4 py-3.5">
        <div className="text-[10px] text-moss font-bold tracking-[0.05em] mb-2.5">경보 단계 기준</div>
        {stations.map(s => (
          <div key={s.id} className="mb-3">
            <div className="text-[11px] font-semibold text-soil mb-1.5">{s.name}</div>
            {[
              { label: '평상', level: s.normalLevel,   color: '#5DCAA5' },
              { label: '주의', level: s.cautionLevel,  color: '#EF9F27' },
              { label: '위험', level: s.warningLevel,  color: '#E24B4A' },
              { label: '심각', level: s.criticalLevel, color: '#7A1F1F' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-1 border-b border-[#F5F0EA] text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full inline-block" style={{ background: item.color }} />
                  <span className="text-soil">{item.label}</span>
                </div>
                <span className="font-semibold" style={{ color: item.color }}>{item.level}m 이상</span>
              </div>
            ))}
          </div>
        ))}
      </div>

    </div>
  )
}
