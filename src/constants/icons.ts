/** 앱 전체 아이콘 중앙 관리 — Tabler Icons 클래스명 */
export const ICONS = {
  // 네비게이션
  dashboard:  'ti-map-pin',
  weather:    'ti-cloud',
  trends:     'ti-chart-line',
  leisure:    'ti-map-2',

  // 수위 상태
  normal:     'ti-circle-check',
  caution:    'ti-alert-circle',
  warning:    'ti-alert-triangle',
  critical:   'ti-shield-exclamation',

  // 활동
  walking:    'ti-walk',
  fishing:    'ti-fish',
  cycling:    'ti-bike',
  camping:    'ti-campfire',

  // UI
  chevronUp:    'ti-chevron-up',
  chevronDown:  'ti-chevron-down',
  chevronLeft:  'ti-chevron-left',
  chevronRight: 'ti-chevron-right',
  close:        'ti-x',
  retry:        'ti-refresh',
  lock:         'ti-lock',
  map:          'ti-map-2',
  chart:        'ti-chart-bar-off',
  alertCircle:  'ti-alert-circle',

  // 날씨
  sun:          'ti-sun',
  rain:         'ti-cloud-rain',
  wind:         'ti-wind',
  humidity:     'ti-droplet',

  // 관측소
  station:      'ti-antenna-bars-5',
  cctv:         'ti-video',
  river:        'ti-wave-saw-tool',
} as const

export type IconKey = keyof typeof ICONS

/** 날씨 이모지 */
export function getSkyEmoji(sky?: string): string {
  if (!sky) return '🌤️'
  if (sky.includes('맑음')) return '☀️'
  if (sky.includes('구름많음')) return '⛅'
  return '🌥️'
}

/** 활동 pill 정의 */
export const ACTIVITY_PILLS = [
  { key: 'walking' as const, icon: ICONS.walking, label: '산책' },
  { key: 'fishing' as const, icon: ICONS.fishing, label: '낚시' },
  { key: 'cycling' as const, icon: ICONS.cycling, label: '자전거' },
  { key: 'camping' as const, icon: ICONS.camping, label: '캠핑' },
]
