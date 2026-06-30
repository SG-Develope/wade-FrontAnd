import { useState } from 'react'
import CctvCard, { type CctvInfo } from './CctvCard'

interface Props {
  cctvList: CctvInfo[]
  onCctvClick: (cctv: CctvInfo) => void
}

export default function CctvSection({ cctvList, onCctvClick }: Props) {
  const [open, setOpen] = useState(true)

  return (
    <div className="bg-white border-t border-pebble shrink-0 overflow-hidden">
      <div className="flex items-center justify-between px-[18px] py-2.5">
        <span className="text-[10px] text-moss font-bold tracking-[0.05em]">
          <i className="ti ti-video text-[11px] mr-1 -mb-px" />
          CCTV 현장 영상
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] bg-river-light text-river px-2 py-0.5 rounded-full">낙동강홍수통제소</span>
          <button
            onClick={() => setOpen(o => !o)}
            className="w-5 h-5 flex items-center justify-center rounded-full bg-sand hover:bg-pebble transition-colors cursor-pointer"
          >
            <i className={`ti ${open ? 'ti-chevron-down' : 'ti-chevron-up'} text-moss text-[10px]`} />
          </button>
        </div>
      </div>

      <div
        style={{
          maxHeight: open ? '200px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.22s ease',
        }}
      >
        <div className="px-[18px] pb-3">
          <div className="flex gap-2 overflow-x-auto pb-1.5" style={{ scrollbarWidth: 'thin', scrollbarColor: '#b8ccb0 transparent' }}>
            {cctvList.length > 0 ? cctvList.map(cctv => (
              <div key={cctv.id} className="w-37.5 shrink-0">
                <CctvCard cctv={cctv} onClick={onCctvClick} />
              </div>
            )) : (
              <div className="flex-1 flex items-center justify-center text-[12px] text-moss opacity-60 h-[106px]">
                CCTV 데이터를 불러오는 중...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
