import type { Weather } from '@/types'

interface Props {
  weather?: Weather
  isLoading: boolean
  isError?: boolean
}

export default function WeatherPanel({ weather, isLoading, isError }: Props) {
  const items = [
    { label: '기온',     value: weather ? `${weather.temperature}°C` : '-',      sub: weather ? `체감 ${(weather.temperature + 2).toFixed(0)}°C` : '-' },
    { label: '강수확률', value: weather ? `${weather.rainProbability}%` : '-',   sub: weather?.skyCondition ?? '-' },
    { label: '풍속',     value: weather ? `${weather.windSpeed}m/s` : '-',       sub: weather?.windDirection ?? '-' },
    { label: '습도',     value: weather ? `${weather.humidity}%` : '-',         sub: weather && weather.humidity > 80 ? '높음' : '보통' },
  ]

  const errorMessage = weather?.message
    ?? (isError ? '날씨 정보를 불러오지 못했습니다.' : null)

  return (
    <div className="px-4 py-3.5 border-b border-[#F5F0EA]">
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-[10px] text-moss font-bold tracking-wider">오늘 날씨</span>
        <span className="text-[9px] bg-river-light text-river px-2 py-0.5 rounded-full">기상청</span>
      </div>
      {errorMessage ? (
        <div className="flex items-center gap-1.5 text-[10px] text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-2">
          <i className="ti ti-clock-pause text-[12px]" />
          {errorMessage}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-1.5">
          {items.map(item => (
            <div key={item.label} className="rounded-[10px] px-[11px] py-[9px] bg-[#F5F0EA]">
              <div className="text-[10px] text-moss mb-0.5">{item.label}</div>
              <div className="text-[16px] font-bold text-soil">
                {isLoading
                  ? <span className="inline-block w-10 h-4 bg-pebble rounded animate-pulse" />
                  : item.value}
              </div>
              <div className="text-[9px] mt-px text-[#A8B898]">{item.sub}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
