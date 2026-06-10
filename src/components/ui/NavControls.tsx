import React from 'react'
import { useStore } from '../../store/useStore'
import { HolographicPanel, GlassButton } from './HolographicPanel'

export const NavControls: React.FC = () => {
  const currentView = useStore((s) => s.currentView)
  const setCurrentView = useStore((s) => s.setCurrentView)
  const setFocusTarget = useStore((s) => s.setFocusTarget)
  const autoRotate = useStore((s) => s.autoRotate)
  const setAutoRotate = useStore((s) => s.setAutoRotate)
  const showLabels = useStore((s) => s.showLabels)
  const setShowLabels = useStore((s) => s.setShowLabels)
  const showOrbits = useStore((s) => s.showOrbits)
  const setShowOrbits = useStore((s) => s.setShowOrbits)
  const timeScale = useStore((s) => s.timeScale)
  const setTimeScale = useStore((s) => s.setTimeScale)
  const showMinimap = useStore((s) => s.showMinimap)
  const setShowMinimap = useStore((s) => s.setShowMinimap)
  const showSearch = useStore((s) => s.showSearch)
  const setShowSearch = useStore((s) => s.setShowSearch)

  const handleZoomOut = () => {
    const views = ['surface', 'planet', 'solarSystem', 'galaxy', 'universe'] as const
    const currentIndex = views.indexOf(currentView as typeof views[number])
    if (currentIndex < views.length - 1) {
      const targetView = views[currentIndex + 1]
      
      // Calculate position based on target view
      let position: [number, number, number]
      let distance: number
      
      switch (targetView) {
        case 'universe':
          position = [0, 50, 200]
          distance = 200
          break
        case 'galaxy':
          position = [0, 20, 80]
          distance = 80
          break
        case 'solarSystem':
          position = [0, 10, 40]
          distance = 40
          break
        default:
          position = [0, 5, 20]
          distance = 20
      }
      
      setFocusTarget({
        objectId: 'origin',
        position,
        viewLevel: targetView,
        distance,
      })
    }
  }

  const handleZoomIn = () => {
    const views = ['universe', 'galaxy', 'solarSystem', 'planet', 'surface'] as const
    const currentIndex = views.indexOf(currentView as typeof views[number])
    if (currentIndex < views.length - 1) {
      setFocusTarget({
        objectId: 'origin',
        position: [0, 0, 0],
        viewLevel: views[currentIndex + 1],
        distance: currentIndex === 0 ? 80 : currentIndex === 1 ? 40 : currentIndex === 2 ? 10 : 3,
      })
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {/* Zoom controls */}
      <HolographicPanel style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <GlassButton onClick={handleZoomIn}>
          <span style={{ fontSize: '16px', lineHeight: 1 }}>＋</span>
        </GlassButton>
        <GlassButton onClick={handleZoomOut}>
          <span style={{ fontSize: '16px', lineHeight: 1 }}>−</span>
        </GlassButton>
      </HolographicPanel>

      {/* Settings */}
      <HolographicPanel style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <GlassButton
          onClick={() => setAutoRotate(!autoRotate)}
          active={autoRotate}
          style={{ fontSize: '10px', padding: '6px 8px', textAlign: 'center' }}
        >
          Auto
        </GlassButton>
        <GlassButton
          onClick={() => setShowLabels(!showLabels)}
          active={showLabels}
          style={{ fontSize: '10px', padding: '6px 8px', textAlign: 'center' }}
        >
          Labels
        </GlassButton>
        <GlassButton
          onClick={() => setShowOrbits(!showOrbits)}
          active={showOrbits}
          style={{ fontSize: '10px', padding: '6px 8px', textAlign: 'center' }}
        >
          Orbits
        </GlassButton>
        <GlassButton
          onClick={() => setShowMinimap(!showMinimap)}
          active={showMinimap}
          style={{ fontSize: '10px', padding: '6px 8px', textAlign: 'center' }}
        >
          Map
        </GlassButton>
      </HolographicPanel>

      {/* Time scale */}
      <HolographicPanel style={{ padding: '8px' }}>
        <div style={{
          fontSize: '9px',
          color: '#446688',
          textTransform: 'uppercase' as const,
          letterSpacing: '1.5px',
          textAlign: 'center' as const,
          marginBottom: '4px',
        }}>
          Speed
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[0, 1, 10, 100].map((speed) => (
            <GlassButton
              key={speed}
              onClick={() => setTimeScale(speed)}
              active={timeScale === speed}
              style={{
                fontSize: '9px',
                padding: '4px 6px',
                flex: 1,
                textAlign: 'center',
              }}
            >
              {speed}x
            </GlassButton>
          ))}
        </div>
      </HolographicPanel>
    </div>
  )
}
