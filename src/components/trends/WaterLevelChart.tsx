import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'
import type { WaterLevelHistory } from '@/types'

interface Props {
  data: WaterLevelHistory[]
  stationId: string
  normalLevel: number
  cautionLevel: number
  warningLevel: number
}

const COLORS = {
  yangpo: '#1D9E75',
  hoguk: '#4A90C4',
}

export default function WaterLevelChart({ data, stationId, normalLevel, cautionLevel, warningLevel }: Props) {
  const color = COLORS[stationId as keyof typeof COLORS] ?? '#1D9E75'

  const chartData = data.map(d => ({
    time: new Date(d.measuredAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    level: d.level,
    status: d.status,
  }))

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props
    if (payload.status === 'normal') return null
    const dotColor = payload.status === 'caution' ? '#EF9F27'
      : payload.status === 'warning' ? '#E24B4A' : '#7A1F1F'
    return <circle cx={cx} cy={cy} r={3} fill={dotColor} />
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id={`grad-${stationId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#EDE8E0" />
        <XAxis
          dataKey="time"
          tick={{ fontSize: 9, fill: '#8A9A7A' }}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 9, fill: '#8A9A7A' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={v => `${v}m`}
        />
        <Tooltip
          formatter={(v: any) => [`${(v as number).toFixed(2)}m`, '수위']}
          contentStyle={{
            background: '#fff', border: '0.5px solid #EDE8E0',
            borderRadius: 8, fontSize: 11,
          }}
        />
        {/* 평상수위 기준선 */}
        <ReferenceLine y={normalLevel} stroke="#8A9A7A" strokeDasharray="4 2" label={{ value: '평상', fontSize: 9, fill: '#8A9A7A' }} />
        <ReferenceLine y={cautionLevel} stroke="#EF9F27" strokeDasharray="4 2" label={{ value: '주의', fontSize: 9, fill: '#EF9F27' }} />
        <ReferenceLine y={warningLevel} stroke="#E24B4A" strokeDasharray="4 2" label={{ value: '위험', fontSize: 9, fill: '#E24B4A' }} />

        <Area
          type="monotone"
          dataKey="level"
          stroke={color}
          strokeWidth={2}
          fill={`url(#grad-${stationId})`}
          dot={<CustomDot />}
          activeDot={{ r: 4, fill: color }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
