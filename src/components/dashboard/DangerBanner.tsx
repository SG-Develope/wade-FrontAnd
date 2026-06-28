import type { Station } from '@/types'
import Icon, { type IconName } from '@/components/common/Icon'

interface Props {
  station: Station | undefined
}

const LEVEL_CONFIG: Record<string, { bg: string; text: string; border: string; icon: IconName; label: string; message: (name: string) => string } | null> = {
  normal: null,
  attention: {
    bg: '#EBF4FF', text: '#1A5C8A', border: '#4A90C4', icon: 'attention', label: '관심',
    message: (name) => `${name} 수위 관심 단계 — 수위 변화를 모니터링 중입니다`,
  },
  caution: {
    bg: '#FEF3DC', text: '#7A4300', border: '#EF9F27', icon: 'caution', label: '주의',
    message: (name) => `${name} 수위 주의 단계 — 강변 활동 시 수위 변화를 주의 깊게 확인하세요`,
  },
  warning: {
    bg: '#FEEEEE', text: '#A32D2D', border: '#E24B4A', icon: 'warning', label: '위험',
    message: (name) => `${name} 수위 위험 단계 — 강변 여가 활동을 즉시 중단하고 안전한 곳으로 이동하세요`,
  },
  critical: {
    bg: '#7A1F1F', text: '#fff', border: '#7A1F1F', icon: 'critical', label: '심각',
    message: (name) => `${name} 수위 심각 단계 — 즉시 대피하세요. 인명 피해 위험이 있습니다`,
  },
}

export default function DangerBanner({ station }: Props) {
  if (!station || station.status === 'normal') return null
  const config = LEVEL_CONFIG[station.status as keyof typeof LEVEL_CONFIG]
  if (!config) return null

  return (
    <div
      className="flex items-center gap-2 px-4 py-2 text-[12px] font-semibold shrink-0 z-10"
      style={{ background: config.bg, color: config.text, borderBottom: `1px solid ${config.border}` }}
    >
      <Icon name={config.icon} size={14} className="shrink-0" />
      <span
        className="text-[9px] font-bold px-1.5 py-0.5 rounded-md mr-0.5 shrink-0"
        style={{ background: config.border, color: '#fff' }}
      >
        {config.label}
      </span>
      <span>{config.message(station.name)}</span>
    </div>
  )
}
