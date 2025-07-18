import React from 'react'
import { Order, OrderStatus } from '@/types'
import { FiClock, FiTruck, FiPackage, FiCheck, FiX } from 'react-icons/fi'
import { motion } from 'framer-motion'

interface OrdersTableProps {
  orders: Order[]
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void
}

const statusStyles: { [key in OrderStatus]: string } = {
  Pending:
    'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
  Processing:
    'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
  Shipped:
    'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30',
  Delivered:
    'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
  Cancelled: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
}

const statusIcons: { [key in OrderStatus]: React.ReactNode } = {
  Pending: <FiClock className='w-4 h-4 inline-block mr-2' />,
  Processing: <FiTruck className='w-4 h-4 inline-block mr-2' />,
  Shipped: <FiPackage className='w-4 h-4 inline-block mr-2' />,
  Delivered: <FiCheck className='w-4 h-4 inline-block mr-2' />,
  Cancelled: <FiX className='w-4 h-4 inline-block mr-2' />,
}

const validStatuses: OrderStatus[] = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
]

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  onStatusChange,
}) => {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'text-yellow-400 dark:text-yellow-300'
      case 'Processing':
        return 'text-blue-400 dark:text-blue-300'
      case 'Shipped':
        return 'text-green-400 dark:text-green-300'
      case 'Delivered':
        return 'text-purple-400 dark:text-purple-300'
      case 'Cancelled':
        return 'text-red-400 dark:text-red-300'
      default:
        return 'text-gray-400 dark:text-gray-500'
    }
  }

  const getStatusIcon = (status: OrderStatus) => statusIcons[status]
  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full'>
        <thead className='bg-white/5 dark:bg-gray-800/50 backdrop-blur-sm'>
          <tr>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider'>
              Order ID
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider'>
              Date
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider'>
              Customer
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider'>
              Total
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider'>
              Status
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-white/10 dark:divide-gray-700/50'>
          {orders.map(order => (
            <motion.tr
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className='hover:bg-white/10 dark:hover:bg-gray-800/10 backdrop-blur-sm transition-all duration-200'
            >
              <td className='px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300 dark:text-gray-500'>
                <div className='flex items-center space-x-2'>
                  <div
                    className='w-2 h-2 rounded-full'
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  />
                  {order.id.substring(order.id.length - 8)}
                </div>
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300 dark:text-gray-500'>
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300 dark:text-gray-500'>
                <div className='flex items-center space-x-2'>
                  <div className='w-8 h-8 rounded-full bg-white/5 dark:bg-gray-800/50 flex items-center justify-center'>
                    <span className='text-xs font-semibold'>
                      {order.shippingAddress.fullName[0]}
                    </span>
                  </div>
                  {order.shippingAddress.fullName}
                </div>
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300 dark:text-gray-500'>
                <div className='flex items-center space-x-1'>
                  <span className='text-sm'>${order.total.toFixed(2)}</span>
                  <span className='text-xs text-gray-400 dark:text-gray-500'>
                    ({order.items.length} items)
                  </span>
                </div>
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm'>
                <div className='flex items-center'>
                  {getStatusIcon(order.status)}
                  <select
                    value={order.status}
                    onChange={e =>
                      onStatusChange(order.id, e.target.value as OrderStatus)
                    }
                    className={`p-2 rounded-lg text-xs font-semibold border ${statusStyles[order.status]} appearance-none bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200`}
                  >
                    {validStatuses.map(status => (
                      <option
                        key={status}
                        value={status}
                        className='bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                      >
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OrdersTable
