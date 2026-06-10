import React, { useCallback } from 'react'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import type { GalaxyData, CelestialObject } from '../../types/celestial'
import { GALAXIES, SUPERCLUSTERS } from '../../data/galaxies'
import { Galaxy } from '../celestial/Galaxy'
import { BlackHole } from '../celestial/BlackHole'
import { HolographicLabel } from '../ui/HolographicPanel'
import { NebulaField } from '../effects/Nebula'
import { LightningStorms } from '../effects/CosmicLightning'

const QUASARS = [
  { id: 'q1', name: 'SDSS J0100+2802', position: [800, 200, 600] as [number, number, number], size: 3, redshift: 6.3 },
  { id: 'q2', name: 'TON 618', position: [-500, 300, 700] as [number, number, number], size: 5, redshift: 2.2 },
  { id: 'q3', name: '3C 273', position: [400, -100, 500] as [number, number, number], size: 2, redshift: 0.158 },
]

export const UniverseScene: React.FC = () => {
  const setFocusTarget = useStore((s) => s.setFocusTarget)
  const setSelectedObject = useStore((s) => s.setSelectedObject)
  const showLabels = useStore((s) => s.showLabels)

  const handleGalaxyClick = useCallback((data: GalaxyData) => {
    setSelectedObject({
      ...data,
      type: 'galaxy',
    })
    setFocusTarget({
      objectId: data.id,
      position: data.position,
      viewLevel: 'galaxy',
      distance: data.size * 2,
    })
  }, [setFocusTarget, setSelectedObject])

  const handleQuasarClick = useCallback((q: typeof QUASARS[0]) => {
    setSelectedObject({
      id: q.id,
      name: q.name,
      type: 'quasar',
      position: q.position,
      size: q.size,
      description: `Quasar with redshift ${q.redshift}. One of the most luminous objects in the universe.`,
      scientificData: {
        'Redshift': q.redshift,
        'Luminosity': `${(Math.random() * 100 + 50).toFixed(0)} trillion × Sun`,
        'Distance': `${(q.redshift * 3000).toFixed(0)} million ly`,
      },
    })
    setFocusTarget({
      objectId: q.id,
      position: q.position,
      viewLevel: 'galaxy',
      distance: q.size * 5,
    })
  }, [setFocusTarget, setSelectedObject])

  return (
    <group>
      {/* Subtle ambient glow */}
      <ambientLight intensity={0.08} color="#222244" />
      <pointLight position={[0, 0, 0]} intensity={0.8} color="#ffffff" />
      
      {/* Colored ambient from nebulae */}
      <hemisphereLight
        args={['#442288', '#001122', 0.3]}
      />

      {/* ====== CINEMATIC EFFECTS ====== */}

      {/* Volumetric Nebula Clouds */}
      <NebulaField />

      {/* Cosmic Lightning Storms */}
      <LightningStorms />

      {/* ====== SUPERCLUSTERS ====== */}
      {SUPERCLUSTERS.map((sc) => (
        <group key={sc.id}>
          <mesh position={sc.position}>
            <sphereGeometry args={[sc.size, 24, 24]} />
            <meshBasicMaterial
              color="#224488"
              transparent
              opacity={0.02}
              wireframe
            />
          </mesh>
          {showLabels && (
            <HolographicLabel
              position={[sc.position[0], sc.position[1] + sc.size + 10, sc.position[2]]}
              text={sc.name}
              color="#4488cc"
            />
          )}
        </group>
      ))}

      {/* ====== GALAXIES ====== */}
      {GALAXIES.map((galaxy) => (
        <group key={galaxy.id}>
          <Galaxy data={galaxy} onClick={handleGalaxyClick} />
          {showLabels && (
            <HolographicLabel
              position={[
                galaxy.position[0],
                galaxy.position[1] + galaxy.size * 0.7,
                galaxy.position[2],
              ]}
              text={galaxy.name}
              color="#88ccff"
            />
          )}
        </group>
      ))}

      {/* ====== QUASARS ====== */}
      {QUASARS.map((q) => (
        <group key={q.id}>
          <mesh
            position={q.position}
            onClick={() => handleQuasarClick(q)}
          >
            <sphereGeometry args={[q.size, 16, 16]} />
            <meshBasicMaterial
              color="#ff4488"
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          {/* Quasar jet */}
          <mesh position={q.position} rotation={[0.3, 0.5, 0]}>
            <cylinderGeometry args={[0.2, q.size * 2, q.size * 4, 8]} />
            <meshBasicMaterial
              color="#4488ff"
              transparent
              opacity={0.2}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          {showLabels && (
            <HolographicLabel
              position={[q.position[0], q.position[1] + q.size + 5, q.position[2]]}
              text={q.name}
              color="#ff4488"
            />
          )}
        </group>
      ))}

      {/* Cosmic web connections */}
      {GALAXIES.slice(0, 5).map((g, i) => 
        GALAXIES.slice(i + 1, 6).map((g2) => (
          <line key={`web-${g.id}-${g2.id}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([
                  ...g.position,
                  ...g2.position,
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color="#222244"
              transparent
              opacity={0.08}
            />
          </line>
        ))
      )}
    </group>
  )
}
