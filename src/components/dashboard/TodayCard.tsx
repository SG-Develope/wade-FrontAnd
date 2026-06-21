import type { Station } from '@/types'
import type { Weather } from '@/types'

interface Props {
  stations: Station[]
  weather?: Weather
}

function getSkyEmoji(sky?: string): string {
  if (!sky) return '🌤️'
  if (sky.includes('맑음')) return '☀️'
  if (sky.includes('구름많음')) return '⛅'
  return '🌥️'
}

function getActivityPills(stations: Station[]) {
  const rank = { normal: 0, caution: 1, warning: 2, critical: 3 }
  const worst = stations.reduce((w, s) =>
    (rank[s.status as keyof typeof rank] ?? 0) > (rank[w as keyof typeof rank] ?? 0) ? s.status : w
  , 'normal')
  const isWarning = worst === 'warning' || worst === 'critical'
  const isCaution = worst === 'caution'
  return [
    { icon: 'ti-walk',     label: '산책',   ok: !isWarning },
    { icon: 'ti-fish',     label: '낚시',   ok: !isWarning },
    { icon: 'ti-bike',     label: '자전거', ok: !isWarning },
    { icon: 'ti-campfire', label: '캠핑',   ok: !isWarning && !isCaution },
  ]
}

export default function TodayCard({ stations, weather }: Props) {
  const pills = getActivityPills(stations)
  const emoji = getSkyEmoji(weather?.skyCondition)

  return (
    <div className="mx-[14px] mt-[14px] rounded-[14px] p-[14px]" style={{ background: '#1D9E75', color: '#fff' }}>
      <div className="flex justify-between items-start mb-[10px]">
        <div style={{ fontFamily: 'var(--font-gmarket)', fontSize: 14, fontWeight: 700, lineHeight: 1.4 }}>
          오늘 강변<br />이렇게 즐겨요
        </div>
        <span style={{ fontSize: 24 }}>{emoji}</span>
      </div>
      <div className="flex flex-wrap gap-[5px]">
        {pills.map(p => (
          <span key={p.label}
            className="flex items-center gap-[4px] text-[11px] font-semibold px-[10px] py-[4px] rounded-[20px]"
            style={{
              background: p.ok ? 'rgba(255,255,255,0.2)' : 'rgba(226,75,74,0.3)',
              border: p.ok ? '0.5px solid rgba(255,255,255,0.3)' : '0.5px solid rgba(226,75,74,0.5)',
              color: '#fff',
            }}>
            <i className={`ti ${p.icon}`} style={{ fontSize: 13 }} />
            {p.label} {p.ok ? 'OK' : 'X'}
          </span>
        ))}
      </div>
    </div>
  )
}
