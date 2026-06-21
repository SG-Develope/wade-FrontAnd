import { useEffect, useRef, useState } from "react";
import {
  PLACES,
  getPlaceStatus,
  STATUS_COLORS,
  STATIONS,
} from "@/constants/stations";
import { useWaterLevels } from "@/queries/useWaterLevelQuery";
import type { WaterStatus } from "@/types";

declare global {
  interface Window {
    kakao: any;
  }
}

const TYPE_FILTER = [
  { key: "all", label: "전체", icon: "ti-map-2" },
  { key: "camping", label: "캠핑", icon: "ti-tent" },
  { key: "fishing", label: "낚시", icon: "ti-fish" },
  { key: "cycling", label: "자전거", icon: "ti-bike" },
  { key: "walking", label: "산책", icon: "ti-walk" },
];

const STATUS_TEXT: Record<
  string,
  { label: string; bgCls: string; textCls: string }
> = {
  normal: {
    label: "이용 가능",
    bgCls: "bg-[#E1F5EE]",
    textCls: "text-[#0F6E56]",
  },
  caution: {
    label: "주의 요망",
    bgCls: "bg-[#FEF3DC]",
    textCls: "text-[#7A4300]",
  },
  warning: {
    label: "이용 금지",
    bgCls: "bg-[#FEEEEE]",
    textCls: "text-[#A32D2D]",
  },
  critical: {
    label: "이용 금지",
    bgCls: "bg-[#FEEEEE]",
    textCls: "text-[#7A1F1F]",
  },
};

const ICON_BG: Record<string, string> = {
  camping: "bg-[#E8F5E9]",
  fishing: "bg-sky",
  cycling: "bg-river-light",
  walking: "bg-[#FEF3DC]",
};

