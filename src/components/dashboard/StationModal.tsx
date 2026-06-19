import useAppStore from '@/stores/appStore'
import { STATUS_COLORS, STATIONS } from '@/constants/stations'
import StatusBadge from '@/components/common/StatusBadge'
import type { Station } from '@/types'

export default function StationModal() {
  const { selectedStation, closeModal } = useAppStore()
  const station = selectedStation as Station | null

  if (!station) return null

  const colors = STATUS_COLORS[station.status] ?? STATUS_COLORS.normal
  const stationInfo = Object.values(STATIONS).find(s => s.id === station.id)
  const designFlood = station.designFloodLevel ?? stationInfo?.thresholds.designFlood ?? 10
  const fillPct = Math.min((station.currentLevel / designFlood) * 100, 100)
  const riseFromNormal = (station.currentLevel - (station.normalLevel ?? 1.6)).toFixed(2)
  const cctvUrl = `https://www.hrfco.go.kr/cctvpage/cctv_view.do?stn_id=${station.id}`

  return (
    <div
      onClick={closeModal}
      className="fixed inset-0 bg-[rgba(29,40,20,0.55)] flex items-center justify-center z-[200] p-5 backdrop-blur-sm"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-[18px] w-full max-w-[600px] overflow-hidden border border-pebble"
        style={{ animation: 'slideUp 0.2s ease' }}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-pebble">
          <div>
            <div className="flex items-center gap-2 text-[15px] font-bold text-soil">
              {station.name}
              <StatusBadge status={station.status} />
            </div>
            <div className="text-[11px] text-moss mt-0.5">{stationInfo?.location ?? '낙동강'} 수위 관측소</div>
          </div>
          <button
            onClick={closeModal}
            className="w-[30px] h-[30px] bg-sand border border-pebble rounded-lg flex items-center justify-center cursor-pointer text-moss text-[16px]"
          >
            <i className="ti ti-x" />
          </button>
        </div>

        {/* CCTV */}
        <div className="bg-[#0f1a0f] h-[220px] relative flex items-center justify-center">
          <iframe
            src={cctvUrl}
            className="w-full h-full border-none opacity-90"
            title={`${station.name} CCTV`}
          />
          <div className="absolute top-2 left-2.5 bg-danger text-white text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white" style={{ animation: 'blink 1.2s infinite' }} />
            LIVE
          </div>
        </div>

        {/* 수위 지표 */}
        <div className="px-4 py-3 grid grid-cols-4 gap-2 border-b border-pebble">
          {[
            { label: '현재 수위', value: `${station.currentLevel?.toFixed(2)}m`, color: colors.text },
            { label: '평상수위', value: `${station.normalLevel?.toFixed(1)}m`, color: '#2D3A1F' },
            { label: '평상 대비', value: `+${riseFromNormal}m`, color: Number(riseFromNormal) > 0 ? '#EF9F27' : '#1D9E75' },
            { label: '홍수위까지', value: `${(designFlood - station.currentLevel).toFixed(2)}m`, color: '#2D3A1F' },
          ].map(item => (
            <div key={item.label} className="bg-sand rounded-[10px] px-3 py-2">
              <div className="text-[10px] text-moss mb-0.5">{item.label}</div>
              <div className="text-[15px] font-bold" style={{ color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* 수위 바 */}
        <div className="px-4 py-3 border-b border-pebble">
          <div className="text-[10px] text-moss font-bold mb-2">계획홍수위 대비</div>
          <div className="h-3 bg-pebble rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${fillPct}%`, background: colors.marker }}
            />
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-moss">
            <span>0m</span>
            <span className="font-semibold" style={{ color: colors.text }}>현재 {fillPct.toFixed(0)}%</span>
            <span>{designFlood}m (계획홍수위)</span>
          </div>
        </div>

        {/* 경보 기준 */}
        <div className="px-4 py-3">
          <div className="text-[10px] text-moss font-bold mb-2">경보 기준</div>
          <div className="flex gap-1.5">
            {[
              { label: '주의', level: station.cautionLevel, color: '#EF9F27' },
              { label: '위험', level: station.warningLevel, color: '#E24B4A' },
              { label: '심각', level: station.criticalLevel, color: '#7A1F1F' },
            ].map(item => (
              <div key={item.label} className="flex-1 text-center bg-sand rounded-lg py-1.5 px-1">
                <div className="text-[9px] font-bold" style={{ color: item.color }}>{item.label}</div>
                <div className="text-[12px] font-bold text-soil">{item.level}m</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(16px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
