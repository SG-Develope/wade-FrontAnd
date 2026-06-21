const TYPE_FILTER = [
  { key: 'all',     label: '전체',   icon: 'ti-map-2' },
  { key: 'camping', label: '캠핑',   icon: 'ti-tent'  },
  { key: 'fishing', label: '낚시',   icon: 'ti-fish'  },
  { key: 'cycling', label: '자전거', icon: 'ti-bike'  },
  { key: 'walking', label: '산책',   icon: 'ti-walk'  },
]

export { TYPE_FILTER }

interface Props {
  filter: string
  onFilterChange: (key: string) => void
}

export default function LeisureFilterBar({ filter, onFilterChange }: Props) {
  return (
    <div className="bg-white border-b border-pebble px-4 py-2.5 flex gap-1.5 shrink-0">
      {TYPE_FILTER.map(f => (
        <button
          key={f.key}
          onClick={() => onFilterChange(f.key)}
          className={`flex items-center gap-1 text-[11px] px-3 py-1 rounded-full border border-pebble cursor-pointer font-medium transition-all duration-150 ${
            filter === f.key ? 'bg-river text-white border-river' : 'bg-white text-moss'
          }`}
        >
          <i className={`ti ${f.icon} text-[12px]`} />
          {f.label}
        </button>
      ))}
    </div>
  )
}
