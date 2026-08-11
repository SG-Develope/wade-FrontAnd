import type { Weather } from '@/types'
import type { AiGuide } from '@/types'
import Icon from '@/components/common/Icon'
import { getSkyEmoji, ACTIVITY_PILLS } from '@/constants/icons'

interface Props {
  weather?: Weather
  guide?: AiGuide
}

export default function TodayCard({ weather, guide }: Props) {
  const emoji = getSkyEmoji(weather?.skyCondition)
  const acts  = guide?.activities

  const pills = ACTIVITY_PILLS.map(p => ({
    ...p,
    ok: acts ? (acts[p.key] ?? true) : true,
  }))

  const allDanger = acts ? Object.values(acts).every(v => !v) : false
  const bg = allDanger ? '#A32D2D' : '#1D9E75'

  return (
    <div className="mx-[14px] mt-[14px] rounded-[14px] p-[14px] transition-colors duration-500 text-white"
      style={{ background: bg }}>
      <div className="flex justify-between items-start mb-[10px]">
        <div className="font-gmarket text-[14px] font-bold leading-[1.4]">
          오늘 강변<br />{allDanger ? '접근하지 마세요' : '이렇게 즐겨요'}
        </div>
        <span className="text-[24px]">{allDanger ? '🚨' : emoji}</span>
      </div>
      <div className="flex flex-wrap gap-[5px]">
        {pills.map(p => (
          <span key={p.label}
            className={`flex items-center gap-[4px] text-[11px] font-semibold px-[10px] py-[4px] rounded-[20px] text-white border-[0.5px] ${p.ok ? 'bg-white/20 border-white/30' : 'bg-danger/30 border-danger/50'}`}>
            <Icon name={p.key} size={13} />
            {p.label} {p.ok ? 'OK' : 'X'}
          </span>
        ))}
      </div>
    </div>
  )
}
