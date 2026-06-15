// 관측소 및 장소 기준값 (PRD 3.3 기반)
export const STATIONS = {
  YANGPO: {
    id: 'yangpo',
    name: '양포교',
    location: '구미시',
    lat: 36.1327,
    lng: 128.3614,
    thresholds: {
      normal: 1.6,
      caution: 3.5,
      warning: 5.0,
      critical: 6.5,
      designFlood: 6.5,
    },
  },
  HOGUK: {
    id: 'hoguk',
    name: '호국의다리',
    location: '칠곡군',
    lat: 35.9963,
    lng: 128.4022,
    thresholds: {
      normal: 2.0,
      caution: 4.5,
      warning: 6.0,
      critical: 8.0,
      designFlood: 8.0,
    },
  },
};

export const PLACES = [
  {
    id: 'camping',
    name: '구미 낙동강 오토캠핑장',
    type: 'camping',
    icon: '🏕️',
    stationId: 'yangpo',
    lat: 36.1280,
    lng: 128.3570,
    thresholds: { safe: 3.0, caution: 4.5 },
    amenities: ['주차장', '화장실', '샤워실', '취사장'],
  },
  {
    id: 'fishing',
    name: '양포교 낚시터',
    type: 'fishing',
    icon: '🎣',
    stationId: 'yangpo',
    lat: 36.1327,
    lng: 128.3614,
    thresholds: { safe: 2.5, caution: 3.5 },
    amenities: ['주차장', '화장실'],
  },
  {
    id: 'cycling',
    name: '낙동강 자전거길 4코스',
    type: 'cycling',
    icon: '🚴',
    stationId: 'yangpo',
    lat: 36.1200,
    lng: 128.3500,
    thresholds: { safe: 3.5, caution: 5.0 },
    amenities: ['자전거 보관대', '휴게소'],
  },
  {
    id: 'park',
    name: '칠곡 낙동강 둔치공원',
    type: 'walking',
    icon: '🚶',
    stationId: 'hoguk',
    lat: 35.9963,
    lng: 128.4022,
    thresholds: { safe: 3.0, caution: 4.5 },
    amenities: ['주차장', '화장실', '산책로', '운동기구'],
  },
];

// 수위 상태 판단
export const WATER_LEVEL_STATUS = {
  NORMAL: 'normal',
  CAUTION: 'caution',
  WARNING: 'warning',
  CRITICAL: 'critical',
};

export const STATUS_LABELS = {
  normal: '정상',
  caution: '주의',
  warning: '위험',
  critical: '심각',
};

export const STATUS_COLORS = {
  normal: { marker: '#1D9E75', bg: '#E1F5EE', text: '#0F6E56' },
  caution: { marker: '#EF9F27', bg: '#FEF3DC', text: '#7A4300' },
  warning: { marker: '#E24B4A', bg: '#FEEEEE', text: '#A32D2D' },
  critical: { marker: '#7A1F1F', bg: '#FEEEEE', text: '#7A1F1F' },
};

export function getStationStatus(stationId, level) {
  const station = Object.values(STATIONS).find((s) => s.id === stationId);
  if (!station) return WATER_LEVEL_STATUS.NORMAL;
  const { thresholds } = station;
  if (level >= thresholds.critical) return WATER_LEVEL_STATUS.CRITICAL;
  if (level >= thresholds.warning) return WATER_LEVEL_STATUS.WARNING;
  if (level >= thresholds.caution) return WATER_LEVEL_STATUS.CAUTION;
  return WATER_LEVEL_STATUS.NORMAL;
}

export function getPlaceStatus(place, stationLevel) {
  if (stationLevel > place.thresholds.caution) return WATER_LEVEL_STATUS.WARNING;
  if (stationLevel > place.thresholds.safe) return WATER_LEVEL_STATUS.CAUTION;
  return WATER_LEVEL_STATUS.NORMAL;
}
