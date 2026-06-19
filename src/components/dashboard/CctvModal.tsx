import { useEffect } from 'react'
import type { CctvInfo } from './CctvCard'

interface Props {
  cctv: CctvInfo | null
  onClose: () => void
}

const AI_TEXTS: Record<string, string> = {
  '황강교': '황강교 수위가 위험 수준이에요. 상류 방류 영향으로 빠르게 상승 중입니다. 인근 캠핑, 낚시, 수변 활동은 당분간 피해주세요.',
  '묵계교': '묵계교 수위가 평소보다 높아요. 상류 비 소식이 있어 추가 상승 가능성이 있어요. 수변 가까이 접근은 주의해주세요.',
  '양포교': '양포교 수위는 안정적이에요. 낚시·자전거·산책 모두 즐기기 좋은 상태예요.',
  '구포대교': '구포대교 수위가 조금 높아요. 낚시나 산책은 가능하지만 수변 가까이는 주의해주세요.',
}

const HISTORY: Record<string, Array<{ time: string; level: string; status: string; color: string }>> = {
  '황강교': [
    { time: '14:37', level: '6.2m', status: '위험', color: '#A32D2D' },
    { time: '14:27', level: '5.8m', status: '주의', color: '#EF9F27' },
    { time: '14:17', level: '5.1m', status: '주의', color: '#EF9F27' },
    { time: '14:07', level: '4.3m', status: '안전', color: '#1D9E75' },
  ],
  '묵계교': [
    { time: '14:37', level: '4.8m', status: '주의', color: '#EF9F27' },
    { time: '14:27', level: '4.5m', status: '주의', color: '#EF9F27' },
    { time: '14:17', level: '4.1m', status: '안전', color: '#1D9E75' },
    { time: '14:07', level: '3.8m', status: '안전', color: '#1D9E75' },
  ],
  '양포교': [
    { time: '14:37', level: '1.9m', status: '안전', color: '#1D9E75' },
    { time: '14:27', level: '1.8m', status: '안전', color: '#1D9E75' },
    { time: '14:17', level: '1.8m', status: '안전', color: '#1D9E75' },
    { time: '14:07', level: '1.7m', status: '안전', color: '#1D9E75' },
  ],
  '구포대교': [
    { time: '14:37', level: '3.7m', status: '주의', color: '#EF9F27' },
    { time: '14:27', level: '3.5m', status: '주의', color: '#EF9F27' },
    { time: '14:17', level: '3.2m', status: '안전', color: '#1D9E75' },
    { time: '14:07', level: '3.0m', status: '안전', color: '#1D9E75' },
  ],
}

export default function CctvModal({ cctv, onClose }: Props) {
  useEffect(() => {
    if (!cctv) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [cctv, onClose])

  if (!cctv) return null

  const now = new Date()
  const timeStr = now.toLocaleDateString('ko-KR') + ' ' + now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) + ' KST'
  const aiText = AI_TEXTS[cctv.name] ?? '현재 수위를 확인 중이에요.'
  const history = HISTORY[cctv.name] ?? []
  const trendLabel = cctv.name === '황강교' ? '↑↑ 상승' : cctv.name === '양포교' ? '→ 유지' : '↑ 상승'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(29,40,20,0.55)] backdrop-blur-[3px] p-5"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[18px] w-full max-w-[640px] overflow-hidden border border-pebble"
        style={{ animation: 'slideUp 0.2s ease' }}
        onClick={e => e.stopPropagation()}
      >
        <style>{`@keyframes slideUp{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

        {/* 헤더 */}
        <div className="px-[18px] py-3.5 flex items-center justify-between border-b border-pebble">
          <div>
            <div className="text-[15px] font-bold text-soil" style={{ fontFamily: "'Gmarket Sans', sans-serif" }}>
              {cctv.name}
            </div>
            <div className="text-[11px] text-moss mt-0.5">{cctv.location} · 낙동강홍수통제소</div>
          </div>
          <button
            onClick={onClose}
            className="w-[30px] h-[30px] bg-sand border border-pebble rounded-lg flex items-center justify-center cursor-pointer text-moss hover:bg-pebble transition-colors"
          >
            <i className="ti ti-x text-[16px]" />
          </button>
        </div>

        {/* 영상 */}
        <div className="relative bg-[#0f1a0f] flex items-center justify-center" style={{ height: 260 }}>
          <svg width="100%" height="260" viewBox="0 0 640 260" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
            <rect width="640" height="260" fill="#0f1a0f"/>
            <rect x="30" y="60" width="270" height="140" fill="#1a2e1a" rx="6"/>
            <rect x="320" y="80" width="280" height="120" fill="#162616" rx="6"/>
            <path d="M0,180 Q160,165 320,172 Q480,180 640,162" stroke="#5DCAA5" strokeWidth="3" fill="none" opacity="0.7"/>
            <path d="M0,200 Q160,194 320,198 Q480,202 640,192" stroke="#5DCAA5" strokeWidth="2" fill="none" opacity="0.4"/>
            <path d="M0,216 Q160,212 320,215 Q480,218 640,210" stroke="#5DCAA5" strokeWidth="1.5" fill="none" opacity="0.25"/>
          </svg>
          <div className="absolute top-2.5 left-2.5 bg-danger text-white text-[9px] px-2 py-1 rounded-lg font-bold flex items-center gap-1 z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
            LIVE
          </div>
          <div className="absolute top-2.5 right-2.5 bg-black/50 text-white text-[9px] px-2 py-1 rounded-lg z-10">
            {timeStr}
          </div>
        </div>

        {/* 정보 그리드 */}
        <div className="grid grid-cols-4 gap-2 px-[18px] py-3 border-b border-pebble">
          {[
            { label: '현재 수위', value: cctv.level, color: cctv.textColor },
            { label: '상태', value: cctv.statusLabel, color: cctv.textColor },
            { label: '변화 추이', value: trendLabel, color: cctv.markerColor },
            { label: '갱신주기', value: '10분', color: '#2D3A1F' },
          ].map(item => (
            <div key={item.label} className="bg-sand rounded-[10px] px-3 py-2.5">
              <div className="text-[10px] text-moss mb-0.5">{item.label}</div>
              <div className="text-[15px] font-bold" style={{ color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* AI 안내 */}
        <div className="mx-[18px] my-3 bg-river-light rounded-xl px-3.5 py-3 border border-[#9FE1CB]">
          <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-bold text-river-deep">
            <i className="ti ti-leaf text-[12px]" />
            {cctv.statusLabel}
          </div>
          <div className="text-[12px] text-[#1A5A3A] leading-[1.7]">{aiText}</div>
        </div>

        {/* 최근 수위 변화 */}
        <div className="px-[18px] pb-4">
          <div className="text-[10px] text-moss font-bold tracking-[0.04em] mb-2">최근 수위 변화</div>
          {history.map((h, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5 text-[12px] text-[#4A5A3A] border-b border-[#F5F0EA] last:border-none">
              <i className="ti ti-clock text-[11px] text-moss" />
              {h.time} · {h.level}
              <span className="ml-1.5 font-semibold" style={{ color: h.color }}>
                {h.status === '위험' ? '↑ 위험' : h.status === '주의' ? '↑ 주의' : '안전'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
