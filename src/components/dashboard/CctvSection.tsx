import CctvCard, { type CctvInfo } from './CctvCard'

interface Props {
  cctvList: CctvInfo[]
  onCctvClick: (cctv: CctvInfo) => void
}

export default function CctvSection({ cctvList, onCctvClick }: Props) {
  return (
    <div className="bg-white border-t border-pebble px-[18px] py-3 shrink-0">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[10px] text-moss font-bold tracking-[0.05em]">
          <i className="ti ti-video text-[11px] mr-1" style={{ verticalAlign: '-1px' }} />
          CCTV 현장 영상
        </span>
        <span className="text-[9px] bg-river-light text-river px-2 py-0.5 rounded-full">낙동강홍수통제소</span>
      </div>
      <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {cctvList.map(cctv => (
          <div key={cctv.id} style={{ width: 150, flexShrink: 0 }}>
            <CctvCard cctv={cctv} onClick={onCctvClick} />
          </div>
        ))}
      </div>
    </div>
  )
}
