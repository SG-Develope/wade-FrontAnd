interface WeatherData {
  temperature: number
  rainProbability: number
  humidity: number
  windSpeed: number
  windDirection: string
  skyCondition: string
}

interface Props {
  weather?: WeatherData
  isLoading: boolean
}

const LEGEND = [
  { color: '#4A90C4', label: '약한 비 (1mm/h 미만)' },
  { color: '#1D9E75', label: '보통 비 (1~5mm/h)' },
  { color: '#EF9F27', label: '강한 비 (5~20mm/h)' },
  { color: '#E24B4A', label: '매우 강한 비 (20mm/h↑)' },
]

export default function WeatherSidebar({ weather, isLoading }: Props) {
  const items = [
    { label: '기온',     value: weather ? `${weather.temperature}°C`    : '--°C', icon: '🌡️' },
    { label: '강수확률', value: weather ? `${weather.rainProbability}%`  : '--%',  icon: '☔' },
    { label: '습도',     value: weather ? `${weather.humidity}%`         : '--%',  icon: '💧' },
    { label: '풍속',     value: weather ? `${weather.windSpeed}m/s`      : '--',   icon: '💨' },
    { label: '풍향',     value: weather?.windDirection                   ?? '--',  icon: '🧭' },
    { label: '날씨',     value: weather?.skyCondition                    ?? '--',  icon: '⛅' },
  ]

  return (
    <div className="w-[308px] bg-white border-l border-pebble overflow-y-auto shrink-0">
      {/* 현재 날씨 상세 */}
      <div className="px-4 py-3.5 border-b border-[#F5F0EA]">
        <div className="text-[10px] text-moss font-bold tracking-[0.05em] mb-2.5">현재 날씨 상세</div>
        <div className="grid grid-cols-2 gap-1.5">
          {items.map(item => (
            <div key={item.label} className="bg-sand rounded-[10px] px-2.5 py-2">
              <div className="text-[10px] text-moss mb-0.5">{item.icon} {item.label}</div>
              <div className="text-[15px] font-bold text-soil">
                {isLoading ? '...' : item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 레이더 범례 */}
      <div className="px-4 py-3.5 border-b border-[#F5F0EA]">
        <div className="text-[10px] text-moss font-bold tracking-[0.05em] mb-2">레이더 범례</div>
        {LEGEND.map(item => (
          <div key={item.label} className="flex items-center gap-2 text-[11px] text-soil mb-1.5">
            <span className="w-6 h-2.5 rounded shrink-0" style={{ background: item.color }} />
            {item.label}
          </div>
        ))}
      </div>

      {/* 상류 강수 주의 */}
      <div className="px-4 py-3.5">
        <div className="bg-[#FEF3DC] border border-[#F5C842] rounded-[10px] px-3 py-2.5">
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#7A4300] mb-1">
            <i className="ti ti-info-circle" />
            상류 강수 주의
          </div>
          <div className="text-[11px] text-[#5A4300] leading-[1.65]">
            안동댐·합천댐 상류에 강한 비가 오면 하류 낙동강 수위가 6~12시간 후 상승할 수 있습니다.
            레이더에서 상류 강수 여부를 꼭 확인하세요.
          </div>
        </div>
      </div>
    </div>
  )
}
