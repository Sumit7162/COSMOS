import React, { useCallback, useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import type { PlanetData, MoonData, CelestialObject } from '../../types/celestial'
import { PLANETS, MOONS, SUN_DATA, ASTEROID_BELT, KUIPER_BELT } from '../../data/solarSystem'
import { Planet } from '../celestial/Planet'

export const SolarSystemScene: React.FC = () => {
  const setFocusTarget = useStore((s) => s.setFocusTarget)
  const setSelectedObject = useStore((s) => s.setSelectedObject)
  const currentView = useStore((s) => s.currentView)
  const timeScale = useStore((s) => s.timeScale)
  const sunRef = useRef<THREE.Mesh>(null)

  const handlePlanetClick = useCallback((data: PlanetData | MoonData) => {
    setSelectedObject(data)
    if (data.type === 'planet') {
      setFocusTarget({
        objectId: data.id,
        position: [data.orbitalRadius, 0, 0],
        viewLevel: 'planet',
        distance: data.size * 3,
      })
    }
  }, [setFocusTarget, setSelectedObject])

  const handleSunClick = useCallback(() => {
    setSelectedObject({
      ...SUN_DATA,
      type: 'star' as const,
    } as CelestialObject)
    setFocusTarget({
      objectId: 'sun',
      position: [0, 0, 0],
      viewLevel: 'planet',
      distance: 20,
    })
  }, [setFocusTarget, setSelectedObject])

  // Memoize moons lookup for each planet
  const planetMoonsMap = useMemo(() => {
    const map = new Map<string, MoonData[]>()
    for (const planet of PLANETS) {
      map.set(planet.id, MOONS.filter((m) => m.parentId === planet.id))
    }
    return map
  }, [])

  // Sun rotation animation
  useFrame((_, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.1 * timeScale
    }
  })

  return (
    <group>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={3} color="#ffffff" decay={2} distance={200} />

      {/* Sun */}
      <mesh ref={sunRef} onClick={handleSunClick}>
        <sphereGeometry args={[SUN_DATA.size, 32, 32]} />
        <meshBasicMaterial color="#ffcc44" />
      </mesh>
      {/* Sun glow */}
      <mesh>
        <sphereGeometry args={[SUN_DATA.size * 1.2, 24, 24]} />
        <meshBasicMaterial
          color="#ff8822"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Sun corona */}
      <mesh>
        <sphereGeometry args={[SUN_DATA.size * 1.5, 24, 24]} />
        <meshBasicMaterial
          color="#ff6644"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Planets */}
      {PLANETS.map((planet) => (
        <Planet
          key={planet.id}
          data={planet}
          moons={planetMoonsMap.get(planet.id) || []}
          onClick={handlePlanetClick}
        />
      ))}

      {/* Asteroid Belt */}
      {currentView !== 'planet' && currentView !== 'surface' && (
        <AsteroidBeltField belt={ASTEROID_BELT} />
      )}

      {/* Kuiper Belt */}
      {currentView === 'universe' && (
        <AsteroidBeltField belt={KUIPER_BELT} />
      )}
    </group>
  )
}

const AsteroidBeltField: React.FC<{
  belt: typeof ASTEROID_BELT
}> = ({ belt }) => {
  const groupRef = useRef<THREE.Group>(null)
  const count = Math.min(belt.count, 500)

  // Generate asteroid positions
  const asteroids = useMemo(() => {
    const result: { pos: [number, number, number]; scale: number }[] = []
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * 2 * Math.PI
      const radius = belt.innerRadius + Math.random() * (belt.outerRadius - belt.innerRadius)
      const y = (Math.random() - 0.5) * 2
      const scale = 0.05 + Math.random() * 0.15
      result.push({
        pos: [radius * Math.cos(angle), y, radius * Math.sin(angle)],
        scale,
      })
    }
    return result
  }, [count, belt.innerRadius, belt.outerRadius])

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {asteroids.map((a, i) => (
        <mesh key={i} position={a.pos} scale={a.scale}>
          <sphereGeometry args={[1, 4, 4]} />
          <meshBasicMaterial color={belt.color} />
        </mesh>
      ))}
    </group>
  )
}
