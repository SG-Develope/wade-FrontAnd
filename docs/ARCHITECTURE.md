# ARCHITECTURE.md — 시스템 구조

## 전체 아키텍처

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│  프론트엔드   │────▶│    백엔드 API     │────▶│  외부 API            │
│  React+Vite  │     │  Spring Boot     │     │  낙동강홍수통제소      │
│  (Vercel)    │◀────│  (Railway)       │     │  기상청              │
└─────────────┘     └──────┬───────────┘     │  카카오맵             │
                           │                  │  Claude AI           │
                    ┌──────▼───────────┐     └─────────────────────┘
                    │   PostgreSQL     │
                    │   (Neon)         │
                    └──────────────────┘
```

## 프론트엔드

| 항목 | 기술 |
|---|---|
| 프레임워크 | React 18 |
| 빌드 도구 | Vite |
| 언어 | TypeScript |
| 서버 상태 | TanStack Query v5 |
| 클라이언트 상태 | Zustand |
| 라우팅 | React Router v6 |
| 차트 | Recharts |
| 지도 | 카카오맵 JavaScript API |
| HTTP | Axios |
| 스타일 | Tailwind CSS v4 |
| 배포 | Vercel |

### 폴더 구조

```
src/
├── api/            # Axios 인스턴스 + 도메인별 API 호출
│   ├── apiClient.ts
│   ├── waterLevel.ts
│   ├── weather.ts
│   └── aiGuide.ts
├── components/     # 재사용 UI 컴포넌트
│   ├── common/
│   ├── dashboard/
│   ├── trends/
│   ├── leisure/
│   └── weather/
├── constants/      # 관측소·장소 기준값
├── hooks/          # TanStack Query 커스텀 훅
├── pages/          # 탭별 페이지 컴포넌트
├── queryKeys/      # TanStack Query 키 팩토리
├── router/         # React Router 설정
├── stores/         # Zustand 스토어
└── utils/          # 공통 유틸 함수
```

### 데이터 흐름

```
외부 API → Spring Boot(@Scheduled 10분 폴링) → PostgreSQL
                                              ↓
React → TanStack Query(refetchInterval 10분) → Spring Boot REST API
```

## 백엔드

| 항목 | 기술 |
|---|---|
| 프레임워크 | Spring Boot 2.x |
| 언어 | Java 8 |
| ORM | MyBatis |
| 스케줄링 | @Scheduled |
| 배포 | Railway |

## 데이터베이스

| 항목 | 기술 |
|---|---|
| DB | PostgreSQL |
| 호스팅 | Neon (프리티어) |
| 주요 테이블 | stations, water_levels, places |

## 배포

| 구성요소 | 플랫폼 | 비고 |
|---|---|---|
| 프론트엔드 | Vercel | GitHub 연동, 자동 배포 |
| 백엔드 | Railway | Spring Boot JAR 자동 감지 |
| DB | Neon | PostgreSQL 프리티어 |
