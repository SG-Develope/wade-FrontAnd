import type { Station } from '@/types'
import StationCard from './StationCard'

interface Props {
  stations: Station[]
  isLoading: boolean
}

export default function StationListPanel({ stations, isLoading }: Props) {
  return (
    <div className="mt-[14px]" style={{ padding: '14px 16px', borderBottom: '0.5px solid #F5F0EA' }}>
      <div className="flex justify-between items-center mb-[10px]">
        <span className="text-[10px] text-moss font-bold tracking-[0.05em]">관측소 현황</span>
        <span className="text-[9px] bg-river-light text-river px-2 py-0.5 rounded-full">실시간</span>
      </div>
      {isLoading
        ? [1, 2].map(i => <div key={i} className="h-[48px] bg-sand rounded-lg mb-2 animate-pulse" />)
        : stations.map(station => <StationCard key={station.id} station={station} />)
      }
    </div>
  )
}
