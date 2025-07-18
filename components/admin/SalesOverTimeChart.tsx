import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { FiLoader, FiAlertCircle } from 'react-icons/fi'

interface SalesData {
  date: string
  total: number
}

interface SalesOverTimeChartProps {
  data: SalesData[] | undefined
  isLoading: boolean
  error: Error | null
}

const SalesOverTimeChart: React.FC<SalesOverTimeChartProps> = ({
  data,
  isLoading,
  error,
}) => {
  if (isLoading)
    return (
      <div className='flex items-center justify-center h-full'>
        <FiLoader className='animate-spin text-2xl' />
      </div>
    )
  if (error)
    return (
      <div className='flex items-center justify-center h-full text-red-500'>
        <FiAlertCircle className='mr-2' /> Failed to load sales data.
      </div>
    )
  if (!data || data.length === 0)
    return (
      <div className='flex items-center justify-center h-full text-gray-500'>
        No sales data available for the last 30 days.
      </div>
    )

  const formattedData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }))

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <LineChart data={formattedData}>
        <CartesianGrid
          strokeDasharray='3 3'
          stroke='rgba(255, 255, 255, 0.1)'
        />
        <XAxis dataKey='date' stroke='#9ca3af' fontSize={12} />
        <YAxis
          stroke='#9ca3af'
          fontSize={12}
          tickFormatter={value => `$${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(31, 41, 55, 0.8)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '0.5rem',
          }}
          labelStyle={{ color: '#d1d5db' }}
        />
        <Legend wrapperStyle={{ fontSize: '14px' }} />
        <Line
          type='monotone'
          dataKey='total'
          name='Sales'
          stroke='#8884d8'
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default SalesOverTimeChart
