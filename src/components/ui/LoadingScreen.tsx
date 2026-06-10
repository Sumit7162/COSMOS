import React, { useEffect } from 'react'
import { motion } from 'framer-motion'

interface LoadingScreenProps {
  onComplete: () => void
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg, #05080f 0%, #0a1e3a 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        style={{
          fontSize: '48px',
          fontWeight: 700,
          color: '#88ccff',
          letterSpacing: '4px',
          marginBottom: '40px',
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ✦ COSMOS ✦
      </motion.div>

      <motion.div
        style={{
          width: '100px',
          height: '100px',
          border: '2px solid rgba(68, 136, 204, 0.2)',
          borderTop: '2px solid #88ccff',
          borderRadius: '50%',
          marginBottom: '40px',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        style={{
          fontSize: '14px',
          color: '#aabbcc',
          letterSpacing: '2px',
          textAlign: 'center',
        }}
        animate={{ opacity: [0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Initializing Universe...
      </motion.div>

      <motion.div
        style={{
          width: '200px',
          height: '2px',
          background: 'rgba(68, 136, 204, 0.1)',
          borderRadius: '1px',
          marginTop: '40px',
          overflow: 'hidden',
        }}
      >
        <motion.div
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #88ccff, #4488cc)',
            width: '100%',
          }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  )
}
