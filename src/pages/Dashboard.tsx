import { useMemo, useState } from 'react'
import { useWaterLevels } from '@/queries/useWaterLevelQuery'
import { useWeather } from '@/queries/useWeatherQuery'
import { useAiGuide } from '@/queries/useAiGuideQuery'
import { useCctvList } from '@/queries/useCctvQuery'
import KakaoMap from '@/components/dashboard/KakaoMap'
import ActivityStrip from '@/components/dashboard/ActivityStrip'
import StationModal from '@/components/dashboard/StationModal'
import CctvModal from '@/components/dashboard/CctvModal'
import DangerBanner from '@/components/dashboard/DangerBanner'
import CctvSection from '@/components/dashboard/CctvSection'
import RightPanel from '@/components/dashboard/RightPanel'
import type { CctvInfo } from '@/components/dashboard/CctvCard'

function getStatusLabel(status: string): string {
  if (status === 'normal')  return '낚시하기 좋아요'
  if (status === 'caution') return '조금 주의하세요'
  if (status === 'warning') return '지금은 위험해요'
  return '매우 위험해요'
}
function getDotColor(status: string): string {
  if (status === 'normal')  return '#5DCAA5'
  if (status === 'caution') return '#EF9F27'
  return '#E24B4A'
}
function getValColor(status: string): string {
  if (status === 'normal')  return '#0F6E56'
  if (status === 'caution') return '#7A4300'
  return '#A32D2D'
}

export default function Dashboard() {
  const { data: waterData, isLoading: waterLoading } = useWaterLevels()
  const { data: weather, isLoading: weatherLoading } = useWeather('yangpo')
  const { data: cctvData } = useCctvList()
  const stations = waterData ?? []

  const stationLevels = useMemo(() => {
    const levels: Record<string, number> = {}
    stations.forEach(s => { levels[s.id] = s.currentLevel })
    return levels
  }, [stations])

  const {
    data: guide,
    isLoading: guideLoading,
    isError: guideError,
    refetch: refetchGuide,
  } = useAiGuide(stationLevels)

  const dangerStation = stations.find(s => s.status === 'warning' || s.status === 'critical')

  const [selectedCctv, setSelectedCctv] = useState<CctvInfo | null>(null)
  const [panelOpen, setPanelOpen]       = useState(true)
  const [bottomOpen, setBottomOpen]     = useState(true)

  const cctvList: CctvInfo[] = (cctvData ?? []).map(base => {
    const station = stations.find(s => s.id === base.stationId)
    const defaults: CctvInfo = {
      id: base.id, name: base.name, location: base.location,
      level: '-', statusLabel: '-', textColor: '#8A9A7A',
      markerColor: '#8A9A7A', stationId: base.stationId,
    }
    if (!station) return defaults
    return {
      ...defaults,
      level:       `${station.currentLevel.toFixed(1)}m`,
      statusLabel: getStatusLabel(station.status),
      textColor:   getValColor(station.status),
      markerColor: getDotColor(station.status),
    }
  })

  return (
    <div className="flex h-full overflow-hidden">

      {dangerStation && (
        <div className="fixed top-[58px] left-0 right-0 z-30">
          <DangerBanner station={dangerStation} />
        </div>
      )}

      <div
        className="flex-1 flex flex-col overflow-hidden relative"
        style={{ marginTop: dangerStation ? 36 : 0 }}
      >
        <div className="flex-1 overflow-hidden relative">
          <KakaoMap stations={stations} />
          <button
            onClick={() => setBottomOpen(o => !o)}
            className="absolute z-20 flex items-center justify-center cursor-pointer transition-colors hover:bg-sand"
            style={{
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 44,
              height: 20,
              background: '#fff',
              border: '0.5px solid #EDE8E0',
              borderBottom: 'none',
              borderRadius: '8px 8px 0 0',
              boxShadow: '0 -2px 8px rgba(0,0,0,0.07)',
            }}
          >
            <i
              className={`ti ti-chevron-${bottomOpen ? 'down' : 'up'} text-moss`}
              style={{ fontSize: 11 }}
            />
          </button>
        </div>

        {bottomOpen && (
          <>
            <CctvSection cctvList={cctvList} onCctvClick={setSelectedCctv} />
          </>
        )}

        <button
          onClick={() => setPanelOpen(p => !p)}
          className="absolute right-0 z-20 flex items-center justify-center cursor-pointer transition-colors hover:bg-sand"
          style={{
            top: '50%',
            transform: 'translateY(-50%)',
            width: 20,
            height: 44,
            background: '#fff',
            border: '0.5px solid #EDE8E0',
            borderRight: 'none',
            borderRadius: '8px 0 0 8px',
            boxShadow: '-2px 0 8px rgba(0,0,0,0.07)',
          }}
        >
          <i
            className={`ti ti-chevron-${panelOpen ? 'right' : 'left'} text-moss`}
            style={{ fontSize: 11 }}
          />
        </button>
      </div>

      <RightPanel
        open={panelOpen}
        onToggle={() => setPanelOpen(p => !p)}
        stations={stations}
        waterLoading={waterLoading}
        weather={weather}
        weatherLoading={weatherLoading}
        guide={guide}
        guideLoading={guideLoading}
        guideError={guideError}
        onGuideRetry={refetchGuide}
        marginTop={dangerStation ? 36 : 0}
      />

      <StationModal />
      <CctvModal cctv={selectedCctv} onClose={() => setSelectedCctv(null)} />
    </div>
  )
}
