import LeveeSection from '@/components/trends/LeveeSection'
import StatusBadge from '@/components/common/StatusBadge'
import type { Station } from '@/types'

interface Props {
  station: Station
}

export default function LeveeSectionCard({ station }: Props) {
  return (
    <div className="bg-white border border-pebble rounded-[14px] px-4 py-3.5 shrink-0 grow-0 basis-[42%] min-w-0">
      <div className="flex items-center justify-between text-[10px] text-moss font-bold tracking-[0.04em] mb-2.5">
        제방 단면
        <StatusBadge status={station.status} size="sm" />
      </div>
      <LeveeSection station={station} />
    </div>
  )
}
