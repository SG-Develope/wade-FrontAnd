export interface CctvInfo {
  id: string
  name: string
  location: string
  level: string
  statusLabel: string
  textColor: string
  markerColor: string
  stationId: string
  stationName: string
  lat: number
  lng: number
  streamUrl: string | null
}

interface Props {
  cctv: CctvInfo
  onClick: (cctv: CctvInfo) => void
}

export default function CctvCard({ cctv, onClick }: Props) {
  return (
    <div
      onClick={() => onClick(cctv)}
      className="flex-1 rounded-xl overflow-hidden cursor-pointer border border-pebble bg-[#0f1a0f] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md group"
    >
      <div className="relative h-20.5">
        <div className="w-full h-full bg-[#0f1a0f] flex flex-col items-center justify-center gap-1.5">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <i className="ti ti-player-play text-white/70 text-[14px]" />
          </div>
          <span className="text-[9px] text-white/40 font-medium tracking-wide">클릭하여 재생</span>
        </div>
        <div className="absolute top-1.5 left-1.5 bg-danger text-white text-[8px] px-1.5 py-0.5 rounded-lg font-bold flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-white animate-pulse inline-block" />
          LIVE
        </div>
        <div className="absolute inset-0 bg-river/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <i className="ti ti-arrows-maximize text-white text-xl" />
        </div>
      </div>

      <div className="px-2.5 py-2 bg-white">
        <div className="text-[12px] font-semibold text-soil truncate">{cctv.name}</div>
        <div className="text-[10px] mt-0.5 text-moss">{cctv.stationName} · <span className="text-river font-semibold">{cctv.level}</span></div>
      </div>
    </div>
  )
}
