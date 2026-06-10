import React, { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import type { CelestialObject, GalaxyData, PlanetData, MoonData } from '../../types/celestial'
import { GALAXIES } from '../../data/galaxies'
import { PLANETS, MOONS, SUN_DATA } from '../../data/solarSystem'
import { HolographicPanel } from './HolographicPanel'

const ALL_OBJECTS: CelestialObject[] = [
  ...GALAXIES,
  SUN_DATA as CelestialObject,
  ...PLANETS,
  ...MOONS,
]

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<CelestialObject[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const setFocusTarget = useStore((s) => s.setFocusTarget)
  const setSelectedObject = useStore((s) => s.setSelectedObject)
  const setShowSearch = useStore((s) => s.setShowSearch)

  const handleSearch = useCallback((value: string) => {
    setQuery(value)
    setSelectedIndex(0)

    if (value.trim().length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    const searchLower = value.toLowerCase()
    const filtered = ALL_OBJECTS.filter((obj) =>
      obj.name.toLowerCase().includes(searchLower)
    ).slice(0, 10)

    setResults(filtered)
    setIsOpen(filtered.length > 0)
  }, [])

  const handleSelect = useCallback((obj: CelestialObject) => {
    setSelectedObject(obj)
    
    let distance = 20
    if (obj.type === 'galaxy') {
      distance = (obj as GalaxyData).size * 2
    } else if (obj.type === 'planet') {
      distance = (obj as PlanetData).size * 3
    }

    setFocusTarget({
      objectId: obj.id,
      position: obj.position,
      viewLevel: obj.type === 'galaxy' ? 'galaxy' : 
                 obj.type === 'planet' ? 'planet' : 'solarSystem',
      distance,
    })

    setIsOpen(false)
    setQuery('')
    setShowSearch(false)
  }, [setFocusTarget, setSelectedObject, setShowSearch])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
        setShowSearch(false)
        inputRef.current?.blur()
      }
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSelectedIndex((prev) => Math.max(prev - 1, 0))
        }
        if (e.key === 'Enter' && results[selectedIndex]) {
          handleSelect(results[selectedIndex])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, handleSelect])

  const typeIcons: Record<string, string> = {
    galaxy: '✦',
    star: '★',
    planet: '●',
    moon: '○',
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
      }}>
        <span style={{
          position: 'absolute',
          left: '12px',
          color: '#446688',
          fontSize: '14px',
          pointerEvents: 'none',
        }}>
          🔍
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Search galaxies, stars, planets..."
          style={{
            width: '100%',
            padding: '10px 12px 10px 36px',
            background: 'rgba(8, 12, 32, 0.8)',
            border: '1px solid rgba(68, 136, 204, 0.3)',
            borderRadius: '10px',
            color: '#c0d8f0',
            fontFamily: "'Inter', sans-serif",
            fontSize: '13px',
            outline: 'none',
            backdropFilter: 'blur(20px)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(68, 136, 204, 0.5)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(68, 136, 204, 0.3)'
          }}
        />
        <kbd style={{
          position: 'absolute',
          right: '10px',
          padding: '2px 6px',
          fontSize: '10px',
          color: '#446688',
          background: 'rgba(68, 136, 204, 0.1)',
          borderRadius: '4px',
          border: '1px solid rgba(68, 136, 204, 0.2)',
          fontFamily: "'SF Mono', monospace",
          pointerEvents: 'none',
        }}>
          ⌘K
        </kbd>
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '4px',
              zIndex: 200,
            }}
          >
            <HolographicPanel style={{ padding: '6px' }}>
              {results.map((obj, i) => (
                <div
                  key={obj.id}
                  onClick={() => handleSelect(obj)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    background: i === selectedIndex
                      ? 'rgba(68, 136, 204, 0.15)'
                      : 'transparent',
                    border: i === selectedIndex
                      ? '1px solid rgba(68, 136, 204, 0.3)'
                      : '1px solid transparent',
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{
                    fontSize: '16px',
                    color: obj.type === 'galaxy' ? '#88ccff' : 
                           obj.type === 'star' ? '#ffcc44' : 
                           obj.type === 'planet' ? '#44cc88' : '#8899aa',
                  }}>
                    {typeIcons[obj.type] || '✦'}
                  </span>
                  <div>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#c0d8f0',
                    }}>
                      {obj.name}
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: '#446688',
                      textTransform: 'uppercase' as const,
                      letterSpacing: '1px',
                    }}>
                      {obj.type}
                    </div>
                  </div>
                </div>
              ))}
            </HolographicPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
