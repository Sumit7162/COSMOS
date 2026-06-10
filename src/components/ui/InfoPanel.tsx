import React from 'react'
import { AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { HolographicPanel } from './HolographicPanel'

export const InfoPanel: React.FC = () => {
  const selectedObject = useStore((s) => s.selectedObject)
  const showInfoPanel = useStore((s) => s.showInfoPanel)

  return (
    <AnimatePresence>
      {showInfoPanel && selectedObject && (
        <HolographicPanel
          style={{
            position: 'fixed',
            right: '20px',
            top: '70px',
            width: '350px',
            maxHeight: '70vh',
            overflow: 'auto',
            zIndex: 40,
            padding: '20px',
          }}
        >
          <div style={{ color: '#88ccff' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>
              {selectedObject.name}
            </h2>
            <p style={{ fontSize: '12px', color: '#aabbcc', marginBottom: '16px' }}>
              {selectedObject.type}
            </p>
            {selectedObject.description && (
              <p style={{ fontSize: '13px', color: '#99aacc', lineHeight: 1.6 }}>
                {selectedObject.description}
              </p>
            )}
            {selectedObject.scientificData && (
              <div style={{ marginTop: '16px', fontSize: '12px' }}>
                {Object.entries(selectedObject.scientificData).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#aabbcc' }}>{key}:</span>
                    <span style={{ color: '#88ccff', fontWeight: 500 }}>{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </HolographicPanel>
      )}
    </AnimatePresence>
  )
}
