import type { Station } from '@/types'
import { STATUS_COLORS } from '@/constants/stations'

interface Props {
  station: Station
}

export default function LeveeSection({ station }: Props) {
  const normal   = station.normalLevel    ?? 1.6
  const caution  = station.cautionLevel   ?? 3.5
  const warning  = station.warningLevel   ?? 5.0
  const critical = station.criticalLevel  ?? 6.5
  const design   = station.designFloodLevel ?? 6.5
  const current  = station.currentLevel   ?? normal

  const colors = STATUS_COLORS[station.status] ?? STATUS_COLORS.normal

  const W = 320, H = 140
  const padL = 40, padR = 20, padB = 20, padT = 10
  const chartH = H - padB - padT
  const chartW = W - padL - padR

  const toY = (m: number) => padT + chartH - (m / design) * chartH
  const currentY = toY(current)

  const levelLines = [
    { level: normal,   color: '#5DCAA5', label: '평상', dash: '4 2' },
    { level: caution,  color: '#EF9F27', label: '주의', dash: '4 2' },
    { level: warning,  color: '#E24B4A', label: '위험', dash: '4 2' },
    { level: critical, color: '#7A1F1F', label: '심각', dash: '4 2' },
  ]

  return (
    <div>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }} preserveAspectRatio="xMidYMid meet">
        {/* 배경 그리드 */}
        {[0, 0.25, 0.5, 0.75, 1].map(pct => {
          const y = padT + chartH * pct
          return (
            <line key={pct} x1={padL} x2={W - padR} y1={y} y2={y}
              stroke="#EDE8E0" strokeWidth={0.5} />
          )
        })}

        {/* 강 바닥 */}
        <rect x={padL} y={padT + chartH} width={chartW} height={6} fill="#C4A882" rx={2} />

        {/* 수위 채움 */}
        <rect
          x={padL} y={toY(current)}
          width={chartW} height={padT + chartH - toY(current)}
          fill={colors.marker} opacity={0.25} rx={2}
        />

        {/* 평상수위 채움 */}
        <rect
          x={padL} y={toY(normal)}
          width={chartW} height={padT + chartH - toY(normal)}
          fill="#5DCAA5" opacity={0.15} rx={2}
        />

        {/* 경보 기준선 */}
        {levelLines.map(({ level, color, label, dash }) => {
          const y = toY(level)
          if (y < padT || y > padT + chartH) return null
          return (
            <g key={label}>
              <line x1={padL} x2={W - padR} y1={y} y2={y}
                stroke={color} strokeWidth={1} strokeDasharray={dash} />
              <text x={padL - 4} y={y + 3} fontSize={8} fill={color}
                textAnchor="end" fontWeight={700}>
                {label}
              </text>
            </g>
          )
        })}

        {/* 현재 수위 선 */}
        <line x1={padL} x2={W - padR} y1={currentY} y2={currentY}
          stroke={colors.marker} strokeWidth={2} />
        <text x={W - padR + 4} y={currentY + 4} fontSize={9} fill={colors.marker}
          fontWeight={700}>
          {current.toFixed(1)}m
        </text>

        {/* Y축 레이블 */}
        {[0, design / 2, design].map(m => {
          const y = toY(m)
          return (
            <text key={m} x={padL - 6} y={y + 3} fontSize={8} fill="#8A9A7A" textAnchor="end">
              {m.toFixed(0)}m
            </text>
          )
        })}

        {/* 제방 */}
        <polygon
          points={`${padL},${padT} ${padL - 10},${padT + chartH} ${padL},${padT + chartH}`}
          fill="#8A9A7A" opacity={0.5}
        />
        <polygon
          points={`${W - padR},${padT} ${W - padR + 10},${padT + chartH} ${W - padR},${padT + chartH}`}
          fill="#8A9A7A" opacity={0.5}
        />
      </svg>

      {/* 요약 */}
      <div className="flex gap-4 mt-2 text-[11px]">
        <div>
          <span className="text-moss">현재 수위: </span>
          <span className="font-bold" style={{ color: colors.marker }}>{current.toFixed(2)}m</span>
        </div>
        <div>
          <span className="text-moss">홍수위까지: </span>
          <span className="font-bold text-soil">{(design - current).toFixed(2)}m 여유</span>
        </div>
        <div>
          <span className="text-moss">평상 대비: </span>
          <span className="font-bold" style={{ color: current > normal ? colors.marker : '#1D9E75' }}>
            {current > normal ? '+' : ''}{(current - normal).toFixed(2)}m
          </span>
        </div>
      </div>
    </div>
  )
}
