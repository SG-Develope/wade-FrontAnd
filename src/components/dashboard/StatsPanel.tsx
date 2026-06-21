import type { Station } from '@/types'

interface Props {
  stations: Station[]
}

export default function StatsPanel({ stations }: Props) {
  const total   = stations.length
  const danger  = stations.filter(s => s.status === 'warning' || s.status === 'critical').length
  const caution = stations.filter(s => s.status === 'caution').length
  const normal  = stations.filter(s => s.status === 'normal').length

  const items = [
    { label: '전체', value: total,   sub: '관측소',   color: '#2D3A1F', subColor: '#8A9A7A' },
    { label: '위험', value: danger,  sub: '↑ 상승중',  color: '#A32D2D', subColor: '#A32D2D' },
    { label: '주의', value: caution, sub: '관측중',   color: '#7A4300', subColor: '#EF9F27' },
    { label: '안전', value: normal,  sub: '안전해요', color: '#0F6E56', subColor: '#1D9E75' },
  ]

  return (
    <div className="grid grid-cols-2 mt-auto">
      {items.map((item, i) => (
        <div key={item.label} className="p-[12px] text-center"
          style={{
            borderTop:    '0.5px solid #EDE8E0',
            borderRight:  i % 2 === 0 ? '0.5px solid #F5F0EA' : 'none',
            borderBottom: i < 2 ? '0.5px solid #F5F0EA' : 'none',
          }}>
          <div className="text-[10px] text-moss mb-[2px]">{item.label}</div>
          <div className="text-[22px] font-bold leading-none" style={{ color: item.color }}>{item.value}</div>
          <div className="text-[10px] mt-[2px]" style={{ color: item.subColor }}>{item.sub}</div>
        </div>
      ))}
    </div>
  )
}
