import type { UltraShortForecastItem } from '@/queries/useWeatherQuery'

const SKY_COLOR: Record<string, string> = {
  '맑음':    '#4A90C4',
  '구름많음': '#8A9A7A',
  '흐림':    '#6B7280',
}

const PRECIP_COLOR: Record<string, string> = {
  '비':          '#4A90C4',
  '비·눈':  '#4A90C4',
  '눈':          '#93B8E0',
  '소나기': '#EF9F27',
  '빗방울': '#4A90C4',
  '빗방울눈날림': '#93B8E0',
  '눈날림': '#93B8E0',
}

function formatTime(fcstTime: string) {
  return `${fcstTime.slice(0, 2)}시`
}

interface Props {
  items: UltraShortForecastItem[]
  isLoading: boolean
}

export default function UltraShortForecastCard({ items, isLoading }: Props) {
  return (
    <div className="flex-1 bg-white border border-pebble rounded-[14px] overflow-hidden flex flex-col min-w-0">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-pebble shrink-0">
        <div className="text-[12px] font-semibold text-soil flex items-center gap-1.5">
          <i className="ti ti-clock-bolt text-river text-[13px]" />
          초단기예보
        </div>
        <span className="text-[9px] text-moss opacity-60">1h · 6h</span>
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
                <th className="px-2 py-1.5 text-left">시간</th>
                <th className="px-2 py-1.5 text-left">하늘</th>
                <th className="px-2 py-1.5 text-right">기온</th>
                <th className="px-2 py-1.5 text-left">강수형태</th>
                <th className="px-2 py-1.5 text-right">강수량</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => {
                const hasPrecip = item.precipType && item.precipType !== '없음'
                const precipColor = PRECIP_COLOR[item.precipType] ?? '#4A90C4'
                const skyColor = SKY_COLOR[item.skyCondition] ?? '#8A9A7A'
                return (
                  <tr
                    key={i}
                    className={`border-b border-pebble/50 hover:bg-sand/60 transition-colors ${i % 2 === 0 ? '' : 'bg-[#fafaf8]'}`}
                  >
                    <td className="px-2 py-1.5 font-bold text-moss whitespace-nowrap">
                      {formatTime(item.fcstTime)}
                    </td>
                    <td className="px-2 py-1.5 font-semibold whitespace-nowrap" style={{ color: skyColor }}>
                      {item.skyCondition}
                    </td>
                    <td className="px-2 py-1.5 font-bold text-soil text-right whitespace-nowrap">
                      {item.temperature}°C
                    </td>
                    <td className="px-2 py-1.5 whitespace-nowrap">
                      {hasPrecip ? (
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                          style={{ color: precipColor, background: '#EBF2FA' }}
                        >
                          {item.precipType}
                        </span>
                      ) : (
                        <span className="text-[9px] text-moss opacity-30">-</span>
                      )}
                    </td>
                    <td className="px-2 py-1.5 text-right whitespace-nowrap">
                      {item.precipAmount && item.precipAmount !== '0' ? (
                        <span className="text-[10px] font-semibold" style={{ color: precipColor }}>
                          {item.precipAmount}mm
                        </span>
                      ) : (
                        <span className="text-[9px] text-moss opacity-30">-</span>
                      )}
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
