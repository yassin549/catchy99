import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '@/layouts/AdminLayout'
import ProductForm, { ProductFormData } from '@/components/admin/ProductForm'
import toast from 'react-hot-toast'
import { Product } from '@/types'

const EditProductPage = () => {
  const router = useRouter()
  const { id } = router.query
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`/api/products/${id}`)
          if (!response.ok) {
            throw new Error('Product not found')
          }
          const data = await response.json()
          setProduct(data)
        } catch (err) {
          toast.error('Could not load product data.')
          router.push('/admin/products')
        } finally {
          setLoading(false)
        }
      }
      fetchProduct()
    }
  }, [id, router])

  const handleSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update product')
      }

      toast.success('Product updated successfully!')
      router.push('/admin/products')
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not update product.'
      toast.error(message)
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div>Loading...</div>
      </AdminLayout>
    )
  }

  if (!product) {
    return (
      <AdminLayout>
        <div>Product not found.</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <h1 className='text-3xl font-bold mb-6'>Edit Product</h1>
      <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md'>
        <ProductForm
          onSubmit={handleSubmit}
          defaultValues={product}
          isSubmitting={isSubmitting}
        />
      </div>
    </AdminLayout>
  )
}

export default EditProductPage
