import { useState } from 'react'
import { useWaterLevels, useWaterLevelHistory } from '@/queries/useWaterLevelQuery'
import StationHoursSelector from '@/components/trends/StationHoursSelector'
import WaterLevelChartCard from '@/components/trends/WaterLevelChartCard'
import LeveeSectionCard from '@/components/trends/LeveeSectionCard'
import HistoryTable from '@/components/trends/HistoryTable'
import TrendsSidebar from '@/components/trends/TrendsSidebar'

export default function Trends() {
  const [selectedStation, setSelectedStation] = useState('yangpo')
  const [hours, setHours] = useState(24)

  const { data: waterData, isLoading: waterLoading } = useWaterLevels()
  const { data: historyData, isLoading: historyLoading, isError: historyError, error: historyErrorObj } = useWaterLevelHistory(selectedStation, hours)

  const stations = waterData ?? []
  const selectedStationData = stations.find(s => s.id === selectedStation)
  const history = historyData ?? []

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-y-auto lg:overflow-hidden">
      {/* 메인 콘텐츠 */}
      <div className="lg:flex-1 lg:overflow-y-auto px-5 py-5 bg-white">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <div className="text-[14px] font-bold text-soil flex items-center gap-1.5" style={{ fontFamily: 'var(--font-gmarket)' }}>
              <i className="ti ti-chart-line text-river" />
              수위 추이
            </div>
            <div className="text-[10px] text-moss mt-0.5">관측소별 수위 변화 · 직관 시각화</div>
          </div>
        </div>

        <StationHoursSelector
          selectedStation={selectedStation}
          hours={hours}
          onStationChange={setSelectedStation}
          onHoursChange={setHours}
        />

        <div className="flex flex-col lg:flex-row gap-3 mb-3">
          <WaterLevelChartCard
            hours={hours}
            isLoading={historyLoading}
            isError={historyError}
            errorMsg={(historyErrorObj as any)?.message}
            history={history}
            selectedStationData={selectedStationData}
          />
          {/* 제방 단면: 모바일 숨김 (lg:contents로 데스크탑 폭 유지) */}
          {selectedStationData && (
            <div className="hidden lg:contents">
              <LeveeSectionCard station={selectedStationData} />
            </div>
          )}
        </div>

        <HistoryTable
          history={history}
          isLoading={historyLoading}
          selectedStationData={selectedStationData}
        />
      </div>

      <TrendsSidebar stations={stations} isLoading={waterLoading} />
    </div>
  )
}
