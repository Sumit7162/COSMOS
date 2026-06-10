import React from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../../store/useStore'

export const NavControls: React.FC = () => {
  const autoRotate = useStore((s) => s.autoRotate)
  const setAutoRotate = useStore((s) => s.setAutoRotate)
  const showLabels = useStore((s) => s.showLabels)
  const setShowLabels = useStore((s) => s.setShowLabels)
  const showOrbits = useStore((s) => s.showOrbits)
  const setShowOrbits = useStore((s) => s.setShowOrbits)
  const showMinimap = useStore((s) => s.showMinimap)
  const setShowMinimap = useStore((s) => s.setShowMinimap)

  const buttonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '8px 12px',
    margin: '4px',
    background: isActive ? 'rgba(68, 136, 204, 0.2)' : 'rgba(255, 255, 255, 0.05)',
    border: isActive ? '1px solid rgba(68, 136, 204, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '6px',
    color: isActive ? '#88ccff' : '#8899aa',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: 500,
    fontFamily: 'inherit',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.2s',
    display: 'inline-block',
  })

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: '20px',
        bottom: '20px',
        zIndex: 40,
        background: 'linear-gradient(135deg, rgba(68, 136, 204, 0.1) 0%, rgba(34, 68, 102, 0.05) 100%)',
        border: '1px solid rgba(68, 136, 204, 0.2)',
        borderRadius: '8px',
        backdropFilter: 'blur(10px)',
        padding: '12px',
        boxShadow: '0 8px 32px rgba(68, 136, 204, 0.1)',
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <button onClick={() => setAutoRotate(!autoRotate)} style={buttonStyle(autoRotate)}>
          ⟳ Auto-Rotate
        </button>
        <button onClick={() => setShowLabels(!showLabels)} style={buttonStyle(showLabels)}>
          ⊕ Labels
        </button>
        <button onClick={() => setShowOrbits(!showOrbits)} style={buttonStyle(showOrbits)}>
          ◯ Orbits
        </button>
        <button onClick={() => setShowMinimap(!showMinimap)} style={buttonStyle(showMinimap)}>
          ⊞ Minimap
        </button>
      </div>
    </motion.div>
  )
}
