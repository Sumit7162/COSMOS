import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { PlanetData, MoonData } from '../../types/celestial'
import { useStore } from '../../store/useStore'
import { fbm } from '../../utils/math'

interface PlanetProps {
  data: PlanetData
  moons?: MoonData[]
  onClick: (data: PlanetData | MoonData) => void
}

export const Planet: React.FC<PlanetProps> = ({ data, moons = [], onClick }) => {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const cloudRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)
  const currentView = useStore((s) => s.currentView)
  const timeScale = useStore((s) => s.timeScale)
  const showOrbits = useStore((s) => s.showOrbits)

  // Generate procedural texture with fractal noise
  const textureCanvas = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    const imageData = ctx.createImageData(canvas.width, canvas.height)
    const pixels = imageData.data

    const color = new THREE.Color(data.color)

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const u = x / canvas.width
        const v = y / canvas.height
        const idx = (y * canvas.width + x) * 4

        let r: number, g: number, b: number

        if (data.planetType === 'gasGiant') {
          // Gas giant: horizontal bands with noise
          const band = Math.sin(v * 25 + fbm(u * 4, v * 6, 3) * 2) * 0.5 + 0.5
          const turbulence = fbm(u * 3, v * 5, 4) * 0.3
          const bandValue = band + turbulence
          
          const baseR = color.r * (0.6 + bandValue * 0.4)
          const baseG = color.g * (0.5 + bandValue * 0.5)
          const baseB = color.b * (0.4 + bandValue * 0.6)

          r = baseR + fbm(u * 8, v * 10, 2) * 0.05
          g = baseG + fbm(u * 8, v * 10, 2) * 0.05
          b = baseB + fbm(u * 8, v * 10, 2) * 0.05

          // Great Red Spot for Jupiter
          if (data.id === 'jupiter') {
            const dx = (u - 0.65) * 4
            const dy = (v - 0.55) * 8
            const spotDist = Math.sqrt(dx * dx + dy * dy)
            if (spotDist < 0.8) {
              const spotFalloff = 1 - spotDist / 0.8
              r += spotFalloff * 0.15
              g -= spotFalloff * 0.1
              b -= spotFalloff * 0.15
            }
          }

          // Saturn's pale yellow bands
          if (data.id === 'saturn') {
            const extraBand = Math.sin(v * 30 + fbm(u * 3, v * 4, 2)) * 0.5 + 0.5
            r += extraBand * 0.05
            g += extraBand * 0.03
          }
        } else if (data.planetType === 'iceGiant') {
          // Ice giant: subtle bands with blue-green tint
          const band = Math.sin(v * 20 + fbm(u * 5, v * 5, 3)) * 0.5 + 0.5
          r = color.r * (0.5 + band * 0.5)
          g = color.g * (0.5 + band * 0.5)
          b = color.b * (0.5 + band * 0.5)
        } else {
          // Terrestrial: continents and oceans
          const elevation = fbm(u * 6, v * 4, 5)
          
          if (data.id === 'earth') {
            if (elevation < 0.45) {
              // Ocean
              const depth = elevation / 0.45
              r = 0.05 + depth * 0.1
              g = 0.15 + depth * 0.25
              b = 0.3 + depth * 0.4
            } else if (elevation < 0.52) {
              // Coastline / sand
              r = 0.5; g = 0.45; b = 0.25
            } else if (elevation < 0.6) {
              // Lowland
              r = 0.15 + elevation * 0.3
              g = 0.35 + elevation * 0.3
              b = 0.1 + elevation * 0.1
            } else if (elevation < 0.75) {
              // Highland
              r = 0.2 + elevation * 0.2
              g = 0.35 + elevation * 0.15
              b = 0.15
            } else {
              // Mountain / snow
              const snow = (elevation - 0.75) / 0.25
              r = 0.3 + snow * 0.7
              g = 0.35 + snow * 0.65
              b = 0.2 + snow * 0.8
            }

            // Ice caps
            if (v < 0.1 || v > 0.9) {
              const iceAmount = v < 0.1 ? 1 - v / 0.1 : 1 - (1 - v) / 0.1
              r = r + (1 - r) * iceAmount * 0.7
              g = g + (1 - g) * iceAmount * 0.7
              b = b + (1 - b) * iceAmount * 0.7
            }
          } else if (data.id === 'mars') {
            // Mars: rocky red terrain with craters
            const crater = fbm(u * 10, v * 8, 3)
            r = 0.5 + elevation * 0.3 + crater * 0.1
            g = 0.25 + elevation * 0.15
            b = 0.1 + elevation * 0.1
            
            // Polar ice caps
            if (v < 0.08 || v > 0.92) {
              const iceAmount = v < 0.08 ? 1 - v / 0.08 : 1 - (1 - v) / 0.08
              r = r + (0.8 - r) * iceAmount
              g = g + (0.85 - g) * iceAmount
              b = b + (0.9 - b) * iceAmount
            }
          } else if (data.id === 'mercury') {
            // Mercury: grey cratered surface
            const crater = fbm(u * 12, v * 10, 5)
            r = 0.4 + crater * 0.3
            g = 0.35 + crater * 0.25
            b = 0.3 + crater * 0.2
          } else if (data.id === 'venus') {
            // Venus: yellowish cloudy surface
            const cloudPattern = fbm(u * 10, v * 8, 4)
            r = 0.7 + cloudPattern * 0.2
            g = 0.5 + cloudPattern * 0.2
            b = 0.2 + cloudPattern * 0.15
          } else {
            // Generic terrestrial
            r = color.r * (0.4 + elevation * 0.6)
            g = color.g * (0.4 + elevation * 0.6)
            b = color.b * (0.4 + elevation * 0.6)
          }
        }

        pixels[idx] = Math.min(255, r * 255)
        pixels[idx + 1] = Math.min(255, g * 255)
        pixels[idx + 2] = Math.min(255, b * 255)
        pixels[idx + 3] = 255
      }
    }

    ctx.putImageData(imageData, 0, 0)
    return canvas
  }, [data])

  // Bump map from same noise
  const bumpCanvas = useMemo(() => {
    if (data.planetType === 'gasGiant' || data.planetType === 'iceGiant') return null
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    const imageData = ctx.createImageData(canvas.width, canvas.height)
    const pixels = imageData.data

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const u = x / canvas.width
        const v = y / canvas.height
        const idx = (y * canvas.width + x) * 4
        const elevation = fbm(u * 8, v * 6, 5)
        const val = elevation * 255
        pixels[idx] = val
        pixels[idx + 1] = val
        pixels[idx + 2] = val
        pixels[idx + 3] = 255
      }
    }

    ctx.putImageData(imageData, 0, 0)
    return canvas
  }, [data])

  // Cloud texture
  const cloudCanvas = useMemo(() => {
    if (!data.atmosphere) return null
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    const imageData = ctx.createImageData(canvas.width, canvas.height)
    const pixels = imageData.data

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const u = x / canvas.width
        const v = y / canvas.height
        const idx = (y * canvas.width + x) * 4
        const cloud = fbm(u * 12, v * 10, 4)
        const val = cloud > 0.5 ? (cloud - 0.5) * 2 * 255 : 0
        pixels[idx] = 255
        pixels[idx + 1] = 255
        pixels[idx + 2] = 255
        pixels[idx + 3] = val * 0.6
      }
    }

    ctx.putImageData(imageData, 0, 0)
    return canvas
  }, [data])

  const texture = useMemo(() => {
    const tex = new THREE.CanvasTexture(textureCanvas)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.ClampToEdgeWrapping
    return tex
  }, [textureCanvas])

  const bumpTexture = useMemo(() => {
    if (!bumpCanvas) return null
    const tex = new THREE.CanvasTexture(bumpCanvas)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.ClampToEdgeWrapping
    return tex
  }, [bumpCanvas])

  const cloudTexture = useMemo(() => {
    if (!cloudCanvas) return null
    const tex = new THREE.CanvasTexture(cloudCanvas)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.ClampToEdgeWrapping
    return tex
  }, [cloudCanvas])

  useFrame((_, delta) => {
    if (!groupRef.current || !meshRef.current) return

    timeRef.current += delta * timeScale

    // Orbital motion
    if (currentView !== 'surface') {
      const angle = (timeRef.current / data.orbitalPeriod) * 2 * Math.PI
      groupRef.current.position.x = data.orbitalRadius * Math.cos(angle)
      groupRef.current.position.z = data.orbitalRadius * Math.sin(angle)
    }

    // Self rotation
    meshRef.current.rotation.y += delta * (2 * Math.PI) / (data.rotationPeriod / 24) * timeScale

    // Cloud rotation
    if (cloudRef.current && data.atmosphere) {
      cloudRef.current.rotation.y += delta * (2 * Math.PI) / (data.rotationPeriod / 20) * timeScale
    }
  })

  const isClose = currentView === 'planet' || currentView === 'surface'
  const scale = isClose ? data.size * 3 : data.size

  return (
    <group>
      {showOrbits && currentView !== 'planet' && currentView !== 'surface' && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[data.orbitalRadius - 0.1, data.orbitalRadius + 0.1, 64]} />
          <meshBasicMaterial color="#446688" transparent opacity={0.12} side={THREE.DoubleSide} />
        </mesh>
      )}

      <group ref={groupRef} position={data.position}>
        {/* Planet mesh with PBR-like material */}
        <mesh
          ref={meshRef}
          onClick={(e) => { e.stopPropagation(); onClick(data) }}
          scale={scale}
        >
          <sphereGeometry args={[1, isClose ? 64 : 32, isClose ? 64 : 32]} />
          <meshStandardMaterial
            map={texture}
            bumpMap={bumpTexture}
            bumpScale={data.planetType === 'gasGiant' ? 0 : 0.03}
            roughness={data.planetType === 'gasGiant' ? 0.7 : 0.8}
            metalness={0.1}
          />
        </mesh>

        {/* Atmosphere glow - custom shader-like look with fresnel */}
        {data.atmosphere && (
          <mesh scale={scale * 1.04}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshPhongMaterial
              color={data.atmosphereColor || '#4488cc'}
              transparent
              opacity={0.12}
              side={THREE.BackSide}
            />
          </mesh>
        )}

        {/* Atmosphere rim glow (fresnel approximation) */}
        {data.atmosphere && (
          <mesh scale={scale * 1.01}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshPhongMaterial
              color={data.atmosphereColor || '#88bbff'}
              transparent
              opacity={0.08}
              side={THREE.FrontSide}
              depthWrite={false}
            />
          </mesh>
        )}

        {/* Cloud layer */}
        {data.atmosphere && isClose && cloudTexture && (
          <mesh ref={cloudRef} scale={scale * 1.015}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshPhongMaterial
              map={cloudTexture}
              transparent
              opacity={0.25}
              depthWrite={false}
            />
          </mesh>
        )}

        {/* Saturn-style rings with color gradient */}
        {data.hasRings && (
          <>
            <mesh rotation={[Math.PI * 0.25, 0, 0]} scale={scale}>
              <ringGeometry args={[1.3, 2.4, 64]} />
              <meshPhongMaterial
                color="#c8b090"
                transparent
                opacity={0.2}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
            <mesh rotation={[Math.PI * 0.25, 0, 0]} scale={scale}>
              <ringGeometry args={[1.5, 2.0, 64]} />
              <meshPhongMaterial
                color="#d0c8b8"
                transparent
                opacity={0.3}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
            <mesh rotation={[Math.PI * 0.25, 0, 0]} scale={scale}>
              <ringGeometry args={[1.7, 1.9, 64]} />
              <meshPhongMaterial
                color="#e8dcc8"
                transparent
                opacity={0.15}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          </>
        )}

        {/* Moons */}
        {moons.map((moon) => (
          <PlanetMoon key={moon.id} data={moon} onClick={onClick} />
        ))}
      </group>
    </group>
  )
}

const PlanetMoon: React.FC<{ data: MoonData; onClick: (data: any) => void }> = ({ data, onClick }) => {
  const moonRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(Math.random() * 100)
  const timeScale = useStore((s) => s.timeScale)

  useFrame((_, delta) => {
    if (!moonRef.current) return
    timeRef.current += delta * timeScale
    const angle = (timeRef.current / data.orbitalPeriod) * 2 * Math.PI
    moonRef.current.position.x = data.orbitalRadius * Math.cos(angle)
    moonRef.current.position.z = data.orbitalRadius * Math.sin(angle)
  })

  return (
    <mesh
      ref={moonRef}
      onClick={(e) => { e.stopPropagation(); onClick(data) }}
      scale={data.size * 0.5}
    >
      <sphereGeometry args={[1, 16, 16]} />
      <meshPhongMaterial color={data.color} />
    </mesh>
  )
}
