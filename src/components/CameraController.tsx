import React, { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../store/useStore'

export const CameraController: React.FC = () => {
  const controlsRef = useRef<any>(null)
  const { camera } = useThree()
  const focusTarget = useStore((s) => s.focusTarget)
  const setFocusTarget = useStore((s) => s.setFocusTarget)
  const setIsTransitioning = useStore((s) => s.setIsTransitioning)
  const currentView = useStore((s) => s.currentView)
  const setCurrentView = useStore((s) => s.setCurrentView)
  const autoRotate = useStore((s) => s.autoRotate)

  const transitionRef = useRef<{
    active: boolean
    startPos: THREE.Vector3
    endPos: THREE.Vector3
    startTarget: THREE.Vector3
    endTarget: THREE.Vector3
    duration: number
    elapsed: number
    onComplete?: () => void
  }>({
    active: false,
    startPos: new THREE.Vector3(),
    endPos: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    endTarget: new THREE.Vector3(),
    duration: 2,
    elapsed: 0,
  })

  // Smooth zoom to target
  useEffect(() => {
    if (!focusTarget) return

    const targetPos = new THREE.Vector3(...focusTarget.position)
    const distance = focusTarget.distance || 20

    // Calculate camera position based on view level
    const endPos = targetPos.clone().add(new THREE.Vector3(distance, distance * 0.5, distance))

    transitionRef.current = {
      active: true,
      startPos: camera.position.clone(),
      endPos,
      startTarget: controlsRef.current?.target.clone() || new THREE.Vector3(0, 0, 0),
      endTarget: targetPos,
      duration: focusTarget.viewLevel === 'universe' ? 3 : focusTarget.viewLevel === 'surface' ? 4 : 2,
      elapsed: 0,
      onComplete: () => {
        setCurrentView(focusTarget.viewLevel)
        setIsTransitioning(false)
      },
    }

    setIsTransitioning(true)
    setFocusTarget(null)
  }, [focusTarget, camera, setFocusTarget, setCurrentView, setIsTransitioning])

  useFrame((_, delta) => {
    const t = transitionRef.current
    if (!t.active) return

    t.elapsed += delta
    const progress = Math.min(t.elapsed / t.duration, 1)
    
    // Ease in-out cubic
    const ease = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2

    camera.position.lerpVectors(t.startPos, t.endPos, ease)
    if (controlsRef.current) {
      controlsRef.current.target.lerpVectors(t.startTarget, t.endTarget, ease)
      controlsRef.current.update()
    }

    if (progress >= 1) {
      t.active = false
      t.onComplete?.()
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      minDistance={currentView === 'surface' ? 0.5 : currentView === 'planet' ? 2 : currentView === 'solarSystem' ? 5 : 10}
      maxDistance={currentView === 'surface' ? 5 : currentView === 'planet' ? 50 : currentView === 'solarSystem' ? 200 : 1000}
      autoRotate={autoRotate}
      autoRotateSpeed={currentView === 'universe' ? 0.1 : currentView === 'galaxy' ? 0.3 : 0.5}
      enablePan={currentView !== 'surface'}
      rotateSpeed={0.8}
      zoomSpeed={1.2}
    />
  )
}
