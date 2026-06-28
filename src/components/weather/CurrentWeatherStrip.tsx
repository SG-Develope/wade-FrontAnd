interface WeatherData {
  temperature: number
  rainProbability: number
  humidity: number
  windSpeed: number
  windDirection: string
  skyCondition: string
  message?: string
}

interface Region {
  id: string
  label: string
  areaKeyword: string
}

interface Props {
  weather?: WeatherData
  isLoading: boolean
  isError?: boolean
  regionId: string
  regions: readonly Region[]
  onRegionChange: (id: string) => void
}

const ITEMS = [
  { key: 'temperature',    label: '기온',     icon: 'ti-temperature', format: (v: WeatherData) => `${v.temperature}°C` },
  { key: 'rainProbability',label: '강수확률', icon: 'ti-umbrella',    format: (v: WeatherData) => `${v.rainProbability}%` },
  { key: 'humidity',       label: '습도',     icon: 'ti-droplet',     format: (v: WeatherData) => `${v.humidity}%` },
  { key: 'windSpeed',      label: '풍속',     icon: 'ti-wind',        format: (v: WeatherData) => `${v.windSpeed}m/s` },
  { key: 'windDirection',  label: '풍향',     icon: 'ti-compass',     format: (v: WeatherData) => v.windDirection },
  { key: 'skyCondition',   label: '하늘',     icon: 'ti-sun',         format: (v: WeatherData) => v.skyCondition },
]

export default function CurrentWeatherStrip({ weather, isLoading, isError, regionId, regions, onRegionChange }: Props) {
  const errorMessage = weather?.message
    ?? (isError ? '날씨 정보를 불러오지 못했습니다.' : null)
  return (
    <div className="flex items-center gap-2 px-5 py-2 border-b border-pebble bg-white shrink-0 flex-wrap">
      {/* 지역 셀렉트 */}
      <div className="flex items-center gap-1.5 mr-1">
        <i className="ti ti-map-pin text-river text-[11px]" />
        <select
          value={regionId}
          onChange={e => onRegionChange(e.target.value)}
          className="text-[11px] font-bold text-soil bg-transparent border-none outline-none cursor-pointer"
        >
          {regions.map(r => (
            <option key={r.id} value={r.id}>{r.label}</option>
          ))}
        </select>
      </div>

      <div className="w-px h-3 bg-pebble mr-1 shrink-0" />

      {/* 에러 메시지 (429 한도 초과 or 기타 오류) */}
      {!isLoading && errorMessage ? (
        <div className="flex items-center gap-1.5 text-[11px] text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1">
          <i className="ti ti-clock-pause text-[12px]" />
          {errorMessage}
        </div>
      ) : (
        /* 날씨 항목들 */
        ITEMS.map(item => (
          <div key={item.key} className="flex items-center gap-1 bg-sand rounded-lg px-2.5 py-1">
            <i className={`ti ${item.icon} text-river text-[11px]`} />
            <span className="text-[10px] text-moss">{item.label}</span>
            {isLoading ? (
              <div className="w-8 h-3 bg-pebble rounded animate-pulse ml-0.5" />
            ) : (
              <span className="text-[11px] font-bold text-soil ml-0.5">
                {weather ? item.format(weather) : '-'}
              </span>
            )}
          </div>
        ))
      )}
    </div>
  )
}
