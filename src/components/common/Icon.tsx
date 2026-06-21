import {
  WalkingIcon, FishingIcon, CyclingIcon, CampingIcon,
  SunIcon, CloudRainIcon, WindIcon, DropletIcon,
  AlertCircleIcon, AlertTriangleIcon, ShieldIcon, CheckCircleIcon,
  ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon,
  LockIcon, RefreshIcon, VideoIcon, MapIcon, ChartIcon,
} from '@/assets/icons'

const ICON_MAP = {
  walking:      WalkingIcon,
  fishing:      FishingIcon,
  cycling:      CyclingIcon,
  camping:      CampingIcon,
  sun:          SunIcon,
  rain:         CloudRainIcon,
  wind:         WindIcon,
  humidity:     DropletIcon,
  caution:      AlertCircleIcon,
  warning:      AlertTriangleIcon,
  critical:     ShieldIcon,
  normal:       CheckCircleIcon,
  chevronUp:    ChevronUpIcon,
  chevronDown:  ChevronDownIcon,
  chevronLeft:  ChevronLeftIcon,
  chevronRight: ChevronRightIcon,
  lock:         LockIcon,
  retry:        RefreshIcon,
  cctv:         VideoIcon,
  map:          MapIcon,
  chart:        ChartIcon,
} as const

export type IconName = keyof typeof ICON_MAP

interface Props {
  name: IconName
  size?: number
  color?: string
  className?: string
}

export default function Icon({ name, size = 16, color = 'currentColor', className }: Props) {
  const Component = ICON_MAP[name]
  return <Component size={size} color={color} className={className} />
}
