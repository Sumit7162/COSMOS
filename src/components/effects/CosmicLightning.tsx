import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface LightningBolt {
  points: THREE.Vector3[]
  width: number
  opacity: number
  phase: number
  speed: number
}

interface CosmicLightningProps {
  position: [number, number, number]
  target?: [number, number, number]
  intensity?: number
  color?: string
  branches?: number
}

// Generate a branching lightning bolt path
function generateBolt(
  start: THREE.Vector3,
  end: THREE.Vector3,
  displacement: number,
  detail: number
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [start.clone()]
  const dx = end.x - start.x
  const dy = end.y - start.y
  const dz = end.z - start.z
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz)
  const segments = Math.max(4, Math.floor(detail * length / 10))

  for (let i = 1; i < segments; i++) {
    const t = i / segments
    const offset = (Math.random() - 0.5) * displacement * (1 - t) * 2
    const offsetY = (Math.random() - 0.5) * displacement * (1 - t) * 1.5
    points.push(new THREE.Vector3(
      start.x + dx * t + offset,
      start.y + dy * t + offsetY,
      start.z + dz * t + offset * 0.5
    ))
  }

  points.push(end.clone())
  return points
}

function generateBranch(
  start: THREE.Vector3,
  end: THREE.Vector3,
  depth: number,
  maxDepth: number
): LightningBolt[] {
  const bolts: LightningBolt[] = []
  const displacement = 15 - depth * 2
  const points = generateBolt(start, end, displacement, 4 - depth * 0.5)

  bolts.push({
    points,
    width: Math.max(0.3, 1.5 - depth * 0.3),
    opacity: Math.max(0.15, 0.8 - depth * 0.15),
    phase: Math.random() * Math.PI * 2,
    speed: 3 + Math.random() * 2,
  })

  // Generate sub-branches
  if (depth < maxDepth) {
    const numBranches = Math.floor(Math.random() * 2) + 1
    for (let i = 0; i < numBranches; i++) {
      const t = 0.3 + Math.random() * 0.4
      const branchStart = points[Math.floor(t * (points.length - 1))]
      const branchEnd = new THREE.Vector3(
        branchStart.x + (Math.random() - 0.5) * 30,
        branchStart.y + (Math.random() - 0.5) * 20 - 10,
        branchStart.z + (Math.random() - 0.5) * 20
      )
      const subBolts = generateBranch(branchStart, branchEnd, depth + 1, maxDepth)
      bolts.push(...subBolts)
    }
  }

  return bolts
}

export const CosmicLightning: React.FC<CosmicLightningProps> = ({
  position,
  target = [position[0] + 30, position[1] - 40, position[2]],
  intensity = 1,
  color = '#88ccff',
  branches = 3,
}) => {
  const groupRef = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)
  const flashRef = useRef(0)

  const startVec = useMemo(() => new THREE.Vector3(...position), [position])
  const endVec = useMemo(() => new THREE.Vector3(...target), [target])

  // Generate lightning bolt geometry
  const bolts = useMemo(() => {
    const allBolts: LightningBolt[] = []
    for (let b = 0; b < branches; b++) {
      const offset = new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10
      )
      const boltEnd = endVec.clone().add(offset)
      const boltBolts = generateBranch(startVec, boltEnd, 0, 3)
      allBolts.push(...boltBolts)
    }
    return allBolts
  }, [startVec, endVec, branches])

  // Build tube geometries for each bolt
  const boltMeshes = useMemo(() => {
    return bolts.map((bolt) => {
      const curve = new THREE.CatmullRomCurve3(bolt.points)
      const tubeGeo = new THREE.TubeGeometry(curve, bolt.points.length * 2, bolt.width, 4, false)
      return { geometry: tubeGeo, opacity: bolt.opacity, phase: bolt.phase, speed: bolt.speed }
    })
  }, [bolts])

  useFrame((_, delta) => {
    timeRef.current += delta

    // Lightning flash animation
    flashRef.current += delta * 2
    const flash = Math.max(0, Math.sin(flashRef.current * 3) * 0.5 + 0.5)

    if (groupRef.current) {
      // Flicker the entire group opacity
      const flicker = Math.random() > 0.85 ? 0.2 : 1.0
      const brightness = flash * 0.8 + 0.2 * flicker
      groupRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshBasicMaterial
          mat.opacity = boltMeshes[i]?.opacity * brightness * intensity || 0.2
        }
      })
    }

    // Point light flash
    if (glowRef.current) {
      const glowScale = 1 + flash * 2
      glowRef.current.scale.setScalar(glowScale)
      const glowMat = (glowRef.current.material as THREE.MeshBasicMaterial)
      glowMat.opacity = flash * 0.3 * intensity
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Lightning bolts */}
      {boltMeshes.map((bolt, i) => (
        <mesh key={i} geometry={bolt.geometry}>
          <meshBasicMaterial
            color={color}
            transparent
            opacity={bolt.opacity * intensity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Glow sphere at origin */}
      <mesh ref={glowRef} position={position}>
        <sphereGeometry args={[3, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Ambient flash light */}
      <pointLight
        position={position}
        color={color}
        intensity={0.3}
        distance={150}
      />
    </group>
  )
}

// Collection of lightning storms positioned in the universe
export const LightningStorms: React.FC = () => {
  const lightRef = useRef<THREE.PointLight>(null)
  const timeRef = useRef(0)

  const STORMS = useMemo(() => [
    { pos: [-250, 100, 180] as [number, number, number], intensity: 0.8, color: '#88ccff' },
    { pos: [350, -80, -220] as [number, number, number], intensity: 0.6, color: '#cc88ff' },
    { pos: [-100, 60, 400] as [number, number, number], intensity: 0.7, color: '#88ffcc' },
  ], [])

  useFrame((_, delta) => {
    timeRef.current += delta
    // Flash the point light
    if (lightRef.current) {
      const flash = Math.sin(timeRef.current * 5) > 0.95 ? 2.0 : 0
      lightRef.current.intensity = flash
    }
  })

  return (
    <group>
      <pointLight ref={lightRef} position={[0, 0, 0]} color="#88ccff" intensity={0} distance={200} />
      {STORMS.map((storm, i) => (
        <CosmicLightning
          key={i}
          position={storm.pos}
          intensity={storm.intensity}
          color={storm.color}
          branches={2 + Math.floor(Math.random() * 2)}
        />
      ))}
    </group>
  )
}
