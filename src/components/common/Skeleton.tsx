interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  rounded?: string
}

export default function Skeleton({ className = '', width, height, rounded = 'rounded-lg' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-[#EDE8E0] ${rounded} ${className}`}
      style={{ width, height }}
    />
  )
}

/** 테이블 행 스켈레톤 */
export function TableRowSkeleton({ cols = 4, rows = 8 }: { cols?: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-2 py-2 border-b border-[#F5F0EA]">
              <Skeleton height={12} width={j === 0 ? 80 : j === cols - 1 ? 50 : 60} />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

/** 카드 스켈레톤 */
export function CardSkeleton({ height = 80 }: { height?: number }) {
  return (
    <div className="border border-pebble rounded-[14px] p-4 flex flex-col gap-2">
      <Skeleton height={10} width={80} />
      <Skeleton height={height} />
    </div>
  )
}
