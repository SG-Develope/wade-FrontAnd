# DESIGN.md — 디자인 시스템

## 컬러 팔레트

### 브랜드 컬러

| 토큰 | Hex | Tailwind 클래스 | 용도 |
|---|---|---|---|
| `river` | `#1D9E75` | `bg-river` `text-river` | 메인, 안전 상태, 활성 탭 |
| `river-mid` | `#5DCAA5` | `bg-river-mid` | 보조 강조, 아이콘 |
| `river-light` | `#E1F5EE` | `bg-river-light` | 안전 상태 배경, 태그 |
| `river-deep` | `#085041` | `text-river-deep` | 진한 텍스트 |

### 수위 경보 단계

| 단계 | 마커/뱃지 | 배경 | 텍스트 |
|---|---|---|---|
| 정상 | `#1D9E75` | `#E1F5EE` | `#0F6E56` |
| 주의 | `#EF9F27` | `#FEF3DC` | `#7A4300` |
| 위험 | `#E24B4A` | `#FEEEEE` | `#A32D2D` |
| 심각 | `#7A1F1F` | `#FEEEEE` | `#7A1F1F` |

### 기본 UI

| 토큰 | Hex | 용도 |
|---|---|---|
| `sand` | `#F7F4EF` | 페이지 배경 |
| `pebble` | `#EDE8E0` | 카드 보더, 구분선 |
| `soil` | `#2D3A1F` | 기본 텍스트 |
| `moss` | `#8A9A7A` | 보조 텍스트, 타임스탬프 |
| `sky` | `#EBF5FB` | 날씨 카드 배경 |

---

## 타이포그래피

| 역할 | 폰트 | 굵기 | 크기 |
|---|---|---|---|
| 로고·타이틀 | Gmarket Sans | 700 | - |
| 본문 | Pretendard | 400~600 | - |
| 수치 강조 | Pretendard | 700 | 18~22px |
| 보조 텍스트 | Pretendard | 400 | 10~11px |

### 폰트 로드 (index.html에 추가)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gmarket-sans@1.0.0/css/gmarket-sans.css" />
```

---

## 수위 상태별 컴포넌트 스타일

```tsx
const statusStyle = {
  normal:  'bg-[#E1F5EE] text-[#0F6E56] border-[#1D9E75]',
  caution: 'bg-[#FEF3DC] text-[#7A4300] border-[#EF9F27]',
  warning: 'bg-[#FEEEEE] text-[#A32D2D] border-[#E24B4A]',
  critical:'bg-[#FEEEEE] text-[#7A1F1F] border-[#7A1F1F]',
};
```

---

## 탭 네비게이션

| 탭 | 경로 | 아이콘 |
|---|---|---|
| 실시간 현황 | `/dashboard` | 🌊 |
| 수위 추이 | `/trends` | 📈 |
| 여가 지도 | `/leisure` | 🗺️ |
| 날씨·레이더 | `/weather` | 🌤️ |

---

## 디자인 원칙

- 앱 진입 3초 안에 안전/주의/위험 파악 가능
- 색상만으로 상태 구분하지 않고 텍스트 레이블 병행
- CCTV·레이더 미연결 시 fallback UI 제공, 앱 중단 없음
- 데스크탑 중심 설계, 모바일 기본 대응
