import { GlassCard, LottieTooltip } from '../components'
import { ParallaxBanner } from 'react-scroll-parallax'

export default function Home() {
  return (
    <ParallaxBanner
      layers={[
        {
          image:
            'https://images.unsplash.com/photo-1554034483-043b37d8c547?q=80&w=2070&auto=format&fit=crop',
          speed: -20,
        },
      ]}
      className='h-screen'
    >
      <div className='absolute inset-0 flex items-center justify-center'>
        <GlassCard>
          <LottieTooltip
            tooltipText='An innovative e-commerce platform.'
            animationUrl='https://assets10.lottiefiles.com/packages/lf20_g3dzz0wz.json'
          >
            <h1 className='text-4xl font-bold text-black dark:text-white text-shadow-neon-cyan transition-colors duration-500'>
              Liquid-Glass Platform
            </h1>
          </LottieTooltip>
        </GlassCard>
      </div>
    </ParallaxBanner>
  )
}
