import React from 'react'

export const UniverseScene: React.FC = () => {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[100, 32, 32]} />
        <meshBasicMaterial color="#0a1e3a" wireframe />
      </mesh>
    </group>
  )
}
