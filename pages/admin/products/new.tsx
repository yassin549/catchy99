import React, { useState } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '@/layouts/AdminLayout'
import ProductForm, { ProductFormData } from '@/components/admin/ProductForm'
import toast from 'react-hot-toast'

const NewProductPage = () => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create product')
      }

      toast.success('Product created successfully!')
      router.push('/admin/products')
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not create product.'
      toast.error(message)
      setIsSubmitting(false)
    }
  }

  return (
    <AdminLayout>
      <h1 className='text-3xl font-bold mb-6'>Add New Product</h1>
      <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md'>
        <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </AdminLayout>
  )
}

export default NewProductPage
