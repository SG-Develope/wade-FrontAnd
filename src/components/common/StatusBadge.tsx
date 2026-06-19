import type { WaterStatus } from '@/types'

const CONFIG: Record<WaterStatus, { cls: string; label: string }> = {
  normal:   { cls: 'bg-[#E1F5EE] text-[#0F6E56]', label: '정상' },
  caution:  { cls: 'bg-[#FEF3DC] text-[#7A4300]', label: '주의' },
  warning:  { cls: 'bg-[#FEEEEE] text-[#A32D2D]', label: '위험' },
  critical: { cls: 'bg-[#FEEEEE] text-[#7A1F1F]', label: '심각' },
}

interface Props {
  status: WaterStatus
  size?: 'sm' | 'md'
}

export default function StatusBadge({ status, size = 'md' }: Props) {
  const { cls, label } = CONFIG[status] ?? CONFIG.normal
  const sizeClass = size === 'sm'
    ? 'px-1.5 py-0.5 text-[9px]'
    : 'px-2.5 py-0.5 text-[11px]'

  return (
    <span className={`inline-flex items-center rounded-full font-bold ${cls} ${sizeClass}`}>
      {label}
    </span>
  )
}
