import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoadingScreenProps {
  onComplete: () => void
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const increment = Math.random() * 5 + 1
        const next = Math.min(prev + increment, 100)
        if (next >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsComplete(true)
            setTimeout(onComplete, 800)
          }, 500)
        }
        return next
      })
    }, 150)

    return () => clearInterval(interval)
  }, [onComplete])

  const messages = [
    'Initializing universe...',
    'Loading star systems...',
    'Generating galaxies...',
    'Calculating orbital mechanics...',
    'Rendering cosmic background...',
    'Calibrating navigation systems...',
    'Ready for exploration',
  ]

  const messageIndex = Math.min(
    Math.floor((progress / 100) * messages.length),
    messages.length - 1
  )

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#05080f',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            fontFamily: "'Inter', 'SF Pro', sans-serif",
          }}
        >
          {/* Animated star particles background */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden',
          }}>
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
                style={{
                  position: 'absolute',
                  width: '2px',
                  height: '2px',
                  background: '#88ccff',
                  borderRadius: '50%',
                  boxShadow: '0 0 4px #88ccff',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>

          {/* Logo / Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}
          >
            <div style={{
              fontSize: '14px',
              color: '#4488aa',
              textTransform: 'uppercase' as const,
              letterSpacing: '8px',
              fontWeight: 300,
              marginBottom: '8px',
            }}>
              Universe Explorer
            </div>
            <div style={{
              fontSize: '48px',
              fontWeight: 200,
              color: '#e0e8f0',
              letterSpacing: '4px',
              marginBottom: '40px',
            }}>
              COSMOS
            </div>
          </motion.div>

          {/* Progress bar */}
          <div style={{
            width: '300px',
            position: 'relative',
            zIndex: 1,
          }}>
            <div style={{
              height: '2px',
              background: 'rgba(68, 136, 204, 0.1)',
              borderRadius: '1px',
              overflow: 'hidden',
              marginBottom: '12px',
            }}>
              <motion.div
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #4488cc, #88ccff, #4488cc)',
                  borderRadius: '1px',
                  width: `${progress}%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{
                fontSize: '11px',
                color: '#446688',
                fontFamily: "'SF Mono', monospace",
              }}>
                {Math.round(progress)}%
              </div>
              <motion.div
                key={messageIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  fontSize: '11px',
                  color: '#6688aa',
                }}
              >
                {messages[messageIndex]}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
