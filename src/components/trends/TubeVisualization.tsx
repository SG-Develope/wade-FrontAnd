interface Props {
  level: number
  normalLevel: number
  cautionLevel: number
  warningLevel: number
  criticalLevel: number
  label?: string
}

function getFill(level: number, normalLevel: number, cautionLevel: number, warningLevel: number) {
  if (level >= warningLevel) return '#E24B4A'
  if (level >= cautionLevel) return '#EF9F27'
  if (level >= normalLevel)  return '#4A90C4'
  return '#5DCAA5'
}

export default function TubeVisualization({
  level, normalLevel, cautionLevel, warningLevel, label
}: Props) {
  if (level == null || cautionLevel == null) return null

  const maxDisplay = cautionLevel
  const fillPct = Math.min((level / maxDisplay) * 100, 100)
  const fill = getFill(level, normalLevel, cautionLevel, warningLevel)

  const TUBE_H = 160
  const TUBE_W = 44

  // 현재 수위 점선 위치 (튜브 상단 기준 top)
  const currentTop = TUBE_H - (fillPct / 100) * TUBE_H

  return (
    <div className="flex flex-col items-center gap-1.5" style={{ minWidth: 80 }}>
      {label && (
        <span className="text-[11px] text-[#1a1a1a] font-bold text-center leading-tight">{label}</span>
      )}

      {/* 튜브 + 범례 */}
      <div className="relative" style={{ width: TUBE_W + 36, height: TUBE_H }}>

        {/* 최대 높이 (상단) */}
        <div className="absolute flex items-center gap-0.5" style={{ top: 0, left: TUBE_W }}>
          <div className="w-2 border-t border-dashed border-[#999]" />
          <span className="text-[8px] font-semibold text-[#555] whitespace-nowrap">{maxDisplay.toFixed(1)}m</span>
        </div>

        {/* 현재 수위 점선 */}
        <div className="absolute flex items-center gap-0.5" style={{ top: currentTop, left: TUBE_W }}>
          <div className="w-2 border-t-2 border-dashed" style={{ borderColor: fill }} />
          <span className="text-[8px] font-bold whitespace-nowrap" style={{ color: fill }}>
            {level.toFixed(2)}m
          </span>
        </div>

        {/* 튜브 본체 */}
        <div
          className="absolute left-0 rounded-b-2xl rounded-t-xl overflow-hidden border-2 border-[#C8C0B4] bg-[#EDEBE6]"
          style={{ width: TUBE_W, height: TUBE_H }}
        >
          <div
            className="absolute left-0 right-0 bottom-0 transition-all duration-700"
            style={{ height: `${fillPct}%`, background: fill }}
          />
        </div>
      </div>

      {/* 하단 수치 범례 */}
      <div className="flex flex-col gap-0.5 mt-1 w-full">
        {[
          { level: warningLevel, color: '#E24B4A', label: '위험' },
          { level: cautionLevel, color: '#EF9F27', label: '주의' },
          { level: normalLevel,  color: '#4A90C4', label: '관심' },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
              <span className="text-[9px] font-semibold text-[#333]">{item.label}</span>
            </div>
            <span className="text-[9px] font-bold text-[#111]">{item.level}m</span>
          </div>
        ))}
      </div>
    </div>
  )
}
