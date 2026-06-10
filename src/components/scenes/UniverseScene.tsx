import React from 'react'
import { Galaxy } from '../celestial/Galaxy'
import { BlackHole } from '../celestial/BlackHole'
import { NebulaField } from '../effects/Nebula'
import { LightningStorms } from '../effects/CosmicLightning'
import { GALAXIES } from '../../data/galaxies'
import { useStore } from '../../store/useStore'
import type { GalaxyData } from '../../types/celestial'

export const UniverseScene: React.FC = () => {
  console.log('[Debug] UniverseScene rendering with', GALAXIES.length, 'galaxies')
  const setSelectedObject = useStore((s) => s.setSelectedObject)
  const setFocusTarget = useStore((s) => s.setFocusTarget)

  const handleGalaxyClick = (galaxy: GalaxyData) => {
    setSelectedObject(galaxy)
    setFocusTarget({
      objectId: galaxy.id,
      position: galaxy.position,
      viewLevel: 'universe',
      distance: Math.max(galaxy.size * 1.4, 80),
    })
  }

  return (
    <group>
      <NebulaField />
      <LightningStorms />
      <BlackHole position={[-130, 30, 120]} size={22} />

      {GALAXIES.map((galaxy) => (
        <Galaxy
          key={galaxy.id}
          data={galaxy}
          onClick={handleGalaxyClick}
        />
      ))}
    </group>
  )
}
