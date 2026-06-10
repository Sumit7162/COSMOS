import React, { useState, Suspense } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { Stats } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from './store/useStore'
import { Starfield } from './components/Starfield'
import { CameraController } from './components/CameraController'
import { Effects } from './components/Effects'
import { UniverseScene } from './components/scenes/UniverseScene'
import { SolarSystemScene } from './components/scenes/SolarSystemScene'
import { PlanetSurfaceScene } from './components/scenes/PlanetSurfaceScene'
import { InfoPanel } from './components/ui/InfoPanel'
import { SearchBar } from './components/ui/SearchBar'
import { Minimap } from './components/ui/Minimap'
import { NavControls } from './components/ui/NavControls'
import { LoadingScreen } from './components/ui/LoadingScreen'

function SceneContent() {
  const currentView = useStore((s) => s.currentView)

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[100, 100, 100]} intensity={0.5} />

      {/* Camera */}
      <CameraController />

      {/* Universe elements - always present */}
      {currentView !== 'surface' && <Starfield />}

      {/* Scene switching */}
      {currentView === 'universe' && <UniverseScene />}
      {(currentView === 'galaxy' || currentView === 'solarSystem' || currentView === 'planet') && (
        <SolarSystemScene />
      )}
      {currentView === 'surface' && <PlanetSurfaceScene />}

      {/* Post-processing effects */}
      <Effects />

      {/* Performance stats in development */}
      {import.meta.env.DEV && <Stats />}
    </>
  )
}

const TopBar: React.FC = () => {
  const selectedObject = useStore((s) => s.selectedObject)
  const showInfoPanel = useStore((s) => s.showInfoPanel)
  const setShowInfoPanel = useStore((s) => s.setShowInfoPanel)
  const setCurrentView = useStore((s) => s.setCurrentView)
  const setFocusTarget = useStore((s) => s.setFocusTarget)
  const setSelectedObject = useStore((s) => s.setSelectedObject)

  const handleResetView = () => {
    setSelectedObject(null)
    setShowInfoPanel(false)
    setCurrentView('universe')
    setFocusTarget({
      objectId: 'origin',
      position: [0, 0, 0],
      viewLevel: 'universe',
      distance: 200,
    })
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        background: 'linear-gradient(180deg, rgba(5, 8, 15, 0.8) 0%, transparent 100%)',
      }}
    >
      {/* Logo */}
      <div
        onClick={handleResetView}
        style={{
          fontSize: '13px',
          fontWeight: 600,
          color: '#88ccff',
          cursor: 'pointer',
          letterSpacing: '2px',
          textTransform: 'uppercase' as const,
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8' }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
      >
        <span style={{ fontSize: '18px' }}>✦</span>
        <span>Cosmos</span>
      </div>

      {/* Search bar */}
      <div style={{ flex: 1, maxWidth: '400px' }}>
        <SearchBar />
      </div>

      {/* Right side controls */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {selectedObject && !showInfoPanel && (
          <button
            onClick={() => setShowInfoPanel(true)}
            style={{
              background: 'rgba(68, 136, 204, 0.15)',
              border: '1px solid rgba(68, 136, 204, 0.3)',
              borderRadius: '8px',
              color: '#88ccff',
              cursor: 'pointer',
              padding: '8px 12px',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.5px',
              fontFamily: "'Inter', sans-serif",
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(68, 136, 204, 0.25)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(68, 136, 204, 0.15)'
            }}
          >
            ℹ Info
          </button>
        )}

        <button
          onClick={handleResetView}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: '#8899aa',
            cursor: 'pointer',
            padding: '8px 12px',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.5px',
            fontFamily: "'Inter', sans-serif",
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
          }}
        >
          ✦ Reset
        </button>
      </div>
    </div>
  )
}

function App() {
  const [loading, setLoading] = useState(true)

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#05080f',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {loading && (
        <LoadingScreen onComplete={() => setLoading(false)} />
      )}

      <AnimatePresence>
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
            }}
          >
            {/* 3D Canvas */}
            <Canvas
              camera={{
                position: [0, 50, 200],
                fov: 60,
                near: 0.1,
                far: 10000,
              }}
              gl={{
                antialias: true,
                shadows: true,
                outputColorSpace: THREE.SRGBColorSpace,
                powerPreference: "high-performance",
              }}
              style={{ width: '100%', height: '100%' }}
            >
              <Suspense fallback={null}>
                <SceneContent />
              </Suspense>
            </Canvas>

            {/* UI Overlays */}
            <TopBar />
            <InfoPanel />
            <Minimap />
            <NavControls />

            {/* Bottom hint */}
            <div
              style={{
                position: 'fixed',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 50,
                fontSize: '11px',
                color: 'rgba(68, 136, 204, 0.3)',
                fontFamily: "'Inter', sans-serif",
                letterSpacing: '1px',
                textAlign: 'center',
                pointerEvents: 'none',
              }}
            >
              Drag to orbit · Scroll to zoom · ⌘K to search
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
