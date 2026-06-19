import type { WaterStatus } from '@/types'

const COLOR: Record<WaterStatus, string> = {
  normal:   '#1D9E75',
  caution:  '#EF9F27',
  warning:  '#E24B4A',
  critical: '#7A1F1F',
}

export default function StatusDot({ status, size = 8 }: { status: WaterStatus; size?: number }) {
  return (
    <span
      className="inline-block rounded-full shrink-0"
      style={{
        width: size,
        height: size,
        background: COLOR[status] ?? COLOR.normal,
      }}
    />
  )
}
