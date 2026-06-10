import React from 'react'
import { useStore } from '../../store/useStore'

export const UniverseScene: React.FC = () => {
  const setSelectedObject = useStore((s) => s.setSelectedObject)
  const setFocusTarget = useStore((s) => s.setFocusTarget)

  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[100, 32, 32]} />
        <meshBasicMaterial color="#0a1e3a" wireframe />
      </mesh>
    </group>
  )
}
