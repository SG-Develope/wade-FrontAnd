import { useMemo, useState } from 'react'
import { useWaterLevels } from '@/queries/useWaterLevelQuery'
import { useWeather } from '@/queries/useWeatherQuery'
import { useAiGuide } from '@/queries/useAiGuideQuery'
import KakaoMap from '@/components/dashboard/KakaoMap'
import ActivityStrip from '@/components/dashboard/ActivityStrip'
import StationModal from '@/components/dashboard/StationModal'
import CctvCard, { type CctvInfo } from '@/components/dashboard/CctvCard'
import CctvModal from '@/components/dashboard/CctvModal'
import useAppStore from '@/stores/appStore'
import type { Station } from '@/types'

const CCTV_BASE: CctvInfo[] = [
  { id: 'yp', name: '양포교',     location: '구미시', level: '-', statusLabel: '낚시하기 좋아요', textColor: '#0F6E56', markerColor: '#1D9E75', stationId: 'yangpo' },
  { id: 'hk', name: '호국의다리', location: '칠곡군', level: '-', statusLabel: '지금은 위험해요', textColor: '#A32D2D', markerColor: '#E24B4A', stationId: 'hoguk'  },
]

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
function getSkyEmoji(sky?: string): string {
  if (!sky) return '🌤️'
  if (sky.includes('맑음')) return '☀️'
  if (sky.includes('구름많음')) return '⛅'
  return '🌥️'
}
function getActivityPills(stations: Station[]) {
  const rank = { normal: 0, caution: 1, warning: 2, critical: 3 }
  const worst = stations.reduce((w, s) =>
    (rank[s.status as keyof typeof rank] ?? 0) > (rank[w as keyof typeof rank] ?? 0) ? s.status : w
  , 'normal')
  const isWarning = worst === 'warning' || worst === 'critical'
  const isCaution = worst === 'caution'
  return [
    { icon: 'ti-walk',     label: '산책',   ok: !isWarning },
    { icon: 'ti-fish',     label: '낚시',   ok: !isWarning },
    { icon: 'ti-bike',     label: '자전거', ok: !isWarning },
    { icon: 'ti-campfire', label: '캠핑',   ok: !isWarning && !isCaution },
  ]
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
  const { data: guide, isLoading: guideLoading } = useAiGuide(stationLevels)
  const hasDanger = stations.some(s => s.status === 'warning' || s.status === 'critical')
  const dangerStation = stations.find(s => s.status === 'warning' || s.status === 'critical')
  const [selectedCctv, setSelectedCctv] = useState<CctvInfo | null>(null)
  const [panelOpen, setPanelOpen] = useState(true)
  const { setSelectedStation } = useAppStore()
  const cctvList: CctvInfo[] = CCTV_BASE.map(base => {
    const station = stations.find(s => s.id === base.stationId)
    if (!station) return base
    return {
      ...base,
      level: `${station.currentLevel.toFixed(1)}m`,
      statusLabel: getStatusLabel(station.status),
      textColor: getValColor(station.status),
      markerColor: getDotColor(station.status),
    }
  })
  const activityPills = getActivityPills(stations)
  const skyEmoji = getSkyEmoji(weather?.skyCondition)
  const statsCounts = {
    total:   stations.length,
    danger:  stations.filter(s => s.status === 'warning' || s.status === 'critical').length,
    caution: stations.filter(s => s.status === 'caution').length,
    normal:  stations.filter(s => s.status === 'normal').length,
  }

  return (
    <div className="flex h-full overflow-hidden">

      {hasDanger && dangerStation && (
        <div className="fixed top-[58px] left-0 right-0 z-30 flex items-center gap-2 px-4 py-2 text-white text-[12px] font-semibold" style={{ background: '#E24B4A' }}>
          <i className="ti ti-alert-triangle text-[14px]" />
          {dangerStation.name} 수위 위험 단계 — 강변 여가 활동을 즉시 중단하고 안전한 곳으로 이동하세요
        </div>
      )}

      {/* ===== LEFT PANEL ===== */}
      <div className="flex-1 flex flex-col overflow-hidden relative" style={{ marginTop: hasDanger ? 36 : 0 }}>
        <div className="flex-1 overflow-hidden">
          <KakaoMap stations={stations} />
        </div>
        <ActivityStrip stations={stations} />

        <div className="bg-white border-t border-pebble px-[18px] py-3 shrink-0">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[10px] text-moss font-bold tracking-[0.05em]">
              <i className="ti ti-video text-[11px] mr-1" style={{ verticalAlign: '-1px' }} />
              CCTV 현장 영상
            </span>
            <span className="text-[9px] bg-river-light text-river px-2 py-0.5 rounded-full">낙동강홍수통제소</span>
          </div>
          <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {cctvList.map(cctv => (
              <div key={cctv.id} style={{ width: 150, flexShrink: 0 }}>
                <CctvCard cctv={cctv} onClick={setSelectedCctv} />
              </div>
            ))}
          </div>
        </div>

        {/* 패널 토글 버튼 */}
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

      {/* ===== RIGHT PANEL ===== */}
      <aside
        style={{
          width: panelOpen ? 280 : 0,
          flexShrink: 0,
          overflow: 'hidden',
          transition: 'width 0.22s ease',
          marginTop: hasDanger ? 36 : 0,
          display: 'flex',
          borderLeft: '0.5px solid #EDE8E0',
          background: '#fff',
        }}
      >
        {/* 내부 고정폭 래퍼 — 애니메이션 중 찌그러짐 방지 */}
        <div className="flex flex-col overflow-y-auto" style={{ width: 280, flex: 1 }}>

          <div className="mx-[14px] mt-[14px] rounded-[14px] p-[14px]" style={{ background: '#1D9E75', color: '#fff' }}>
            <div className="flex justify-between items-start mb-[10px]">
              <div style={{ fontFamily: 'var(--font-brand)', fontSize: 14, fontWeight: 700, lineHeight: 1.4 }}>
                오늘 강변<br />이렇게 즐겨요
              </div>
              <span style={{ fontSize: 24 }}>{skyEmoji}</span>
            </div>
            <div className="flex flex-wrap gap-[5px]">
              {activityPills.map(p => (
                <span key={p.label} className="flex items-center gap-[4px] text-[11px] font-semibold px-[10px] py-[4px] rounded-[20px]"
                  style={{
                    background: p.ok ? 'rgba(255,255,255,0.2)' : 'rgba(226,75,74,0.3)',
                    border: p.ok ? '0.5px solid rgba(255,255,255,0.3)' : '0.5px solid rgba(226,75,74,0.5)',
                    color: '#fff',
                  }}>
                  <i className={`ti ${p.icon}`} style={{ fontSize: 13 }} />
                  {p.label} {p.ok ? 'OK' : 'X'}
                </span>
              ))}
            </div>
          </div>

          <div className="mx-[14px] mt-[14px] rounded-[14px]" style={{ padding: '13px 14px', background: 'linear-gradient(135deg,#F0F9F5,#E8F7EF)', border: '0.5px solid #B8E0CC' }}>
            <div className="flex items-center gap-[6px] mb-[6px]">
              <span className="text-[10px] font-bold px-[8px] py-[2px] rounded-[10px]" style={{ color: '#0F6E56', background: '#D4F0E4' }}>AI 브리핑</span>
              <span className="text-[10px]" style={{ color: '#5C8A4A' }}>{guideLoading ? '분석 중...' : '방금 분석됨'}</span>
            </div>
            <div className="text-[12px] leading-[1.75]" style={{ color: '#2D5A40' }}>
              {guideLoading
                ? <div className="h-4 bg-green-100 rounded animate-pulse" />
                : (guide?.message ?? '수위 데이터를 불러오는 중입니다.')}
            </div>
          </div>

          <div className="mt-[14px]" style={{ padding: '14px 16px', borderBottom: '0.5px solid #F5F0EA' }}>
            <div className="flex justify-between items-center mb-[10px]">
              <span className="text-[10px] text-moss font-bold tracking-[0.05em]">관측소 현황</span>
              <span className="text-[9px] bg-river-light text-river px-2 py-0.5 rounded-full">실시간</span>
            </div>
            {waterLoading
              ? [1,2].map(i => <div key={i} className="h-[38px] bg-sand rounded-lg mb-2 animate-pulse" />)
              : stations.map(station => (
                <div key={station.id} onClick={() => setSelectedStation(station)}
                  className="flex items-center gap-[8px] py-[7px] border-b border-[#F5F0EA] last:border-b-0 cursor-pointer rounded-[8px] pl-1 hover:bg-sand transition-colors">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: getDotColor(station.status) }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-semibold text-soil">{station.name}</div>
                    <div className="text-[10px] text-moss">{station.location} · {getStatusLabel(station.status)}</div>
                  </div>
                  <div className="text-[11px] font-bold shrink-0" style={{ color: getValColor(station.status) }}>
                    {station.currentLevel.toFixed(1)}m
                  </div>
                </div>
              ))
            }
          </div>

          <div style={{ padding: '14px 16px', borderBottom: '0.5px solid #F5F0EA' }}>
            <div className="flex justify-between items-center mb-[10px]">
              <span className="text-[10px] text-moss font-bold tracking-[0.05em]">오늘 날씨</span>
              <span className="text-[9px] bg-river-light text-river px-2 py-0.5 rounded-full">기상청</span>
            </div>
            <div className="grid grid-cols-2 gap-[6px]">
              {[
                { label: '기온',     value: weather ? `${weather.temperature}C` : '-',      sub: weather ? `체감 ${(weather.temperature+2).toFixed(0)}C` : '-' },
                { label: '강수확률', value: weather ? `${weather.rainProbability}%` : '-',   sub: weather?.skyCondition ?? '-' },
                { label: '풍속',     value: weather ? `${weather.windSpeed}m/s` : '-',       sub: weather?.windDirection ?? '-' },
                { label: '습도',     value: weather ? `${weather.humidity}%` : '-',         sub: weather && weather.humidity > 80 ? '높음' : '보통' },
              ].map(item => (
                <div key={item.label} className="rounded-[10px]" style={{ padding: '9px 11px', background: '#F5F0EA' }}>
                  <div className="text-[10px] text-moss mb-[2px]">{item.label}</div>
                  <div className="text-[16px] font-bold text-soil">
                    {weatherLoading ? <span className="inline-block w-10 h-4 bg-pebble rounded animate-pulse" /> : item.value}
                  </div>
                  <div className="text-[9px] mt-[1px]" style={{ color: '#A8B898' }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 mt-auto">
            {[
              { label: '전체', value: statsCounts.total,   sub: '관측소',   color: '#2D3A1F', subColor: '#8A9A7A' },
              { label: '위험', value: statsCounts.danger,  sub: '↑ 상승중',  color: '#A32D2D', subColor: '#A32D2D' },
              { label: '주의', value: statsCounts.caution, sub: '관측중',   color: '#7A4300', subColor: '#EF9F27' },
              { label: '안전', value: statsCounts.normal,  sub: '안전해요', color: '#0F6E56', subColor: '#1D9E75' },
            ].map((item, i) => (
              <div key={item.label} className="p-[12px] text-center"
                style={{
                  borderTop:    '0.5px solid #EDE8E0',
                  borderRight:  i % 2 === 0 ? '0.5px solid #F5F0EA' : 'none',
                  borderBottom: i < 2 ? '0.5px solid #F5F0EA' : 'none',
                }}>
                <div className="text-[10px] text-moss mb-[2px]">{item.label}</div>
                <div className="text-[22px] font-bold leading-none" style={{ color: item.color }}>{item.value}</div>
                <div className="text-[10px] mt-[2px]" style={{ color: item.subColor }}>{item.sub}</div>
              </div>
            ))}
          </div>

        </div>
      </aside>

      <StationModal />
      <CctvModal cctv={selectedCctv} onClose={() => setSelectedCctv(null)} />
    </div>
  )
}
