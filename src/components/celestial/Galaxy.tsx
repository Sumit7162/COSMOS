import React, { useRef, useMemo, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { GalaxyData } from '../../types/celestial'
import { generateGalaxyPositionsAndColors } from '../../utils/math'
import { useStore } from '../../store/useStore'

interface GalaxyProps {
  data: GalaxyData
  onClick: (data: GalaxyData) => void
}

export const Galaxy: React.FC<GalaxyProps> = ({ data, onClick }) => {
  const pointsRef = useRef<THREE.Points>(null)
  const dustRef = useRef<THREE.Points>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)
  const currentView = useStore((s) => s.currentView)

  const { positions, colors, sizes } = useMemo(() => {
    const starCount = Math.min(data.starCount, 30000)
    const arms = data.galaxyType === 'spiral' ? 4 : data.galaxyType === 'elliptical' ? 0 : 2
    const armSpread = data.galaxyType === 'spiral' ? 0.4 : 1.0
    const radius = data.size * 0.5
    const coreRadius = radius * 0.12
    const height = data.galaxyType === 'spiral' ? radius * 0.08 : radius * 0.4

    return generateGalaxyPositionsAndColors(
      starCount, arms, armSpread, radius, coreRadius, height, data.color
    )
  }, [data])

  // Dust lane particles (only for spiral)
  const dustPositions = useMemo(() => {
    if (data.galaxyType !== 'spiral') return null
    const count = 8000
    const pos = new Float32Array(count * 3)
    const radius = data.size * 0.5
    const coreRadius = radius * 0.12
    for (let i = 0; i < count; i++) {
      const armIndex = Math.floor(Math.random() * 4)
      const armOffset = (armIndex / 4) * 2 * Math.PI
      const radiusRatio = Math.random()
      const r = coreRadius + radiusRatio * (radius - coreRadius)
      const scatter = (Math.random() - 0.5) * 0.15
      const theta = armOffset + radiusRatio * 4.5 + scatter
      const y = (Math.random() - 0.5) * 0.3 * (1 - r / radius)
      pos[i * 3] = r * Math.cos(theta)
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = r * Math.sin(theta)
    }
    return pos
  }, [data])

  const handleClick = useCallback((e: any) => {
    e.stopPropagation()
    onClick(data)
  }, [data, onClick])

  useFrame((_, delta) => {
    if (data.galaxyType === 'spiral') {
      timeRef.current += delta * data.rotationSpeed * 10
      if (pointsRef.current) pointsRef.current.rotation.y = timeRef.current
      if (dustRef.current) dustRef.current.rotation.y = timeRef.current
      if (glowRef.current) glowRef.current.rotation.y = timeRef.current
    }
  })

  const isClose = currentView === 'galaxy' || currentView === 'solarSystem'

  return (
    <group position={data.position}>
      {/* Galaxy core - bright glow */}
      <mesh>
        <sphereGeometry args={[data.size * 0.04, 16, 16]} />
        <meshBasicMaterial
          color="#ffeedd"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner core glow */}
      <mesh>
        <sphereGeometry args={[data.size * 0.07, 16, 16]} />
        <meshBasicMaterial
          color={data.color}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Star point cloud */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={sizes.length}
            array={sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isClose ? 0.4 : 1.2}
          vertexColors
          transparent
          opacity={isClose ? 1 : 0.85}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Dust lane particles (spiral galaxies) */}
      {dustPositions && (
        <points ref={dustRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={dustPositions.length / 3}
              array={dustPositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={isClose ? 0.15 : 0.5}
            color="#332244"
            transparent
            opacity={isClose ? 0.15 : 0.08}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}

      {/* Outer glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[data.size * 0.5, 32, 32]} />
        <meshBasicMaterial
          color={data.color}
          transparent
          opacity={0.03}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Very outer faint halo */}
      <mesh>
        <sphereGeometry args={[data.size * 0.8, 32, 32]} />
        <meshBasicMaterial
          color={data.color}
          transparent
          opacity={0.01}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}
