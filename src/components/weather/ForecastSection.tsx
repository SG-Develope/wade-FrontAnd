export default function ForecastSection() {
  return (
    <div className="bg-white border border-pebble rounded-[14px] px-4 py-3.5">
      <div className="flex items-center justify-between text-[10px] text-moss font-bold tracking-[0.04em] mb-3">
        7일 예보
        <span className="text-[9px] bg-sky text-[#4A90C4] px-1.5 py-0.5 rounded-full font-semibold">기상청</span>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 py-8 text-moss">
        <i className="ti ti-calendar-off text-[28px] opacity-30" />
        <div className="text-[12px] opacity-50">7일 예보 API 연동 준비 중</div>
        <a
          href="https://www.weather.go.kr"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-river underline"
        >
          기상청에서 확인하기
        </a>
      </div>
    </div>
  )
}
