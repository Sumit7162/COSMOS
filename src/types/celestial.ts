export type ViewLevel = 'universe' | 'galaxy' | 'solarSystem' | 'planet' | 'surface'
export type GalaxyType = 'spiral' | 'elliptical' | 'irregular'
export type PlanetType = 'terrestrial' | 'gasGiant' | 'iceGiant' | 'dwarf'

export interface CelestialObject {
  id: string
  name: string
  type: 'galaxy' | 'star' | 'planet' | 'moon' | 'blackHole' | 'asteroid' | 'comet' | 'nebula' | 'quasar'
  position: [number, number, number]
  size: number
  description?: string
  scientificData?: Record<string, string | number>
  parentId?: string
}

export interface GalaxyData extends CelestialObject {
  type: 'galaxy'
  galaxyType: GalaxyType
  rotationSpeed: number
  starCount: number
  color: string
  childGalaxies?: string[]
}

export interface StarData extends CelestialObject {
  type: 'star'
  spectralClass: 'O' | 'B' | 'A' | 'F' | 'G' | 'K' | 'M'
  temperature: number
  magnitude: number
  radius: number
  mass: number
  luminosity: number
  constellation?: string
  distance?: number
}

export interface PlanetData extends CelestialObject {
  type: 'planet'
  planetType: PlanetType
  radius: number
  mass: number
  gravity: number
  orbitalRadius: number
  orbitalPeriod: number
  rotationPeriod: number
  axialTilt: number
  atmosphere: boolean
  atmosphereColor?: string
  temperature: number
  hasRings: boolean
  hasMoons: boolean
  moonCount: number
  color: string
  parentId: string // star id
}

export interface MoonData extends CelestialObject {
  type: 'moon'
  radius: number
  mass: number
  orbitalRadius: number
  orbitalPeriod: number
  parentId: string // planet id
  color: string
}

export interface BlackHoleData extends CelestialObject {
  type: 'blackHole'
  mass: number
  eventHorizonRadius: number
  accretionDiskColor: string
  spin: number
}

export interface NebulaData extends CelestialObject {
  type: 'nebula'
  size: number
  color: string
  density: number
}

export interface CameraState {
  position: [number, number, number]
  target: [number, number, number]
  zoom: number
}

export interface FocusTarget {
  objectId: string
  position: [number, number, number]
  viewLevel: ViewLevel
  distance: number
}
