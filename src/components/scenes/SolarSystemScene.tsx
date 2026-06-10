import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import { PLANETS, MOONS, SUN_DATA, ASTEROID_BELT, KUIPER_BELT } from '../../data/solarSystem'
import { Planet } from '../celestial/Planet'
import type { CelestialObject, MoonData, PlanetData } from '../../types/celestial'

export const SolarSystemScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null)
  const timeScale = useStore((s) => s.timeScale)
  const showOrbits = useStore((s) => s.showOrbits)
  const setSelectedObject = useStore((s) => s.setSelectedObject)
  const setFocusTarget = useStore((s) => s.setFocusTarget)

  const moonsByPlanet = useMemo(() => {
    return MOONS.reduce<Record<string, MoonData[]>>((acc, moon) => {
      acc[moon.parentId] = [...(acc[moon.parentId] || []), moon]
      return acc
    }, {})
  }, [])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.002 * timeScale
  })

  const handleObjectClick = (object: CelestialObject) => {
    const distance = object.type === 'star' ? 55 : Math.max(object.size * 12, 18)

    setSelectedObject(object)
    setFocusTarget({
      objectId: object.id,
      position: object.position,
      viewLevel: object.type === 'star' ? 'solarSystem' : 'planet',
      distance,
    })
  }

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.18} />
      <pointLight position={[0, 0, 0]} intensity={5} distance={260} color="#ffdca8" />

      <mesh onClick={(e) => { e.stopPropagation(); handleObjectClick(SUN_DATA) }}>
        <sphereGeometry args={[SUN_DATA.size, 64, 64]} />
        <meshBasicMaterial color="#ffcc66" />
      </mesh>
      <mesh>
        <sphereGeometry args={[SUN_DATA.size * 1.18, 48, 48]} />
        <meshBasicMaterial
          color="#ff8844"
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {showOrbits && (
        <>
          <Belt innerRadius={ASTEROID_BELT.innerRadius} outerRadius={ASTEROID_BELT.outerRadius} color={ASTEROID_BELT.color} />
          <Belt innerRadius={KUIPER_BELT.innerRadius} outerRadius={KUIPER_BELT.outerRadius} color={KUIPER_BELT.color} />
        </>
      )}

      {PLANETS.map((planet: PlanetData) => (
        <Planet
          key={planet.id}
          data={planet}
          moons={moonsByPlanet[planet.id]}
          onClick={handleObjectClick}
        />
      ))}
    </group>
  )
}

interface BeltProps {
  innerRadius: number
  outerRadius: number
  color: string
}

const Belt: React.FC<BeltProps> = ({ innerRadius, outerRadius, color }) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]}>
    <ringGeometry args={[innerRadius, outerRadius, 128]} />
    <meshBasicMaterial
      color={color}
      transparent
      opacity={0.04}
      side={THREE.DoubleSide}
      depthWrite={false}
    />
  </mesh>
)
