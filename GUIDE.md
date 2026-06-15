# WADE 프로젝트 API 연동 가이드

> 이 파일은 직접 구현하기 위한 가이드입니다.
> 코드를 복붙하지 말고, 이해하고 직접 작성하세요.

---

## 0. .env 파일 먼저 세팅하기

프로젝트 루트(`wade/`)에 `.env` 파일을 만들고 아래처럼 키를 넣어요.
(`.env`는 절대 git에 올리면 안 됩니다 — `.gitignore`에 이미 들어있는지 확인!)

```
# 공공데이터포털 인증키 (낙동강홍수통제소 + 기상청 공통 사용)
VITE_PUBLIC_DATA_API_KEY=여기에_디코딩된_인증키_붙여넣기

# 카카오 JavaScript 앱키 (REST 앱키 아님! JS 앱키)
VITE_KAKAO_MAP_KEY=여기에_카카오_JS_앱키

# 백엔드 URL (나중에 Spring Boot 연동할 때)
VITE_API_BASE_URL=http://localhost:8080
```

> **주의:** Vite에서는 환경변수 이름이 반드시 `VITE_`로 시작해야 합니다.
> 코드에서는 `import.meta.env.VITE_PUBLIC_DATA_API_KEY`로 접근해요.

---

## 1. 기상청 단기예보 API

### 1-1. API 정보

- **포털:** 공공데이터포털 → "기상청_단기예보 ((구)동네예보) 조회서비스"
- **엔드포인트:** `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst`
- **갱신 주기:** 하루 8회 (02, 05, 08, 11, 14, 17, 20, 23시 발표)

### 1-2. 핵심 파라미터

| 파라미터 | 설명 | 예시값 |
|---|---|---|
| `serviceKey` | 공공데이터 API 키 (디코딩된 것) | .env에서 가져옴 |
| `numOfRows` | 한 번에 가져올 데이터 수 | `100` |
| `pageNo` | 페이지 번호 | `1` |
| `dataType` | 응답 형식 | `JSON` |
| `base_date` | 발표 날짜 (YYYYMMDD) | `20260615` |
| `base_time` | 발표 시각 | `0500` |
| `nx` | 예보 격자 X | 구미: `64` |
| `ny` | 예보 격자 Y | 구미: `111` |

> **격자좌표란?** 기상청은 위경도 대신 자체 격자(nx, ny)를 씁니다.
> 구미시 기준: nx=64, ny=111
> 칠곡군 기준: nx=66, ny=103
> 기상청 홈페이지에서 "격자 조회" 검색하면 엑셀 파일로 전체 목록 있어요.

### 1-3. 응답에서 뭘 꺼내야 하나?

API 응답 `response.body.items.item` 배열 안에 아래 category 값들이 섞여서 옵니다.

| category | 의미 | 단위 |
|---|---|---|
| `TMP` | 1시간 기온 | ℃ |
| `POP` | 강수확률 | % |
| `PTY` | 강수형태 (0=없음, 1=비, 3=눈, 4=소나기) | 코드 |
| `SKY` | 하늘상태 (1=맑음, 3=구름많음, 4=흐림) | 코드 |

```js
// 이런 식으로 원하는 category만 필터해서 씁니다
const items = response.data.response.body.items.item;
const temp = items.find(i => i.category === 'TMP' && i.fcstTime === '0900');
const rainProb = items.find(i => i.category === 'POP' && i.fcstTime === '0900');
```

### 1-4. 직접 구현할 것

`src/api/weather.js` 파일을 만들고 아래를 직접 작성해보세요:

```js
// 힌트: axios로 GET 요청
// URL: https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst
// params 객체에 위 파라미터들 넣기
// base_date는 new Date()로 오늘 날짜 동적으로 생성
// base_time은 현재 시각 기준 가장 최근 발표 시각 계산 필요

export async function fetchWeather(nx = 64, ny = 111) {
  // 여기 직접 작성
}
```

> **팁:** base_time 계산이 까다롭습니다. 현재 시각이 06:10이면 base_time은 0500이고,
> 04:30이면 0200을 써야 해요. 발표 후 10분 뒤부터 데이터 제공됩니다.

---

## 2. 낙동강홍수통제소 수위 API

> ⚠️ 처음에 "한강홍수통제소"라고 하셨는데 PRD 기준은 **낙동강홍수통제소**입니다.
> 공공데이터포털에서 받은 서비스 이름을 확인해보세요.

### 2-1. 어떤 API인지 확인하기

공공데이터포털에서 검색어: **"수위"** 또는 **"낙동강"**

가장 많이 쓰는 두 가지:
1. **한국수자원공사 - 수문 관측자료 조회 서비스** (WAMIS 기반)
2. **국토교통부 - 국가수위정보 서비스**

받은 API키가 어느 서비스인지 공공데이터포털 마이페이지 > 활용신청 목록에서 확인하세요.

### 2-2. WAMIS 수위 API 기준 설명

- **엔드포인트 예시:** `http://www.wamis.go.kr:8080/wamis/openapi/wkw/mssrtminfos`
- **관측소 코드:** 양포교, 호국의다리의 관측소 코드를 먼저 찾아야 합니다

```
핵심 파라미터:
- obscd: 관측소 코드 (예: 2011680)
- startdt: 조회 시작일 (YYYYMMDD)
- enddt: 조회 종료일
- output: json
```

### 2-3. 관측소 코드 찾는 법

