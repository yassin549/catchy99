import React, { useState } from 'react'
import useSWR from 'swr'
import AdminLayout from '../../../layouts/AdminLayout'
import OrdersTable from '../../../components/admin/OrdersTable'
import GlassCard from '../../../components/GlassCard'
import CircleLoader from '../../../components/CircleLoader'
import {
  FiPackage,
  FiRefreshCw,
  FiSearch,
  FiDollarSign,
  FiTrendingUp,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
} from 'react-icons/fi'
import { Order } from '../../../types'

const fetcher = (url: string) => fetch(url).then(res => res.json())

const AdminOrdersPage = () => {
  const {
    data: orders,
    error,
    mutate,
    isLoading,
  } = useSWR<Order[]>('/api/orders', fetcher)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      mutate()
    } catch (err) {
      console.error('Failed to update order status', err)
    }
  }

  const filteredOrders = orders
    ? orders
        .filter(
          order => statusFilter === 'all' || order.status === statusFilter
        )
        .filter(order => {
          const customerName = order.shippingAddress.fullName || ''
          const orderId = order.id || ''
          return (
            customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            orderId.toLowerCase().includes(searchTerm.toLowerCase())
          )
        })
    : []

  const calculateStats = () => {
    if (!orders)
      return { totalRevenue: 0, totalOrders: 0, fulfilled: 0, pending: 0 }
    const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0)
    const fulfilled = orders.filter(o => o.status === 'Delivered').length
    const pending = orders.filter(o => o.status === 'Pending').length
    return { totalRevenue, totalOrders: orders.length, fulfilled, pending }
  }

  const stats = calculateStats()

  const statsCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: FiDollarSign,
      color: 'text-green-400',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: FiTrendingUp,
      color: 'text-blue-400',
    },
    {
      title: 'Fulfilled',
      value: stats.fulfilled,
      icon: FiCheckCircle,
      color: 'text-purple-400',
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: FiXCircle,
      color: 'text-yellow-400',
    },
  ]

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className='flex justify-center items-center h-64'>
          <CircleLoader visible={isLoading} />
        </div>
      )
    }

    if (error) {
      return (
        <div className='text-center py-16 bg-red-900/20 rounded-lg'>
          <FiAlertCircle className='w-12 h-12 text-red-400 mx-auto mb-4' />
          <p className='text-red-400'>
            Error loading orders. Please try again.
          </p>
        </div>
      )
    }

    if (!orders || orders.length === 0) {
      return (
        <div className='text-center py-16'>
          <FiSearch className='w-12 h-12 text-gray-400 mx-auto mb-4' />
          <p className='text-gray-400'>No orders found.</p>
        </div>
      )
    }

    return (
      <>
        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          {statsCards.map((card, index) => (
            <GlassCard key={index}>
              <div className='flex items-center'>
                <div className='p-3 bg-gray-700/50 rounded-full mr-4'>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div>
                  <p className='text-sm text-gray-400'>{card.title}</p>
                  <p className='text-2xl font-bold'>{card.value}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Filters and Search */}
        <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
          <div className='flex items-center bg-gray-800/50 rounded-full px-4 py-2'>
            <FiSearch className='text-gray-400 mr-2' />
            <input
              type='text'
              placeholder='Search by customer or ID...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='bg-transparent focus:outline-none text-white w-48'
            />
          </div>
          <div className='flex items-center space-x-4'>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className='bg-gray-800/50 border border-gray-700 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500'
            >
              <option value='all'>All Statuses</option>
              <option value='pending'>Pending</option>
              <option value='processing'>Processing</option>
              <option value='shipped'>Shipped</option>
              <option value='delivered'>Delivered</option>
              <option value='cancelled'>Cancelled</option>
            </select>
            <button
              onClick={() => {
                setStatusFilter('all')
                setSearchTerm('')
              }}
              className='p-2 bg-gray-700/50 rounded-full hover:bg-purple-500/30 transition-colors'
            >
              <FiRefreshCw />
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <GlassCard>
          {filteredOrders.length > 0 ? (
            <OrdersTable
              orders={filteredOrders}
              onStatusChange={handleUpdateStatus}
            />
          ) : (
            <div className='text-center py-16'>
              <FiSearch className='w-12 h-12 text-gray-400 mx-auto mb-4' />
              <p className='text-gray-400'>No orders match your filters.</p>
            </div>
          )}
        </GlassCard>
      </>
    )
  }

  return (
    <AdminLayout>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 flex items-center'>
            <FiPackage className='mr-3' />
            Order Management
          </h1>
        </div>
        {renderContent()}
      </div>
    </AdminLayout>
  )
}

export default AdminOrdersPage
