import apiClient from './apiClient'

/** camping_site 테이블 (구미·칠곡) — 백엔드 CampingSite 와 1:1 대응 */
export interface CampingSite {
  id: number

  // 기본
  facilityName: string
  category1: string | null
  category2: string | null
  category3: string | null

  // 주소
  sido: string | null
  sigungu: string | null
  eupmyeondong: string | null
  ri: string | null
  beonji: string | null
  roadName: string | null
  buildingNo: string | null
  latitude: number | null
  longitude: number | null
  zipcode: string | null
  roadAddress: string | null
  jibunAddress: string | null

  // 연락·운영주체
  phone: string | null
  homepage: string | null
  operator: string | null

  // 운영 여부
  openWeekday: boolean | null
  openWeekend: boolean | null
  openSpring: boolean | null
  openSummer: boolean | null
  openFall: boolean | null
  openWinter: boolean | null

  // 부대시설
  amenityElectricity: boolean | null
  amenityHotWater: boolean | null
  amenityWifi: boolean | null
  amenityFirewoodSale: boolean | null
  amenityWalkingTrail: boolean | null
  amenityWaterPlay: boolean | null
  amenityPlayground: boolean | null
  amenityMart: boolean | null

  // 부대시설 개수
  restroomCount: number | null
  showerCount: number | null
  sinkCount: number | null
  extinguisherCount: number | null

  // 주변 시설
  nearbyFishing: boolean | null
  nearbyWalkingTrail: boolean | null
  nearbyWaterBeach: boolean | null
  nearbyWaterLeisure: boolean | null
  nearbyWaterValley: boolean | null
  nearbyWaterRiver: boolean | null
  nearbyWaterPool: boolean | null
  nearbyYouthFacility: boolean | null
  nearbyRuralExperience: boolean | null
  nearbyChildrenPlay: boolean | null

  // 글램핑 옵션
  glampingBed: boolean | null
  glampingTv: boolean | null
  glampingFridge: boolean | null
  glampingInternet: boolean | null
  glampingInternalRestroom: boolean | null
  glampingAircon: boolean | null
  glampingHeater: boolean | null
  glampingCookingTools: boolean | null

  // 설명
  features: string | null
  description: string | null
  lastUpdated: string | null
}

export async function fetchCampingSites(): Promise<CampingSite[]> {
  const { data } = await apiClient.get<any[]>('/api/camping-sites')
  return data.map(item => ({
    ...item,
    facilityName: item.facilityName ?? item.facility_name ?? null,
    latitude:     item.latitude     ?? item.lat          ?? null,
    longitude:    item.longitude    ?? item.lng          ?? item.lon ?? null,
  }))
}
