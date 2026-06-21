import type { Station } from '@/types'
import type { Weather } from '@/types'
import type { AiGuide } from '@/types'
import TodayCard from './TodayCard'
import AiBriefingCard from './AiBriefingCard'
import StationListPanel from './StationListPanel'
import WeatherPanel from './WeatherPanel'
import StatsPanel from './StatsPanel'

interface Props {
  open: boolean
  onToggle: () => void
  stations: Station[]
  waterLoading: boolean
  weather?: Weather
  weatherLoading: boolean
  guide?: AiGuide
  guideLoading: boolean
  guideError: boolean
  onGuideRetry: () => void
  marginTop?: number
}

export default function RightPanel({
  open, onToggle: _onToggle,
  stations, waterLoading,
  weather, weatherLoading,
  guide, guideLoading, guideError, onGuideRetry,
  marginTop = 0,
}: Props) {
  return (
    <aside
      style={{
        width: open ? 280 : 0,
        flexShrink: 0,
        overflow: 'hidden',
        transition: 'width 0.22s ease',
        display: 'flex',
        borderLeft: '0.5px solid #EDE8E0',
        background: '#fff',
        marginTop,
      }}
    >
      <div className="flex flex-col overflow-y-auto" style={{ width: 280, flex: 1 }}>
        <TodayCard stations={stations} weather={weather} />

        <div className="mx-[14px] mt-[14px]">
          <AiBriefingCard
            guide={guide}
            isLoading={guideLoading}
            isError={guideError}
            onRetry={onGuideRetry}
          />
        </div>

        <StationListPanel stations={stations} isLoading={waterLoading} />
        <WeatherPanel weather={weather} isLoading={weatherLoading} />
        <StatsPanel stations={stations} />
      </div>
    </aside>
  )
}
