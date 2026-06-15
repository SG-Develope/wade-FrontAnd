# DDL.md — PostgreSQL DDL (Neon 기준)

> 실행 순서 중요: ENUM → Phase1 테이블 → Phase3 테이블
> Neon 콘솔 또는 psql로 직접 실행

---

## 0. ENUM 타입 정의

```sql
-- 수위 상태
CREATE TYPE water_status AS ENUM (
  'normal',    -- 정상
  'caution',   -- 주의
  'warning',   -- 위험
  'critical'   -- 심각
);

-- 여가 장소 유형
CREATE TYPE place_type AS ENUM (
  'camping',   -- 캠핑장
  'fishing',   -- 낚시터
  'cycling',   -- 자전거길
  'walking'    -- 산책로
);

-- 소셜 로그인 제공자 (Phase 3)
CREATE TYPE social_provider AS ENUM (
  'kakao',
  'google'
);
```

---

## 1. PHASE 1 — 핵심 테이블

### stations (관측소)

```sql
CREATE TABLE stations (
  id                  VARCHAR(20)   PRIMARY KEY,
  name                VARCHAR(50)   NOT NULL,
  location            VARCHAR(100)  NOT NULL,
  lat                 DECIMAL(10,7) NOT NULL,
  lng                 DECIMAL(10,7) NOT NULL,
  station_code        VARCHAR(20),                      -- 공공데이터 API 관측소 코드
  normal_level        DECIMAL(5,2)  NOT NULL,           -- 평상수위 (m)
  caution_level       DECIMAL(5,2)  NOT NULL,           -- 주의 기준 (m)
  warning_level       DECIMAL(5,2)  NOT NULL,           -- 경보 기준 (m)
  critical_level      DECIMAL(5,2)  NOT NULL,           -- 심각 기준 (m)
  design_flood_level  DECIMAL(5,2)  NOT NULL,           -- 계획홍수위 (m)
  is_active           BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMP     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE stations IS '낙동강 수위 관측소';
COMMENT ON COLUMN stations.station_code IS '낙동강홍수통제소 공공데이터 API 관측소 코드';
```

### 관측소 초기 데이터

```sql
INSERT INTO stations (id, name, location, lat, lng, station_code,
  normal_level, caution_level, warning_level, critical_level, design_flood_level)
VALUES
  ('yangpo', '양포교', '구미시', 36.1327, 128.3614, NULL,
   1.6, 3.5, 5.0, 6.5, 6.5),
  ('hoguk',  '호국의다리', '칠곡군', 35.9963, 128.4022, NULL,
   2.0, 4.5, 6.0, 8.0, 8.0);
```

---

### water_levels (수위 이력)

```sql
CREATE TABLE water_levels (
  id           BIGSERIAL     PRIMARY KEY,
  station_id   VARCHAR(20)   NOT NULL REFERENCES stations(id),
  level        DECIMAL(5,2)  NOT NULL,          -- 수위 (m)
  status       water_status  NOT NULL,
  measured_at  TIMESTAMP     NOT NULL,           -- 관측 시각 (10분 단위)
  created_at   TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- 핵심 성능 인덱스: 특정 관측소의 최근 이력 조회
CREATE INDEX idx_water_levels_station_time
  ON water_levels (station_id, measured_at DESC);

-- 최신 수위 빠른 조회용
CREATE INDEX idx_water_levels_measured_at
  ON water_levels (measured_at DESC);

COMMENT ON TABLE water_levels IS '관측소별 수위 이력 (10분 간격 @Scheduled 저장)';
COMMENT ON COLUMN water_levels.measured_at IS '공공데이터 API 원본 관측 시각';
```

---

### places (여가 장소)

