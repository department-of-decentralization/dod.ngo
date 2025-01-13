'use client'
import React, { useEffect, useRef } from 'react'

interface ScrollableProps {
  children: React.ReactNode
  onScrollComplete?: () => void
  className?: string
}

const Scrollable: React.FC<ScrollableProps> = ({ children, onScrollComplete, className }) => {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Constants for scaling and translation
    const MIN_SCALE = 0.4
    const MAX_SCALE = 1
    const SCALE_DOMAIN = MAX_SCALE - MIN_SCALE
    let scale = MAX_SCALE

    // Calculate maximum translation values
    const elementWidth = element.offsetWidth
    const elementHeight = element.offsetHeight
    const MAX_TRANSLATE_X = window.innerWidth / 2 - elementWidth / 2
    const MAX_TRANSLATE_Y = window.innerHeight / 2 - elementHeight / 2
    const MIN_TRANSLATE_X = 0
    const MIN_TRANSLATE_Y = 0
    const TRANSLATE_DOMAIN_Y = MAX_TRANSLATE_Y - MIN_TRANSLATE_Y
    const TRANSLATE_DOMAIN_X = MAX_TRANSLATE_X - MIN_TRANSLATE_X

    let translateX = MAX_TRANSLATE_X
    let translateY = MAX_TRANSLATE_Y

    // Set initial position
    element.style.transform = `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`

    const onMouseWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = -e.deltaY

      const scaleDelta = (delta * SCALE_DOMAIN) / TRANSLATE_DOMAIN_X
      const translateXDelta = delta
      const translateYDelta = (delta / TRANSLATE_DOMAIN_X) * TRANSLATE_DOMAIN_Y

      if (scaleDelta > 0) {
        scale = Math.min(MAX_SCALE, scale + scaleDelta)
        translateX = Math.min(translateX + translateXDelta, MAX_TRANSLATE_X)
        translateY = Math.min(translateY + translateYDelta, MAX_TRANSLATE_Y)
      } else {
        scale = Math.max(MIN_SCALE, scale + scaleDelta)
        translateX = Math.max(translateX + translateXDelta, MIN_TRANSLATE_X)
        translateY = Math.max(translateY + translateYDelta, MIN_TRANSLATE_Y)
      }

      element.style.transform = `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`

      // Call onScrollComplete when element reaches the corner
      if (translateX === 0 && onScrollComplete) {
        onScrollComplete()
      }
    }

    window.addEventListener('wheel', onMouseWheel, { passive: false })
    return () => window.removeEventListener('wheel', onMouseWheel)
  }, [onScrollComplete])

  return (
    <div ref={elementRef} className={`fixed origin-center ${className}`}>
      {children}
    </div>
  )
}

export default Scrollable
