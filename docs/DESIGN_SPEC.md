# DESIGN_SPEC.md — 화면 · 컴포넌트 명세 (v6 고도화)

> 목적: Figma에서 "무엇을 그릴지"를 확정하는 설계도. 그리기 전에 화면·컴포넌트·데이터 필드를 정의한다.
> 범위: 2026.08 고도화 신규/수정 화면. 디자인 토큰·기존 컴포넌트는 `DESIGN.md` 참조.
> 상태 표기: 🆕 신규 · ♻️ 기존 리뉴얼 · ✅ 유지(변경 없음)
> 작성: 2026.08.11 (8/12 세션에서 확정 예정 초안)

---

## 1. 화면 목록

| ID | 화면 | 경로 | 상태 | 로그인 | 주요 컴포넌트 | 핵심 데이터 |
|----|------|------|:---:|:---:|--------------|------------|
| S-01 | 여가지도 | `/leisure` | ♻️ | X | LeisureMap, LeisureFilterBar, PlaceList, MapLegend | places[], courses[] |
| S-02 | 캠핑장 상세 | `/leisure/:id` (모달) | 🆕 | X | PhotoCarousel, AmenityTags, FavoriteButton | place detail |
| S-03 | 로그인 | `/login` | 🆕 | X | KakaoLoginButton | — |
| S-04 | 회원가입/온보딩 | `/signup` | 🆕 | X | FormInput, PrimaryButton | nickname |
| S-05 | 마이페이지 | `/mypage` | 🆕 | O | ProfileHeader, FavoriteList, InquiryPreview | user, favorites[] |
| S-06 | 내 문의 목록 | `/mypage/inquiries` | 🆕 | O | InquiryItem, StatusBadge | inquiries[] |
| S-07 | 문의 작성 | `/inquiries/new` | 🆕 | O | FormInput, TextArea, PrimaryButton | title, content |
| S-08 | 문의 상세 | `/inquiries/:id` | 🆕 | O | InquiryDetail, AnswerBlock, StatusBadge | inquiry + answer |
| S-09 | 관리자 대시보드 | `/admin` | 🆕 | O(ADMIN) | UserTable, InquiryTable | users[], inquiries[] |
| S-10 | 관리자 문의 상세 | `/admin/inquiries/:id` | 🆕 | O(ADMIN) | InquiryDetail, AnswerForm | inquiry |
| S-11 | 공통 헤더 | (전역) | ♻️ | — | AuthNav (로그인↔프로필) | user |

> 실시간 현황·수위 추이·날씨 탭(✅)은 이번 범위에서 UI 변경 없음. 단 대시보드에 "여가장소 보기" 딥링크(S-01)만 추가.

---

## 2. 컴포넌트 인벤토리

> 한 번 그려서 여러 화면에 재사용하는 부품. 기존 코드 대응을 함께 명시.

| 컴포넌트 | 상태 | 사용 화면 | 배리언트/상태 | 데이터(props) | 기존 대응 |
|----------|:---:|-----------|--------------|---------------|-----------|
| PrimaryButton | 🆕 | S-04,07,10 | default / loading / disabled | label, onClick | — |
| KakaoLoginButton | 🆕 | S-03 | default | onClick | — |
| FormInput | 🆕 | S-04,07 | default / focus / error | label, value, error | — |
| TextArea | 🆕 | S-07 | default / error | value, maxLen | — |
| StatusBadge(문의) | 🆕 | S-06,08,09 | 대기 / 답변완료 / 종료 | status | `common/StatusBadge` 확장 |
| PlaceMarker | 🆕 | S-01 | 캠핑/낚시/기타 · 안전상태 | type, status, latlng | dashboard 마커 로직 참고 |
| CoursePolyline | 🆕 | S-01 | 자전거/산책 · 선택됨 | type, path[], selected | — |
| MapLegend | 🆕 | S-01 | — | items[] | — |
| PhotoCarousel | 🆕 | S-02 | 1장 / 여러장 | images[] | — |
| AmenityTags | 🆕 | S-02 | — | amenities[] | `leisure` 태그 참고 |
| FavoriteButton | 🆕 | S-02,05 | on / off / 비로그인 | active, onToggle | — |
| InquiryItem | 🆕 | S-06,09 | 대기 / 답변완료 | title, status, date | — |
| AnswerBlock | 🆕 | S-08 | 답변있음 / 없음 | answer, answeredAt | — |
| AnswerForm | 🆕 | S-10 | default / submitting | answer, onSubmit | — |
| AuthNav | ♻️ | S-11 | 비로그인 / 로그인 / 관리자 | user | 헤더 확장 |
| LeisureFilterBar | ♻️ | S-01 | 캠핑/자전거/산책 토글 | active[], onChange | `leisure/LeisureFilterBar` |
| PlaceList | ♻️ | S-01 | 기본 / 선택 / 빈상태 | items[], selectedId | `leisure/PlaceList` |

