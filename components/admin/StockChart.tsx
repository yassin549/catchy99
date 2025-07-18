import React from 'react'
import { useRouter } from 'next/router'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface StockData {
  id: string
  name: string
  stock: number
}

interface StockChartProps {
  data: StockData[]
}

const StockChart: React.FC<StockChartProps> = ({ data }) => {
  const router = useRouter()

  const handleBarClick = (data: StockData) => {
    if (data && data.id) {
      router.push(`/admin/products/edit/${data.id}`)
    }
  }

  return (
    <div className='h-96 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/30'>
      <h3 className='text-xl font-semibold mb-4 text-gray-800 dark:text-white'>
        Current Stock Levels
      </h3>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id='colorStock' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#3b82f6' stopOpacity={0.9} />
              <stop offset='95%' stopColor='#3b82f6' stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray='3 3'
            stroke='rgba(107, 114, 128, 0.2)'
          />
          <XAxis
            dataKey='name'
            tick={{ fill: 'currentColor' }}
            className='text-xs text-gray-700 dark:text-gray-300'
          />
          <YAxis
            tick={{ fill: 'currentColor' }}
            className='text-xs text-gray-700 dark:text-gray-300'
          />
          <Tooltip
            cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
            contentStyle={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '0.5rem',
              boxShadow:
                '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              color: '#333',
            }}
            labelStyle={{ fontWeight: 'bold' }}
          />
          <Legend
            wrapperStyle={{ color: 'currentColor' }}
            className='text-gray-700 dark:text-gray-300'
          />
          <Bar
            dataKey='stock'
            fill='url(#colorStock)'
            radius={[4, 4, 0, 0]}
            onClick={handleBarClick}
            cursor='pointer'
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default StockChart
