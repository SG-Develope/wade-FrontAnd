import { NavLink, Outlet } from 'react-router-dom'
import './App.css'

const NAV_ITEMS = [
  { to: '/dashboard', label: '실시간 현황', icon: 'ti-map-pin' },
  { to: '/weather',   label: '날씨 레이더', icon: 'ti-cloud' },
  { to: '/trends',    label: '수위 추이',   icon: 'ti-chart-line' },
  { to: '/leisure',   label: '여가 지도',   icon: 'ti-map-2' },
]

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center bg-river overflow-hidden shrink-0">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path
            d="M3,17 Q7,13 10,10 Q13,7 17,5"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M3,13 Q6,11 9,12 Q12,13 17,10"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div>
        <div
          className="text-sm font-bold tracking-tight text-soil"
          style={{ fontFamily: "var(--font-gmarket)" }}
        >
          <span className="text-river">WADE</span>
        </div>
        <div className="text-[10px] text-moss hidden md:block">
          낙동강 실시간 수위 7 여가 안전
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-sand">

      {/* 데스크톱 상단 네비게이션 (md 이상) */}
      <nav className="hidden md:flex items-center px-6 border-b border-pebble bg-white shrink-0 h-[58px]">
        <div className="mr-8">
          <Logo />
        </div>
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

      {/* 모바일 상단 헤더 (md 미만) */}
      <div className="md:hidden flex items-center justify-between px-4 border-b border-pebble bg-white shrink-0 h-[48px]">
        <Logo />
        <div className="text-[10px] text-moss">낙동강 실시간 수위</div>
      </div>

      {/* 페이지 콘텐츠 */}
      <div className="flex-1 overflow-hidden pb-[56px] md:pb-0">
        <Outlet />
      </div>

      {/* 모바일 하단 탭바 (md 미만) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-pebble h-[56px] flex">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                'flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] transition-colors duration-150',
                isActive ? 'text-river' : 'text-moss',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <i className={`ti ${icon} text-[20px]`} />
                <span className={`font-${isActive ? 'semibold' : 'normal'}`}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

    </div>
  )
}
