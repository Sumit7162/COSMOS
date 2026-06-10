import React from 'react'
import { Html } from '@react-three/drei'

interface HolographicLabelProps {
  position: [number, number, number]
  text: string
  color?: string
}

export const HolographicLabel: React.FC<HolographicLabelProps> = ({
  position,
  text,
  color = '#88ccff',
}) => {
  return (
    <Html position={position} center distanceFactor={40} occlude={false}>
      <div
        style={{
          color,
          fontFamily: "'Inter', 'SF Mono', monospace",
          fontSize: '12px',
          fontWeight: 500,
          textShadow: `0 0 10px ${color}, 0 0 20px ${color}44`,
          background: `${color}11`,
          backdropFilter: 'blur(4px)',
          padding: '4px 10px',
          borderRadius: '4px',
          border: `1px solid ${color}44`,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
          letterSpacing: '0.5px',
          transform: 'translateY(-20px)',
        }}
      >
        {text}
      </div>
    </Html>
  )
}

interface HolographicPanelProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export const HolographicPanel: React.FC<HolographicPanelProps> = ({
  children,
  className = '',
  style = {},
}) => {
  return (
    <div
      className={`${className}`}
      style={{
        background: 'rgba(8, 12, 32, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(68, 136, 204, 0.2)',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(68, 136, 204, 0.1)',
        padding: '16px',
        color: '#e0e8f0',
        fontFamily: "'Inter', 'SF Pro', sans-serif",
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export const GlassButton: React.FC<{
  onClick: () => void
  children: React.ReactNode
  active?: boolean
  style?: React.CSSProperties
}> = ({ onClick, children, active = false, style = {} }) => {
  return (
    <button
      onClick={onClick}
      style={{
        background: active
          ? 'rgba(68, 136, 204, 0.2)'
          : 'rgba(255, 255, 255, 0.05)',
        border: `1px solid ${
          active ? 'rgba(68, 136, 204, 0.4)' : 'rgba(255, 255, 255, 0.1)'
        }`,
        borderRadius: '8px',
        color: active ? '#88ccff' : '#8899aa',
        cursor: 'pointer',
        padding: '8px 12px',
        fontFamily: "'Inter', sans-serif",
        fontSize: '12px',
        fontWeight: 500,
        transition: 'all 0.2s ease',
        backdropFilter: 'blur(10px)',
        letterSpacing: '0.5px',
        textTransform: 'uppercase' as const,
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = active
          ? 'rgba(68, 136, 204, 0.3)'
          : 'rgba(255, 255, 255, 0.1)'
        e.currentTarget.style.borderColor = active
          ? 'rgba(68, 136, 204, 0.6)'
          : 'rgba(255, 255, 255, 0.2)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = active
          ? 'rgba(68, 136, 204, 0.2)'
          : 'rgba(255, 255, 255, 0.05)'
        e.currentTarget.style.borderColor = active
          ? 'rgba(68, 136, 204, 0.4)'
          : 'rgba(255, 255, 255, 0.1)'
      }}
    >
      {children}
    </button>
  )
}
