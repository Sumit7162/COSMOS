import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface BlackHoleProps {
  position: [number, number, number]
  size?: number
  onClick?: () => void
}

export const BlackHole: React.FC<BlackHoleProps> = ({
  position,
  size = 5,
  onClick,
}) => {
  console.log('[Debug] BlackHole mounting at', position, 'size:', size)
  const diskRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)

  const diskTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 128
    const ctx = canvas.getContext('2d')!

    const gradient = ctx.createLinearGradient(0, 0, 512, 0)
    gradient.addColorStop(0, 'rgba(40, 20, 80, 0)')
    gradient.addColorStop(0.2, '#4422aa')
    gradient.addColorStop(0.4, '#aa44cc')
    gradient.addColorStop(0.5, '#ff6644')
    gradient.addColorStop(0.6, '#aa44cc')
    gradient.addColorStop(0.8, '#4422aa')
    gradient.addColorStop(1, 'rgba(40, 20, 80, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 512, 128)

    // Add some noise/streaks
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 512
      const y = Math.random() * 128
      const w = 1 + Math.random() * 5
      const alpha = Math.random() * 0.3
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
      ctx.fillRect(x, y, w, 3)
    }

    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame((_, delta) => {
    timeRef.current += delta
    if (diskRef.current) {
      diskRef.current.rotation.z += delta * 0.5
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(timeRef.current * 2) * 0.02)
    }
  })

  return (
    <group position={position}>
      {/* Event horizon (black sphere) */}
      <mesh onClick={onClick}>
        <sphereGeometry args={[size * 0.3, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Accretion disk */}
      <mesh ref={diskRef} rotation={[Math.PI * 0.4, 0, 0]}>
        <ringGeometry args={[size * 0.4, size * 1.5, 64]} />
        <meshBasicMaterial
          map={diskTexture}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner glow */}
      <mesh ref={glowRef}>
        <ringGeometry args={[size * 0.2, size * 0.5, 32]} />
        <meshBasicMaterial
          color="#ff8844"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer glow */}
      <mesh rotation={[Math.PI * 0.4, 0, 0]}>
        <ringGeometry args={[size * 0.8, size * 2, 48]} />
        <meshBasicMaterial
          color="#6622aa"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Gravitational lensing effect (faint glow around event horizon) */}
      <mesh>
        <sphereGeometry args={[size * 0.35, 32, 32]} />
        <meshBasicMaterial
          color="#ff8844"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}
