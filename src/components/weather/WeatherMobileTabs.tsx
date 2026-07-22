import { useState } from 'react'
import {
  useShortForecast,
  useWeatherAlerts,
  useRadarComposite,
  useSatelliteImage,
} from '@/queries/useWeatherQuery'
import { RadarViewer, TyphoonPanel } from './RadarGrid'
import ShortForecastCard from './ShortForecastCard'
import AlertsCard from './AlertsCard'
import TyphoonCard from './TyphoonCard'

type TabKey = 'radar' | 'satellite' | 'typhoon'

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'radar',     label: '강수레이더', icon: 'ti-cloud-rain' },
  { key: 'satellite', label: '위성영상',   icon: 'ti-satellite' },
  { key: 'typhoon',   label: '태풍정보',   icon: 'ti-tornado' },
]

interface Props {
  regionId: string
  areaKeyword: string
  className?: string
}

export default function WeatherMobileTabs({ regionId, areaKeyword, className = '' }: Props) {
  const [tab, setTab] = useState<TabKey>('radar')

  const { data: radar,     isLoading: radarLoading } = useRadarComposite()
  const { data: satellite, isLoading: satLoading }   = useSatelliteImage()
  const {
    data: shortFcst = [],
    isLoading: shortLoading,
    isError: shortError,
    error: shortErrorObj,
    isPlaceholderData: shortSwitching,
  } = useShortForecast(regionId)
  const { data: allAlerts = [], isLoading: alertsLoading } = useWeatherAlerts()

  const alerts = allAlerts.filter((a: any) => !a.area || a.area.includes(areaKeyword))

  return (
    <div className={`flex flex-col flex-1 overflow-hidden ${className}`}>
      {/* 탭 바 */}
      <div className="flex border-b border-pebble bg-white shrink-0">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-[12px] font-semibold border-b-2 transition-colors ${
              tab === t.key ? 'border-river text-river' : 'border-transparent text-moss'
            }`}
          >
            <i className={`ti ${t.icon} text-[14px]`} />
            {t.label}
          </button>
        ))}
      </div>

      {/* 탭 내용 */}
      <div className="flex-1 overflow-y-auto px-4 py-3 bg-sand space-y-3">
        {tab === 'radar' && (
          <>
            <div className="flex">
              <RadarViewer
                label="강수 레이더"
                icon="ti-cloud-rain"
                imageUrl={radar?.imageUrl}
                isLoading={radarLoading}
                fallbackLink="https://www.weather.go.kr/w/obs-climate/land/radar.do"
              />
            </div>
            <div className="flex h-[300px]">
              <ShortForecastCard items={shortFcst} isLoading={shortLoading || shortSwitching} isError={shortError} error={shortErrorObj} />
            </div>
            <div className="flex h-[300px]">
              <AlertsCard alerts={alerts} isLoading={alertsLoading} />
            </div>
          </>
        )}

        {tab === 'satellite' && (
          <>
            <div className="flex">
              <RadarViewer
                label="위성 영상"
                icon="ti-satellite"
                imageUrl={satellite?.imageUrl}
                isLoading={satLoading}
                fallbackLink="https://www.weather.go.kr/w/obs-climate/weather-station/satellite.do"
              />
            </div>
            <div className="flex h-[300px]">
              <ShortForecastCard items={shortFcst} isLoading={shortLoading || shortSwitching} isError={shortError} error={shortErrorObj} />
            </div>
            <div className="flex h-[300px]">
              <AlertsCard alerts={alerts} isLoading={alertsLoading} />
            </div>
          </>
        )}

        {tab === 'typhoon' && (
          <>
            <div className="flex">
              <TyphoonPanel />
            </div>
            <div className="flex h-[300px]">
              <TyphoonCard />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
