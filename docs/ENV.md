# ENV.md — 환경변수 목록

> 실제 값은 절대 이 파일에 작성하지 않습니다.
> 값은 각자 `.env` 파일에 보관 (git 제외)

---

## 프론트엔드 (.env)

| 키 | 필수 | 설명 |
|---|---|---|
| `VITE_PUBLIC_DATA_API_KEY` | ✅ | 공공데이터포털 인증키 (Decoding) |
| `VITE_WEATHER_API_KEY` | ✅ | 기상청 API 인증키 (공공데이터포털) |
| `VITE_KAKAO_MAP_KEY` | ✅ | 카카오 JavaScript 앱키 |
| `VITE_API_BASE_URL` | ✅ | 백엔드 API URL (로컬: `http://localhost:8080`) |

> Vite 환경변수는 반드시 `VITE_` 접두사 필요
> 코드에서 `import.meta.env.VITE_KEY_NAME` 으로 접근

---

## 백엔드 (application.properties / Railway 환경변수)

| 키 | 필수 | 설명 |
|---|---|---|
| `DB_URL` | ✅ | Neon PostgreSQL 연결 URL |
| `DB_USERNAME` | ✅ | DB 사용자명 |
| `DB_PASSWORD` | ✅ | DB 비밀번호 |
| `PUBLIC_DATA_API_KEY` | ✅ | 공공데이터포털 인증키 |
| `CLAUDE_API_KEY` | ✅ | Anthropic Claude API 키 |
| `KAKAO_REST_API_KEY` | ❌ | 카카오 REST API 키 (주소검색 필요 시) |

---

## 카카오맵 도메인 설정

API 키 외에 카카오 디벨로퍼스에서 허용 도메인 등록 필요:

| 환경 | 도메인 |
|---|---|
| 개발 | `http://localhost:5173` |
| 운영 | Vercel 배포 도메인 |
