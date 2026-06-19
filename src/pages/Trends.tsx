import { useState } from 'react'
import { useWaterLevels } from '@/queries/useWaterLevelQuery'
import { useWaterLevelHistory } from '@/queries/useWaterLevelQuery'
import WaterLevelChart from '@/components/trends/WaterLevelChart'
import TubeVisualization from '@/components/trends/TubeVisualization'
import LeveeSection from '@/components/trends/LeveeSection'
import StatusBadge from '@/components/common/StatusBadge'

const STATIONS_META = [
  { id: 'yangpo', label: '양포교', color: '#1D9E75' },
  { id: 'hoguk',  label: '호국의다리', color: '#4A90C4' },
]
const HOURS_OPTIONS = [6, 12, 24, 48]

const STATUS_COLOR = {
  normal: '#1D9E75', caution: '#EF9F27', warning: '#E24B4A', critical: '#7A1F1F',
}

export default function Trends() {
  const [selectedStation, setSelectedStation] = useState('yangpo')
  const [hours, setHours] = useState(24)

  const { data: waterData, isLoading: waterLoading } = useWaterLevels()
  const { data: historyData, isLoading: historyLoading } = useWaterLevelHistory(selectedStation, hours)

  // useWaterLevels() returns Station[] directly
  const stations = waterData ?? []
  const selectedStationData = stations.find(s => s.id === selectedStation)

  // useWaterLevelHistory() returns WaterLevelHistory[] directly
  const history = historyData ?? []

  return (
    <div className="flex h-full overflow-hidden">
      {/* ─── 메인 콘텐츠 ─── */}
      <div className="flex-1 overflow-y-auto px-5 py-5 bg-white">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <div
              className="text-[14px] font-bold text-soil flex items-center gap-1.5"
              style={{ fontFamily: 'var(--font-gmarket)' }}
            >
              <i className="ti ti-chart-line text-river" />
              수위 추이
            </div>
            <div className="text-[10px] text-moss mt-0.5">관측소별 수위 변화 · 직관 시각화</div>
          </div>
        </div>

        {/* 관측소 선택 + 기간 선택 */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
          {STATIONS_META.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedStation(s.id)}
              className="flex items-center gap-1 text-[11px] px-3 py-1 rounded-full cursor-pointer border transition-all duration-150"
              style={{
                borderColor: selectedStation === s.id ? s.color : '#EDE8E0',
                background: selectedStation === s.id ? s.color : '#fff',
                color: selectedStation === s.id ? '#fff' : '#8A9A7A',
                fontWeight: 500,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: selectedStation === s.id ? '#fff' : s.color }}
              />
              {s.label}
            </button>
          ))}
          <div className="ml-auto flex gap-1">
            {HOURS_OPTIONS.map(h => (
              <button
                key={h}
                onClick={() => setHours(h)}
                className={`text-[11px] px-2.5 py-1 rounded-full border border-pebble cursor-pointer transition-colors ${
                  hours === h ? 'bg-sand text-soil font-semibold' : 'bg-white text-moss'
                }`}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>

        {/* 수위 그래프 */}
        <div className="bg-white border border-pebble rounded-[14px] px-4 py-3.5 mb-3">
          <div className="flex items-center justify-between text-[10px] text-moss font-bold tracking-[0.04em] mb-2.5">
            수위 변화 그래프
            <span className="text-[9px] bg-river-light text-river px-1.5 py-0.5 rounded-full font-semibold">{hours}시간</span>
          </div>
          {historyLoading ? (
            <div className="h-[200px] bg-sand rounded-lg flex items-center justify-center animate-pulse">
              <span className="text-[12px] text-moss">데이터 로딩 중...</span>
            </div>
          ) : history.length > 0 ? (
            <WaterLevelChart
              data={history}
              stationId={selectedStation}
              normalLevel={selectedStationData?.normalLevel ?? 1.6}
              cautionLevel={selectedStationData?.cautionLevel ?? 3.5}
              warningLevel={selectedStationData?.warningLevel ?? 5.0}
            />
          ) : (
            <div className="h-[200px] flex items-center justify-center">
              <span className="text-[12px] text-moss">수위 이력 데이터가 없습니다.</span>
            </div>
          )}
        </div>

        {/* 제방 단면도 */}
        {selectedStationData && (
          <div className="bg-white border border-pebble rounded-[14px] px-4 py-3.5 mb-3">
            <div className="flex items-center justify-between text-[10px] text-moss font-bold tracking-[0.04em] mb-2.5">
              제방 단면 — 계획홍수위 대비
              <StatusBadge status={selectedStationData.status} size="sm" />
            </div>
            <LeveeSection station={selectedStationData} />
          </div>
        )}

        {/* 최근 이력 테이블 */}
        <div className="bg-white border border-pebble rounded-[14px] px-4 py-3.5">
          <div className="text-[10px] text-moss font-bold tracking-[0.04em] mb-2.5">최근 관측 이력</div>
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr>
                {['시각', '수위', '상태', '평상 대비'].map(h => (
                  <th key={h} className="text-[10px] text-moss font-bold px-2 py-1.5 border-b border-pebble text-left tracking-[0.03em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.slice(-12).reverse().map((point, i) => {
                const normal = selectedStationData?.normalLevel ?? 1.6
                const diff = point.level - normal
                const diffColor = diff > 0.5 ? '#E24B4A' : diff > 0 ? '#EF9F27' : '#1D9E75'
                return (
                  <tr key={i}>
                    <td className="px-2 py-1.5 border-b border-[#F5F0EA] text-moss">
                      {new Date(point.measuredAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-2 py-1.5 border-b border-[#F5F0EA] font-semibold">{point.level.toFixed(2)}m</td>
                    <td className="px-2 py-1.5 border-b border-[#F5F0EA]">
                      <StatusBadge status={point.status} size="sm" />
                    </td>
                    <td className="px-2 py-1.5 border-b border-[#F5F0EA] font-semibold" style={{ color: diffColor }}>
                      {diff > 0 ? '+' : ''}{diff.toFixed(2)}m
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── 오른쪽 사이드 ─── */}
      <div className="w-[308px] bg-white border-l border-pebble overflow-y-auto flex flex-col shrink-0">
        {/* 튜브 시각화 */}
        <div className="px-4 py-3.5 border-b border-[#F5F0EA]">
          <div className="text-[10px] text-moss font-bold tracking-[0.05em] mb-3">수위 직관 시각화</div>
          {waterLoading ? (
            <div className="h-[200px] bg-sand rounded-lg animate-pulse" />
          ) : (
            <div className="flex justify-around py-2">
              {stations.map(s => <TubeVisualization key={s.id} station={s} />)}
            </div>
          )}
        </div>

        {/* 현재 수위 바 */}
        <div className="px-4 py-3.5 border-b border-[#F5F0EA]">
          <div className="text-[10px] text-moss font-bold tracking-[0.05em] mb-2.5">현재 수위</div>
          {stations.map(s => {
            const design = s.designFloodLevel ?? 8
            const pct = Math.min((s.currentLevel / design) * 100, 100)
            const c = STATUS_COLOR[s.status] ?? STATUS_COLOR.normal
            return (
              <div key={s.id} className="mb-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-soil">{s.name}</span>
                  <span className="text-[11px] font-bold" style={{ color: c }}>{s.currentLevel.toFixed(2)}m</span>
                </div>
                <div className="h-2 bg-pebble rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: c }} />
                </div>
                <div className="flex justify-between mt-0.5 text-[9px] text-moss">
                  <span>0m</span><span>{design}m (홍수위)</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* 경보 기준 */}
        <div className="px-4 py-3.5">
          <div className="text-[10px] text-moss font-bold tracking-[0.05em] mb-2.5">경보 단계 기준</div>
          {stations.map(s => (
            <div key={s.id} className="mb-3">
              <div className="text-[11px] font-semibold text-soil mb-1.5">{s.name}</div>
              {[
                { label: '평상', level: s.normalLevel, color: '#5DCAA5' },
                { label: '주의', level: s.cautionLevel, color: '#EF9F27' },
                { label: '위험', level: s.warningLevel, color: '#E24B4A' },
                { label: '심각', level: s.criticalLevel, color: '#7A1F1F' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-1 border-b border-[#F5F0EA] text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: item.color }} />
                    <span className="text-soil">{item.label}</span>
                  </div>
                  <span className="font-semibold" style={{ color: item.color }}>{item.level}m 이상</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