```sql
CREATE TABLE places (
  id             VARCHAR(20)    PRIMARY KEY,
  name           VARCHAR(100)   NOT NULL,
  type           place_type     NOT NULL,
  station_id     VARCHAR(20)    NOT NULL REFERENCES stations(id),
  lat            DECIMAL(10,7)  NOT NULL,
  lng            DECIMAL(10,7)  NOT NULL,
  safe_level     DECIMAL(5,2)   NOT NULL,   -- 이 수위 이하면 안전
  caution_level  DECIMAL(5,2)   NOT NULL,   -- 이 수위 초과면 위험
  amenities      TEXT[],                    -- 편의시설 배열
  description    TEXT,
  is_active      BOOLEAN        NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMP      NOT NULL DEFAULT NOW()
);

COMMENT ON COLUMN places.safe_level IS '연결 관측소 수위가 이 값 이하면 안전';
COMMENT ON COLUMN places.caution_level IS '연결 관측소 수위가 이 값 초과면 위험';
```

### 장소 초기 데이터

```sql
INSERT INTO places (id, name, type, station_id, lat, lng, safe_level, caution_level, amenities)
VALUES
  ('camping', '구미 낙동강 오토캠핑장', 'camping', 'yangpo',
   36.1280, 128.3570, 3.0, 4.5,
   ARRAY['주차장', '화장실', '샤워실', '취사장']),

  ('fishing', '양포교 낚시터', 'fishing', 'yangpo',
   36.1327, 128.3614, 2.5, 3.5,
   ARRAY['주차장', '화장실']),

  ('cycling', '낙동강 자전거길 4코스', 'cycling', 'yangpo',
   36.1200, 128.3500, 3.5, 5.0,
   ARRAY['자전거 보관대', '휴게소']),

  ('park', '칠곡 낙동강 둔치공원', 'walking', 'hoguk',
   35.9963, 128.4022, 3.0, 4.5,
   ARRAY['주차장', '화장실', '산책로', '운동기구']);
```

---

### weather_snapshots (날씨 스냅샷)

```sql
CREATE TABLE weather_snapshots (
  id                  BIGSERIAL    PRIMARY KEY,
  nx                  INTEGER      NOT NULL,        -- 기상청 격자 X
  ny                  INTEGER      NOT NULL,        -- 기상청 격자 Y
  temperature         DECIMAL(4,1),                -- 기온 (℃)
  rain_probability    INTEGER,                      -- 강수확률 (%)
  sky_condition       VARCHAR(20),                  -- 맑음|구름많음|흐림
  precipitation_type  INTEGER,                      -- 0=없음 1=비 3=눈 4=소나기
  wind_speed          DECIMAL(4,1),                -- 풍속 (m/s)
  wind_direction      VARCHAR(10),                  -- 풍향 (북서 등)
  humidity            INTEGER,                      -- 습도 (%)
  base_date           VARCHAR(8),                   -- YYYYMMDD 발표 날짜
  base_time           VARCHAR(4),                   -- HHmm 발표 시각
  fcst_date           VARCHAR(8),                   -- 예보 날짜
  fcst_time           VARCHAR(4),                   -- 예보 시각
  measured_at         TIMESTAMP    NOT NULL,
  created_at          TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_weather_location_time
  ON weather_snapshots (nx, ny, measured_at DESC);

COMMENT ON TABLE weather_snapshots IS '기상청 초단기예보 API 응답 저장';
COMMENT ON COLUMN weather_snapshots.nx IS '기상청 예보 격자 X (구미: 64, 칠곡: 66)';
COMMENT ON COLUMN weather_snapshots.ny IS '기상청 예보 격자 Y (구미: 111, 칠곡: 103)';
```

---

### ai_safety_guides (AI 안내 캐시)

