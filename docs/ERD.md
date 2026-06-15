# ERD.md — 엔티티 관계 다이어그램

> HTML 모크업 기준 전체 테이블 설계
> Phase 1 = MVP / Phase 3 = 로그인 이후 기능

---

## 전체 관계도

```
┌─────────────────────────────────────────────────────────────────┐
│                        PHASE 1 (MVP)                            │
│                                                                   │
│  stations ──────────────────────────────────── places           │
│     │  (1:N)                                    (N:1)            │
│     │                                                             │
│  water_levels                                                     │
│     (1:N)                                                         │
│                                                                   │
│  weather_snapshots (위치 기반, stations와 직접 FK 없음)           │
│                                                                   │
│  ai_safety_guides  (station_levels JSONB 캐싱)                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     PHASE 3 (로그인)                             │
│                                                                   │
│  users ──┬── user_badges ── badges                              │
│          ├── user_visits ── places                               │
│          ├── user_favorite_stations ── stations                  │
│          ├── user_favorite_places   ── places                    │
│          └── user_alert_settings   ── stations                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## PHASE 1 테이블 상세

### stations (관측소)

```
┌──────────────────────────────────────────────┐
│ stations                                      │
├──────────────────────────────────────────────┤
│ PK  id              VARCHAR(20)               │  yangpo, hoguk
│     name            VARCHAR(50)   NOT NULL    │  양포교, 호국의다리
│     location        VARCHAR(100)  NOT NULL    │  구미시, 칠곡군
│     lat             DECIMAL(10,7) NOT NULL    │
│     lng             DECIMAL(10,7) NOT NULL    │
│     station_code    VARCHAR(20)               │  공공데이터 API 코드
│     normal_level    DECIMAL(5,2)  NOT NULL    │  평상수위
│     caution_level   DECIMAL(5,2)  NOT NULL    │  주의 기준
│     warning_level   DECIMAL(5,2)  NOT NULL    │  경보 기준
│     critical_level  DECIMAL(5,2)  NOT NULL    │  심각 기준
│     design_flood_level DECIMAL(5,2) NOT NULL  │  계획홍수위
│     is_active       BOOLEAN       DEFAULT TRUE │
│     created_at      TIMESTAMP     DEFAULT NOW()│
└──────────────────────────────────────────────┘
```

### water_levels (수위 이력)

```
┌──────────────────────────────────────────────┐
│ water_levels                                  │
├──────────────────────────────────────────────┤
│ PK  id           BIGSERIAL                    │
│ FK  station_id   VARCHAR(20)   NOT NULL       │ → stations.id
│     level        DECIMAL(5,2)  NOT NULL       │  단위: m
│     status       water_status  NOT NULL       │  normal|caution|warning|critical
│     measured_at  TIMESTAMP     NOT NULL       │  관측 시각 (10분 단위)
│     created_at   TIMESTAMP     DEFAULT NOW()  │  DB 저장 시각
├──────────────────────────────────────────────┤
│ INDEX (station_id, measured_at DESC)          │  ← 핵심 성능 인덱스
└──────────────────────────────────────────────┘
```

### places (여가 장소)

```
┌──────────────────────────────────────────────┐
│ places                                        │
├──────────────────────────────────────────────┤
│ PK  id             VARCHAR(20)                │  camping, fishing, cycling, park
│     name           VARCHAR(100)  NOT NULL     │
│     type           place_type    NOT NULL     │  camping|fishing|cycling|walking
│ FK  station_id     VARCHAR(20)   NOT NULL     │ → stations.id (연결 관측소)
│     lat            DECIMAL(10,7) NOT NULL     │
│     lng            DECIMAL(10,7) NOT NULL     │
│     safe_level     DECIMAL(5,2)  NOT NULL     │  안전 기준 수위
│     caution_level  DECIMAL(5,2)  NOT NULL     │  주의 기준 수위
│     amenities      TEXT[]                     │  편의시설 배열
│     description    TEXT                       │
│     is_active      BOOLEAN       DEFAULT TRUE │
│     created_at     TIMESTAMP     DEFAULT NOW()│
└──────────────────────────────────────────────┘
```

### weather_snapshots (날씨 스냅샷)

```
┌──────────────────────────────────────────────┐
│ weather_snapshots                             │
├──────────────────────────────────────────────┤
│ PK  id                 BIGSERIAL              │
│     nx                 INTEGER    NOT NULL    │  기상청 격자 X (구미: 64)
│     ny                 INTEGER    NOT NULL    │  기상청 격자 Y (구미: 111)
│     temperature        DECIMAL(4,1)           │  기온 (℃)
│     rain_probability   INTEGER                │  강수확률 (%)
│     sky_condition      VARCHAR(20)            │  맑음|구름많음|흐림
│     precipitation_type INTEGER                │  0=없음 1=비 3=눈 4=소나기
│     wind_speed         DECIMAL(4,1)           │  풍속 (m/s)
│     wind_direction     VARCHAR(10)            │  북서, 남동 등
│     humidity           INTEGER                │  습도 (%)
│     base_date          VARCHAR(8)             │  YYYYMMDD (발표 날짜)
│     base_time          VARCHAR(4)             │  HHmm (발표 시각)
│     fcst_date          VARCHAR(8)             │  예보 날짜
│     fcst_time          VARCHAR(4)             │  예보 시각
│     measured_at        TIMESTAMP  NOT NULL    │
│     created_at         TIMESTAMP  DEFAULT NOW()│
├──────────────────────────────────────────────┤
│ INDEX (nx, ny, measured_at DESC)              │
└──────────────────────────────────────────────┘
```

### ai_safety_guides (AI 안내 캐시)

```
┌──────────────────────────────────────────────┐
│ ai_safety_guides                              │
├──────────────────────────────────────────────┤
│ PK  id              BIGSERIAL                 │
│     message         TEXT         NOT NULL     │  AI 생성 안내 문구
│     station_levels  JSONB        NOT NULL     │  {"yangpo":1.8,"hoguk":2.3}
│     generated_at    TIMESTAMP    DEFAULT NOW()│
│     expires_at      TIMESTAMP    NOT NULL     │  만료 시각 (10분 후)
└──────────────────────────────────────────────┘
```

---

## PHASE 3 테이블 상세

### users (사용자)

```
┌──────────────────────────────────────────────┐
│ users                                         │
├──────────────────────────────────────────────┤
│ PK  id               BIGSERIAL               │
│     nickname         VARCHAR(50)  NOT NULL    │
│     email            VARCHAR(200)             │
│     social_provider  social_provider          │  kakao|google
│     social_id        VARCHAR(200)             │  소셜 고유 ID
│     level            INTEGER      DEFAULT 1   │  레벨 (1~10)
│     total_points     INTEGER      DEFAULT 0   │  누적 포인트
│     profile_emoji    VARCHAR(10)  DEFAULT '🧑'│
│     created_at       TIMESTAMP    DEFAULT NOW()│
│     updated_at       TIMESTAMP    DEFAULT NOW()│
├──────────────────────────────────────────────┤
│ UNIQUE (social_provider, social_id)           │
└──────────────────────────────────────────────┘
```

### badges (배지 마스터)

```
┌──────────────────────────────────────────────┐
│ badges                                        │
├──────────────────────────────────────────────┤
│ PK  id               VARCHAR(30)             │  fishing_master, cyclist 등
│     name             VARCHAR(50)  NOT NULL    │  낚시 고수
│     description      TEXT                    │
│     icon             VARCHAR(10)             │  이모지
│     condition_type   VARCHAR(30)             │  visit_count|cycling_km|fishing_visit
│     condition_value  INTEGER                 │  달성 기준값
│     points_reward    INTEGER      DEFAULT 0  │  획득 포인트
│     created_at       TIMESTAMP    DEFAULT NOW()│
└──────────────────────────────────────────────┘
```

### user_badges (사용자 배지 획득)

```
┌──────────────────────────────────────────────┐
│ user_badges                                   │
├──────────────────────────────────────────────┤
│ FK  user_id    BIGINT      NOT NULL           │ → users.id
│ FK  badge_id   VARCHAR(30) NOT NULL           │ → badges.id
│     earned_at  TIMESTAMP   DEFAULT NOW()      │
├──────────────────────────────────────────────┤
│ PK (user_id, badge_id)                        │
└──────────────────────────────────────────────┘
```

### user_visits (방문 기록)

```
┌──────────────────────────────────────────────┐
│ user_visits                                   │
├──────────────────────────────────────────────┤
│ PK  id                   BIGSERIAL           │
│ FK  user_id              BIGINT    NOT NULL   │ → users.id
│ FK  place_id             VARCHAR(20) NOT NULL │ → places.id
│     visited_at           TIMESTAMP  NOT NULL  │
│     duration_minutes     INTEGER              │  체류 시간
│     points_earned        INTEGER   DEFAULT 0  │
│     water_level_at_visit DECIMAL(5,2)         │  방문 시 수위 기록
│     status_at_visit      water_status         │  방문 시 안전 상태
│     memo                 TEXT                │
│     created_at           TIMESTAMP  DEFAULT NOW()│
├──────────────────────────────────────────────┤
│ INDEX (user_id, visited_at DESC)              │
└──────────────────────────────────────────────┘
```

### user_favorite_stations (관측소 즐겨찾기)

```
┌──────────────────────────────────────────────┐
│ user_favorite_stations                        │
├──────────────────────────────────────────────┤
│ FK  user_id     BIGINT      NOT NULL          │ → users.id
│ FK  station_id  VARCHAR(20) NOT NULL          │ → stations.id
│     created_at  TIMESTAMP   DEFAULT NOW()     │
├──────────────────────────────────────────────┤
│ PK (user_id, station_id)                      │
└──────────────────────────────────────────────┘
```

### user_favorite_places (장소 즐겨찾기)

```
┌──────────────────────────────────────────────┐
│ user_favorite_places                          │
├──────────────────────────────────────────────┤
│ FK  user_id   BIGINT      NOT NULL            │ → users.id
│ FK  place_id  VARCHAR(20) NOT NULL            │ → places.id
│     created_at TIMESTAMP  DEFAULT NOW()       │
├──────────────────────────────────────────────┤
│ PK (user_id, place_id)                        │
└──────────────────────────────────────────────┘
```

### user_alert_settings (알림 설정)

```
┌──────────────────────────────────────────────┐
│ user_alert_settings                           │
├──────────────────────────────────────────────┤
│ PK  id           BIGSERIAL                   │
│ FK  user_id      BIGINT      NOT NULL         │ → users.id
│ FK  station_id   VARCHAR(20) NOT NULL         │ → stations.id
│     alert_level  water_status DEFAULT caution │  어떤 단계부터 알림
│     is_enabled   BOOLEAN      DEFAULT TRUE    │
│     created_at   TIMESTAMP    DEFAULT NOW()   │
├──────────────────────────────────────────────┤
│ UNIQUE (user_id, station_id)                  │
└──────────────────────────────────────────────┘
```

---

## 관계 요약

| 관계 | 설명 |
|---|---|
| stations 1:N water_levels | 한 관측소에 수위 이력 여러 개 |
| stations 1:N places | 한 관측소가 여러 장소 커버 |
| users 1:N user_visits | 한 사용자가 여러 장소 방문 |
| users N:M badges | user_badges 중간 테이블 |
| users N:M stations | user_favorite_stations 중간 테이블 |
| users N:M places | user_favorite_places + user_alert_settings |
