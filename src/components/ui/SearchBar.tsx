import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { HolographicPanel } from './HolographicPanel'
import { GALAXIES } from '../../data/galaxies'
import { SUN_DATA, PLANETS, MOONS } from '../../data/solarSystem'
import type { CelestialObject, ViewLevel } from '../../types/celestial'

export const SearchBar: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const setSearchQuery = useStore((s) => s.setSearchQuery)
  const searchResults = useStore((s) => s.searchResults)
  const setSearchResults = useStore((s) => s.setSearchResults)
  const setSelectedObject = useStore((s) => s.setSelectedObject)
  const setFocusTarget = useStore((s) => s.setFocusTarget)

  const searchableObjects: CelestialObject[] = [SUN_DATA, ...PLANETS, ...MOONS, ...GALAXIES]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setSearchQuery(term)

    const normalizedTerm = term.trim().toLowerCase()
    if (!normalizedTerm) {
      setSearchResults([])
      return
    }

    setSearchResults(
      searchableObjects
        .filter((object) => object.name.toLowerCase().includes(normalizedTerm))
        .slice(0, 8)
    )
  }

  const getFocusView = (object: CelestialObject): ViewLevel => {
    if (object.type === 'galaxy') return 'universe'
    if (object.type === 'star') return 'solarSystem'
    return 'planet'
  }

  const getFocusDistance = (object: CelestialObject) => {
    if (object.type === 'galaxy') return Math.max(object.size * 1.4, 80)
    if (object.type === 'star') return 55
    return Math.max(object.size * 12, 18)
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search cosmos... (Ctrl+K)"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        style={{
          width: '100%',
          padding: '8px 12px',
          background: 'rgba(5, 8, 15, 0.5)',
          border: isFocused ? '1px solid rgba(68, 136, 204, 0.5)' : '1px solid rgba(68, 136, 204, 0.2)',
          borderRadius: '6px',
          color: '#e0e8f0',
          fontSize: '12px',
          fontFamily: 'inherit',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.2s',
          outline: 'none',
        }}
      />

      <AnimatePresence>
        {isFocused && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '8px',
              maxHeight: '300px',
              overflowY: 'auto',
              zIndex: 100,
            }}
          >
            <HolographicPanel>
              <div>
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => {
                      setSelectedObject(result)
                      setFocusTarget({
                        objectId: result.id,
                        position: result.position,
                        viewLevel: getFocusView(result),
                        distance: getFocusDistance(result),
                      })
                      setSearchTerm('')
                      setSearchResults([])
                    }}
                    style={{
                      padding: '8px',
                      color: '#88ccff',
                      fontSize: '12px',
                      cursor: 'pointer',
                      borderBottom: '1px solid rgba(68, 136, 204, 0.1)',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(68, 136, 204, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <div style={{ fontWeight: 500 }}>{result.name}</div>
                    <div style={{ fontSize: '10px', color: '#666' }}>{result.type}</div>
                  </div>
                ))}
              </div>
            </HolographicPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
