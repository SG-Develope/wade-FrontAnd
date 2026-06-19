import { NavLink, Outlet } from 'react-router-dom'
import './App.css'

const NAV_ITEMS = [
  { to: '/dashboard', label: '실시간 현황', icon: 'ti-map-pin' },
  { to: '/weather',   label: '날씨 레이더', icon: 'ti-cloud' },
  { to: '/trends',    label: '수위 추이',   icon: 'ti-chart-line' },
  { to: '/leisure',   label: '여가 지도',   icon: 'ti-map-2' },
]

export default function App() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-sand">
      {/* ─── 상단 네비게이션 ─── */}
      <nav className="flex items-center px-6 border-b border-pebble bg-white shrink-0 h-[58px]">
        {/* 로고 */}
        <div className="flex items-center gap-2.5 mr-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-river overflow-hidden">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3,17 Q7,13 10,10 Q13,7 17,5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M3,13 Q6,11 9,12 Q12,13 17,10" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-soil" style={{ fontFamily: 'var(--font-gmarket)' }}>
              <span className="text-river">강변</span>날씨
            </div>
            <div className="text-[10px] text-moss">낙동강 실시간 수위 · 여가 안전</div>
          </div>
        </div>

        {/* 탭 목록 */}
        <div className="flex items-center">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  'flex items-center gap-1.5 px-3.5 text-[13px] h-[58px] border-b-2 transition-colors duration-150',
                  isActive
                    ? 'border-river text-river font-semibold'
                    : 'border-transparent text-moss hover:text-soil',
                ].join(' ')
              }
            >
              <i className={`ti ${icon} text-[14px]`} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* ─── 페이지 콘텐츠 ─── */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}
