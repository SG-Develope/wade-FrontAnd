import { useState } from 'react'
import { useWaterLevels } from '@/queries/useWaterLevelQuery'
import { usePlaces } from '@/queries/usePlaceQuery'
import LeisureFilterBar from '@/components/leisure/LeisureFilterBar'
import LeisureMap from '@/components/leisure/LeisureMap'
import PlaceList from '@/components/leisure/PlaceList'
import LeisureSidebar from '@/components/leisure/LeisureSidebar'

export default function Leisure() {
  const [filter, setFilter]     = useState('all')
  const [selected, setSelected] = useState<string | null>(null)

  const { data: waterData } = useWaterLevels()
  const { data: placesData, isLoading: placesLoading } = usePlaces()

  const stations = waterData ?? []
  const places   = placesData ?? []

  const getLevel = (stationId: string) => stations.find(s => s.id === stationId)?.currentLevel ?? null

  const filtered = places.filter(p => filter === 'all' || p.type === filter)
  const selectedPlace = places.find(p => p.id === selected)

  return (
    <div className="flex h-full overflow-hidden relative">
      {/* 컨텐츠 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <LeisureFilterBar filter={filter} onFilterChange={setFilter} />

        <LeisureMap
          places={places}
          stations={stations}
          onPlaceSelect={setSelected}
        />

        <PlaceList
          places={filtered}
          isLoading={placesLoading}
          selected={selected}
          getLevel={getLevel}
          onSelect={id => setSelected(id)}
        />
      </div>

      <LeisureSidebar
        places={places}
        selectedPlace={selectedPlace}
        getLevel={getLevel}
        onSelect={setSelected}
        onDeselect={() => setSelected(null)}
      />

      {/* 준비 중 오버레이 */}
      <div
        className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-3"
        style={{ background: 'rgba(245,247,244,0.88)', backdropFilter: 'blur(4px)' }}
      >
        <div className="w-14 h-14 rounded-2xl bg-white border border-pebble flex items-center justify-center shadow-sm">
          <i className="ti ti-map-2 text-river" style={{ fontSize: 28 }} />
        </div>
        <div className="text-[15px] font-bold text-soil">여가 지도 준비 중</div>
        <div className="text-[12px] text-moss opacity-70 text-center leading-relaxed">
          낙동강 주변 여가 시설 정보를<br />준비하고 있습니다
        </div>
      </div>
    </div>
  )
}
