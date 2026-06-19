import { useMemo, useState } from 'react'
import { useWaterLevels } from '@/queries/useWaterLevelQuery'
import { useWeather } from '@/queries/useWeatherQuery'
import { useAiGuide } from '@/queries/useAiGuideQuery'
import KakaoMap from '@/components/dashboard/KakaoMap'
import WeatherCard from '@/components/dashboard/WeatherCard'
import AiBriefingCard from '@/components/dashboard/AiBriefingCard'
import ActivityStrip from '@/components/dashboard/ActivityStrip'
import StationModal from '@/components/dashboard/StationModal'
import CctvCard, { type CctvInfo } from '@/components/dashboard/CctvCard'
import CctvModal from '@/components/dashboard/CctvModal'
import StatusDot from '@/components/common/StatusDot'
import type { WaterStatus } from '@/types'
import useAppStore from '@/stores/appStore'

const CCTV_LIST: CctvInfo[] = [
  { id: 'hg', name: '황강교', location: '합천군', level: '6.2m', statusLabel: '지금은 위험해요', textColor: '#A32D2D', markerColor: '#E24B4A', stationId: 'hoguk' },
  { id: 'mk', name: '묵계교', location: '안동시', level: '4.8m', statusLabel: '조금 주의하세요', textColor: '#7A4300', markerColor: '#EF9F27', stationId: 'hoguk' },
  { id: 'yp', name: '양포교', location: '구미시', level: '1.9m', statusLabel: '낚시하기 좋아요', textColor: '#0F6E56', markerColor: '#1D9E75', stationId: 'yangpo' },
  { id: 'gp', name: '구포대교', location: '부산시', level: '3.7m', statusLabel: '조금 주의하세요', textColor: '#7A4300', markerColor: '#EF9F27', stationId: 'hoguk' },
]

const STATUS_LABEL: Record<string, string> = {
  normal: '안전', caution: '주의', warning: '위험', critical: '심각',
}
const STATUS_TEXT_COLOR: Record<string, string> = {
  normal: '#0F6E56', caution: '#7A4300', warning: '#A32D2D', critical: '#7A1F1F',
}

export default function Dashboard() {
  const { data: waterData, isLoading: waterLoading } = useWaterLevels()
  const { data: weather, isLoading: weatherLoading } = useWeather()

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
    refetch: retryGuide,
  } = useAiGuide(stationLevels)

  const hasDanger = stations.some(s => s.status === 'warning' || s.status === 'critical')
  const lastUpdated = stations[0]?.measuredAt
  const [selectedCctv, setSelectedCctv] = useState<CctvInfo | null>(null)
  const { setSelectedStation } = useAppStore()

  // 활동 가능 여부 (모든 관측소 정상이면 OK)
  const allSafe = stations.every(s => s.status === 'normal')
  const anyCaution = stations.some(s => s.status === 'caution')
  const anyDanger = stations.some(s => s.status === 'warning' || s.status === 'critical')

  const activityPills = [
    { icon: 'ti-walk',     label: '산책',   ok: true },
    { icon: 'ti-fish',     label: '낚시',   ok: !anyDanger },
    { icon: 'ti-bike',     label: '자전거', ok: !anyDanger },
    { icon: 'ti-tent',     label: '캠핑',   ok: !anyCaution && !anyDanger },
  ]

  const countByStatus = {
    total: stations.length,
    danger: stations.filter(s => s.status === 'warning' || s.status === 'critical').length,
    caution: stations.filter(s => s.status === 'caution').length,
    safe: stations.filter(s => s.status === 'normal').length,
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* ─── 왼쪽 ─── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {hasDanger && (
          <div className="flex items-center gap-2 px-4 py-2 bg-danger text-white text-[12px] font-semibold shrink-0">
            <i className="ti ti-alert-triangle text-[14px]" />
            낙동강 수위 위험 단계 — 강변 여가 활동을 즉시 중단하고 안전한 곳으로 이동하세요
          </div>
        )}

        {/* 지도 */}
        <div className="flex-1 overflow-hidden">
          <KakaoMap stations={stations} />
        </div>

        {/* 여가 활동 스트립 */}
        <ActivityStrip stations={stations} />

        {/* CCTV 섹션 */}
        <div className="bg-white border-t border-pebble px-[18px] py-3 shrink-0">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[10px] text-moss font-bold tracking-[0.05em]">
              <i className="ti ti-video text-[11px] mr-1" style={{ verticalAlign: '-1px' }} />
              CCTV 현장 영상
            </span>
            <span className="text-[9px] bg-river-light text-river px-2 py-0.5 rounded-full">낙동강홍수통제소</span>
          </div>
          <div className="grid gap-2" style=