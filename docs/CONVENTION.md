# CONVENTION.md — 코딩 컨벤션 & 협업 규칙

## 파일 & 폴더 네이밍

| 대상 | 규칙 | 예시 |
|---|---|---|
| 컴포넌트 파일 | PascalCase | `StationCard.tsx` |
| 훅 파일 | camelCase, `use` 접두사 | `useWaterLevels.ts` |
| 유틸 파일 | camelCase | `formatLevel.ts` |
| 상수 파일 | camelCase | `stations.ts` |
| 폴더 | camelCase | `queryKeys/` |

---

## 컴포넌트 작성 규칙

```tsx
// ✅ 함수형 컴포넌트 + named export
export default function StationCard({ station }: StationCardProps) {}

// ✅ Props 타입은 컴포넌트 바로 위에 선언
interface StationCardProps {
  station: Station;
  onClick?: () => void;
}

// ❌ default export + 익명 함수 지양
export default () => {}
```

---

## Import 순서

```ts
// 1. React
import { useState, useEffect } from 'react';

// 2. 외부 라이브러리
import { useQuery } from '@tanstack/react-query';

// 3. 내부 모듈 (@/ alias)
import { queryKeys } from '@/queryKeys';
import apiClient from '@/api/apiClient';

// 4. 컴포넌트
import StationCard from '@/components/dashboard/StationCard';

// 5. 타입
import type { Station } from '@/types';
```

---

## 브랜치 전략

```
main          ← 배포 브랜치 (직접 push 금지)
  └─ dev      ← 개발 통합 브랜치
       └─ feature/기능명   ← 기능 개발
       └─ fix/버그명       ← 버그 수정
```

**예시**
```
feature/dashboard-water-card
feature/trends-chart
fix/station-modal-close
```

---

## 커밋 메시지 규칙

```
타입: 한글 또는 영문 설명
```

| 타입 | 용도 |
|---|---|
| `feat` | 새 기능 추가 |
| `fix` | 버그 수정 |
| `style` | CSS, 스타일 변경 |
| `refactor` | 리팩토링 (기능 변경 없음) |
| `chore` | 설정, 패키지 변경 |
| `docs` | 문서 수정 |

**예시**
```
feat: 양포교 수위 카드 컴포넌트 추가
fix: 관측소 모달 닫기 버튼 클릭 안 되는 문제 수정
style: 수위 상태 배지 컬러 PRD 기준으로 수정
chore: Tailwind v4 설치 및 테마 설정
```

---

## TypeScript 규칙

```ts
// ✅ 명시적 타입 선언
const level: number = 1.8;

// ✅ any 사용 금지 → unknown 또는 정확한 타입 사용
function parse(data: unknown) {}

// ✅ 타입은 interface, 유니온은 type
interface Station { id: string; name: string; }
type Status = 'normal' | 'caution' | 'warning' | 'critical';

// ❌ as any 사용 금지
const data = response as any;
```

---

## API 호출 규칙

- 모든 API 호출은 `src/api/` 에서만
- 컴포넌트에서 직접 `apiClient.get()` 호출 금지
- 반드시 `src/hooks/` 의 TanStack Query 훅을 통해 사용
