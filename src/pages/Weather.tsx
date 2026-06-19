import { useState } from 'react'
import { useWeather } from '@/queries/useWeatherQuery'

const RADAR_TYPES = [
  { key: 'rain', label: '강수 레이더', icon: 'ti-cloud-rain' },
  { key: 'satellite', label: '위성 영상', icon: 'ti-satellite' },
  { key: 'typhoon', label: '태풍', icon: 'ti-tornado' },
]

const getRadarUrl = (type: string) => {
  const now = new Date()
  const yyyymmdd = now.toISOString().slice(0, 10).replace(/-/g, '')
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(Math.floor(now.getMinutes() / 10) * 10).padStart(2, '0')
  switch (type) {
    case 'rain':
      return `https://www.weather.go.kr/w/cgi-bin/rdr/rdr_cmp_img.cgi?tm=${yyyymmdd}${hh}${mm}&qcd=HSR&obs=COMP&map=KO&size=600`
    case 'satellite':
      return `https://nmsc.kma.go.kr/enhome/html/base/cmm/selectImg.do?nm=GK2A_AHI_L1B_IR105&dataMap=ALL&size=800`
    default:
      return `https://www.weather.go.kr/w/cgi-bin/rdr/rdr_cmp_img.cgi?tm=${yyyymmdd}${hh}${mm}&qcd=HSR&obs=COMP&map=KO&size=600`
  }
}

const FORECAST_MOCK = Array.from({ length: 7 }, (_, i) => {
  const d = new Date()
  d.setDate(d.getDate() + i)
  return {
    date: d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' }),
    icon: ['☀️', '⛅', '🌧️', '⛅', '☀️', '🌦️', '☀️'][i],
    high: [30, 28, 25, 27, 32, 26, 31][i],
    low: [22, 21, 19, 20, 23, 18, 22][i],
    rain: [10, 30, 70, 40, 5, 60, 10][i],
  }
})

