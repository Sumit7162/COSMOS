import React from 'react'
import { EffectComposer, Bloom, ChromaticAberration, Vignette, ToneMapping, Noise } from '@react-three/postprocessing'
import { useStore } from '../store/useStore'

export const Effects: React.FC = () => {
  const currentView = useStore((s) => s.currentView)
  const isClose = currentView === 'planet' || currentView === 'surface'

  console.log('[Debug] Effects mounting, currentView:', currentView)

  return (
    <EffectComposer
      depthBuffer
      multisampling={0}
    >
      {/* Bloom - cinematic glow for stars, nebulae, and lightning */}
      <Bloom
        intensity={isClose ? 0.2 : 0.6}
        luminanceThreshold={0.15}
        luminanceSmoothing={0.7}
        mipmapBlur
        radius={0.8}
      />

      {/* Second bloom layer for extreme highlights (stars) */}
      <Bloom
        intensity={isClose ? 0.1 : 0.3}
        luminanceThreshold={0.8}
        luminanceSmoothing={0.9}
        mipmapBlur
        radius={0.3}
      />

      {/* Chromatic aberration - subtle filmic look */}
      <ChromaticAberration
        offset={[0.0012, 0.0012]}
        radialModulation
        modulationOffset={0.4}
      />

      {/* Vignette - cinematic dark corners */}
      <Vignette
        offset={0.3}
        darkness={0.55}
        eskil={false}
      />

      {/* ACES filmic tone mapping for cinematic HDR */}
      <ToneMapping
        mode={3}
        resolution={256}
        middleGrey={0.6}
        maxLuminance={16.0}
        whitePoint={2.0}
      />

      {/* Subtle film grain for cinematic texture */}
      <Noise
        opacity={0.015}
        premultiply
      />
    </EffectComposer>
  )
}
