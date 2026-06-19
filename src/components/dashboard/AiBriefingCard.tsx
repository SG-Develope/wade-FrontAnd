import type { AiGuide } from '@/types'

interface Props {
  guide: AiGuide | undefined
  isLoading: boolean
  isError: boolean
  onRetry: () => void
}

export default function AiBriefingCard({ guide, isLoading, isError, onRetry }: Props) {
  return (
    <div className="rounded-[14px] border border-[#B8E0CC] p-3 mb-1 bg-gradient-to-br from-[#F0F9F5] to-[#E8F7EF]">
      {/* 헤더 */}
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-[10px] font-bold text-river-deep bg-river-light border border-[#9FE1CB] rounded-full px-2 py-0.5">
          AI 안전 브리핑
        </span>
        {isLoading && <span className="text-[10px] text-moss">분석 중...</span>}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-1.5">
          {[100, 85, 60].map((w, i) => (
            <div key={i} className="h-2.5 rounded bg-[#C8E8D0] opacity-60" style={{ width: `${w}%` }} />
          ))}
        </div>
      ) : isError ? (
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-moss">AI 안내를 불러오지 못했습니다.</span>
          <button
            onClick={onRetry}
            className="text-[11px] text-river bg-river-light border border-[#9FE1CB] rounded-full px-2.5 py-1 cursor-pointer"
          >
            재시도
          </button>
        </div>
      ) : (
        <p className="text-[12px] text-[#2D5A40] leading-[1.75] m-0">
          {guide?.message ?? '현재 수위 데이터를 불러오는 중입니다.'}
        </p>
      )}
    </div>
  )
}
