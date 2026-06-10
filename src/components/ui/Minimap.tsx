import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { HolographicPanel } from './HolographicPanel'

const VIEW_LEVELS = [
  { id: 'universe' as const, label: 'Universe', icon: '✦' },
  { id: 'galaxy' as const, label: 'Galaxy', icon: '◈' },
  { id: 'solarSystem' as const, label: 'Solar System', icon: '◎' },
  { id: 'planet' as const, label: 'Planet', icon: '●' },
  { id: 'surface' as const, label: 'Surface', icon: '▦' },
]

export const Minimap: React.FC = () => {
  const showMinimap = useStore((s) => s.showMinimap)
  const currentView = useStore((s) => s.currentView)
  const selectedObject = useStore((s) => s.selectedObject)

  if (!showMinimap) return null

  const currentLevelIndex = VIEW_LEVELS.findIndex((l) => l.id === currentView)

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        left: '20px',
        zIndex: 100,
        width: '180px',
      }}
    >
      <HolographicPanel style={{ padding: '12px' }}>
        {/* Current location */}
        <div style={{
          fontSize: '10px',
          color: '#4488aa',
          textTransform: 'uppercase' as const,
          letterSpacing: '2px',
          marginBottom: '8px',
          fontWeight: 600,
        }}>
          Navigation
        </div>

        {/* View level indicators */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {VIEW_LEVELS.map((level, i) => {
            const isActive = i <= currentLevelIndex
            const isCurrent = level.id === currentView
            return (
              <div
                key={level.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 6px',
                  borderRadius: '4px',
                  background: isCurrent
                    ? 'rgba(68, 136, 204, 0.15)'
                    : 'transparent',
                  border: isCurrent
                    ? '1px solid rgba(68, 136, 204, 0.3)'
                    : '1px solid transparent',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{
                  fontSize: '12px',
                  color: isActive ? '#88ccff' : '#334466',
                  width: '16px',
                  textAlign: 'center' as const,
                }}>
                  {level.icon}
                </span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: isCurrent ? 600 : 400,
                  color: isCurrent ? '#c0d8f0' : isActive ? '#556688' : '#334466',
                  letterSpacing: '0.5px',
                }}>
                  {level.label}
                </span>
                {/* Connection line */}
                {i < VIEW_LEVELS.length - 1 && (
                  <span style={{
                    width: '1px',
                    height: '8px',
                    background: isActive ? 'rgba(68, 136, 204, 0.3)' : 'rgba(51, 52, 102, 0.3)',
                    marginLeft: '2px',
                  }} />
                )}
              </div>
            )
          })}
        </div>

        {/* Selected object info */}
        {selectedObject && (
          <div style={{
            marginTop: '8px',
            paddingTop: '8px',
            borderTop: '1px solid rgba(68, 136, 204, 0.1)',
          }}>
            <div style={{
              fontSize: '9px',
              color: '#446688',
              textTransform: 'uppercase' as const,
              letterSpacing: '1.5px',
              marginBottom: '4px',
            }}>
              Selected
            </div>
            <div style={{
              fontSize: '11px',
              color: '#88aacc',
              fontWeight: 500,
            }}>
              {selectedObject.name}
            </div>
          </div>
        )}
      </HolographicPanel>
    </div>
  )
}
