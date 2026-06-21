import type { Weather } from '@/types'

interface Props {
  weather?: Weather
  isLoading: boolean
}

export default function WeatherPanel({ weather, isLoading }: Props) {
  const items = [
    { label: '기온',     value: weather ? `${weather.temperature}°C` : '-',      sub: weather ? `체감 ${(weather.temperature + 2).toFixed(0)}°C` : '-' },
    { label: '강수확률', value: weather ? `${weather.rainProbability}%` : '-',   sub: weather?.skyCondition ?? '-' },
    { label: '풍속',     value: weather ? `${weather.windSpeed}m/s` : '-',       sub: weather?.windDirection ?? '-' },
    { label: '습도',     value: weather ? `${weather.humidity}%` : '-',         sub: weather && weather.humidity > 80 ? '높음' : '보통' },
  ]

  return (
    <div style={{ padding: '14px 16px', borderBottom: '0.5px solid #F5F0EA' }}>
      <div className="flex justify-between items-center mb-[10px]">
        <span className="text-[10px] text-moss font-bold tracking-[0.05em]">오늘 날씨</span>
        <span className="text-[9px] bg-river-light text-river px-2 py-0.5 rounded-full">기상청</span>
      </div>
      <div className="grid grid-cols-2 gap-[6px]">
        {items.map(item => (
          <div key={item.label} className="rounded-[10px]" style={{ padding: '9px 11px', background: '#F5F0EA' }}>
            <div className="text-[10px] text-moss mb-[2px]">{item.label}</div>
            <div className="text-[16px] font-bold text-soil">
              {isLoading
                ? <span className="inline-block w-10 h-4 bg-pebble rounded animate-pulse" />
                : item.value}
            </div>
            <div className="text-[9px] mt-[1px]" style={{ color: '#A8B898' }}>{item.sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
