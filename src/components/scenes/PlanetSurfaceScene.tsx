import React from 'react'

export const PlanetSurfaceScene: React.FC = () => {
  return (
    <group>
      <mesh position={[0, -50, 0]}>
        <planeGeometry args={[500, 500, 128, 128]} />
        <meshStandardMaterial color="#1a4d2e" roughness={0.8} metalness={0.1} />
      </mesh>
    </group>
  )
}
