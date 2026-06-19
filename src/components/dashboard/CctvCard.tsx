export interface CctvInfo {
  id: string
  name: string
  location: string
  level: string
  statusLabel: string
  textColor: string
  markerColor: string
  stationId: string
}

interface Props {
  cctv: CctvInfo
  onClick: (cctv: CctvInfo) => void
}

export default function CctvCard({ cctv, onClick }: Props) {
  return (
    <div
      onClick={() => onClick(cctv)}
      className="rounded-xl overflow-hidden cursor-pointer border border-pebble bg-[#0f1a0f] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md group"
      style={{ flex: '1 1 0' }}
    >
      {/* 썸네일 */}
      <div className="relative" style={{ height: 82 }}>
        <svg width="100%" height="82" viewBox="0 0 200 82" preserveAspectRatio="xMidYMid slice">
          <rect width="200" height="82" fill="#0f1a0f"/>
          <rect x="14" y="28" width="86" height="40" fill="#1a2e1a" rx="3"/>
          <rect x="106" y="34" width="78" height="34" fill="#162616" rx="3"/>
          <path d="M0,56 Q50,50 100,54 Q150,58 200,50" stroke="#5DCAA5" strokeWidth="2.5" fill="none" opacity="0.7"/>
          <path d="M0,66 Q50,61 100,64 Q150,67 200,61" stroke="#5DCAA5" strokeWidth="1.5" fill="none" opacity="0.4"/>
        </svg>
        {/* LIVE 배지 */}
        <div className="absolute top-1.5 left-1.5 bg-danger text-white text-[8px] px-1.5 py-0.5 rounded-lg font-bold flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-white animate-pulse inline-block" />
          LIVE
        </div>
        {/* hover overlay */}
        <div className="absolute inset-0 bg-[#1D9E75]/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <i className="ti ti-arrows-maximize text-white text-xl" />
        </div>
      </div>

      {/* 정보 */}
      <div className="px-2.5 py-2 bg-white">
        <div className="text-[12px] font-semibold text-soil">{cctv.name}</div>
        <div className="text-[10px] mt-0.5" style={{ color: cctv.textColor }}>
          {cctv.statusLabel} · {cctv.level}
        </div>
      </div>
    </div>
  )
}
