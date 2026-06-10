import { create } from 'zustand'
import type { ViewLevel, CelestialObject, CameraState, FocusTarget } from '../types/celestial'

interface UniverseState {
  // View state
  currentView: ViewLevel
  setCurrentView: (view: ViewLevel) => void

  // Selected object
  selectedObject: CelestialObject | null
  setSelectedObject: (obj: CelestialObject | null) => void

  // Camera state
  camera: CameraState
  setCamera: (camera: Partial<CameraState>) => void

  // Focus target for smooth transitions
  focusTarget: FocusTarget | null
  setFocusTarget: (target: FocusTarget | null) => void

  // Search
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchResults: CelestialObject[]
  setSearchResults: (results: CelestialObject[]) => void

  // UI state
  showInfoPanel: boolean
  setShowInfoPanel: (show: boolean) => void
  showMinimap: boolean
  setShowMinimap: (show: boolean) => void
  showSearch: boolean
  setShowSearch: (show: boolean) => void
  isTransitioning: boolean
  setIsTransitioning: (is: boolean) => void

  // Settings
  autoRotate: boolean
  setAutoRotate: (auto: boolean) => void
  showLabels: boolean
  setShowLabels: (show: boolean) => void
  showOrbits: boolean
  setShowOrbits: (show: boolean) => void

  // Time
  timeScale: number
  setTimeScale: (scale: number) => void
}

export const useStore = create<UniverseState>((set) => ({
  // View state
  currentView: 'universe',
  setCurrentView: (view) => set({ currentView: view }),

  // Selected object
  selectedObject: null,
  setSelectedObject: (obj) => set({ selectedObject: obj, showInfoPanel: obj !== null }),

  // Camera state
  camera: {
    position: [0, 50, 200],
    target: [0, 0, 0],
    zoom: 1,
  },
  setCamera: (camera) => set((state) => ({ camera: { ...state.camera, ...camera } })),

  // Focus target
  focusTarget: null,
  setFocusTarget: (target) => set({ focusTarget: target }),

  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  searchResults: [],
  setSearchResults: (results) => set({ searchResults: results }),

  // UI state
  showInfoPanel: false,
  setShowInfoPanel: (show) => set({ showInfoPanel: show }),
  showMinimap: true,
  setShowMinimap: (show) => set({ showMinimap: show }),
  showSearch: false,
  setShowSearch: (show) => set({ showSearch: show }),
  isTransitioning: false,
  setIsTransitioning: (is) => set({ isTransitioning: is }),

  // Settings
  autoRotate: true,
  setAutoRotate: (auto) => set({ autoRotate: auto }),
  showLabels: true,
  setShowLabels: (show) => set({ showLabels: show }),
  showOrbits: true,
  setShowOrbits: (show) => set({ showOrbits: show }),

  // Time
  timeScale: 1,
  setTimeScale: (scale) => set({ timeScale: scale }),
}))
