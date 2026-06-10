import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { HolographicPanel } from './HolographicPanel'

export const InfoPanel: React.FC = () => {
  const selectedObject = useStore((s) => s.selectedObject)
  const showInfoPanel = useStore((s) => s.showInfoPanel)
  const setShowInfoPanel = useStore((s) => s.setShowInfoPanel)

  const typeColors: Record<string, string> = {
    galaxy: '#88ccff',
    star: '#ffcc44',
    planet: '#44cc88',
    moon: '#8899aa',
    blackHole: '#cc4488',
    quasar: '#ff4488',
    nebula: '#8844cc',
  }

  const typeIcons: Record<string, string> = {
    galaxy: '✦',
    star: '★',
    planet: '●',
    moon: '○',
    blackHole: '◆',
    quasar: '⬡',
    nebula: '◈',
  }

  return (
    <AnimatePresence>
      {showInfoPanel && selectedObject && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            width: '320px',
            maxHeight: 'calc(100vh - 100px)',
            zIndex: 100,
            overflow: 'hidden',
          }}
        >
          <HolographicPanel>
            {/* Close button */}
            <button
              onClick={() => setShowInfoPanel(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'none',
                border: 'none',
                color: '#6688aa',
                cursor: 'pointer',
                fontSize: '18px',
                fontFamily: 'monospace',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#88ccff' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#6688aa' }}
            >
              ✕
            </button>

            {/* Header */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '8px',
              }}>
                <span style={{
                  fontSize: '24px',
                  color: typeColors[selectedObject.type] || '#88ccff',
                }}>
                  {typeIcons[selectedObject.type] || '✦'}
                </span>
                <div>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#e0e8f0',
                  }}>
                    {selectedObject.name}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: typeColors[selectedObject.type] || '#88ccff',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '1.5px',
                    fontWeight: 500,
                  }}>
                    {selectedObject.type}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {selectedObject.description && (
              <p style={{
                fontSize: '13px',
                lineHeight: 1.5,
                color: '#8899bb',
                marginBottom: '16px',
                borderBottom: '1px solid rgba(68, 136, 204, 0.1)',
                paddingBottom: '12px',
              }}>
                {selectedObject.description}
              </p>
            )}

            {/* Scientific data */}
            {selectedObject.scientificData && (
              <div>
                <div style={{
                  fontSize: '10px',
                  color: '#4488aa',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '2px',
                  marginBottom: '10px',
                  fontWeight: 600,
                }}>
                  Scientific Data
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {Object.entries(selectedObject.scientificData).map(([key, value]) => (
                    <div
                      key={key}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '6px 8px',
                        background: 'rgba(68, 136, 204, 0.05)',
                        borderRadius: '6px',
                        border: '1px solid rgba(68, 136, 204, 0.08)',
                      }}
                    >
                      <span style={{
                        fontSize: '11px',
                        color: '#6688aa',
                        fontWeight: 500,
                      }}>
                        {key}
                      </span>
                      <span style={{
                        fontSize: '12px',
                        color: '#c0d8f0',
                        fontWeight: 600,
                        fontFamily: "'SF Mono', 'Fira Code', monospace",
                      }}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </HolographicPanel>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
