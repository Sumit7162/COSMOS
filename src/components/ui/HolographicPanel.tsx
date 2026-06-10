import React from 'react'
import { motion } from 'framer-motion'

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
    <motion.div
      className={className}
      style={{
        background: 'linear-gradient(135deg, rgba(68, 136, 204, 0.1) 0%, rgba(34, 68, 102, 0.05) 100%)',
        border: '1px solid rgba(68, 136, 204, 0.2)',
        borderRadius: '8px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(68, 136, 204, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        ...style,
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
