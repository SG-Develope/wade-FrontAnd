import { useState } from 'react'
import CctvCard, { type CctvInfo } from './CctvCard'

interface Props {
  cctvList: CctvInfo[]
  onCctvClick: (cctv: CctvInfo) => void
}

export default function CctvSection({ cctvList, onCctvClick }: Props) {
  const [open, setOpen] = useState(true)

  return (
    <div className="bg-white border-t border-pebble shrink-0">
      <div className="flex items-center justify-between px-[18px] py-2.5">
        <span className="text-[10px] text-moss font-bold tracking-[0.05em]">
          <i className="ti ti-video text-[11px] mr-1" style={{ verticalAlign: '-1px' }} />
          CCTV 현장 영상
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] bg-river-light text-river px-2 py-0.5 rounded-full">낙동강홍수통제소</span>
          <button
            onClick={() => setOpen(o => !o)}
            className="w-5 h-5 flex items-center justify-center rounded-full bg-sand hover:bg-pebble transition-colors cursor-pointer"
          >
            <i className={`ti ${open ? 'ti-chevron-down' : 'ti-chevron-up'} text-moss`} style={{ fontSize: 10 }} />
          </button>
        </div>
      </div>

      {open && (
        <div className="px-[18px] pb-3 relative">
          <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {cctvList.map(cctv => (
              <div key={cctv.id} style={{ width: 150, flexShrink: 0 }}>
                <CctvCard cctv={cctv} onClick={onCctvClick} />
              </div>
            ))}
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(3px)' }}>
            <i className="ti ti-lock text-moss" style={{ fontSize: 20 }} />
            <span className="text-[12px] font-bold text-soil">CCTV API 발급 승인 대기중</span>
            <span className="text-[10px] text-moss opacity-70">낙동강홍수통제소 승인 후 실시간 영상 제공</span>
          </div>
        </div>
      )}
    </div>
  )
}
