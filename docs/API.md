# API.md — REST API 엔드포인트 명세

> Base URL: `http://localhost:8080` (개발) / Railway URL (운영)
> 모든 응답 형식: `application/json`

---

## 수위 API

### 현재 수위 조회

```
GET /api/water-levels/current
```

**Response**
```json
{
  "updatedAt": "2026-06-15T10:30:00",
  "stations": [
    {
      "stationId": "yangpo",
      "stationName": "양포교",
      "level": 1.8,
      "status": "normal",
      "measuredAt": "2026-06-15T10:20:00"
    },
    {
      "stationId": "hoguk",
      "stationName": "호국의다리",
      "level": 2.3,
      "status": "normal",
      "measuredAt": "2026-06-15T10:20:00"
    }
  ]
}
```

### 수위 이력 조회

```
GET /api/water-levels/history/{stationId}?hours=24
```

| 파라미터 | 타입 | 설명 |
|---|---|---|
| `stationId` | path | `yangpo` \| `hoguk` |
| `hours` | query | 조회 시간 범위 (기본값: 24) |

**Response**
```json
{
  "stationId": "yangpo",
  "history": [
    { "level": 1.6, "measuredAt": "2026-06-15T08:00:00" },
    { "level": 1.7, "measuredAt": "2026-06-15T08:10:00" }
  ]
}
```

---

## 날씨 API

### 현재 날씨 조회

```
GET /api/weather/current
```

**Response**
```json
{
  "temperature": 24,
  "rainProbability": 20,
  "skyCondition": "맑음",
  "precipitationType": 0,
  "updatedAt": "2026-06-15T10:00:00"
}
```

---

## AI 안내 API

### AI 안전 안내 생성

```
POST /api/ai/safety-guide
```

**Request Body**
```json
{
  "stationLevels": {
    "yangpo": 1.8,
    "hoguk": 2.3
  }
}
```

**Response**
```json
{
  "message": "현재 전 구간 정상 수위입니다. 낙동강 자전거길과 캠핑장 모두 이용 가능합니다.",
  "generatedAt": "2026-06-15T10:30:00",
  "cached": false
}
```

---

## 공통 에러 응답

```json
{
  "status": 500,
  "error": "Internal Server Error",
  "message": "외부 API 호출에 실패했습니다.",
  "timestamp": "2026-06-15T10:30:00"
}
```

| 상태코드 | 상황 |
|---|---|
| `200` | 성공 |
| `400` | 잘못된 요청 파라미터 |
| `500` | 서버 오류 / 외부 API 실패 |
| `503` | 외부 API 점검 중 |
