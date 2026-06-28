interface SvgProps {
  size?: number
  color?: string
  className?: string
}

const base = (paths: string) => ({ size = 24, color = 'currentColor', className = '' }: SvgProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    className={className}
    dangerouslySetInnerHTML={{ __html: paths }}
  />
)

// ── 활동 ──────────────────────────────────────────────
export const WalkingIcon = base(`
  <circle cx="13" cy="4" r="1"/>
  <path d="M7 21l3-4 2 1 2-4"/>
  <path d="M11.5 11.5 13 7l3 3h2"/>
  <path d="M7 12l1-4"/>
`)

export const FishingIcon = base(`
  <path d="M16 9l-3 3 2 5-5-5-6 6"/>
  <path d="M21.347 5.24a1.96 1.96 0 0 0-2.588-2.588"/>
  <circle cx="20" cy="4" r="1"/>
`)

export const CyclingIcon = base(`
  <circle cx="5" cy="17" r="3"/>
  <circle cx="19" cy="17" r="3"/>
  <path d="M5 17l3-8h7l2 5h-8"/>
  <circle cx="14" cy="6" r="1"/>
`)

export const CampingIcon = base(`
  <path d="M4 20l8-16 8 16H4z"/>
  <path d="M8.5 20l3.5-7 3.5 7"/>
  <line x1="12" y1="15" x2="12" y2="20"/>
`)

// ── 날씨 ──────────────────────────────────────────────
export const SunIcon = base(`
  <circle cx="12" cy="12" r="4"/>
  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
`)

export const CloudRainIcon = base(`
  <path d="M16 13v8M8 13v8M12 15v8"/>
  <path d="M17.5 9a5.5 5.5 0 0 0-11 0 4 4 0 0 0 0 8h11a4 4 0 0 0 0-8z"/>
`)

export const WindIcon = base(`
  <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/>
  <path d="M9.6 4.6A2 2 0 1 1 11 8H2"/>
  <path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>
`)

export const DropletIcon = base(`
  <path d="M12 2C6.48 7.74 4 11.17 4 14a8 8 0 0 0 16 0c0-2.83-2.48-6.26-8-12z"/>
`)

// ── 상태 ──────────────────────────────────────────────
export const EyeIcon = base(`
  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
  <circle cx="12" cy="12" r="3"/>
`)

export const AlertCircleIcon = base(`
  <circle cx="12" cy="12" r="10"/>
  <line x1="12" y1="8" x2="12" y2="12"/>
  <line x1="12" y1="16" x2="12.01" y2="16"/>
`)

export const AlertTriangleIcon = base(`
  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
  <line x1="12" y1="9" x2="12" y2="13"/>
  <line x1="12" y1="17" x2="12.01" y2="17"/>
`)

export const ShieldIcon = base(`
  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  <line x1="12" y1="8" x2="12" y2="12"/>
  <line x1="12" y1="16" x2="12.01" y2="16"/>
`)

export const CheckCircleIcon = base(`
  <circle cx="12" cy="12" r="10"/>
  <path d="M9 12l2 2 4-4"/>
`)

// ── UI ────────────────────────────────────────────────
export const ChevronUpIcon    = base(`<polyline points="18 15 12 9 6 15"/>`)
export const ChevronDownIcon  = base(`<polyline points="6 9 12 15 18 9"/>`)
export const ChevronLeftIcon  = base(`<polyline points="15 18 9 12 15 6"/>`)
export const ChevronRightIcon = base(`<polyline points="9 18 15 12 9 6"/>`)
export const LockIcon         = base(`<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`)
export const RefreshIcon      = base(`<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>`)
export const VideoIcon        = base(`<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>`)
export const MapIcon          = base(`<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>`)
export const ChartIcon        = base(`<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>`)
