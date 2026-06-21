import type { ShortForecastItem } from '@/queries/useWeatherQuery'

const SKY_COLOR: Record<string, string> = {
  '맑음':    '#4A90C4',
  '구름많음': '#8A9A7A',
  '흐림':    '#6B7280',
}

function formatTime(fcstDate: string, fcstTime: string) {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const hour = fcstTime.slice(0, 2)
  return fcstDate === today ? `${hour}시` : `내일 ${hour}시`
}

interface Props {
  items: ShortForecastItem[]
  isLoading: boolean
}

export default function ShortForecastCard({ items, isLoading }: Props) {
  return (
    <div className="flex-1 bg-white border border-pebble rounded-[14px] overflow-hidden flex flex-col min-w-0">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-pebble shrink-0">
        <div className="text-[12px] font-semibold text-soil flex items-center gap-1.5">
          <i className="ti ti-calendar-stats text-river text-[13px]" />
          단기예보
        </div>
        <span className="text-[9px] text-moss opacity-60">3h · 48h</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col gap-px p-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-7 bg-sand rounded animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[11px] text-moss opacity-60 p-4">
            데이터를 불러올 수 없습니다
          </div>
        ) : (
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="bg-sand text-moss text-[9px] font-semibold">
                <th className="px-2 py-1.5 text-center">시간</th>
                <th className="px-2 py-1.5 text-center">하늘</th>
                <th className="px-2 py-1.5 text-center">기온</th>
                <th className="px-2 py-1.5 text-center">강수확률</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => {
                const pop = item.rainProbability
                const popColor = pop >= 70 ? '#4A90C4' : pop >= 40 ? '#EF9F27' : '#AABBA0'
                const skyColor = SKY_COLOR[item.skyCondition] ?? '#8A9A7A'
                return (
                  <tr key={i} className={`border-b border-pebble/50 ${i % 2 === 0 ? '' : 'bg-[#fafaf8]'}`}>
                    <td className="px-2 py-1.5 text-center font-bold text-moss whitespace-nowrap">
                      {formatTime(item.fcstDate, item.fcstTime)}
                    </td>
                    <td className="px-2 py-1.5 text-center font-semibold whitespace-nowrap" style={{ color: skyColor }}>
                      {item.skyCondition}
                    </td>
                    <td className="px-2 py-1.5 text-center font-bold text-soil whitespace-nowrap">
                      {item.temperature}°C
                    </td>
                    <td className="px-2 py-1.5 text-center font-semibold whitespace-nowrap" style={{ color: popColor }}>
                      {pop}%
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
