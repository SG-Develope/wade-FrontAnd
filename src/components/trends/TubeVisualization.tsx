import type { Station } from '@/types'
import { STATUS_COLORS } from '@/constants/stations'

interface Props {
  station: Station
}

export default function TubeVisualization({ station }: Props) {
  const normalLevel  = station.normalLevel ?? 1.6
  const designFlood  = station.designFloodLevel ?? 6.5
  const current      = station.currentLevel ?? normalLevel
  const totalHeight  = 160

  const normalPct  = (normalLevel / designFlood) * 100
  const currentPct = Math.min((current / designFlood) * 100, 100)
  const risePct    = Math.max(currentPct - normalPct, 0)
  const rise       = Math.max(current - normalLevel, 0)

  const colors = STATUS_COLORS[station.status] ?? STATUS_COLORS.normal

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-[12px] font-bold text-soil">{station.name}</div>

      {/* 튜브 그래픽 */}
      <div
        className="rounded-full overflow-hidden relative bg-sand"
        style={{ width: 56, height: totalHeight, border: '2px solid #EDE8E0' }}
      >
        {/* 평상수위 채움 */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-[#B8E8D0]"
          style={{ height: `${normalPct}%` }}
        />
        {/* 상승분 채움 */}
        <div
          className="absolute left-0 right-0 transition-all duration-700"
          style={{
            bottom: `${normalPct}%`,
            height: `${risePct}%`,
            background: colors.marker,
          }}
        />
        {/* 평상수위 점선 */}
        <div
          className="absolute left-0 right-0 border-t-2 border-dashed border-[#5DCAA5]"
          style={{ bottom: `${normalPct}%` }}
        />
        {/* 현재 수위 텍스트 */}
        <div
          className="absolute left-0 right-0 flex items-center justify-center"
          style={{ bottom: `${currentPct}%` }}
        >
          <span
            className="text-[9px] font-bold text-white px-1 rounded"
            style={{ background: colors.marker, whiteSpace: 'nowrap' }}
          >
            {current.toFixed(1)}m
          </span>
        </div>
      </div>

      {/* 범례 */}
      <div className="text-center">
        <div className="text-[11px] font-bold" style={{ color: colors.marker }}>
          {current.toFixed(1)}m
        </div>
        <div className="text-[10px] text-moss">
          {rise > 0 ? `+${rise.toFixed(1)}m` : '평상'}
        </div>
      </div>

      {/* 상태 배지 */}
      <div className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: colors.bg, color: colors.text }}>
        {{ normal: '정상', caution: '주의', warning: '위험', critical: '심각' }[station.status]}
      </div>
    </div>
  )
}
