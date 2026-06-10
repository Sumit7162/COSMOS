import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../store/useStore'

const STAR_COUNT = 80000
const STARFIELD_RADIUS = 5000

const vertexShader = `
  attribute float aSize;
  attribute float aPhase;
  attribute float aTwinkleSpeed;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vTwinkle;
  uniform float uTime;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    
    // Pass color to fragment
    vColor = aColor;
    
    // Per-star twinkle
    float twinkle = sin(uTime * aTwinkleSpeed + aPhase) * 0.5 + 0.5;
    vTwinkle = 0.7 + 0.3 * twinkle;
  }
`

const fragmentShader = `
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    if (dist > 0.5) discard;
    
    // Soft circular star with glow
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    float glow = exp(-dist * 6.0) * 0.5;
    float brightness = vTwinkle * (alpha + glow);
    
    gl_FragColor = vec4(vColor * brightness, brightness);
  }
`

export const Starfield: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null)
  const currentView = useStore((s) => s.currentView)
  const timeRef = useRef(0)

  const { positions, colors, sizes, phases, twinkleSpeeds } = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3)
    const col = new Float32Array(STAR_COUNT * 3)
    const siz = new Float32Array(STAR_COUNT)
    const phs = new Float32Array(STAR_COUNT)
    const spd = new Float32Array(STAR_COUNT)

    for (let i = 0; i < STAR_COUNT; i++) {
      // Milky Way band concentration for realism
      const inBand = Math.random() < 0.4
      let radius: number, theta: number, phi: number

      if (inBand) {
        // Stars concentrated along the galactic plane
        radius = Math.pow(Math.random(), 0.3) * STARFIELD_RADIUS
        theta = Math.random() * 2 * Math.PI
        const bandSpread = 0.15
        phi = Math.PI / 2 + (Math.random() - 0.5) * bandSpread
      } else {
        radius = Math.pow(Math.random(), 0.25) * STARFIELD_RADIUS
        theta = Math.random() * 2 * Math.PI
        phi = Math.acos(2 * Math.random() - 1)
      }

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = radius * Math.cos(phi)

      // HR diagram color distribution with nebula bleed
      const tempRoll = Math.random()
      let r = 1, g = 1, b = 1
      
      if (tempRoll < 0.008) {
        r = 0.5; g = 0.65; b = 1.0
      } else if (tempRoll < 0.03) {
        r = 0.7; g = 0.8; b = 1.0
      } else if (tempRoll < 0.08) {
        r = 0.9; g = 0.9; b = 1.0
      } else if (tempRoll < 0.2) {
        r = 1.0; g = 0.95; b = 0.8
      } else if (tempRoll < 0.4) {
        r = 1.0; g = 0.9; b = 0.6
      } else if (tempRoll < 0.65) {
        r = 1.0; g = 0.75; b = 0.4
      } else {
        r = 1.0; g = 0.55; b = 0.3
      }

      // Random variation
      r *= 0.85 + Math.random() * 0.15
      g *= 0.85 + Math.random() * 0.15
      b *= 0.85 + Math.random() * 0.15

      col[i * 3] = r; col[i * 3 + 1] = g; col[i * 3 + 2] = b

      // Size distribution
      const isGiant = Math.random() < 0.02
      const isBright = Math.random() < 0.08
      if (isGiant) {
        siz[i] = 1.5 + Math.random() * 3
      } else if (isBright) {
        siz[i] = 0.8 + Math.random() * 0.8
      } else {
        siz[i] = 0.1 + Math.random() * 0.4
      }

      // Per-star twinkle phase and speed
      phs[i] = Math.random() * Math.PI * 2
      spd[i] = 1.0 + Math.random() * 3.0
    }

    return { positions: pos, colors: col, sizes: siz, phases: phs, twinkleSpeeds: spd }
  }, [])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), [])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
    geo.setAttribute('aTwinkleSpeed', new THREE.BufferAttribute(twinkleSpeeds, 1))
    return geo
  }, [positions, colors, sizes, phases, twinkleSpeeds])

  useFrame((_, delta) => {
    timeRef.current += delta
    if (!pointsRef.current) return

    uniforms.uTime.value = timeRef.current

    if (currentView === 'universe') {
      pointsRef.current.rotation.y += delta * 0.0003
    }
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
