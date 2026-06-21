const STATIONS_META = [
  { id: 'yangpo', label: '양포교',     color: '#1D9E75' },
  { id: 'hoguk',  label: '호국의다리', color: '#4A90C4' },
]
const HOURS_OPTIONS = [6, 12, 24, 48]

interface Props {
  selectedStation: string
  hours: number
  onStationChange: (id: string) => void
  onHoursChange: (h: number) => void
}

export { STATIONS_META, HOURS_OPTIONS }

export default function StationHoursSelector({ selectedStation, hours, onStationChange, onHoursChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
      {STATIONS_META.map(s => (
        <button
          key={s.id}
          onClick={() => onStationChange(s.id)}
          className="flex items-center gap-1 text-[11px] px-3 py-1 rounded-full cursor-pointer border transition-all duration-150"
          style={{
            borderColor: selectedStation === s.id ? s.color : '#EDE8E0',
            background:  selectedStation === s.id ? s.color : '#fff',
            color:       selectedStation === s.id ? '#fff' : '#8A9A7A',
            fontWeight: 500,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: selectedStation === s.id ? '#fff' : s.color }} />
          {s.label}
        </button>
      ))}
      <div className="ml-auto flex gap-1">
        {HOURS_OPTIONS.map(h => (
          <button
            key={h}
            onClick={() => onHoursChange(h)}
            className={`text-[11px] px-2.5 py-1 rounded-full border border-pebble cursor-pointer transition-colors ${hours === h ? 'bg-sand text-soil font-semibold' : 'bg-white text-moss'}`}
          >
            {h}h
          </button>
        ))}
      </div>
    </div>
  )
}