export default function Leisure() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<string | null>(null);

  const { data: waterData } = useWaterLevels();
  // useWaterLevels() returns Station[] directly
  const stations = waterData ?? [];

  const getLevel = (stationId: string): number | null => {
    const s = stations.find((s) => s.id === stationId);
    return s?.currentLevel ?? null
  };

  const filtered = PLACES.filter((p) => filter === "all" || p.type === filter);

  // 카카오맵 초기화
  useEffect(() => {
    if (!mapRef.current) return;
    const init = () => {
      if (!window.kakao?.maps) return;
      const center = new window.kakao.maps.LatLng(36.065, 128.38);
      mapInstance.current = new window.kakao.maps.Map(mapRef.current, {
        center,
        level: 9,
        scrollwheel: false,
      });
      renderMarkers();
    };
    if (window.kakao?.maps) {
      init();
    } else {
      const t = setInterval(() => {
        if (window.kakao?.maps) {
          clearInterval(t);
          init();
        }
      }, 300);
      return () => clearInterval(t);
    }
  }, []);

  const renderMarkers = () => {
    if (!mapInstance.current || !window.kakao?.maps) return;
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    PLACES.forEach((place) => {
      const level = getLevel(place.stationId);
      const status = level != null ? getPlaceStatus(place, level) : "normal";
      const colors =
        STATUS_COLORS[status as WaterStatus] ?? STATUS_COLORS.normal;
      const statusLabel =
        status === "normal"
          ? "이용가능"
          : status === "caution"
            ? "주의"
            : "이용금지";

      const content = `
        <div style="background:#fff;border-radius:10px;padding:7px 10px;border:1.5px solid ${colors.marker};box-shadow:0 2px 8px rgba(0,0,0,0.12);cursor:pointer;min-width:80px;text-align:center;">
          <div style="font-size:16px;margin-bottom:2px;">${place.icon}</div>
          <div style="font-size:11px;font-weight:700;color:#2D3A1F;">${place.name.length > 8 ? place.name.substring(0, 7) + "…" : place.name}</div>
          <div style="font-size:10px;color:${colors.text};font-weight:600;">${statusLabel}</div>
        </div>
      `;
      const overlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(place.lat, place.lng),
        content,
        map: mapInstance.current,
        yAnchor: 1.1,
      });
      setTimeout(() => {
        const el = overlay.getContent() as HTMLElement;
        if (typeof el !== "string")
          el.addEventListener("click", () => setSelected(place.id));
      }, 100);
      markersRef.current.push(overlay);
    });

    Object.values(STATIONS).forEach((station) => {
      const stationData = stations.find((s) => s.id === station.id);
      const level = stationData?.currentLevel ?? station.thresholds.normal;
      const content = `
        <div style="background:rgba(29,158,117,0.9);color:#fff;border-radius:8px;padding:4px 8px;font-size:10px;font-weight:700;white-space:nowrap;">
          📍 ${station.name} ${level.toFixed(1)}m
        </div>
      `;
      new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(station.lat, station.lng),
        content,
        map: mapInstance.current,
        yAnchor: 1.2,
      });
    });
  };

  useEffect(() => {
    if (mapInstance.current) renderMarkers();
  }, [stations]);

  const selectedPlace = PLACES.find((p) => p.id === selected);

  return (
    <div className="flex h-full overflow-hidden">
      {/* ─── 왼쪽: 지도 + 리스트 ─── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 필터 바 */}
        <div className="bg-white border-b border-pebble px-4 py-2.5 flex gap-1.5 shrink-0">
          {TYPE_FILTER.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-1 text-[11px] px-3 py-1 rounded-full border border-pebble cursor-pointer font-medium transition-all duration-150 ${
                filter === f.key
                  ? "bg-river text-white border-river"
                  : "bg-white text-moss"
              }`}
            >
              <i className={`ti ${f.icon} text-[12px]`} />
              {f.label}
            </button>
          ))}
        </div>

        {/* 지도 */}
        <div className="h-[280px] shrink-0">
          <div ref={mapRef} className="w-full h-full bg-[#D6EBC8]">
            {!window.kakao?.maps && (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#D6EBC8] to-[#C4DFB0]">
                <div className="text-[13px] text-[#4A6A3A] font-semibold">
                  카카오맵 로딩 중...
                </div>
                <div className="text-[11px] text-moss">
                  index.html의 카카오 JS 키를 교체해주세요
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 장소 목록 */}
        <div className="flex-1 overflow-y-auto p-3 bg-sand">
          <div className="flex flex-col gap-2">
            {filtered.map((place) => {
              const level = getLevel(place.stationId);
              const status = (level != null ? getPlaceStatus(place, level) : "normal") as WaterStatus;
              const colors = STATUS_COLORS[status as WaterStatus];
              const st = STATUS_TEXT[status];
              const isSelected = selected === place.id;

              return (
                <div
                  key={place.id}
                  onClick={() => setSelected(isSelected ? null : place.id)}
                  className="bg-white rounded-xl px-3.5 py-3 flex items-center gap-3 cursor-pointer transition-all duration-150"
                  style={{
                    border: `0.5px solid ${isSelected ? colors.marker : "#EDE8E0"}`,
                    boxShadow: isSelected
                      ? `0 3px 12px ${colors.marker}30`
                      : "none",
                  }}
                >
                  {/* 아이콘 */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-[18px] shrink-0 ${ICON_BG[place.type] ?? "bg-sand"}`}
                  >
                    {place.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold text-soil">
                      {place.name}
                    </div>
                    <div className="text-[10px] text-moss mt-0.5">
                      연결 관측소:{" "}
                      {place.stationId === "yangpo" ? "양포교" : "호국의다리"} ·
                      수위 {level != null ? level.toFixed(1) + "m" : "-"}
                    </div>
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {place.amenities.slice(0, 3).map((a) => (
                        <span
                          key={a}
                          className="text-[9px] px-1.5 py-0.5 rounded-lg bg-sand text-moss font-semibold"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${st.bgCls} ${st.textCls}`}
                  >
                    {st.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── 오른쪽 사이드 ─── */}
      <div className="w-[308px] bg-white border-l border-pebble overflow-y-auto shrink-0">
        {selectedPlace ? (
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[13px] font-bold text-soil flex items-center gap-1.5">
                {selectedPlace.icon} {selectedPlace.name}
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-6 h-6 bg-sand border border-pebble rounded-md flex items-center justify-center cursor-pointer text-moss"
              >
                <i className="ti ti-x text-[13px]" />
              </button>
            </div>

            {(() => {
              const level = getLevel(selectedPlace.stationId);
              const status = (level != null ? getPlaceStatus(selectedPlace, level) : "normal") as WaterStatus;
              const colors = STATUS_COLORS[status];
              const st = STATUS_TEXT[status];
              return (
                <>
                  <div
                    className={`rounded-[10px] px-3 py-2.5 mb-2.5 border ${st.bgCls} ${st.textCls}`}
                    style={{ borderColor: colors.marker }}
                  >
                    <div className="text-[12px] font-bold">{st.label}</div>
                    <div className="text-[10px] mt-0.5 opacity-80">
                      {selectedPlace.stationId === "yangpo"
                        ? "양포교"
                        : "호국의다리"}{" "}
                      수위 {level != null ? level.toFixed(1) + "m" : "-"} 기준
                    </div>
                  </div>

                  {/* 안전 기준 */}
                  <div className="mb-2.5">
                    <div className="text-[10px] text-moss font-bold tracking-[0.04em] mb-2">
                      안전 기준
                    </div>
                    {[
                      {
                        label: "안전",
                        range: `${selectedPlace.thresholds.safe}m 이하`,
                        color: "#1D9E75",
                      },
                      {
                        label: "주의",
                        range: `${selectedPlace.thresholds.safe}m ~ ${selectedPlace.thresholds.caution}m`,
                        color: "#EF9F27",
                      },
                      {
                        label: "위험",
                        range: `${selectedPlace.thresholds.caution}m 초과`,
                        color: "#E24B4A",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between py-1.5 border-b border-[#F5F0EA] text-[11px]"
                      >
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-1.5 h-1.5 rounded-full inline-block"
                            style={{ background: item.color }}
                          />
                          <span className="text-soil">{item.label}</span>
                        </div>
                        <span
                          className="font-semibold"
                          style={{ color: item.color }}
                        >
                          {item.range}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* 편의시설 */}
                  <div>
                    <div className="text-[10px] text-moss font-bold tracking-[0.04em] mb-2">
                      편의시설
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedPlace.amenities.map((a) => (
                        <span
                          key={a}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-river-light text-[#0F6E56] font-semibold border border-[#9FE1CB]"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        ) : (
          <div>
            <div className="px-4 py-3.5 border-b border-[#F5F0EA]">
              <div className="text-[10px] text-moss font-bold tracking-[0.05em] mb-2.5">
                여가 장소 현황
              </div>
              {PLACES.map((place) => {
                const level = getLevel(place.stationId);
                const status = level != null ? getPlaceStatus(place, level) : "normal" as WaterStatus;
                const st = STATUS_TEXT[status];
                return (
                  <div
                    key={place.id}
                    onClick={() => setSelected(place.id)}
                    className="flex items-center gap-2 py-1.5 border-b border-[#F5F0EA] cursor-pointer"
                  >
                    <span className="text-[14px]">{place.icon}</span>
                    <div className="flex-1">
                      <div className="text-[12px] font-semibold text-soil">
                        {place.name}
                      </div>
                      <div className="text-[10px] text-moss">
                        {level != null ? level.toFixed(1) + "m" : "-"}
                      </div>
                    </div>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-lg font-bold ${st.bgCls} ${st.textCls}`}
                    >
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="px-4 py-3.5">
              <div className="text-[10px] text-moss font-bold mb-2">
                이용 안내
              </div>
              <div className="text-[11px] text-[#4A5A3A] leading-[1.7]">
                장소를 클릭하면 상세 안전 기준과 편의시설 정보를 확인할 수
                있습니다. 수위는 10분 주기로 자동 갱신됩니다.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
