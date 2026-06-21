import type { WeatherAlertItem } from '@/queries/useWeatherQuery'

const WARN_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  '경보': { bg: '#FEEEEE', text: '#A32D2D', border: '#E24B4A' },
  '주의보': { bg: '#FEF3DC', text: '#7A4300', border: '#EF9F27' },
  '예비': { bg: '#F0F7FF', text: '#2A5A8A', border: '#4A90C4' },
}

const WARN_ICON: Record<string, string> = {
  '태풍':  'ti-tornado',
  '호우':  'ti-cloud-rain',
  '강풍':  'ti-wind',
  '풍랑':  'ti-waves',
  '해일':  'ti-wave-saw-tool',
  '대설':  'ti-snowflake',
  '건조':  'ti-droplet-off',
  '황사':  'ti-cloud-fog',
  '한파':  'ti-thermometer-minus',
  '폭염':  'ti-thermometer-plus',
}

function formatIssuedAt(tmFc: string) {
  if (!tmFc || tmFc.length < 12) return tmFc
  const y = tmFc.slice(0, 4)
  const mo = tmFc.slice(4, 6)
  const d = tmFc.slice(6, 8)
  const h = tmFc.slice(8, 10)
  const m = tmFc.slice(10, 12)
  return `${mo}.${d} ${h}:${m}`
}

interface Props {
  alerts: WeatherAlertItem[]
  isLoading: boolean
}

export default function AlertsCard({ alerts, isLoading }: Props) {
  return (
    <div className="flex-1 bg-white border border-pebble rounded-[14px] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-pebble shrink-0">
        <div>
          <div className="text-[12px] font-semibold text-soil flex items-center gap-1.5">
            <i className="ti ti-alert-triangle text-[#EF9F27] text-[13px]" />
            발령특보
          </div>
          <div className="text-[10px] text-moss mt-0.5">현재 발효 중인 기상특보</div>
        </div>
        <span className="text-[9px] bg-sky text-[#4A90C4] px-1.5 py-0.5 rounded-full font-semibold">기상청</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2].map(i => (
              <div key={i} className="h-[60px] bg-sand rounded-xl animate-pulse" />
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 py-6">
            <div className="w-10 h-10 rounded-full bg-[#E1F5EE] flex items-center justify-center">
              <i className="ti ti-shield-check text-river" style={{ fontSize: 20 }} />
            </div>
            <div className="text-[12px] font-semibold text-soil">현재 발효 중인 특보 없음</div>
            <div className="text-[10px] text-moss opacity-70 text-center">기상특보 없이 안전한 날씨입니다</div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {alerts.map((alert, i) => {
              const colors = WARN_COLOR[alert.warnLevel] ?? WARN_COLOR['주의보']
              const icon = WARN_ICON[alert.warnVar] ?? 'ti-alert-triangle'
              return (
                <div key={i} className="rounded-[10px] px-3 py-2.5 border" style={{ background: colors.bg, borderColor: colors.border }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <i className={`ti ${icon} text-[12px]`} style={{ color: colors.text }} />
                    <span className="text-[12px] font-bold" style={{ color: colors.text }}>
                      {alert.warnVar} {alert.warnLevel}
                    </span>
                    <span className="ml-auto text-[9px] opacity-70" style={{ color: colors.text }}>
                      {formatIssuedAt(alert.issuedAt)}
                    </span>
                  </div>
                  <div className="text-[10px] font-semibold" style={{ color: colors.text }}>{alert.area}</div>
                  {alert.content && (
                    <div className="text-[10px] mt-1 opacity-80 line-clamp-2 leading-[1.5]" style={{ color: colors.text }}>
                      {alert.content}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
