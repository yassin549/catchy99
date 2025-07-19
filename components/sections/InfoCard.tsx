import { motion, Variants } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const InfoCard = ({ title, text, index }: { title: string; text: string; index: number }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

    const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.2,
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      className='bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 shadow-lg'
      variants={cardVariants}
      initial='hidden'
      animate={inView ? 'visible' : 'hidden'}
    >
      <h3 className='text-2xl font-bold text-neon-cyan mb-4'>{title}</h3>
      <p className='text-white/80'>{text}</p>
    </motion.div>
  )
}

export default InfoCard
