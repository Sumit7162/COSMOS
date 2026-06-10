import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface NebulaProps {
  position: [number, number, number]
  size?: number
  color?: string
  secondaryColor?: string
  opacity?: number
  rotation?: [number, number, number]
}

interface NebulaData {
  pos: [number, number, number]
  size: number
  color: string
  secondary: string
  opacity: number
  rot: [number, number, number]
}

// Vertex shader for nebula clouds
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Fragment shader with animated fbm noise for nebula
const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uTime;
  uniform float uOpacity;
  
  // Simple hash function for noise
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  
  float fbm(vec2 p, int octaves) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 8; i++) {
      if (i >= octaves) break;
      value += amplitude * noise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    
    // Center the UV for radial falloff
    vec2 center = uv - 0.5;
    float dist = length(center);
    
    // Animated noise for cloud shapes (slow drift)
    float time = uTime * 0.02;
    float n1 = fbm(uv * 3.0 + time, 5);
    float n2 = fbm(uv * 2.0 - time * 0.7 + 100.0, 4);
    float n3 = fbm(uv * 4.0 + time * 0.5, 3);
    
    // Combine noise for rich cloud structure
    float cloud = n1 * 0.6 + n2 * 0.3 + n3 * 0.1;
    
    // Edge glow effect
    float edge = 1.0 - smoothstep(0.0, 0.5, dist);
    float innerGlow = exp(-dist * 4.0) * 0.5;
    
    // Cloud opacity with soft edges
    float alpha = cloud * (1.0 - smoothstep(0.0, 0.6, dist)) * uOpacity;
    alpha = max(alpha, innerGlow * 0.3);
    
    // Color mixing based on noise
    vec3 color = mix(uColor1, uColor2, n2 * 1.2);
    
    // Brighten the center
    color += vec3(0.1) * innerGlow;
    
    // Add some blue/red variation
    color += vec3(0.05, 0.0, 0.08) * n3;
    
    gl_FragColor = vec4(color, alpha);
  }
`

const NEBULA_DATA: NebulaData[] = [
  { pos: [-350, 80, -200], size: 180, color: '#8844cc', secondary: '#4422aa', opacity: 0.4, rot: [0.2, 0.5, 0.1] },
  { pos: [200, -60, 300], size: 150, color: '#cc4488', secondary: '#882244', opacity: 0.35, rot: [-0.3, 0.7, 0.2] },
  { pos: [100, 150, -400], size: 200, color: '#4488cc', secondary: '#224488', opacity: 0.3, rot: [0.5, -0.2, 0.1] },
  { pos: [-200, -100, 350], size: 120, color: '#66cc88', secondary: '#228844', opacity: 0.25, rot: [0.1, -0.4, 0.3] },
  { pos: [400, 50, -100], size: 160, color: '#cc8844', secondary: '#886622', opacity: 0.3, rot: [-0.2, 0.3, -0.1] },
  { pos: [-100, 120, -300], size: 140, color: '#cc4488', secondary: '#882266', opacity: 0.35, rot: [0.4, 0.1, -0.2] },
  { pos: [300, -40, 200], size: 170, color: '#2266cc', secondary: '#224488', opacity: 0.3, rot: [-0.1, 0.6, 0.2] },
  { pos: [-400, -80, 150], size: 130, color: '#8844aa', secondary: '#442266', opacity: 0.25, rot: [0.3, -0.3, 0.1] },
]

export const NebulaCloud: React.FC<NebulaProps> = ({
  position,
  size = 100,
  color = '#8844cc',
  secondaryColor = '#4422aa',
  opacity = 0.4,
  rotation = [0, 0, 0],
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const timeRef = useRef(0)

  const uniforms = useMemo(() => ({
    uColor1: { value: new THREE.Color(color) },
    uColor2: { value: new THREE.Color(secondaryColor) },
    uTime: { value: 0 },
    uOpacity: { value: opacity },
  }), [color, secondaryColor, opacity])

  useFrame((_, delta) => {
    timeRef.current += delta
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = timeRef.current
    }
    // Slow rotation
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * rotation[0] * 0.05
      meshRef.current.rotation.y += delta * rotation[1] * 0.05
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[size, size, 2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// Collection of all nebulae
export const NebulaField: React.FC = () => {
  return (
    <group>
      {NEBULA_DATA.map((nebula, i) => (
        <NebulaCloud
          key={i}
          position={nebula.pos}
          size={nebula.size}
          color={nebula.color}
          secondaryColor={nebula.secondary}
          opacity={nebula.opacity}
          rotation={nebula.rot}
        />
      ))}
    </group>
  )
}