```sql
CREATE TABLE ai_safety_guides (
  id              BIGSERIAL   PRIMARY KEY,
  message         TEXT        NOT NULL,             -- Claude 생성 안내 문구
  station_levels  JSONB       NOT NULL,             -- {"yangpo": 1.8, "hoguk": 2.3}
  generated_at    TIMESTAMP   NOT NULL DEFAULT NOW(),
  expires_at      TIMESTAMP   NOT NULL              -- 만료 시각 (10분 후)
);

-- 만료되지 않은 최신 가이드 빠른 조회
CREATE INDEX idx_ai_guides_expires
  ON ai_safety_guides (expires_at DESC);

COMMENT ON TABLE ai_safety_guides IS 'Claude API 응답 캐시 (수위 변화 없으면 10분 재사용)';
COMMENT ON COLUMN ai_safety_guides.station_levels IS '안내 생성 시점의 관측소별 수위값 (캐시 키)';
```

---

## 2. PHASE 3 — 사용자 기능 테이블

> 로그인 기능 개발 시점에 추가 실행

### users (사용자)

```sql
CREATE TABLE users (
  id               BIGSERIAL       PRIMARY KEY,
  nickname         VARCHAR(50)     NOT NULL,
  email            VARCHAR(200),
  social_provider  social_provider,
  social_id        VARCHAR(200),                    -- 소셜 서비스의 고유 ID
  level            INTEGER         NOT NULL DEFAULT 1,
  total_points     INTEGER         NOT NULL DEFAULT 0,
  profile_emoji    VARCHAR(10)     NOT NULL DEFAULT '🧑',
  created_at       TIMESTAMP       NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMP       NOT NULL DEFAULT NOW(),
  UNIQUE (social_provider, social_id)
);

COMMENT ON COLUMN users.social_id IS '카카오/구글에서 발급한 사용자 고유 ID';
```

---

### badges (배지 마스터)

```sql
CREATE TABLE badges (
  id               VARCHAR(30)  PRIMARY KEY,
  name             VARCHAR(50)  NOT NULL,
  description      TEXT,
  icon             VARCHAR(10),                     -- 이모지
  condition_type   VARCHAR(30),                     -- visit_count|cycling_km|fishing_visit
  condition_value  INTEGER,                         -- 달성 기준값
  points_reward    INTEGER      NOT NULL DEFAULT 0,
  created_at       TIMESTAMP    NOT NULL DEFAULT NOW()
);
```

### 배지 초기 데이터

```sql
INSERT INTO badges (id, name, description, icon, condition_type, condition_value, points_reward)
VALUES
  ('first_visit',    '첫 방문',       '처음으로 장소를 방문했어요',              '⭐', 'visit_count',    1,   30),
  ('explorer_10',   '10곳 방문',     '10개 장소를 방문했어요',                  '🗺️', 'visit_count',   10,   50),
  ('explorer_50',   '50곳 방문',     '50개 장소를 방문했어요',                  '🎯', 'visit_count',   50,  100),
  ('fishing_lover', '낚시 고수',     '낚시터를 5번 이상 방문했어요',             '🎣', 'fishing_visit',  5,   30),
  ('cyclist',       '라이더',        '자전거길을 이용했어요',                   '🚴', 'cycling_visit',  1,   30),
  ('camper',        '캠퍼',          '캠핑장을 방문했어요',                    '🏕️', 'camping_visit',  1,   50),
  ('early_bird',    '새벽 산책',     '오전 6시 이전에 방문했어요',              '🌅', 'early_visit',    1,   20),
  ('safety_guard',  '안전 지킴이',   '위험 알림을 공유했어요',                  '🔔', 'share_alert',    1,   20);
```

---

### user_badges (배지 획득 이력)

```sql
CREATE TABLE user_badges (
  user_id    BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id   VARCHAR(30) NOT NULL REFERENCES badges(id),
  earned_at  TIMESTAMP   NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);
```

---

### user_visits (방문 기록)

