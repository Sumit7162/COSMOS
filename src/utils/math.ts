import * as THREE from 'three'

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin)
}

export function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

export function randomInSphere(radius: number): [number, number, number] {
  const u = Math.random()
  const v = Math.random()
  const theta = 2 * Math.PI * u
  const phi = Math.acos(2 * v - 1)
  const r = radius * Math.cbrt(Math.random())
  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi),
  ]
}

export function randomInDisk(innerRadius: number, outerRadius: number): [number, number, number] {
  const angle = Math.random() * 2 * Math.PI
  const radius = innerRadius + Math.random() * (outerRadius - innerRadius)
  return [radius * Math.cos(angle), (Math.random() - 0.5) * 0.5, radius * Math.sin(angle)]
}

export function randomColor(minTemp?: number, maxTemp?: number): string {
  // Generate star colors based on temperature
  const temp = minTemp && maxTemp
    ? randomInRange(minTemp, maxTemp)
    : randomInRange(3000, 30000)

  if (temp > 25000) return '#8bb8ff' // O-type blue
  if (temp > 10000) return '#aac8ff' // B-type blue-white
  if (temp > 7500) return '#cad8ff' // A-type white
  if (temp > 6000) return '#f0e8d0' // F-type yellow-white
  if (temp > 5000) return '#ffe8a0' // G-type yellow
  if (temp > 3500) return '#ffc880' // K-type orange
  return '#ff8860' // M-type red
}

export function hslToHex(h: number, s: number, l: number): string {
  const color = new THREE.Color().setHSL(h, s, l)
  return '#' + color.getHexString()
}

export function hexToRgb(hex: string): [number, number, number] {
  const color = new THREE.Color(hex)
  return [color.r, color.g, color.b]
}

export function getDistance(a: [number, number, number], b: [number, number, number]): number {
  return Math.sqrt(
    (a[0] - b[0]) ** 2 +
    (a[1] - b[1]) ** 2 +
    (a[2] - b[2]) ** 2
  )
}

export function getLODDistance(position: [number, number, number], cameraPosition: [number, number, number]): number {
  return getDistance(position, cameraPosition)
}

export function getOrbitalPosition(
  orbitRadius: number,
  time: number,
  period: number,
  eccentricity = 0,
  inclination = 0
): [number, number, number] {
  const angle = (time / period) * 2 * Math.PI
  const x = orbitRadius * Math.cos(angle)
  const z = orbitRadius * Math.sin(angle) * (1 - eccentricity)
  const y = orbitRadius * Math.sin(inclination) * Math.sin(angle)
  return [x, y, z]
}

// 2D value noise for procedural textures
export function noise2D(x: number, y: number): number {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const fx = x - ix
  const fy = y - iy
  
  // Smooth interpolation
  const sx = fx * fx * (3 - 2 * fx)
  const sy = fy * fy * (3 - 2 * fy)
  
  const hash = (a: number, b: number) => {
    let h = a * 374761393 + b * 668265263
    h = (h ^ (h >> 13)) * 1274126177
    return (h ^ (h >> 16)) / 2147483647
  }
  
  const n00 = hash(ix, iy)
  const n10 = hash(ix + 1, iy)
  const n01 = hash(ix, iy + 1)
  const n11 = hash(ix + 1, iy + 1)
  
  const nx0 = n00 + (n10 - n00) * sx
  const nx1 = n01 + (n11 - n01) * sx
  return nx0 + (nx1 - nx0) * sy
}

export function fbm(x: number, y: number, octaves: number): number {
  let value = 0
  let amplitude = 1
  let frequency = 1
  let maxValue = 0
  
  for (let i = 0; i < octaves; i++) {
    value += amplitude * noise2D(x * frequency, y * frequency)
    maxValue += amplitude
    amplitude *= 0.5
    frequency *= 2
  }
  
  return value / maxValue
}

export function fractalNoise(x: number, y: number, scale: number, octaves: number): number {
  return fbm(x * scale, y * scale, octaves)
}

export function generateGalaxyPositionsAndColors(
  starCount: number,
  arms: number,
  armSpread: number,
  radius: number,
  coreRadius: number,
  height: number,
  galaxyColor: string
): { positions: Float32Array; colors: Float32Array; sizes: Float32Array } {
  const positions = new Float32Array(starCount * 3)
  const colors = new Float32Array(starCount * 3)
  const sizes = new Float32Array(starCount)
  
  const baseColor = new THREE.Color(galaxyColor)
  const coreGlow = new THREE.Color('#ffeecc')

  for (let i = 0; i < starCount; i++) {
    const isCore = Math.random() < 0.25
    let r: number, theta: number, y: number

    if (isCore) {
      r = Math.pow(Math.random(), 2.5) * coreRadius
      theta = Math.random() * 2 * Math.PI
      y = (Math.random() - 0.5) * height * 0.2
    } else if (arms > 0) {
      const armIndex = Math.floor(Math.random() * arms)
      const armOffset = (armIndex / arms) * 2 * Math.PI
      const radiusRatio = Math.random()
      // More stars near the arms, with scatter
      const scatter = (Math.random() - 0.5) * armSpread * (0.3 + 0.7 * radiusRatio)
      r = coreRadius + radiusRatio * (radius - coreRadius)
      theta = armOffset + radiusRatio * 4.5 + scatter
      y = (Math.random() - 0.5) * height * Math.pow(1 - r / radius, 0.7)
    } else {
      r = Math.pow(Math.random(), 1.5) * (radius - coreRadius) + coreRadius
      theta = Math.random() * 2 * Math.PI
      y = (Math.random() - 0.5) * height * (1 - r / radius)
    }

    positions[i * 3] = r * Math.cos(theta)
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = r * Math.sin(theta)

    // Color gradient: warm core -> galaxy color -> dimmer at edges
    const distRatio = Math.min(r / radius, 1)
    
    if (isCore) {
      // Bright warm core
      const t = Math.random() * 0.3 + 0.7
      const c = coreGlow.clone().lerp(baseColor, 0.3).multiplyScalar(t)
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b
      sizes[i] = (Math.random() * 0.5 + 0.3) * 2
    } else {
      // Mix of blue-white and galaxy-colored stars
      const starType = Math.random()
      let c: THREE.Color
      if (starType < 0.15) {
        // Hot blue
        c = new THREE.Color(0.6, 0.8, 1.0)
        sizes[i] = Math.random() * 0.4 + 0.2
      } else if (starType < 0.5) {
        // Galaxy color with brightness falloff
        const brightness = 0.5 + 0.5 * (1 - distRatio)
        c = baseColor.clone().multiplyScalar(brightness)
        sizes[i] = Math.random() * 0.3 + 0.1
      } else if (starType < 0.75) {
        // Slightly warmer
        c = baseColor.clone().lerp(new THREE.Color(1.0, 0.7, 0.3), 0.3).multiplyScalar(0.7 + 0.3 * (1 - distRatio))
        sizes[i] = Math.random() * 0.25 + 0.15
      } else {
        // Dim reddish (dust edge)
        c = new THREE.Color(0.6, 0.3, 0.15).multiplyScalar(0.5 + 0.3 * (1 - distRatio))
        sizes[i] = Math.random() * 0.2 + 0.1
      }
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b
    }
  }

  return { positions, colors, sizes }
}


