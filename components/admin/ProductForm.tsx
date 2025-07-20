import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Product } from '@/types'

// Define the validation schema using Yup
const schema = yup.object().shape({
  name: yup.string().required('Product name is required'),
  description: yup.string().required('Description is required'),
  category: yup.string().required('Category is required'),
  price: yup
    .number()
    .typeError('Price must be a number')
    .positive('Price must be positive')
    .required('Price is required'),
  stock: yup
    .number()
    .typeError('Stock must be a number')
    .integer('Stock must be an integer')
    .min(0, 'Stock cannot be negative')
    .required('Stock is required'),
  image: yup
    .mixed()
    .test('required', 'Image is required', (value) => {
      return value && value.length > 0;
    })
    .test('fileSize', 'The file is too large', (value) => {
        return value && value[0] && value[0].size <= 1024 * 1024 * 10; // 10MB
    }),
})

// Define the form data structure based on the schema
export type ProductFormData = yup.InferType<typeof schema>;

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => void
  defaultValues?: Partial<Product>
  isSubmitting: boolean
}

const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  defaultValues,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  })

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600'
  const errorClass = 'text-red-500 text-sm mt-1'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div>
        <label htmlFor='name' className='block text-sm font-medium'>
          Name
        </label>
        <input id='name' {...register('name')} className={inputClass} />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor='description' className='block text-sm font-medium'>
          Description
        </label>
        <textarea
          id='description'
          {...register('description')}
          className={inputClass}
          rows={4}
        ></textarea>
        {errors.description && (
          <p className={errorClass}>{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor='category' className='block text-sm font-medium'>
          Category
        </label>
        <input id='category' {...register('category')} className={inputClass} />
        {errors.category && (
          <p className={errorClass}>{errors.category.message}</p>
        )}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label htmlFor='price' className='block text-sm font-medium'>
            Price
          </label>
          <input
            id='price'
            type='number'
            step='0.01'
            {...register('price')}
            className={inputClass}
          />
          {errors.price && <p className={errorClass}>{errors.price.message}</p>}
        </div>
        <div>
          <label htmlFor='stock' className='block text-sm font-medium'>
            Stock
          </label>
          <input
            id='stock'
            type='number'
            {...register('stock')}
            className={inputClass}
          />
          {errors.stock && <p className={errorClass}>{errors.stock.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor='image' className='block text-sm font-medium'>
          Product Image
        </label>
        <input id='image' type='file' {...register('image')} className={`${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`} />
        {errors.image && <p className={errorClass}>{String(errors.image.message)}</p>}
      </div>

      <div className='flex justify-end'>
        <button
          type='submit'
          disabled={isSubmitting}
          className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors'
        >
          {isSubmitting ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
  )
}

export default ProductForm
