interface WeatherData {
  temperature: number
  rainProbability: number
  humidity: number
  windSpeed: number
  windDirection: string
  skyCondition: string
}

interface Region {
  id: string
  label: string
  nx: number
  ny: number
  areaKeyword: string
}

interface Props {
  weather?: WeatherData
  isLoading: boolean
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

export default function CurrentWeatherStrip({ weather, isLoading, regionId, regions, onRegionChange }: Props) {
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

      {/* 날씨 항목들 */}
      {ITEMS.map(item => (
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
      ))}
    </div>
  )
}