---

## 3. 화면별 상세 (예시 — 대표 3개)

### S-01 여가지도 ♻️

**레이아웃(데스크톱):** 좌측 지도(70%) + 우측 리스트 사이드바(30%), 지도 상단 필터바, 지도 우하단 범례.

**요소**
- 필터바: 캠핑 / 자전거 / 산책 토글 (다중 선택)
- 지도: 캠핑장·낚시터 = 마커(PlaceMarker) / 자전거길·산책로 = 선(CoursePolyline)
- 범례(MapLegend): 종류별 색·아이콘
- 리스트(PlaceList): 장소/코스 카드, 지도와 hover·선택 연동
- 마커/카드 클릭 → 캠핑장 상세(S-02) 모달

**데이터 필드**
- place: `id, type(camping|fishing), name, lat, lng, addr, amenities[], images[], stationId, status`
- course: `id, type(bike|walk), name, path[[lng,lat]...], stationId`

**상태:** 로딩(스켈레톤) / 정상 / 필터 결과 없음(빈상태) / 지도 로드 실패(fallback)

---

### S-03 로그인 🆕

**레이아웃:** 중앙 정렬 카드. 로고 + 한 줄 소개 + 카카오 로그인 버튼 + (약관 안내).

**요소**
- 로고 / 서비스 슬로건
- KakaoLoginButton (전체폭, `#FEE500`)
- 하단: "로그인 시 이용약관 동의" 텍스트

**흐름:** 버튼 클릭 → 카카오 인가 → 콜백 → (신규면 S-04 온보딩) → 이전 화면 복귀

**상태:** default / 로그인 진행중(loading) / 실패(에러 토스트)

---

### S-09 관리자 대시보드 🆕

**레이아웃:** 상단 탭(사용자 / 문의) + 하단 테이블 영역.

**요소**
- 탭: [사용자 목록] [문의 관리]
- UserTable: 닉네임 · 이메일 · 가입일 · role
- InquiryTable: 제목 · 작성자 · 상태(StatusBadge) · 작성일 · [답변]
- 행 클릭 → 관리자 문의 상세(S-10)

**데이터 필드**
- user: `id, nickname, email, role, createdAt`
- inquiry: `id, title, userNickname, status, createdAt`

**상태:** 로딩 / 정상 / 빈 목록 / 비인가 접근(라우트 가드로 차단)

---

## 4. 다음 단계

1. 이 명세로 Figma 페이지 구조 확정 (①토큰 ②컴포넌트 ③화면)
2. 컴포넌트 인벤토리 → Figma 컴포넌트로 먼저 작화
3. 화면별 상세 → 고해상도 화면 조립
4. Figma MCP로 토큰·컴포넌트 코드 변환 검증

> 나머지 화면(S-02,04,05,06,07,08,10,11)도 위 "화면별 상세" 형식으로 8/12 세션에서 채운다. 이 문서는 그 형식의 예시.
