import React, { useRef, useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { HolographicPanel } from './HolographicPanel'

export const Minimap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>(0)
  const currentView = useStore((s) => s.currentView)
  const showMinimap = useStore((s) => s.showMinimap)

  useEffect(() => {
    if (!showMinimap) return

    const drawFrame = () => {
      if (!canvasRef.current) return

      const ctx = canvasRef.current.getContext('2d')
      if (!ctx) return

      const w = canvasRef.current.width
      const h = canvasRef.current.height

      ctx.fillStyle = 'rgba(5, 8, 15, 0.8)'
      ctx.fillRect(0, 0, w, h)

      ctx.strokeStyle = 'rgba(68, 136, 204, 0.1)'
      ctx.lineWidth = 0.5
      for (let i = 0; i <= 5; i++) {
        const x = (w / 5) * i
        const y = (h / 5) * i
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      const camPos = useStore.getState().camera.position
      const cameraX = (w / 2) + (camPos[0] / 500) * (w / 2)
      const cameraY = (h / 2) - (camPos[2] / 500) * (h / 2)

      ctx.fillStyle = '#88ccff'
      ctx.beginPath()
      ctx.arc(cameraX, cameraY, 4, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = '#88ccff'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(cameraX, cameraY)
      ctx.lineTo(cameraX, cameraY - 15)
      ctx.stroke()

      animFrameRef.current = requestAnimationFrame(drawFrame)
    }

    animFrameRef.current = requestAnimationFrame(drawFrame)

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [showMinimap])

  if (!showMinimap) return null

  return (
    <HolographicPanel
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '180px',
        zIndex: 40,
        padding: '12px',
      }}
    >
      <canvas
        ref={canvasRef}
        width={150}
        height={150}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          borderRadius: '4px',
        }}
      />
      <div style={{ fontSize: '10px', color: '#aabbcc', marginTop: '8px', textAlign: 'center' }}>
        {currentView}
      </div>
    </HolographicPanel>
  )
}
