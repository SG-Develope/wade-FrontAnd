import { useState } from 'react'

const RADAR_TYPES = [
  { key: 'rain',      label: '강수 레이더', icon: 'ti-cloud-rain' },
  { key: 'satellite', label: '위성 영상',   icon: 'ti-satellite'  },
  { key: 'typhoon',   label: '태풍',        icon: 'ti-tornado'    },
]

function getRadarUrl(type: string) {
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

export default function RadarSection() {
  const [radarType, setRadarType] = useState('rain')
  const [imgError, setImgError] = useState(false)
  const radarUrl = getRadarUrl(radarType)

  return (
    <div className="bg-white border border-pebble rounded-[14px] overflow-hidden mb-3">
      <div className="flex items-center justify-between px-4 py-3 border-b border-pebble">
        <div>
          <div className="text-[13px] font-semibold text-soil flex items-center gap-1.5">
            <i className="ti ti-radar" />기상청 레이더
          </div>
          <div className="text-[10px] text-moss mt-0.5">상류(안동·합천) 강수 현황을 확인하세요</div>
        </div>
        <span className="text-[9px] bg-river-light text-river border border-[#9FE1CB] px-2 py-0.5 rounded-full font-semibold">LIVE</span>
      </div>

      <div className="flex border-b border-pebble bg-white">
        {RADAR_TYPES.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => { setRadarType(key); setImgError(false) }}
            className={`flex items-center gap-1.5 text-[12px] px-4 py-2.5 cursor-pointer border-b-2 transition-colors ${
              radarType === key ? 'border-river text-river font-semibold' : 'border-transparent text-moss'
            }`}
            style={{ background: 'none', border: 'none', borderBottom: `2px solid ${radarType === key ? '#1D9E75' : 'transparent'}` }}
          >
            <i className={`ti ${icon} text-[13px]`} />
            {label}
          </button>
        ))}
      </div>

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
  )
}
