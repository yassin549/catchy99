import React, { useState } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '@/layouts/AdminLayout'
import ProductForm, { ProductFormData } from '@/components/admin/ProductForm'
import toast from 'react-hot-toast'

const NewProductPage = () => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    const toastId = toast.loading('Creating product...');

    try {
      const formData = new FormData();
      
      // Append all text fields
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', String(data.price));
      formData.append('stock', String(data.stock));
      
      formData.append('category', data.category); 

      // Append the image file
      const imageFile = (data.image as FileList)[0];
      if (imageFile) {
        formData.append('image', imageFile);
      } else {
        // This should be caught by form validation, but as a safeguard:
        throw new Error('Product image is required.');
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        // Do NOT set Content-Type header, the browser does it automatically for multipart/form-data
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }

      toast.success('Product created successfully!', { id: toastId });
      router.push('/admin/products');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not create product.';
      toast.error(message, { id: toastId });
      setIsSubmitting(false);
    }
  };

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
