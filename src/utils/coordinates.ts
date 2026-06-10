import * as THREE from 'three'

export function celestialToThree(
  ra: number,
  dec: number,
  distance: number
): THREE.Vector3 {
  const raRad = (ra * 15) * (Math.PI / 180)
  const decRad = dec * (Math.PI / 180)

  const x = distance * Math.cos(decRad) * Math.cos(raRad)
  const y = distance * Math.sin(decRad)
  const z = distance * Math.cos(decRad) * Math.sin(raRad)

  return new THREE.Vector3(x, y, z)
}

export function threeToCelestial(
  position: THREE.Vector3
): { ra: number; dec: number; distance: number } {
  const distance = position.length()
  const dec = Math.asin(position.y / distance) * (180 / Math.PI)
  const ra = (Math.atan2(position.z, position.x) * (180 / Math.PI)) / 15

  return { ra: (ra + 360) % 360, dec, distance }
}

export function formatDistance(ly: number): string {
  if (ly < 1) return `${Math.round(ly * 1000)} AU`
  if (ly < 1000) return `${Math.round(ly)} ly`
  if (ly < 1_000_000) return `${(ly / 1000).toFixed(1)} kly`
  return `${(ly / 1_000_000).toFixed(1)} Mly`
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toLocaleString()
}

export function formatTemperature(k: number): string {
  if (k >= 1000) return `${(k / 1000).toFixed(1)}K K`
  return `${Math.round(k)} K`
}

export function formatMass(kg: number): string {
  if (kg >= 1e30) return `${(kg / 1e30).toFixed(2)} × 10³⁰ kg`
  if (kg >= 1e27) return `${(kg / 1e27).toFixed(2)} × 10²⁷ kg`
  if (kg >= 1e24) return `${(kg / 1e24).toFixed(2)} × 10²⁴ kg`
  if (kg >= 1e20) return `${(kg / 1e20).toFixed(2)} × 10²⁰ kg`
  return `${kg.toExponential(2)} kg`
}

export function formatTime(hours: number): string {
  if (hours >= 8760) return `${(hours / 8760).toFixed(2)} years`
  if (hours >= 24) return `${(hours / 24).toFixed(1)} days`
  if (hours >= 1) return `${hours.toFixed(1)} hours`
  return `${(hours * 60).toFixed(0)} min`
}
