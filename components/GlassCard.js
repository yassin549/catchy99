const GlassCard = ({ children }) => {
  return (
    <div className='bg-glass-light p-8 rounded-lg shadow-lg backdrop-filter backdrop-blur-md border border-glass-medium'>
      {children}
    </div>
  )
}

export default GlassCard
