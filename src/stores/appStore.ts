import { create } from 'zustand'
import type { Station } from '@/types'

interface AppStore {
  selectedStation: Station | null
  setSelectedStation: (station: Station) => void
  closeModal: () => void

  activeTab: string
  setActiveTab: (tab: string) => void

  selectedMapMarker: string | null
  setSelectedMapMarker: (markerId: string | null) => void
}

const useAppStore = create<AppStore>((set) => ({
  selectedStation: null,
  setSelectedStation: (station) => set({ selectedStation: station }),
  closeModal: () => set({ selectedStation: null }),

  activeTab: 'dashboard',
  setActiveTab: (tab) => set({ activeTab: tab }),

  selectedMapMarker: null,
  setSelectedMapMarker: (markerId) => set({ selectedMapMarker: markerId }),
}))

export default useAppStore
