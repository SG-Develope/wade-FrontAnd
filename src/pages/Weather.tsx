import { useState } from "react";
import {
  useWeather,
  useShortForecast,
  useWeatherAlerts,
} from "@/queries/useWeatherQuery";
import CurrentWeatherStrip from "@/components/weather/CurrentWeatherStrip";
import RadarGrid from "@/components/weather/RadarGrid";
import ShortForecastCard from "@/components/weather/ShortForecastCard";
import AlertsCard from "@/components/weather/AlertsCard";
import TyphoonCard from "@/components/weather/TyphoonCard";
import WeatherMobileTabs from "@/components/weather/WeatherMobileTabs";
import Seo from "@/components/common/Seo";

const REGIONS = [
  { id: "yangpo", label: "구미 (양포교)",     areaKeyword: "구미" },
  { id: "hoguk",  label: "칠곡 (호국의다리)", areaKeyword: "칠곡" },
] as const;

export default function Weather() {
  const [regionId, setRegionId] = useState<string>("yangpo");
  const region = REGIONS.find(r => r.id === regionId) ?? REGIONS[0];

  const { data: weather, isLoading: weatherLoading, isError: weatherError, isPlaceholderData: weatherSwitching } = useWeather(region.id);
  const { data: shortFcst = [], isLoading: shortLoading, isError: shortError, error: shortErrorObj, isPlaceholderData: shortSwitching } = useShortForecast(region.id);
  const { data: allAlerts = [], isLoading: alertsLoading } = useWeatherAlerts();

  const alerts = allAlerts.filter((a: any) =>
    !a.area || a.area.includes(region.areaKeyword)
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Seo
        title="날씨 레이더"
        description="낙동강 유역의 기상 레이더, 단기·초단기 예보와 특보·태풍 정보를 실시간으로 확인하세요."
        path="/weather"
      />
      {/* 헤더 */}
      <div className="px-5 pt-4 pb-3 bg-white shrink-0 border-b border-pebble">
        <div className="text-[14px] font-bold text-soil flex items-center gap-1.5"
          style={{ fontFamily: "var(--font-gmarket)" }}>
          <i className="ti ti-cloud text-river" />
          날씨 · 레이더
        </div>
        <div className="text-[10px] text-moss mt-0.5">
          기상청 레이더 · 위성영상 · 단기예보 · 발령특보
        </div>
      </div>

      {/* 현재 날씨 + 지역 셀렉트 */}
      <CurrentWeatherStrip
        weather={weather}
        isLoading={weatherLoading || weatherSwitching}
        isError={weatherError}
        regionId={regionId}
        regions={REGIONS}
        onRegionChange={setRegionId}
      />

      {/* 모바일(lg 미만): 탭 레이아웃 */}
      <WeatherMobileTabs
        regionId={region.id}
        areaKeyword={region.areaKeyword}
        className="lg:hidden"
      />

      {/* 데스크탑(lg 이상): 기존 스크롤 레이아웃 */}
      <div className="hidden lg:flex flex-col flex-1 overflow-y-auto px-5 py-4 bg-sand space-y-3">
        <RadarGrid />

        <div className="flex gap-3" style={{ maxHeight: 300 }}>
          <ShortForecastCard items={shortFcst} isLoading={shortLoading || shortSwitching} isError={shortError} error={shortErrorObj} />
          <AlertsCard alerts={alerts} isLoading={alertsLoading} />
          <TyphoonCard />
        </div>
      </div>
    </div>
  );
}
