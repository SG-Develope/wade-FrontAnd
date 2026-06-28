import WaterLevelChart from '@/components/trends/WaterLevelChart'
import type { Station, WaterLevelHistory } from '@/types'

interface Props {
  hours: number
  isLoading: boolean
  isError: boolean
  errorMsg?: string
  history: WaterLevelHistory[]
  selectedStationData?: Station
}

export default function WaterLevelChartCard({ hours, isLoading, isError, errorMsg, history, selectedStationData }: Props) {
  return (
    <div className="bg-white border border-pebble rounded-[14px] px-4 py-3.5 shrink-0 grow-0 basis-[58%] min-w-0">
      <div className="flex items-center justify-between text-[10px] text-moss font-bold tracking-[0.04em] mb-2.5">
        수위 변화 그래프
        <span className="text-[9px] bg-river-light text-river px-1.5 py-0.5 rounded-full font-semibold">{hours}시간</span>
      </div>

      {isLoading ? (
        <div className="h-50 bg-sand rounded-lg flex items-center justify-center animate-pulse">
          <span className="text-[12px] text-moss">데이터 로딩 중...</span>
        </div>
      ) : isError ? (
        <div className="h-50 flex flex-col items-center justify-center gap-2">
          <i className="ti ti-alert-circle text-danger text-[28px]" />
          <span className="text-[12px] text-danger font-medium">데이터 로드 실패</span>
          <span className="text-[10px] text-moss opacity-70 text-center px-4">
            {errorMsg ?? '알 수 없는 오류'}
          </span>
        </div>
      ) : history.length > 0 ? (
        <WaterLevelChart
          data={history}
          stationId={selectedStationData?.id ?? ''}
          status={selectedStationData?.status}
          normalLevel={selectedStationData?.normalLevel ?? 1.6}
          cautionLevel={selectedStationData?.cautionLevel ?? 3.5}
          warningLevel={selectedStationData?.warningLevel ?? 5.0}
        />
      ) : (
        <div className="h-50 flex flex-col items-center justify-center gap-2">
          <i className="ti ti-chart-bar-off text-pebble text-[28px]" />
          <span className="text-[12px] text-moss font-medium">수위 이력 데이터 없음</span>
          <span className="text-[10px] text-moss opacity-70 text-center px-4">
            HRFCO 센서 데이터는 실시간 수집 후 제공됩니다.<br />잠시 후 다시 확인해 주세요.
          </span>
        </div>
      )}
    </div>
  )
}
