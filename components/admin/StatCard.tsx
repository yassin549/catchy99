import React from 'react'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className='bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/30 flex items-center space-x-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer'>
      <div className='bg-white/30 dark:bg-gray-900/40 p-3 rounded-full text-gray-800 dark:text-white'>
        {icon}
      </div>
      <div>
        <p className='text-sm text-gray-600 dark:text-gray-300 font-medium'>
          {title}
        </p>
        <p className='text-2xl font-bold text-gray-900 dark:text-white'>
          {value}
        </p>
      </div>
    </div>
  )
}

export default StatCard
