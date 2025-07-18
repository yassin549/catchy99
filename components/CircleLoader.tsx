interface CircleLoaderProps {
  visible: boolean
}

const CircleLoader = ({ visible }: CircleLoaderProps) => {
  return (
    <div
      className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div className='w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin'></div>
    </div>
  )
}

export default CircleLoader
