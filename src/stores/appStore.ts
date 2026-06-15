import { create } from 'zustand';

const useAppStore = create((set) => ({
  // 선택된 관측소 (모달용)
  selectedStation: null,
  setSelectedStation: (station) => set({ selectedStation: station }),
  closeModal: () => set({ selectedStation: null }),

  // 현재 활성 탭
  activeTab: 'dashboard',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // 지도 마커 선택 상태
  selectedMapMarker: null,
  setSelectedMapMarker: (markerId) => set({ selectedMapMarker: markerId }),
}));

export default useAppStore;