export default function Weather() {
  const [radarType, setRadarType] = useState('rain')
  const [imgError, setImgError] = useState(false)
  const { data: weather, isLoading } = useWeather()
  const radarUrl = getRadarUrl(radarType)

  return (
    <div className="flex h-full overflow-hidden">
      {/* ─── 메인 ─── */}
      <div className="flex-1 overflow-y-auto px-5 py-5 bg-white">
        {/* 헤더 */}
        <div className="mb-3.5">
          <div
            className="text-[14px] font-bold text-soil flex items-center gap-1.5"
            style={{ fontFamily: 'var(--font-gmarket)' }}
          >
            <i className="ti ti-cloud text-river" />
            날씨 · 레이더
          </div>
          <div className="text-[10px] text-moss mt-0.5">기상청 강수 레이더 · 위성 · 7일 예보</div>
        </div>

        {/* 레이더 섹션 */}
        <div className="bg-white border border-pebble rounded-[14px] overflow-hidden mb-3">
          {/* 레이더 헤더 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-pebble">
            <div>
              <div className="text-[13px] font-semibold text-soil flex items-center gap-1.5">
                <i className="ti ti-radar" />기상청 레이더
              </div>
              <div className="text-[10px] text-moss mt-0.5">상류(안동·합천) 강수 현황을 확인하세요</div>
            </div>
            <span className="text-[9px] bg-river-light text-river border border-[#9FE1CB] px-2 py-0.5 rounded-full font-semibold">LIVE</span>
          </div>

          {/* 탭 */}
          <div className="flex border-b border-pebble bg-white">
            {RADAR_TYPES.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => { setRadarType(key); setImgError(false) }}
                className={`flex items-center gap-1.5 text-[12px] px-4 py-2.5 cursor-pointer border-b-2 transition-colors ${
                  radarType === key
                    ? 'border-river text-river font-semibold'
                    : 'border-transparent text-moss'
                }`}
                style={{ background: 'none', border: 'none', borderBottom: `2px solid ${radarType === key ? '#1D9E75' : 'transparent'}` }}
              >
                <i className={`ti ${icon} text-[13px]`} />
                {label}
              </button>
            ))}
          </div>

          {/* 레이더 이미지 */}
          <div className="bg-[#1a2e3a] h-[340px] relative flex items-center justify-center overflow-hidden">
            {imgError ? (
              <RadarFallback type={radarType} />
            ) : (
              <img
                key={radarUrl}
                src={radarUrl}
                alt="기상청 레이더"
                className="w-full h-full object-contain"
                onError={() => setImgError(true)}
              />
            )}
            <div className="absolute top-2.5 left-3 bg-black/55 text-white text-[10px] px-2 py-0.5 rounded-lg">
              {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 기준
            </div>
            <div className="absolute bottom-2.5 right-3 bg-black/40 text-[#aaa] text-[9px] px-1.5 py-0.5 rounded">
              출처: 기상청
            </div>
          </div>
        </div>

        {/* 7일 예보 */}
        <div className="bg-white border border-pebble rounded-[14px] px-4 py-3.5">
          <div className="flex items-center justify-between text-[10px] text-moss font-bold tracking-[0.04em] mb-3">
            7일 예보
            <span className="text-[9px] bg-sky text-[#4A90C4] px-1.5 py-0.5 rounded-full font-semibold">기상청</span>
          </div>
          <div className="flex items-stretch">
            {FORECAST_MOCK.map((d, i) => (
              <div
                key={i}
                className={`flex-1 text-center px-1 py-2 ${i < FORECAST_MOCK.length - 1 ? 'border-r border-pebble' : ''}`}
              >
                <div className="text-[10px] text-moss mb-1">{d.date}</div>
                <div className="text-[18px] mb-1">{d.icon}</div>
                <div className="text-[12px] font-semibold text-soil">{d.high}°</div>
                <div className="text-[10px] text-moss">{d.low}°</div>
                <div className="text-[10px] text-[#4A90C4] mt-0.5">{d.rain}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 사이드 ─── */}
      <div className="w-[308px] bg-white border-l border-pebble overflow-y-auto shrink-0">
        {/* 현재 날씨 상세 */}
        <div className="px-4 py-3.5 border-b border-[#F5F0EA]">
          <div className="text-[10px] text-moss font-bold tracking-[0.05em] mb-2.5">현재 날씨 상세</div>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { label: '기온', value: weather ? `${weather.temperature}°C` : '--°C', icon: '🌡️' },
              { label: '강수확률', value: weather ? `${weather.rainProbability}%` : '--%', icon: '☔' },
              { label: '습도', value: weather ? `${weather.humidity}%` : '--%', icon: '💧' },
              { label: '풍속', value: weather ? `${weather.windSpeed}m/s` : '--', icon: '💨' },
              { label: '풍향', value: weather?.windDirection ?? '--', icon: '🧭' },
              { label: '날씨', value: weather?.skyCondition ?? '--', icon: '⛅' },
            ].map(item => (
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
          {[
            { color: '#4A90C4', label: '약한 비 (1mm/h 미만)' },
            { color: '#1D9E75', label: '보통 비 (1~5mm/h)' },
            { color: '#EF9F27', label: '강한 비 (5~20mm/h)' },
            { color: '#E24B4A', label: '매우 강한 비 (20mm/h↑)' },
          ].map(item => (
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
    </div>
  )
}

function RadarFallback({ type }: { type: string }) {
  const label = type === 'satellite' ? '위성 영상' : type === 'typhoon' ? '태풍 레이더' : '강수 레이더'
  return (
    <div className="flex flex-col items-center gap-3 text-moss">
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="36" fill="none" stroke="#2a4a3a" strokeWidth="2" />
        <circle cx="40" cy="40" r="24" fill="none" stroke="#2a5a4a" strokeWidth="1.5" />
        <circle cx="40" cy="40" r="12" fill="none" stroke="#2a6a5a" strokeWidth="1" />
        <line x1="40" y1="4" x2="40" y2="76" stroke="#2a4a3a" strokeWidth="0.5" />
        <line x1="4" y1="40" x2="76" y2="40" stroke="#2a4a3a" strokeWidth="0.5" />
        <circle cx="40" cy="40" r="4" fill="#1D9E75" />
      </svg>
      <div className="text-[12px]">{label} 이미지를 불러올 수 없습니다</div>
      <a href="https://www.weather.go.kr" target="_blank" rel="noopener noreferrer" className="text-[10px] text-river">
        기상청 바로가기
      </a>
    </div>
  )
}
