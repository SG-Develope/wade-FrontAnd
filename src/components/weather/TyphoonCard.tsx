import { useTyphoonInfo } from '@/queries/useWeatherQuery'

export default function TyphoonCard() {
  const { data: typhoon, isLoading } = useTyphoonInfo()

  return (
    <div className="flex-1 bg-white border border-pebble rounded-[14px] overflow-hidden flex flex-col min-w-0">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-pebble shrink-0">
        <div className="text-[12px] font-semibold text-soil flex items-center gap-1.5">
          <i className="ti ti-tornado text-river text-[13px]" />
          태풍특보
        </div>
        <span className="text-[9px] bg-sky text-[#4A90C4] px-1.5 py-0.5 rounded-full font-semibold">기상청</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {isLoading ? (
          <div className="flex flex-col gap-1.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-7 bg-sand rounded animate-pulse" />
            ))}
          </div>
        ) : !typhoon?.active ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 py-6">
            <div className="w-10 h-10 rounded-full bg-[#E1F5EE] flex items-center justify-center">
              <i className="ti ti-shield-check text-river" style={{ fontSize: 20 }} />
            </div>
            <div className="text-[12px] font-semibold text-soil">현재 태풍 없음</div>
            <div className="text-[10px] text-moss opacity-70 text-center">태풍 발생 시 경보 정보가 표시됩니다</div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="bg-[#FEEEEE] border border-[#E24B4A] rounded-[10px] px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <i className="ti ti-tornado text-[#A32D2D] text-[13px]" />
                <span className="text-[13px] font-bold text-[#A32D2D]">태풍 {typhoon.name}</span>
                <span className="text-[10px] text-[#A32D2D] opacity-70">({typhoon.nameEn})</span>
              </div>
              {typhoon.location && (
                <div className="text-[11px] text-[#A32D2D] opacity-80 leading-snug">{typhoon.location}</div>
              )}
            </div>
            <table className="w-full text-[11px] border-collapse">
              <tbody>
                {[
                  { label: '최대풍속', value: typhoon.maxWindSpeed != null ? `${typhoon.maxWindSpeed} m/s` : '-' },
                  { label: '중심기압', value: typhoon.pressure != null ? `${typhoon.pressure} hPa` : '-' },
                  { label: '진행방향', value: typhoon.direction ?? '-' },
                  { label: '이동속도', value: typhoon.moveSpeed != null ? `${typhoon.moveSpeed} km/h` : '-' },
                ].map(row => (
                  <tr key={row.label} className="border-b border-pebble/50">
                    <td className="py-1.5 px-2 text-moss font-semibold text-[10px] w-16">{row.label}</td>
                    <td className="py-1.5 px-2 font-bold text-soil">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
