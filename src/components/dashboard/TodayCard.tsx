import type { Weather } from '@/types'
import type { AiGuide } from '@/types'

interface Props {
  weather?: Weather
  guide?: AiGuide
}

function getSkyEmoji(sky?: string): string {
  if (!sky) return '🌤️'
  if (sky.includes('맑음')) return '☀️'
  if (sky.includes('구름많음')) return '⛅'
  return '🌥️'
}

const ACTIVITY_PILLS = [
  { key: 'walking', icon: 'ti-walk',     label: '산책' },
  { key: 'fishing', icon: 'ti-fish',     label: '낚시' },
  { key: 'cycling', icon: 'ti-bike',     label: '자전거' },
  { key: 'camping', icon: 'ti-campfire', label: '캠핑' },
] as const

export default function TodayCard({ weather, guide }: Props) {
  const emoji = getSkyEmoji(weather?.skyCondition)
  const acts  = guide?.activities

  // activities 없으면 기본 true (로딩 중)
  const pills = ACTIVITY_PILLS.map(p => ({
    ...p,
    ok: acts ? (acts[p.key] ?? true) : true,
  }))

  const allDanger = acts ? Object.values(acts).every(v => !v) : false
  const bg = allDanger ? '#A32D2D' : '#1D9E75'

  return (
    <div className="mx-[14px] mt-[14px] rounded-[14px] p-[14px] transition-colors duration-500"
      style={{ background: bg, color: '#fff' }}>
      <div className="flex justify-between items-start mb-[10px]">
        <div style={{ fontFamily: 'var(--font-gmarket)', fontSize: 14, fontWeight: 700, lineHeight: 1.4 }}>
          오늘 강변<br />{allDanger ? '접근하지 마세요' : '이렇게 즐겨요'}
        </div>
        <span style={{ fontSize: 24 }}>{allDanger ? '🚨' : emoji}</span>
      </div>
      <div className="flex flex-wrap gap-[5px]">
        {pills.map(p => (
          <span key={p.label}
            className="flex items-center gap-[4px] text-[11px] font-semibold px-[10px] py-[4px] rounded-[20px]"
            style={{
              background: p.ok ? 'rgba(255,255,255,0.2)' : 'rgba(226,75,74,0.3)',
              border:     p.ok ? '0.5px solid rgba(255,255,255,0.3)' : '0.5px solid rgba(226,75,74,0.5)',
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
