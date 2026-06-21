import type { Station } from '@/types'

interface Props {
  station: Station | undefined
}

export default function DangerBanner({ station }: Props) {
  if (!station) return null
  return (
    <div className="flex items-center gap-2 px-4 py-2 text-white text-[12px] font-semibold shrink-0 z-10"
      style={{ background: '#E24B4A' }}>
      <i className="ti ti-alert-triangle text-[14px] shrink-0" />
      <span>{station.name} 수위 위험 단계 — 강변 여가 활동을 즉시 중단하고 안전한 곳으로 이동하세요</span>
    </div>
  )
}
