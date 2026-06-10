import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

export const SolarSystemScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null)
  const timeScale = useStore((s) => s.timeScale)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.01 * timeScale
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[30, 32, 32]} />
        <meshBasicMaterial color="#1a3a52" wireframe />
      </mesh>
    </group>
  )
}
