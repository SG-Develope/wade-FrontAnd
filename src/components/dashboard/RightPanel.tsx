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
  weatherError?: boolean
  guide?: AiGuide
  guideLoading: boolean
  guideError: boolean
  onGuideRetry: () => void
  marginTop?: number
}

export default function RightPanel({
  open, onToggle: _onToggle,
  stations, waterLoading,
  weather, weatherLoading, weatherError,
  guide, guideLoading, guideError, onGuideRetry,
  marginTop = 0,
}: Props) {
  return (
    <aside
      className="shrink-0 overflow-hidden flex bg-white border-l border-pebble"
      style={{
        width: open ? '25%' : 0,
        transition: 'width 0.22s ease',
        marginTop,
      }}
    >
      <div className="flex flex-col overflow-y-auto w-70 flex-1">
        <TodayCard weather={weather} guide={guide} />

        <div className="mx-3.5 mt-3.5">
          <AiBriefingCard
            guide={guide}
            isLoading={guideLoading}
            isError={guideError}
            onRetry={onGuideRetry}
          />
        </div>

        <StationListPanel stations={stations} isLoading={waterLoading} />
        <WeatherPanel weather={weather} isLoading={weatherLoading} isError={weatherError} />
        <StatsPanel stations={stations} />
      </div>
    </aside>
  )
}
