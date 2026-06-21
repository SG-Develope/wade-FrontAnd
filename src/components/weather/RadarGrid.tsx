import { useState } from "react";
import {
  useRadarComposite,
  useSatelliteImage,
  useTyphoonInfo,
} from "@/queries/useWeatherQuery";

const PANEL_HEIGHT = 420;

function PanelSkeleton({ label, icon }: { label: string; icon: string }) {
  return (
    <div className="flex-1 bg-white border border-pebble rounded-[14px] overflow-hidden flex flex-col">
      <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-pebble shrink-0">
        <i className={`ti ${icon} text-river text-[13px]`} />
        <span className="text-[12px] font-semibold text-soil">{label}</span>
        <div className="ml-auto w-8 h-4 bg-sand rounded-full animate-pulse" />
      </div>
      <div className="bg-[#1a2e3a] animate-pulse" style={{ height: PANEL_HEIGHT }} />
    </div>
  );
}

function RadarViewer({
  label, icon, imageUrl, isLoading, fallbackLink, extra,
}: {
  label: string;
  icon: string;
  imageUrl?: string | null;
  isLoading: boolean;
  fallbackLink: string;
  extra?: React.ReactNode;
}) {
  const [imgError, setImgError] = useState(false);

  if (isLoading) return <PanelSkeleton label={label} icon={icon} />;

  return (
    <div className="flex-1 bg-white border border-pebble rounded-[14px] overflow-hidden flex flex-col">
      <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-pebble shrink-0">
        <i className={`ti ${icon} text-river text-[13px]`} />
        <span className="text-[12px] font-semibold text-soil">{label}</span>
        <span className="ml-auto text-[9px] bg-river-light text-river border border-[#9FE1CB] px-1.5 py-0.5 rounded-full font-semibold">
          LIVE
        </span>
      </div>
      <div
        className="bg-[#1a2e3a] relative flex items-center justify-center overflow-hidden"
        style={{ height: PANEL_HEIGHT }}
      >
        {!imageUrl || imgError ? (
          <div className="flex flex-col items-center gap-2 text-moss p-4">
            <i className={`ti ${icon} text-[28px] opacity-30`} />
            <div className="text-[11px] opacity-60 text-center">
              {label} 이미지를 불러올 수 없습니다
            </div>
            <a href={fallbackLink} target="_blank" rel="noopener noreferrer" className="text-[10px] text-river">
              기상청 바로가기
            </a>
          </div>
        ) : (
          <img
            key={imageUrl}
            src={imageUrl}
            alt={label}
            className="w-full h-full object-contain"
            onError={() => setImgError(true)}
          />
        )}
        {extra && <div className="absolute bottom-2 left-2 right-2">{extra}</div>}
        <div className="absolute bottom-2 right-2 bg-black/40 text-[#aaa] text-[8px] px-1.5 py-0.5 rounded">
          출처: 기상청
        </div>
      </div>
    </div>
  );
}

function TyphoonPanel() {
  const { data: typhoon, isLoading } = useTyphoonInfo();

  if (isLoading) return <PanelSkeleton label="태풍 정보" icon="ti-tornado" />;

  if (!typhoon?.active) {
    return (
      <div className="flex-1 bg-white border border-pebble rounded-[14px] overflow-hidden flex flex-col">
        <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-pebble shrink-0">
          <i className="ti ti-tornado text-river text-[13px]" />
          <span className="text-[12px] font-semibold text-soil">태풍 정보</span>
          <span className="ml-auto text-[9px] bg-[#E1F5EE] text-river border border-[#9FE1CB] px-1.5 py-0.5 rounded-full font-semibold">
            없음
          </span>
        </div>
        <div
          className="flex flex-col items-center justify-center gap-2 bg-[#f5f7f4]"
          style={{ height: PANEL_HEIGHT }}
        >
          <div className="w-10 h-10 rounded-full bg-[#E1F5EE] flex items-center justify-center">
            <i className="ti ti-shield-check text-river" style={{ fontSize: 22 }} />
          </div>
          <div className="text-[12px] font-semibold text-soil">현재 발효 중인 태풍 없음</div>
          <div className="text-[10px] text-moss opacity-70">태풍 발생 시 경로·강도 정보가 표시됩니다</div>
        </div>
      </div>
    );
  }

  return (
    <RadarViewer
      label={`태풍 ${typhoon.name ?? ""} (${typhoon.nameEn ?? ""})`}
      icon="ti-tornado"
      imageUrl={typhoon.imageUrl}
      isLoading={false}
      fallbackLink="https://www.weather.go.kr/w/typhoon/tag/kma-tcms.do"
      extra={
        <div className="bg-black/60 rounded-lg px-2 py-1.5 text-[10px] text-white space-y-0.5">
          <div>{typhoon.location}</div>
          <div className="flex gap-3 opacity-80">
            <span>최대풍속 {typhoon.maxWindSpeed}m/s</span>
            <span>기압 {typhoon.pressure}hPa</span>
            <span>{typhoon.direction} {typhoon.moveSpeed}km/h</span>
          </div>
        </div>
      }
    />
  );
}

export default function RadarGrid() {
  const { data: radar,     isLoading: radarLoading } = useRadarComposite();
  const { data: satellite, isLoading: satLoading   } = useSatelliteImage();

  const LEGEND = [
    { color: "#4A90C4", label: "약한 비 (1mm/h 미만)" },
    { color: "#1D9E75", label: "보통 비 (1~5mm/h)" },
    { color: "#EF9F27", label: "강한 비 (5~20mm/h)" },
    { color: "#E24B4A", label: "매우 강한 비 (20mm/h 이상)" },
  ];

  return (
    <div className="flex flex-col gap-2 b">
      <div className="flex gap-3 ">
        <RadarViewer
          label="강수 레이더"
          icon="ti-cloud-rain"
          imageUrl={radar?.imageUrl}
          isLoading={radarLoading}
          fallbackLink="https://www.weather.go.kr/w/obs-climate/land/radar.do"
        />
        <RadarViewer
          label="위성 영상"
          icon="ti-satellite"
          imageUrl={satellite?.imageUrl}
          isLoading={satLoading}
          fallbackLink="https://www.weather.go.kr/w/obs-climate/weather-station/satellite.do"
        />
        <TyphoonPanel />
      </div>
      <div className="flex items-center gap-1 px-1">
        <span className="text-[9px] text-moss font-bold mr-1 shrink-0">강수 범례</span>
        {LEGEND.map(item => (
          <div key={item.label} className="flex items-center gap-1 text-[9px] text-soil">
            <span className="w-4 h-1.5 rounded-sm shrink-0" style={{ background: item.color }} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
