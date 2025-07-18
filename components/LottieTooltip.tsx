import React, { useState, useRef, ReactNode, useId } from 'react'
import Lottie from 'lottie-react'

interface LottieTooltipProps {
  children: ReactNode
  tooltipText: string
  animationUrl: string
}

const LottieTooltip: React.FC<LottieTooltipProps> = ({
  children,
  tooltipText,
  animationUrl,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [animationData, setAnimationData] = useState<object | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipId = useId()

  const fetchAnimationData = async () => {
    if (animationData) return
    try {
      const response = await fetch(animationUrl)
      const data = await response.json()
      setAnimationData(data)
    } catch (error) {
      console.error('Error fetching Lottie animation:', error)
    }
  }

  const showTooltip = () => {
    fetchAnimationData()
    setIsVisible(true)
  }

  const hideTooltip = () => {
    setIsVisible(false)
  }

  return (
    <div
      className='relative inline-block'
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      ref={triggerRef}
    >
      <div aria-describedby={isVisible ? tooltipId : undefined}>{children}</div>
      {isVisible && (
        <div
          id={tooltipId}
          ref={tooltipRef}
          role='tooltip'
          className='absolute bottom-full mb-2 w-max max-w-xs p-2 bg-gray-800 text-white text-sm rounded-md shadow-lg z-10 flex items-center space-x-2'
        >
          {animationData && (
            <Lottie
              animationData={animationData}
              style={{ width: 24, height: 24 }}
              loop={false}
            />
          )}
          <span>{tooltipText}</span>
        </div>
      )}
    </div>
  )
}

export default LottieTooltip
