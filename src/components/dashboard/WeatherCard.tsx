import type { Weather } from '@/types'

interface Props {
  weather: Weather | undefined
  isLoading: boolean
}

const SKY_ICON: Record<string, string> = {
  '맑음': '☀️', '구름많음': '⛅', '흐림': '☁️',
}
const RAIN_ICON: Record<number, string> = {
  0: '', 1: '🌧️', 3: '🌨️', 4: '🌦️',
}

export default function WeatherCard({ weather, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="bg-white border border-pebble rounded-xl p-2.5">
        <div className="text-[10px] text-moss font-bold tracking-[0.04em] mb-2">현재 날씨</div>
        <div className="h-10 bg-sand rounded-lg animate-pulse" />
      </div>
    )
  }

  const skyIcon = weather
    ? (RAIN_ICON[weather.precipitationType] || SKY_ICON[weather.skyCondition] || '🌤️')
    : '🌤️'

  return (
    <div className="bg-white border border-pebble rounded-xl p-2.5">
      <div className="flex items-center justify-between text-[10px] text-moss font-bold tracking-[0.04em] mb-2">
        현재 날씨
        <span className="text-[9px] bg-river-light text-river rounded-full px-1.5 py-0.5 font-semibold">구미</span>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        <div className="bg-sand rounded-[10px] px-2.5 py-2">
          <div className="text-[10px] text-moss mb-0.5">기온</div>
          <div className="text-[18px] font-bold text-soil">
            {weather ? `${weather.temperature}°` : '--°'}
          </div>
          <div className="text-[9px] text-[#A8B898] mt-0.5">{skyIcon} {weather?.skyCondition ?? '-'}</div>
        </div>
        <div className="bg-sand rounded-[10px] px-2.5 py-2">
          <div className="text-[10px] text-moss mb-0.5">강수확률</div>
          <div className="text-[18px] font-bold text-[#4A90C4]">
            {weather ? `${weather.rainProbability}%` : '--%'}
          </div>
          <div className="text-[9px] text-[#A8B898] mt-0.5">습도 {weather?.humidity ?? '--'}%</div>
        </div>
      </div>
    </div>
  )
}