```sql
CREATE TABLE user_visits (
  id                    BIGSERIAL    PRIMARY KEY,
  user_id               BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  place_id              VARCHAR(20)  NOT NULL REFERENCES places(id),
  visited_at            TIMESTAMP    NOT NULL,
  duration_minutes      INTEGER,                         -- 체류 시간 (분)
  points_earned         INTEGER      NOT NULL DEFAULT 0,
  water_level_at_visit  DECIMAL(5,2),                   -- 방문 시 수위 기록
  status_at_visit       water_status,                   -- 방문 시 안전 상태
  memo                  TEXT,
  created_at            TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_visits_user_time
  ON user_visits (user_id, visited_at DESC);
```

---

### user_favorite_stations (관측소 즐겨찾기)

```sql
CREATE TABLE user_favorite_stations (
  user_id     BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  station_id  VARCHAR(20) NOT NULL REFERENCES stations(id),
  created_at  TIMESTAMP   NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, station_id)
);
```

---

### user_favorite_places (장소 즐겨찾기)

```sql
CREATE TABLE user_favorite_places (
  user_id    BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  place_id   VARCHAR(20) NOT NULL REFERENCES places(id),
  created_at TIMESTAMP   NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, place_id)
);
```

---

### user_alert_settings (수위 알림 설정)

```sql
CREATE TABLE user_alert_settings (
  id           BIGSERIAL    PRIMARY KEY,
  user_id      BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  station_id   VARCHAR(20)  NOT NULL REFERENCES stations(id),
  alert_level  water_status NOT NULL DEFAULT 'caution',  -- 어떤 단계부터 알림
  is_enabled   BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMP    NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, station_id)
);

COMMENT ON COLUMN user_alert_settings.alert_level IS 'caution 이상이면 알림 발송';
```

---

## 3. 유틸리티

### 오래된 데이터 정리 (선택적 실행)

```sql
-- water_levels: 30일 이상 된 데이터 삭제
DELETE FROM water_levels
WHERE measured_at < NOW() - INTERVAL '30 days';

-- weather_snapshots: 7일 이상 된 데이터 삭제
DELETE FROM weather_snapshots
WHERE measured_at < NOW() - INTERVAL '7 days';

-- ai_safety_guides: 만료된 캐시 삭제
DELETE FROM ai_safety_guides
WHERE expires_at < NOW();
```

### 현재 수위 조회 (MyBatis용 참고)

```sql
-- 각 관측소의 가장 최근 수위 1개씩
SELECT DISTINCT ON (station_id)
  station_id,
  level,
  status,
  measured_at
FROM water_levels
ORDER BY station_id, measured_at DESC;
```

### 장소 안전 상태 계산 (JOIN)

```sql
-- 장소별 현재 안전 상태 조회
SELECT
  p.id,
  p.name,
  p.type,
  wl.level AS current_level,
  CASE
    WHEN wl.level > p.caution_level THEN 'warning'
    WHEN wl.level > p.safe_level    THEN 'caution'
    ELSE 'normal'
  END AS place_status
FROM places p
JOIN LATERAL (
  SELECT level
  FROM water_levels
  WHERE station_id = p.station_id
  ORDER BY measured_at DESC
  LIMIT 1
) wl ON TRUE
WHERE p.is_active = TRUE;
```

---

## 4. 전체 DROP (초기화용 — 주의!)

```sql
-- 역순으로 DROP
DROP TABLE IF EXISTS user_alert_settings;
DROP TABLE IF EXISTS user_favorite_places;
DROP TABLE IF EXISTS user_favorite_stations;
DROP TABLE IF EXISTS user_visits;
DROP TABLE IF EXISTS user_badges;
DROP TABLE IF EXISTS badges;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS ai_safety_guides;
DROP TABLE IF EXISTS weather_snapshots;
DROP TABLE IF EXISTS places;
DROP TABLE IF EXISTS water_levels;
DROP TABLE IF EXISTS stations;

DROP TYPE IF EXISTS social_provider;
DROP TYPE IF EXISTS place_type;
DROP TYPE IF EXISTS water_status;
```
