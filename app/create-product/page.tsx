'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useProductStore } from '@/store/useProductStore';
import Navbar from '@/components/Navbar';
import { Product } from '@/types/product';

const productSchema = z.object({
  title: z.string().min(3, 'Название должно содержать минимум 3 символа'),
  description: z.string().min(10, 'Описание должно содержать минимум 10 символов'),
  price: z.number().min(0.01, 'Цена должна быть больше 0'),
  brand: z.string().min(2, 'Бренд должен содержать минимум 2 символа'),
  category: z.string().min(2, 'Категория должна содержать минимум 2 символа'),
  thumbnail: z.string().url('Введите корректный URL изображения'),
  rating: z.number().min(0).max(5, 'Рейтинг должен быть от 0 до 5').optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function CreateProductPage() {
  const router = useRouter();
  const { addProduct, products } = useProductStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      rating: 0,
    },
  });

  const onSubmit = (data: ProductFormData) => {
    const newProduct: Product = {
      id: Math.max(...products.map(p => p.id), 0) + 1,
      title: data.title,
      description: data.description,
      price: data.price,
      brand: data.brand,
      category: data.category,
      thumbnail: data.thumbnail,
      rating: data.rating || 0,
      images: [data.thumbnail],
      isLiked: false,
      isCustom: true,
    };

    addProduct(newProduct);
    router.push('/products');
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Создать продукт</h1>
        </div>

        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">Название *</label>
            <input
              type="text"
              className="form-input"
              {...register('title')}
            />
            {errors.title && (
              <div className="form-error">{errors.title.message}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Описание *</label>
            <textarea
              className="form-textarea"
              {...register('description')}
            />
            {errors.description && (
              <div className="form-error">{errors.description.message}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Цена *</label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              {...register('price', { valueAsNumber: true })}
            />
            {errors.price && (
              <div className="form-error">{errors.price.message}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Бренд *</label>
            <input
              type="text"
              className="form-input"
              {...register('brand')}
            />
            {errors.brand && (
              <div className="form-error">{errors.brand.message}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Категория *</label>
            <input
              type="text"
              className="form-input"
              {...register('category')}
            />
            {errors.category && (
              <div className="form-error">{errors.category.message}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">URL изображения *</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://example.com/image.jpg"
              {...register('thumbnail')}
            />
            {errors.thumbnail && (
              <div className="form-error">{errors.thumbnail.message}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Рейтинг (0-5)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              className="form-input"
              {...register('rating', { valueAsNumber: true })}
            />
            {errors.rating && (
              <div className="form-error">{errors.rating.message}</div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => router.back()}
            >
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              Создать продукт
            </button>
          </div>
        </form>
      </div>
    </>
  );
}


