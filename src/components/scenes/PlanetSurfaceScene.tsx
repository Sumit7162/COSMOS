import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

export const PlanetSurfaceScene: React.FC = () => {
  const selectedObject = useStore((s) => s.selectedObject)
  const groundRef = useRef<THREE.Mesh>(null)

  const terrainTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')!

    // Generate terrain-like noise pattern
    const color1 = '#446688'
    const color2 = '#6688aa'
    const color3 = '#88aacc'

    for (let x = 0; x < 512; x++) {
      for (let y = 0; y < 512; y++) {
        const n = Math.sin(x * 0.02) * Math.cos(y * 0.03) +
                  Math.sin((x + y) * 0.04) * 0.5 +
                  Math.cos(x * 0.01 - y * 0.02) * 0.3
        const t = (n + 1) / 2
        const r = t < 0.3 ? color1 : t < 0.6 ? color2 : color3
        ctx.fillStyle = r
        ctx.fillRect(x, y, 1, 1)
      }
    }

    return new THREE.CanvasTexture(canvas)
  }, [])

  // Atmosphere glow
  const glowTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')!

    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
    gradient.addColorStop(0, 'rgba(68, 136, 204, 0)')
    gradient.addColorStop(0.5, 'rgba(68, 136, 204, 0.1)')
    gradient.addColorStop(0.8, 'rgba(68, 136, 204, 0.3)')
    gradient.addColorStop(1, 'rgba(68, 136, 204, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 128, 128)

    return new THREE.CanvasTexture(canvas)
  }, [])

  if (!selectedObject) return null

  return (
    <group>
      {/* Ambient light for surface */}
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[50, 100, 50]}
        intensity={1.5}
        color="#fff8e8"
      />

      {/* Planet surface (curved ground) */}
      <mesh ref={groundRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
        <sphereGeometry args={[10, 64, 64]} />
        <meshPhongMaterial
          map={terrainTexture}
          bumpMap={terrainTexture}
          bumpScale={0.1}
          specular={new THREE.Color('#222244')}
          shininess={5}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[12, 32, 32]} />
        <meshBasicMaterial
          map={glowTexture}
          transparent
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Horizon fog / sky dome */}
      <mesh>
        <sphereGeometry args={[100, 32, 32]} />
        <meshBasicMaterial
          color="#000011"
          side={THREE.BackSide}
        />
      </mesh>

      {/* Stars visible from surface */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2000}
            array={new Float32Array(2000 * 3).map(() => (Math.random() - 0.5) * 1000)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.5}
          color="#ffffff"
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
    </group>
  )
}
