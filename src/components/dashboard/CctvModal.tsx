import { useEffect, useState } from 'react'
import type { CctvInfo } from './CctvCard'
import { fetchItsStreamUrl } from '@/api/cctv'

interface Props {
  cctv: CctvInfo | null
  onClose: () => void
}

export default function CctvModal({ cctv, onClose }: Props) {
  const [streamUrl, setStreamUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!cctv) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [cctv, onClose])

  useEffect(() => {
    if (!cctv) { setStreamUrl(null); return }
    setLoading(true)
    fetchItsStreamUrl(cctv).then(url => {
      setStreamUrl(url)
      setLoading(false)
    })
  }, [cctv])

  if (!cctv) return null

  const now = new Date()
  const timeStr = now.toLocaleDateString('ko-KR') + ' ' + now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) + ' KST'

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
        <div className="relative bg-[#0f1a0f] h-65">
          {loading ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <div className="w-6 h-6 border-2 border-moss/30 border-t-moss rounded-full animate-spin" />
              <span className="text-[12px] text-moss">영상 불러오는 중...</span>
            </div>
          ) : streamUrl ? (
            <video
              key={streamUrl}
              src={streamUrl}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
              controls
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <i className="ti ti-video-off text-moss text-2xl" />
              <span className="text-[12px] text-moss">현재 영상을 불러올 수 없습니다</span>
            </div>
          )}
          <div className="absolute top-2.5 left-2.5 bg-danger text-white text-[9px] px-2 py-1 rounded-lg font-bold flex items-center gap-1 z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
            LIVE
          </div>
          <div className="absolute top-2.5 right-2.5 bg-black/50 text-white text-[9px] px-2 py-1 rounded-lg z-10">
            {timeStr}
          </div>
        </div>

        {/* 정보 그리드 */}
        <div className="grid grid-cols-3 gap-2 px-[18px] py-3 border-b border-pebble">
          {[
            { label: '현재 수위', value: cctv.level, color: cctv.textColor },
            { label: '상태', value: cctv.statusLabel, color: cctv.textColor },
            { label: '갱신주기', value: '10분', color: '#2D3A1F' },
          ].map(item => (
            <div key={item.label} className="bg-sand rounded-[10px] px-3 py-2.5">
              <div className="text-[10px] text-moss mb-0.5">{item.label}</div>
              <div className="text-[15px] font-bold" style={{ color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* 해당 관측소 */}
        <div className="mx-[18px] my-3 bg-river-light rounded-xl px-3.5 py-3 border border-[#9FE1CB]">
          <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-bold text-river-deep">
            <i className="ti ti-map-pin text-[12px]" />
            해당 관측소
          </div>
          <div className="text-[13px] font-bold text-[#1A5A3A]">{cctv.stationName}</div>
          <div className="text-[11px] text-[#3A7A5A] mt-0.5">{cctv.location} 구역 CCTV</div>
        </div>
      </div>
    </div>
  )
}