1. WAMIS 홈페이지 (wamis.go.kr) 접속
2. 수문자료 → 수위 → 관측소 목록에서 "양포교", "호국의다리" 검색
3. 관측소 코드(obscd) 메모해두기

### 2-4. 직접 구현할 것

`src/api/waterLevel.js`에 추가:

```js
// 힌트
// 1. 관측소 코드를 constants/stations.js에 stationCode 필드로 추가
// 2. axios로 WAMIS API 호출
// 3. 응답의 수위값(wl)을 파싱해서 반환

export async function fetchCurrentWaterLevel(stationCode) {
  // 오늘 날짜 동적 생성
  // GET 요청 후 수위 데이터 파싱
  // 여기 직접 작성
}
```

> **CORS 문제 발생할 수 있음!**
> 브라우저에서 직접 공공데이터 API를 호출하면 CORS 오류가 날 수 있어요.
> 이 경우 Spring Boot 백엔드에서 호출하고, 프론트는 백엔드를 통해 받아야 합니다.
> MVP 단계에서는 일단 직접 호출해보고, 오류 나면 백엔드 프록시로 전환하세요.

---

## 3. 카카오맵 JavaScript API

### 3-1. API키 종류 확인

카카오 디벨로퍼스 (developers.kakao.com) → 내 애플리케이션에서:
- **JavaScript 키** → 프론트에서 지도 표시할 때 사용 ✅
- REST API 키 → 서버에서 주소검색 등 할 때 사용 (지금은 불필요)

### 3-2. index.html에 스크립트 추가

`index.html`의 `<head>` 안에 직접 추가:

```html
<script
  type="text/javascript"
  src="//dapi.kakao.com/v2/maps/sdk.js?appkey=여기에_JS키_직접입력"
></script>
```

> **왜 .env를 못 쓰나요?**
> `index.html`은 Vite 빌드 전에 로드되어서 `import.meta.env`를 쓸 수 없어요.
> 카카오 JS키는 도메인 제한으로 보호하는 방식을 사용합니다.
> 카카오 디벨로퍼스 → 내 앱 → 플랫폼 → Web에서 허용 도메인 추가하세요.
> (개발중: `http://localhost:5173` 추가)

### 3-3. React 컴포넌트에서 카카오맵 쓰는 패턴

```jsx
// src/components/leisure/KakaoMap.jsx 직접 작성해보세요

import { useEffect, useRef } from 'react';

function KakaoMap({ places }) {
  const mapRef = useRef(null);   // 지도 담을 div
  const mapInstance = useRef(null); // 카카오맵 인스턴스

  useEffect(() => {
    // window.kakao.maps 가 로드됐는지 확인 후 지도 생성
    // 힌트:
    // const map = new window.kakao.maps.Map(mapRef.current, options);
    // new window.kakao.maps.Marker({ position, map });
  }, []);

  useEffect(() => {
    // places 배열이 바뀌면 마커 업데이트
    // 기존 마커 제거 후 새로 찍기
  }, [places]);

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />;
}

export default KakaoMap;
```

### 3-4. 카카오맵 주요 API

```js
// 지도 생성
const map = new kakao.maps.Map(container, {
  center: new kakao.maps.LatLng(위도, 경도),
  level: 5, // 줌 레벨 (1~14, 숫자 클수록 넓은 범위)
});

// 마커 생성
const marker = new kakao.maps.Marker({
  position: new kakao.maps.LatLng(위도, 경도),
  map: map,
});

// 마커 클릭 이벤트
kakao.maps.event.addListener(marker, 'click', () => {
  // 클릭 시 처리
});

// 커스텀 오버레이 (색상 마커 대신 HTML로 마커 만들기)
const overlay = new kakao.maps.CustomOverlay({
  position: new kakao.maps.LatLng(위도, 경도),
  content: '<div style="background:red">위험</div>',
  map: map,
});
```

---

## 4. 구현 순서 추천

```
1단계: .env 파일 만들기
   └─ 키 3개 넣기, .gitignore 확인

2단계: 기상청 API 테스트
   └─ 브라우저 주소창에 직접 URL 입력해서 응답 확인
   └─ Postman이나 Thunder Client로 테스트
   └─ 잘 되면 src/api/weather.js 작성

3단계: 수위 API 테스트
   └─ 관측소 코드 먼저 찾기
   └─ 같은 방식으로 URL 테스트
   └─ CORS 오류 나면 백엔드 프록시 먼저 만들기

4단계: 카카오맵
   └─ index.html에 스크립트 추가
   └─ localhost:5173에서 지도 뜨는지 확인
   └─ KakaoMap 컴포넌트 만들고 마커 찍기

5단계: TanStack Query 연결
   └─ src/hooks/useWaterLevels.js 참고해서
   └─ useQuery에 api 함수 연결
```

---

## 5. 자주 발생하는 문제

| 문제 | 원인 | 해결 |
|---|---|---|
| API 응답 없음 | 인증키가 인코딩된 것 사용 | 공공데이터포털에서 "일반 인증키(Decoding)" 복사 |
| CORS 오류 | 브라우저에서 직접 공공데이터 호출 | Spring Boot 백엔드 프록시 사용 |
| 카카오맵 안 뜸 | JS키 도메인 미등록 | 카카오 디벨로퍼스에서 localhost:5173 추가 |
| `kakao is not defined` | 스크립트 로드 전에 컴포넌트 실행 | useEffect 안에서 window.kakao 체크 |
| 기상청 데이터 없음 | base_time이 잘못됨 | 가장 최근 발표 시각 계산 로직 확인 |
